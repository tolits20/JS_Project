import network from "../config/network.js";

console.log("user_cart.js loaded successfully");
console.log("Network config:", network);

// Cart Management Functions (same as other pages)
class CartManager {
  constructor() {
    this.cartKey = "auretta_cart";
    this.cart = this.loadCart();
  }

  // Load cart from localStorage
  loadCart() {
    const cartData = localStorage.getItem(this.cartKey);
    return cartData ? JSON.parse(cartData) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  // Add item to cart
  addToCart(item, quantity) {
    const existingItem = this.cart.find(
      (cartItem) => cartItem.item_id === item.item_id
    );

    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += quantity;
      if (existingItem.quantity > item.stock_qty) {
        existingItem.quantity = item.stock_qty;
      }
    } else {
      // Add new item to cart
      this.cart.push({
        item_id: item.item_id,
        item_name: item.item_name,
        item_price: item.item_price,
        item_img: item.item_img,
        quantity: quantity,
        stock_qty: item.stock_qty,
      });
    }

    this.saveCart();
    this.updateCartDisplay();
    return true;
  }

  // Remove item from cart
  removeFromCart(itemId) {
    this.cart = this.cart.filter((item) => item.item_id !== itemId);
    this.saveCart();
    this.updateCartDisplay();
  }

  // Update item quantity
  updateQuantity(itemId, quantity) {
    const item = this.cart.find((cartItem) => cartItem.item_id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else if (quantity <= item.stock_qty) {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  }

  // Get cart total
  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.item_price * item.quantity,
      0
    );
  }

  // Get cart count
  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartDisplay();
  }

  // Update cart display in header
  updateCartDisplay() {
    const cartCount = this.getCartCount();
    const cartCountElement = document.querySelector(".cart-count");

    if (cartCountElement) {
      if (cartCount > 0) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = "flex";
      } else {
        cartCountElement.style.display = "none";
      }
    }
  }

  // Get cart items
  getCartItems() {
    return this.cart;
  }
}

// Initialize cart manager
const cartManager = new CartManager();

// Function to load HTML components
function loadComponent(containerId, componentPath) {
  fetch(componentPath)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(containerId).innerHTML = html;
      // Update cart display after header loads
      if (containerId === "header-container") {
        cartManager.updateCartDisplay();
      }
    })
    .catch((error) => {
      console.error("Error loading component:", error);
    });
}

// Function to render cart items
function renderCartItems() {
  console.log("renderCartItems called");
  const cartItems = cartManager.getCartItems();
  console.log("Cart items:", cartItems);
  const container = document.getElementById("cart-items-container");
  const summary = document.getElementById("cart-summary");

  console.log("Container:", container);
  console.log("Summary:", summary);

  if (cartItems.length === 0) {
    // Show empty cart message
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="../home_page.html" class="continue-shopping">
          <i class="fas fa-arrow-left"></i> Continue Shopping
        </a>
      </div>
    `;
    summary.style.display = "none";
    return;
  }

  // Render cart items
  let cartHTML = "";
  cartItems.forEach((item) => {
    const itemTotal = (item.item_price * item.quantity).toFixed(2);
    const imgPath = item.item_img
      ? `http://${network.ip}:${network.port}/${item.item_img}`
      : "/assets/images/main.jpg";

    cartHTML += `
      <div class="cart-item" data-item-id="${item.item_id}">
        <img src="${imgPath}" alt="${item.item_name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.item_name}</h4>
          <div class="cart-item-price">$${item.item_price}</div>
          <div class="quantity-controls">
            <button class="quantity-btn decrease-btn" data-item-id="${item.item_id}">
              <i class="fas fa-minus"></i>
            </button>
            <input type="number" class="quantity-input" value="${item.quantity}" 
                   min="1" max="${item.stock_qty}" data-item-id="${item.item_id}">
            <button class="quantity-btn increase-btn" data-item-id="${item.item_id}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="cart-item-total">Total: $${itemTotal}</div>
        </div>
        <button class="remove-btn" data-item-id="${item.item_id}">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    `;
  });

  container.innerHTML = cartHTML;
  summary.style.display = "block";
  updateCartSummary();
}

