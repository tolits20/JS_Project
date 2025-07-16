const connection = require("../config/database");

exports.getAll = async (req, res) => {
  let query = "SELECT * FROM categories";
  let [result] = await connection.query(query, []);

  if(result.fieldCount <1) return res.status(500).json("failed to fetch the category records")

    return res.status(200).json(result)
};
