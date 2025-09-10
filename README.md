# 🌮 Taco Town Cafe - Food Ordering System

A complete food ordering system with admin dashboard, order management, and customer ordering interface.

## Features

### ✅ Customer Ordering System
- Browse menu items by category
- Add items to cart with quantity management
- Customer details collection (name, phone, email, address)
- Order placement and confirmation
- Responsive mobile-friendly interface

### ✅ Admin Dashboard
- Secure login with hardcoded credentials
- View all customer orders in chronological order
- Order details include customer info, items, quantities, and totals
- Real-time order statistics (total orders, revenue, today's orders)
- Search and filter orders
- Clean, professional admin interface

### ✅ Order Management
- Orders saved to in-memory database
- Unique order IDs for tracking
- Complete order history
- Order status tracking
- No external messaging (WhatsApp/Gmail removed)

### ✅ Email Notifications
- **Formspree Integration**: Automatic email notifications for new orders
- **Order Details in Email**: Complete customer info, order items, and totals
- **Real-time Alerts**: Instant email delivery when customers place orders
- **No Setup Required**: Works out-of-the-box with Formspree service

### ✅ Responsive Design
- Dark theme with yellow accents
- Mobile-friendly interface
- Smooth animations and transitions
- Modern UI/UX design

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, JavaScript
- **Database**: In-memory (upgrade to MongoDB/PostgreSQL for production)
- **Authentication**: Hardcoded credentials (production: use JWT/proper auth)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
node server.js
```

Visit `http://localhost:3000` to access the customer ordering website.

### 3. Admin Access

Access the admin dashboard at: `http://localhost:3000/admin.html`

**Admin Credentials:**
- Email: `TacoTownSahilsShop@gmail.com`
- Password: `TacoTownSahilsShop8076158819`

**Note:** These are hardcoded credentials for demonstration. In production, implement proper authentication.

### 4. Email Notifications Setup (Formspree)

The system includes automatic email notifications for new orders using Formspree.

**Current Configuration:**
- Formspree endpoint: `https://formspree.io/f/xeolnlbz`
- Email notifications are sent when customers click "Continue Explore"

**To Use Your Own Formspree Account:**

1. **Create Formspree Account**: Visit [formspree.io](https://formspree.io) and create a free account
2. **Create New Form**: Set up a new form in your Formspree dashboard
3. **Get Form Endpoint**: Copy the endpoint URL (format: `https://formspree.io/f/YOUR_FORM_ID`)
4. **Update Code**: Replace the endpoint in these files:
   - `js/payment.js` (line ~400)
   - `public/js/payment.js` (line ~400)
   - `Frontend/js/payment.js` (line ~400)

**What Gets Sent in Email:**
- Customer name, email, phone, address
- Order ID and total amount
- Complete list of ordered items with quantities
- Order timestamp

**Note:** Formspree offers 50 free submissions per month. Upgrade for higher limits.

## API Endpoints

### POST /admin/login
Admin authentication endpoint.

**Request Body:**
```json
{
  "email": "vermaharsh78898@gmail.com",
  "password": "Jammu@123"
}
```

### GET /admin/orders
Retrieve all orders for admin dashboard.

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "orderId": "ORDER_1234567890",
      "customerData": {
        "name": "John Doe",
        "phone": "9876543210",
        "email": "john@example.com",
        "address": "123 Main St",
        "pincode": "110001"
      },
      "orderItems": [
        {
          "name": "Veg Taco",
          "price": 89,
          "quantity": 2
        }
      ],
      "amount": 178,
      "createdAt": "2025-01-07T12:30:00.000Z"
    }
  ]
}
```

### POST /process-order
Process customer order and save to database.

**Request Body:**
```json
{
  "amount": 250,
  "currency": "INR",
  "customerData": {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main St",
    "pincode": "110001"
  },
  "orderItems": [
    {
      "name": "Veg Taco",
      "price": 89,
      "quantity": 2
    }
  ]
}
```

## File Structure

```
taco-town-cafe/
├── server.js              # Express server with admin authentication & order management
├── admin.html             # Admin dashboard interface
├── js/admin.js            # Admin dashboard functionality
├── css/admin-styles.css   # Admin dashboard styles
├── index.html            # Customer homepage
├── menu.html             # Customer menu page
├── payment.html          # Customer payment/order page
├── css/
│   ├── style.css         # Main customer styles
│   ├── menu-styles.css   # Menu page styles
│   └── payment-styles.css # Payment page styles
├── js/
│   ├── main.js           # Customer homepage functionality
│   ├── payment.js        # Customer payment processing
│   └── menu-data-new.js  # Menu data
├── package.json          # Dependencies
└── README.md            # Documentation
```

## Order Flow

1. **Customer browses menu** and adds items to cart
2. **Proceeds to checkout** with delivery details form
3. **Enters customer information** (name, phone, email, address)
4. **Places order** - order is saved to database
5. **Order confirmation** displayed to customer
6. **Admin can view all orders** in the dashboard

## Admin Dashboard Features

- **Secure Login**: Hardcoded credentials for owner access
- **Order Overview**: Statistics on total orders, revenue, today's orders
- **Order Details**: Complete customer and order information
- **Search Functionality**: Filter orders by customer name or order ID
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Refresh to see new orders

## Database

Currently uses in-memory storage. For production, upgrade to:
- MongoDB with Mongoose
- PostgreSQL with Sequelize
- Firebase Firestore
- Any other preferred database solution

## Support

For issues or questions:
- Check the console for error messages
- Verify all environment variables are set
- Test API endpoints with Postman

## License

This project is for educational purposes. Modify and use as needed.

---

**Happy Coding! 🌮🚀**
