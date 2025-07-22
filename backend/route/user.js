const express = require("express");
const route = express.Router();
const { auth } = require("../middleware");
const userController = require("../controller/user");
const upload = require("../middleware/multer");

route.get("/", () => {});
route.get("/profile", auth, userController.getProfile);
route.post(
  "/profile",
  auth,
  upload.single("img"),
  userController.updateProfile
);

module.exports = route;
