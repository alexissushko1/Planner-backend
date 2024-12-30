// Import PrismaClient from the Prisma package to interact with the database
const { PrismaClient } = require("@prisma/client");

// Create a new instance of PrismaClient to interact with the database
const prisma = new PrismaClient();

// Import seed functions for different types of data
const seedUsers = require("./seeds/seed.general");
const seedPersonal = require("./seeds/seed.personal");
const seedClassroom = require("./seeds/seed.classroom");

/**
 * Main function to execute the seeding process.
 * The function checks the seed type passed as an argument to determine
 * which set of data to seed into the database.
 *
 * @returns {Promise<void>} A promise that resolves once the seeding is complete.
 */

const main = async () => {
  const seedType = process.argv[2]; //Get seed type passed as argument

  // If no seed type is provided or "users" is specified, run the user seed
  if (!seedType || seedType === "users") {
    await seedUsers();
  }

  // If no seed type or "passwords" is specified, run the personal data seed
  if (!seedType || seedType === "passwords") {
    await seedPersonal();
  }

  // If no seed type is provided or "classroom" is specified, run the classroom seed
  if (!seedType) {
    await seedClassroom();
  }
};

// Invoke the main function and handle potential errors
main()
  .then(
    async () =>
      // Disconnect the Prisma client after the seeding process is done
      await prisma.$disconnect()
  )
  .catch(async (e) => {
    console.error(e); //Log errors
    await prisma.$disconnect(); // Ensure Prisma client disconnects even if an error occurs
    process.exit(1); // Exit the process with a non-zero status to indicate failure
  });
