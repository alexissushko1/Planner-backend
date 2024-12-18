const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all school passwords
router.get("/school-password", authenticate, async (req, res, next) => {
  try {
    const password = await prisma.schoolPassword.findMany();
    res.json(password);
  } catch (e) {
    next(e);
  }
});

//Add a school password
router.post("/school-password", authenticate, async (req, res, next) => {
  const { userId, accountName, username, password, isTeacher } = req.body;
  try {
    const schoolPassword = await prisma.schoolPassword.create({
      data: {
        userId,
        accountName,
        username,
        password,
        isTeacher,
      },
    });
    res.status(201).json(schoolPassword);
  } catch (e) {
    next(e);
  }
});

//Update a school password
router.patch("/school-password/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, accountName, username, password, isTeacher } = req.body;

  try {
    const schoolPassword = await prisma.schoolPassword.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!schoolPassword) {
      return next({
        status: 404,
        message: `Password with id: ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (accountName) updateData.accountName = accountName;
    if (username) updateData.username = username;
    if (password) updateData.password = password;
    if (isTeacher) updateData.isTeacher = isTeacher;

    const updatedPassword = await prisma.schoolPassword.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedPassword);
  } catch (e) {
    next(e);
  }
});

//Delete a school password
router.delete("/school-password/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const password = await prisma.schoolPassword.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.schoolPassword.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
