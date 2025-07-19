import request from "../helper/request.js";
import quickSearch from "../utils/quichSearch.js";
$(document).ready(function () {
  // Smooth scrolling for navigation links
  $('a[href^="#"]').on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 80,
          },
          1000
        );
    }
  });

  // Smooth scroll for Contact link to footer
  $(".contact-link").on("click", function (event) {
    event.preventDefault();
    var footer = $("#contact-footer");
    if (footer.length) {
      $("html, body").animate(
        {
          scrollTop: footer.offset().top,
        },
        1000
      );
    }
  });

  // Enhanced navbar background on scroll
  $(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Active nav link highlighting
  $(window).on("scroll", function () {
    var scrollPosition = $(window).scrollTop();

    $('.navbar-nav li a[href^="#"]').each(function () {
      var currentLink = $(this);
      var refElement = $(currentLink.attr("href"));

      if (
        refElement.length &&
        refElement.position().top <= scrollPosition + 100 &&
        refElement.position().top + refElement.height() > scrollPosition + 100
      ) {
        $(".navbar-nav li").removeClass("active");
        currentLink.parent().addClass("active");
      }
    });
  });

  // Search functionality
  $(".search-input").on("focus", function () {
    $(this).parent().addClass("active");
  });

  $(".search-input").on("blur", function () {
    $(this).parent().removeClass("active");
  });

  // Cart functionality
  $(".add-to-cart").on("click", function (e) {
    e.preventDefault();
    var currentCount = parseInt($(".cart-count").text()) || 0;
    $(".cart-count").text(currentCount + 1);

    // Add visual feedback
    $(this).text("Added!").addClass("btn-success");
    setTimeout(() => {
      $(this).text("Add to Cart").removeClass("btn-success");
    }, 2000);
  });

  // Quick view functionality
  $(".quick-view-btn").on("click", function (e) {
    e.preventDefault();
    alert("Quick view functionality would open a modal here");
  });

  // Mobile menu enhancements
  $(".navbar-toggle").on("click", function () {
    $(this).toggleClass("active");
  });

  // Dropdown menu enhancements
  $(".dropdown").on("show.bs.dropdown", function () {
    $(this).find(".dropdown-toggle").addClass("active");
  });

  $(".dropdown").on("hide.bs.dropdown", function () {
    $(this).find(".dropdown-toggle").removeClass("active");
  });

  // Search form submission
  $(".search-form form").on("submit", function (e) {
    e.preventDefault();
    var searchTerm = $(".search-input").val();
    if (searchTerm.trim()) {
      alert("Searching for: " + searchTerm);
      // Here you would implement actual search functionality
    }
  });

  // Animate elements on scroll
  $(window).scroll(function () {
    $(".category-card, .product-card").each(function () {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();

      if (elementBottom > viewportTop && elementTop < viewportBottom) {
        $(this).addClass("animate-in");
      }
    });
  });

  // let itemResource = new request("api/v1", "item-resource");
  // itemResource.getAll(
  //   (respose) => {
  //       console.log(respose)
  //     search(respose, ".search-input");
  //   },
  //   (error) => {
  //     console.log(error);
  //   }
  // );

  $(".search-input").on("input", (e) => {
    e.preventDefault();
    let value = $(".search-input").val();
    // console.log(value);
    if (value) {
      let search = new request("api/v1", "itemSearch");
      search.getById(
        value,
        (response) => {
          quickSearch(response, ".search-input");
        },
        (err) => {
          console.log(error);
        }
      );
    }
  });
});
