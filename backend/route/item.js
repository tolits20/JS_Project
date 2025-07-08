const express = require("express");
const route = express.Router();
const item = require("../controller/item");
const upload = require("../middleware/multer");

route.get("/admin/item/:id", item.editItem);

route.post("/admin/item/gallery/:id/:flag", upload.array("image"), item.multiImg );
route.post("/admin/item/:id/:flag", upload.single("image"), item.singleImg);
route.post("/admin/item/:id", upload.single("image"), item.update);
route.delete("/admin/item/gallery/:id",item.deletegallery)

// route.post('/admin/item/single/:id/:flag',upload.single('image'),(req,res)=>{
//     // console.log(req.body,req.file)
//     return res.json({
//         body:req.body,
//         file:req.file
//     })
// })

route.get("/admin/item-all", item.itemTable);
module.exports = route;
