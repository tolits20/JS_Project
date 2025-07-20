import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";
import formValidate from "../utils/validate.js";
import { pageRows, paginateHandler } from "../utils/pagination.js";
import { roleCheck, errorStatus } from "../utils/redirection.js";
import sidebarLinks from "./sidebar-links.js";
roleCheck();

$(document).ready(function () {
  sidebarLinks();
  const categoryTable = new request("api/v1", "categoryTable");
  categoryTable.getAll(
    (response) => {
      let data = pageRows(response.result, 10);
      paginateHandler(data, "category");
    },
    (err) => {
      console.log(error);
    }
  );

  $("#category-table")
    .on("click", "#btn-destroy", async (e) => {
      e.preventDefault();
      let target = $(e.target);
      let parent = target.closest("tr");
      const id = target.data("id");
      console.log(id);
      let result = await alert.deleteConfirmation(
        "Yes,delete it!",
        "Successfully deleted the user"
      );
      if (result) {
        const toDelete = new request("api/v1", "category/delete");
        toDelete.delete(
          id,
          (response) => {
            console.log(response);
            parent.fadeOut(2500);
          },
          (err) => {
            errorStatus(err.status);
            console.error(err);
          }
        );
      }
    });

  $("#category-table")
    .on("click", ".btnEdit", async (e) => {
      e.preventDefault();
      let target = $(e.target);
      let parent = target.closest("tr");
      const id = target.data("id");
      const td = $(parent).children()[0]
      const value = $(td).text()
      console.log(value)
      Swal.fire({
        title: "Update Category",
        html: ` <input type="text" value =${value} id="categoryName" class="swal2-input" placeholder="Category Name">`,
        focusConfirm: false,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          let data = {
            category_name: document.getElementById("categoryName").value.trim(),
          };
          console.log(data);
          const sendRequest = new request("api/v1", "category/update");
          sendRequest.update(
            id,
            data,
            (response) => {
              console.log(response);
              alert.notyf.success(` successfully updated!`);
            },
            (err) => {
              console.log(err);
              alert.notyf.error(`Failed to update!`);
            }
          );
        }
      });
    });
});
