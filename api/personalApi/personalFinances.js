//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /budget
 * @description Retrieves all budget info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of budget objects.
 */

//Get all budget entries
router.get("/budget", authenticate, async (req, res, next) => {
  try {
    const budget = await prisma.monthlyBudget.findMany();
    res.json(budget);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /budget
 * @description Adds new budget info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, category, amount, isExpense} - The budget info to be added.
 * @returns {Object} - The newly created budget object.
 */

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

/**
 * @route PATCH /budget/:id
 * @description Updates budget info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the budget info to update.
 * @body {userId, category, amount, isExpense} - Fields to update.
 * @returns {Object} - The updated budget object.
 */

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

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (category) updateData.category = category;
    if (amount) updateData.amount = amount;
    if (isExpense) updateData.isExpense = isExpense;

    // Apply the updates to the budget info in the database
    const updatedBudget = await prisma.monthlyBudget.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedBudget);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /budget/:id
 * @description Deletes budget info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the budget info to delete.
 * @returns {null} - No content on successful deletion.
 */

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

/**
 * @route GET /personal-spending
 * @description Retrieves all spending info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of spending objects.
 */

//Get all spending entries
router.get("/personal-spending", authenticate, async (req, res, next) => {
  try {
    const spending = await prisma.spendTracker.findMany();
    res.json(spending);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /personal-spending
 * @description Adds new spending info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, description, amount} - The spending info to be added.
 * @returns {Object} - The newly created spending object.
 */

//Add a spending entry
router.post("/personal-spending", authenticate, async (req, res, next) => {
  const { userId, description, amount } = req.body;
  try {
    const spending = await prisma.spendTracker.create({
      data: {
        userId,
        description,
        amount,
      },
    });
    res.status(201).json(spending);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /personal-spending/:id
 * @description Updates spending info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the spending info to update.
 * @body {userId, description, amount} - Fields to update.
 * @returns {Object} - The updated spending object.
 */

//Update a spending entry
router.patch("/personal-spending/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, description, amount } = req.body;

  try {
    const spending = await prisma.spendTracker.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!spending) {
      return next({
        status: 404,
        message: `Spending entry ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (description) updateData.description = description;
    if (amount) updateData.amount = amount;

    // Apply the updates to the budget info in the database
    const updatedSpending = await prisma.spendTracker.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedSpending);
  } catch (e) {
    next(e);
  }
});
/**
 * @route DELETE /personal-spending/:id
 * @description Deletes spending info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the spending info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a spending entry
router.delete(
  "/personal-spending/:id",
  authenticate,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const spending = await prisma.spendTracker.findUniqueOrThrow({
        where: { id: +id },
      });
      await prisma.spendTracker.delete({ where: { id: +id } });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

// Exports the router for use in other parts of the application
module.exports = router;
