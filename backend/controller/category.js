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

exports.getCategoryTable = async (req, res) => {
  let query =
    "SELECT c.category_name as category, COUNT(ic.item_id) as total  FROM categories c INNER JOIN item_category ic USING(category_id) GROUP BY c.category_name DESC";
  let [result] = await connection.query(query, []);
  if (result)
    return res.status(200).json({
      result,
    });
  return res.status(500).json("something went wrong on the server side");
};
