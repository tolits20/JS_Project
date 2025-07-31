import request from "../helper/request.js";
import network from "../config/network.js";
import { pageRows, paginateHandler } from "../utils/pagination.js";
import logout from "./logout.js";
import sessionCartManager from "../utils/cartManager.js";
import { showNotification } from "../utils/notification.js";
import { loadHeaderAndFooter } from "../utils/componentLoader.js";
import quichSearch from "../utils/quichSearch.js";

let allItems = []; // Store all items globally
const itemsPerPage = 8;

// Move renderProductCards to top-level
function renderProductCards(pageItems) {
  const productsContainer = $("#products-container");
  productsContainer.empty();
  if (!pageItems || pageItems.length === 0) {
    productsContainer.append(
      '<div class="col-md-12"><p>No items on this page.</p></div>'
    );
    return;
  }
  pageItems.forEach((item) => {
    let imgPath = item.item_img
      ? `http://${network.ip}:${network.port}/${item.item_img}`
      : "/frontend/assets/images/main.jpg";
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
            <img class="product-image" src="${imgPath}" alt="${item.item_name}">
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
}

$(document).ready(function () {
  // Load reusable components using the utility
  loadHeaderAndFooter(sessionCartManager);
  document.addEventListener("componentsLoaded", () => {
    $(document).on("click", "#logout-btn", function (e) {
      e.preventDefault();
      logout();
    });
  });
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
  // Fetch and populate categories
  const categoryRequest = new request("api/v1", "public/categories");
  categoryRequest.getAll(
    function (categories) {
      const dropdown = $("#category-filter");
      if (Array.isArray(categories)) {
        categories.forEach(function (cat) {
          dropdown.append(
            `<option value="${cat.category_id}">${cat.category_name}</option>`
          );
        });
      }
    },
    function (err) {
      console.error("Failed to fetch categories", err);
    }
  );
  // Fetch and render featured products with pagination
  let productsContainer = $("#products-container");
  let itemRequest = new request("api/v1", "items");

  function fetchAndRenderItems(categoryId) {
    let url = categoryId
      ? `${itemRequest.ipHost}/api/v1/items/by-category?category_id=${categoryId}`
      : `${itemRequest.ipHost}/api/v1/items`;
    $.ajax({
      method: "GET",
      url: url,
      headers: itemRequest.__getHeaders(),
      dataType: "json",
      success: function (response) {
        allItems = response.data;
        renderPaginatedItems(allItems);
      },
      error: function (err) {
        console.error("Error fetching items:", err);
        productsContainer
          .empty()
          .append(
            '<div class="col-md-12"><p>Error fetching products.</p></div>'
          );
      },
    });
  }

  function renderPaginatedItems(items) {
    const paginatedItems = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      paginatedItems.push(items.slice(i, i + itemsPerPage));
    }
    let main = $(".pagination");
    main.empty();
    if (paginatedItems.length > 1) {
      paginatedItems.forEach((pageItems, index) => {
        let rawElement = $("<li></li>");
        rawElement.attr({
          "data-page": index,
          id: index,
        });
        rawElement.html(`<a href="#" data-page="${index}">${index + 1}</a>`);
        main.append(rawElement);
      });
    } else {
      main.hide();
    }
    // Set up click handlers
    $(main)
      .off("click")
      .on("click", (e) => {
        e.preventDefault();
        let el = $(e.target);
        let page = el.data("page");
        if (page !== undefined) {
          let toPassData = paginatedItems[page];
          renderProductCards(toPassData);
          $(".pagination li").removeClass("active");
          el.parent().addClass("active");
        }
      });
    // Show first page by default
    if (paginatedItems.length > 0) {
      renderProductCards(paginatedItems[0]);
      $(".pagination li").first().addClass("active");
    } else {
      productsContainer
        .empty()
        .append('<div class="col-md-12"><p>No products found.</p></div>');
    }
  }

  // Read search query parameter from URL and filter items if present
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  if (searchParam) {
    // Wait for items to be fetched, then filter and render
    let originalFetchAndRender = fetchAndRenderItems;
    fetchAndRenderItems = function (categoryId) {
      originalFetchAndRender.call(this, categoryId);
      setTimeout(() => {
        const filteredItems = allItems.filter((item) =>
          item.item_name.toLowerCase().includes(searchParam.toLowerCase())
        );
        renderPaginatedItems(filteredItems);
      }, 500); // Wait for AJAX to complete
    };
  }

  // Initial fetch (all items)
  fetchAndRenderItems("");

  // Category filter change handler
  $(document).on("change", "#category-filter", function () {
    const selectedCategory = $(this).val();
    fetchAndRenderItems(selectedCategory);
  });

  // Add click handlers for product card images (navigate to detail page)
  $(document).on("click", ".product-image-wrapper", function (e) {
    e.stopPropagation();
    const itemId = $(this).closest(".product-card").data("item-id");
    if (itemId) {
      window.location.href = `http://${network.client.host}/frontend/user/item/index.html?id=${itemId}`;
    }
  });
  // Add click handlers for cart buttons
  $(document).on("click", ".add-to-cart, .update-cart", function (e) {
    e.stopPropagation();
    const itemData = $(this).data("item");
    if (itemData) {
      const success = sessionCartManager.addToCart(itemData, 1);
      if (success) {
        showNotification("Item added to cart successfully!", "success");
        const button = $(this);
        button
          .text("Update Cart")
          .removeClass("add-to-cart")
          .addClass("update-cart");
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
  // Listen for search form submit
  $(document).on("submit", ".navbar-form", function (e) {
    e.preventDefault();
    const searchTerm = $("#header-search-input").val().trim();
    if (searchTerm) {
      window.location.href = `/frontend/user/home_page.html?search=${encodeURIComponent(
        searchTerm
      )}`;
    } else {
      window.location.href = `/frontend/user/home_page.html`;
    }
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   fetch("/api/user/me")
//     .then((response) => response.json())
//     .then((data) => {
//       document.getElementById("user-name").textContent = data.name;
//       document.getElementById("user-profile-picture").src = data.profilePicture;
//     })
//     .catch((err) => {
//       console.error("Failed to load user info", err);
//     });

//   // Add logout handler for header logout button
//   $(document).on("click", "#logout-btn", function (e) {
//     e.preventDefault();
//     logout();
//   });
// });
