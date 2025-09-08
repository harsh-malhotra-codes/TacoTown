// Payment Page JavaScript
class PaymentManager {
    constructor() {
        this.customerData = {};
        this.orderData = [];
        this.total = 0;

        this.init();
    }

    init() {
        this.loadCustomerData();
        this.loadOrderData();
        this.displayCustomerDetails();
        this.displayOrderSummary();
        this.setupEventListeners();
    }

    loadCustomerData() {
        try {
            const savedData = localStorage.getItem('tacoCustomerData');
            if (savedData) {
                this.customerData = JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Error loading customer data:', error);
        }
    }

    loadOrderData() {
        try {
            const savedCart = localStorage.getItem('tacoCart');
            if (savedCart) {
                this.orderData = JSON.parse(savedCart);
                this.calculateTotal();
            }
        } catch (error) {
            console.error('Error loading order data:', error);
        }
    }

    calculateTotal() {
        const subtotal = this.orderData.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Free delivery for orders above ₹300
        const deliveryFee = subtotal > 300 ? 0 : 30;
        this.total = subtotal + deliveryFee;
        this.deliveryFee = deliveryFee;
    }

    displayCustomerDetails() {
        // Populate form fields with customer data
        const fields = ['name', 'phone', 'email', 'address', 'landmark', 'pincode'];

        fields.forEach(field => {
            const element = document.getElementById(`edit-customer-${field}`);
            if (element && this.customerData[field]) {
                element.value = this.customerData[field];
            }
        });
    }

    displayOrderSummary() {
        const orderItemsContainer = document.getElementById('order-items');
        if (!orderItemsContainer) return;

        if (this.orderData.length === 0) {
            orderItemsContainer.innerHTML = '<p class="text-center text-muted">No items in cart</p>';
            return;
        }

        const itemsHTML = this.orderData.map(item => `
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-image">${item.image || '🌮'}</div>
                    <div class="order-item-details">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                </div>
                <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        orderItemsContainer.innerHTML = itemsHTML;

        // Update totals
        const subtotal = this.orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = this.deliveryFee || (subtotal > 300 ? 0 : 30);
        const total = subtotal + deliveryFee;

        document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('delivery-fee').textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`;
        document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;
    }

    setupEventListeners() {
        // Confirm order button
        const confirmBtn = document.getElementById('confirm-order-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.handleOrderConfirmation());
        }

        // Continue shopping button
        const continueBtn = document.getElementById('continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.handleContinueShopping());
        }

        // Close modal button
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Payment option selection
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handlePaymentOptionClick(e));
        });
    }

    handlePaymentOptionClick(e) {
        // Remove active and selected classes from all options
        const allOptions = document.querySelectorAll('.payment-option');
        allOptions.forEach(option => {
            option.classList.remove('active');
            option.classList.remove('selected');
        });

        // Add active and selected classes to clicked option
        e.currentTarget.classList.add('active');
        e.currentTarget.classList.add('selected');

        // Update radio button
        const radio = e.currentTarget.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }
    }

    async handleOrderConfirmation() {
        // Get updated customer data from form
        const formData = this.getFormData();

        if (!this.validateForm(formData)) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        // Check if payment method is selected
        const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPayment) {
            this.showNotification('Please select a payment method', 'error');
            return;
        }

        // Update customer data with form values
        this.customerData = formData;

        // Save updated customer data to localStorage
        this.saveCustomerData();

        this.showLoading('Processing your order...');

        const orderData = {
            amount: this.total,
            currency: 'INR',
            customerData: this.customerData,
            orderItems: this.orderData.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            paymentMethod: selectedPayment.value
        };

        try {
            const response = await fetch('http://localhost:3000/process-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                console.log('Order processed successfully:', result.orderId);
                this.hideLoading();
                this.showSuccessModal(result.orderId);
                this.clearCartData();
            } else {
                throw new Error(result.message || 'Failed to process order');
            }
        } catch (error) {
            this.hideLoading();
            console.error('Order processing failed:', error);
            console.error('Error details:', error);
            this.showNotification('Failed to place order. Please try again.', 'error');
        }
    }

    getFormData() {
        return {
            name: document.getElementById('edit-customer-name').value.trim(),
            phone: document.getElementById('edit-customer-phone').value.trim(),
            email: document.getElementById('edit-customer-email').value.trim(),
            address: document.getElementById('edit-customer-address').value.trim(),
            landmark: document.getElementById('edit-customer-landmark').value.trim(),
            pincode: document.getElementById('edit-customer-pincode').value.trim()
        };
    }

    validateForm(formData) {
        // Check required fields
        if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
            return false;
        }

        // Validate phone number (10 digits, starting with 6-9)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            return false;
        }

        // Validate email if provided
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                return false;
            }
        }

        // Validate pincode (6 digits)
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(formData.pincode)) {
            return false;
        }

        // Check if cart has items
        if (this.orderData.length === 0) {
            return false;
        }

        return true;
    }

    saveCustomerData() {
        try {
            localStorage.setItem('tacoCustomerData', JSON.stringify(this.customerData));
        } catch (error) {
            console.error('Error saving customer data:', error);
        }
    }

    validateOrder() {
        // Check if customer data is complete
        const requiredFields = ['name', 'phone', 'email', 'address', 'pincode'];
        for (const field of requiredFields) {
            if (!this.customerData[field] || this.customerData[field].trim() === '') {
                return false;
            }
        }

        // Check if cart has items
        if (this.orderData.length === 0) {
            return false;
        }

        return true;
    }

    showSuccessModal(orderId) {
        const modal = document.getElementById('success-modal');
        const orderIdElement = document.getElementById('order-id');

        if (modal) {
            if (orderIdElement && orderId) {
                orderIdElement.textContent = orderId;
            }

            modal.classList.add('active');
        }
    }

    handleContinueShopping() {
        // Redirect to menu page
        window.location.href = 'menu.html';
    }

    closeModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    clearCartData() {
        localStorage.removeItem('tacoCart');
        localStorage.removeItem('tacoCustomerData');
    }

    showLoading(message = 'Processing...') {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');

        if (loadingOverlay) {
            if (loadingText) {
                loadingText.textContent = message;
            }
            loadingOverlay.classList.add('active');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
}

// Notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 1rem 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(400px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        backdrop-filter: blur(10px);
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        border-left: 4px solid #4CAF50;
    }

    .notification.error {
        border-left: 4px solid #f44336;
    }

    .notification.warning {
        border-left: 4px solid #ff9800;
    }

    .notification.info {
        border-left: 4px solid #2196F3;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #333;
    }

    .notification-content i {
        font-size: 1.2rem;
    }

    .notification.success .notification-content i {
        color: #4CAF50;
    }

    .notification.error .notification-content i {
        color: #f44336;
    }

    .notification.warning .notification-content i {
        color: #ff9800;
    }

    .notification.info .notification-content i {
        color: #2196F3;
    }

    .notification-content span {
        font-weight: 500;
        line-height: 1.4;
    }

    @media (max-width: 768px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-100px);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Add notification styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the payment manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PaymentManager();
});
