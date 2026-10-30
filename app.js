
// ======================================
// SUSHI ZEN - COMPLETE WEBSITE JAVASCRIPT
// ======================================


// ======================================
// PRODUCT DATA
// ======================================

const products = [
    {
        id: 1,
        name: "California Sushi Roll",
        category: "Sushi Rolls",
        price: 399,
        rating: "★★★★★ 4.9",
        description: "Fresh avocado, cucumber and delicious Japanese rice.",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700",
        tag: "BESTSELLER"
    },
    {
        id: 2,
        name: "Salmon Sushi Roll",
        category: "Sushi Rolls",
        price: 499,
        rating: "★★★★★ 4.8",
        description: "Fresh salmon with perfectly seasoned sushi rice.",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=700",
        tag: "POPULAR"
    },
    {
        id: 3,
        name: "Japanese Nigiri",
        category: "Nigiri",
        price: 449,
        rating: "★★★★★ 4.9",
        description: "Traditional Japanese nigiri with fresh toppings.",
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=700",
        tag: "CHEF'S PICK"
    },
    {
        id: 4,
        name: "Classic Japanese Ramen",
        category: "Ramen",
        price: 349,
        rating: "★★★★★ 4.7",
        description: "Rich Japanese broth with noodles and fresh toppings.",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700",
        tag: "HOT"
    },
    {
        id: 5,
        name: "Crispy Japanese Gyoza",
        category: "Starters",
        price: 249,
        rating: "★★★★★ 4.8",
        description: "Golden crispy dumplings with a delicious filling.",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700",
        tag: "FAVOURITE"
    },
    {
        id: 6,
        name: "Japanese Dessert",
        category: "Desserts",
        price: 199,
        rating: "★★★★★ 4.8",
        description: "A sweet treat to complete your Japanese meal.",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700",
        tag: "SWEET"
    }
];


// ======================================
// CART DATA
// ======================================

function getCart() {
    try {
        return JSON.parse(
            localStorage.getItem("sushi_zen_cart") || "{}"
        );
    } catch (error) {
        return {};
    }
}

function saveCart(cart) {
    localStorage.setItem(
        "sushi_zen_cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


// ======================================
// CART COUNT
// ======================================

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    const cart = getCart();

    const total = Object.values(cart).reduce(
        (sum, quantity) => sum + Number(quantity),
        0
    );

    cartCount.textContent = total;
}


// ======================================
// TOAST MESSAGE
// ======================================

let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


// ======================================
// ADD TO CART
// ======================================

function addToCart(productId) {
    const product = products.find(
        item => item.id === Number(productId)
    );

    if (!product) return;

    const cart = getCart();

    cart[productId] = (Number(cart[productId]) || 0) + 1;

    saveCart(cart);

    showToast(`${product.name} added to your cart!`);
}


// ======================================
// ORDER NOW
// ======================================

function orderNow(productId) {
    const product = products.find(
        item => item.id === Number(productId)
    );

    if (!product) return;

    addToCart(productId);

    window.location.href = "cart.html";
}


// ======================================
// PRODUCT DISPLAY
// HOMEPAGE + MENU PAGE
// ======================================

let selectedCategory = "All";
let searchText = "";

function displayProducts() {
    const homeContainer = document.getElementById("popularProducts");
    const menuContainer = document.getElementById("menuProducts");

    const container = menuContainer || homeContainer;

    if (!container) return;

    let filteredProducts = products.filter(product => {

        const categoryMatch =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchMatch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        return categoryMatch && searchMatch;
    });

    // Homepage: maximum 6 products
    if (container === homeContainer) {
        filteredProducts = filteredProducts.slice(0, 6);
    }

    // Update menu result count
    const resultCount = document.getElementById("menuResultCount");

    if (resultCount) {
        resultCount.textContent =
            `Showing ${filteredProducts.length} delicious dishes`;
    }

    // Empty result
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="menu-empty">
                <h3>No dishes found!</h3>
                <p>Try another search or select a different category.</p>
            </div>
        `;
        return;
    }

    // Render products
    container.innerHTML = filteredProducts.map(product => `
        <article class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/151413/d9b77e?text=Sushi+Zen'"
                >

                <span class="product-tag">
                    ${product.tag}
                </span>

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-rating">
                    ${product.rating}
                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        ₹${product.price}
                    </span>

                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${product.id})">
                        + Add to Cart
                    </button>

                </div>

                <button
                    class="buy-now-btn"
                    onclick="orderNow(${product.id})">
                    Order Now →
                </button>

            </div>

        </article>
    `).join("");
}


// ======================================
// CATEGORY FILTERS
// ======================================

function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            selectedCategory = button.dataset.category || "All";

            displayProducts();
        });
    });
}


// ======================================
// HOMEPAGE CATEGORY CARDS
// REDIRECT TO MENU PAGE
// ======================================

function setupCategoryCards() {
    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach(card => {
        card.addEventListener("click", () => {

            const category = card.dataset.category;

            if (!category) return;

            window.location.href =
                `menu.html?category=${encodeURIComponent(category)}`;

        });
    });
}


// ======================================
// APPLY CATEGORY FROM URL
// MENU PAGE
// ======================================

function applyCategoryFromURL() {
    const menuProducts = document.getElementById("menuProducts");

    if (!menuProducts) return;

    const params = new URLSearchParams(window.location.search);

    const categoryFromURL = params.get("category");

    if (!categoryFromURL) return;

    const filterButtons = document.querySelectorAll(
        ".menu-page-filters .filter-btn"
    );

    const matchingButton = [...filterButtons].find(button => {
        return button.dataset.category === categoryFromURL;
    });

    if (matchingButton) {

        selectedCategory = categoryFromURL;

        filterButtons.forEach(button => {
            button.classList.remove("active");
        });

        matchingButton.classList.add("active");
    }
}


// ======================================
// MENU SEARCH
// ======================================

function setupMenuSearch() {
    const searchInput = document.getElementById("menuSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {

        searchText = searchInput.value.trim().toLowerCase();

        displayProducts();

    });
}


// ======================================
// MOBILE NAVIGATION
// ======================================

function setupMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}


// ======================================
// CART PAGE FUNCTIONALITY
// ======================================

function renderCartPage() {
    const cartContainer = document.getElementById("cartItems");

    if (!cartContainer) return;

    const cart = getCart();

    const cartProducts = Object.entries(cart)
        .map(([id, quantity]) => {

            const product = products.find(
                item => String(item.id) === String(id)
            );

            if (!product || Number(quantity) <= 0) return null;

            return {
                ...product,
                quantity: Number(quantity)
            };

        })
        .filter(Boolean);

    if (cartProducts.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="menu.html" class="continue-btn">EXPLORE MENU</a>
            </div>
        `;

        updateCartSummary(0, 0);
        return;
    }

    cartContainer.innerHTML = cartProducts.map(product => `
        <div class="cart-item" data-id="${product.id}">

            <img
                src="${product.image}"
                alt="${product.name}"
                class="cart-item-image"
                onerror="this.src='https://placehold.co/300x300/151413/d9b77e?text=Sushi+Zen'"
            >

            <div class="cart-item-details">

                <span class="cart-item-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description || ""}</p>

                <div class="cart-item-price">
                    ₹${product.price}
                </div>

                <div class="cart-item-actions">

                    <div class="quantity-control">

                        <button onclick="changeCartQuantity('${product.id}', -1)">−</button>

                        <span>${product.quantity}</span>

                        <button onclick="changeCartQuantity('${product.id}', 1)">+</button>

                    </div>

                    <button
                        class="remove-cart-btn"
                        onclick="removeCartProduct('${product.id}')">
                        Remove
                    </button>

                </div>

            </div>

            <div class="cart-item-total">
                ₹${product.price * product.quantity}
            </div>

        </div>
    `).join("");

    const totalQuantity = cartProducts.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = cartProducts.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    updateCartSummary(totalQuantity, subtotal);
}


