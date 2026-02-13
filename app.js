/**
 * Lumina Brew Frontend Application
 */

document.addEventListener('DOMContentLoaded', () => {
    initDB(); // Ensure data exists
    renderMenu('breakfast');
    updateCartUI();
    showSection('home'); // Default view

    // --- Event Listeners ---

    // Category Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // UI Update
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Logic
            const category = e.target.dataset.target;
            renderMenu(category);
        });
    });

    // Mobile Menu
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Cart Toggle
    const cartBtn = document.getElementById('cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartOverlay.classList.add('active');
            updateCartUI();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartOverlay.classList.remove('active');
        });
    }

    // Close cart when clicking outside
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.classList.remove('active');
            }
        });
    }

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) return alert('Your cart is empty!');

        alert('Thank you for your order! It has been sent to the kitchen.');
        clearCart();
        updateCartUI();
        cartOverlay.classList.remove('active');
    });
});

/**
 * Render Menu Grid
 * @param {string} filter 'all' | 'breakfast' | 'lunch' | 'drinks' | 'desserts'
 */
function renderMenu(filter) {
    const products = getProducts();
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    if (filteredProducts.length === 0) {
        container.innerHTML = '<p class="no-items">No items found in this category.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'menu-card tilt-card';
        card.innerHTML = `
            <div class="card-image real-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <button class="add-to-cart-btn" onclick="addToCartHandler('${product.id}')">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>
            <div class="card-info">
                <div class="card-header">
                    <h3>${product.name}</h3>
                    <span class="price">₦${product.price.toLocaleString()}</span>
                </div>
                <p>${product.desc}</p>
            </div>
        `;

        // Add 3D Tilt Effect
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);

        container.appendChild(card);
    });
}

/**
 * Handler for Add to Cart
 */
function addToCartHandler(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
        addToCart(product);
        updateCartUI();

        // Show simplified toast feedback
        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Added';
        btn.classList.add('added');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('added');
        }, 1500);
    }
}

/**
 * Update Cart Drawer UI
 */
function updateCartUI() {
    const cart = getCart();
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.querySelector('.cart-count');

    container.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₦${item.price.toLocaleString()}</p>
                <div class="cart-controls">
                    <button onclick="changeQty('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeItem('${item.id}')"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(itemEl);
    });

    totalEl.textContent = `₦${total.toLocaleString()}`;
    if (countEl) countEl.textContent = count;
}

// Global scope wrappers for inline HTML events
window.addToCartHandler = addToCartHandler;
window.changeQty = (id, delta) => {
    updateCartQuantity(id, delta);
    updateCartUI();
};
window.removeItem = (id) => {
    removeFromCart(id);
    updateCartUI();
};

// Tilt Effect Logic
function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

function resetTilt(e) {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}
