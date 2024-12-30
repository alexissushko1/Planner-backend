const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing and comparison.
const express = require("express"); // Import Express framework to create routes and handle HTTP requests.
const router = express.Router(); // Create a new router instance for handling requests related to authentication and user management.

const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library for creating and verifying JWT tokens.
const JWT_SECRET = process.env.JWT_SECRET; // Retrieve the JWT secret key from environment variables
const prisma = require("../../prisma"); // Import the Prisma client to interact with the database for user-related queries.

/**
 * creates token with id for the user to login
 * @param {number} id
 * @returns token expiring in 1 day
 */
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

/**
 * Middleware to verify JWT token from request headers.
 * If valid, attaches user object to the request
 */

//Verifies the token given by the user
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); // Remove "Bearer " prefix
  if (!token) return next(); // Proceed without user data if no token is found.

  try {
    const { id } = jwt.verify(token, JWT_SECRET); // Verify the token and extract user ID.
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });
    req.user = user; // Attach the user object to the request.
    next();
  } catch (e) {
    next(e); // Pass the error to the next middleware.
  }
});

/**
 * Registers a new user by creating an entry in the database and returning a JWT token.
 * @param {Object} req - The request object, containing the user's registration details.
 * @param {string} req.body.username - The desired username of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The desired password of the user.
 * @param {Object} res - The response object used to send the token or error back.
 * @param {Function} next - The next middleware function.
 */

//Creates a new user and responds with a token in an object
router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username, email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = await prisma.user.register(username, email, password);
    const token = createToken(user.id);
    res.status(201).json({ token }); // Respond with the token upon successful registration.
  } catch (e) {
    next(e); // Pass any error to the next middleware.
  }
});

/**
 * Logs in an existing user by validating their credentials and returning a JWT token.
 * @param {Object} req - The request object, containing the user's login details.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object used to send the token or error back.
 * @param {Function} next - The next middleware function.
 */

//Checks the user id and password, returns a token if the credentials are valid
router.post("/login", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await prisma.user.login(username, email, password);
    const token = createToken(user.id);
    res.json({ token }); // Respond with the token upon successful login.
  } catch (e) {
    next(e); // Pass any error to the next middleware.
  }
});

/**
 * Middleware to authenticate the user.
 * Verifies that the user is logged in by checking if a valid user object exists in `req.user`.
 * If not, returns an error message.
 * @param {Object} req - The request object containing the user object (if authenticated).
 * @param {Object} res - The response object used to send errors if not authenticated.
 * @param {Function} next - The next middleware function.
 */

function authenticate(req, res, next) {
  if (req.user) {
    next(); // Proceed if the user is authenticated.
  } else {
    next({ status: 404, message: "You must login first" }); // Send error if the user is not authenticated.
  }
}

/**
 * Retrieves the logged-in user's information.
 * Requires the user to be authenticated.
 * @param {Object} req - The request object, with the user object attached if authenticated.
 * @param {Object} res - The response object used to return user data.
 * @param {Function} next - The next middleware function.
 */

// Get user information

router.get("/user", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  } catch (e) {
    next(e);
  }
});

/**
 * Updates the user's profile with new details.
 * Requires the user to be authenticated and provides functionality to update username, email, and password.
 * @param {Object} req - The request object containing the user's new profile data.
 * @param {string} req.body.username - The updated username (optional).
 * @param {string} req.body.email - The updated email (optional).
 * @param {string} req.body.password - The updated password (optional).
 * @param {Object} res - The response object used to return the updated user data.
 * @param {Function} next - The next middleware function.
 */

router.patch("/update-profile", authenticate, async (req, res, next) => {
  const { username, email, password } = req.body;

  //Make sure user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "User not authenticated." });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    //Prepare the updated data
    const updatedData = {};

    if (username && username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username },
      });

      if (usernameExists && usernameExists.id !== req.user.id) {
        return res.status(400).json({ error: "Username already exists." });
      }

      updatedData.username = username;
    }

    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists && emailExists.id !== req.user.id) {
        return res.status(400).json({ error: "Email already exists." });
      }
      updatedData.email = email;
    }

    // If password is provided, hash it before saving
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updatedData,
    });

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (e) {
    next(e); // Pass any error to the next middleware.
  }
});

//Export the router object and authenticate middleware to be used in other parts of the application
module.exports = {
  router,
  authenticate,
};
