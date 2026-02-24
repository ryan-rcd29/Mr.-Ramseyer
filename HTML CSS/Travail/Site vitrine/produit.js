 // === VARIABLES GLOBALES ===
        let cart = [];
        let shippingCost = 2;
        let shippingDistance = 0;
        let currentProductName = '';
        let currentQuantity = 1;
        let selectedSize = null;
        let selectedPrice = 0;

        // === GESTION DU PANIER ===
        function toggleCart() {
            const sidebar = document.getElementById('cart-sidebar');
            const overlay = document.getElementById('cart-overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        function addToCart(productName, price) {
            const existingProduct = cart.find(item => item.name === productName);

            if (existingProduct) {
                existingProduct.quantity += currentQuantity;
            } else {
                cart.push({
                    name: productName,
                    price: price,
                    quantity: currentQuantity
                });
            }

            updateCartUI();
            showNotification('Article ajouté au panier!');
        }

        function addDirectProduct(productName, price) {
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

        // === FILTRES PRODUITS ===
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

        // === MODAL SÉLECTION TAILLE ===
        function openSizeModal(productName, button) {
    currentProductName = productName;
    const card = button.closest('.produit-card');
    currentQuantity = parseInt(card.querySelector('.quantity').value) || 1;

    document.getElementById('size-product-name').textContent = productName;
    document.getElementById('size-modal').classList.add('active');
    document.getElementById('size-modal-overlay').classList.add('active');

    // Détermine les prix selon si le produit est "premium"
    // Détermine les prix selon la catégorie
if (premiumProducts.has(productName)) {
    currentSizePrices = { Petite: 8, Moyenne: 10, Grande: 12 };
}
else if (natureProducts.has(productName)) {
    currentSizePrices = { Petite: 9, Moyenne: 12, Grande: 14 };
}
else {
    currentSizePrices = { Petite: 6, Moyenne: 8, Grande: 10 };
}

    // Met à jour l'affichage des prix et les handlers
    const sizeButtons = document.querySelectorAll('.size-btn');

    sizeButtons.forEach(btn => {
        const size = btn.dataset.size; // "Petite", "Moyenne", "Grande"
        const priceSpan = btn.querySelector('.size-price');

        // Affiche le bon prix
        priceSpan.textContent = `${currentSizePrices[size]}€`;

        // Réinitialise les styles (aucune sélection au départ)
        btn.style.background = 'white';
        btn.style.color = 'var(--primary)';

        // Affecte dynamiquement le onclick avec les bons prix
        btn.onclick = () => selectSize(size, currentSizePrices[size]);
    });

    // Réinitialise la sélection interne
    selectedSize = null;
    selectedPrice = 0;
}


        function closeSizeModal() {
            document.getElementById('size-modal').classList.remove('active');
            document.getElementById('size-modal-overlay').classList.remove('active');
        }

        function selectSize(size, price) {
    selectedSize = size;
    selectedPrice = price;

    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.style.background = 'white';
        btn.style.color = 'var(--primary)';
    });

    const selectedButton = Array.from(sizeButtons).find(btn => btn.dataset.size === size);
    if (selectedButton) {
        selectedButton.style.background = 'var(--primary)';
        selectedButton.style.color = 'white';
    }
}

        function confirmSize() {
            if (!selectedSize) {
                alert('Veuillez sélectionner une taille');
                return;
            }

            const itemName = currentProductName + ' (' + selectedSize + ')';
            addToCart(itemName, selectedPrice);
            closeSizeModal();
        }

        // === MODAL COMMANDE ===
        function goToCheckout() {
            if (cart.length === 0) {
                alert('Votre panier est vide!');
                return;
            }

            updateCheckoutModal();
            document.getElementById('checkout-modal').classList.add('active');
            document.getElementById('checkout-overlay').classList.add('active');
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
            const total = subtotal + shippingCost;
            document.getElementById('shipping-cost').textContent = shippingCost + '€';
            document.getElementById('modal-total').textContent = total.toFixed(2) + '€';
        }

        function updateShipping(cost) {
            shippingCost = cost;
            let subtotal = 0;
            cart.forEach(item => subtotal += item.price * item.quantity);
            updateCheckoutTotal(subtotal);
        }

        function closeCheckout() {
            document.getElementById('checkout-modal').classList.remove('active');
            document.getElementById('checkout-overlay').classList.remove('active');
        }

        // === NOTIFICATIONS ===
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

        // === ÉVÉNEMENTS ===
        document.addEventListener('DOMContentLoaded', function () {
            const checkoutForm = document.getElementById('checkout-form');
            if (checkoutForm) {
                checkoutForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const name = this.querySelector('input[type="text"]').value;
                    const orderNumber = 'CMD' + Math.floor(Math.random() * 100000);

                    let subtotal = 0;
                    cart.forEach(item => subtotal += item.price * item.quantity);
                    const total = subtotal + shippingCost;

                    document.getElementById('customer-name').textContent = name;
                    document.getElementById('order-number').textContent = orderNumber;
                    document.getElementById('confirmation-total').textContent = total.toFixed(2) + '€';

                    closeCheckout();
                    document.getElementById('confirmation-modal').classList.add('active');
                    document.getElementById('checkout-overlay').classList.remove('active');
                });
            }
        });
        

        function continueShop() {
            document.getElementById('confirmation-modal').classList.remove('active');
            cart = [];
            updateCartUI();
            window.scrollTo(0, 0);
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeCheckout();
                closeSizeModal();
                document.getElementById('confirmation-modal').classList.remove('active');
            }
        });

        // Bougies premium (de "Délice Gourmand" à "Feu de camp")
