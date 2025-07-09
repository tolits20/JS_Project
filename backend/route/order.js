const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const order = require("../controller/order");

route.get("/admin/order-all", order.orderTable);


module.exports = route