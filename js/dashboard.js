// Dashboard JavaScript

// =================
// BUTTON FUNCTIONS
// =================

// Profile & Settings Functions
function showProfile() {
  showNotification("Profile page coming soon! 👤", "info");
  console.log("Profile clicked");
}

function showSettings() {
  showNotification("Settings panel opening soon! ⚙️", "info");
  console.log("Settings clicked");
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("userName");
    localStorage.removeItem("isLoggedIn");
    showNotification("Logging out... 👋", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

// Quick Actions
function showQuickOrder() {
  showNotification("Quick Order feature coming soon! 🚀", "info");
  console.log("Quick Order clicked");
}

function showGroupOrders() {
  showNotification("Group Orders panel opening soon! 👥", "info");
  console.log("Group Orders clicked");
}

// Category Functions
function browseCategory(category) {
  showNotification(`Browsing ${category} category! 🛒`, "success");
  console.log(`Category selected: ${category}`);

  // Scroll to products section
  const productsSection = document.getElementById("productsSection");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" });
  }
}

// =================
// GROUP ORDER SYSTEM
// =================

// Group Orders Data
let groupOrders = {
  1: {
    id: 1,
    title: "Bulk Onion Order",
    description:
      "Premium quality onions from verified suppliers. Perfect for restaurants and bulk buyers.",
    location: "Within 2km",
    currentParticipants: 8,
    maxParticipants: 10,
    discount: 15,
    minQuantity: "50kg",
    pricePerKg: 25,
    originalPrice: 30,
    timeLeft: "2 days",
    organizer: "Rajesh Traders",
    participants: [
      "Mumbai Kitchen",
      "Spice Garden",
      "Fresh Mart",
      "Green Grocers",
      "City Restaurant",
      "Food Plaza",
      "Quick Bites",
      "Tasty Corner",
    ],
    isJoined: false,
    category: "Vegetables",
    deadline: "Dec 28, 2024",
  },
  2: {
    id: 2,
    title: "Packaging Materials",
    description:
      "Eco-friendly packaging materials including boxes, bags, and containers for restaurants.",
    location: "Within 1km",
    currentParticipants: 5,
    maxParticipants: 12,
    discount: 20,
    minQuantity: "100 pieces",
    pricePerKg: 8,
    originalPrice: 10,
    timeLeft: "5 days",
    organizer: "Pack Solutions",
    participants: [
      "Quick Bites",
      "Food Express",
      "Cafe Central",
      "Street Food Co",
      "Snack Corner",
    ],
    isJoined: false,
    category: "Packaging",
    deadline: "Dec 31, 2024",
  },
  3: {
    id: 3,
    title: "Premium Basmati Rice",
    description:
      "High-quality aged basmati rice, perfect for restaurants and catering services.",
    location: "Within 3km",
    currentParticipants: 6,
    maxParticipants: 8,
    discount: 12,
    minQuantity: "25kg",
    pricePerKg: 88,
    originalPrice: 100,
    timeLeft: "1 day",
    organizer: "Rice Traders Hub",
    participants: [
      "Biryani Palace",
      "Royal Kitchen",
      "Indian Spice",
      "Curry House",
      "Rice Bowl",
      "Desi Dhaba",
    ],
    isJoined: true,
    category: "Grains",
    deadline: "Dec 26, 2024",
  },
};

// Get user's joined group orders
function getMyGroupOrders() {
  return Object.values(groupOrders).filter((order) => order.isJoined);
}

// Join Group Order Function
function joinGroupOrder(orderId) {
  const order = groupOrders[orderId];
  if (!order) {
    showNotification("Group order not found! ❌", "error");
    return;
  }

  if (order.isJoined) {
    showNotification("You have already joined this group order! ℹ️", "info");
    return;
  }

  if (order.currentParticipants >= order.maxParticipants) {
    showNotification("This group order is full! 😞", "warning");
    return;
  }

  // Join the order
  order.isJoined = true;
  order.currentParticipants++;
  order.participants.push("Your Restaurant"); // Add user's restaurant

  // Update UI
  updateGroupOrderDisplay(orderId);
  updateMyGroupOrdersSection();

  showNotification(`Successfully joined "${order.title}"! 🎉`, "success");
  console.log(`Joined group order: ${orderId}`);
}

// Leave Group Order Function
function leaveGroupOrder(orderId) {
  const order = groupOrders[orderId];
  if (!order || !order.isJoined) {
    showNotification("You are not part of this group order! ❌", "error");
    return;
  }

  if (confirm(`Are you sure you want to leave "${order.title}"?`)) {
    order.isJoined = false;
    order.currentParticipants--;
    order.participants = order.participants.filter(
      (p) => p !== "Your Restaurant"
    );

    updateGroupOrderDisplay(orderId);
    updateMyGroupOrdersSection();

    showNotification(`Left "${order.title}" group order! 👋`, "info");
  }
}

// Show Group Order Details Modal
function showGroupOrderDetails(orderId) {
  const order = groupOrders[orderId];
  if (!order) return;

  const progress = Math.round(
    (order.currentParticipants / order.maxParticipants) * 100
  );
  const savingsPerKg = order.originalPrice - order.pricePerKg;

  const modalContent = `
    <div class="group-order-modal">
      <div class="modal-header">
        <h2><i class="fas fa-users"></i> ${order.title}</h2>
        <div class="order-badges">
          <span class="badge badge-category">${order.category}</span>
          <span class="badge badge-discount">${order.discount}% OFF</span>
        </div>
      </div>
      
      <div class="modal-body">
        <div class="order-details-grid">
          <div class="detail-section">
            <h3><i class="fas fa-info-circle"></i> Order Details</h3>
            <p class="order-description">${order.description}</p>
            <div class="detail-item">
              <span class="label">📍 Location:</span>
              <span class="value">${order.location}</span>
            </div>
            <div class="detail-item">
              <span class="label">⏰ Time Left:</span>
              <span class="value">${order.timeLeft}</span>
            </div>
            <div class="detail-item">
              <span class="label">📅 Deadline:</span>
              <span class="value">${order.deadline}</span>
            </div>
            <div class="detail-item">
              <span class="label">🏪 Organizer:</span>
              <span class="value">${order.organizer}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3><i class="fas fa-chart-bar"></i> Progress & Pricing</h3>
            <div class="progress-section">
              <div class="progress-bar-large">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <p class="progress-text">${order.currentParticipants}/${
    order.maxParticipants
  } vendors joined (${progress}%)</p>
            </div>
            
            <div class="pricing-info">
              <div class="price-comparison">
                <div class="original-price">₹${order.originalPrice}/kg</div>
                <div class="discounted-price">₹${order.pricePerKg}/kg</div>
                <div class="savings">Save ₹${savingsPerKg}/kg!</div>
              </div>
              <div class="min-quantity">
                <span class="label">📦 Minimum Quantity:</span>
                <span class="value">${order.minQuantity}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="participants-section">
          <h3><i class="fas fa-users"></i> Participants (${
            order.currentParticipants
          })</h3>
          <div class="participants-list">
            ${order.participants
              .map(
                (participant) => `
              <div class="participant-item ${
                participant === "Your Restaurant" ? "current-user" : ""
              }">
                <i class="fas fa-store"></i>
                <span>${participant}</span>
                ${
                  participant === "Your Restaurant"
                    ? '<span class="you-badge">You</span>'
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="modal-actions">
          ${
            order.isJoined
              ? `<button class="btn btn-secondary" onclick="leaveGroupOrder(${order.id}); closeModal();">
              <i class="fas fa-sign-out-alt"></i> Leave Group Order
            </button>`
              : `<button class="btn btn-primary" onclick="joinGroupOrder(${order.id}); closeModal();">
              <i class="fas fa-user-plus"></i> Join Group Order
            </button>`
          }
          <button class="btn btn-secondary" onclick="closeModal()">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  `;

  showModal(modalContent);
}

// Update Group Order Display
function updateGroupOrderDisplay(orderId) {
  const order = groupOrders[orderId];
  const progress = Math.round(
    (order.currentParticipants / order.maxParticipants) * 100
  );

  // Update the specific group order item in the dashboard
  const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
  if (orderElement) {
    const progressBar = orderElement.querySelector(".progress-fill");
    const progressText = orderElement.querySelector(".group-progress span");
    const participantText = orderElement.querySelector(".group-info p");
    const joinButton = orderElement.querySelector(".btn-join");

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}% filled`;
    if (participantText)
      participantText.innerHTML = `📍 ${order.location} • ${order.currentParticipants}/${order.maxParticipants} vendors joined`;

    if (joinButton) {
      if (order.isJoined) {
        joinButton.textContent = "Joined ✓";
        joinButton.classList.add("joined");
        joinButton.setAttribute("onclick", `showGroupOrderDetails(${orderId})`);
      } else {
        joinButton.textContent = "Join";
        joinButton.classList.remove("joined");
        joinButton.setAttribute("onclick", `joinGroupOrder(${orderId})`);
      }
    }
  }
}

