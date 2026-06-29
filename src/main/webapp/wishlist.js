document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Check
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert("Please login to view your wishlist");
        window.location.href = "login.html";
        return;
    }

    const navAuth = document.getElementById('nav-auth');
    if (navAuth) {
        const shortName = loggedInUser.name.split(' ')[0];
        navAuth.innerHTML = `
            <div class="profile-menu">
                <button class="profile-btn">Hi, ${shortName} ▼</button>
                <div class="profile-dropdown">
                    <a href="#">My Profile</a>
                    <a href="wishlist.html">Wishlist ❤️</a>
                    <a href="#">My Orders</a>
                    <a href="#" id="logout-btn">Logout</a>
                </div>
            </div>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html'; 
        });
    }

    // Synchronize Cart Count
    const cartCountElement = document.getElementById('cart-count');
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalItems = 0;
        cart.forEach(item => {
            if (!item.qty) item.qty = 1;
            totalItems += item.qty;
        });
        if (cartCountElement) {
            cartCountElement.textContent = `🛒 Cart (${totalItems})`;
        }
    }
    updateCartCount();

    // Render Wishlist
    const wishlistGrid = document.getElementById('wishlist-grid');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    function renderWishlist() {
        wishlistGrid.innerHTML = '';
        
        if (wishlist.length === 0) {
            wishlistGrid.innerHTML = '<div class="empty-state-msg">Your wishlist is currently empty 😢</div>';
            return;
        }

        wishlist.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('wishlist-item');
            
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-info">
                    <span class="wishlist-item-name">${item.name}</span>
                    <span class="wishlist-item-price">₹${item.price}</span>
                </div>
                <button class="btn-remove-wishlist" data-index="${index}">Remove</button>
            `;
            
            wishlistGrid.appendChild(card);
        });

        // Attach listeners to newly minted buttons
        const removeBtns = document.querySelectorAll('.btn-remove-wishlist');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = parseInt(e.target.getAttribute('data-index'));
                wishlist.splice(itemIndex, 1);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                renderWishlist(); // Re-render instantly
            });
        });
    }

    renderWishlist();

});
