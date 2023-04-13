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

router.put(
  "/board/:boardId",
  isAuth,
  [
    param("boardId", "At least select one register to update")
      .trim()
      .isLength({ min: 1 }),
    body("title", "At least have to be more than 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  boardController.updateBoard
);

router.delete(
  "/board/:boardId",
  isAuth,
  [
    param("boardId", "At least select one register to delete")
      .trim()
      .isLength({ min: 1 }),
  ],
  boardController.deleteBoard
);

module.exports = router;
