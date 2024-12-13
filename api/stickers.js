const express = require("express");
const router = express.Router();

const { authenticate } = require("./auth");
const prisma = require("../prisma");

router.get("/sticker", authenticate, async (req, res, next) => {
  try {
    const sticker = await prisma.sticker.findMany();
    res.json(sticker);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
