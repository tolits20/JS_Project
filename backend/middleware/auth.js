const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  // console.log("body:", req.body, "header:", req.headers);
  if (!req.header("Authorization")) {
    return res.status(401).json({
      message: "Unauthorized Access",
      returnPage: "frontend/status_pages/403.html",
    });
  }

  const token = req.header("Authorization").split(" ")[1];

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.role = decoded.role;
    req.user = decoded; 
    // console.log(decoded);

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorize Access" });
  }
};

module.exports = isAuth;
