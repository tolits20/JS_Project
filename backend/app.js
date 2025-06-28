const express = require("express");
const app = express();
const cors = require("cors");

const {admin,user,auth,product}=require('./route/index')


//incoming request parser
app.use(cors());
app.use(express.json());

app.use("/api/v1/",admin);
app.use("/api/v1/",user);
app.use("/api/v1/",product);
app.use(auth);


module.exports = app;
