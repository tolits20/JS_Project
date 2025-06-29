const express = require("express");
const route = express.Router();

const { create } = require("../controller/user");

route.post("/register", create)
// route.get("/register", (req,res)=>{
// res.send("reached")
// });

module.exports = route;
