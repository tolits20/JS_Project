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
        month: months[i],
        total: result[x].total,
      });
      x++;
    } else {
      final.push({
        month: months[i],
        total: 0,
      });
    }
    if (x == result.length) break;
  }
  return final;
};

exports.chart = async (req, res) => {
  let param = req.params.data;
  let query = option.chart[param];
  let [result] = await connection.query(query, []);
  console.log(result);

  if (result.fieldCount > 0) return res.status(200).json("No data");
  let final = param != "salesPerCategory" ? fillMissingMonths(result) : result;

  return res.status(200).json({
    final,
  });
};
