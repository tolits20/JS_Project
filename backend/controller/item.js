const connection = require("../config/database");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const { resolve } = require("path");
const { rejects } = require("assert");

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
  // console.log(result);
  let query2 = "SELECT * FROM categories";
  let [categories] = await connection.query(query2, []);
  // console.log("categries", categories);

  return res.status(200).json({
    item: result,
    categories,
  });
};

exports.update = async (req, res) => {
  console.log(req.body);
  const id = parseInt(req.params.id);
  const { item_name, item_price, category, stocks, description } = req.body;

  let queryItem =
    "UPDATE items SET item_name =?, item_price=?, item_desc=?, updated_at=NOW() WHERE item_id = ?";
  let queryCategory = "UPDATE item_category SET category_id=? WHERE item_id=?";
  let queryStock = "UPDATE stocks SET qty=? WHERE item_id =?";

  const updateAtOnce = async () => {
    connection.beginTransaction();
    try {
      await connection.query(queryItem, [
        item_name,
        item_price,
        description,
        id,
      ]);
      await connection.query(queryCategory, [category, id]);
      await connection.query(queryStock, [stocks, id]);
      connection.commit();
      return true;
    } catch (error) {
      connection.rollback();
      return res.status(500).json({
        error,
      });
    }
  };

  await updateAtOnce();

  return res.status(200).json({
    message: "successful",
    body: req.body,
  });
};
