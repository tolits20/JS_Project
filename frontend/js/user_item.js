import network from "../config/network.js";
import logout from "./logout.js";

// Cart Management Functions
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

$(document).ready(function () {
  // Load reusable components
  loadComponent(
    "header-container",
    "/frontend/user/components/primary/header.html"
  );
  loadComponent(
    "footer-container",
    "/frontend/user/components/primary/footer.html"
  );

  // Simple quantity controls
  const quantityInput = document.getElementById("quantity-selector");
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  // Decrease button
  decreaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  // Increase button
  increaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    const maxValue = parseInt(quantityInput.max) || 15;
    if (currentValue < maxValue) {
      quantityInput.value = currentValue + 1;
    }
  });

  // Add to cart functionality
  addToCartBtn.addEventListener("click", function () {
    const quantity = parseInt(quantityInput.value);
    const itemId = new URLSearchParams(window.location.search).get("id");

    if (itemId && currentItem) {
      const success = cartManager.addToCart(currentItem, quantity);
      if (success) {
        // Show success message
        showNotification("Item added to cart successfully!", "success");

        // Update button text temporarily
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
        addToCartBtn.style.background = "#28a745";
        addToCartBtn.style.borderColor = "#28a745";

        setTimeout(() => {
          addToCartBtn.innerHTML = originalText;
          addToCartBtn.style.background = "#000000";
          addToCartBtn.style.borderColor = "#000000";
        }, 2000);
      }
    }
  });

  // Load item details based on URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id");
  let currentItem = null; // Store current item for cart operations

  if (itemId) {
    // Fetch item details from API
    fetch(`http://${network.ip}:${network.port}/api/v1/items/${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.data) {
          currentItem = data.data; // Store for cart operations

          // Update page content with item details
          document.getElementById("item-title").textContent =
            currentItem.item_name;
          document.getElementById("item-category").textContent =
            currentItem.category_name || "Handbags";
          document.getElementById(
            "item-price"
          ).textContent = `$${currentItem.item_price}`;
          document.getElementById("item-description").textContent =
            currentItem.item_desc ||
            "Premium quality item with exceptional craftsmanship.";

          // Update image
          const itemImage = document.getElementById("item-main-image");
          if (currentItem.item_img) {
            itemImage.src = `http://${network.ip}:${network.port}/${currentItem.item_img}`;
          }

          // Update stock information
          const stockElement = document.getElementById("item-stock");
          const stockQty = currentItem.stock_qty || 15;

          if (stockQty > 10) {
            stockElement.innerHTML = `<span class="stock-available">✓ In Stock: ${stockQty} available</span>`;
          } else if (stockQty > 0) {
            stockElement.innerHTML = `<span class="stock-low">⚠ Low Stock: ${stockQty} available</span>`;
          } else {
            stockElement.innerHTML = `<span class="stock-out">✗ Out of Stock</span>`;
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = "Out of Stock";
          }

          // Update quantity max value
          quantityInput.max = stockQty;

          // Check if item is already in cart and update UI
          const cartItem = cartManager
            .getCartItems()
            .find((item) => item.item_id === currentItem.item_id);
          if (cartItem) {
            quantityInput.value = Math.min(cartItem.quantity, stockQty);
            addToCartBtn.innerHTML = '<i class="fas fa-sync"></i> Update Cart';
          }
        } else {
          console.error("Item not found or API error:", data.message);
          showNotification("Item not found!", "error");
        }
      })
      .catch((error) => {
        console.error("Error loading item details:", error);
        showNotification("Error loading item details!", "error");
      });
  }

  // Add logout handler for header logout button
  $(document).on("click", "#logout-btn", function (e) {
    e.preventDefault();
    logout();
  });
});

// Notification function
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

// Make cart manager available globally for other scripts
window.cartManager = cartManager;
