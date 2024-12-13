const express = require("express");
const router = express.Router();

const { authenticate } = require("./auth");
const prisma = require("../prisma");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const stickers = await prisma.stickers.findMany({});
    res.json(stickers);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
