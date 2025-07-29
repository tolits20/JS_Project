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
          const query = "INSERT INTO user (name,email,password)values(?,?,?)";

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
        message: "succussfully registered",
        result: result,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json("failed to register, Please try again later");
    });

};
