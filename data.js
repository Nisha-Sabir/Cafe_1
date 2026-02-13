/**
 * Lumina Brew Data Simulation
 * Handles 'Database' operations using localStorage
 */

const SAMPLE_PRODUCTS = [
    {
        id: '1',
        name: 'Akara Combo',
        price: 1500,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1621257321262-e14434f713c7?q=80&w=800&auto=format&fit=crop',
        desc: 'Golden fried bean cakes served with warm Pap (Ogi).'
    },
    {
        id: '2',
        name: 'Moi Moi Special',
        price: 1200,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1547592180-8b5490a0680d?q=80&w=800&auto=format&fit=crop',
        desc: 'Steamed bean pudding garnished with egg and fish.'
    },
    {
        id: '3',
        name: 'Boiled Yam & Egg',
        price: 1800,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1525351484333-2947117904e0?q=80&w=800&auto=format&fit=crop',
        desc: 'Soft yam served with rich egg and tomato stir-fry.'
    },
    {
        id: '4',
        name: 'Smoky Jollof Rice',
        price: 3500,
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1539136788836-5699e1c74efb?q=80&w=800&auto=format&fit=crop',
        desc: 'The national favorite. Smoky rice with seasoning and chicken.'
    },
    {
        id: '5',
        name: 'Fried Rice Special',
        price: 3800,
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=800&auto=format&fit=crop',
        desc: 'Aromatic rice stir-fried with veggies, liver, and shrimp.'
    },
    {
        id: '6',
        name: 'Pounded Yam & Egusi',
        price: 4500,
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1626509677353-8d070624004e?q=80&w=800&auto=format&fit=crop',
        desc: 'Swallow with rich melon seed soup and assorted meat.'
    },
    {
        id: '7',
        name: 'Chilled Zobo',
        price: 800,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1546171753-97d7d68519e4?q=80&w=800&auto=format&fit=crop',
        desc: 'Healthy hibiscus drink infused with ginger and pineapple.'
    },
    {
        id: '8',
        name: 'Chapman Cocktail',
        price: 1500,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
        desc: 'Fruity, refreshing Nigerian cocktail with cucumber slices.'
    },
    {
        id: '9',
        name: 'Meat Pie',
        price: 900,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1570597282565-dbe7e7488806?q=80&w=800&auto=format&fit=crop',
        desc: 'Savory pastry filled with minced meat and potatoes.'
    },
    {
        id: '10',
        name: 'Puff Puff',
        price: 600,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
        desc: 'Soft, fluffy fried dough balls dusted with sugar.'
    }
];

const DB_KEY = 'lumina_brew_products';
const CART_KEY = 'lumina_brew_cart';

// --- Data Access Items ---

/**
 * Initialize DB if empty
 */
function initDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(SAMPLE_PRODUCTS));
    }
}

/**
 * Get all products
 * @returns {Array} List of product objects
 */
function getProducts() {
    initDB();
    return JSON.parse(localStorage.getItem(DB_KEY));
}

/**
 * Save a product (Update existing or Add new)
 * @param {Object} product 
 */
function saveProduct(product) {
    let products = getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);

    if (existingIndex >= 0) {
        products[existingIndex] = product;
    } else {
        products.push(product);
    }

    localStorage.setItem(DB_KEY, JSON.stringify(products));
}

/**
 * Delete a product by ID
 * @param {string} id 
 */
function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(products));
}

// --- Cart Operations ---

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function addToCart(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
}
