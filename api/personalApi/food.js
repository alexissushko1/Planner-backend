//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /grocery
 * @description Retrieves all grocery info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of grocery objects.
 */

//Get all grocery lists
router.get("/grocery", authenticate, async (req, res, next) => {
  try {
    const grocery = await prisma.groceryList.findMany();
    res.json(grocery);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /grocery
 * @description Adds new grocery info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, itemName, quantity, isPurchased} - The grocery info to be added.
 * @returns {Object} - The newly created grocery object.
 */

//Add a grocery list
router.post("/grocery", authenticate, async (req, res, next) => {
  const { userId, itemName, quantity, isPurchased } = req.body;
  try {
    const grocery = await prisma.groceryList.create({
      data: {
        userId,
        itemName,
        quantity,
        isPurchased,
      },
    });
    res.status(201).json(grocery);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /grocery/:id
 * @description Updates grocery info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the grocery to update.
 * @body { userId, itemName, quantity, isPurchased } - Fields to update.
 * @returns {Object} - The updated grocery object.
 */

//Update a grocery list
router.patch("/grocery/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, itemName, quantity, isPurchased } = req.body;

  try {
    const grocery = await prisma.groceryList.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!grocery) {
      return next({
        status: 404,
        message: `Grocery list ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (itemName) updateData.itemName = itemName;
    if (quantity) updateData.quantity = quantity;
    if (isPurchased) updateData.isPurchased = isPurchased;

    // Apply the updates to the grocery data in the database
    const updatedGroceryList = await prisma.groceryList.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedGroceryList);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /grocery/:id
 * @description Deletes grocery info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the grocery info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a grocery list
router.delete("/grocery/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await prisma.groceryList.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.groceryList.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

/**
 * @route GET /weekly-meals
 * @description Retrieves all weekly meals info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of weekly meals objects.
 */

//Get all meals for the week
router.get("/weekly-meals", authenticate, async (req, res, next) => {
  try {
    const meals = await prisma.mealsForWeek.findMany();
    res.json(meals);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /weekly-meals
 * @description Adds new weekly meal info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, dayOfWeek, mealDescription} - The weekly meal info to be added.
 * @returns {Object} - The newly created weekly meal object.
 */

//Add a meal
router.post("/weekly-meals", authenticate, async (req, res, next) => {
  const { userId, dayOfWeek, mealDescription } = req.body;
  try {
    const meals = await prisma.mealsForWeek.create({
      data: {
        userId,
        dayOfWeek,
        mealDescription,
      },
    });
    res.status(201).json(meals);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /weekly-meals/:id
 * @description Updates weekly meal info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the weekly meal to update.
 * @body {userId, dayOfWeek, mealDescription} - Fields to update.
 * @returns {Object} - The updated weekly meal object.
 */

//Update a meal
router.patch("/weekly-meals/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, dayOfWeek, mealDescription } = req.body;

  try {
    const meals = await prisma.mealsForWeek.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!meals) {
      return next({
        status: 404,
        message: `Meal ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (dayOfWeek) updateData.dayOfWeek = dayOfWeek;
    if (mealDescription) updateData.mealDescription = mealDescription;

    // Apply the updates to the weekly meal in the database
    const updatedMeals = await prisma.mealsForWeek.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedMeals);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /weekly-meals/:id
 * @description Deletes weekly meal info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the weekly meal info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a meal
router.delete("/weekly-meals/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const meals = await prisma.mealsForWeek.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.mealsForWeek.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
