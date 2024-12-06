const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = require("../prisma");

/**
 * creates a token with the given id for the user to login
 * @param {number} id
 * @returns a token that expires in 1 day
 */
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

//Verifies the token given by the user
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  if (!token) return next();

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
});

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
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

//Checks the user id and password, returns a token if the credentials are valid
router.post("/login", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await prisma.user.login(username, email, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

/**
 * verification function to perform actions if the user is loged in
 */
function authenticate(req, res, next) {
  if (req.user) {
    next();
  } else {
    next({ status: 404, message: "You must login first" });
  }
}

module.exports = {
  router,
  authenticate,
};
