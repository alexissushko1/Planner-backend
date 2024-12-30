//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /iep
 * @description Retrieves all iep data from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of iep data objects.
 */

//Get all iep data
router.get("/iep", authenticate, async (req, res, next) => {
  try {
    const studentData = await prisma.iEP.findMany();
    res.json(studentData);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /iep
 * @description Adds new iep data to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, studentId, iepDetails} - The iep data to be added.
 * @returns {Object} - The newly created iep data object.
 */

//Add information
router.post("/iep", authenticate, async (req, res, next) => {
  const { userId, studentId, iepDetails } = req.body;
  try {
    const studentData = await prisma.iEP.create({
      data: {
        userId,
        studentId,
        iepDetails,
      },
    });
    res.status(201).json(studentData);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /iep/:id
 * @description Updates an existing iep data entry by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the grade to update.
 * @body {userId, studentId, iepDetails} - Fields to update.
 * @returns {Object} - The updated iep data object.
 */

//Update information
router.patch("/iep/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, studentId, iepDetails } = req.body;

  try {
    const studentData = await prisma.iEP.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!studentData) {
      return next({
        status: 404,
        message: `Data entry with id: ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (studentId) updateData.studentId = studentId;
    if (iepDetails) updateData.iepDetails = iepDetails;

    // Apply the updates to the iep data entry in the database
    const updatedStudentData = await prisma.iEP.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedStudentData);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /iep/:id
 * @description Deletes an iep data entry by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the iep data entry to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete information
router.delete("/iep/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const studentData = await prisma.iEP.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.iEP.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
