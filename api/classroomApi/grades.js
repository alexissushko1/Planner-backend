const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all grades
router.get("/grade", authenticate, async (req, res, next) => {
  try {
    const studentGrade = await prisma.grading.findMany();
    res.json(studentGrade);
  } catch (e) {
    next(e);
  }
});

//Add a grade
router.post("/grade", authenticate, async (req, res, next) => {
  const { userId, studentId, subject, grade } = req.body;
  try {
    const studentGrade = await prisma.grading.create({
      data: {
        userId,
        studentId,
        subject,
        grade,
      },
    });
    res.status(201).json(studentGrade);
  } catch (e) {
    next(e);
  }
});

//Update a grade
router.patch("/grade/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, studentId, subject, grade } = req.body;

  try {
    const studentGrade = await prisma.grading.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!studentGrade) {
      return next({
        status: 404,
        message: `Grade with id: ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (studentId) updateData.studentId = studentId;
    if (subject) updateData.subject = subject;
    if (grade) updateData.grade = grade;

    const updatedStudentGrade = await prisma.grading.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedStudentGrade);
  } catch (e) {
    next(e);
  }
});

//Delete a grade
router.delete("/grade/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const studentGrade = await prisma.grading.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.grading.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
