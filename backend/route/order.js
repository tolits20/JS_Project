const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const order = require("../controller/order");

route.get("/admin/order-all", auth, role("admin"), order.orderTable);
route.post("/admin/order/status/:id", auth, role("admin"), order.status);

module.exports = route;
