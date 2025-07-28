import { dataTable } from "../components/js/dataTable.js";

export function paginatorNavigation(num) {
  let rawElement = $("<li></li>");
  rawElement.attr({
    "data-page": num - 1,
    id: num - 1,
  });
  rawElement.text(num);
  $(".pagination").children().eq(-1).before(rawElement);
  // $('.pagination').append(rawElement);
}

export function pageRows(data, rows) {
  let newArr = new Array();
  let subArray = new Array();

  for (let i = 0; i < data.length; i++) {
    subArray.push(data[i]);
    if (subArray.length >= rows) {
      newArr.push(subArray);
      subArray = [];
      paginatorNavigation(newArr.length);
    }
    if (
      i - data.length <= rows &&
      i + 1 == data.length &&
      i - data.length <= rows
    ) {
      newArr.push(subArray);
      paginatorNavigation(newArr.length);
    }
  }

  return newArr;
}

export function paginateHandler(data, table) {
  let main = $(".pagination");
  $(main)
    .off("click")
    .on("click", (e) => {
      let el = $(e.target);
      let currID = $(el).attr("id");
      let prevID = parseInt($(main).find(".active").attr("id"));
      let toDeactivate = $(main).find(".active").attr("class", "");
      let index =  isNaN(prevID) ? 0 : prevID ;
      // console.log(typeof currID)
      // console.log(typeof prevID)
      if (currID === "next") {
        index++;
        passData();
      } else if (currID === "prev") {
        index--;
        passData();
      } else {
        index = parseInt(currID)
        passData();
      }
      function passData() {
        let toPassData = data[index];
        $(main).find(`#${index}`).attr("class", "active");
        dataTable(toPassData, table);
      }
    });
  document.getElementById("0").click();
}
