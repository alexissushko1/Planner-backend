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
};

module.exports = seedPersonal;
