import network from "../config/network.js";
const logout = () => {
  console.log("logout")
  localStorage.clear();
  location.href = `http://${network.client.host}`;
};

export default logout
