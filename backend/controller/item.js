const connection = require("../config/database");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");

exports.itemTable = async (req, res) => {
  let query =
    "SELECT * FROM items INNER JOIN item_category USING(item_id) INNER JOIN categories USING(category_id) INNER JOIN stocks USING(item_id)";
  let result = await connection.query(query, []);
  return res.status(200).json({ data: result[0] });
};
