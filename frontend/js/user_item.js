import network from "../config/network.js";

// Function to load HTML components
function loadComponent(containerId, componentPath) {
  fetch(componentPath)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(containerId).innerHTML = html;
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
    if (currentValue < 15) {
      quantityInput.value = currentValue + 1;
    }
  });

  // Load item details based on URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id");

  if (itemId) {
    // Fetch item details from API
    fetch(`http://${network.ip}:${network.port}/api/v1/items/${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data; // New API returns data directly

          // Update page content with item details
          document.getElementById("item-title").textContent = item.item_name;
          document.getElementById("item-category").textContent =
            item.category_name || "Handbags";
          document.getElementById(
            "item-price"
          ).textContent = `$${item.item_price}`;
          document.getElementById("item-description").textContent =
            item.item_desc ||
            "Premium quality item with exceptional craftsmanship.";

          // Update image
          const itemImage = document.getElementById("item-main-image");
          if (item.item_img) {
            itemImage.src = `http://${network.ip}:${network.port}/${item.item_img}`;
          }

          // Update stock information
          const stockElement = document.getElementById("item-stock");
          const stockQty = item.stock_qty || 15;
          stockElement.innerHTML = `<span class="stock-available">✓ In Stock: ${stockQty} available</span>`;

          // Update quantity max value
          quantityInput.max = stockQty;
        } else {
          console.error("Item not found or API error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error loading item details:", error);
      });
  }
});
