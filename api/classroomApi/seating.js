const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all seating charts
router.get("/seating", authenticate, async (req, res, next) => {
  try {
    const chart = await prisma.seatingChart.findMany();
    res.json(chart);
  } catch (e) {
    next(e);
  }
});

//Add a seating chart
router.post("/seating", authenticate, async (req, res, next) => {
  const { userId, seatingArrangement } = req.body;
  try {
    const chart = await prisma.seatingChart.create({
      data: {
        userId,
        seatingArrangement,
      },
    });
    res.status(201).json(chart);
  } catch (e) {
    next(e);
  }
});

//Update a seating chart
router.patch("/seating/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, seatingArrangement } = req.body;

  try {
    const chart = await prisma.seatingChart.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!chart) {
      return next({
        status: 404,
        message: `Seating chart ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (seatingArrangement) updateData.seatingArrangement = seatingArrangement;

    const updatedChart = await prisma.seatingChart.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedChart);
  } catch (e) {
    next(e);
  }
});

//Delete a seating chart
router.delete("/seating/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const chart = await prisma.seatingChart.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.seatingChart.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
