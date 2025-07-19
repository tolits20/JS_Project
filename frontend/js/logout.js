import network from "../config/network.js";
const logout = () => {
  console.log("logout");

  // Save cart data before clearing localStorage
  const cartData = localStorage.getItem("auretta_cart");

  // Clear all localStorage
  localStorage.clear();

  // Restore cart data (so it persists after logout)
  if (cartData) {
    localStorage.setItem("auretta_cart", cartData);
  }

  location.href = `http://${network.client.host}`;
};

export default logout;
