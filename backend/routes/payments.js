const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const supabase = require('../supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Paynow configuration (add to .env)
// PAYNOW_INTEGRATION_ID=your-integration-id
// PAYNOW_INTEGRATION_KEY=your-integration-key

// PayNow API base URL
const PAYNOW_API_URL = 'https://www.paynow.co.zw/Interface/InitiateTransaction';

// Helper function to generate PayNow hash
function generatePayNowHash(data, integrationKey) {
    const hashString = Object.keys(data)
        .filter(key => key !== 'hash')
        .sort()
        .map(key => `${key}=${data[key]}`)
        .join('&');
    
    return crypto.createHash('sha512')
        .update(hashString + integrationKey)
        .digest('hex')
        .toUpperCase();
}

// Initiate payment
router.post('/initiate', authenticateToken, async (req, res) => {
    try {
        const { orderId, amount, returnUrl, resultUrl } = req.body;

        // Get order details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('customer_id', req.user.id)
            .single();

        if (orderError || !order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Validate PayNow credentials
        if (!process.env.PAYNOW_INTEGRATION_ID || !process.env.PAYNOW_INTEGRATION_KEY) {
            return res.status(500).json({ error: 'PayNow integration not configured. Please set PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY in environment variables.' });
        }

        // Prepare PayNow payment request
        const reference = `order-${orderId}`;
        const paynowData = {
            id: process.env.PAYNOW_INTEGRATION_ID,
            reference: reference,
            amount: parseFloat(amount).toFixed(2),
            additionalinfo: `Payment for order ${orderId}`,
            returnurl: returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/return`,
            resulturl: resultUrl || `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/payments/webhook`,
            authemail: req.user.email,
            status: 'Message'
        };

        // Generate hash for PayNow request
        const hash = generatePayNowHash(paynowData, process.env.PAYNOW_INTEGRATION_KEY);
        paynowData.hash = hash;

        // Convert to form-encoded format (PayNow expects form data)
        const formData = Object.keys(paynowData)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paynowData[key])}`)
            .join('&');

        // Make API call to PayNow
        let paymentResponse;
        try {
            const response = await axios.post(PAYNOW_API_URL, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Parse PayNow response (format: key=value\nkey=value)
            const responseData = {};
            response.data.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    responseData[key.trim()] = valueParts.join('=').trim();
                }
            });

            // Verify response hash
            const responseHash = responseData.hash;
            delete responseData.hash;
            const expectedHash = generatePayNowHash(responseData, process.env.PAYNOW_INTEGRATION_KEY);

            if (responseHash !== expectedHash) {
                throw new Error('Invalid PayNow response hash. Payment may be compromised.');
            }

            paymentResponse = responseData;

        } catch (error) {
            // If PayNow API fails, log error but still create transaction record
            console.error('PayNow API error:', error.message);
            
            // Fallback: return error or use simulated response in development
            if (process.env.NODE_ENV === 'development') {
                paymentResponse = {
                    pollurl: `https://www.paynow.co.zw/Interface/CheckPayment/?guid=${orderId}`,
                    hash: 'dev-hash',
                    status: 'Ok'
                };
            } else {
                throw new Error(`PayNow payment initiation failed: ${error.message}`);
            }
        }

        // Store payment attempt
        const { data: transaction, error: transError } = await supabase.from('transactions').insert({
            user_id: req.user.id,
            order_id: orderId,
            type: 'payment',
            amount: parseFloat(amount),
            description: `Payment for order ${orderId}`,
            reference: reference,
            status: paymentResponse.status === 'Ok' ? 'pending' : 'failed',
            metadata: { pollurl: paymentResponse.pollurl, paynow_response: paymentResponse }
        }).select().single();

        if (transError) {
            console.error('Transaction creation error:', transError);
        }

        res.json({
            paymentUrl: paymentResponse.pollurl,
            reference: paynowData.reference
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Payment status check
router.get('/status/:reference', authenticateToken, async (req, res) => {
    try {
        const { reference } = req.params;

        // Get transaction from database
        const { data: transaction, error: transError } = await supabase
            .from('transactions')
            .select('*')
            .eq('reference', reference)
            .eq('user_id', req.user.id)
            .single();

        if (transError || !transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Get pollurl from transaction metadata
        const pollurl = transaction.metadata?.pollurl || transaction.metadata?.pollurl;

        if (!pollurl) {
            return res.json({ 
                status: transaction.status || 'pending',
                reference: reference
            });
        }

        // Poll PayNow for payment status
        try {
            const response = await axios.get(pollurl);
            
            // Parse PayNow response
            const responseData = {};
            response.data.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    responseData[key.trim()] = valueParts.join('=').trim();
                }
            });

            const paynowStatus = responseData.status || transaction.status;
            
            // Update transaction status based on PayNow response
            let newStatus = transaction.status;
            if (paynowStatus === 'Paid') {
                newStatus = 'completed';
                // Update order status to paid/processing
                await supabase
                    .from('orders')
                    .update({ status: 'processing' })
                    .eq('id', transaction.order_id);
            } else if (paynowStatus === 'Cancelled' || paynowStatus === 'Error') {
                newStatus = 'failed';
            }

            // Update transaction if status changed
            if (newStatus !== transaction.status) {
                await supabase
                    .from('transactions')
                    .update({ 
                        status: newStatus,
                        metadata: { ...transaction.metadata, last_poll: new Date().toISOString(), paynow_status: paynowStatus }
                    })
                    .eq('id', transaction.id);
            }

            res.json({ 
                status: newStatus,
                paynowStatus: paynowStatus,
                reference: reference
            });

        } catch (pollError) {
            // If polling fails, return current transaction status
            console.error('PayNow polling error:', pollError.message);
            res.json({ 
                status: transaction.status || 'pending',
                reference: reference
            });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Payment webhook (for PayNow to call back)
router.post('/webhook', async (req, res) => {
    try {
        // Parse PayNow webhook data (can be form-encoded or query params)
        const webhookData = req.body || req.query;

        // Verify webhook hash
        const receivedHash = webhookData.hash;
        const dataToVerify = { ...webhookData };
        delete dataToVerify.hash;
        const expectedHash = generatePayNowHash(dataToVerify, process.env.PAYNOW_INTEGRATION_KEY);

        if (receivedHash !== expectedHash) {
            return res.status(400).json({ error: 'Invalid webhook hash' });
        }

        // Update transaction based on webhook
        const reference = webhookData.reference;
        const paynowStatus = webhookData.status;

        let transactionStatus = 'pending';
        if (paynowStatus === 'Paid') {
            transactionStatus = 'completed';
        } else if (paynowStatus === 'Cancelled' || paynowStatus === 'Error') {
            transactionStatus = 'failed';
        }

        // Update transaction
        const { data: transaction } = await supabase
            .from('transactions')
            .select('*')
            .eq('reference', reference)
            .single();

        if (transaction) {
            await supabase
                .from('transactions')
                .update({ 
                    status: transactionStatus,
                    metadata: { ...transaction.metadata, webhook_received: new Date().toISOString(), paynow_status: paynowStatus }
                })
                .eq('id', transaction.id);

            // Update order if paid
            if (transactionStatus === 'completed' && transaction.order_id) {
                await supabase
                    .from('orders')
                    .update({ status: 'processing' })
                    .eq('id', transaction.order_id);
            }
        }

        res.status(200).send('OK');

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;