// --- Auth Check ---
// 1. Restrict Cart Page Access
if (!localStorage.getItem('loggedInUser')) {
    alert("Please login to view cart");
    window.location.href = "login.html";
    throw new Error('Not logged in. Stopping execution.');
}

// 2. Fetch Cart Data
// Retrieve cart string from localStorage and convert it back to an array
// If it's empty or null, default to an empty array []
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Select the necessary DOM containers
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartTotalSection = document.getElementById('cart-total-section');

// Function to render the cart onto the page
function renderCart() {
    // Clear out the HTML container first so we don't duplicate items
    cartItemsContainer.innerHTML = '';
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty 😢</p>';
        // Hide the total price section
        if (cartTotalSection) cartTotalSection.style.display = 'none';
        return; // Stop the function here if there's nothing to render
    }

    // Ensure the total section is visible when items exist
    if (cartTotalSection) cartTotalSection.style.display = 'flex';

    let totalPrice = 0;

    // 2. Display Cart Items
    // Loop through each item in the cart array
    cart.forEach((item, index) => {
        // Fallback for older items that were added without a qty property
        if (!item.qty) item.qty = 1;

        // Create a wrapper div for the row
        const cartRow = document.createElement('div');
        cartRow.classList.add('cart-item');

        // Insert the content into the wrapper using innerHTML
        // Add quantity controls layout utilizing Flexbox rules mapped in CSS
        cartRow.innerHTML = `
            <div class="cart-item-wrapper">
                <img src="${item.image || ''}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-variants">Size: ${item.size} | Color: ${item.color}</span>
                    <span class="cart-item-price">₹${item.price}</span>
                </div>
            </div>
            
            <div class="qty-controls">
                <button class="btn-qty btn-minus" data-index="${index}">−</button>
                <span class="qty-number">${item.qty}</span>
                <button class="btn-qty btn-plus" data-index="${index}">+</button>
            </div>
            
            <button class="btn-remove" data-index="${index}">Remove</button>
        `;

        // Add this new row into our page container
        cartItemsContainer.appendChild(cartRow);

        // 5. Total Price Calculation
        // Add the item's price factored by its current quantity to our running total
        totalPrice += (item.price * item.qty);
    });

    // 4. Update the total price display
    cartTotalElement.textContent = `₹${totalPrice}`;

    // --- Attach Event Listeners ---
    
    // 3. Remove Item Event Handlers
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemIndex = parseInt(event.target.getAttribute('data-index'));
            cart.splice(itemIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart(); // Refresh the UI instantly
        });
    });

    // Increase Quantity (+) Event Handlers
    const plusButtons = document.querySelectorAll('.btn-plus');
    plusButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemIndex = parseInt(event.target.getAttribute('data-index'));
            // Increase qty by 1
            cart[itemIndex].qty += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart(); // Re-render the interface
        });
    });

    // Decrease Quantity (−) Event Handlers
    const minusButtons = document.querySelectorAll('.btn-minus');
    minusButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemIndex = parseInt(event.target.getAttribute('data-index'));
            // Decrease qty by 1
            cart[itemIndex].qty -= 1;
            
            // If qty becomes 0, remove the item completely
            if (cart[itemIndex].qty === 0) {
                cart.splice(itemIndex, 1);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart(); // Re-render the interface
        });
    });
}

// Call renderCart immediately when the script loads to populate the page
renderCart();

// --- Authentication & UI Updates ---
function updateAuthNavbar() {
    const navAuth = document.getElementById('nav-auth');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (navAuth && loggedInUser) {
        // User is logged in, show profile dropdown
        const shortName = loggedInUser.name.split(' ')[0];
        
        navAuth.innerHTML = `
            <div class="profile-menu">
                <button class="profile-btn">Hi, ${shortName} ▼</button>
                <div class="profile-dropdown">
                    <a href="#">My Profile</a>
                    <a href="wishlist.html">Wishlist ❤️</a>
                    <a href="orders.html">My Orders</a>
                    <a href="#" id="logout-btn">Logout</a>
                </div>
            </div>
        `;
        
        // Add logout functionality
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            // Remove user from storage
            localStorage.removeItem('loggedInUser');
            // Redirect to homepage
            window.location.href = 'index.html'; 
        });
    }
}

// Run when script loads
updateAuthNavbar();

// --- Checkout / Place Order Logic ---
const btnPlaceOrder = document.getElementById('btn-place-order');
if (btnPlaceOrder) {
    btnPlaceOrder.addEventListener('click', () => {
        // 1. Check if empty
        if (cart.length === 0) {
            alert('Cart is empty. Please add items to proceed.');
            return;
        }

        // 2. Redirect to Realistic Checkout Flow
        window.location.href = 'checkout.html';
    });
}
