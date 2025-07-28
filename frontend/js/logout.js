import network from "../config/network.js";
import sessionCartManager from "../utils/cartManager.js";

const logout = () => {
  console.log("logout");

  sessionCartManager.clearCartOnLogout();

  localStorage.clear();

  location.href = `http://${network.client.host}/frontend/index.html`;
};

export default logout;
