import network from "../config/network.js";
import request from "../helper/request.js";
import sessionCartManager from "../utils/cartManager.js";
import { showNotification } from "../utils/notification.js";
import { loadHeaderAndFooter } from "../utils/componentLoader.js";
import logout from "./logout.js";

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

// === REVIEWS FUNCTIONALITY ===
function getItemId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function loadReviews() {
  const itemId = getItemId();

  // Use fetch for public endpoint (no auth required)
  fetch(
    `http://${network.ip}:${network.port}/api/v1/item-reviews?item_id=${itemId}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data.data || data.data.length === 0) {
        document.getElementById("reviews-list").innerHTML =
          "<p>No reviews yet.</p>";
        return;
      }

      let html = "";
      data.data.forEach((review) => {
        html += `<div class="review" style="border-bottom: 1px solid #eee; margin-bottom: 15px; padding-bottom: 15px;">`;
        html += `<strong>${
          review.user_name || "Anonymous"
        }</strong> <span style="color: #ffc107;">★ ${review.rating}/5</span>`;
        html += `<p style="margin-top: 5px;">${review.comment || ""}</p>`;
        html += `</div>`;
      });
      document.getElementById("reviews-list").innerHTML = html;
    })
    .catch((error) => {
      console.error("Failed to load reviews:", error);
      document.getElementById("reviews-list").innerHTML =
        "<p>Failed to load reviews.</p>";
    });
}

function checkCanReview() {
  const itemId = getItemId();
  const token = localStorage.getItem("token");

  if (!token) {
    document.getElementById("my-review-actions").innerHTML =
      '<p style="color: gray;">Please log in to review this item.</p>';
    return;
  }

  fetch(
    `http://${network.ip}:${network.port}/api/v1/orders/can_review?item_id=${itemId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.can_review) {
        // Check if user already has a review
        const reviewRequest = new request(
          "api/v1",
          `reviews/my?item_id=${itemId}`
        );
        reviewRequest.getAll(
          function (myReview) {
            if (myReview.data && Object.keys(myReview.data).length > 0) {
              // User has a review, show edit button (open modal)
              document.getElementById(
                "my-review-actions"
              ).innerHTML = `<button class="btn btn-primary" id="edit-review-btn">Edit Your Review</button>`;
              $(document).on("click", "#edit-review-btn", function () {
                openReviewModal(myReview.data);
              });
            } else {
              // No review yet, show create button (open modal)
              document.getElementById(
                "my-review-actions"
              ).innerHTML = `<button class="btn btn-success" id="write-review-btn">Write a Review</button>`;
              $(document).on("click", "#write-review-btn", function () {
                openReviewModal();
              });
            }
          },
          function (error) {
            console.error("Failed to check my review:", error);
            if (error && error.status === 401) {
              document.getElementById("my-review-actions").innerHTML =
                '<p style="color: gray;">Please log in to review this item.</p>';
            } else {
              // Show create button as fallback
              document.getElementById(
                "my-review-actions"
              ).innerHTML = `<button class="btn btn-success" id="write-review-btn">Write a Review</button>`;
              $(document).on("click", "#write-review-btn", function () {
                openReviewModal();
              });
            }
          }
        );
      } else {
        document.getElementById("my-review-actions").innerHTML =
          '<p style="color: gray;">Only users with shipped orders can review this item.</p>';
      }
    })
    .catch((error) => {
      console.error("Failed to check review eligibility:", error);
      document.getElementById("my-review-actions").innerHTML =
        '<p style="color: gray;">Unable to check review eligibility.</p>';
    });
}

// Modal logic
function openReviewModal(existingReview) {
  // Reset form
  $("#modal-review-form")[0].reset();
  $("#modal-message").hide();
  // Set default rating
  let rating = 5;
  let comment = "";
  if (existingReview) {
    rating = existingReview.rating;
    comment = existingReview.comment || "";
    $("#reviewModalLabel").text("Edit Your Review");
    $("#modal-review-form button[type='submit']").text("Update Review");
  } else {
    $("#reviewModalLabel").text("Write a Review");
    $("#modal-review-form button[type='submit']").text("Submit Review");
  }
  $("#modal-rating").val(rating);
  $("#modal-comment").val(comment);
  // Set stars
  $(".modal-star").each(function (i) {
    if (i < rating) {
      $(this).addClass("active");
      $(this).css("color", "#ffc107");
    } else {
      $(this).removeClass("active");
      $(this).css("color", "#ddd");
    }
  });
  // Show modal
  $("#reviewModal").modal("show");
  // Store review id for update
  $("#modal-review-form").data(
    "review-id",
    existingReview ? existingReview.id : null
  );
}

// Star rating logic for modal
$(document).on("click", ".modal-star", function () {
  const rating = $(this).data("rating");
  $("#modal-rating").val(rating);
  $(".modal-star").each(function (i) {
    if (i < rating) {
      $(this).addClass("active");
      $(this).css("color", "#ffc107");
    } else {
      $(this).removeClass("active");
      $(this).css("color", "#ddd");
    }
  });
});

// Handle review form submit
$(document).on("submit", "#modal-review-form", function (e) {
  e.preventDefault();
  const itemId = getItemId();
  const rating = $("#modal-rating").val();
  const comment = $("#modal-comment").val();
  const token = localStorage.getItem("token");
  const reviewId = $(this).data("review-id");
  const $submitBtn = $(this).find("button[type='submit']");
  $submitBtn.prop("disabled", true).text("Submitting...");

  // Minimal AJAX helper for review create/update
  function showModalMessage(text, type) {
    $("#modal-message")
      .removeClass()
      .addClass("alert alert-" + type)
      .text(text)
      .show();
  }

  let ajaxOptions = {
    method: reviewId ? "PUT" : "POST",
    url: reviewId
      ? `http://${network.ip}:${network.port}/api/v1/reviews/${reviewId}`
      : `http://${network.ip}:${network.port}/api/v1/reviews`,
    contentType: "application/json",
    data: JSON.stringify({
      item_id: itemId,
      rating: parseInt(rating),
      comment: comment,
    }),
    headers: {
      Authorization: "Bearer " + token,
      "Cache-Control": "no-cache",
    },
    dataType: "json",
    success: function (data) {
      if (data === "successful") {
        showModalMessage("Review submitted successfully!", "success");
        setTimeout(() => {
          $("#reviewModal").modal("hide");
          loadReviews();
          checkCanReview();
        }, 1200);
      } else {
        showModalMessage(
          "Failed to submit review. Please try again.",
          "danger"
        );
        $submitBtn
          .prop("disabled", false)
          .text(reviewId ? "Update Review" : "Submit Review");
      }
    },
    error: function (xhr) {
      showModalMessage("An error occurred. Please try again.", "danger");
      $submitBtn
        .prop("disabled", false)
        .text(reviewId ? "Update Review" : "Submit Review");
    },
  };
  $.ajax(ajaxOptions);
});

// Load reviews when page loads
$(document).ready(function () {
  loadReviews();
  checkCanReview();
});

// Make session cart manager available globally for other scripts
window.sessionCartManager = sessionCartManager;
