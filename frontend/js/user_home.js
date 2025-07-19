import request from "../helper/request.js";
import network from "../config/network.js";
import { pageRows, paginateHandler } from "../utils/pagination.js";

// Cart Management Functions (same as user_item.js)
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
  addToCart(item, quantity = 1) {
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

  // Get cart count
  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
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

  // Enhanced navbar background on scroll
  $(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Dropdown menu enhancements
  $(".dropdown").on("show.bs.dropdown", function () {
    $(this).find(".dropdown-toggle").addClass("active");
  });

  $(".dropdown").on("hide.bs.dropdown", function () {
    $(this).find(".dropdown-toggle").removeClass("active");
  });

  // Fetch and render featured products with pagination
  const productsContainer = $("#products-container");
  const itemRequest = new request("api/v1", "items");
  itemRequest.getAll(
    (response) => {
      const items = response.data;
      console.log("Raw items from API:", items);
      console.log("Number of items:", items ? items.length : 0);

      if (!items || items.length === 0) {
        productsContainer.append(
          '<div class="col-md-12"><p>No featured products found.</p></div>'
        );
        return;
      }

      // Split items into pages (4 products per page for testing)
      const itemsPerPage = 8;
      const paginatedItems = [];

      // Manually split items into pages
      for (let i = 0; i < items.length; i += itemsPerPage) {
        paginatedItems.push(items.slice(i, i + itemsPerPage));
      }

      console.log("Total items:", items.length);
      console.log("Items per page:", itemsPerPage);
      console.log("Number of pages:", paginatedItems.length);
      console.log("Paginated items:", paginatedItems);

      // Create product cards renderer function
      const renderProductCards = (pageItems) => {
        console.log("Rendering page items:", pageItems);
        productsContainer.empty();

        if (!pageItems || pageItems.length === 0) {
          productsContainer.append(
            '<div class="col-md-12"><p>No items on this page.</p></div>'
          );
          return;
        }

        pageItems.forEach((item) => {
          console.log("Rendering item:", item);
          let imgPath = item.item_img
            ? `http://${network.ip}:${network.port}/${item.item_img}`
            : "/assets/images/main.jpg";

          // Check if item is already in cart
          const cartItem = cartManager
            .getCartItems()
            .find((cartItem) => cartItem.item_id === item.item_id);
          const buttonText = cartItem ? "Update Cart" : "Add to Cart";
          const buttonClass = cartItem ? "update-cart" : "add-to-cart";

          productsContainer.append(`
            <div class="col-md-3">
              <div class="product-card" data-item-id="${item.item_id}">
                <div class="product-image-wrapper" style="cursor: pointer;">
                  <img class="product-image" src="${imgPath}" alt="${
            item.item_name
          }">
                </div>
                <div class="product-info">
                  <h5 class="product-title">${item.item_name}</h5>
                  <div class="product-price">$${item.item_price}</div>
                  <button class="${buttonClass}" data-item='${JSON.stringify(
            item
          )}'>${buttonText}</button>
                </div>
              </div>
            </div>
          `);
        });
      };

      // Set up custom pagination handler for product cards
      let main = $(".pagination");

      // Clear existing pagination elements
      main.empty();

      // Only show pagination if there are multiple pages
      if (paginatedItems.length > 1) {
        console.log("Creating pagination for", paginatedItems.length, "pages");
        paginatedItems.forEach((pageItems, index) => {
          console.log(`Page ${index + 1} has ${pageItems.length} items`);
          let rawElement = $("<li></li>");
          rawElement.attr({
            "data-page": index,
            id: index,
          });
          rawElement.html(`<a href="#" data-page="${index}">${index + 1}</a>`);
          main.append(rawElement);
        });

        console.log("Pagination elements created:", main.children().length);
      } else {
        console.log("Only one page, hiding pagination");
        main.hide();
      }

      // Set up click handlers
      $(main)
        .off("click")
        .on("click", (e) => {
          e.preventDefault();
          let el = $(e.target);
          let page = el.data("page");
          console.log("Clicked page:", page);

          if (page !== undefined) {
            let toPassData = paginatedItems[page];
            console.log("Data for page", page, ":", toPassData);
            renderProductCards(toPassData);

            // Update active state
            $(".pagination li").removeClass("active");
            el.parent().addClass("active");
          }
        });

      // Show first page by default
      if (paginatedItems.length > 0) {
        renderProductCards(paginatedItems[0]);
        $(".pagination li").first().addClass("active");
      }

      // Add click handlers for product card images (navigate to detail page)
      $(document).on("click", ".product-image-wrapper", function (e) {
        e.stopPropagation(); // Prevent event bubbling
        const itemId = $(this).closest(".product-card").data("item-id");
        if (itemId) {
          window.location.href = `/frontend/user/item/index.html?id=${itemId}`;
        }
      });

      // Add click handlers for cart buttons
      $(document).on("click", ".add-to-cart, .update-cart", function (e) {
        e.stopPropagation(); // Prevent event bubbling
        const itemData = $(this).data("item");
        if (itemData) {
          const success = cartManager.addToCart(itemData, 1);
          if (success) {
            // Show success notification
            showNotification("Item added to cart successfully!", "success");

            // Update button text and class
            const button = $(this);
            button
              .text("Update Cart")
              .removeClass("add-to-cart")
              .addClass("update-cart");

            // Visual feedback
            button.css({
              background: "#28a745",
              "border-color": "#28a745",
            });

            setTimeout(() => {
              button.css({
                background: "#000000",
                "border-color": "#000000",
              });
            }, 1000);
          }
        }
      });
    },
    (error) => {
      console.error("Error fetching featured products:", error);
      productsContainer.append(
        '<div class="col-md-12"><p>Error fetching featured products.</p></div>'
      );
    }
  );
});

// Notification function (same as user_item.js)
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

document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/user/me")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("user-name").textContent = data.name;
      document.getElementById("user-profile-picture").src = data.profilePicture;
    })
    .catch((err) => {
      console.error("Failed to load user info", err);
    });
});
