require('dotenv').config()
const app = require("./app");
const port = 8080;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`connected to port ${port}`);
});
