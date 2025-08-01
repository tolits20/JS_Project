const connection = require("../config/database");
const queryHelper = require("../service/query");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const { log } = require("../service/logs");

exports.getAll = async (req, res) => {
  const data =  await connection.query(`SELECT * FROM user`)
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
  if (result) {
    log("user", "create");
    return res.status(201).json({ message: "successful", data: result });
  }
};

exports.userTable = async (req, res) => {
    let excludeUser = parseInt(req.user.data)
  let query = "SELECT * FROM user WHERE deleted_at IS NULL AND user_id != ?";
  let result = await connection.query(query, [excludeUser]);
  // console.log(result[0]);
  return res.status(200).json({ data: result[0] });
};

exports.update = async (req, res) => {
  let id = parseInt(req.params.id)
  let query =
    "UPDATE user SET name =?, email=?, role=?, is_active=?, contact=?, city=? WHERE user_id =?";
  const { fullname, role, status, email, phone, location } = req.body;
  let result = await connection.query(query, [
    fullname,
    email,
    role,
    status,
    phone,
    location,
    id,
  ]);

  if (result) {
    log("user", "update");
    return res.status(200).json({
      message: "successful",
      result,
    });
  }

  return res
    .status(500)
    .json("failed to update the user data, please try again later");
};

exports.updateAvatar = async (req, res) => {
  const id = parseInt(req.params.id);

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
  let query = "UPDATE user SET img=? WHERE user_id =?";

  let [result] = await connection.query(query, [img, id]);

  if (result.affectedRows < 1)
    return res.status(500).json("something went wrong on the serverside");

  return res.status(200).json({
    img,
    message: "updated successfully",
  });
};

exports.delete = async (req, res) => {
  const id = parseInt(req.params.id);
  let query = "DELETE FROM user WHERE user_id=?";
  let result = connection.query(query, [id]);
  if (result) {
    log("user", "delete");

    return res.status(200).json("Successful");
  }
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
  if (result.affectedRows > 0) {
    log("user", "update");

    return res.status(200).json("Successful!");
  }

  return res
    .status(500)
    .json("something went wrong during the process, please try again later!");
};

exports.softDelete = async (req, res) => {
  console.log(req.body);
  let id = parseInt(req.params.id);
  console.log(id);
  let query = "UPDATE user SET deleted_at=NOW() WHERE user_id = ?";
  let [result] = await connection.query(query, [id]);
  if (result.affectedRows) {
    log("user", "delete");
    return res.status(200).json("ok");
  }
  return res.status(500).json("something went wrong during the process");
};

exports.recentDeletedUsers=async(req,res)=>{
  // return res.json("reached")
  let [result] = await connection.query("SELECT user_id,name,email,role,deleted_at FROM user WHERE deleted_at IS NOT NULL",[])
  if(result.length<1) return res.json("no recent deletion of users")
  return res.status(200).json(result)

}