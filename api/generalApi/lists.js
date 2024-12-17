const express = require("express");
const router = express.Router();

const { authenticate } = require("./auth");
const prisma = require("../../prisma");

//Get all to do lists
router.get("/todo", authenticate, async (req, res, next) => {
  try {
    const todo = await prisma.toDoList.findMany();
    res.json(todo);
  } catch (e) {
    next(e);
  }
});

//Add a to do list
router.post("/todo", authenticate, async (req, res, next) => {
  const { userId, taskName, isCompleted } = req.body;
  try {
    const todo = await prisma.toDoList.create({
      data: {
        userId,
        taskName,
        isCompleted,
      },
    });
    res.status(201).json(todo);
  } catch (e) {
    next(e);
  }
});

//Update a todo
router.patch("/todo/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, taskName, isCompleted } = req.body;

  try {
    const todo = await prisma.toDoList.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!todo) {
      return next({
        status: 404,
        message: `To Do List ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (taskName) updateData.taskName = taskName;
    if (isCompleted) updateData.isCompleted = isCompleted;

    const updatedToDo = await prisma.toDoList.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedToDo);
  } catch (e) {
    next(e);
  }
});

//Delete a to do
router.delete("/todo/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const todo = await prisma.toDoList.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.toDoList.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

//Get all shopping lists
router.get("/shopping", authenticate, async (req, res, next) => {
  try {
    const shopping = await prisma.shoppingList.findMany();
    res.json(shopping);
  } catch (e) {
    next(e);
  }
});

//Add a shopping list
router.post("/shopping", authenticate, async (req, res, next) => {
  const { userId, itemName, quantity, store, price } = req.body;
  try {
    const shopping = await prisma.shoppingList.create({
      data: {
        userId,
        itemName,
        quantity,
        store,
        price,
      },
    });
    res.status(201).json(shopping);
  } catch (e) {
    next(e);
  }
});

//Update a shopping list
router.patch("/shopping/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, itemName, quantity, store, price } = req.body;

  try {
    const shopping = await prisma.shoppingList.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!shopping) {
      return next({
        status: 404,
        message: `Shopping List ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (itemName) updateData.itemName = itemName;
    if (quantity) updateData.quantity = quantity;
    if (store) updateData.store = store;
    if (price) updateData.price = price;

    const updatedShopping = await prisma.shoppingList.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedShopping);
  } catch (e) {
    next(e);
  }
});

//Delete a shopping list
router.delete("/shopping/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const shopping = await prisma.shoppingList.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.shoppingList.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
