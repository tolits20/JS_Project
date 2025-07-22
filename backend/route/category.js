const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const category = require("../controller/category");

route.get("/category", auth, role("admin"), category.getAll);
route.get("/categoryTable", auth, role("admin"), category.getCategoryTable);
route.post("/category", auth, role("admin"), category.create);
route.post("/category/update/:id", auth, role("admin"), category.update);
route.delete("/category/delete/:id", auth, role("admin"), category.delete);
route.get("/public/categories", category.getAll);
module.exports = route;