const premiumProducts = new Set([
    'Ambiance Cosy - Délice Gourmand',
    'Ambiance Cosy - Tarte au citron meringuée',
    'Ambiance Cosy - Crème Brulée',
    'Ambiance Cosy - Chocolat Chaud',
    'Ambiance Cosy - Tiramisu',
    'Ambiance Cosy - Feu de camp'
]);

// Bougies nature (de "Automne" à "Océan Profond")
const natureProducts = new Set([
    'Ambiance Nature - Automne',
    'Ambiance Nature - Hiver',
    'Ambiance Nature - Jardin Zen',
    'Ambiance Nature - Nuit Lavande',
    'Ambiance Nature - Fête des Fleurs',
    'Ambiance Nature - Nature Foret Mystique',
    'Ambiance Nature - Océan Profond'
]);

// LISTES POUR LES COFFRETS
const cosyList = [
    'Ambiance Cosy - Vanille, Cannelle',
    'Ambiance Cosy - Noix de coco',
    'Ambiance Cosy - Fruit Rouges',
    'Ambiance Cosy - Framboise et Menthe Poivrée',
    'Ambiance Cosy - Clémentine',
    'Ambiance Cosy - Fruit du Dragon'
];

const premiumList = [
    'Ambiance Cosy - Délice Gourmand',
    'Ambiance Cosy - Tarte au citron meringuée',
    'Ambiance Cosy - Crème Brulée',
    'Ambiance Cosy - Chocolat Chaud',
    'Ambiance Cosy - Tiramisu',
    'Ambiance Cosy - Feu de camp'
];

const natureList = [
    'Ambiance Nature - Automne',
    'Ambiance Nature - Hiver',
    'Ambiance Nature - Jardin Zen',
    'Ambiance Nature - Nuit Lavande',
    'Ambiance Nature - Fête des Fleurs',
    'Ambiance Nature - Nature Foret Mystique',
    'Ambiance Nature - Océan Profond'
];
const TouteList = [
    'Ambiance Cosy - Vanille, Cannelle',
    'Ambiance Cosy - Noix de coco',
    'Ambiance Cosy - Fruit Rouges',
    'Ambiance Cosy - Framboise et Menthe Poivrée',
    'Ambiance Cosy - Clémentine',
    'Ambiance Cosy - Fruit du Dragon',
    'Ambiance Cosy - Délice Gourmand',
    'Ambiance Cosy - Tarte au citron meringuée',
    'Ambiance Cosy - Crème Brulée',
    'Ambiance Cosy - Chocolat Chaud',
    'Ambiance Cosy - Tiramisu',
    'Ambiance Cosy - Feu de camp',
    'Ambiance Nature - Automne',
    'Ambiance Nature - Hiver',
    'Ambiance Nature - Jardin Zen',
    'Ambiance Nature - Nuit Lavande',
    'Ambiance Nature - Fête des Fleurs',
    'Ambiance Nature - Nature Foret Mystique',
    'Ambiance Nature - Océan Profond'
];




// Stocke les prix courants selon la sélection (mis à jour à l'ouverture du modal)
// Fonction centrale - renvoie les prix selon le produit
function getPriceByProduct(productName) {

    // Premium
    if (premiumProducts.has(productName)) {
        return { Petite: 8, Moyenne: 10, Grande: 12, range: "8€ - 12€" };
    }

    // Nature (de Automne à Océan Profond)
    if (natureProducts.has(productName)) {
        return { Petite: 9, Moyenne: 12, Grande: 14, range: "9€ - 14€" };
    }

    // Classiques
    return { Petite: 6, Moyenne: 8, Grande: 10, range: "6€ - 10€" };
}

// === VARIABLES COFFRET ===
let currentCoffret = '';
let coffretSelection = [];
const coffretMax = 3;

