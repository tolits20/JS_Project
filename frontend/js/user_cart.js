import network from "../config/network.js";
import logout from "./logout.js";
import sessionCartManager from "../utils/cartManager.js";
import { showNotification } from "../utils/notification.js";
import { loadHeaderAndFooter } from "../utils/componentLoader.js";

console.log("user_cart.js loaded successfully");
console.log("Network config:", network);

// Function to render cart items
function renderCartItems() {
  console.log("renderCartItems called");
  const cartItems = sessionCartManager.getCartItems();
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
         Continue Shopping
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
      ? `http://${network.client.host}/backend/${item.item_img}`
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
        <div class="cart-item-actions">
          <button class="checkout-item-btn" data-item-id="${item.item_id}">
            <i class="fas fa-shopping-cart"></i> Checkout This Item
          </button>
          <button class="remove-btn" data-item-id="${item.item_id}">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = cartHTML;
  summary.style.display = "block";
  updateCartSummary();
}

// Function to update cart summary
function updateCartSummary() {
  const cartItems = sessionCartManager.getCartItems();
  const subtotal = sessionCartManager.getCartTotal();
  const itemCount = sessionCartManager.getCartCount();

  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.getElementById("cart-item-count").textContent = itemCount;
  document.getElementById("cart-total").textContent = `$${subtotal.toFixed(2)}`;
}

$(document).ready(function () {
  console.log("Cart page loaded, initializing...");

  // Load reusable components using the utility
  loadHeaderAndFooter(sessionCartManager);

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
      sessionCartManager.updateQuantity(itemId, currentValue - 1);
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
      sessionCartManager.updateQuantity(itemId, currentValue + 1);
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
      sessionCartManager.updateQuantity(itemId, maxValue);
      showNotification(`Maximum quantity is ${maxValue}!`, "error");
    } else if (newQuantity < 1) {
      $(this).val(1);
      sessionCartManager.updateQuantity(itemId, 1);
      showNotification("Minimum quantity is 1!", "error");
    } else {
      sessionCartManager.updateQuantity(itemId, newQuantity);
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
      sessionCartManager.removeFromCart(itemId);
      renderCartItems(); // Re-render to update totals
      showNotification("Item removed from cart!", "success");
    }
  });

  // Event handler for checkout button
  $("#checkout-btn").on("click", function () {
    const cartItems = sessionCartManager.getCartItems();
    if (cartItems.length > 0) {
      // Show checkout modal
      showCheckoutModal(cartItems);
    } else {
      showNotification("Your cart is empty!", "error");
    }
  });

  // Event handler for individual item checkout
  $(document).on("click", ".checkout-item-btn", function () {
    const itemId = parseInt($(this).data("item-id"));
    const cartItems = sessionCartManager
      .getCartItems()
      .filter((item) => item.item_id === itemId);

    if (cartItems.length > 0) {
      showCheckoutModal(cartItems);
    }
  });

  // Add logout handler for header logout button
  $(document).on("click", "#logout-btn", function (e) {
    e.preventDefault();
    logout();
  });
});

// Show checkout modal
function showCheckoutModal(cartItems) {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.item_price * item.quantity,
    0
  );

  const modalHTML = `
    <div class="modal fade" id="checkoutModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-shopping-cart"></i> Confirm Order
            </h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="order-summary">
              <h6>Order Summary</h6>
              <div class="order-items">
                ${cartItems
                  .map(
                    (item) => `
                  <div class="order-item">
                    <div class="item-info">
                      <strong>${item.item_name}</strong>
                      <span>$${item.item_price} × ${item.quantity}</span>
                    </div>
                    <div class="item-total">$${(
                      item.item_price * item.quantity
                    ).toFixed(2)}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <div class="order-total">
                <strong>Total: $${totalAmount.toFixed(2)}</strong>
              </div>
            </div>
            <div class="order-confirmation">
              <p>Are you sure you want to place this order?</p>
              <p class="text-muted">This will create an order and remove items from your cart.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              <i class="fas fa-times"></i> Cancel
            </button>
            <button type="button" class="btn btn-primary" id="confirm-order-btn" style = "font-color: white; background-color: black">
              <i class="fas fa-check"></i> Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove existing modal if any
  $("#checkoutModal").remove();

  // Add modal to body
  $("body").append(modalHTML);

  // Show modal
  $("#checkoutModal").modal("show");

  // Handle confirm order button
  $("#confirm-order-btn").on("click", function () {
    placeOrder(cartItems);
  });
}

// Place order function
async function placeOrder(cartItems) {
  const button = $("#confirm-order-btn");
  const originalText = button.html();

  // Disable button and show loading
  button.prop("disabled", true);
  button.html('<i class="fas fa-spinner fa-spin"></i> Processing...');

  try {
    const response = await createOrderAPI(cartItems);

    if (response.success) {
      // Clear cart after successful order
      cartItems.forEach((item) =>
        sessionCartManager.removeFromCart(item.item_id)
      );
      // Close modal
      $("#checkoutModal").modal("hide");

      // Show success message
      showNotification(
        "Order placed successfully! Order ID: " + response.data.order_id,
        "success"
      );

      // Reload cart page to show empty cart
      setTimeout(() => {
        location.reload();
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

// Create order API call
async function createOrderAPI(cartItems) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "POST",
      url: `http://${network.ip}:${network.port}/api/v1/checkout`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: JSON.stringify({ cartItems }),
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

// Make session cart manager available globally for other scripts
window.sessionCartManager = sessionCartManager;
