//Import for routing and database interaction
const express = require("express"); // Express is a web framework for Node.js
const router = express.Router(); // Creating an instance of the Express router

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth"); // Authentication middleware
const prisma = require("../../prisma"); // Prisma ORM instance for database operations

/**
 * @route GET /grade
 * @description Retrieves all grades from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of grading objects.
 */

//Get all grades
router.get("/grade", authenticate, async (req, res, next) => {
  try {
    const studentGrade = await prisma.grading.findMany();
    res.json(studentGrade);
  } catch (e) {
    next(e); // Passes any error to the error-handling middleware
  }
});

/**
 * @route POST /grade
 * @description Adds a new grade to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, studentId, subject, grade} - The grade data to be added.
 * @returns {Object} - The newly created grading object.
 */

//Add a grade
router.post("/grade", authenticate, async (req, res, next) => {
  const { userId, studentId, subject, grade } = req.body;
  try {
    const studentGrade = await prisma.grading.create({
      data: {
        userId,
        studentId,
        subject,
        grade,
      },
    });
    res.status(201).json(studentGrade);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /grade/:id
 * @description Updates an existing grade by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the grade to update.
 * @body {userId, studentId, subject, grade} - Fields to update.
 * @returns {Object} - The updated grading object.
 */

//Update a grade
router.patch("/grade/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, studentId, subject, grade } = req.body;

  try {
    const studentGrade = await prisma.grading.findUniqueOrThrow({
      where: { id: +id },
    });

    if (!studentGrade) {
      return next({
        status: 404,
        message: `Grade with id: ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (studentId) updateData.studentId = studentId;
    if (subject) updateData.subject = subject;
    if (grade) updateData.grade = grade;

    // Apply the updates to the grade in the database
    const updatedStudentGrade = await prisma.grading.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedStudentGrade);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /grade/:id
 * @description Deletes a grade by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the grade to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a grade
router.delete("/grade/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    // Find the grade to delete
    const studentGrade = await prisma.grading.findUniqueOrThrow({
      where: { id: +id },
    });

    // Delete the grade from the database
    await prisma.grading.delete({ where: { id: +id } });
    res.sendStatus(204); // Responds with HTTP status 204 on successful deletion
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
