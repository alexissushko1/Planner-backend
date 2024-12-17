const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all class rewards
router.get("/reward", authenticate, async (req, res, next) => {
  try {
    const reward = await prisma.classroomReward.findMany();
    res.json(reward);
  } catch (e) {
    next(e);
  }
});

//Add a reward
router.post("/reward", authenticate, async (req, res, next) => {
  const { userId, rewardName, description, pointsRequired } = req.body;
  try {
    const reward = await prisma.classroomReward.create({
      data: {
        userId,
        rewardName,
        description,
        pointsRequired,
      },
    });
    res.status(201).json(reward);
  } catch (e) {
    next(e);
  }
});

//Update a reward
router.patch("/reward/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, rewardName, description, pointsRequired } = req.body;

  try {
    const reward = await prisma.classroomReward.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!reward) {
      return next({
        status: 404,
        message: `Reward with id: ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (rewardName) updateData.rewardName = rewardName;
    if (description) updateData.description = description;
    if (pointsRequired) updateData.pointsRequired = pointsRequired;

    const updatedReward = await prisma.classroomReward.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedReward);
  } catch (e) {
    next(e);
  }
});

//Delete a reward
router.delete("/reward/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const reward = await prisma.classroomReward.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.classroomReward.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
