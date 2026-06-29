document.addEventListener('DOMContentLoaded', () => {

    // 1. Authentication Check
    if (!localStorage.getItem('loggedInUser')) {
        alert("Please login to view your orders.");
        window.location.href = "login.html";
        return;
    }

    // 2. Fetch Data from Backend
    const ordersContainer = document.getElementById('orders-container');
    
    async function fetchOrders() {
        try {
            const response = await fetch('orders');
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = 'login.html';
                    return;
                }
                throw new Error('Failed to fetch orders');
            }
            const orders = await response.json();
            renderOrders(orders);
        } catch (error) {
            console.error('Error:', error);
            ordersContainer.innerHTML = '<p class="empty-cart-msg">Error loading orders. Please try again later.</p>';
        }
    }

    // 3. Render Orders Helper
    function renderOrders(orders) {
        ordersContainer.innerHTML = ''; // Reset container context
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p class="empty-cart-msg">You have not placed any orders yet.</p>';
            return;
        }

        // Loop traversing orders backwards (most recent first)
        const reversedOrders = [...orders].reverse();
        
        reversedOrders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';

            // Generate items substructure
            let itemsHTML = '';
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="order-item-row">
                        <img src="${item.image}" alt="${item.name}" class="order-item-img">
                        <div class="order-item-info">
                            <strong>${item.name}</strong>
                            <span>Size: ${item.size} | Color: ${item.color} | Qty: ${item.qty}</span>
                        </div>
                    </div>
                `;
            });

            // Map Status Colors explicitly
            let statusBadgeClass = 'badge-placed'; // Default (orange)
            if (order.status === 'Shipped') {
                statusBadgeClass = 'badge-shipped'; // blue
            } else if (order.status === 'Delivered') {
                statusBadgeClass = 'badge-delivered'; // green
            } else if (order.status === 'Cancelled') {
                statusBadgeClass = 'badge-cancelled'; // red
            }

            // Reason Display logic
            let reasonHTML = '';
            if (order.status === 'Cancelled' && order.reason) {
                reasonHTML = `<div class="order-cancel-reason"><strong>Reason:</strong> ${order.reason}</div>`;
            }

            // Build Main Card Structure
            orderCard.innerHTML = `
                <div class="order-header">
                    <div>
                        <span class="order-id">Order ID: #${order.id}</span>
                        <span class="order-date">${order.date}</span>
                    </div>
                    <span class="order-status ${statusBadgeClass}">${order.status}</span>
                </div>
                
                <div class="order-details">
                    <div class="order-items-list">
                        ${itemsHTML}
                    </div>
                    
                    <div class="order-meta">
                        <p><strong>Total Paid:</strong> <span class="order-total-price">₹${order.total}</span></p>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        <p><strong>Shipping to:</strong> ${order.address}</p>
                    </div>
                </div>
                
                ${reasonHTML}

                <div class="order-actions">
                    ${order.status === 'Placed' ? `<button class="btn btn-primary btn-cancel-order" data-id="${order.id}">Cancel Order</button>` : ''}
                </div>
            `;

            ordersContainer.appendChild(orderCard);

            // --- Auto Progression Logic ---
            if (order.status === 'Placed') {
                setTimeout(() => {
                    updateOrderStatus(order.id, "Shipped");
                }, 5000); // 5 seconds
            } else if (order.status === 'Shipped') {
                setTimeout(() => {
                    updateOrderStatus(order.id, "Delivered");
                }, 8000); // 8 seconds
            }
        });

        // Attach Cancel Event Listeners
        const cancelButtons = document.querySelectorAll('.btn-cancel-order');
        cancelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderIdToCancel = e.target.getAttribute('data-id');
                const reason = prompt("Please provide a reason for cancelling this order:");
                if (reason === null) return;
                if (reason.trim() === '') {
                    alert("A reason is required to cancel an order.");
                    return;
                }

                const targetOrderIndex = orders.findIndex(o => String(o.id) === String(orderIdToCancel));
                if (targetOrderIndex > -1 && orders[targetOrderIndex].status === 'Placed') {
                    orders[targetOrderIndex].status = "Cancelled";
                    orders[targetOrderIndex].reason = reason.trim();
                    localStorage.setItem('orders', JSON.stringify(orders));
                    renderOrders();
                }
            });
        });
    }

    // Helper: Update Order Status
    function updateOrderStatus(orderId, newStatus) {
        // We re-fetch fresh from localStorage to avoid stale state
        let currentOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const index = currentOrders.findIndex(o => String(o.id) === String(orderId));
        
        if (index > -1) {
            // Only progress if not cancelled
            if (currentOrders[index].status !== 'Cancelled') {
                // Prevent backward leaps and redundant updates
                if (currentOrders[index].status === 'Placed' && newStatus === 'Shipped') {
                    currentOrders[index].status = newStatus;
                } else if (currentOrders[index].status === 'Shipped' && newStatus === 'Delivered') {
                    currentOrders[index].status = newStatus;
                }
                
                orders = currentOrders; // sync local array
                localStorage.setItem('orders', JSON.stringify(orders));
                renderOrders();
            }
        }
    }

    // Call initially on load
    fetchOrders();
});
