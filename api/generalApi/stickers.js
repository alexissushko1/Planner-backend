//Import for routing and database interaction
const express = require("express");
const router = express.Router();

//Import authentication middleware and Prisma client for database access
const { authenticate } = require("./auth");
const prisma = require("../../prisma");

/**
 * @route GET /sticker
 * @description Retrieves all sticker info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of sticker objects.
 */

//Get all stickers
router.get("/sticker", authenticate, async (req, res, next) => {
  try {
    const sticker = await prisma.sticker.findMany();
    res.json(sticker);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /sticker
 * @description Adds new sticker info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId,content,positionX,positionY,width,height,color,zIndex,} - The sticker info to be added.
 * @returns {Object} - The newly created sticker object.
 */

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

/**
 * @route PATCH /sticker/:id
 * @description Updates sticker info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the sticker to update.
 * @body {userId,content,positionX,positionY,width,height,color,zIndex,} - Fields to update.
 * @returns {Object} - The updated sticker object.
 */

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

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (content) updateData.content = content;
    if (positionX) updateData.positionX = positionX;
    if (positionY) updateData.positionY = positionY;
    if (width) updateData.width = width;
    if (height) updateData.height = height;
    if (color) updateData.color = color;
    if (zIndex) updateData.zIndex = zIndex;

    // Apply the updates to the sticker in the database
    const updatedSticker = await prisma.sticker.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedSticker);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /sticker/:id
 * @description Deletes sticker info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the sticker info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete a sticker
router.delete("/sticker/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const sticker = await prisma.sticker.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.sticker.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

/**
 * @route GET /sticker-settings
 * @description Retrieves all sticker settings info from the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @returns {Object[]} - An array of sticker settings objects.
 */

//Get all sticker settings
router.get("/sticker-settings", authenticate, async (req, res, next) => {
  try {
    const stickerSettings = await prisma.stickerSetting.findMany();
    res.json(stickerSettings);
  } catch (e) {
    next(e);
  }
});

/**
 * @route POST /sticker-settings
 * @description Adds new sticker settings info to the database
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @body {userId, defaultColor, defaultSizeWidth, defaultSizeHeight} - The sticker settings info to be added.
 * @returns {Object} - The newly created sticker settings object.
 */

//Add a sticker preference
router.post("/sticker-settings", authenticate, async (req, res, next) => {
  const { userId, defaultColor, defaultSizeWidth, defaultSizeHeight } =
    req.body;
  try {
    const stickerSettings = await prisma.stickerSetting.create({
      data: {
        userId,
        defaultColor,
        defaultSizeWidth,
        defaultSizeHeight,
      },
    });
    res.status(201).json(stickerSettings);
  } catch (e) {
    next(e);
  }
});

/**
 * @route PATCH /sticker-settings/:id
 * @description Updates sticker settings info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the sticker setting to update.
 * @body {userId, defaultColor, defaultSizeWidth, defaultSizeHeight} - Fields to update.
 * @returns {Object} - The updated sticker object.
 */

//Update sticker preferences
router.patch("/sticker-settings/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId, defaultColor, defaultSizeWidth, defaultSizeHeight } =
    req.body;

  try {
    const stickerSettings = await prisma.stickerSetting.findUniqueOrThrow({
      where: { id: +id },
    });
    if (!stickerSettings) {
      return next({
        status: 404,
        message: `Sticker setting ${id} does not exist`,
      });
    }

    // Prepare the update object with the modified fields
    const updateData = {};
    if (userId) updateData.userId = +userId;
    if (defaultColor) updateData.defaultColor = defaultColor;
    if (defaultSizeWidth) updateData.defaultSizeWidth = defaultSizeWidth;
    if (defaultSizeHeight) updateData.defaultSizeHeight = defaultSizeHeight;

    // Apply the updates to the sticker settings in the database
    const updatedStickerSettings = await prisma.stickerSetting.update({
      where: { id: +id },
      data: updateData,
    });
    res.json(updatedStickerSettings);
  } catch (e) {
    next(e);
  }
});

/**
 * @route DELETE /sticker-settings/:id
 * @description Deletes sticker settings info by ID
 * @access Private (JWT authentication required)
 * @security JWT - A valid JWT token must be provided in the Authorization header.
 * @params {id} - The ID of the sticker settings info to delete.
 * @returns {null} - No content on successful deletion.
 */

//Delete sticker preference
router.delete("/sticker-settings/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const stickerSettings = await prisma.stickerSetting.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.stickerSetting.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// Exports the router for use in other parts of the application
module.exports = router;
