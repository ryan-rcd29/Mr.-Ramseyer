let cart = [];
    let shippingCost = 8;
    let shippingDistance = 0;

    // Tarifs de livraison basés sur la distance
    const SHIPPING_RATES = {
        base: 2,        // Tarif de base en €
        perKm: 0.05     // Prix par km en €
    };

    function toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    function addToCart(productName, price) {
        const quantityInput = event.target.parentElement.querySelector('.quantity');
        const quantity = parseInt(quantityInput.value) || 1;
        
        const existingProduct = cart.find(item => item.name === productName);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({
                name: productName,
                price: price,
                quantity: quantity
            });
        }
        
        updateCartUI();
        showNotification('Article ajouté au panier!');
    }

    function updateCartUI() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
            cartCount.textContent = '0';
            document.getElementById('cart-subtotal').textContent = '0€';
            return;
        }

        let html = '<div class="cart-list">';
        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-details">
                            <input type="number" min="1" max="10" value="${item.quantity}" 
                                   onchange="updateQuantity(${index}, this.value)" class="item-qty">
                            x ${item.price}€
                        </div>
                    </div>
                    <div class="item-total">${itemTotal}€</div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                </div>
            `;
        });

        html += '</div>';
        cartItems.innerHTML = html;
        cartCount.textContent = cart.length;
        document.getElementById('cart-subtotal').textContent = subtotal + '€';
    }

    function updateQuantity(index, newQuantity) {
        const qty = parseInt(newQuantity);
        if (qty > 0) {
            cart[index].quantity = qty;
        } else {
            removeFromCart(index);
        }
        updateCartUI();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    function filterProducts(category) {
        const products = document.querySelectorAll('.produit-card');
        const buttons = document.querySelectorAll('.filter-btn');
        
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
                setTimeout(() => product.classList.add('show'), 10);
            } else {
                product.style.display = 'none';
                product.classList.remove('show');
            }
        });
    }

    function goToCheckout() {
        if (cart.length === 0) {
            alert('Votre panier est vide!');
            return;
        }
        
        updateCheckoutModal();
        document.getElementById('checkout-modal').classList.add('active');
        toggleCart();
    }

    function updateCheckoutModal() {
        let html = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            html += `
                <div class="summary-item">
                    <span>${item.name}</span>
                    <span>${item.quantity}x</span>
                    <span>${itemTotal}€</span>
                </div>
            `;
        });

        document.getElementById('order-summary').innerHTML = html;
        document.getElementById('modal-subtotal').textContent = subtotal + '€';
        updateCheckoutTotal(subtotal);
    }

    function updateCheckoutTotal(subtotal) {
        const tax = (subtotal + shippingCost) * 0.20;
        const total = subtotal + shippingCost + tax;
        document.getElementById('shipping-cost').textContent = shippingCost + '€';
        document.getElementById('tax-amount').textContent = tax.toFixed(2) + '€';
        document.getElementById('modal-total').textContent = total.toFixed(2) + '€';
    }

    function updateShipping(cost) {
        shippingCost = cost;
        let subtotal = 0;
        cart.forEach(item => subtotal += item.price * item.quantity);
        updateCheckoutTotal(subtotal);
    }

    function calculateShippingByDistance(distance) {
        const numDistance = parseFloat(distance) || 0;
        shippingDistance = numDistance;
        
        if (numDistance === 0) {
            return 0; // Retrait sur place
        }
        
        // Calcul : tarif de base + (distance * prix par km)
        const calculatedCost = SHIPPING_RATES.base + (numDistance * SHIPPING_RATES.perKm);
        shippingCost = calculatedCost;
        
        // Mettre à jour l'affichage si on est dans la modal
        if (document.getElementById('shipping-cost')) {
            let subtotal = 0;
            cart.forEach(item => subtotal += item.price * item.quantity);
            updateCheckoutTotal(subtotal);
        }
        
        return calculatedCost.toFixed(2);
    }

    function updateShippingDisplay() {
        const distanceInput = document.getElementById('shipping-distance');
        if (distanceInput && distanceInput.value) {
            const cost = calculateShippingByDistance(distanceInput.value);
            const label = document.getElementById('shipping-distance-cost');
            if (label) {
                label.textContent = `(${cost}€)`;
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = this.querySelector('input[type="text"]').value;
                const orderNumber = 'CMD' + Math.floor(Math.random() * 100000);
                
                let subtotal = 0;
                cart.forEach(item => subtotal += item.price * item.quantity);
                const tax = (subtotal + shippingCost) * 0.20;
                const total = subtotal + shippingCost + tax;
                
                document.getElementById('customer-name').textContent = name;
                document.getElementById('order-number').textContent = orderNumber;
                document.getElementById('confirmation-total').textContent = total.toFixed(2) + '€';
                
                closeCheckout();
                document.getElementById('confirmation-modal').classList.add('active');
            });
        }
    });

    function closeCheckout() {
        document.getElementById('checkout-modal').classList.remove('active');
    }

    function continueShop() {
        document.getElementById('confirmation-modal').classList.remove('active');
        cart = [];
        updateCartUI();
        window.scrollTo(0, 0);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.getElementById('checkout-modal').classList.remove('active');
            document.getElementById('confirmation-modal').classList.remove('active');
        }
    });
