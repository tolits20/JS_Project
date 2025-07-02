const connection = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  const query = "INSERT INTO user (name,email,password)values(?,?,?)";

  hashPassword = await bcrypt.hash(password, 10);

  connection.execute(query, [name, email, hashPassword], (err, result) => {
    if (err instanceof Error) return console.log(err);
    return res.status(201).json({
      message: "succussfully registered",
      result: result,
    });
  });
};


