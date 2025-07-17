const role = (role) => {
  return (req, res, next) => {
    // console.log(req)
    if (!req.role || req.role != role)
      return res
        .status(401)
        .json({
          message: `Unauthorize role Access. You must be an ${role} to access this resource`,
        });
    next();
  };
};

module.exports = role;
