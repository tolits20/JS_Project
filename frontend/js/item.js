import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";

const param = new URLSearchParams(window.location.search);
const id = param.get("id");

const getItem = new request("api/v1", "admin/item");
getItem.getById(
  id,
  (response) => {
    console.log(response);
    alert.notyf.success("successfully get user");
    InsertValues(response);
  },
  (err) => console.error(err)
);

function InsertValues(data) {
  const mainPreview = $(".profile-container");
  mainPreview.find(".profile-name").text(data.item[0].item_name);
  mainPreview
    .find(".price-tag")
    .text("₱ " + data.item[0].item_price.toFixed(2));
  mainPreview.find("#item_name").val(data.item[0].item_name);
  mainPreview.find("#item_price").val(data.item[0].item_price.toFixed(2));
  mainPreview.find("#item_stocks").val(data.item[0].qty);
  mainPreview.find("#description").val(data.item[0].item_desc);
  let categories = data.categories;
  for (let i = 0; i < categories.length; i++) {
    const opt = document.createElement("option");
    opt.value = categories[i].category_id;
    opt.text = categories[i].category_name;
    opt.selected =
      data.item.category_name === categories.category_name ? true : false;

    mainPreview.find("#category").append(opt);
  }
}
