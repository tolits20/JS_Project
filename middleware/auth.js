const jwt = require("jsonwebtoken");

  const isAuth = (req, res, next) => {
  if (!req.header("Authorization")) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  const token = req.header('Authorization').split(' ')[1];

  let decoded = jwt.verify(token, process.env.JWT_SECRET)

  console.log(decoded)

  next();
};

module.exports =isAuth;
