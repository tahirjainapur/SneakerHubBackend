// 1. Array to store cart items
// Check if cart data exists in localStorage
const savedCart = localStorage.getItem('cart');

// If data exists, parse the JSON string back into an array, otherwise initialize an empty array
const cart = savedCart ? JSON.parse(savedCart) : [];

// Select elements from the DOM
// Select the cart element in the navbar to update the count
const cartCountElement = document.getElementById('cart-count');

// --- Authentication & UI Updates ---
async function updateAuthNavbar() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    try {
        console.log("DEBUG: Checking user session at /user");
        const response = await fetch('/user');
        if (!response.ok) {
            console.error("DEBUG: User API failed with status:", response.status);
            return;
        }
        const userData = await response.json();
        console.log("DEBUG: User API response:", userData);
        
        if (userData.loggedIn) {
            // Sync with localStorage for legacy script compatibility
            localStorage.setItem('loggedInUser', JSON.stringify(userData));
            
            // User is logged in, show profile dropdown
            const shortName = userData.name.split(' ')[0];
            
            navAuth.innerHTML = `
                <div class="profile-menu">
                    <button class="profile-btn">Hi, ${shortName} ▼</button>
                    <div class="profile-dropdown">
                        <a href="index.html">My Profile</a>
                        <a href="wishlist.html">Wishlist ❤️</a>
                        <a href="orders.html">My Orders</a>
                        <a href="logout" id="logout-link">Logout</a>
                    </div>
                </div>
            `;
            
            // Add click listener for logout to clear localStorage
            document.getElementById('logout-link').addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
            });
            
            // Update cart count now that we know we are logged in
            updateCartCount(true);
        } else {
            // User not logged in, show default links
            navAuth.innerHTML = `
                <a href="login.html" class="auth-link">Login</a>
                <a href="signup.html" class="auth-link">Sign Up</a>
            `;
            updateCartCount(false);
        }
    } catch (error) {
        console.error('Error fetching user status:', error);
    }
}

// Function to update the cart count display
function updateCartCount(isLoggedIn) {
    if (!cartCountElement) return;
    
    // If no parameter passed, try to detect from localStorage
    if (isLoggedIn === undefined) {
        isLoggedIn = !!localStorage.getItem('loggedInUser');
    }
    
    if (!isLoggedIn) {
        cartCountElement.textContent = `🛒 Cart (0)`;
        return;
    }
    
    // Get latest cart data
    const currentCartRaw = localStorage.getItem('cart');
    const currentCart = currentCartRaw ? JSON.parse(currentCartRaw) : [];
    
    let totalItems = 0;
    currentCart.forEach(item => {
        totalItems += (item.qty || 1);
    });
    cartCountElement.textContent = `🛒 Cart (${totalItems})`;
}

// 3. Event Handling: Redirect to Product Details Page
const viewButtons = document.querySelectorAll('.view-details-btn');
viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const productName = button.getAttribute('data-name');
        const productPrice = button.getAttribute('data-price');
        const productImageElement = productCard.querySelector('img');
        const productImage = productImageElement ? productImageElement.src : '';

        // Navigate to product page and pass details via URL
        const params = new URLSearchParams({
            name: productName,
            price: productPrice,
            image: productImage
        });
        
        window.location.href = `product.html?${params.toString()}`;
    });
});

// Run when script loads
updateAuthNavbar();

// --- Wishlist Logic ---
function initWishlist() {
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    wishlistBtns.forEach(btn => {
        const productCard = btn.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        // Parse the literal price safely
        const productPriceRaw = productCard.querySelector('.price').textContent;
        const productPrice = Number(productPriceRaw.replace(/[^0-9]/g, ''));
        const productImage = productCard.querySelector('img').src;
        
        // Map active state gracefully
        const isWished = wishlist.some(item => item.name === productName);
        if (isWished) {
            btn.classList.add('active');
            btn.textContent = '♥';
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // If they aren't logged in, optional to block: prompt said "similar to real ecommerce"
            if (!localStorage.getItem('loggedInUser')) {
                alert('Please login to use the wishlist.');
                window.location.href = 'login.html';
                return;
            }
            
            wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const index = wishlist.findIndex(item => item.name === productName);
            
            if (index > -1) {
                // Removing
                wishlist.splice(index, 1);
                btn.classList.remove('active');
                btn.textContent = '♡';
                alert('Removed from wishlist');
            } else {
                // Adding
                wishlist.push({
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                btn.classList.add('active');
                btn.textContent = '♥';
                alert('Added to wishlist');
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    });
}

initWishlist();
