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
});
