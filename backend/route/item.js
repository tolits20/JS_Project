const express = require('express')
const route = express.Router()
const item = require("../controller/item")

route.get('/admin/item-all',item.itemTable)

module.exports = route;