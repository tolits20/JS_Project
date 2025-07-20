const connection = require("../config/database");
const { log } = require("../service/logs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  const query = "INSERT INTO user (name,email,password)values(?,?,?)";

  hashPassword = await bcrypt.hash(password, 10);

  let result = connection.execute(query, [name, email, hashPassword]);

  if (result) {
    log("user", "create");
    return res.status(201).json({
      message: "succussfully registered",
      result: result,
    });
  }
  return res.status(500).message("failed to register, Please try again later");
};
