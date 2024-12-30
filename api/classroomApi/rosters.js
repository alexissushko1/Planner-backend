//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /roster
 * @description Retrieves all class rosters from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of class roster objects.
 */

//Get all rosters
router.get("/roster", authenticate, async (req, res, next) => {
  try {
    const roster = await prisma.classRoster.findMany();
    res.json(roster);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /roster
 * @description Adds new class roster to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, studentName, gradeLevel, birthday} - The roster to be added.
 * @returns {Object} - The newly created roster object.
 */

//Add a roster
router.post("/roster", authenticate, async (req, res, next) => {
  const { userId, studentName, gradeLevel, birthday } = req.body;
  try {
    const student = await prisma.classRoster.create({
      data: {
        userId,
        studentName,
        gradeLevel,
        birthday,
      },
    });
    res.status(201).json(student);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /roster/:id
 * @description Updates a roster by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the job to update.
 * @body {userId, studentName, gradeLevel, birthday} - Fields to update.
 * @returns {Object} - The updated roster object.
 */

//Update a roster
router.patch("/roster/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, studentName, gradeLevel, birthday } = req.body;

  try {
    const student = await prisma.classRoster.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!student) {
      return next({
        status: 404,
        message: `Student with id: ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (studentName) updateData.studentName = studentName;
    if (gradeLevel) updateData.gradeLevel = gradeLevel;
    if (birthday) updateData.birthday = birthday;

    // Apply the updates to the roster entry in the database
    const updatedStudentInfo = await prisma.classRoster.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedStudentInfo);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /roster/:id
 * @description Deletes a roster by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the roster to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a roster
router.delete("/roster/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await prisma.classRoster.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.classRoster.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
