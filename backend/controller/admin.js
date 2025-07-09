const connection = require("../config/database");
const queryHelper = require("../service/query");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");

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
  const id = parseInt(req.params.id);
  console.log("files", req.file);
  console.log("body", req.body);

  let currImg = await connection.query(
    "SELECT img FROM user WHERE user_id=? AND img IS NOT NULL",
    [id]
  );
  console.log(currImg[0].length);
  let img = currImg[0].length > 0 ? currImg[0][0].img : null;

  if (currImg[0].length > 0 && req.file !== undefined) {
    const { destination, filename } = req.file;
    img = destination + "/" + filename;
    fs.unlink(currImg[0][0].img);
  } else if (req.file !== undefined) {
    const { destination, filename } = req.file;
    img = destination + "/" + filename;
  }
  console.log("name", img);
  let query =
    "UPDATE user SET name =?, email=?, role=?, is_active=?, contact=?, city=?, img=? WHERE user_id =?";
  const { fullname, role, status, email, phone, location } = req.body;

  let result = await connection.query(query, [
    fullname,
    email,
    role,
    status,
    phone,
    location,
    img,
    id,
  ]);

  if (result)
    return res.status(200).json({
      message: "successful",
      result,
    });

  return res
    .status(500)
    .json("failed to update the user data, please try again later");
};

exports.delete = async (req, res) => {
  const id = parseInt(req.params.id);
  let query = "DELETE FROM user WHERE user_id=?";
  let result = connection.query(query, [id]);
  if (result) return res.status(200).json("Successful");
  return res
    .status(500)
    .json("failed to delete the user, Please try again later");
};

exports.status = async (req, res) => {
  console.log(req.body);
  let id = parseInt(req.params.id);
  const { status } = req.body;
  let [result] = await connection.query(
    "UPDATE user SET is_active=? WHERE user_id = ?",
    [status, id]
  );
  if (result.affectedRows > 0) return res.status(200).json("Successful!");

  return res
    .status(500)
    .json("something went wrong during the process, please try again later!");
};
