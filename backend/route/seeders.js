const express = require("express");
const route = express.Router();
const seedController = require("../controller/seedController")
const {userSeed,categorySeed}= require("../seeder/seed")

route.get("/seed/user/:count",userSeed,seedController.userSeed)
route.get("/seed/category",categorySeed,seedController.categorySeed)

module.exports = route