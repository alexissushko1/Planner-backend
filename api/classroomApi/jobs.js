//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("../generalApi/auth");
const prisma = require("../../prisma");

/**
 * @route GET /job
 * @description Retrieves all job data from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of job objects.
 */

//Get all classroom jobs
router.get("/job", authenticate, async (req, res, next) => {
  try {
    const job = await prisma.classroomJob.findMany();
    res.json(job);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /job
 * @description Adds new job to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, jobName, description} - The job to be added.
 * @returns {Object} - The newly created job object.
 */

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

/**
 * @route PATCH /job/:id
 * @description Updates an existing job by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the job to update.
 * @body {userId, jobName, description} - Fields to update.
 * @returns {Object} - The updated job object.
 */

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

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (jobName) updateData.jobName = jobName;
    if (description) updateData.description = description;

    // Apply the updates to the iep data entry in the database
    const updatedJob = await prisma.classroomJob.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedJob);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /job/:id
 * @description Deletes a job by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the job to delete.
 * @returns {null} - No content on successful deletion.
 */

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

// Exports the router for use in other parts of the application
module.exports = router;
