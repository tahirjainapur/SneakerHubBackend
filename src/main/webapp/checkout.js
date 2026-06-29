document.addEventListener('DOMContentLoaded', () => {

    // 1. Authentication Check
    if (!localStorage.getItem('loggedInUser')) {
        alert("Please login to proceed to checkout.");
        window.location.href = "login.html";
        return;
    }

    // 2. Data Retrieval
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if cart is valid to even be on this page
    if (cart.length === 0) {
        alert("Your cart is empty. Redirecting to home.");
        window.location.href = "index.html";
        return;
    }

    // 3. UI Elements
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutAlert = document.getElementById('checkout-alert');
    const itemsList = document.getElementById('checkout-items-list');
    const totalElement = document.getElementById('checkout-total');

    // 4. Calculate and Show Total
    let totalPrice = 0;
    
    // Add quick list
    cart.forEach(item => {
        totalPrice += (item.price * item.qty);
        
        const itemDiv = document.createElement('div');
        itemDiv.style.display = "flex";
        itemDiv.style.justifyContent = "space-between";
        itemDiv.style.marginBottom = "8px";
        itemDiv.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <span>₹${item.price * item.qty}</span>
        `;
        itemsList.appendChild(itemDiv);
    });

    totalElement.textContent = `₹${totalPrice}`;

    // Helper: Show alert
    function showFormAlert(message, type = 'error') {
        checkoutAlert.textContent = message;
        checkoutAlert.className = `alert-message alert-${type}`;
        checkoutAlert.style.display = 'block';
        if (type === 'error') {
            setTimeout(() => checkoutAlert.style.display = 'none', 3000);
        }
    }

    // 5. Checkout Submission Handling
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const fullName = document.getElementById('fullName').value.trim();
            const address = document.getElementById('address').value.trim();
            const city = document.getElementById('city').value.trim();
            const pincode = document.getElementById('pincode').value.trim();
            const paymentMethod = document.getElementById('paymentMethod').value;

            // Form validation
            if (!fullName || !address || !city || !pincode || !paymentMethod) {
                showFormAlert("Please fill in all details and select a payment method.");
                return;
            }

            // Create robust order object
            const newOrder = {
                id: Date.now().toString(),
                items: [...cart], // Deep copy of cart payload
                total: totalPrice,
                status: "Placed",
                address: `${fullName}, ${address}, ${city} - ${pincode}`,
                paymentMethod: paymentMethod,
                date: new Date().toLocaleString()
            };

            // Send to Backend
            fetch('orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'id': newOrder.id,
                    'items_json': JSON.stringify(newOrder.items),
                    'total': newOrder.total,
                    'address': newOrder.address,
                    'paymentMethod': newOrder.paymentMethod
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Clear Cart
                    localStorage.setItem('cart', JSON.stringify([]));
                    showFormAlert("Order successfully placed! Redirecting...", 'success');
                    setTimeout(() => {
                        window.location.href = 'orders.html';
                    }, 1000);
                } else {
                    showFormAlert("Failed to place order: " + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFormAlert("A network error occurred. Please try again.");
            });
        });
    }
});
