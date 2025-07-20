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
      console.log("Loading orders page...");
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
    console.log("Loading header only...");
    try {
      // Use the existing componentLoader utility
      loadHeaderAndFooter(sessionCartManager);
      console.log("Header loaded successfully using componentLoader");
    } catch (error) {
      console.error("Error loading header:", error);
      console.log("Continuing without header...");
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Place order button
    $("#place-order-btn").on("click", () => {
      this.handlePlaceOrder();
    });

    // Form validation on input
    $("#checkout-form input, #checkout-form textarea").on("input", () => {
      this.validateForm();
    });

    // Logout handler
    $(document).on("click", "#logout-btn", function (e) {
      e.preventDefault();
      logout();
    });

    // Order action handlers (for orders page)
    $(document).on("click", ".view-order-btn", function (e) {
      const orderId = $(this).data("order-id");
      window.location.href = `/frontend/user/item/order_details.html?id=${orderId}`;
    });

    $(document).on("click", ".edit-order-btn", function (e) {
      const orderId = $(this).data("order-id");
      showNotification("Edit functionality coming soon!", "info");
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

  // Update order summary totals
  updateOrderSummary() {
    const subtotal = sessionCartManager.getCartTotal();
    const total = subtotal + this.shippingCost;

    $("#subtotal").text(`$${subtotal.toFixed(2)}`);
    $("#shipping").text(`$${this.shippingCost.toFixed(2)}`);
    $("#total").text(`$${total.toFixed(2)}`);
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

  // Validate checkout form
  validateForm() {
    const requiredFields = [
      "#full-name",
      "#email",
      "#phone",
      "#address",
      "#city",
      "#postal-code",
    ];

    let isValid = true;
    requiredFields.forEach((field) => {
      const value = $(field).val().trim();
      if (!value) {
        isValid = false;
        $(field).addClass("error");
      } else {
        $(field).removeClass("error");
      }
    });

    // Email validation
    const email = $("#email").val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      isValid = false;
      $("#email").addClass("error");
    }

    // Phone validation
    const phone = $("#phone").val();
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ""))) {
      isValid = false;
      $("#phone").addClass("error");
    }

    // Enable/disable place order button
    const hasItems = sessionCartManager.getCartItems().length > 0;
    $("#place-order-btn").prop("disabled", !isValid || !hasItems);

    return isValid;
  }

  // Handle place order button click
  async handlePlaceOrder() {
    if (!this.validateForm()) {
      showNotification(
        "Please fill in all required fields correctly.",
        "error"
      );
      return;
    }

    const cartItems = sessionCartManager.getCartItems();
    if (cartItems.length === 0) {
      showNotification("Your cart is empty.", "error");
      return;
    }

    // Get form data
    const formData = {
      fullName: $("#full-name").val().trim(),
      email: $("#email").val().trim(),
      phone: $("#phone").val().trim(),
      address: $("#address").val().trim(),
      city: $("#city").val().trim(),
      postalCode: $("#postal-code").val().trim(),
    };

    // Prepare order data
    const orderData = {
      cartItems: cartItems,
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
    };

    // Disable button and show loading
    const button = $("#place-order-btn");
    const originalText = button.html();
    button.prop("disabled", true);
    button.html('<i class="fas fa-spinner fa-spin"></i> Processing...');

    try {
      // Create order
      const response = await this.createOrder(orderData);

      if (response.success) {
        // Clear cart after successful order
        sessionCartManager.clearCart();

        // Show success message
        showNotification(
          "Order placed successfully! Order ID: " + response.data.order_id,
          "success"
        );

        // Redirect to order confirmation page
        setTimeout(() => {
          window.location.href = `/frontend/user/item/order_success.html?order_id=${response.data.order_id}`;
        }, 2000);
      } else {
        showNotification(response.message || "Failed to place order.", "error");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      showNotification(
        "An error occurred while placing your order. Please try again.",
        "error"
      );
    } finally {
      // Re-enable button
      button.prop("disabled", false);
      button.html(originalText);
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
    console.log("loadUserOrders called");
    try {
      console.log("Fetching user orders...");
      const response = await this.fetchUserOrders();
      console.log("API response:", response);

      if (response.success) {
        console.log("Rendering orders:", response.data);
        this.renderOrders(response.data);
      } else {
        console.log("API error:", response.message);
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
    console.log("renderOrders called with:", orders);
    const container = $("#orders-container");
    console.log("Container found:", container.length > 0);

    if (!orders || orders.length === 0) {
      console.log("No orders found, showing empty state");
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
            <button class="btn-view view-order-btn" data-order-id="${
              order.order_id
            }">
              <i class="fas fa-eye"></i> View Details
            </button>
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
    console.log("Checkout page loaded, initializing...");
    new CheckoutManager();
  } else {
    // If jQuery isn't available yet, wait a bit more
    setTimeout(function () {
      if (typeof $ !== "undefined") {
        console.log("Checkout page loaded, initializing...");
        new CheckoutManager();
      } else {
        console.error("jQuery not available");
      }
    }, 100);
  }
});
