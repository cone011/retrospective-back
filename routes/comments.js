const express = require("express");
const router = express.Router();
const { body, param, query, check } = require("express-validator");
const comments = require("../controllers/comments");
const isAuth = require("../middleware/isAuth");
const Post = require("../models/post");

router.get(
  "/comments",
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
  comments.getAllComments
);

router.get(
  "/comments-post/:postId",
  isAuth,
  [
    check("postId")
      .trim()
      .custom(async (value, { req }) => {
        const PostItem = await Post.findById(value);
        if (!PostItem) {
          throw new Error("This register was not found");
        }
      }),
  ],
  comments.getCommentsByPost
);

router.get(
  "/comments/:commentId",
  isAuth,
  [
    param("commentId", "At least select one register to obtain the information")
      .trim()
      .isLength({ min: 1 }),
  ],
  comments.getCommentById
);

router.post(
  "/comments",
  isAuth,
  [
    body("comments", "At least have a comment").isArray().isLength({ min: 1 }),
    check("postId")
      .trim()
      .custom(async (value, { req }) => {
        const PostItem = await Post.findById(value);
        if (!PostItem) {
          throw new Error("This register was not found");
        }
      }),
  ],
  comments.saveComments
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
