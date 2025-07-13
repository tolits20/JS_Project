import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";
import createChart from "../components/js/charts.js";

let alertMessage = sessionStorage.getItem("message");
if (alertMessage === "loginSuccess") {
  alert.notyf.success("Successfully Login!");
  sessionStorage.removeItem("message");
}

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

const chart1 = new request("api/v1", "admin/chart");
chart1.getById(
  "ordersPerMonth",
  (response) => {
    console.log(response);
    createChart("#chart1", response, "bar");
  },
  (err) => {
    console.log(err);
    alert.notyf.error("failed to get the monthly sales data.");
  }
);

const chart2 = new request("api/v1", "admin/chart");
chart2.getById(
  "salesPerCategory",
  (response) => {
    console.log(response);
    createChart("#chart2", response, "pie");
  },
  (err) => {
    console.log(err);
    alert.notyf.error("failed to get the monthly sales data.");
  }
);

const chart3 = new request("api/v1", "admin/chart");
chart3.getById(
  "monthlySales",
  (response) => {
    console.log(response);
    createChart("#chart3", response, "bar");
  },
  (err) => {
    console.log(err);
    alert.notyf.error("failed to get the monthly sales data.");
  }
);
