const app =require("./app")
const path = require("path");
require("dotenv").config();

const port = 8080;



app.get("/", (req, res) => {
  res.send("hello world");
});


app.listen(port,"0.0.0.0", () => {
  console.log(`connected to port ${port}`);
});
