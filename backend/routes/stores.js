const express = require('express');
const supabase = require('../supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all stores
router.get('/', async (req, res) => {
    try {
        const { data: stores, error } = await supabase.from('stores').select('*');
        if (error) throw error;
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get store by ID
router.get('/:id', async (req, res) => {
    try {
        const { data: store, error } = await supabase
            .from('stores')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error || !store) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create store (authenticated user)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, address, city } = req.body;
        const newStore = {
            name,
            address,
            city,
            owner_id: req.user.id
        };
        const { data, error } = await supabase.from('stores').insert(newStore).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update store (owner or admin)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        // Check if user owns the store or is admin
        const { data: store } = await supabase
            .from('stores')
            .select('owner_id')
            .eq('id', req.params.id)
            .single();

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (store.owner_id !== req.user.id && profile.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updateData = req.body;
        const { error } = await supabase
            .from('stores')
            .update(updateData)
            .eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Store updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete store (owner or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        // Check ownership
        const { data: store } = await supabase
            .from('stores')
            .select('owner_id')
            .eq('id', req.params.id)
            .single();

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (store.owner_id !== req.user.id && profile.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const { error } = await supabase.from('stores').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Store deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;