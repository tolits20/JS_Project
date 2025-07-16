const connection = require("../config/database");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const { resolve, parse } = require("path");
const { rejects } = require("assert");
const { get } = require("http");
const { error } = require("console");

exports.itemTable = async (req, res) => {
  let query =
    "SELECT * FROM items LEFT JOIN item_category USING(item_id) LEFT JOIN categories USING(category_id) LEFT JOIN stocks USING(item_id)";
  let result = await connection.query(query, []);
  return res.status(200).json({ data: result[0] });
};

exports.createItem = async (req, res) => {
  console.log("reached")
  console.log("a",req.body);

  const { item_name, item_price, stock, item_desc } = req.body;
  let query1 =
    "INSERT INTO items (item_name,item_price,item_desc) VALUES (?,?,?)";
  let query2 = "INSERT INTO stocks (item_id,qty) VALUES (?,?)";
  connection.beginTransaction();
  try {
    let [result1] = await connection.query(query1, [
      item_name,
      item_price,
      item_desc,
    ]);
    let id = result1.insertId;
    if (id === undefined && id === null && affectedRows <= 0)
      throw new error("failed to store the item in the database");
    await connection.query(query2, [id, stock]);
    connection.commit();
    return res.status(201).json({
      result1,
      message: "Successful",
    });
  } catch (error) {
    connection.rollback()
    console.log(error)
    return res.status(500).json(error)

  }
};

exports.editItem = async (req, res) => {
  let id = parseInt(req.params.id);

  let query1 =
    "SELECT * FROM items LEFT JOIN item_category USING(item_id) LEFT JOIN categories USING(category_id) LEFT JOIN stocks USING(item_id) WHERE item_id =?";
  let [result] = await connection.query(query1, [id]);
  // console.log(result);
  let query2 = "SELECT * FROM item_gallery WHERE item_id =?";
  let [item_img] = await connection.query(query2, [id]);

  let query3 = "SELECT * FROM categories";
  let [categories] = await connection.query(query3, []);
  // console.log("categries", categories);

  return res.status(200).json({
    item: result,
    categories,
    gallery: item_img,
  });
};

exports.update = async (req, res) => {
  // console.log(req.body);
  const id = parseInt(req.params.id);
  const { item_name, item_price, category, stocks, description } = req.body;

  let queryItem =
    "UPDATE items SET item_name =?, item_price=?, item_desc=?, updated_at=NOW() WHERE item_id = ?";
  let queryCategory = "INSERT INTO item_category (category_id,item_id) VALUES(?,?) ON DUPLICATE KEY UPDATE category_id=?, item_id =?";
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
      await connection.query(queryCategory, [category, id,category,id]);
      await connection.query(queryStock, [stocks, id]);
      connection.commit();
      return true;
    } catch (error) {
      console.log(error)
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

exports.singleImg = async (req, res) => {
  // console.log(req.body, "<=>", req.file);
  const id = parseInt(req.params.id);
  const flag = req.params.flag;
  const file = req.file.destination + "/" + req.file.filename;
  console.log(file);
  let query = "SELECT item_img FROM items WHERE item_id = ?";
  let [currImg] = await connection.query(query, [id]);
  console.log("current", currImg);

  if (currImg[0].item_img !== null) {
    console.log(currImg[0].item_img);
    fs.unlink(currImg[0].item_img);
  }

  let update = "UPDATE items SET item_img = ? WHERE item_id =?";
  let [result] = await connection.query(update, [file, id]);

  if (result)
    return res.status(201).json({
      message: "successfully updated the item main image",
      destination: file,
    });
  return res
    .status(500)
    .json({ message: "failed to update the item main image" });
};

exports.multiImg = async (req, res) => {
  // console.log(req.body, "<=>", req.files);
  let id = parseInt(req.params.id);
  let query = "INSERT INTO item_gallery (item_id,item_path) VALUES (?,?)";
  let files = req.files;
  connection.beginTransaction();
  try {
    files.forEach(async (file) => {
      await connection.query(query, [
        id,
        file.destination + "/" + file.filename,
      ]);
    });
    connection.commit();
  } catch (error) {
    connection.rollback();
    return res.status(500).json({ error });
  }

  return res
    .status(200)
    .json({ message: "Successfully Updated your gallery", files: req.files });
};

exports.deletegallery = async (req, res) => {
  let id = parseInt(req.params.id);
  let [check] = await connection.query(
    "SELECT item_path FROM item_gallery WHERE img_id = ?",
    [id]
  );
  if (check.length == 1) {
    console.log(check);
    fs.unlink(check[0].item_path);
  }
  let query = "DELETE FROM item_gallery WHERE img_id =?";
  let [result] = await connection.query(query, [id]);
  if (result.affectedRows > 0)
    return res.status(200).json("successfully deleted from DB");
  return res.status(500).json("something went wrong, Please try again later!");
};

exports.delete = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  let getQuery =
    "SELECT i.item_img, ig.item_path FROM items i INNER JOIN item_gallery ig USING(item_id) WHERE item_id=?";
  const [getData] = await connection.query(getQuery, [id]);

  if (getData.length > 0) {
    console.log(getData);

    if (getData[0].item_img !== null && getData[0].item_img !== undefined)
      fs.unlink(getData[0].item_img);

    imgs = getData;
    imgs.forEach((img) => {
      console.log("deleting: ", img.item_path);
      fs.unlink(img.item_path);
    });
  }

  let ItemDelete = "DELETE FROM items WHERE item_id=?";

  let [result] = await connection.query(ItemDelete, [id]);

  if (result.affectedRows > 0)
    return res.status(200).json("Item deleted Successfully!");

  return res
    .status(500)
    .json("something went wrong while performing the task!");
};
