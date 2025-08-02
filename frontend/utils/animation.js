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
};

export default animation;
