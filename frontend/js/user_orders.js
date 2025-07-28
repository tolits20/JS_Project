import network from "../config/network.js";
import sessionCartManager from "../utils/cartManager.js";
import { showNotification } from "../utils/notification.js";
import logout from "./logout.js";

// User Orders page functionality
class UserOrdersManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadOrders();
    this.setupNavbarScroll();
  }

  // Setup navbar scroll effect
  setupNavbarScroll() {
    $(window).scroll(function () {
      if ($(window).scrollTop() > 50) {
        $(".navbar").addClass("scrolled");
      } else {
        $(".navbar").removeClass("scrolled");
      }
    });
  }

  // Setup event listeners
  setupEventListeners() {
    // Store reference to 'this' for use in event handlers
    const self = this;

    // Logout handler
    $(document).on("click", "#logout-btn", function (e) {
      e.preventDefault();
      logout();
    });

    // Order action handlers
    $(document).on("click", ".view-order-btn", function (e) {
      const orderId = $(e.target).data("order-id");
      self.viewOrderDetails(orderId);
    });

    $(document).on("click", ".edit-order-btn", function (e) {
      const orderId = $(e.target).data("order-id");
      self.showEditModal(orderId);
    });

    $(document).on("click", ".cancel-order-btn", function (e) {
      const orderId = $(e.target).data("order-id");
      self.showCancelModal(orderId);
    });

    // Modal handlers
    $(document).on("click", "#saveOrderChanges", function () {
      self.saveOrderChanges();
    });

    $(document).on("click", "#confirmCancelOrder", function () {
      self.confirmCancelOrder();
    });
  }

  // Load user's order history
  async loadOrders() {
    try {
      const response = await this.fetchOrders();

      if (response.success) {
        this.renderOrders(response.data);
      } else {
        this.showError("Failed to load orders: " + response.message);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      this.showError("An error occurred while loading your orders.");
    }
  }

  // Fetch orders from API
  async fetchOrders() {
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
      container.html(`
        <div class="empty-orders">
          <i class="fas fa-shopping-bag"></i>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
          <a href="../home_page.html" class="btn btn-primary">
            <i class="fas fa-shopping-cart"></i> Start Shopping
          </a>
        </div>
      `);
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
            <button class="btn-edit" data-order-id="${order.order_id}" ${
        !canEdit ? "disabled" : ""
      }>
              <i class="fas fa-edit"></i> Edit Order
            </button>
            <button class="btn-cancel" data-order-id="${order.order_id}" ${
        !canCancel ? "disabled" : ""
      }>
              <i class="fas fa-times"></i> Cancel Order
            </button>
          </div>
        </div>
      `;
    });

    container.html(ordersHTML);
  }

  // View order details
  viewOrderDetails(orderId) {
    // Redirect to order details page
    window.location.href = `http://${network.client.host}/frontend/user/item/order_details.html?id=${orderId}`;
  }

  // Show edit modal
  showEditModal(orderId) {
    this.currentOrderId = orderId;

    // Get current order details
    this.fetchOrderDetails(orderId).then((order) => {
      if (order) {
        $("#editOrderStatus").val(order.order_status);
        $("#editOrderNotes").val(order.notes || "");
        $("#editOrderModal").modal("show");
      }
    });
  }

  // Show cancel modal
  showCancelModal(orderId) {
    this.currentOrderId = orderId;
    $("#cancelReason").val("");
    $("#cancelOrderModal").modal("show");
  }

  // Save order changes
  async saveOrderChanges() {
    const orderStatus = $("#editOrderStatus").val();
    const orderNotes = $("#editOrderNotes").val();

    try {
      const response = await this.updateOrderAPI(this.currentOrderId, {
        order_status: orderStatus,
        notes: orderNotes,
      });

      if (response.success) {
        showNotification("Order updated successfully!", "success");
        $("#editOrderModal").modal("hide");
        this.loadOrders(); // Reload orders
      } else {
        showNotification(
          response.message || "Failed to update order.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
      showNotification("An error occurred while updating the order.", "error");
    }
  }

  // Confirm cancel order
  async confirmCancelOrder() {
    const cancelReason = $("#cancelReason").val().trim();

    if (!cancelReason) {
      showNotification("Please provide a cancellation reason.", "error");
      return;
    }

    try {
      const response = await this.cancelOrderAPI(
        this.currentOrderId,
        cancelReason
      );

      if (response.success) {
        showNotification("Order cancelled successfully!", "success");
        $("#cancelOrderModal").modal("hide");
        this.loadOrders(); // Reload orders
      } else {
        showNotification(
          response.message || "Failed to cancel order.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      showNotification(
        "An error occurred while cancelling the order.",
        "error"
      );
    }
  }

  // Fetch order details for editing
  async fetchOrderDetails(orderId) {
    try {
      const response = await this.fetchOrderDetailsAPI(orderId);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  }

  // Cancel order (legacy method - now uses modal)
  async cancelOrder(orderId) {
    this.showCancelModal(orderId);
  }

  // Cancel order API call
  async cancelOrderAPI(orderId, reason) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "POST",
        url: `http://${network.ip}:${network.port}/api/v1/order/${orderId}/cancel`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: JSON.stringify({ reason }),
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

  // Update order API call
  async updateOrderAPI(orderId, orderData) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "PUT",
        url: `http://${network.ip}:${network.port}/api/v1/order/${orderId}/status`,
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

  // Fetch order details API call
  async fetchOrderDetailsAPI(orderId) {
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

  // Show error message
  showError(message) {
    const container = $("#orders-container");
    container.html(`
      <div class="empty-orders">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Orders</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">
          <i class="fas fa-refresh"></i> Try Again
        </button>
      </div>
    `);
  }

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

// Initialize user orders when document is ready
$(document).ready(function () {
  console.log("User Orders page loaded, initializing...");
  new UserOrdersManager();
});
