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

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.data;
    const [rows] = await connection.execute(
      "SELECT user_id, name, email, contact, city, img, created_at, updated_at FROM user WHERE user_id = ? AND deleted_at IS NULL",
      [userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.data;
    let { name, email, password, contact, city } = req.body;
    let img = req.file ? req.file.path.replace(/\\/g, "/") : req.body.img;
    let updateFields = [];
    let params = [];
    if (name) {
      updateFields.push("name = ?");
      params.push(name);
    }
    if (email) {
      updateFields.push("email = ?");
      params.push(email);
    }
    if (contact) {
      updateFields.push("contact = ?");
      params.push(contact);
    }
    if (city) {
      updateFields.push("city = ?");
      params.push(city);
    }
    if (img) {
      updateFields.push("img = ?");
      params.push(img);
    }
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      params.push(hashPassword);
    }
    if (updateFields.length === 0)
      return res.status(400).json({ message: "No fields to update" });
    params.push(userId);
    await connection.execute(
      `UPDATE user SET ${updateFields.join(
        ", "
      )}, updated_at = NOW() WHERE user_id = ? AND deleted_at IS NULL`,
      params
    );
    log("user", "update");
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
