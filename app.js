const express = require("express");
const app = express();
const cors = require("cors");

const admin = require("./route/admin");
const user = require("./route/user");
const product = require("./route/product");
const auth = require("./route/auth");


//incoming request parser
app.use(cors());
app.use(express.json());

app.use("/api/v1/",admin);
app.use("/api/v1/",user);
app.use("/api/v1/",product);
app.use(auth);


module.exports = app;
