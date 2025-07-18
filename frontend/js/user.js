import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";
import formValidate from "../utils/validate.js";
import { dataTable } from "../../components/js/dataTable.js";
import { pageRows, paginateHandler } from "../utils/pagination.js";
import roleCheck from "../utils/redirection.js";

roleCheck()

const params = new URLSearchParams(window.location.search);

const id = params.get("id");
function getUser() {
  const getValues = new request("api/v1", `admin/user`);
  getValues.getById(
    id,
    (response) => {
      console.log(response);
      insertValues(response.data[0]);
    },
    (err) => console.error(err)
  );
}

function insertValues(data) {
  const main = $("#user-edit");
  main.find("#fullname").val(data.name);
  main.find("#email").val(data.email);
  main.find("#role").val(data.role);
  main.find("#location").val(data.city);
  main.find("#phone").val(data.contact);
  main.find("#status").val(data.is_active);
  main.find("#preview-name").text(data.name);
  main.find("#preview-email").text(data.email);

  const img = main
    .find("#imgPreview")
    .attr("src", `http://${network.ip}:${network.port}/${data.img}`);
}

if (id) getUser();

$("#userForm")
  .off("submit")
  .on("submit", (e) => {
    e.preventDefault();
    let valid = formValidate("#userForm", "user");
    if (!valid) return;

    const formData = new FormData($("#userForm")[0]);
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}=>${pair[1]}`);
    }

    const update = new request("api/v1", "admin/user");
    update.update(
      id,
      formData,
      (response) => {
        console.log(response);
        alert.notyf.success("User is updated successfully!");
      },
      (err) => {
        console.log(err);
        alert.notyf.error(
          "Failed to update the user information, Please try again later!"
        );
      }
    );
  });

//index.js
$("#user-table")
  .off("click")
  .on("click", "#btn-destroy", async (e) => {
    e.preventDefault();
    let target = $(e.target);
    let parent = target.closest("tr");
    const id = target.data("id");
    let result = await alert.deleteConfirmation(
      "Yes,delete it!",
      "Successfully deleted the user"
    );
    if (result) {
      const toDelete = new request("api/v1", "admin/user/softDelete");
      toDelete.delete(
        id,
        (response) => {
          console.log(response);
          parent.fadeOut(2500);
        },
        (err) => console.error(err)
      );
    }
  });

$(document)
  .off("change")
  .on("change", ".user-status", (e) => {
    e.preventDefault();
    let status = $(e.target).val();
    let id = $(e.target).data("id");
    console.log(status, "-", id);
    let update = new request("api/v1", "admin/status");
    update.update(
      id,
      { status },
      (response) => {
        console.log(response);
        alert.notyf.success("User status updated Successfully!");
      },
      (err) => {
        console.log(err);
        alert.notyf.error(
          "Failed to updated the user's status, Please try again later!"
        );
      }
    );
  });

document
  .getElementById("sidebar-dashboard")
  .setAttribute(
    "href",
    `http://${network.client.host}/frontend/admin/dashboard.html`
  );
document
  .getElementById("sidebar-user")
  .setAttribute(
    "href",
    `http://${network.client.host}/frontend/admin/user/index.html`
  );
document
  .getElementById("sidebar-item")
  .setAttribute(
    "href",
    `http://${network.client.host}/frontend/admin/item/index.html`
  );
document
  .getElementById("sidebar-order")
  .setAttribute(
    "href",
    `http://${network.client.host}/frontend/admin/orders/index.html`
  );

if (!id) {
  const tableData = new request("api/v1", "admin/user-all");
  tableData.getAll(
    async (response) => {
      console.log(response);
      let data = pageRows(response.data,10);
      console.log(data);
      paginateHandler(data, "user");
      // dataTable(response, "user");
    },
    (err) => {
      console.log(err);
    }
  );
}
