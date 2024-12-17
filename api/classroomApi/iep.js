const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all iep data
router.get("/iep", authenticate, async (req, res, next) => {
  try {
    const studentData = await prisma.iEP.findMany();
    res.json(studentData);
  } catch (e) {
    next(e);
  }
});

//Add information
router.post("/iep", authenticate, async (req, res, next) => {
  const { userId, studentId, iepDetails } = req.body;
  try {
    const studentData = await prisma.iEP.create({
      data: {
        userId,
        studentId,
        iepDetails,
      },
    });
    res.status(201).json(studentData);
  } catch (e) {
    next(e);
  }
});

//Update information
router.patch("/iep/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, studentId, iepDetails } = req.body;

  try {
    const studentData = await prisma.iEP.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!studentData) {
      return next({
        status: 404,
        message: `Data entry with id: ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (studentId) updateData.studentId = studentId;
    if (iepDetails) updateData.iepDetails = iepDetails;

    const updatedStudentData = await prisma.iEP.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedStudentData);
  } catch (e) {
    next(e);
  }
});

//Delete infromation
router.delete("/iep/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const studentData = await prisma.iEP.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.iEP.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
