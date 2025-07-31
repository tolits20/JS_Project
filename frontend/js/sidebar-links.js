import network from "../config/network.js";
import logout from "./logout.js";

const sidebarLinks = () => {
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
    .getElementById("sidebar-category")
    .setAttribute(
      "href",
      `http://${network.client.host}/frontend/admin/category/index.html`
    );
  document
    .getElementById("sidebar-order")
    .setAttribute(
      "href",
      `http://${network.client.host}/frontend/admin/orders/index.html`
    );
document.getElementById("sidebar-deleted").setAttribute('href',`http://${network.client.host}/frontend/admin/recently_deleted/index.html`)

  document.getElementById("sidebar-logout").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
};

export default sidebarLinks;
