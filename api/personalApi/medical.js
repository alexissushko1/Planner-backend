const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all medical
router.get("/medical", authenticate, async (req, res, next) => {
  try {
    const medical = await prisma.personalMedical.findMany();
    res.json(medical);
  } catch (e) {
    next(e);
  }
});

//Add medical info
router.post("/medical", authenticate, async (req, res, next) => {
  const { userId, medicalCondition, prescription, doctorName } = req.body;
  try {
    const medical = await prisma.personalMedical.create({
      data: {
        userId,
        medicalCondition,
        prescription,
        doctorName,
      },
    });
    res.status(201).json(medical);
  } catch (e) {
    next(e);
  }
});

//Update medical info
router.patch("/medical/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, medicalCondition, prescription, doctorName } = req.body;

  try {
    const medical = await prisma.personalMedical.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!medical) {
      return next({
        status: 404,
        message: `Medical entry ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (medicalCondition) updateData.medicalCondition = medicalCondition;
    if (prescription) updateData.prescription = prescription;
    if (doctorName) updateData.doctorName = doctorName;

    const updatedMedicalInfo = await prisma.personalMedical.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedMedicalInfo);
  } catch (e) {
    next(e);
  }
});

//Delete medical info
router.delete("/medical/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const medical = await prisma.personalMedical.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.personalMedical.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
