const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const category = require("../controller/category");

route.get("/category",auth,role('admin'),category.getAll)

module.exports = route;
