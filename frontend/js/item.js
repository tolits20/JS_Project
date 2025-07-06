import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";

const param = new URLSearchParams(window.location.search);
const id = param.get("id");

const editItem = async () => {
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
};

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
if (id) editItem();

$("#item_image")
  .off("change")
  .on("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      //   console.log(file);
      let reader = new FileReader();
      reader.onload = (event) => {
        $("#imgPreview").attr("src", event.target.result);
      };
      reader.readAsDataURL(file);
      const payload = new FormData();
      payload.append("image", file);
      payload.append("flag", "item");

      const item = new request("api/v1", "admin/item/single");
      item.update(
        id + "/item",
        payload,
        (response) => {
          console.log(response);
          alert.notyf.success("Item successfully updated!");
        },
        (err) => {
          console.error(err);
          alert.notyf.error("Failed to update the item, please try again!");
        }
      );
    }
  });
