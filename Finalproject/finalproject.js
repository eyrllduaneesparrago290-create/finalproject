// 1. Data Store
const products = [
    { id: 1, name: "Wireless Headphones", price: 99, emoji: "🎧" },
    { id: 2, name: "Smart Watch", price: 199, emoji: "⌚" },
    { id: 3, name: "Mechanical Keyboard", price: 150, emoji: "⌨️" },
    { id: 4, name: "Gaming Mouse", price: 50, emoji: "🖱️" },
    { id: 5, name: "USB-C Hub", price: 40, emoji: "🔌" },
    { id: 6, name: "Desk Lamp", price: 30, emoji: "💡" }
];

// Load cart from LocalStorage or start empty
let cart = JSON.parse(localStorage.getItem('shop_cart')) || [];

// 2. Core Functions
function saveAndRender() {
    localStorage.setItem('shop_cart', JSON.stringify(cart));
    renderProducts();
    renderCart();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
    saveAndRender();
}

function updateQuantity(productId, change) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveAndRender();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveAndRender();
}

function clearCart() {
    cart = [];
    saveAndRender();
}

function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    alert(`Thank you! Total Order: $${calculateTotal()}`);
    clearCart();
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
}

// 3. UI Rendering
function renderProducts() {
    const productList = document.getElementById('products-list');
    productList.innerHTML = products.map(product => {
        const isInCart = cart.some(item => item.id === product.id);
        return `
            <div class="product-card">
                <div class="product-emoji">${product.emoji}</div>
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="add-btn" 
                        onclick="addToCart(${product.id})" 
                        ${isInCart ? 'disabled' : ''}>
                    ${isInCart ? 'Already in Cart' : 'Add to Cart'}
                </button>
            </div>
        `;
    }).join('');
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    const countSpan = document.getElementById('cart-count');

    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countSpan.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        totalSpan.innerText = "0.00";
        return;
    }

    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
                <br>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
            <div>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    totalSpan.innerText = calculateTotal();
}

// Initial Boot
saveAndRender();