const express = require("express");
const route = express.Router();
const seedController = require("../controller/seedController")
const {userSeed,categorySeed,itemSeed, orderSeed}= require("../seeder/seed")

route.get("/seed/user/:count",userSeed,seedController.userSeed)
route.get("/seed/category",categorySeed,seedController.categorySeed)
route.get("/seed/items",itemSeed,seedController.itemSeed)
route.get("/seed/orders",orderSeed,seedController.orderSeed)


module.exports = route