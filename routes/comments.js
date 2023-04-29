const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const comments = require("../controllers/comments");
const isAuth = require("../middleware/isAuth");

router.get(
  "/comments/:commentId",
  isAuth,
  [
    param("typeId", "At least select one register to obtain the information")
      .trim()
      .isLength({ min: 1 }),
  ],
  comments.getCommentById
);

router.post(
  "/comments",
  isAuth,
  [
    body("text", "At least the name have a length of 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  comments.insertComment
);

router.post(
  "/comments/:commentId",
  isAuth,
  [
    param("typeId", "At least select one register to obtain the information")
      .trim()
      .isLength({ min: 1 }),
    body("text", "At least the name have a length of 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  comments.updateComment
);

router.delete(
  "/comments/:commentId",
  isAuth,
  [
    param("typeId", "At least select one register to obtain the information")
      .trim()
      .isLength({ min: 1 }),
  ],
  comments.deleteComment
);

module.exports = router;
