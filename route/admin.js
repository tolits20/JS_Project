const express = require('express')
const route = express.Router()
const authMiddleware=require('../middlerware/auth')
route.use([authMiddleware])
route.get('/admin',(req,res)=>{
    res.send("reached")
})

module.exports = route;