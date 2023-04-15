const express = require("express");
const router = express.Router();
const { body, param, query, check } = require("express-validator");
const Board = require("../models/board");
const boardController = require("../controllers/board");
const isAuth = require("../middleware/isAuth");

router.get(
  "/board",
  isAuth,
  [
    query(
      "currentPage",
      "At least select a page for display the data"
    ).isNumeric(),
    query(
      "perPage",
      "At least select the register you wanna show per page"
    ).isNumeric(),
  ],
  boardController.getAllBoard
);

router.get(
  "/board/:boardId",
  isAuth,
  [
    check("boardId")
      .trim()
      .custom(async (value, { req }) => {
        const boardItem = await Board.findById(value);
        if (!boardItem) {
          throw new Error("This register was not found");
        }
      }),
  ],
  boardController.getBoardById
);

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