// Update My Group Orders Section
function updateMyGroupOrdersSection() {
  const myOrders = getMyGroupOrders();
  const container = document.getElementById("myGroupOrdersContainer");

  if (!container) return;

  if (myOrders.length === 0) {
    container.innerHTML = `
      <div class="no-orders">
        <i class="fas fa-users"></i>
        <p>You haven't joined any group orders yet.</p>
        <button class="btn btn-primary" onclick="scrollToGroupOrders()">Browse Group Orders</button>
      </div>
    `;
    return;
  }

  container.innerHTML = myOrders
    .map((order) => {
      const progress = Math.round(
        (order.currentParticipants / order.maxParticipants) * 100
      );
      return `
      <div class="my-group-order-item" data-order-id="${order.id}">
        <div class="order-header">
          <h4>${order.title}</h4>
          <span class="discount-badge">${order.discount}% OFF</span>
        </div>
        <div class="order-details">
          <p>📍 ${order.location} • ⏰ ${order.timeLeft}</p>
          <div class="progress-mini">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <span>${order.currentParticipants}/${order.maxParticipants}</span>
          </div>
        </div>
        <div class="order-actions">
          <button class="btn btn-sm" onclick="showGroupOrderDetails(${order.id})">View Details</button>
          <button class="btn btn-sm btn-secondary" onclick="leaveGroupOrder(${order.id})">Leave</button>
        </div>
      </div>
    `;
    })
    .join("");
}

