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
  console.log(req.body);
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
    "SELECT c.category_name as category, COUNT(ic.item_id) as total, c.category_id  FROM categories c LEFT JOIN item_category ic USING(category_id) GROUP BY c.category_name ORDER BY total DESC";
  let [result] = await connection.query(query, []);
  if (result)
    return res.status(200).json({
      result,
    });
  return res.status(500).json("something went wrong on the server side");
};

exports.update = async (req, res) => {
  // console.log(req.body)
  let id = parseInt(req.params.id);
  let {category_name} =req.body
  let query = "UPDATE categories SET category_name=? WHERE category_id = ?";
  let [result] = await connection.query(query, [category_name, id]);
  if (result.affectedRows > 0) {
    log("category", "update");
    return res.status(200).json("Successfully update the user");
  }
  return res.status(200).json("something went wrong on the server side");
};

exports.delete = async (req, res) => {
  let id = parseInt(req.params.id);
  let query = "DELETE FROM categories WHERE category_id = ? ";
  let [result] = await connection.query(query, [id]);
  if (result.affectedRows > 0) {
    log("category", "delete");
    return res.status(200).json("Successfully deleted");
  }
  return res.status(500).json("something went wrong on the serverside");
};
