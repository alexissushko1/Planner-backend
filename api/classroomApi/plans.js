//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /sub-plan
 * @description Retrieves all sub plans from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of sub plan objects.
 */

//Get all sub plans
router.get("/sub-plan", authenticate, async (req, res, next) => {
  try {
    const plan = await prisma.subPlan.findMany();
    res.json(plan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /sub-plan
 * @description Adds new sub plan to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, subject, planDescription, date} - The sub plan to be added.
 * @returns {Object} - The newly created sub plan object.
 */

//Add a sub plan
router.post("/sub-plan", authenticate, async (req, res, next) => {
  const { userId, subject, planDescription, date } = req.body;
  try {
    const plan = await prisma.subPlan.create({
      data: {
        userId,
        subject,
        planDescription,
        date,
      },
    });
    res.status(201).json(plan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /sub-plan/:id
 * @description Updates a sub plan by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the job to update.
 * @body {userId, subject, planDescription, date} - Fields to update.
 * @returns {Object} - The updated sub plan object.
 */

//Update a sub plan
router.patch("/sub-plan/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, subject, planDescription, date } = req.body;

  try {
    const plan = await prisma.subPlan.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!plan) {
      return next({
        status: 404,
        message: `Plan ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (subject) updateData.subject = subject;
    if (planDescription) updateData.planDescription = planDescription;
    if (date) updateData.date = date;

    // Apply the updates to the sub plan entry in the database
    const updatedPlan = await prisma.subPlan.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPlan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /sub-plan/:id
 * @description Deletes a sub plan by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the sub plan to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a sub plan
router.delete("/sub-plan/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const plan = await prisma.subPlan.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.subPlan.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

/**
 * @route GET /weekly-plan
 * @description Retrieves all weekly plans from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of weekly plan objects.
 */

//Get all weekly lesson plans
router.get("/weekly-plan", authenticate, async (req, res, next) => {
  try {
    const plan = await prisma.weeklyLessonPlan.findMany();
    res.json(plan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /weekly-plan
 * @description Adds new weekly plan to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, subject, lessonDescription, weekStartdate, weekEndDate} - The weekly plan to be added.
 * @returns {Object} - The newly created weekly plan object.
 */

//Add a weekly lesson plan
router.post("/weekly-plan", authenticate, async (req, res, next) => {
  const { userId, subject, lessonDescription, weekStartDate, weekEndDate } =
    req.body;
  try {
    const plan = await prisma.weeklyLessonPlan.create({
      data: {
        userId,
        subject,
        lessonDescription,
        weekStartDate,
        weekEndDate,
      },
    });
    res.status(201).json(plan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /weekly-plan/:id
 * @description Updates a weekly plan by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the plan to update.
 * @body {userId, subject, lessonDescription, weekStartDate, weekEndDate} - Fields to update.
 * @returns {Object} - The updated weekly plan object.
 */

//Update a weekly lesson plan
router.patch("/weekly-plan/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, subject, lessonDescription, weekStartDate, weekEndDate } =
    req.body;

  try {
    const plan = await prisma.weeklyLessonPlan.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!plan) {
      return next({
        status: 404,
        message: `Plan ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (subject) updateData.subject = subject;
    if (lessonDescription) updateData.lessonDescription = lessonDescription;
    if (weekStartDate) updateData.weekStartDate = weekStartDate;
    if (weekEndDate) updateData.weekEndDate = weekEndDate;

    // Apply the updates to the weekly lesson plan entry in the database
    const updatedPlan = await prisma.weeklyLessonPlan.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPlan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /weekly-plan/:id
 * @description Deletes a weekly plan by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the weekly plan to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a weekly lesson plan
router.delete("/weekly-plan/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const plan = await prisma.weeklyLessonPlan.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.weeklyLessonPlan.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

/**
 * @route GET /daily-plan
 * @description Retrieves all daily plans from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of daily plan objects.
 */

//Get all daily lesson plans
router.get("/daily-plan", authenticate, async (req, res, next) => {
  try {
    const plan = await prisma.dailyLessonPlan.findMany();
    res.json(plan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /daily-plan
 * @description Adds new daily plan to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, subject, lessonDescription, date } - The daily plan to be added.
 * @returns {Object} - The newly created daily plan object.
 */

//Add a daily lesson plan
router.post("/daily-plan", authenticate, async (req, res, next) => {
  const { userId, subject, lessonDescription, date } = req.body;
  try {
    const plan = await prisma.dailyLessonPlan.create({
      data: {
        userId,
        subject,
        lessonDescription,
        date,
      },
    });
    res.status(201).json(plan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /daily-plan/:id
 * @description Updates a daily plan by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the plan to update.
 * @body {userId, subject, lessonDescription, date} - Fields to update.
 * @returns {Object} - The updated daily plan object.
 */

//Update a daily lesson plan
router.patch("/daily-plan/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, subject, lessonDescription, date } = req.body;

  try {
    const plan = await prisma.dailyLessonPlan.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!plan) {
      return next({
        status: 404,
        message: `Plan ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (subject) updateData.subject = subject;
    if (lessonDescription) updateData.lessonDescription = lessonDescription;
    if (date) updateData.date = date;

    // Apply the updates to the daily lesson plan entry in the database
    const updatedPlan = await prisma.dailyLessonPlan.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPlan);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /daily-plan/:id
 * @description Deletes a daily plan by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the daily plan to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a daily lesson plan
router.delete("/daily-plan/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const plan = await prisma.dailyLessonPlan.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.dailyLessonPlan.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
