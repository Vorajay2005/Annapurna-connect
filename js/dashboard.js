// Dashboard JavaScript

// Load user data from localStorage
function loadUserData() {
  const userName = localStorage.getItem("userName") || "User";
  const userType = localStorage.getItem("userType") || "vendor";

  // Update user name in dashboard
  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    userNameElement.textContent = userName;
  }

  // Update profile picture with initials
  const profilePic = document.getElementById("profilePic");
  if (profilePic && userName !== "User") {
    const initials = userName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
    profilePic.src = `https://via.placeholder.com/40x40/ff6b35/ffffff?text=${initials}`;
    profilePic.alt = userName;
  }

  // Check if user is logged in, if not redirect to home
  if (!localStorage.getItem("userName")) {
    showNotification("Please login first", "warning");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    localStorage.removeItem("signupFormData");
    showNotification("Logged out successfully", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

// Sample data
const sampleProducts = [
  {
    id: 1,
    name: "Onions",
    category: "vegetables",
    price: 38,
    unit: "kg",
    image: "🧅",
    supplier: "Fresh Suppliers Co.",
  },
  {
    id: 2,
    name: "Tomatoes",
    category: "vegetables",
    price: 52,
    unit: "kg",
    image: "🍅",
    supplier: "Fresh Suppliers Co.",
  },
  {
    id: 3,
    name: "Potatoes",
    category: "vegetables",
    price: 25,
    unit: "kg",
    image: "🥔",
    supplier: "Fresh Suppliers Co.",
  },
  {
    id: 4,
    name: "Milk",
    category: "dairy",
    price: 50,
    unit: "L",
    image: "🥛",
    supplier: "Dairy Direct",
  },
  {
    id: 5,
    name: "Paneer",
    category: "dairy",
    price: 280,
    unit: "kg",
    image: "🧀",
    supplier: "Dairy Direct",
  },
  {
    id: 6,
    name: "Curd",
    category: "dairy",
    price: 45,
    unit: "kg",
    image: "🥛",
    supplier: "Dairy Direct",
  },
  {
    id: 7,
    name: "Garam Masala",
    category: "spices",
    price: 180,
    unit: "500g",
    image: "🌶️",
    supplier: "Spice Masters",
  },
  {
    id: 8,
    name: "Turmeric",
    category: "spices",
    price: 120,
    unit: "250g",
    image: "🌶️",
    supplier: "Spice Masters",
  },
  {
    id: 9,
    name: "Cumin Seeds",
    category: "spices",
    price: 200,
    unit: "500g",
    image: "🌿",
    supplier: "Spice Masters",
  },
];

let cart = [];

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function () {
  loadUserData();
  setupDashboard();
  loadProducts();
});

function setupDashboard() {
  // Animate stats on load
  animateStats();

  // Setup category filters
  setupCategoryFilters();

  // Setup search functionality
  setupProductSearch();

  // Setup dropdown menu
  setupDropdownMenu();
}

// Animate stats counters
function animateStats() {
  const statElements = document.querySelectorAll(".stat-info h3");
  statElements.forEach((element) => {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^\d]/g, ""));
    if (number) {
      animateCounter(element, number, text.includes("₹") ? "₹" : "");
    }
  });
}

function animateCounter(element, target, prefix = "") {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    let displayValue = prefix + Math.floor(current);
    if (prefix === "₹" && target >= 1000) {
      displayValue =
        prefix +
        Math.floor(current / 1000) +
        "," +
        String(Math.floor(current % 1000)).padStart(3, "0");
    }
    if (element.textContent.includes(".")) {
      displayValue += ".8";
    } else if (element.textContent.includes("+")) {
      displayValue += "+";
    }

    element.textContent = displayValue;
  }, 20);
}

// Category functions
function browseCategory(category) {
  showNotification(`Loading ${category} products...`, "info");
  setTimeout(() => {
    showQuickOrder();
    filterProducts(category);
  }, 500);
}

// Quick Order Modal
function showQuickOrder() {
  showModal("quickOrderModal");
  loadProducts();
}

function loadProducts(category = "all") {
  const productsGrid = document.getElementById("productsGrid");
  let filteredProducts = sampleProducts;

  if (category !== "all") {
    filteredProducts = sampleProducts.filter(
      (product) => product.category === category
    );
  }

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-supplier">${product.supplier}</p>
                <div class="product-price">₹${product.price}/${product.unit}</div>
                <div class="product-actions">
                    <div class="quantity-controls">
                        <button onclick="decreaseQuantity(${product.id})">-</button>
                        <span id="qty-${product.id}">0</span>
                        <button onclick="increaseQuantity(${product.id})">+</button>
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Add product card styles
  const style = document.createElement("style");
  style.textContent = `
        .product-card {
            background: white;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.2s;
        }
        .product-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .product-image {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .product-info h4 {
            margin: 0.5rem 0;
            color: #333;
            font-size: 0.9rem;
        }
        .product-supplier {
            font-size: 0.7rem;
            color: #666;
            margin: 0.25rem 0;
        }
        .product-price {
            font-weight: 600;
            color: var(--primary-color);
            margin: 0.5rem 0;
        }
        .quantity-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .quantity-controls button {
            width: 25px;
            height: 25px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .quantity-controls span {
            min-width: 20px;
            text-align: center;
            font-weight: 500;
        }
        .btn-add-cart {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background 0.2s;
        }
        .btn-add-cart:hover {
            background: var(--accent-color);
        }
    `;
  if (!document.querySelector("#product-styles")) {
    style.id = "product-styles";
    document.head.appendChild(style);
  }
}

// Product quantity management
function increaseQuantity(productId) {
  const qtyElement = document.getElementById(`qty-${productId}`);
  const currentQty = parseInt(qtyElement.textContent);
  qtyElement.textContent = currentQty + 1;
}

