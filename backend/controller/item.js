const connection = require("../config/database");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const { log } = require("../service/logs");

exports.itemTable = async (req, res) => {
  let query =
    "SELECT * FROM items LEFT JOIN item_category USING(item_id) LEFT JOIN categories USING(category_id) LEFT JOIN stocks USING(item_id) WHERE items.deleted_at IS NULL";
  let result = await connection.query(query, []);
  return res.status(200).json({ data: result[0] });
};

exports.createItem = async (req, res) => {
  console.log("reached");
  console.log("a", req.body);

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
    log("item", "create");
    return res.status(201).json({
      result1,
      message: "Successful",
    });
  } catch (error) {
    connection.rollback();
    console.log(error);
    return res.status(500).json(error);
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
  console.log(req.body);
  const id = parseInt(req.params.id);
  const { item_name, item_price, category, stocks, description } = req.body;

  let queryItem =
    "UPDATE items SET item_name =?, item_price=?, item_desc=?, updated_at=NOW() WHERE item_id = ?";
  let queryCategory =
    "INSERT INTO item_category (category_id,item_id) VALUES(?,?) ON DUPLICATE KEY UPDATE category_id=?, item_id =?";
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
      await connection.query(queryCategory, [category, id, category, id]);
      await connection.query(queryStock, [stocks, id]);
      connection.commit();
      return true;
    } catch (error) {
      console.log(error);
      connection.rollback();
      return res.status(500).json({
        error,
      });
    }
  };

  await updateAtOnce();
  log("item", "update");

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
  log("item", "update");

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
    log("item", "update");

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
  log("item", "delete");

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
  log("item", "delete");

  if (result.affectedRows > 0)
    return res.status(200).json("Item deleted Successfully!");

  return res
    .status(500)
    .json("something went wrong while performing the task!");
};

exports.restore = async (req, res) => {
  let id = parseInt(req.params.id);

  let sql = "UPDATE items SET deleted_at = NULL WHERE item_id=?";
  let [result] = await connection.query(sql, [id]);
  if (result.affectedRows > 0) return res.status(200).json("item restored!");
  return res.status(500).json("failed to restore the item");
};

exports.softDelete = async (req, res) => {
  let id = parseInt(req.params.id);
  let sql = "UPDATE items SET deleted_at = NOW() WHERE item_id = ?";
  let [result] = await connection.query(sql, [id]);
  if (result.affectedRows > 0)
    return res.status(200).json("item deleted temporarily");
  return res.status(500).json("failed to temporarily delete the item");
};

exports.getItems = async (req, res) => {
  try {
    let query = `
      SELECT 
        i.item_id,
        i.item_name,
        i.item_price,
        i.item_desc,
        i.item_img,
        s.qty as stock_qty,
        c.category_name
      FROM items i
      LEFT JOIN stocks s ON i.item_id = s.item_id
      LEFT JOIN item_category ic ON i.item_id = ic.item_id
      LEFT JOIN categories c ON ic.category_id = c.category_id
      WHERE i.deleted_at IS NULL
      ORDER BY i.created_at DESC
    `;
    let [result] = await connection.query(query, []);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};

exports.getItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.query.category_id;
    let query = `
      SELECT 
        i.item_id,
        i.item_name,
        i.item_price,
        i.item_desc,
        i.item_img,
        s.qty as stock_qty,
        c.category_name,
        c.category_id
      FROM items i
      LEFT JOIN stocks s ON i.item_id = s.item_id
      LEFT JOIN item_category ic ON i.item_id = ic.item_id
      LEFT JOIN categories c ON ic.category_id = c.category_id
      WHERE i.deleted_at IS NULL
    `;
    let params = [];
    if (categoryId) {
      query += " AND c.category_id = ?";
      params.push(categoryId);
    }
    query += " ORDER BY i.created_at DESC";
    let [result] = await connection.query(query, params);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching items by category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};

exports.getSingleItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);

    let query = `
      SELECT 
        i.item_id,
        i.item_name,
        i.item_price,
        i.item_desc,
        i.item_img,
        s.qty as stock_qty,
        c.category_name
      FROM items i
      LEFT JOIN stocks s ON i.item_id = s.item_id
      LEFT JOIN item_category ic ON i.item_id = ic.item_id
      LEFT JOIN categories c ON ic.category_id = c.category_id
      WHERE i.item_id = ? AND i.deleted_at IS NULL
    `;

    let [result] = await connection.query(query, [itemId]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching single item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch item",
      error: error.message,
    });
  }
};
exports.itemSeach = async (req, res) => {
  const item = req.params.search;
  // console.log(item);
  let query = `SELECT item_name FROM items WHERE item_name LIKE '${item}%'`;
  let [result] = await connection.query(query, []);
  let newArr = result.map((item) => item.item_name);
  // console .log(newArr)
  return res.status(200).json(newArr);
};

exports.recentDeletedItems = async (req, res) => {
  let [result] = await connection.query(
    "SELECT i.item_id,i.item_name,c.category_name,i.deleted_at FROM items i LEFT JOIN item_category  USING(item_id) LEFT JOIN categories c USING(category_id) WHERE i.deleted_at IS NOT NULL",
    []
  );
  if (result.length < 1)
    return res.status(500).json("no recent deletion of items");
  return res.status(200).json(result);
};
