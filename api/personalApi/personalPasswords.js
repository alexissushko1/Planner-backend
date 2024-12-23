const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all personal passwords
router.get("/password", authenticate, async (req, res, next) => {
  try {
    const password = await prisma.personalPassword.findMany();
    res.json(password);
  } catch (e) {
    next(e);
  }
});

//Add a personal password
router.post("/password", authenticate, async (req, res, next) => {
  const { userId, accountName, username, password } = req.body;
  try {
    const personalPassword = await prisma.personalPassword.create({
      data: {
        userId,
        accountName,
        username,
        password,
      },
    });
    res.status(201).json(personalPassword);
  } catch (e) {
    next(e);
  }
});

//Update a personal password
router.patch("/password/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, eventName, eventDate, description } = req.body;

  try {
    const password = await prisma.personalPassword.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!password) {
      return next({
        status: 404,
        message: `Password ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (eventName) updateData.eventName = eventName;
    if (eventDate) updateData.eventDate = eventDate;
    if (description) updateData.description = description;

    const updatedPassword = await prisma.personalPassword.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPassword);
  } catch (e) {
    next(e);
  }
});

//Delete a personal password
router.delete("/password/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const password = await prisma.personalPassword.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.personalPassword.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});
module.exports = router;