function decreaseQuantity(productId) {
  const qtyElement = document.getElementById(`qty-${productId}`);
  const currentQty = parseInt(qtyElement.textContent);
  if (currentQty > 0) {
    qtyElement.textContent = currentQty - 1;
  }
}

// Cart management
function addToCart(productId) {
  const qtyElement = document.getElementById(`qty-${productId}`);
  const quantity = parseInt(qtyElement.textContent);

  if (quantity === 0) {
    showNotification("Please select quantity first", "warning");
    return;
  }

  const product = sampleProducts.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity: quantity,
    });
  }

  qtyElement.textContent = "0";
  updateOrderSummary();
  showNotification(`${product.name} added to cart!`, "success");
}

function updateOrderSummary() {
  const orderItems = document.getElementById("orderItems");
  const orderTotal = document.getElementById("orderTotal");

  if (cart.length === 0) {
    orderItems.innerHTML = "<p>No items in cart</p>";
    orderTotal.textContent = "0";
    return;
  }

  orderItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span>${item.name} (${item.quantity} ${item.unit})</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
            <button onclick="removeFromCart(${
              item.id
            })" class="btn-remove">×</button>
        </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  orderTotal.textContent = total;

  // Add cart item styles
  const style = document.createElement("style");
  style.textContent = `
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }
        .cart-item-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            flex: 1;
        }
        .cart-item-info span:first-child {
            font-weight: 500;
        }
        .cart-item-info span:last-child {
            color: var(--primary-color);
            font-weight: 600;
        }
        .btn-remove {
            background: #dc3545;
            color: white;
            border: none;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
  if (!document.querySelector("#cart-styles")) {
    style.id = "cart-styles";
    document.head.appendChild(style);
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateOrderSummary();
  showNotification("Item removed from cart", "info");
}

function placeOrder() {
  if (cart.length === 0) {
    showNotification("Please add items to cart first", "warning");
    return;
  }

  showNotification("Placing your order...", "info");

  setTimeout(() => {
    hideModal("quickOrderModal");
    cart = [];
    updateOrderSummary();
    showNotification(
      "Order placed successfully! You will receive updates soon.",
      "success"
    );
  }, 2000);
}

// Category filters setup
function setupCategoryFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const category = this.dataset.category;
      loadProducts(category);
    });
  });
}

// Product search setup
function setupProductSearch() {
  const searchInput = document.getElementById("productSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const productCards = document.querySelectorAll(".product-card");

      productCards.forEach((card) => {
        const productName = card.querySelector("h4").textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
}

// Filter products by category
function filterProducts(category) {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.category === category) {
      btn.classList.add("active");
    }
  });
  loadProducts(category);
}

// Group order functions
function joinGroupOrder(orderId) {
  showNotification(`Joining group order #${orderId}...`, "info");

  setTimeout(() => {
    showNotification(
      "Successfully joined group order! You will be notified when it's ready.",
      "success"
    );
  }, 1500);
}

function showGroupOrders() {
  showNotification("Loading nearby group orders...", "info");

  setTimeout(() => {
    showNotification(
      "Feature coming soon! We're preparing amazing group deals for you.",
      "info"
    );
  }, 1500);
}

// Supplier contact function
function contactSupplier(supplierId) {
  const suppliers = {
    1: { name: "Fresh Suppliers Co.", phone: "+91 98765 43210" },
    2: { name: "Dairy Direct", phone: "+91 98765 43211" },
    3: { name: "Spice Masters", phone: "+91 98765 43212" },
  };

  const supplier = suppliers[supplierId];
  if (supplier) {
    if (confirm(`Contact ${supplier.name} at ${supplier.phone}?`)) {
      window.open(`tel:${supplier.phone}`);
    }
  }
}

// Enhanced notification function with different types
function showDashboardNotification(message, type = "info", duration = 4000) {
  showNotification(message, type);
}

// Auto-refresh data periodically
setInterval(() => {
  // Simulate data refresh
  console.log("Refreshing dashboard data...");
}, 60000); // Refresh every minute

// Handle offline/online status
window.addEventListener("online", () => {
  showNotification("You're back online!", "success");
});

window.addEventListener("offline", () => {
  showNotification("You're offline. Some features may not work.", "warning");
});

// Initialize dashboard analytics
function initDashboardAnalytics() {
  // Track page view
  console.log("Dashboard viewed");

  // Track user interactions
  document.addEventListener("click", function (e) {
    if (e.target.matches(".category-item")) {
      console.log(
        "Category clicked:",
        e.target.querySelector("span").textContent
      );
    }
    if (e.target.matches(".btn-join")) {
      console.log("Group order join clicked");
    }
    if (e.target.matches(".btn-contact")) {
      console.log("Supplier contact clicked");
    }
  });
}

// Notification System (shared with main.js)
function showNotification(message, type = "info") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        min-width: 300px;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 10);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-exclamation-circle";
    case "warning":
      return "fa-exclamation-triangle";
    default:
      return "fa-info-circle";
  }
}

function getNotificationColor(type) {
  switch (type) {
    case "success":
      return "#28a745";
    case "error":
      return "#dc3545";
    case "warning":
      return "#ffc107";
    default:
      return "#17a2b8";
  }
}

// Modal functions (shared with main.js)
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
}

// Setup dropdown menu functionality
function setupDropdownMenu() {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.querySelector(".dropdown");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (userMenu && dropdownMenu) {
    userMenu.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      dropdownMenu.classList.remove("show");
    });

    // Prevent dropdown from closing when clicking inside
    dropdownMenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
}

// Initialize analytics on load
document.addEventListener("DOMContentLoaded", initDashboardAnalytics);
