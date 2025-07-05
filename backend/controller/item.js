const connection = require("../config/database");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");

exports.itemTable = async (req, res) => {
  let query =
    "SELECT * FROM items INNER JOIN item_category USING(item_id) INNER JOIN categories USING(category_id) INNER JOIN stocks USING(item_id)";
  let result = await connection.query(query, []);
  return res.status(200).json({ data: result[0] });
};

exports.editItem = async (req, res) => {
  let id = parseInt(req.params.id);

  let query1 =
    "SELECT * FROM items INNER JOIN item_category USING(item_id) INNER JOIN categories USING(category_id) INNER JOIN stocks USING(item_id) WHERE item_id =?";
  let [result] = await connection.query(query1, [id]);
  console.log(result);
  let query2 = "SELECT * FROM categories";
  let [categories] = await connection.query(query2, []);
  console.log("categries", categories);

  return res.status(200).json({
    item: result,
    categories,
  });
};
