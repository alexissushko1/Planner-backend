const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all sub plans
router.get("/sub-plan", authenticate, async (req, res, next) => {
  try {
    const plan = await prisma.subPlan.findMany();
    res.json(plan);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (subject) updateData.subject = subject;
    if (planDescription) updateData.planDescription = planDescription;
    if (date) updateData.date = date;

    const updatedPlan = await prisma.subPlan.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPlan);
  } catch (e) {
    next(e);
  }
});

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

//Get all weekly lesson plans
router.get("/weekly-plan", authenticate, async (req, res, next) => {
  try {
    const plan = await prisma.weeklyLessonPlan.findMany();
    res.json(plan);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (subject) updateData.subject = subject;
    if (lessonDescription) updateData.lessonDescription = lessonDescription;
    if (weekStartDate) updateData.weekStartDate = weekStartDate;
    if (weekEndDate) updateData.weekEndDate = weekEndDate;

    const updatedPlan = await prisma.weeklyLessonPlan.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPlan);
  } catch (e) {
    next(e);
  }
});

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

//Get all daily lesson plans
router.get("/daily-plan", authenticate, async (req, res, next) => {
  try {
    const plan = await prisma.dailyLessonPlan.findMany();
    res.json(plan);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (subject) updateData.subject = subject;
    if (lessonDescription) updateData.lessonDescription = lessonDescription;
    if (date) updateData.date = date;

    const updatedPlan = await prisma.dailyLessonPlan.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPlan);
  } catch (e) {
    next(e);
  }
});

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

module.exports = router;
