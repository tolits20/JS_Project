const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");

route.get("/admin",auth,role, (req, res) => {
  res.send("reached");
});

module.exports = route;
