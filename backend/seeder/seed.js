const { faker } = require("@faker-js/faker");

exports.userSeed = async (req, res, next) => {
  const count = parseInt(req.params.count);

  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({
        firstName,
        lastName,
      }),
      password: "password",
    });
  }

  req.body = users;
  next();
};
