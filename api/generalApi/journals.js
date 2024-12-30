//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("./auth");
const prisma = require("../../prisma");

/**
 * @route GET /journal
 * @description Retrieves all journal info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of journal objects.
 */

//Get all journal entries
router.get("/journal", authenticate, async (req, res, next) => {
  try {
    const journal = await prisma.journal.findMany();
    res.json(journal);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /journal
 * @description Adds new journal info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, entryText} - The journal info to be added.
 * @returns {Object} - The newly created journal object.
 */

//Add a journal entry
router.post("/journal", authenticate, async (req, res, next) => {
  const { userId, entryText } = req.body;
  try {
    const journal = await prisma.journal.create({
      data: {
        userId,
        entryText,
      },
    });
    res.status(201).json(journal);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /journal/:id
 * @description Updates journal info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the journal to update.
 * @body {userId, entryText} - Fields to update.
 * @returns {Object} - The updated journal object.
 */

//Update a journal entry
router.patch("/journal/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, entryText } = req.body;

  try {
    const journal = await prisma.journal.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!journal) {
      return next({
        status: 404,
        message: `Journal entry ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (entryText) updateData.entryText = entryText;

    // Apply the updates to the journal in the database
    const updatedJournal = await prisma.journal.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedJournal);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /journal/:id
 * @description Deletes journal info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the journal info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a journal entry
router.delete("/journal/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const journal = await prisma.journal.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.journal.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
