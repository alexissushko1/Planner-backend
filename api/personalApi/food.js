const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all grocery lists
router.get("/grocery", authenticate, async (req, res, next) => {
  try {
    const grocery = await prisma.groceryList.findMany();
    res.json(grocery);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (itemName) updateData.itemName = itemName;
    if (quantity) updateData.quantity = quantity;
    if (isPurchased) updateData.isPurchased = isPurchased;

    const updatedGroceryList = await prisma.groceryList.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedGroceryList);
  } catch (e) {
    next(e);
  }
});

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

//Get all meals for the week
router.get("/weekly-meals", authenticate, async (req, res, next) => {
  try {
    const meals = await prisma.mealsForWeek.findMany();
    res.json(meals);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (dayOfWeek) updateData.dayOfWeek = dayOfWeek;
    if (mealDescription) updateData.mealDescription = mealDescription;

    const updatedMeals = await prisma.mealsForWeek.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedMeals);
  } catch (e) {
    next(e);
  }
});

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

module.exports = router;
