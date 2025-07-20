const connection = require("../config/database");
const { log } = require("../service/logs");

exports.getAll = async (req, res) => {
  let query = "SELECT * FROM categories";
  let [result] = await connection.query(query, []);

  if (result.fieldCount < 1)
    return res.status(500).json("failed to fetch the category records");

  return res.status(200).json(result);
};

exports.create = async (req, res) => {
  let { category_name } = req.body;
  let query = "INSERT INTO categories (category_name) VALUES (?)";
  let [result] = await connection.query(query, [category_name]);
  if (result) {
    log("category", "create");
    return res.status(200).json("successful");
  }
  return res.status(500).json("something went wrong to the serverside");
};
