const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path')

const {admin,user,auth,product}=require('./route/index')

//incoming request parser
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../frontend')));


app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
})

// app.post("/register",(req,res)=>{
//     console.log(req.body)
//     res.json({data:req.body})
// })
app.use("/api/v1/",admin);
app.use("/api/v1/",user);
app.use("/api/v1/",product);
app.use("/api/v1/",auth);



module.exports = app;
