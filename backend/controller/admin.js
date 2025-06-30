const connection = require("../config/database");
const queryHelper = require("../service/query");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAll = async (req, res) => {
  const data = await queryHelper.getAll("user");
  console.log(data[0]);
  return res.status(200).json({ message: "succussful", data: data[0] });
};

exports.getById = async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await queryHelper.getById(id, "user");
  return res.status(200).json({ message: "succussful", data: data[0] });
};


