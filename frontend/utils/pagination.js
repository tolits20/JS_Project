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
      console.log(el.data("page"));
      let page = el.data("page");
      let toPassData = data[page];
      console.log(toPassData);
      dataTable(toPassData, table);
    });
  document.getElementById("0").click();
}
