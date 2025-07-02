const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const admin = require("../controller/admin");
const upload = require("../middleware/multer");

route.get("/admin/user", admin.getAll);
route.get("/admin/user/:id", admin.getById);
route.post("/admin/user", upload.single("img"), (req, res) => {
  res.status(201).json({
    message: "reached",
    data: req.file,
  });
});

//for plugins resources
route.get("/admin/user-all", admin.userTable);

module.exports = route;
