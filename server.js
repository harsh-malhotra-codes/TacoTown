const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in express.json()
app.use(express.urlencoded({ extended: true })); // Use built-in express.urlencoded()

// Store for orders (in production, use a database)
const orders = new Map();



// Admin credentials
const ADMIN_EMAIL = 'TacoTownSahilsShop@gmail.com';
const ADMIN_PASSWORD = 'TacoTownSahilsShop8076158819'; // Your simple password for the admin login page

// Routes

// Admin login
app.post('/admin/login', (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        res.json({
            success: true,
            message: 'Login successful',
            redirect: '/admin.html'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Get all orders for admin
app.get('/admin/orders', (req, res) => {
    const ordersArray = Array.from(orders.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Latest first

    res.json({
        success: true,
        orders: ordersArray
    });
});

// Mark order as delivered
app.put('/admin/orders/:orderId/deliver', (req, res) => {
    const { orderId } = req.params;

    if (orders.has(orderId)) {
        const order = orders.get(orderId);
        order.status = 'delivered';
        order.deliveredAt = new Date();
        console.log(`Order ${orderId} marked as delivered`);
        res.json({
            success: true,
            message: 'Order marked as delivered',
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }
});

// Delete order
app.delete('/admin/orders/:orderId', (req, res) => {
    const { orderId } = req.params;

    if (orders.has(orderId)) {
        orders.delete(orderId);
        console.log(`Order ${orderId} deleted`);
        res.json({
            success: true,
            message: 'Order deleted successfully',
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }
});

// Reset all data
app.post('/admin/reset', (req, res) => {
    // Clear all orders
    orders.clear();

    console.log('All orders and data have been reset');
    res.json({
        success: true,
        message: 'All data has been reset successfully',
    });
});



// Contact form submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    console.log(`Contact form message from ${name} (${email}): ${message}`);

    res.json({
        success: true,
        message: 'Message received successfully! We will get back to you soon.'
    });
});

// Process order
app.post('/process-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', customerData, orderItems, paymentMethod = 'ONLINE' } = req.body;

        // Generate order ID
        const orderId = 'ORDER_' + Date.now();

        // Store order details
        orders.set(orderId, {
            orderId: orderId,
            amount: amount,
            currency,
            customerData,
            orderItems,
            paymentMethod,
            status: 'confirmed',
            createdAt: new Date(),
        });



        console.log(`New order received: ${orderId}`);

        res.json({
            success: true,
            orderId: orderId,
            message: 'Order processed successfully!',
        });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process order',
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from the root directory (more robust for Vercel)
app.use(express.static(path.join(__dirname)));

// Explicitly serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// For Vercel deployment - export the app
module.exports = app;

// For local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}
