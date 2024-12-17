const express = require("express");
const router = express.Router();

const { authenticate } = require("./auth");
const prisma = require("../../prisma");

//Get all journal entries
router.get("/journal", authenticate, async (req, res, next) => {
  try {
    const journal = await prisma.journal.findMany();
    res.json(journal);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (entryText) updateData.entryText = entryText;

    const updatedJournal = await prisma.journal.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedJournal);
  } catch (e) {
    next(e);
  }
});

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

module.exports = router;
