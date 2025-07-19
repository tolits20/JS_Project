const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const data = require("../controller/dashboard");

route.get("/admin/chart/:data", auth, role("admin"), data.chart);
route.get("/userCount", auth, role('admin'), data.userCount);
route.get("/itemCount", auth, role('admin'), data.itemCount);


module.exports = route;
