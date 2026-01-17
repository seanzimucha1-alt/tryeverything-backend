const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Supabase
const supabase = require('./supabase');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS configuration - allow all origins for Expo Go
app.use(cors({
    origin: '*', // In production, you might want to restrict this
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
const authRoute = require('./routes/auth');
const storesRoute = require('./routes/stores');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const deliveriesRoute = require('./routes/deliveries');
const paymentsRoute = require('./routes/payments');
const uploadsRoute = require('./routes/uploads');
const notificationsRoute = require('./routes/notifications');
const teamRoute = require('./routes/team');

app.use('/api/auth', authRoute);
app.use('/api/stores', storesRoute);
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/deliveries', deliveriesRoute);
app.use('/api/payments', paymentsRoute);
app.use('/api/uploads', uploadsRoute);
app.use('/api/notifications', notificationsRoute);
app.use('/api/team', teamRoute);

app.get('/', (req, res) => {
    res.send('Backend API is running');
});

// Error handling middleware
app.use(errorHandler);

// Export for Vercel serverless functions
module.exports = app;

// Start server locally if not in Vercel environment
if (process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT} at http://192.168.254.59:${PORT}`);
        console.log(`Also accessible at http://localhost:${PORT}`);
    });
}