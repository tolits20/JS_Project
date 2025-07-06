const express = require('express')
const route = express.Router()
const item = require("../controller/item")
const upload = require('../middleware/multer')

route.get('/admin/item/:id',item.editItem)
route.post('/admin/item/single/:id/:flag',upload.single('image'),(req,res)=>{
    // console.log(req.body,req.file)
    return res.json({
        body:req.body,
        file:req.file
    })
})


route.get('/admin/item-all',item.itemTable)
module.exports = route;