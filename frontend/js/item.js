import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";
import formValidate from "../utils/validate.js";
import { pageRows, paginateHandler } from "../utils/pagination.js";
import { roleCheck, errorStatus } from "../utils/redirection.js";
import sidebarLinks from "./sidebar-links.js";
roleCheck();



$(document).ready(function () {
  sidebarLinks()
  $(document)
    .off("click")
    .on("click", "#btn-destroy", (e) => {
      e.preventDefault();
      let id = $(e.target).data("id");
      let parent = e.target.closest("tr");
      console.log(parent);
      let item = new request("api/v1", "admin/item");
      item.delete(
        id,
        (response) => {
          console.log(response);
          alert.notyf.success("Item deleted successfully!");
          $(parent).fadeOut(2500);
        },
        (err) => {
          console.log(err);
          errorStatus(err.status);
          alert.notyf.error(
            "Failed to delete the item, Please try again later!"
          );
        }
      );
    });
});

//edit.html
const param = new URLSearchParams(window.location.search);
const id = param.get("id");

const editItem = async () => {
  const getItem = new request("api/v1", "admin/item");
  getItem.getById(
    id,
    (response) => {
      console.log(response);
      // alert.notyf.success("successfully get user");
      InsertValues(response);
    },
    (err) => {
      console.error(err);
      errorStatus(err.status);
    }
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
  mainPreview
    .find("#imgPreview")
    .attr(
      "src",
      `http://${network.ip}:${network.port}/${data.item[0].item_img}`
    );
  let categories = data.categories;
  for (let i = 0; i < categories.length; i++) {
    const opt = document.createElement("option");
    opt.value = categories[i].category_id;
    opt.text = categories[i].category_name;
    opt.selected =
      data.item.category_name === categories.category_name ? true : false;
    mainPreview.find("#category").append(opt);
  }
  let galleryImg = data.gallery;
  const gallery = document.getElementById("itemGallery");
  const addBtn = gallery.querySelector(".add-image-btn");

  galleryImg.forEach((img) => {
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";
    wrapper.innerHTML = ` <img src="http://${network.ip}:${network.port}/${img.item_path}" alt="Gallery Image" />
             <button class="delete-btn" data-id=${img.img_id} onclick="removeImage(this)" type="button">×</button>`;
    gallery.insertBefore(wrapper, addBtn);
  });
}
if (id) editItem();

// single file item upload
$("#item_image")
  .off("change")
  .on("change", (e) => {
    let valid = formValidate("#item_image", "image", "item_img");
    if (!valid) return;
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

      const item = new request("api/v1", "admin/item");
      item.update(
        id + "/item",
        payload,
        (response) => {
          console.log(response);
          alert.notyf.success("Item successfully updated!");
        },
        (err) => {
          console.error(err);
          errorStatus(err.status);
          alert.notyf.error("Failed to update the item, please try again!");
        }
      );
    }
  });

$("#itemForm").submit(function (e) {
  e.preventDefault();
  let valid = formValidate("#itemForm", "item");
  if (!valid) return;
  const formData = new FormData($(this)[0]);
  let payload = new Object();
  formData.delete("item_image");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}=>${pair[1]}`);
    payload[pair[0]] = pair[1];
  }
  const update = new request("api/v1", "admin/item");
  update.update(
    id,
    payload,
    (response) => {
      console.log(response);
      alert.notyf.success("Successfully updated the item!");
    },
    (err) => {
      console.log(err);
      errorStatus(err.status);
      alert.notyf.error("Failed to update the item, please try again!");
    }
  );
});

function addImage() {
  let payload = new FormData();
  payload.append("item_id", id);
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    const gallery = document.getElementById("itemGallery");
    const addBtn = gallery.querySelector(".add-image-btn");

    files.forEach((file) => {
      const reader = new FileReader();
      payload.append("image", file);
      reader.onload = (event) => {
        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";
        wrapper.innerHTML = ` <img src="${event.target.result}" alt="Gallery Image" />
             <button class="delete-btn" onclick="removeImage(this)" type="button">×</button>`;
        gallery.insertBefore(wrapper, addBtn);
      };
      reader.readAsDataURL(file);
    });
    payload.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key} => ${value.name}`);
      } else {
        console.log(`${key} => ${value}`);
      }
    });
    const insertImage = new request("api/v1", "admin/item/gallery");
    insertImage.update(
      id + "/items",
      payload,
      (response) => {
        console.log(response);
        alert.notyf.success("Successfully added to the item gallery!");
      },
      (err) => {
        console.log(err);
        errorStatus(err.status);
        alert.notyf.error(
          "Failed to add images on item gallery, please try again!"
        );
      }
    );
  };
  input.click();
}
window.addImage = addImage;

function removeImage(button) {
  let target = $(button).closest(".delete-btn").data("id");
  console.log(target);
  const toDelete = new request("api/v1", "admin/item/gallery");
  toDelete.delete(
    target,
    (response) => {
      console.log(response);
      alert.notyf.success("Successfully deleted from the gallery.");
      button.parentElement.remove();
    },
    (err) => {
      console.log(err);
      errorStatus(err.status);
      alert.notyf.error(
        "Failed to delete the image from the gallery, please try again!"
      );
    }
  );
}
window.removeImage = removeImage;

if (!id) {
  const allItems = new request("api/v1", "admin/item-all");
  allItems.getAll(
    (response) => {
      console.log(response);
      let data = pageRows(response.data, 10);
      paginateHandler(data, "item");
    },
    (err) => {
      console.log(err);
      errorStatus(err.status);
    }
  );
}
