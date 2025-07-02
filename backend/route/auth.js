const express = require("express");
const route = express.Router();

const { create } = require("../controller/user");
const { login } = require("../controller/auth")

route.post("/register", create)
route.post("/login",login)

module.exports = route;
