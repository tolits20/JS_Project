const express = require('express')
const route = express.Router()

route.get('/admin',(req,res)=>{
    res.send("reached")
})

module.exports = route;