const express = require("express");
const route = express.Router();
const seedController = require("../controller/seedController")
const {userSeed}= require("../seeder/seed")

route.get("/seed/user/:count",userSeed,seedController.userSeed)

module.exports = route