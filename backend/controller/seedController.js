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

          hashPassword = await bcrypt.hash(password, 10);

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
          await connection.query(sql,[req.categories[i],req.categories[i]])
        }
        resolve (true)
      } catch (error) {
        reject(error)
      }
    });
  };

  storeCategorySeed().then((result)=>{
    return res.status(200).json("Category Seeding is Successfully executed")
  }).catch((err)=>{
    return res.status(500).json(err)
  })
};
