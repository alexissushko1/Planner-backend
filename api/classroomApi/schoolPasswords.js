//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /school-password
 * @description Retrieves all school passwords from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of school password objects.
 */

//Get all school passwords
router.get("/school-password", authenticate, async (req, res, next) => {
  try {
    const password = await prisma.schoolPassword.findMany();
    res.json(password);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /school-password
 * @description Adds new password to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, accountName, username, password, isTeacher} - The password to be added.
 * @returns {Object} - The newly created password object.
 */

//Add a school password
router.post("/school-password", authenticate, async (req, res, next) => {
  const { userId, accountName, username, password, isTeacher } = req.body;
  try {
    const schoolPassword = await prisma.schoolPassword.create({
      data: {
        userId,
        accountName,
        username,
        password,
        isTeacher,
      },
    });
    res.status(201).json(schoolPassword);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /school-password/:id
 * @description Updates a password by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the job to update.
 * @body {userId, accountName, username, password, isTeacher} - Fields to update.
 * @returns {Object} - The updated password object.
 */

//Update a school password
router.patch("/school-password/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, accountName, username, password, isTeacher } = req.body;

  try {
    const schoolPassword = await prisma.schoolPassword.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!schoolPassword) {
      return next({
        status: 404,
        message: `Password with id: ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (accountName) updateData.accountName = accountName;
    if (username) updateData.username = username;
    if (password) updateData.password = password;
    if (isTeacher) updateData.isTeacher = isTeacher;

    // Apply the updates to the roster entry in the database
    const updatedPassword = await prisma.schoolPassword.update({
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
 * @description Deletes a password by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the password to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a school password
router.delete("/school-password/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const password = await prisma.schoolPassword.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.schoolPassword.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
