//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /reward
 * @description Retrieves all class rewards from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of class rewards objects.
 */

//Get all class rewards
router.get("/reward", authenticate, async (req, res, next) => {
  try {
    const reward = await prisma.classroomReward.findMany();
    res.json(reward);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /reward
 * @description Adds new class reward to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, rewardName, description, pointsRequired} - The reward to be added.
 * @returns {Object} - The newly created reward object.
 */

//Add a reward
router.post("/reward", authenticate, async (req, res, next) => {
  const { userId, rewardName, description, pointsRequired } = req.body;
  try {
    const reward = await prisma.classroomReward.create({
      data: {
        userId,
        rewardName,
        description,
        pointsRequired,
      },
    });
    res.status(201).json(reward);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /reward/:id
 * @description Updates a reward by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the job to update.
 * @body {userId, rewardName, description, pointsRequired} - Fields to update.
 * @returns {Object} - The updated reward object.
 */

//Update a reward
router.patch("/reward/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, rewardName, description, pointsRequired } = req.body;

  try {
    const reward = await prisma.classroomReward.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!reward) {
      return next({
        status: 404,
        message: `Reward with id: ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (rewardName) updateData.rewardName = rewardName;
    if (description) updateData.description = description;
    if (pointsRequired) updateData.pointsRequired = pointsRequired;

    // Apply the updates to the reward entry in the database
    const updatedReward = await prisma.classroomReward.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedReward);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /reward/:id
 * @description Deletes a reward by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the reward to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a reward
router.delete("/reward/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const reward = await prisma.classroomReward.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.classroomReward.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
