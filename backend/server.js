require('dotenv').config()
const express = require("express");
const app = express()
const path = require('path')
const port = 8080;

app.use(express.static(path.join(__dirname, '../frontend')));


app.get("/", (req, res) => {
  res.send("hello world");
});

app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname,'../frontend/login.html'))
})

app.listen(port, () => {
  console.log(`connected to port ${port}`);
});
