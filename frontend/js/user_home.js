import request from "../helper/request.js";
import network from "../config/network.js";

$(document).ready(function () {
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

  // Fetch and render featured products
  const featuredRow = $("#shop .row");
  featuredRow.empty();
  const itemRequest = new request("api/v1", "items");
  itemRequest.getAll(
    (response) => {
      const items = response.data;
      if (!items || items.length === 0) {
        featuredRow.append(
          '<div class="col-md-12"><p>No featured products found.</p></div>'
        );
        return;
      }
      items.forEach((item) => {
        let imgPath = item.item_img
          ? `http://${network.ip}:${network.port}/${item.item_img}`
          : "/assets/images/main.jpg";
        featuredRow.append(`
  <div class="col-md-3">
    <div class="product-card">
      <div class="product-image-wrapper">
        <img class="product-image" src="http://${network.ip}:${network.port}/${item.item_img}" alt="${item.item_name}">
        <div class="product-overlay">
          <button class="quick-view-btn">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <h5 class="product-title">${item.item_name}</h5>
        <div class="product-price">$${item.item_price}</div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    </div>
  </div>
`);
      });
    },
    (error) => {
      console.error("Error fetching featured products:", error);
      featuredRow.append(
        '<div class="col-md-12"><p>Error fetching featured products.</p></div>'
      );
    }
  );
});
