const express = require('express');
const supabase = require('../supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get available deliveries
router.get('/available', authenticateToken, requireRole('deliverer'), async (req, res) => {
    try {
        const { data: deliveries, error } = await supabase
            .from('deliveries')
            .select('*')
            .eq('status', 'available');
        if (error) throw error;
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get deliveries for deliverer
router.get('/', authenticateToken, requireRole('deliverer'), async (req, res) => {
    try {
        const { data: deliveries, error } = await supabase
            .from('deliveries')
            .select('*')
            .eq('deliverer_id', req.user.id)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Accept delivery
router.post('/:id/accept', authenticateToken, requireRole('deliverer'), async (req, res) => {
    try {
        const deliveryId = req.params.id;

        // First, check if deliverer already has an active delivery (accepted or in_progress)
        const { data: activeDeliveries, error: checkError } = await supabase
            .from('deliveries')
            .select('id, status')
            .eq('deliverer_id', req.user.id)
            .in('status', ['accepted', 'in_progress']);

        if (checkError) throw checkError;

        if (activeDeliveries && activeDeliveries.length > 0) {
            return res.status(400).json({ 
                error: 'You already have an active delivery. Please complete it before accepting a new one.',
                activeDeliveryId: activeDeliveries[0].id
            });
        }

        // Check if the delivery is still available and doesn't have a deliverer
        const { data: delivery, error: deliveryError } = await supabase
            .from('deliveries')
            .select('id, status, deliverer_id')
            .eq('id', deliveryId)
            .single();

        if (deliveryError || !delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        if (delivery.status !== 'available') {
            return res.status(400).json({ 
                error: `Delivery is no longer available. Current status: ${delivery.status}` 
            });
        }

        if (delivery.deliverer_id !== null) {
            return res.status(400).json({ 
                error: 'This delivery has already been accepted by another deliverer' 
            });
        }

        // Atomically update delivery: set deliverer_id and change status to 'accepted'
        // This ensures only one deliverer can accept it
        const { data: updatedDelivery, error: updateError } = await supabase
            .from('deliveries')
            .update({
                deliverer_id: req.user.id,
                status: 'accepted',
                updated_at: new Date().toISOString()
            })
            .eq('id', deliveryId)
            .eq('status', 'available')
            .is('deliverer_id', null)
            .select()
            .single();

        if (updateError || !updatedDelivery) {
            // If update fails, delivery was likely accepted by someone else
            return res.status(409).json({ 
                error: 'Delivery could not be accepted. It may have been accepted by another deliverer.' 
            });
        }

        res.json({ 
            message: 'Delivery accepted successfully',
            delivery: updatedDelivery
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete delivery
router.post('/:id/complete', authenticateToken, requireRole('deliverer'), async (req, res) => {
    try {
        const { error } = await supabase
            .from('deliveries')
            .update({ status: 'completed' })
            .eq('id', req.params.id)
            .eq('deliverer_id', req.user.id);
        if (error) throw error;
        res.json({ message: 'Delivery completed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create delivery (staff/admin)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { orderId, pickupAddress, dropoffAddress, earnings, distance, itemsCount, pickupCoords, dropoffCoords } = req.body;
        const newDelivery = {
            order_id: orderId,
            deliverer_id: null,
            pickup_address: pickupAddress,
            dropoff_address: dropoffAddress,
            earnings: parseFloat(earnings),
            distance,
            items_count: itemsCount,
            pickup_coords: pickupCoords,
            dropoff_coords: dropoffCoords,
            status: 'available',
            created_at: new Date().toISOString(),
        };
        const { data, error } = await supabase.from('deliveries').insert(newDelivery).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;