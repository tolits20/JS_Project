const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");

route.get("/me", auth, (req, res) => {
  // For now, return a default user profile
  // You can enhance this to fetch actual user data from database
  res.json({
    name: "Guest User",
    profilePicture: "/assets/images/main.jpg",
  });
});

route.get("/", () => {});

module.exports = route;
