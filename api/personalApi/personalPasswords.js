//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /password
 * @description Retrieves all personal password info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of personal password objects.
 */

//Get all personal passwords
router.get("/password", authenticate, async (req, res, next) => {
  try {
    const password = await prisma.personalPassword.findMany();
    res.json(password);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /password
 * @description Adds new password info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, accountName, username, password} - The personal password info to be added.
 * @returns {Object} - The newly created personal password object.
 */

//Add a personal password
router.post("/password", authenticate, async (req, res, next) => {
  const { userId, accountName, username, password } = req.body;
  try {
    const personalPassword = await prisma.personalPassword.create({
      data: {
        userId,
        accountName,
        username,
        password,
      },
    });
    res.status(201).json(personalPassword);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /password/:id
 * @description Updates personal password info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the personal password to update.
 * @body {userId, eventName, eventDate, description} - Fields to update.
 * @returns {Object} - The updated personal password object.
 */

//Update a personal password
router.patch("/password/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, eventName, eventDate, description } = req.body;

  try {
    const password = await prisma.personalPassword.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!password) {
      return next({
        status: 404,
        message: `Password ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (eventName) updateData.eventName = eventName;
    if (eventDate) updateData.eventDate = eventDate;
    if (description) updateData.description = description;

    // Apply the updates to the personal password in the database
    const updatedPassword = await prisma.personalPassword.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPassword);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /password/:id
 * @description Deletes personal password info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the personal password info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a personal password
router.delete("/password/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const password = await prisma.personalPassword.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.personalPassword.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
