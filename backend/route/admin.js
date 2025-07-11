const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const admin = require("../controller/admin");

const upload = require("../middleware/multer");

route.get("/admin/user", admin.getAll);
route.get("/admin/user/:id", admin.getById);
route.post("/admin/user/:id", upload.single("img"), admin.update);
route.delete("/admin/user/:id", admin.delete);

route.post("/admin/status/:id", admin.status);
route.delete('/admin/user/softDelete/:id',admin.softDelete)

//for plugins resources
route.get("/admin/user-all", admin.userTable);


module.exports = route;
