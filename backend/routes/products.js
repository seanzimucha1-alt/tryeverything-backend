const express = require('express');
const supabase = require('../supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const { data: products, error } = await supabase.from('products').select('*');
        if (error) throw error;
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error || !product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add product (store owner)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, price, description, image_url, category, store_id } = req.body;

        // Verify user owns the store or is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        let canAdd = false;
        if (profile.role === 'admin') {
            canAdd = true;
        } else {
            const { data: store } = await supabase
                .from('stores')
                .select('owner_id')
                .eq('id', store_id)
                .single();
            if (store && store.owner_id === req.user.id) {
                canAdd = true;
            }
        }

        if (!canAdd) {
            return res.status(403).json({ error: 'Not authorized to add products to this store' });
        }

        const newProduct = {
            name,
            price: parseFloat(price),
            description,
            image_url,
            category,
            store_id
        };
        const { data, error } = await supabase.from('products').insert(newProduct).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const updateData = req.body;
        const { error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { error } = await supabase.from('products').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;