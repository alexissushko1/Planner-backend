const express = require("express");
const router = express.Router();

const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

//Get all classroom jobs
router.get("/job", authenticate, async (req, res, next) => {
  try {
    const job = await prisma.classroomJob.findMany();
    res.json(job);
  } catch (e) {
    next(e);
  }
});

// Add a job
router.post("/job", authenticate, async (req, res, next) => {
  const { userId, jobName, description } = req.body;
  try {
    const job = await prisma.classroomJob.create({
      data: {
        userId,
        jobName,
        description,
      },
    });
    res.status(201).json(job);
  } catch (e) {
    next(e);
  }
});

//Update a job
router.patch("/job/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, jobName, description } = req.body;

  try {
    const job = await prisma.classroomJob.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!job) {
      return next({
        status: 404,
        message: `Job ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (jobName) updateData.jobName = jobName;
    if (description) updateData.description = description;

    const updatedJob = await prisma.classroomJob.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedJob);
  } catch (e) {
    next(e);
  }
});

// Delete a job
router.delete("/job/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await prisma.classroomJob.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.classroomJob.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
