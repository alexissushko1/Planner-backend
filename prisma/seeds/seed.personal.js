const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");

const seedPersonal = async (numPasswords = 5) => {
  const passwords = Array.from({ length: numPasswords }, () => ({
    userId: faker.number.int({ min: 1, max: 5 }),
    accountName: faker.internet.displayName(),
    username: faker.internet.username(),
    password: faker.internet.password(),
  }));

  await prisma.personalPassword.createMany({
    data: passwords,
  });

  //Create data for grocery lists
  const groceryListData = [
    {
      userId: 1,
      itemName: "Eggs",
      quantity: 2,
      isPurchased: false,
    },
    {
      userId: 1,
      itemName: "Almond Milk",
      quantity: 1,
      isPurchased: false,
    },
    {
      userId: 2,
      itemName: "Blackberries",
      quantity: 4,
      isPurchased: true,
    },
    {
      userId: 2,
      itemName: "Raspberries",
      quantity: 1,
      isPurchased: false,
    },
    {
      userId: 2,
      itemName: "Tofu",
      quantity: 1,
      isPurchased: false,
    },
    {
      userId: 2,
      itemName: "Bananas",
      quantity: 2,
      isPurchased: true,
    },
    {
      userId: 3,
      itemName: "Broccoli",
      quantity: 2,
      isPurchased: false,
    },
    {
      userId: 3,
      itemName: "Muffins",
      quantity: 1,
      isPurchased: true,
    },
    {
      userId: 3,
      itemName: "Kcups",
      quantity: 1,
      isPurchased: true,
    },
    {
      userId: 4,
      itemName: "Pears",
      quantity: 2,
      isPurchased: true,
    },
    {
      userId: 4,
      itemName: "Clementines",
      quantity: 1,
      isPurchased: false,
    },
    {
      userId: 5,
      itemName: "English Muffins",
      quantity: 1,
      isPurchased: true,
    },
    {
      userId: 5,
      itemName: "Grapes",
      quantity: 1,
      isPurchased: false,
    },
  ];

  //Insert grocery lists into datanbase
  await prisma.groceryList.createMany({ data: groceryListData });
};

module.exports = seedPersonal;
