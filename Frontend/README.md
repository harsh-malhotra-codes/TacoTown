# TacoTown Frontend

This is the frontend for TacoTown, a modern responsive taco delivery website.

## Setup

1. Clone this repository
2. The frontend is static and doesn't require any build process
3. All files are ready for deployment

## Deployment to Netlify

1. Push this code to a GitHub repository
2. Go to https://app.netlify.com/
3. Click "New site from Git"
4. Select your frontend repository
5. Netlify will automatically detect the static files and deploy
6. Your site will be available at `https://your-site-name.netlify.app`

## Configuration

The frontend is configured to communicate with the backend at:
`https://tacotown.cyclic.app/api/orders`

If you need to change the backend URL, update the fetch calls in:
- `js/payment.js` - Order submission
- `admin.html` - Admin dashboard API calls

## File Structure

- `index.html` - Main homepage
- `admin.html` - Admin dashboard
- `payment.html` - Payment page
- `menu.html` - Menu page
- `css/` - Stylesheets
- `js/` - JavaScript files
- `img/` - Images and assets

## Features

- Responsive design
- Interactive menu with cart functionality
- Payment processing
- Admin dashboard for order management
- Real-time order status updates
