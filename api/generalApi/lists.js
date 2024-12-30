//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("./auth");
const prisma = require("../../prisma");

/**
 * @route GET /todo
 * @description Retrieves all to do list info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of to do list objects.
 */

//Get all to do lists
router.get("/todo", authenticate, async (req, res, next) => {
  try {
    const todo = await prisma.toDoList.findMany();
    res.json(todo);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /todo
 * @description Adds new todo list info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, taskName, isCompleted} - The to do list info to be added.
 * @returns {Object} - The newly created to do list object.
 */

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

/**
 * @route PATCH /todo/:id
 * @description Updates to do list info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the to do list to update.
 * @body {userId, taskName, isCompleted} - Fields to update.
 * @returns {Object} - The to do list object.
 */

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

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (taskName) updateData.taskName = taskName;
    if (isCompleted) updateData.isCompleted = isCompleted;

    // Apply the updates to the to do list in the database
    const updatedToDo = await prisma.toDoList.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedToDo);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /todo/:id
 * @description Deletes to do list list info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the to do list info to delete.
 * @returns {null} - No content on successful deletion.
 */

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

/**
 * @route GET /shopping
 * @description Retrieves all shopping info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of shopping objects.
 */

//Get all shopping lists
router.get("/shopping", authenticate, async (req, res, next) => {
  try {
    const shopping = await prisma.shoppingList.findMany();
    res.json(shopping);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /shopping
 * @description Adds new shopping info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, itemName, quantity, store, price} - The shopping info to be added.
 * @returns {Object} - The newly created shopping object.
 */

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

/**
 * @route PATCH /shopping/:id
 * @description Updates shopping info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the shopping info to update.
 * @body {userId, itemName, quantity, store, price} - Fields to update.
 * @returns {Object} - The updated shopping object.
 */

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

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (itemName) updateData.itemName = itemName;
    if (quantity) updateData.quantity = quantity;
    if (store) updateData.store = store;
    if (price) updateData.price = price;

    // Apply the updates to the transportation in the database
    const updatedShopping = await prisma.shoppingList.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedShopping);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /shopping/:id
 * @description Deletes shopping info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the shopping info to delete.
 * @returns {null} - No content on successful deletion.
 */

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

// Exports the router for use in other parts of the application
module.exports = router;
