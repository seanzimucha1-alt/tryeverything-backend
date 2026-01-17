const express = require('express');
const supabase = require('../supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login endpoint (though login is typically handled by frontend with Supabase client)
// This is for getting profile info after login
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error || !profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, role, language } = req.body;
        
        // Prevent role changes - role cannot be modified after initial assignment
        if (role !== undefined) {
            return res.status(403).json({ 
                error: 'Role cannot be changed. Contact an administrator to change your role.' 
            });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (language !== undefined) updateData.language = language;

        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', req.user.id);

        if (error) throw error;
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout (optional - Supabase handles this on frontend)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;