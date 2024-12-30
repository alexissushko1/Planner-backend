const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all class
router.get("/transportation", authenticate, async (req, res, next) => {
  try {
    const transportationInfo = await prisma.studentTransportation.findMany();
    res.json(transportationInfo);
  } catch (e) {
    next(e);
  }
});

//Add transportation information
router.post("/transportation", authenticate, async (req, res, next) => {
  const { userId, studentId, transportationDetails } = req.body;
  try {
    const transportationInfo = await prisma.studentTransportation.create({
      data: {
        userId,
        studentId,
        transportationDetails,
      },
    });
    res.status(201).json(transportationInfo);
  } catch (e) {
    next(e);
  }
});

//Update transformation
router.patch("/transportation/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, studentId, transportationDetails } = req.body;

  try {
    const transportationInfo =
      await prisma.studentTransportation.findUniqueOrThrow({
        where: { id: +id },
      });
    if (!transportationInfo) {
      return next({
        status: 404,
        message: `Transportation data with id: ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (studentId) updateData.studentId = studentId;
    if (transportationDetails)
      updateData.transportationDetails = transportationDetails;

    const updatedTransportationInfo = await prisma.studentTransportation.update(
      {
        where: { id: +id },
        data: updateData,
      }
    );
    res.json(updatedTransportationInfo);
  } catch (e) {
    next(e);
  }
});

//Delete transportation information
router.delete("/transportation/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const transportationInfo =
      await prisma.studentTransportation.findUniqueOrThrow({
        where: { id: +id },
      });
    await prisma.studentTransportation.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
