//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /medical
 * @description Retrieves all medical info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of medical objects.
 */

//Get all medical
router.get("/medical", authenticate, async (req, res, next) => {
  try {
    const medical = await prisma.personalMedical.findMany();
    res.json(medical);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /medical
 * @description Adds new  info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, medicalCondition, prescription, doctorName} - The medical info to be added.
 * @returns {Object} - The newly created medical object.
 */

//Add medical info
router.post("/medical", authenticate, async (req, res, next) => {
  const { userId, medicalCondition, prescription, doctorName } = req.body;
  try {
    const medical = await prisma.personalMedical.create({
      data: {
        userId,
        medicalCondition,
        prescription,
        doctorName,
      },
    });
    res.status(201).json(medical);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /medical/:id
 * @description Updates medical info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the medical info to update.
 * @body {userId, medicalCondition, prescription, doctorName} - Fields to update.
 * @returns {Object} - The updated medical object.
 */

//Update medical info
router.patch("/medical/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, medicalCondition, prescription, doctorName } = req.body;

  try {
    const medical = await prisma.personalMedical.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!medical) {
      return next({
        status: 404,
        message: `Medical entry ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (medicalCondition) updateData.medicalCondition = medicalCondition;
    if (prescription) updateData.prescription = prescription;
    if (doctorName) updateData.doctorName = doctorName;

    // Apply the updates to the medical info in the database
    const updatedMedicalInfo = await prisma.personalMedical.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedMedicalInfo);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /medical/:id
 * @description Deletes medical info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the medical info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete medical info
router.delete("/medical/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const medical = await prisma.personalMedical.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.personalMedical.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
