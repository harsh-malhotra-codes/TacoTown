// Home Menu JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize home menu
    initHomeMenu();
});

function initHomeMenu() {
    // Add click handlers for menu items
    const menuItems = document.querySelectorAll('.menu-item-card, .menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Navigate to menu page or open modal
            window.location.href = 'menu.html';
        });
    });

    // Add hover effects
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
}

// Menu data for home page
const homeMenuItems = [
    { name: 'Burger', image: 'img/BURGER.png' },
    { name: 'French Fries', image: 'img/FRIES.png' },
    { name: 'Pasta', image: 'img/PASTA.png' },
    { name: 'Pizza', image: 'img/PIZZA.png' },
    { name: 'Taco', image: 'img/TACO-removebg-preview1.png' },
    { name: 'Mom\'s Special', image: 'img/MOMS.png' },
    { name: 'Sandwich', image: 'img/SANDWICH.png' },
    { name: 'Subway', image: 'img/SUBWAY.png' },
    { name: 'Nachos', image: 'img/NACHOS.png' },
    { name: 'Shake', image: 'img/SHAKE.png' }
];

// Function to populate menu items dynamically
function populateHomeMenu() {
    const menuGrid = document.querySelector('.menu-items-grid');

    if (!menuGrid) return;

    menuGrid.innerHTML = '';

    homeMenuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item-card';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
        `;
        menuGrid.appendChild(menuItem);
    });

    // Re-initialize click handlers
    initHomeMenu();
}

// Call populate function if menu grid exists
if (document.querySelector('.menu-items-grid')) {
    populateHomeMenu();
}
