//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /seating
 * @description Retrieves all seating from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of seating objects.
 */

//Get all seating charts
router.get("/seating", authenticate, async (req, res, next) => {
  try {
    const chart = await prisma.seatingChart.findMany();
    res.json(chart);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /seating
 * @description Adds new seating chart to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, seatingArrangement} - The seating chart to be added.
 * @returns {Object} - The newly created seating object.
 */

//Add a seating chart
router.post("/seating", authenticate, async (req, res, next) => {
  const { userId, seatingArrangement } = req.body;
  try {
    const chart = await prisma.seatingChart.create({
      data: {
        userId,
        seatingArrangement,
      },
    });
    res.status(201).json(chart);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /seating/:id
 * @description Updates a seating chart by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the job to update.
 * @body {userId, seatingArrangement} - Fields to update.
 * @returns {Object} - The updated seating object.
 */

//Update a seating chart
router.patch("/seating/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, seatingArrangement } = req.body;

  try {
    const chart = await prisma.seatingChart.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!chart) {
      return next({
        status: 404,
        message: `Seating chart ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (seatingArrangement) updateData.seatingArrangement = seatingArrangement;

    // Apply the updates to the seating in the database
    const updatedChart = await prisma.seatingChart.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedChart);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /seating/:id
 * @description Deletes a seating chart by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the seating chart to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a seating chart
router.delete("/seating/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const chart = await prisma.seatingChart.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.seatingChart.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
