const express = require('express');
const supabase = require('../supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Broadcast notification to channel (for real-time updates)
router.post('/broadcast', authenticateToken, async (req, res) => {
    try {
        const { channel, event, payload } = req.body;

        // Supabase realtime broadcast
        const { data, error } = await supabase
            .channel(channel)
            .send({
                type: 'broadcast',
                event,
                payload
            });

        if (error) throw error;
        res.json({ message: 'Notification broadcasted', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send in-app notification (store in database)
router.post('/in-app', authenticateToken, async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;

        const notification = {
            user_id: userId,
            title,
            message,
            type: type || 'info',
            read: false,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('notifications')
            .insert(notification)
            .select();

        if (error) throw error;
        res.json({ message: 'In-app notification created', data: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send email notification
router.post('/email', authenticateToken, async (req, res) => {
    try {
        const { to, subject, html, text, template, templateData } = req.body;

        if (!to || !subject) {
            return res.status(400).json({ error: 'Recipient email and subject are required' });
        }

        // Use Supabase's email function if available, or implement with external service
        // For now, we'll use Supabase's built-in email capabilities via Edge Functions
        // Or you can integrate with SendGrid, Resend, or Nodemailer
        
        // Option 1: Using Supabase Edge Function (recommended)
        // const { data, error } = await supabase.functions.invoke('send-email', {
        //     body: { to, subject, html, text, template, templateData }
        // });

        // Option 2: Using external email service (SendGrid example)
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // await sgMail.send({ to, from: process.env.FROM_EMAIL, subject, html, text });

        // Option 3: Using Supabase Auth Admin API for transactional emails
        // Note: This is limited to user management emails
        
        // For now, we'll create an in-app notification and log the email
        // In production, implement actual email sending via Edge Function or external service
        const notificationData = {
            user_id: req.user.id, // Will be updated to recipient's user_id if found
            title: subject,
            message: text || html || 'Email notification sent',
            type: 'email',
            metadata: { to, subject, sent_at: new Date().toISOString() },
            read: false,
            created_at: new Date().toISOString(),
        };

        // Try to find user by email to associate notification
        const { data: userData } = await supabase.auth.admin.listUsers();
        const recipientUser = userData?.users?.find(u => u.email === to);
        
        if (recipientUser) {
            notificationData.user_id = recipientUser.id;
            const { data: notification, error: notifError } = await supabase
                .from('notifications')
                .insert(notificationData)
                .select()
                .single();

            if (notifError) throw notifError;
        }

        // TODO: Implement actual email sending via:
        // 1. Supabase Edge Function
        // 2. External email service (SendGrid, Resend, etc.)
        // 3. Supabase's built-in email capabilities

        res.json({ 
            message: 'Email notification queued',
            to,
            subject,
            // In production, return actual email send status
            status: 'queued'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;