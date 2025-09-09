const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Supabase with service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in express.json()
app.use(express.urlencoded({ extended: true })); // Use built-in express.urlencoded()

// Store for orders (in production, use a database)
const orders = new Map();

// Routes

// Save order to Supabase
app.post('/api/orders', async (req, res) => {
    try {
        const {
            orderId,
            customerName,
            customerEmail,
            customerPhone,
            customerPincode,
            customerAddress,
            customerLandmark,
            orderItems,
            totalAmount,
            status = 'confirmed'
        } = req.body;

        if (!orderId || !customerName || !orderItems || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Try with supabaseAdmin first (bypasses RLS)
        let { data, error } = await supabaseAdmin
            .from('orders')
            .insert([
                {
                    order_id: orderId,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                    order_items: orderItems,
                    total_amount: totalAmount,
                    status: status
                }
            ])
            .select();

        // If admin fails, try regular client
        if (error) {
            console.log('Admin insert failed, trying regular client:', error.message);
            ({ data, error } = await supabase
                .from('orders')
                .insert([
                    {
                        order_id: orderId,
                        customer_name: customerName,
                        customer_email: customerEmail,
                        customer_phone: customerPhone,
                        order_items: orderItems,
                        total_amount: totalAmount,
                        status: status
                    }
                ])
                .select());
        }

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to save order'
            });
        }

        console.log('Order saved to Supabase:', data);
        res.json({
            success: true,
            message: 'Order saved successfully',
            data: data
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get all orders from Supabase
app.get('/api/orders', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch orders'
            });
        }

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update order status
app.put('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status: status })
            .eq('order_id', orderId)
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update order'
            });
        }

        res.json({
            success: true,
            message: 'Order updated successfully',
            data: data
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Delete order
app.delete('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('order_id', orderId);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete order'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
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
