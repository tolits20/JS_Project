const connection = require("../config/database");

let logType = {
  action: ["create", "update", "delete"],
  where: ["user", "item", "orders", "category"],
};

exports.log = async (event, where) => {
  if (!logType.action.includes(event) && !logType.where.includes(where)) return;
  let logText = `${where} ${event}`;
  let query = "INSERT INTO activity_logs (activity) VALUES (?)";
  await connection.query(query, [logText]);
};
