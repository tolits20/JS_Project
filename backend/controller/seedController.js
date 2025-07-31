const connection = require("../config/database");
const { log } = require("../service/logs");
const bcrypt = require("bcrypt");

exports.userSeed = async (req, res) => {
  console.log(req.body);

  function StoreUserSeed() {
    return new Promise(async (resolve, reject) => {
      try {
        for (let i in req.body) {
          const { name, email, password } = req.body[i];
          const query =
            "INSERT INTO user (name,email,password) VALUES (?, ?, ?)";

          let hashPassword = await bcrypt.hash(password, 10);

          let result = await connection.execute(query, [
            name,
            email,
            hashPassword,
          ]);
        }

        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  StoreUserSeed()
    .then((result) => {
      log("user", "create");
      return res.status(201).json({
        message: "successfully registered",
        result: result,
      });
    })
    .catch((err) => {
      return res.status(500).json("failed to register, Please try again later");
    });
};

exports.categorySeed = (req, res) => {
  console.log(req.categories);
  let sql =
    "INSERT INTO categories (category_name) VALUES (?) ON DUPLICATE KEY UPDATE category_name=?";
  const storeCategorySeed = () => {
    return new Promise(async (resolve, reject) => {
      try {
        for (let i in req.categories) {
          await connection.query(sql, [req.categories[i], req.categories[i]]);
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  storeCategorySeed()
    .then((result) => {
      return res.status(200).json("Category Seeding is Successfully executed");
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.itemSeed = async (req, res) => {
  let items = req.items;
  //  return res.json(req.items)

  let sql1 =
    "INSERT INTO items (item_name,item_price,item_desc) VALUES (?,?,?) ON DUPLICATE KEY UPDATE item_name=?, item_price=?, item_desc=?";
  let sql2 =
    "INSERT INTO item_category (item_id,category_id) VALUES (?,?) ON DUPLICATE KEY UPDATE item_id =?, category_id=?";
  let sql3 =
    "INSERT INTO stocks (item_id,qty) VALUES (?,?) ON DUPLICATE KEY UPDATE item_id =?, qty=?";
  const storeItemSeed = () => {
    return new Promise((resolve, reject) => {
      try {
        items.forEach(async (data) => {
          const { item, category, item_price, item_desc, stock } = data;
          let [result] = await connection.query(sql1, [
            item,
            item_price,
            item_desc,
            item,
            item_price,
            item_desc,
          ]);
          let id = result.insertId;
          await connection.query(sql2, [id, category, id, category]);
          await connection.query(sql3, [id, stock, id, stock]);
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  storeItemSeed()
    .then((result) => {
      return res.status(200).json("Item seeding is successfully executed!");
    })
    .catch((err) => {
      return res.status(500).json("Failed to seed items");
    });
};

exports.orderSeed = (req, res) => {
  let orders = req.orders;
  let sql1 = "INSERT INTO orders (user_id,order_placed) VALUES (?,?)";
  let sql2 =
    "INSERT INTO orderlines (order_id,item_id,qty,order_price) VALUES (?,?,?,?)";

  const orderSeed = () => {
    return new Promise(async (resolve, reject) => {
      try {
        orders.forEach(async (order) => {
          let [result1] = await connection.query(sql1, [
            order.user,
            order.order_placed,
          ]);
          const id = result1.insertId;
          const itemOrders = order.orders
          itemOrders.forEach(async (data) => {
            await connection.query(sql2, [id, data.item, data.qty, data.price]);
          });
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  orderSeed().then((result)=>{
    return res.status(200).json("Seeding orders is successfully executed")
  }).catch((err)=>{
    return res.status(500).json("Seeding orders is Failed")
  })
};
