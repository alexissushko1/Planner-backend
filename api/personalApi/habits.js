const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all habits
router.get("/habit", authenticate, async (req, res, next) => {
  try {
    const habit = await prisma.habitTracker.findMany();
    res.json(habit);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (habitName) updateData.habitName = habitName;
    if (frequency) updateData.frequency = frequency;
    if (goal) updateData.goal = goal;
    if (progress) updateData.progress = progress;

    const updatedHabit = await prisma.habitTracker.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedHabit);
  } catch (e) {
    next(e);
  }
});

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

//Get all cleaning tasks
router.get("/cleaning", authenticate, async (req, res, next) => {
  try {
    const task = await prisma.cleaningChecklist.findMany();
    res.json(task);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (taskName) updateData.taskName = taskName;
    if (isCompleted) updateData.isCompleted = isCompleted;

    const updatedTask = await prisma.cleaningChecklist.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedTask);
  } catch (e) {
    next(e);
  }
});

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

module.exports = router;
