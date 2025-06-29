const express = require("express");
const route = express.Router();

const { create, login } = require("../controller/user");

route.post("/register", create)
route.post("/login",login)

module.exports = route;