// ======================================
// CART SUMMARY
// ======================================

function updateCartSummary(quantity, subtotal) {
    const itemsElement = document.getElementById("summaryItems");
    const subtotalElement = document.getElementById("cartSubtotal");
    const totalElement = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutBtn");

    if (itemsElement) {
        itemsElement.textContent = quantity;
    }

    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal}`;
    }

    if (totalElement) {
        totalElement.textContent = `₹${subtotal}`;
    }

    if (checkoutButton) {
        checkoutButton.style.pointerEvents =
            quantity === 0 ? "none" : "auto";

        checkoutButton.style.opacity =
            quantity === 0 ? "0.5" : "1";
    }
}


// ======================================
// CHANGE CART QUANTITY
// ======================================

function changeCartQuantity(productId, change) {
    const cart = getCart();

    const id = String(productId);

    if (!cart[id]) return;

    cart[id] = Number(cart[id]) + change;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart(cart);

    renderCartPage();
}


// ======================================
// REMOVE CART PRODUCT
// ======================================

function removeCartProduct(productId) {
    const cart = getCart();

    delete cart[String(productId)];

    saveCart(cart);

    renderCartPage();

    showToast("Product removed from cart");
}


// ======================================
// CHECKOUT PAGE
// ======================================

function renderCheckoutPage() {
    const checkoutItems = document.getElementById("checkoutItems");

    if (!checkoutItems) return;

    const cart = getCart();

    const cartProducts = Object.entries(cart)
        .map(([id, quantity]) => {

            const product = products.find(
                item => String(item.id) === String(id)
            );

            if (!product || Number(quantity) <= 0) return null;

            return {
                ...product,
                quantity: Number(quantity)
            };

        })
        .filter(Boolean);

    const form = document.getElementById("checkoutForm");
    const placeOrderBtn = document.getElementById("placeOrderBtn");

    if (cartProducts.length === 0) {

        checkoutItems.innerHTML = `
            <div class="checkout-empty">
                <p>Your cart is empty.</p>
                <a href="menu.html">Explore our menu →</a>
            </div>
        `;

        if (form) {
            form.style.display = "none";
        }

        updateCheckoutSummary(0, 0);
        return;
    }

    checkoutItems.innerHTML = cartProducts.map(product => `
        <div class="checkout-product">

            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.src='https://placehold.co/150x150/151413/d9b77e?text=Sushi'"
            >

            <div class="checkout-product-info">
                <h3>${product.name}</h3>
                <p>Qty: ${product.quantity}</p>
            </div>

            <strong>
                ₹${product.price * product.quantity}
            </strong>

        </div>
    `).join("");

    const totalQuantity = cartProducts.reduce(
        (sum, product) => sum + product.quantity,
        0
    );

    const subtotal = cartProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    updateCheckoutSummary(totalQuantity, subtotal);

    if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
    }
}


// ======================================
// CHECKOUT SUMMARY
// ======================================

function updateCheckoutSummary(quantity, subtotal) {
    const count = document.getElementById("checkoutItemCount");
    const subtotalElement = document.getElementById("checkoutSubtotal");
    const totalElement = document.getElementById("checkoutTotal");

    if (count) {
        count.textContent = quantity;
    }

    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal}`;
    }

    if (totalElement) {
        totalElement.textContent = `₹${subtotal}`;
    }
}


