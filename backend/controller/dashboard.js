const connection = require("../config/database");

option = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  chart: {
    monthlySales:
      "SELECT MONTHNAME(o.order_placed) as month, SUM(ol.order_price) as total FROM orders o INNER JOIN orderlines ol USING(order_id) WHERE year(CURDATE())= year(o.order_placed) GROUP BY month(o.order_placed)",
    salesPerCategory:
      "SELECT c.category_name, SUM(ol.order_price) as total FROM categories c INNER JOIN item_category ic USING(category_id) INNER JOIN items i USING(item_id) INNER JOIN orderlines ol USING(item_id) INNER JOIN orders o USING(order_id) GROUP BY c.category_name",
    ordersPerMonth:
      "SELECT MONTHNAME(order_placed) as month, COUNT(order_id) as total FROM orders WHERE year(CURDATE())= year(order_placed) GROUP BY month(order_placed)",
  },
};

const fillMissingMonths = (result) => {
  let months = option.months;
  let x = 0;
  let final = new Array();
  for (let i = 0; i < months.length; i++) {
    if (months[i] == result[x].month) {
      final.push({
        label: months[i],
        total: result[x].total,
      });
      x++;
    } else {
      final.push({
        label: months[i],
        total: 0,
      });
    }
    if (x == result.length) break;
  }
  return final;
};

const parseData = (result) => {
  let obj = new Array();
  for (let i = 0; i < result.length; i++) {
    let key = Object.values(result[i]);
    obj.push({
      label: key[0],
      total: key[1],
    });
  }
  return obj;
};

exports.chart = async (req, res) => {
  let param = req.params.data;
  let query = option.chart[param];
  let [result] = await connection.query(query, []);

  if (result.fieldCount > 0) return res.status(200).json("No data");
  let final =
    param != "salesPerCategory" ? fillMissingMonths(result) : parseData(result);

  return res.status(200).json({
    final,
  });
};

exports.userCount = async (req, res) => {
  let sql = "SELECT COUNT (user_id) as total FROM user";
  let [result] = await connection.query(sql, []);
  // console.log("total",result)
  return res.status(200).json(result);
};

exports.itemCount = async (req, res) => {
  let sql = "SELECT COUNT (item_id) as total FROM items";
  let [result] = await connection.query(sql, []);
  return res.status(200).json(result);
};

exports.transactionCount = async (req, res) => {
  let sql = "SELECT COUNT (order_id) as total FROM orders";
  let [result] = await connection.query(sql, []);
  // console.log("transac: ",result)
  return res.status(200).json(result);
};

exports.recentlyDeleted = async (req, res) => {
  let sql =
    "SELECT COUNT (user_id) as total FROM user WHERE deleted_at IS NULL";
  let [result] = await connection.query(sql, []);
  // console.log("deleted: ",result)

  return res.status(200).json(result);
};

exports.userRanking = async (req, res) => {
  let sql =
    "SELECT  u.name as name, COUNT(o.order_id) as total FROM user u INNER JOIN orders o USING(user_id) GROUP BY u.name ORDER BY total DESC LIMIT 3";
  let [result] = await connection.query(sql, []);
  let newResult = result.map(data => data.name)
  // console.log("deleted: ",result)

  return res.status(200).json(newResult);
};

exports.recentLogs= async (req,res)=>{
  let sql ="SELECT * FROM activity_logs LIMIT 3 "
  let [result]= await connection.query(sql,[])
  if(!result.length>0) return res(200).json("no recent logs")
    let newArr = result.map(data => data.activity)
    return res.status(200).json(newArr)
}