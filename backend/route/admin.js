const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const admin = require('../controller/admin')

route.get("/admin/user",admin.getAll);
route.get("/admin/user/:id",admin.getById)

module.exports = route;
