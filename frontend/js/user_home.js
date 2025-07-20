import request from "../helper/request.js";
import network from "../config/network.js";
import { pageRows, paginateHandler } from "../utils/pagination.js";
import logout from "./logout.js";
import sessionCartManager from "../utils/cartManager.js";
import { showNotification } from "../utils/notification.js";
import { loadHeaderAndFooter } from "../utils/componentLoader.js";

$(document).ready(function () {
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
          const cartItem = sessionCartManager
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
          const success = sessionCartManager.addToCart(itemData, 1);
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

  // Add logout handler for header logout button
  $(document).on("click", "#logout-btn", function (e) {
    e.preventDefault();
    logout();
  });
});
