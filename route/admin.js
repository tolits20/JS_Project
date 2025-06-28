const express = require("express");
const route = express.Router();
const { authMiddleware, roleMiddleware } = require("../middlerware");

route.use([authMiddleware, roleMiddleware]);

route.get("/admin", (req, res) => {
  res.send("reached");
});

module.exports = route;
