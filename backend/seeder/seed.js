const { faker } = require("@faker-js/faker");
const connection = require("../config/database");

let date = new Date();
let currYear = date.getFullYear();
let currDate = Date.now();

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

exports.categorySeed = async (req, res, next) => {
  const categories = [
    "fashion",
    "casual",
    "travel",
    "school",
    "work",
    "tech",
    "sport",
    "formal",
    "utility",
    "shopping",
    "eco",
    "fitness",
    "everyday",
    "evening",
    "billioned",
  ];
  req.categories = categories;
  next();
};

exports.itemSeed = async (req, res, next) => {
  const bags = [
    "Backpack",
    "Tote Bag",
    "Shoulder Bag",
    "Crossbody Bag",
    "Messenger Bag",
    "Duffel Bag",
    "Laptop Bag",
    "Briefcase",
    "Sling Bag",
    "Clutch",
    "Fanny Pack",
    "Drawstring Bag",
    "Satchel",
    "Camera Bag",
    "Gym Bag",
    "Shopping Bag",
    "Travel Bag",
    "Rolling Luggage",
    "Carry-on Bag",
    "Weekender Bag",
    "Cosmetic Bag",
    "Diaper Bag",
    "Beach Bag",
    "Bucket Bag",
    "Hobo Bag",
    "Mini Backpack",
    "Garment Bag",
    "Hydration Pack",
    "Tool Bag",
    "Bike Bag",
    "Laundry Bag",
    "Bum Bag",
    "Makeup Bag",
    "Hard Shell Suitcase",
    "Soft Shell Suitcase",
    "Rucksack",
    "Chest Rig Bag",
    "Tactical Bag",
    "Anti-theft Bag",
    "Convertible Bag",
    "Roll-top Backpack",
    "Laptop Sleeve",
    "School Bag",
    "Leather Briefcase",
    "Knitted Tote",
    "PVC Bag",
    "Wicker Bag",
    "Bowling Bag",
    "Flight Bag",
    "Doctor Bag",
  ];

  let [categoryResult] = await connection.query(
    "SELECT category_id FROM categories",
    []
  );
  let categories = [];
  categories = categoryResult.map((category) => category.category_id);

  let items = [];
  for (let i in bags) {
    items.push({
      item: bags[i],
      category:
        categories[faker.number.int({ max: categories.length - 1, min: 0 })],
      item_price: `${faker.number.int({
        min: 100,
        max: 100000,
      })}.${faker.number.int({ min: 0, max: 99 })}`,
      item_desc: faker.lorem.paragraph(),
      stock: faker.number.int({ min: 1, max: 10000 }),
    });
  }

  req.items = items;

  next();
};

exports.orderSeed = async (req, res, next) => {
  Promise.all([
    await connection
      .query("SELECT user_id FROM user", [])
      .then(([rows]) => rows.map((id) => id.user_id)),
    await connection
      .query("SELECT item_id,item_price FROM items", [])
      .then(([rows]) => rows),
  ])
    .then((results) => {
      let users = results[0];
      let items = results[1];
      // return res.json([users,items]);
      let orders = [];

      function parseOrders() {
        let orderedItems = [];
        for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
          let index = faker.number.int(items.length - 1);
          let item = items[index].item_id;
          let qty = faker.number.int({ min: 1, max: 3 });
          let price = (qty * items[index].item_price).toFixed(2);
          orderedItems.push({
            item,
            qty,
            price,
          });
        }

        return orderedItems;
      }

      users.forEach((user) => {
        orders.push({
          user,
          orders: parseOrders(),
          order_placed: faker.date.between({
            from: `${currYear}-01-01`,
            to: currDate,
          }),
        });
      });

      req.orders = orders;
      // return res.json(orders)
      next();
    })
    .catch((err) => {
      return res.status(500).json("Failed to seed orders");
    });
};
