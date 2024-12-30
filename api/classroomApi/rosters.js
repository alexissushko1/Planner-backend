const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all rosters
router.get("/roster", authenticate, async (req, res, next) => {
  try {
    const roster = await prisma.classRoster.findMany();
    res.json(roster);
  } catch (e) {
    next(e);
  }
});

//Add a roster
router.post("/roster", authenticate, async (req, res, next) => {
  const { userId, studentName, gradeLevel, birthday } = req.body;
  try {
    const student = await prisma.classRoster.create({
      data: {
        userId,
        studentName,
        gradeLevel,
        birthday,
      },
    });
    res.status(201).json(student);
  } catch (e) {
    next(e);
  }
});

//Update a roster
router.patch("/roster/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, studentName, gradeLevel, birthday } = req.body;

  try {
    const student = await prisma.classRoster.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!student) {
      return next({
        status: 404,
        message: `Student with id: ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (studentName) updateData.studentName = studentName;
    if (gradeLevel) updateData.gradeLevel = gradeLevel;
    if (birthday) updateData.birthday = birthday;

    const updatedStudentInfo = await prisma.classRoster.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedStudentInfo);
  } catch (e) {
    next(e);
  }
});

//Delete a roster
router.delete("/roster/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await prisma.classRoster.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.classRoster.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
