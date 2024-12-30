//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /transportation
 * @description Retrieves all transportation info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of transportation objects.
 */

//Get all class
router.get("/transportation", authenticate, async (req, res, next) => {
  try {
    const transportationInfo = await prisma.studentTransportation.findMany();
    res.json(transportationInfo);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /transportation
 * @description Adds new transportation info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, studentId, transportationDetails} - The transportation info to be added.
 * @returns {Object} - The newly created transportation object.
 */

//Add transportation information
router.post("/transportation", authenticate, async (req, res, next) => {
  const { userId, studentId, transportationDetails } = req.body;
  try {
    const transportationInfo = await prisma.studentTransportation.create({
      data: {
        userId,
        studentId,
        transportationDetails,
      },
    });
    res.status(201).json(transportationInfo);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /transportation/:id
 * @description Updates transportation info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the job to update.
 * @body {userId, studentId, transportationDetails} - Fields to update.
 * @returns {Object} - The updated transportation object.
 */

//Update transformation
router.patch("/transportation/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, studentId, transportationDetails } = req.body;

  try {
    const transportationInfo =
      await prisma.studentTransportation.findUniqueOrThrow({
        where: { id: +id },
      });
    if (!transportationInfo) {
      return next({
        status: 404,
        message: `Transportation data with id: ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (studentId) updateData.studentId = studentId;
    if (transportationDetails)
      updateData.transportationDetails = transportationDetails;

    // Apply the updates to the transportation in the database
    const updatedTransportationInfo = await prisma.studentTransportation.update(
      {
        where: { id: +id },
        data: updateData,
      }
    );
    res.json(updatedTransportationInfo);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /transportation/:id
 * @description Deletes transportation info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the transportation info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete transportation information
router.delete("/transportation/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const transportationInfo =
      await prisma.studentTransportation.findUniqueOrThrow({
        where: { id: +id },
      });
    await prisma.studentTransportation.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
