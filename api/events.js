const express = require("express");
const router = express.Router();

const { authenticate } = require("./auth");
const prisma = require("../prisma");

//Get all calendar events
router.get("/event", authenticate, async (req, res, next) => {
  try {
    const event = await prisma.calendarEvent.findMany();
    res.json(event);
  } catch (e) {
    next(e);
  }
});

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

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (eventName) updateData.eventName = eventName;
    if (eventDate) updateData.eventDate = eventDate;
    if (description) updateData.description = description;

    const updatedEvent = await prisma.calendarEvent.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedEvent);
  } catch (e) {
    next(e);
  }
});

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
module.exports = router;
