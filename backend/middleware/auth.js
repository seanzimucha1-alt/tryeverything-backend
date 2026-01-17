const supabase = require('../supabase');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            throw error;
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

const requireRole = (role) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        try {
            // Get user profile from database to check role
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', req.user.id)
                .single();

            if (error || !profile || profile.role !== role) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            req.user.role = profile.role;
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Role verification failed' });
        }
    };
};

// Middleware to check if user is store owner or admin
const requireStoreOwnerOrAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        // Get user profile to check role and store
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, store_id')
            .eq('id', req.user.id)
            .single();

        if (error || !profile) {
            return res.status(403).json({ error: 'Profile not found' });
        }

        // Check if user is system admin
        if (profile.role === 'admin') {
            req.user.role = profile.role;
            req.user.store_id = profile.store_id;
            return next();
        }

        // Check if user is a store owner
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id, owner_id')
            .eq('owner_id', req.user.id)
            .maybeSingle();

        if (storeError) {
            return res.status(500).json({ error: 'Store verification failed' });
        }

        if (store) {
            req.user.role = profile.role;
            req.user.store_id = store.id;
            req.user.isStoreOwner = true;
            return next();
        }

        return res.status(403).json({ error: 'You must be a store owner or admin to manage team members' });
    } catch (error) {
        return res.status(500).json({ error: 'Authorization check failed' });
    }
};

module.exports = { authenticateToken, requireRole, requireStoreOwnerOrAdmin };