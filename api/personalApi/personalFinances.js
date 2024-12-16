const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all budget entries
router.get("/budget", authenticate, async (req, res, next) => {
  try {
    const budget = await prisma.monthlyBudget.findMany();
    res.json(budget);
  } catch (e) {
    next(e);
  }
});

//Add a budget entry
router.post("/budget", authenticate, async (req, res, next) => {
  const { userId, category, amount, isExpense } = req.body;
  try {
    const budget = await prisma.monthlyBudget.create({
      data: {
        userId,
        category,
        amount,
        isExpense,
      },
    });
    res.status(201).json(budget);
  } catch (e) {
    next(e);
  }
});

//Update a budget entry
router.patch("/budget/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, category, amount, isExpense } = req.body;

  try {
    const budget = await prisma.monthlyBudget.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!budget) {
      return next({
        status: 404,
        message: `Budget entry ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (category) updateData.category = category;
    if (amount) updateData.amount = amount;
    if (isExpense) updateData.isExpense = isExpense;

    const updatedBudget = await prisma.monthlyBudget.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedBudget);
  } catch (e) {
    next(e);
  }
});

//Delete a budget entry
router.delete("/budget/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const budget = await prisma.monthlyBudget.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.monthlyBudget.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
