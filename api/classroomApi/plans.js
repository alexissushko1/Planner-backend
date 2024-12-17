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
module.exports = router;
