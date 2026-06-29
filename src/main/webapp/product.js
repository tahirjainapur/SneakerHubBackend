document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL Parameters
    const params = new URLSearchParams(window.location.search);
    const productName = params.get('name');
    const productPrice = params.get('price');
    const productImage = params.get('image');

    // 2. DOM Elements
    const detailName = document.getElementById('detail-name');
    const detailPrice = document.getElementById('detail-price');
    const detailImage = document.getElementById('detail-image');
    const btnAddToCart = document.getElementById('detail-add-to-cart');
    const sizeSelect = document.getElementById('detail-size');
    const colorSelect = document.getElementById('detail-color');

    // 3. Populate Data if found
    if (productName && productPrice && productImage) {
        detailName.textContent = productName;
        // Format price gracefully if it's stored as plain number
        if (!isNaN(productPrice)) {
            detailPrice.textContent = `₹${Number(productPrice).toLocaleString()}`;
        } else {
            detailPrice.textContent = `₹${productPrice}`;
        }
        detailImage.src = productImage;
        detailImage.alt = productName;
    } else {
        // Handle missing data
        detailName.textContent = "Product Not Found";
        detailPrice.textContent = "";
        btnAddToCart.disabled = true;
    }

    // 4. Add to Cart Logic
    btnAddToCart.addEventListener('click', () => {
        // Validation: Check if user is logged in
        if (!localStorage.getItem('loggedInUser')) {
            alert('Please login first to add items to the cart.');
            window.location.href = 'login.html';
            return;
        }

        // Validation: Verify Size & Color are selected
        const productSize = sizeSelect.value;
        const productColor = colorSelect.value;

        if (!productSize || !productColor) {
            alert('Please select a Size and Color before adding to cart.');
            return;
        }

        // Get current cart from localStorage
        const savedCart = localStorage.getItem('cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];

        // Clean up price (ensure standard numerical storage)
        const cleanPrice = Number(productPrice.replace(/[^0-9]/g, ''));

        // Check if EXACT variant exists in cart
        const existingItem = cart.find(item => 
            item.name === productName && 
            item.size === productSize && 
            item.color === productColor
        );
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            const newItem = {
                name: productName,
                price: cleanPrice,
                image: productImage,
                size: productSize,
                color: productColor,
                qty: 1
            };
            cart.push(newItem);
        }
        
        // Persist Cart Data
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the cart count UI (using function from script.js)
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }

        // User Feedback
        alert(`Item added to cart: ${productName} (Size: ${productSize}, Color: ${productColor})`);
    });

    // 5. Add to Wishlist Logic
    const btnAddToWishlist = document.getElementById('detail-add-to-wishlist');
    if (btnAddToWishlist) {
        btnAddToWishlist.addEventListener('click', () => {
            if (!localStorage.getItem('loggedInUser')) {
                alert('Please login first to use the wishlist.');
                window.location.href = 'login.html';
                return;
            }

            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const index = wishlist.findIndex(item => item.name === productName);

            if (index > -1) {
                wishlist.splice(index, 1);
                alert('Removed from wishlist');
                btnAddToWishlist.textContent = 'Add to Wishlist ❤️';
            } else {
                wishlist.push({
                    name: productName,
                    price: Number(productPrice.replace(/[^0-9]/g, '')),
                    image: productImage
                });
                alert('Added to wishlist');
                btnAddToWishlist.textContent = 'In Wishlist ♥';
            }
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    }
});
