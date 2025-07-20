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
    this.loadComponents();
    this.setupEventListeners();
    this.loadCartItems();
    this.loadUserInfo();
  }

  // Load header and footer components
  loadComponents() {
    loadHeaderAndFooter(sessionCartManager);
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
}

// Initialize checkout when document is ready
$(document).ready(function () {
  console.log("Checkout page loaded, initializing...");
  new CheckoutManager();
});
