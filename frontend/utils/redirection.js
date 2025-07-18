import network from "../config/network.js";

const redirects = {
  unauthorize: () => {
    location.href = `http://${network.client.host}/frontend/status_pages/401.html`;
  },
  forbidden: () => {
    location.href = `http://${network.client.host}/frontend/status_pages/403.html`;
  },
  notFound: () => {
    location.href = `http://${network.client.host}/frontend/status_pages/404.html`;
  },
  InternalServerErorr: () => {
    location.href = `http://${network.client.host}/frontend/status_pages/500.html`;
  },
};

const getRole = localStorage.getItem("role");

const roleCheck = (role) => {
  const getRole = localStorage.getItem("role");

  if (getRole != "admin") {
    redirects.unauthorize();
  }
};

const errorStatus = (status) => {
  switch (status) {
    case 403:
      redirects.forbidden();
      break;
    case 404:
      redirects.notFound();
      break;
    case 500:
      redirects.InternalServerErorr();
      break;
    case 401:
      redirects.unauthorize();
  }
};

export { errorStatus, roleCheck };