// Scroll to group orders section
function scrollToGroupOrders() {
  const groupOrdersSection = document.querySelector(".group-orders");
  if (groupOrdersSection) {
    groupOrdersSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Initialize Group Orders System
function initializeGroupOrders() {
  // Add data-order-id attributes to existing group order items
  const groupOrderItems = document.querySelectorAll(".group-order-item");
  groupOrderItems.forEach((item, index) => {
    const orderId = index + 1; // IDs start from 1
    item.setAttribute("data-order-id", orderId);

    // Update display for already joined orders
    const order = groupOrders[orderId];
    if (order && order.isJoined) {
      updateGroupOrderDisplay(orderId);
    }
  });

  // Add click handlers for viewing details
  const joinButtons = document.querySelectorAll(".btn-join");
  joinButtons.forEach((button) => {
    // Add right-click for details
    button.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      const orderItem = e.target.closest(".group-order-item");
      const orderId = orderItem.getAttribute("data-order-id");
      if (orderId) {
        showGroupOrderDetails(parseInt(orderId));
      }
    });
  });

  // Update my group orders section
  updateMyGroupOrdersSection();
}

// =================
// ADVANCED GROUP ORDER FEATURES
// =================

// Show Create Group Order Modal
function showCreateGroupOrderModal() {
  const modalContent = `
    <div class="create-group-order-modal">
      <div class="modal-header">
        <h2><i class="fas fa-plus-circle"></i> Create New Group Order</h2>
      </div>
      
      <form class="modal-body" onsubmit="createGroupOrder(event)">
        <div class="form-grid">
          <div class="form-group">
            <label for="orderTitle">Order Title *</label>
            <input type="text" id="orderTitle" name="title" required placeholder="e.g., Bulk Tomatoes Order">
          </div>
          
          <div class="form-group">
            <label for="orderCategory">Category *</label>
            <select id="orderCategory" name="category" required>
              <option value="">Select Category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Spices">Spices</option>
              <option value="Grains">Grains</option>
              <option value="Packaging">Packaging</option>
              <option value="Dairy">Dairy</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="form-group full-width">
            <label for="orderDescription">Description *</label>
            <textarea id="orderDescription" name="description" required rows="3" 
              placeholder="Describe the products, quality requirements, and any special instructions..."></textarea>
          </div>
          
          <div class="form-group">
            <label for="maxParticipants">Max Participants *</label>
            <input type="number" id="maxParticipants" name="maxParticipants" required min="2" max="50" placeholder="10">
          </div>
          
          <div class="form-group">
            <label for="minQuantity">Minimum Quantity *</label>
            <input type="text" id="minQuantity" name="minQuantity" required placeholder="e.g., 25kg, 100 pieces">
          </div>
          
          <div class="form-group">
            <label for="originalPrice">Regular Price (₹) *</label>
            <input type="number" id="originalPrice" name="originalPrice" required step="0.01" placeholder="100.00">
          </div>
          
          <div class="form-group">
            <label for="groupPrice">Group Price (₹) *</label>
            <input type="number" id="groupPrice" name="groupPrice" required step="0.01" placeholder="85.00">
          </div>
          
          <div class="form-group">
            <label for="orderDeadline">Deadline *</label>
            <input type="date" id="orderDeadline" name="deadline" required>
          </div>
          
          <div class="form-group">
            <label for="deliveryLocation">Delivery Location *</label>
            <input type="text" id="deliveryLocation" name="location" required placeholder="e.g., Within 3km">
          </div>
        </div>
        
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-plus"></i> Create Group Order
          </button>
          <button type="button" class="btn btn-secondary" onclick="closeModal()">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </form>
    </div>
  `;

  showModal(modalContent);
}