// ======================================
// CHECKOUT FORM
// ======================================

function setupCheckoutForm() {
    const form = document.getElementById("checkoutForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!form.reportValidity()) return;

        const cart = getCart();

        const cartProducts = Object.entries(cart)
            .map(([id, quantity]) => {

                const product = products.find(
                    item => String(item.id) === String(id)
                );

                if (!product || Number(quantity) <= 0) return null;

                return {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    quantity: Number(quantity)
                };

            })
            .filter(Boolean);

        if (cartProducts.length === 0) {
            alert("Your cart is empty. Please add products first.");
            window.location.href = "menu.html";
            return;
        }

        const formData = new FormData(form);

        const subtotal = cartProducts.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const orderId = "SZ" + Date.now().toString().slice(-8);

        const order = {
            orderId: orderId,

            customer: {
                name: String(formData.get("customerName") || "").trim(),
                phone: String(formData.get("customerPhone") || "").trim(),
                email: String(formData.get("customerEmail") || "").trim(),
                address: String(formData.get("customerAddress") || "").trim(),
                city: String(formData.get("customerCity") || "").trim(),
                state: String(formData.get("customerState") || "").trim(),
                pincode: String(formData.get("customerPincode") || "").trim()
            },

            items: cartProducts,
            subtotal: subtotal,
            delivery: 0,
            total: subtotal,

            paymentMethod: formData.get("paymentMethod"),

            note: String(formData.get("orderNote") || "").trim(),

            status: "Demo Order",

            createdAt: new Date().toISOString()
        };

        // Save order in browser storage
        let existingOrders = [];

        try {
            existingOrders = JSON.parse(
                localStorage.getItem("sushi_zen_orders") || "[]"
            );

            if (!Array.isArray(existingOrders)) {
                existingOrders = [];
            }

        } catch (error) {
            existingOrders = [];
        }

        existingOrders.push(order);

        localStorage.setItem(
            "sushi_zen_orders",
            JSON.stringify(existingOrders)
        );

        // Clear cart
        localStorage.removeItem("sushi_zen_cart");

        updateCartCount();

        // Show success message
        const checkoutLayout = document.querySelector(".checkout-layout");
        const checkoutHeading = document.querySelector(".checkout-heading");
        const successSection = document.getElementById("orderSuccess");
        const successOrderId = document.getElementById("successOrderId");

        if (checkoutLayout) {
            checkoutLayout.style.display = "none";
        }

        if (checkoutHeading) {
            checkoutHeading.style.display = "none";
        }

        if (successOrderId) {
            successOrderId.textContent = "Order ID: " + orderId;
        }

        if (successSection) {
            successSection.hidden = false;

            successSection.scrollIntoView({
                behavior: "smooth"
            });
        }

        form.reset();

    });
}


// ======================================
// CONTACT FORM
// ======================================

function setupContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const subject = String(formData.get("subject") || "");
        const message = String(formData.get("message") || "").trim();

        const restaurantEmail = "hello@sushizen.com";

        const emailSubject = encodeURIComponent(
            "Sushi Zen Enquiry - " + subject
        );

        const emailBody = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone || "Not provided"}\n` +
            `Subject: ${subject}\n\n` +
            `Message:\n${message}`
        );

        const mailtoLink =
            `mailto:${restaurantEmail}?subject=${emailSubject}&body=${emailBody}`;

        window.location.href = mailtoLink;

    });
}


// ======================================
// FOOTER YEAR
// ======================================

function updateFooterYear() {
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}


// ======================================
// INITIALIZE WEBSITE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // Apply URL category before displaying products
    applyCategoryFromURL();

    // Display products
    displayProducts();

    // Category filters
    setupFilters();

    // Homepage category navigation
    setupCategoryCards();

    // Menu search
    setupMenuSearch();

    // Mobile navigation
    setupMobileMenu();

    // Cart count
    updateCartCount();

    // Cart page
    renderCartPage();

    // Checkout page
    renderCheckoutPage();
    setupCheckoutForm();

    // Contact form
    setupContactForm();

    // Footer year
    updateFooterYear();

});
