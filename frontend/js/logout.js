import network from "../config/network.js";
import sessionCartManager from "../utils/cartManager.js";

const logout = () => {
  console.log("logout");

  // Clear cart data for current user
  sessionCartManager.clearCartOnLogout();

  // Clear all localStorage (including auth token)
  localStorage.clear();

  // Redirect to login page
  location.href = `http://${network.client.host}`;
};

export default logout;
