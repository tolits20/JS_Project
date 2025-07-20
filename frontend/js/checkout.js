import network from "../config/network.js";
import sessionCartManager from "../utils/cartManager.js";
import { showNotification } from "../utils/notification.js";
import { loadHeaderAndFooter } from "../utils/componentLoader.js";
import logout from "./logout.js";

// Checkout page functionality
class CheckoutManager {
  constructor() {
    this.shippingCost = 5.0;
    this.init();
  }

  init() {
    this.setupEventListeners();

    // Check if we're on the orders page (checkout/index.html) or checkout page
    const currentPath = window.location.pathname;
    if (currentPath.includes("/checkout/index.html")) {
      // We're on the orders page - load header and user orders
      this.loadHeaderOnly();
      this.loadUserOrders();
    } else {
      // We're on the checkout page - load components, cart items and user info
      this.loadComponents();
      this.loadCartItems();
      this.loadUserInfo();
    }
  }

  // Load header and footer components
  loadComponents() {
    loadHeaderAndFooter(sessionCartManager);
  }

  // Load header only (for orders page)
  loadHeaderOnly() {
    try {
      // Use the existing componentLoader utility
      loadHeaderAndFooter(sessionCartManager);
    } catch (error) {
      console.error("Error loading header:", error);
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Place order button
    $("#place-order-btn").on("click", () => {
      this.handlePlaceOrder();
    });

    // Logout handler
    $(document).on("click", "#logout-btn", function (e) {
      e.preventDefault();
      logout();
    });

    $(document).on("click", ".cancel-order-btn", function (e) {
      const orderId = $(this).data("order-id");
      if (confirm("Are you sure you want to cancel this order?")) {
        // Call cancel order API
        $.ajax({
          method: "POST",
          url: `http://${network.ip}:${network.port}/api/v1/order/${orderId}/cancel`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          data: JSON.stringify({ reason: "Cancelled by user" }),
          success: function (response) {
            if (response.success) {
              showNotification("Order cancelled successfully!", "success");
              location.reload();
            } else {
              showNotification(
                response.message || "Failed to cancel order.",
                "error"
              );
            }
          },
          error: function (xhr, status, error) {
            showNotification(
              "An error occurred while cancelling the order.",
              "error"
            );
          },
        });
      }
    });
  }

  // Load cart items for order summary
  loadCartItems() {
    const cartItems = sessionCartManager.getCartItems();
    const container = $("#cart-items-container");

    if (cartItems.length === 0) {
      container.html(`
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <h3>Your cart is empty</h3>
          <p>Add some items to your cart to proceed with checkout.</p>
          <a href="../home_page.html" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i> Continue Shopping
          </a>
        </div>
      `);
      $("#place-order-btn").prop("disabled", true);
      return;
    }

    let cartHTML = "";
    cartItems.forEach((item) => {
      const itemTotal = (item.item_price * item.quantity).toFixed(2);
      const imgPath = item.item_img
        ? `http://${network.ip}:${network.port}/${item.item_img}`
        : "/assets/images/main.jpg";

      cartHTML += `
        <div class="cart-item">
          <img src="${imgPath}" alt="${item.item_name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.item_name}</div>
            <div class="cart-item-price">$${item.item_price} × ${item.quantity}</div>
            <div class="cart-item-quantity">Total: $${itemTotal}</div>
          </div>
        </div>
      `;
    });

    container.html(cartHTML);
    this.updateOrderSummary();
  }

  // Load user information into form
  loadUserInfo() {
    // Get user info from localStorage or API
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // You can fetch user details from API here
        // For now, we'll leave the form empty for user to fill
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }

  // Create order via API
  async createOrder(orderData) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "POST",
        url: `http://${network.ip}:${network.port}/api/v1/checkout`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: JSON.stringify(orderData),
        success: function (response) {
          resolve(response);
        },
        error: function (xhr, status, error) {
          console.error("API Error:", xhr.responseText);
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            resolve(errorResponse);
          } catch (e) {
            resolve({
              success: false,
              message: "Network error occurred",
            });
          }
        },
      });
    });
  }

  // Load user orders (for orders page)
  async loadUserOrders() {
    try {
      const response = await this.fetchUserOrders();

      if (response.success) {
        this.renderOrders(response.data);
      } else {
        this.showEmptyState("Failed to load orders: " + response.message);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      this.showEmptyState("An error occurred while loading your orders.");
    }
  }

  // Fetch user orders from API
  async fetchUserOrders() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "GET",
        url: `http://${network.ip}:${network.port}/api/v1/my-orders`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        success: function (response) {
          resolve(response);
        },
        error: function (xhr, status, error) {
          console.error("API Error:", xhr.responseText);
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            resolve(errorResponse);
          } catch (e) {
            resolve({
              success: false,
              message: "Network error occurred",
            });
          }
        },
      });
    });
  }

  // Render orders in the container
  renderOrders(orders) {
    const container = $("#orders-container");

    if (!orders || orders.length === 0) {
      this.showEmptyState(
        "You haven't placed any orders yet. Start shopping to see your order history here."
      );
      return;
    }

    let ordersHTML = "";
    orders.forEach((order) => {
      const orderDate = new Date(order.order_placed).toLocaleDateString();
      const statusClass = `status-${order.order_status}`;
      const canEdit = order.order_status === "pending";
      const canCancel = order.order_status === "pending";

      ordersHTML += `
        <div class="order-card">
          <div class="order-header">
            <div class="order-info">
              <h4>Order #${order.order_id}</h4>
              <div class="order-date">Placed on ${orderDate}</div>
            </div>
            <div class="order-status ${statusClass}">${this.getStatusText(
        order.order_status
      )}</div>
          </div>
          
          <div class="order-summary">
            <div class="summary-row">
              <span>Items:</span>
              <span>${order.items_count}</span>
            </div>
            <div class="summary-row">
              <span>Total Amount:</span>
              <span>$${parseFloat(order.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="order-actions">
        
            <button class="btn-edit edit-order-btn" data-order-id="${
              order.order_id
            }" ${!canEdit ? "disabled" : ""}>
              <i class="fas fa-edit"></i> Edit Order
            </button>
            <button class="btn-cancel cancel-order-btn" data-order-id="${
              order.order_id
            }" ${!canCancel ? "disabled" : ""}>
              <i class="fas fa-times"></i> Cancel Order
            </button>
          </div>
        </div>
      `;
    });

    container.html(ordersHTML);
  }

  // Show empty state
  showEmptyState(message) {
    const container = $("#orders-container");
    container.html(`
      <div class="empty-orders">
        <i class="fas fa-shopping-bag"></i>
        <h3>No orders yet</h3>
        <p>${message}</p>
        <a href="../home_page.html" class="btn btn-primary">
          <i class="fas fa-shopping-cart"></i> Start Shopping
        </a>
      </div>
    `);
  }

  // Get status display text
  getStatusText(status) {
    const statusMap = {
      pending: "Pending",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      refunded: "Refunded",
    };
    return statusMap[status] || status;
  }
}

// Initialize checkout when document is ready
document.addEventListener("DOMContentLoaded", function () {
  // Wait for jQuery to be available
  if (typeof $ !== "undefined") {
    window.checkoutManager = new CheckoutManager();
  } else {
    // If jQuery isn't available yet, wait a bit more
    setTimeout(function () {
      if (typeof $ !== "undefined") {
        window.checkoutManager = new CheckoutManager();
      } else {
        console.error("jQuery not available");
      }
    }, 100);
  }
});
