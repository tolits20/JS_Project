import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";
import formValidate from "../utils/validate.js";
import { pageRows, paginateHandler } from "../utils/pagination.js";
import { roleCheck, errorStatus } from "../utils/redirection.js";
import sidebarLinks from "./sidebar-links.js";
import { dataTable } from "../components/js/dataTable.js";

roleCheck();

$(document).ready(function () {
  sidebarLinks();

  const buttons = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      buttons.forEach((btn) => btn.classList.remove("active"));
      contents.forEach((content) => content.classList.remove("active"));

      let tabSection = button.dataset.tab;
      let table =
        tabSection === "Users" ? "recentDeletedUsers" : "recentDeletedItems";
      button.classList.add("active");
      document.getElementById(tabSection).classList.add("active");
      let deletedRecords = new request(
        "api/v1",
        `admin/recentlyDeleted${tabSection}`
      );
      deletedRecords.getAll(
        (respose) => {
          console.log(respose);
          dataTable(respose, table);
        },
        (error) => {
          console.log(error);
          alert.notyf.error("Cant fetch data from resource.");
        }
      );
    });
  });


  document.getElementById('Userbtn').click()
});
