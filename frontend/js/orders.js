import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";
import { pageRows,paginateHandler } from "../utils/pagination.js";
import { roleCheck, errorStatus } from "../utils/redirection.js";

roleCheck()

$(document).ready(function () {
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

  $(document)
    .off("change")
    .on("change", ".order-status", (e) => {
      e.preventDefault();
      let id = $(e.target).data("id");
      let val = $(e.target).val();
      console.log(val);
      const status = new request("api/v1", "admin/order/status");
      status.update(
        id,
        { val },
        (response) => {
          console.log(response);
          alert.notyf.success("Order status updated successfully!");
        },
        (err) => {
          console.log(err);
          errorStatus(err.status)
          alert.notyf.error(
            "Failed to update the order status. Please try again!"
          );
        }
      );
    });
});

 const tableData = new request("api/v1", "admin/order-all");
  tableData.getAll(
    async (response) => {
      console.log(response);
      let data = pageRows(response.data,10);
      console.log(data);
      paginateHandler(data, "order");
      // dataTable(response, "user");
    },
    (err) => {
      errorStatus(err.status)
      console.log(err);
    }
  );
