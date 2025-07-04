const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const admin = require("../controller/admin");
const upload = require("../middleware/multer");

route.get("/admin/user",auth, admin.getAll);
route.get("/admin/user/:id",auth, admin.getById);
route.post("/admin/user/:id", upload.single("img"), admin.update);
route.delete("/admin/user/:id", admin.delete);

//for plugins resources
route.get("/admin/user-all",auth, admin.userTable);

module.exports = route;