function getImageForProduct(name) {
    const images = {
        "Ambiance Cosy - Vanille, Cannelle": "Image/Classique/Bougies Vanille et Cannelle.png",
        "Ambiance Cosy - Noix de coco": "Image/Classique/Bougies Noix de coco.png",
        "Ambiance Cosy - Fruit Rouges": "Image/Classique/Bougies Fruit Rouges.png",
        "Ambiance Cosy - Framboise et Menthe Poivrée": "Image/Classique/Bougies Framboise et Menthe Poivrée.png",
        "Ambiance Cosy - Clémentine": "Image/Classique/Bougies Clémentine.png",
        "Ambiance Cosy - Fruit du Dragon": "Image/Classique/Bougies Fruit du Dragon.png",
        "Ambiance Cosy - Délice Gourmand": "Image/Classique/Bougies Délice Gourmand.png",
        "Ambiance Cosy - Tarte au citron meringuée": "Image/Classique/Bougies Tarte au citron meringuée.png",
        "Ambiance Cosy - Crème Brulée": "Image/Classique/Bougies Crème Brulée.png",
        "Ambiance Cosy - Chocolat Chaud": "Image/Classique/Bougies Chocolat Chaud.png",
        "Ambiance Cosy - Tiramisu": "Image/Classique/Bougies Tiramisu.png",

        "Ambiance Nature - Automne": "Image/Nature/Bougies Automne.png",
        "Ambiance Nature - Hiver": "Image/Nature/Bougies Hiver.png",
        "Ambiance Nature - Jardin Zen": "Image/Nature/Bougies Nature Jardin Zen.png",
        "Ambiance Nature - Nuit Lavande": "Image/Nature/Bougies Nuit Lavande.png",
        "Ambiance Nature - Fête des Fleurs": "Image/Nature/Bougies Fête des Fleurs.png",
        "Ambiance Nature - Nature Foret Mystique": "Image/Nature/Bougies Nature Foret Mystique.png",
        "Ambiance Nature - Océan Profond": "Image/Nature/Bougies Océan Profond.png"
    };

    return images[name] || "";
}

// === OUVRIR MODALE COFFRET ===
function openCoffretModal(type) {
    currentCoffret = type;
    coffretSelection = [];

    document.getElementById('coffret-name').textContent = type;
    document.getElementById('coffret-counter').textContent = `0 / ${coffretMax} sélectionnées`;

    const options = document.getElementById('coffret-options');
    options.innerHTML = '';

    let list = [];

    if (type === 'Coffret Cosy') list = cosyList;
    if (type === 'Coffret Nature') list = natureList;
    if (type === 'Coffret Premium') list = premiumList;
    if (type === 'Coffret Toute Catégorie') list = TouteList;

    list.forEach(name => {
        const btn = document.createElement("button");
btn.classList.add("size-btn");

// Image
const img = document.createElement("img");
img.src = getImageForProduct(name); 
img.alt = name;

// Nom du produit sous l'image
const label = document.createElement("p");
label.textContent = name;
label.classList.add("coffret-label");

btn.appendChild(img);
btn.appendChild(label);

btn.onclick = () => toggleCoffretChoice(name, btn);

options.appendChild(btn);

        btn.onclick = () => toggleCoffretChoice(name, btn);

        options.appendChild(btn);
    });

    document.getElementById('coffret-modal').classList.add('active');
    document.getElementById('coffret-overlay').classList.add('active');
}

// === SÉLECTION DE BOUGIES ===
function toggleCoffretChoice(name, element) {
    const index = coffretSelection.indexOf(name);

    if (index === -1) {
        if (coffretSelection.length >= coffretMax) {
            alert('Maximum 3 bougies.');
            return;
        }
        coffretSelection.push(name);
    } else {
        coffretSelection.splice(index, 1);
    }

    // AJOUT ICI 👉 pour activer/désactiver le style "selected"
    element.classList.toggle("selected");

    document.getElementById('coffret-counter').textContent =
        `${coffretSelection.length} / ${coffretMax} sélectionnées`;
}

// === CONFIRMER LE COFFRET ===
function confirmCoffret() {
    if (coffretSelection.length === 0) {
        alert("Sélectionnez au moins une bougie.");
        return;
    }
    else if (coffretSelection.length === 1 ) {
        alert("Sélectionnez au moins deux bougies pour bénéficier du coffret.");
        return;
    }

    const itemName = `${currentCoffret} (${coffretSelection.join(', ')})`;

    // Tarif simple : 10€ + 7.5€/bougie supplémentaire
    let price = 10 + (coffretSelection.length - 1) * 7.50;

    addToCart(itemName, price);
    closeCoffretModal();
}

// === FERMETURE MODALE ===
function closeCoffretModal() {
    document.getElementById('coffret-modal').classList.remove('active');
    document.getElementById('coffret-overlay').classList.remove('active');
}