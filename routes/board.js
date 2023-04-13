const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const boardController = require("../controllers/board");
const isAuth = require("../middleware/isAuth");

router.post(
  "/board",
  isAuth,
  [
    body("title", "At least have to be more than 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  boardController.insertBoard
);

module.exports = router;
