const bcrypt = require("bcrypt");

function hash(toParse, times) {
  return bcrypt.hash(toParse, times);
}

module.exports = { hash };
