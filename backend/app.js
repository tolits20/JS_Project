const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const {
  admin,
  user,
  item,
  order,
  dashboard,
  category,
  transaction,
  review
} = require("./route/index");

//incoming request parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/frontend", express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(
  "/storage/images/",
  express.static(path.join(__dirname, "storage/images"))
);
app.use(
  "/storage/items/main",
  express.static(path.join(__dirname, "storage/items/main"))
);
app.use(
  "/storage/items/gallery",
  express.static(path.join(__dirname, "storage/items/gallery"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/api/v1/", admin);
app.use("/api/v1/", user);
app.use("/api/v1/", item);
app.use("/api/v1/", order);
app.use("/api/v1/", dashboard);
app.use("/api/v1/", category);
app.use("/api/v1/", transaction);
app.use("/api/v1/", review);

module.exports = app;
