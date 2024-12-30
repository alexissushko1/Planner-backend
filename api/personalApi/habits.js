//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /habit
 * @description Retrieves all habit info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of habit objects.
 */

//Get all habits
router.get("/habit", authenticate, async (req, res, next) => {
  try {
    const habit = await prisma.habitTracker.findMany();
    res.json(habit);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /habit
 * @description Adds new habit info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, habitName, frequency, goal, progress} - The habit info to be added.
 * @returns {Object} - The newly created habit object.
 */

//Add a habit
router.post("/habit", authenticate, async (req, res, next) => {
  const { userId, habitName, frequency, goal, progress } = req.body;
  try {
    const habit = await prisma.habitTracker.create({
      data: {
        userId,
        habitName,
        frequency,
        goal,
        progress,
      },
    });
    res.status(201).json(habit);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /habit/:id
 * @description Updates habit info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the habit to update.
 * @body {userId, habitName, frequency, goal, progress} - Fields to update.
 * @returns {Object} - The updated habit object.
 */

//Update a habit
router.patch("/habit/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, habitName, frequency, goal, progress } = req.body;

  try {
    const habit = await prisma.habitTracker.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!habit) {
      return next({
        status: 404,
        message: `Habit with id: ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (habitName) updateData.habitName = habitName;
    if (frequency) updateData.frequency = frequency;
    if (goal) updateData.goal = goal;
    if (progress) updateData.progress = progress;

    // Apply the updates to the habit in the database
    const updatedHabit = await prisma.habitTracker.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedHabit);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /habit/:id
 * @description Deletes habit info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the habit info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a habit
router.delete("/habit/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const habit = await prisma.habitTracker.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.habitTracker.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

/**
 * @route GET /cleaning
 * @description Retrieves all cleaning info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of cleaning objects.
 */

//Get all cleaning tasks
router.get("/cleaning", authenticate, async (req, res, next) => {
  try {
    const task = await prisma.cleaningChecklist.findMany();
    res.json(task);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /cleaning
 * @description Adds new cleaning info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, taskName, isCompleted} - The cleaning info to be added.
 * @returns {Object} - The newly created cleaning object.
 */

//Add a cleaning task
router.post("/cleaning", authenticate, async (req, res, next) => {
  const { userId, taskName, isCompleted } = req.body;
  try {
    const task = await prisma.cleaningChecklist.create({
      data: {
        userId,
        taskName,
        isCompleted,
      },
    });
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /cleaning/:id
 * @description Updates cleaning info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the cleaning info to update.
 * @body {userId, taskName, isCompleted} - Fields to update.
 * @returns {Object} - The updated cleaning object.
 */

//Update a cleaning task
router.patch("/cleaning/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, taskName, isCompleted } = req.body;

  try {
    const task = await prisma.cleaningChecklist.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!task) {
      return next({
        status: 404,
        message: `Task with id: ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (taskName) updateData.taskName = taskName;
    if (isCompleted) updateData.isCompleted = isCompleted;

    // Apply the updates to the cleaning info in the database
    const updatedTask = await prisma.cleaningChecklist.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedTask);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /cleaning/:id
 * @description Deletes cleaning info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the cleaning info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a cleaning task
router.delete("/cleaning/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await prisma.cleaningChecklist.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.cleaningChecklist.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
