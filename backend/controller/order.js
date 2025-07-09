const connection = require("../config/database");

exports.orderTable = async (req, res) => {
  let query =
    "SELECT o.*, user.*, items.*, SUM(ol.order_price) as total FROM user LEFT JOIN orders o USING(user_id) LEFT JOIN orderlines ol USING(order_id) INNER JOIN items USING(item_id) GROUP BY order_id";
  let [result] = await connection.query(query, []);
  // console.log(result);
  return res.status(200).json({ data: result });
};

exports.status = async (req, res) => {
  const id = parseInt(req.params.id);
  let update = "UPDATE orders SET order_status = ? WHERE order_id =?";
  const { val } = req.body;
  console.log(val)
  let [result] = await connection.query(update, [val, id]);
  if (result.affectedRows > 0) return res.status(200).json("Successful!");
  return res.status(500).json("something went wrong on the server");
};
