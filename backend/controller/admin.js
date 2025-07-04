const connection = require("../config/database");
const queryHelper = require("../service/query");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAll = async (req, res) => {
  const data = await queryHelper.getAll("user");
  // console.log(data[0]);
  return res.status(200).json({ message: "succussful", data: data[0] });
};

exports.getById = async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await queryHelper.getById(id, "user");
  return res.status(200).json({ message: "succussful", data: data[0] });
};

exports.create = async (req, res) => {
  // cosole.log(req.body);
  let query = "INSERT INTO user(name,email,password,img) VALUES (?,?,?,?)";
  const filename = req.file ?? null;
  const { name, email, password } = req.body;
  let result = await connection.query(sql, [name, email, password, filename]);
  if (result)
    return res.status(201).json({ message: "successful", data: result });
};

exports.userTable = async (req, res) => {
  let query = "SELECT * FROM user";
  let result = await connection.query(query, []);
  // console.log(result[0]);
  return res.status(200).json({ data: result[0] });
};

exports.update = async (req, res) => {
  // console.log("body: ", req.body, "file :", req.file);
  const id = parseInt(req.params.id)
  let query =
    "UPDATE user SET name =?, email=?, role=?, is_active=?, contact=?, city=?, img=? WHERE user_id =?";
  const { fullname, role, status, email, phone, location } = req.body;
  const { destination, filename } = req.file;
  const img = destination +"/"+ filename;
  let result = await connection.query(query, [
    fullname,
    email,
    role,
    status,
    phone,
    location,
    img,
    id
  ]);

  if (result)
    return res.status(200).json({
      message: "successful",
      result,
    });

    return res.status(500).json("failed to update the user data, please try again later")
};
