const animation = {
  rowFadeOut: (element, timer = 300) => {
    const $row = $(element).closest("tr");

    $row.css({
      overflow: "hidden",
      display: "table-row",
    });

    $row.children("td").wrapInner('<div class="slide-wrapper" />');

    $row.find(".slide-wrapper").animate(
      {
        opacity: 0,
        paddingLeft: "50px",
      },
      timer
    );

    $row.animate(
      {
        height: 0,
      },
      timer,
      function () {
        $row.remove();
      }
    );
  },
   rowDeleteEffect:(element, timer = 1000) =>{
  // Inject styles only once
  if (!document.getElementById("row-delete-effect-style")) {
    const style = document.createElement("style");
    style.id = "row-delete-effect-style";
    style.textContent = `
      .strike-line-container {
        position: relative;
      }
      .strike-line::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        height: 2px;
        width: 0;
        background: red;
        animation: strikeThrough 0.5s forwards;
        z-index: 5;
      }
      @keyframes strikeThrough {
        to {
          width: 100%;
        }
      }
      .slide-wrapper {
        display: block;
      }
    `;
    document.head.appendChild(style);
  }

  const $row = $(element).closest("tr");

  // Step 1: Add classes for strike-through
  $row.children("td").each(function () {
    const $td = $(this);
    if (!$td.hasClass("strike-line-container")) {
      $td.addClass("strike-line-container");
    }
    if (!$td.hasClass("strike-line")) {
      $td.addClass("strike-line");
    }
  });

  // Step 2: After strike, animate content fade & slide
  setTimeout(() => {
    // Wrap inner content
    $row.children("td").wrapInner('<div class="slide-wrapper" />');

    // Animate content left + fade
    $row.find(".slide-wrapper").animate({
      opacity: 0,
      paddingLeft: "100px"
    }, 400);

    // Animate row height collapse
    $row.animate({ height: 0 }, 400, () => {
      $row.remove();
    });
  }, 500); // After strike animation finishes
}

};

export default animation;
