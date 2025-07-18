import network from "../config/network.js";

const redirects = {
  unauthorize: () => {
    location.href = `http://${network.client.host}/frontend/status_pages/403.html`;
  },
  notFound: () => {
    location.href = `http://${network.client.host}/frontend/status_pages/404.html`;
  },
};

const getRole = localStorage.getItem("role");

const roleCheck = (role) => {
  const getRole = localStorage.getItem("role");

  if (getRole != "admin") {
    redirects.unauthorize();
  }
};

export default roleCheck;