// Create Group Order Function
function createGroupOrder(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const orderData = Object.fromEntries(formData.entries());

  // Generate new order ID
  const newId = Math.max(...Object.keys(groupOrders).map(Number)) + 1;

  // Calculate discount percentage
  const discount = Math.round(
    ((orderData.originalPrice - orderData.groupPrice) /
      orderData.originalPrice) *
      100
  );

  // Calculate days left
  const deadline = new Date(orderData.deadline);
  const today = new Date();
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const timeLeft = diffDays > 0 ? `${diffDays} days` : "0 days";

  // Create new group order
  groupOrders[newId] = {
    id: newId,
    title: orderData.title,
    description: orderData.description,
    location: orderData.location,
    currentParticipants: 1, // Creator joins automatically
    maxParticipants: parseInt(orderData.maxParticipants),
    discount: discount,
    minQuantity: orderData.minQuantity,
    pricePerKg: parseFloat(orderData.groupPrice),
    originalPrice: parseFloat(orderData.originalPrice),
    timeLeft: timeLeft,
    organizer: "Your Restaurant", // User is the organizer
    participants: ["Your Restaurant"],
    isJoined: true, // Creator automatically joins
    category: orderData.category,
    deadline: orderData.deadline,
  };

  // Update UI
  addGroupOrderToDOM(newId);
  updateMyGroupOrdersSection();

  // Close modal and show success
  closeModal();
  showNotification(
    `Successfully created "${orderData.title}" group order! 🎉`,
    "success"
  );

  console.log("Created new group order:", groupOrders[newId]);
}

