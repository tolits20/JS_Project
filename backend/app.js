const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path')

const {admin,user,auth,item}=require('./route/index')

//incoming request parser
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../frontend')));
app.use("/storage/images/",express.static(path.join(__dirname,"storage/images")))

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
})


app.use("/api/v1/",admin);
app.use("/api/v1/",user);
app.use("/api/v1/",item);
app.use("/api/v1/",auth);



module.exports = app;
