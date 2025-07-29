const connection = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  console.log("here", req.body);
  if (!req.body || req.body == undefined)
    return res.status(500).json({ message: "no data receive" });
  const { email, password } = req.body;
  let getAccount = "SELECT * FROM user WHERE email = ? AND deleted_at IS NULL AND is_active=1";
  let [result] = await connection.query(getAccount, [email]);

  if (!result) return res.status(403).json({ message: "user not found" });

  // console.log(result);
  let match = await bcrypt.compare(password, result[0].password);
  if (!match)
    return res.status(403).json({ message: "Password does not match!" });
  // console.log(match)
  const token = jwt.sign(
    { data: result[0].user_id, role: result[0].role },
    process.env.JWT_SECRET,
    {
      expiresIn: `${process.env.JWT_EXPIRATION}`,
    }
  );

  if (!token)
    return res.status(500).json({
      message: "failed to generate a authentication token, please try again",
    });

  let [storeToken] = await connection.query(
    "UPDATE  user SET token=? WHERE user_id=?",
    [token, parseInt(result[0].user_id)]
  );

  if (storeToken.affectedRows < 1)
    return res.status(500).json("Failed to store the token in the database!");

  return res.status(200).json({
    message: `Welcome ${result[0].name}`,
    status: 200,
    token,
    role: result[0].role,
  });
};
