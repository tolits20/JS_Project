import network from "../config/network.js";
import logout from "./logout.js";
import sessionCartManager from "../utils/cartManager.js";
import { showNotification } from "../utils/notification.js";
import { loadHeaderAndFooter } from "../utils/componentLoader.js";

$(document).ready(function () {
  // Load reusable components using the utility
  loadHeaderAndFooter(sessionCartManager);

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
      const success = sessionCartManager.addToCart(currentItem, quantity);
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
          const cartItem = sessionCartManager
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

// Make session cart manager available globally for other scripts
window.sessionCartManager = sessionCartManager;
