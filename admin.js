/**
 * Lumina Brew Admin Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Simple password check (Simulation)
    const isAuthenticated = sessionStorage.getItem('lumina_admin_auth');
    if (!isAuthenticated) {
        const password = prompt("Enter Admin Password:");
        if (password === "admin123") {
            sessionStorage.setItem('lumina_admin_auth', 'true');
        } else {
            alert("Incorrect Password");
            window.location.href = "index.html";
            return;
        }
    }

    renderAdminList();

    // Form Submit
    document.getElementById('product-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('product-id').value || Date.now().toString();
        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const category = document.getElementById('category').value;
        const image = document.getElementById('image').value;
        const desc = document.getElementById('desc').value;

        const product = { id, name, price, category, image, desc };

        saveProduct(product);
        resetForm();
        renderAdminList();
        alert('Product Saved Successfully!');
    });

    // Cancel Edit
    document.getElementById('cancel-btn').addEventListener('click', resetForm);
});

function renderAdminList() {
    const products = getProducts();
    const container = document.getElementById('admin-product-list');
    container.innerHTML = '';

    products.forEach(p => {
        const item = document.createElement('div');
        item.className = 'product-list-item';
        item.innerHTML = `
            <div class="item-info">
                <img src="${p.image}" alt="${p.name}">
                <div>
                    <h4>${p.name}</h4>
                    <small>₦${p.price}</small>
                </div>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editProduct('${p.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteProductHandler('${p.id}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(item);
    });
}

function editProduct(id) {
    const products = getProducts();
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById('product-id').value = p.id;
    document.getElementById('name').value = p.name;
    document.getElementById('price').value = p.price;
    document.getElementById('category').value = p.category;
    document.getElementById('image').value = p.image;
    document.getElementById('desc').value = p.desc;

    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('cancel-btn').style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProductHandler(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        deleteProduct(id);
        renderAdminList();
    }
}

function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-title').textContent = 'Add New Product';
    document.getElementById('cancel-btn').style.display = 'none';
}

function logout() {
    sessionStorage.removeItem('lumina_admin_auth');
    window.location.href = 'index.html';
}

// Expose globals
window.editProduct = editProduct;
window.deleteProductHandler = deleteProductHandler;
window.logout = logout;
