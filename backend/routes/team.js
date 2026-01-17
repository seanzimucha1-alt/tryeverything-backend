const express = require('express');
const supabase = require('../supabase');
const { authenticateToken, requireRole, requireStoreOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all team members (store owner/admin only)
// Returns team members for the store owner's store, or all members if system admin
router.get('/members', authenticateToken, requireStoreOwnerOrAdmin, async (req, res) => {
    try {
        let query = supabase
            .from('profiles')
            .select('id, name, email, role, store_id, created_at')
            .in('role', ['staff', 'deliverer'])
            .order('created_at', { ascending: false });

        // If store owner, only show team members from their store
        // System admin can see all team members
        if (req.user.isStoreOwner && req.user.store_id) {
            query = query.eq('store_id', req.user.store_id);
        }

        const { data: members, error } = await query;

        if (error) throw error;
        res.json(members || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Invite team member (store owner/admin only)
router.post('/invite', authenticateToken, requireStoreOwnerOrAdmin, async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ error: 'Email and role are required' });
        }

        // Validate role - store owners can only invite staff and deliverer
        // System admins can invite admin, staff, or deliverer
        const validRolesForStoreOwner = ['staff', 'deliverer'];
        const validRolesForAdmin = ['admin', 'staff', 'deliverer'];
        const roleLower = role.toLowerCase();
        
        const validRoles = req.user.role === 'admin' ? validRolesForAdmin : validRolesForStoreOwner;
        
        if (!validRoles.includes(roleLower)) {
            return res.status(400).json({ 
                error: `Invalid role. Store owners can only invite: ${validRolesForStoreOwner.join(', ')}` 
            });
        }

        // Get store_id for the invitation (store owner's store or null for admin)
        const storeId = req.user.isStoreOwner ? req.user.store_id : null;

        // Check if user already exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === email);

        if (existingUser) {
            // User exists - update their profile with store_id and role if not already set
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id, role, store_id')
                .eq('id', existingUser.id)
                .single();

            if (existingProfile) {
                // Update profile with store assignment
                const updateData = {};
                if (storeId && !existingProfile.store_id) {
                    updateData.store_id = storeId;
                }
                
                await supabase
                    .from('profiles')
                    .update(updateData)
                    .eq('id', existingUser.id);

                return res.json({ 
                    message: 'User already exists. Profile updated with store assignment.',
                    user: { id: existingUser.id, email: existingUser.email }
                });
            }
        } else {
            // Send invitation email via Supabase Auth invite
            const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
                data: {
                    invited_role: roleLower,
                    invited_store_id: storeId
                }
            });

            if (error) {
                throw error;
            }

            // Update the new user's profile with store_id when they accept invitation
            if (data.user && storeId) {
                await supabase
                    .from('profiles')
                    .update({ store_id: storeId, role: roleLower })
                    .eq('id', data.user.id);
            }
        }

        // Send email notification about invitation
        // This will be enhanced with the email notification system
        res.json({ 
            message: 'Invitation sent successfully',
            storeId: storeId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove team member (store owner/admin only)
router.delete('/remove/:memberId', authenticateToken, requireStoreOwnerOrAdmin, async (req, res) => {
    try {
        const { memberId } = req.params;

        if (!memberId) {
            return res.status(400).json({ error: 'Member ID is required' });
        }

        // Prevent user from removing themselves
        if (memberId === req.user.id) {
            return res.status(400).json({ error: 'Cannot remove yourself' });
        }

        // Get member details before deletion for email notification
        const { data: member, error: memberError } = await supabase
            .from('profiles')
            .select('id, email, role, name, store_id')
            .eq('id', memberId)
            .single();

        if (memberError || !member) {
            return res.status(404).json({ error: 'Team member not found' });
        }

        // Store owners can only remove members from their own store
        // System admins can remove anyone
        if (req.user.isStoreOwner) {
            if (member.store_id !== req.user.store_id) {
                return res.status(403).json({ error: 'You can only remove team members from your own store' });
            }
        }

        // Only allow removal of staff or deliverer roles (store owners can't remove system admins)
        const removableRoles = ['staff', 'deliverer'];
        if (req.user.isStoreOwner && !removableRoles.includes(member.role)) {
            return res.status(403).json({ error: 'Store owners can only remove staff or deliverer roles' });
        }

        // For store owners, we'll just unassign the member from the store (soft remove)
        // For system admins, we can delete the user entirely
        if (req.user.isStoreOwner) {
            // Unassign from store (keep the user account but remove store association)
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ store_id: null })
                .eq('id', memberId);

            if (updateError) throw updateError;

            res.json({ 
                message: 'Team member removed from store successfully',
                removedMember: {
                    id: member.id,
                    email: member.email,
                    role: member.role
                }
            });
        } else {
            // System admin can delete user completely
            const { error: deleteError } = await supabase.auth.admin.deleteUser(memberId);

            if (deleteError) {
                // If soft delete is preferred, update profile instead
                const { error: profileDeleteError } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('id', memberId);

                if (profileDeleteError) throw profileDeleteError;
            }

            res.json({ 
                message: 'Team member removed successfully',
                removedMember: {
                    id: member.id,
                    email: member.email,
                    role: member.role
                }
            });
        }

        // Send email notification about removal
        // This will be enhanced with the email notification system
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
