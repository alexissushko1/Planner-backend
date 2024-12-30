//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("./auth");
const prisma = require("../../prisma");

/**
 * @route GET /event
 * @description Retrieves all event info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of event objects.
 */

//Get all calendar events
router.get("/event", authenticate, async (req, res, next) => {
  try {
    const event = await prisma.calendarEvent.findMany();
    res.json(event);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /event
 * @description Adds new event info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, eventName, eventDate, description} - The event info to be added.
 * @returns {Object} - The newly created event object.
 */

//Add an event
router.post("/event", authenticate, async (req, res, next) => {
  const { userId, eventName, eventDate, description } = req.body;
  try {
    const event = await prisma.calendarEvent.create({
      data: {
        userId,
        eventName,
        eventDate,
        description,
      },
    });
    res.status(201).json(event);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /event/:id
 * @description Updates event info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the event to update.
 * @body {userId, eventName, eventDate, description} - Fields to update.
 * @returns {Object} - The updated event object.
 */

//Update an event
router.patch("/event/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, eventName, eventDate, description } = req.body;

  try {
    const event = await prisma.calendarEvent.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!event) {
      return next({
        status: 404,
        message: `Event ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (eventName) updateData.eventName = eventName;
    if (eventDate) updateData.eventDate = eventDate;
    if (description) updateData.description = description;

    // Apply the updates to the event in the database
    const updatedEvent = await prisma.calendarEvent.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedEvent);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /event/:id
 * @description Deletes event info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the event info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete an event
router.delete("/event/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await prisma.calendarEvent.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.calendarEvent.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