// Add new group order to DOM
function addGroupOrderToDOM(orderId) {
  const order = groupOrders[orderId];
  const progress = Math.round(
    (order.currentParticipants / order.maxParticipants) * 100
  );

  const groupOrdersContainer = document.querySelector(".group-orders");
  if (!groupOrdersContainer) return;

  const orderHTML = `
    <div class="group-order-item" data-order-id="${orderId}">
      <div class="group-info">
        <h4><a href="#" onclick="showGroupOrderDetails(${orderId}); return false;" style="color: #333; text-decoration: none;">${order.title}</a></h4>
        <p>📍 ${order.location} • ${order.currentParticipants}/${order.maxParticipants} vendors joined</p>
        <div class="group-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <span>${progress}% filled</span>
        </div>
      </div>
      <div class="group-action">
        <div class="discount-badge">${order.discount}% OFF</div>
        <button class="btn-join joined" onclick="showGroupOrderDetails(${orderId})">
          Joined ✓
        </button>
      </div>
    </div>
  `;

  groupOrdersContainer.insertAdjacentHTML("beforeend", orderHTML);
}

// Show All Group Orders Modal
function showAllGroupOrders() {
  const allOrders = Object.values(groupOrders);

  const modalContent = `
    <div class="all-group-orders-modal">
      <div class="modal-header">
        <h2><i class="fas fa-users"></i> All Group Orders</h2>
        <div class="filter-controls">
          <select id="categoryFilter" onchange="filterGroupOrders()">
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Spices">Spices</option>
            <option value="Grains">Grains</option>
            <option value="Packaging">Packaging</option>
            <option value="Dairy">Dairy</option>
          </select>
          <select id="statusFilter" onchange="filterGroupOrders()">
            <option value="">All Orders</option>
            <option value="joined">My Orders</option>
            <option value="available">Available</option>
            <option value="full">Full</option>
          </select>
        </div>
      </div>
      
      <div class="modal-body">
        <div id="allOrdersList" class="all-orders-grid">
          ${allOrders
            .map((order) => {
              const progress = Math.round(
                (order.currentParticipants / order.maxParticipants) * 100
              );
              const isFull = order.currentParticipants >= order.maxParticipants;
              return `
              <div class="order-card" data-category="${
                order.category
              }" data-status="${
                order.isJoined ? "joined" : isFull ? "full" : "available"
              }">
                <div class="order-card-header">
                  <h4>${order.title}</h4>
                  <div class="badges">
                    <span class="badge badge-category">${order.category}</span>
                    <span class="badge badge-discount">${
                      order.discount
                    }% OFF</span>
                  </div>
                </div>
                <p class="order-description">${order.description.substring(
                  0,
                  100
                )}...</p>
                <div class="order-stats">
                  <div class="stat">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${order.location}</span>
                  </div>
                  <div class="stat">
                    <i class="fas fa-clock"></i>
                    <span>${order.timeLeft}</span>
                  </div>
                </div>
                <div class="progress-section">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                  </div>
                  <span>${order.currentParticipants}/${
                order.maxParticipants
              } joined</span>
                </div>
                <div class="order-actions">
                  <button class="btn btn-sm" onclick="showGroupOrderDetails(${
                    order.id
                  })">View Details</button>
                  ${
                    order.isJoined
                      ? `<button class="btn btn-sm btn-secondary" onclick="leaveGroupOrder(${order.id}); filterGroupOrders();">Leave</button>`
                      : isFull
                      ? `<button class="btn btn-sm" disabled>Full</button>`
                      : `<button class="btn btn-sm btn-primary" onclick="joinGroupOrder(${order.id}); filterGroupOrders();">Join</button>`
                  }
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="showCreateGroupOrderModal()">
          <i class="fas fa-plus"></i> Create New Order
        </button>
        <button class="btn btn-secondary" onclick="closeModal()">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>
  `;

  showModal(modalContent);
}

// Filter Group Orders in All Orders Modal
function filterGroupOrders() {
  const categoryFilter = document.getElementById("categoryFilter")?.value || "";
  const statusFilter = document.getElementById("statusFilter")?.value || "";

  const orderCards = document.querySelectorAll(".order-card");

  orderCards.forEach((card) => {
    const category = card.getAttribute("data-category");
    const status = card.getAttribute("data-status");

    const categoryMatch = !categoryFilter || category === categoryFilter;
    const statusMatch = !statusFilter || status === statusFilter;

    if (categoryMatch && statusMatch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Auto-refresh group orders (simulate real-time updates)
function startGroupOrderAutoRefresh() {
  setInterval(() => {
    // Simulate random participants joining/leaving
    Object.values(groupOrders).forEach((order) => {
      if (
        !order.isJoined &&
        order.currentParticipants < order.maxParticipants
      ) {
        // 10% chance someone joins
        if (Math.random() < 0.1) {
          order.currentParticipants++;
          order.participants.push(
            `Restaurant ${Math.floor(Math.random() * 100)}`
          );
          updateGroupOrderDisplay(order.id);
        }
      }
    });
  }, 30000); // Check every 30 seconds
}

// Supplier Functions
function contactSupplier(supplierId) {
  showNotification(`Contacting supplier! 📞`, "info");
  console.log(`Contacting supplier: ${supplierId}`);
}

// View Functions
function viewAllCategories() {
  showNotification("Loading all categories... 📂", "info");
  console.log("View all categories");
}

function viewAllOrders() {
  showNotification("Loading order history... 📋", "info");
  console.log("View all orders");
}

function seeMoreSuppliers() {
  showNotification("Loading more suppliers... 🏪", "info");
  console.log("See more suppliers");
}

function findMoreSuppliers() {
  showNotification("Finding more suppliers... 🔍", "info");
  console.log("Find more suppliers");
}

// Fallback notification function if main.js hasn't loaded yet
function fallbackNotification(message, type) {
  console.log(`${type.toUpperCase()}: ${message}`);
  // Create a simple alert as fallback
  if (type === "error" || type === "warning") {
    alert(message);
  }
}

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

  // Check if user is logged in, if not redirect to login
  if (!localStorage.getItem("userName")) {
    const notifyFunc =
      typeof showNotification === "function"
        ? showNotification
        : fallbackNotification;
    notifyFunc("Please login to access your dashboard", "warning");
    setTimeout(() => {
      window.location.href = "index.html#login";
    }, 2000);
    return false;
  }

  return true;
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

// Initialize dashboard with dependency check
document.addEventListener("DOMContentLoaded", function () {
  console.log("Dashboard loading started...");

  // VISUAL PROOF that updated code is running
  document.body.style.border = "5px solid red";
  document.body.style.boxSizing = "border-box";
  setTimeout(() => {
    document.body.style.border = "none";
  }, 3000);

  // Wait for main.js functions to be available
  const checkDependencies = () => {
    console.log("Checking dependencies...", {
      showNotification: typeof showNotification,
      showModal: typeof showModal,
    });

    if (
      typeof showNotification === "function" &&
      typeof showModal === "function"
    ) {
      console.log("Dependencies loaded, initializing dashboard...");
      // Only proceed if user is authenticated
      if (loadUserData()) {
        console.log("User authenticated, setting up dashboard...");
        setupDashboard();
        loadProducts();
      }
    } else {
      console.log("Dependencies not ready, retrying...");
      // Wait a bit more for main.js to load
      setTimeout(checkDependencies, 100);
    }
  };

  checkDependencies();
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

  // Initialize Group Orders System
  initializeGroupOrders();

  // Start auto-refresh for group orders
  startGroupOrderAutoRefresh();
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
