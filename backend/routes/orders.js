const express = require('express');
const supabase = require('../supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get orders for user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', req.user.id);
        if (error) throw error;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', req.params.id)
            .eq('customer_id', req.user.id)
            .single();
        if (error || !order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Place order
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { items, deliveryDetails, storeId } = req.body;
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder = {
            customer_id: req.user.id,
            items,
            total,
            status: 'pending',
            delivery_details: deliveryDetails,
            store_id: storeId,
            created_at: new Date().toISOString(),
        };
        const { data, error } = await supabase.from('orders').insert(newOrder).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status (admin/staff)
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;