import request from "../helper/request.js";
import network from "../config/network.js";

let allItems = [];
const itemsPerPage = 8;

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
      : "/assets/images/main.jpg";
    productsContainer.append(`
      <div class="col-md-3">
        <div class="product-card" data-item-id="${item.item_id}">
          <div class="product-image-wrapper" style="cursor: pointer;">
            <img class="product-image" src="${imgPath}" alt="${item.item_name}">
          </div>
          <div class="product-info">
            <h5 class="product-title">${item.item_name}</h5>
            <div class="product-price">$${item.item_price}</div>
            <button class="login-to-shop" onclick="window.location.href='/frontend/login.html'">Login to Shop</button>
          </div>
        </div>
      </div>
    `);
  });
}

$(document).ready(function () {
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
      window.location.href = `/frontend/user/item/index.html?id=${itemId}`;
    }
  });

  // Listen for search form submit
  $(document).on("submit", ".navbar-form", function (e) {
    e.preventDefault();
    const searchTerm = $("#header-search-input").val().trim().toLowerCase();
    let filteredItems = allItems;
    if (searchTerm) {
      filteredItems = allItems.filter((item) =>
        item.item_name.toLowerCase().includes(searchTerm)
      );
    }
    // Re-paginate and render filtered items
    const paginatedItems = [];
    for (let i = 0; i < filteredItems.length; i += itemsPerPage) {
      paginatedItems.push(filteredItems.slice(i, i + itemsPerPage));
    }
    renderProductCards(paginatedItems[0] || []);
  });
});
