const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const seedUsers = require("./seeds/seed.general");
const seedPersonal = require("./seeds/seed.personal");

const main = async () => {
  const seedType = process.argv[2]; /*Get seed type passed as argument*/

  if (!seedType || seedType === "users") {
    await seedUsers();
  }
  if (!seedType || seedType === "passwords") {
    await seedPersonal();
  }
};
main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
