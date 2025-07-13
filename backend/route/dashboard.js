const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const data = require("../controller/dashboard");

route.get('/admin/chart/:data',data.chart)

module.exports =route
