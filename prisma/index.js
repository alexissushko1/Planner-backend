// Importing the necessary libraries
const bcrypt = require("bcryptjs"); // For hashing passwords securely
const { PrismaClient } = require("@prisma/client"); // For interacting with the Prisma database

// Create a new instance of the PrismaClient and extend it with custom methods for the 'user' model
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      /**
       * Registers a new user by creating a new user record in the database.
       * It hashes the password before storing it to ensure security.
       *
       * @param {string} username - The desired username for the new user.
       * @param {string} email - The email address for the new user.
       * @param {string} password - The plain text password that will be hashed.
       * @returns {Promise<Object>} - A promise that resolves to the created user object.
       * @throws {Error} - Throws an error if the user creation fails.
       */

      async register(username, email, password) {
        // Hash the plain text password using bcrypt with a salt rounds of 10
        const hash = await bcrypt.hash(password, 10);

        // Create a new user record in the database with hashed password
        const user = await prisma.user.create({
          data: { username, email, password: hash },
        });
        return user; // Return the created user object
      },

      /**
       * Logs in an existing user by validating the username/email and password.
       * Compares the provided password with the hashed password stored in the database.
       *
       * @param {string} username - The username of the user attempting to log in.
       * @param {string} email - The email address of the user attempting to log in.
       * @param {string} password - The plain text password provided by the user.
       * @returns {Promise<Object>} - A promise that resolves to the user object if login is successful.
       * @throws {Error} - Throws an error if the user is not found or the password is incorrect.
       */

      async login(username, email, password) {
        // Find the user by username or email. Throw an error if the user doesn't exist.
        const user = await prisma.user.findUniqueOrThrow({
          where: { username, email },
        });
        // Compare the provided plain password with the stored hashed password
        const valid = await bcrypt.compare(password, user.password);
        // If the password is invalid, throw an error
        if (!valid) throw Error("Wrong password");

        return user; //Return user object if login is successful
      },
    },
  },
});

// Export the extended Prisma client to be used in other parts of the application
module.exports = prisma;
