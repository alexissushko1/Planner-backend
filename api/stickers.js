const express = require("express");
const router = express.Router();

const { authenticate } = require("./auth");
const prisma = require("../prisma");

//Get all stickers
router.get("/sticker", authenticate, async (req, res, next) => {
  try {
    const sticker = await prisma.sticker.findMany();
    res.json(sticker);
  } catch (e) {
    next(e);
  }
});

//Add a sticker
router.post("/sticker", authenticate, async (req, res, next) => {
  const {
    userId,
    content,
    positionX,
    positionY,
    width,
    height,
    color,
    zIndex,
  } = req.body;
  try {
    const sticker = await prisma.sticker.create({
      data: {
        userId,
        content,
        positionX,
        positionY,
        width,
        height,
        color,
        zIndex,
      },
    });
    res.status(201).json(sticker);
  } catch (e) {
    next(e);
  }
});

//Update a sticker
router.patch("/sticker/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const {
    userId,
    content,
    positionX,
    positionY,
    width,
    height,
    color,
    zIndex,
  } = req.body;

  try {
    const sticker = await prisma.sticker.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!sticker) {
      return next({
        status: 404,
        message: `Sticker ${id} does not exist`,
      });
    }

    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (content) updateData.content = content;
    if (positionX) updateData.positionX = positionX;
    if (positionY) updateData.positionY = positionY;
    if (width) updateData.width = width;
    if (height) updateData.height = height;
    if (color) updateData.color = color;
    if (zIndex) updateData.zIndex = zIndex;

    const updatedSticker = await prisma.sticker.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedSticker);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