// Function to update cart summary
function updateCartSummary() {
  const cartItems = cartManager.getCartItems();
  const subtotal = cartManager.getCartTotal();
  const itemCount = cartManager.getCartCount();

  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.getElementById("cart-item-count").textContent = itemCount;
  document.getElementById("cart-total").textContent = `$${subtotal.toFixed(2)}`;
}

// Function to show notification
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8"
    };
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 300px;
    animation: slideIn 0.3s ease;
  `;

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .notification-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      margin-left: 10px;
    }
  `;
  document.head.appendChild(style);

  // Add to page
  document.body.appendChild(notification);

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.remove();
  });

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

$(document).ready(function () {
  console.log("Cart page loaded, initializing...");

  // Load reusable components
  loadComponent(
    "header-container",
    "/frontend/user/components/primary/header.html"
  );
  loadComponent(
    "footer-container",
    "/frontend/user/components/primary/footer.html"
  );

  // Enhanced navbar background on scroll
  $(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Render cart items on page load
  console.log("Rendering cart items...");
  renderCartItems();

  // Event handlers for quantity controls
  $(document).on("click", ".decrease-btn", function () {
    const itemId = parseInt($(this).data("item-id"));
    const input = $(this).siblings(".quantity-input");
    let currentValue = parseInt(input.val());

    if (currentValue > 1) {
      input.val(currentValue - 1);
      cartManager.updateQuantity(itemId, currentValue - 1);
      renderCartItems(); // Re-render to update totals
      showNotification("Quantity updated!", "success");
    }
  });

  $(document).on("click", ".increase-btn", function () {
    const itemId = parseInt($(this).data("item-id"));
    const input = $(this).siblings(".quantity-input");
    let currentValue = parseInt(input.val());
    const maxValue = parseInt(input.attr("max"));

    if (currentValue < maxValue) {
      input.val(currentValue + 1);
      cartManager.updateQuantity(itemId, currentValue + 1);
      renderCartItems(); // Re-render to update totals
      showNotification("Quantity updated!", "success");
    } else {
      showNotification("Maximum quantity reached!", "error");
    }
  });

  // Event handler for quantity input changes
  $(document).on("change", ".quantity-input", function () {
    const itemId = parseInt($(this).data("item-id"));
    const newQuantity = parseInt($(this).val());
    const maxValue = parseInt($(this).attr("max"));

    if (newQuantity > maxValue) {
      $(this).val(maxValue);
      cartManager.updateQuantity(itemId, maxValue);
      showNotification(`Maximum quantity is ${maxValue}!`, "error");
    } else if (newQuantity < 1) {
      $(this).val(1);
      cartManager.updateQuantity(itemId, 1);
      showNotification("Minimum quantity is 1!", "error");
    } else {
      cartManager.updateQuantity(itemId, newQuantity);
      showNotification("Quantity updated!", "success");
    }

    renderCartItems(); // Re-render to update totals
  });

  // Event handler for remove buttons
  $(document).on("click", ".remove-btn", function () {
    const itemId = parseInt($(this).data("item-id"));
    const itemName = $(this)
      .closest(".cart-item")
      .find(".cart-item-title")
      .text();

    if (
      confirm(`Are you sure you want to remove "${itemName}" from your cart?`)
    ) {
      cartManager.removeFromCart(itemId);
      renderCartItems(); // Re-render to update totals
      showNotification("Item removed from cart!", "success");
    }
  });

  // Event handler for checkout button
  $("#checkout-btn").on("click", function () {
    const cartItems = cartManager.getCartItems();
    if (cartItems.length > 0) {
      // For now, just show a message. You can implement actual checkout later
      showNotification("Checkout functionality coming soon!", "info");
      // You can redirect to a checkout page or implement payment processing here
      // window.location.href = '/frontend/user/checkout/index.html';
    }
  });
});

// Make cart manager available globally for other scripts
window.cartManager = cartManager;
