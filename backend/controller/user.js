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

exports.login = async (req, res) => {
  console.log("here",req.body);
  if (!req.body || req.body==undefined) return res.status(500).json({ message: "no data receive" });
  const { email, password } = req.body;
  let getAccount = "SELECT * FROM user WHERE email = ?";
  connection.query(getAccount, [email], async (err, result) => {
    if (err instanceof Error)
      return res.status(500).json({
        message: "We encountered an error while checking your account",
      });

    if (!result)
      return res.status(401).json({ message: "account does not exist!" });
    console.log(result[0]);
    
    const match = await bcrypt.compare(password, result[0].password);
    if (!match)
      return res.status(403).json({ message: "Password does not match!" });

    const token = jwt.sign({ id: result[0].user_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    return res.status(200).json({
      message: `Welcome ${result[0].name}`,
      status: 200,
      token,
    });
  });
};
