import request from "../helper/request.js";
import alert from "../components/js/alert.js";
import network from "../config/network.js";

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
