import network from "../config/network.js";
import { showNotification } from "../utils/notification.js";

// Order Editor functionality
class OrderEditor {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Edit order button handler
    $(document).on("click", ".edit-order-btn", (e) => {
      const orderId = $(e.currentTarget).data("order-id");
      this.loadOrderDetailsForEdit(orderId);
    });

    // Save changes button
    $(document).on("click", "#save-order-changes", () => {
      this.saveOrderChanges();
    });
  }

  // Load order details for editing
  async loadOrderDetailsForEdit(orderId) {
    // Show modal with loading state
    $("#editOrderModal").modal("show");
    $("#edit-order-loading").show();
    $("#edit-order-content").hide();

    try {
      const response = await this.fetchOrderDetails(orderId);

      if (response.success) {
        this.populateEditModal(response.data);
      } else {
        showNotification(
          "Failed to load order details: " + response.message,
          "error"
        );
        $("#editOrderModal").modal("hide");
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      showNotification(
        "An error occurred while loading order details.",
        "error"
      );
      $("#editOrderModal").modal("hide");
    }
  }

  // Fetch order details from API
  async fetchOrderDetails(orderId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "GET",
        url: `http://${network.ip}:${network.port}/api/v1/order/${orderId}`,
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

  // Populate edit modal with order data
  populateEditModal(orderData) {
    // Hide loading, show content
    $("#edit-order-loading").hide();
    $("#edit-order-content").show();

    // Populate order information
    $("#edit-order-id").text(orderData.order_id);
    $("#edit-order-date").text(
      new Date(orderData.order_placed).toLocaleDateString()
    );
    $("#edit-order-status").text(this.getStatusText(orderData.order_status));
    $("#edit-order-total-items").text(
      orderData.items ? orderData.items.length : 0
    );

    // Populate order items - check different possible data structures
    const items =
      orderData.items || orderData.order_items || orderData.orderlines || [];
    this.renderEditOrderItems(items);

    // Calculate and update totals
    this.updateEditOrderTotals();

    // Setup event listeners for quantity controls
    this.setupEditModalEventListeners();
  }

  // Render order items in edit modal
  renderEditOrderItems(items) {
    const container = $("#edit-order-items-container");

    if (!items || items.length === 0) {
      container.html('<p class="text-muted">No items found in this order.</p>');
      return;
    }

    let itemsHTML = "";
    items.forEach((item, index) => {
      // Handle different possible field names for item data
      const itemId = item.item_id || item.id;
      const orderlineId = item.orderline_id || item.id;
      const itemName = item.item_name || item.name || "Unknown Item";

      // Get price from order_price field (based on API structure)
      const itemPrice = parseFloat(
        item.order_price || item.item_price || item.price || 0
      );

      const quantity = parseInt(item.qty || item.quantity || 1);
      const imgPath =
        item.item_img || item.image
          ? `http://${network.ip}:${network.port}/${
              item.item_img || item.image
            }`
          : "/assets/images/main.jpg";

      itemsHTML += `
        <div class="order-item-edit" data-item-id="${itemId}" data-orderline-id="${orderlineId}">
          <img src="${imgPath}" alt="${itemName}" class="order-item-image">
          <div class="order-item-details">
            <div class="order-item-name">${itemName}</div>
            <div class="order-item-price">$${itemPrice.toFixed(
              2
            )} per item</div>
            <div class="quantity-controls">
              <button class="quantity-btn decrease-btn" data-item-id="${itemId}">
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" class="quantity-input" value="${quantity}" 
                     min="1" max="99" data-item-id="${itemId}" data-price="${itemPrice}">
              <button class="quantity-btn increase-btn" data-item-id="${itemId}">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="item-total">$${(itemPrice * quantity).toFixed(2)}</div>
        </div>
      `;
    });

    container.html(itemsHTML);
  }

  // Update totals in edit modal
  updateEditOrderTotals() {
    let subtotal = 0;
    let totalItems = 0;

    $(".order-item-edit").each(function () {
      const quantity = parseInt($(this).find(".quantity-input").val()) || 0;
      const price =
        parseFloat($(this).find(".quantity-input").data("price")) || 0;
      const itemTotal = quantity * price;

      subtotal += itemTotal;
      totalItems += quantity;

      // Update individual item total
      $(this)
        .find(".item-total")
        .text("$" + itemTotal.toFixed(2));
    });

    $("#edit-order-subtotal").text(subtotal.toFixed(2));
    $("#edit-order-total").text(subtotal.toFixed(2));
    $("#edit-order-summary-items").text(totalItems);
  }

  // Setup event listeners for edit modal
  setupEditModalEventListeners() {
    // Quantity decrease button
    $(document)
      .off("click", ".decrease-btn")
      .on("click", ".decrease-btn", function () {
        const input = $(this).siblings(".quantity-input");
        let currentValue = parseInt(input.val()) || 1;

        if (currentValue > 1) {
          input.val(currentValue - 1);
          window.orderEditor.updateEditOrderTotals();
        }
      });

    // Quantity increase button
    $(document)
      .off("click", ".increase-btn")
      .on("click", ".increase-btn", function () {
        const input = $(this).siblings(".quantity-input");
        let currentValue = parseInt(input.val()) || 1;
        const maxValue = parseInt(input.attr("max")) || 99;

        if (currentValue < maxValue) {
          input.val(currentValue + 1);
          window.orderEditor.updateEditOrderTotals();
        }
      });

    // Quantity input change
    $(document)
      .off("change", ".quantity-input")
      .on("change", ".quantity-input", function () {
        let value = parseInt($(this).val()) || 1;
        const min = parseInt($(this).attr("min")) || 1;
        const max = parseInt($(this).attr("max")) || 99;

        if (value < min) value = min;
        if (value > max) value = max;

        $(this).val(value);
        window.orderEditor.updateEditOrderTotals();
      });
  }

  // Save order changes
  async saveOrderChanges() {
    const button = $("#save-order-changes");
    const originalText = button.html();

    // Disable button and show loading
    button.prop("disabled", true);
    button.html('<i class="fas fa-spinner fa-spin"></i> Saving...');

    try {
      // Collect updated quantities
      const updatedItems = [];
      $(".order-item-edit").each(function () {
        const orderlineId = $(this).data("orderline-id");
        const quantity = parseInt($(this).find(".quantity-input").val()) || 1;

        updatedItems.push({
          orderline_id: orderlineId,
          qty: quantity,
        });
      });

      const orderId = $("#edit-order-id").text();

      // Send update request
      const response = await this.updateOrderAPI(orderId, {
        items: updatedItems,
      });

      if (response.success) {
        showNotification("Order updated successfully!", "success");
        $("#editOrderModal").modal("hide");

        // Reload orders list if on orders page
        if (window.checkoutManager && window.checkoutManager.loadUserOrders) {
          window.checkoutManager.loadUserOrders();
        }
      } else {
        showNotification(
          response.message || "Failed to update order.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
      showNotification("An error occurred while updating the order.", "error");
    } finally {
      // Re-enable button
      button.prop("disabled", false);
      button.html(originalText);
    }
  }

  // Update order API call
  async updateOrderAPI(orderId, orderData) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "PUT",
        url: `http://${network.ip}:${network.port}/api/v1/order/${orderId}`,
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

// Initialize order editor when document is ready
document.addEventListener("DOMContentLoaded", function () {
  if (typeof $ !== "undefined") {
    window.orderEditor = new OrderEditor();
  } else {
    setTimeout(function () {
      if (typeof $ !== "undefined") {
        window.orderEditor = new OrderEditor();
      }
    }, 100);
  }
});
