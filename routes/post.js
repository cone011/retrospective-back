const express = require("express");
const router = express.Router();
const { body, param, query, check } = require("express-validator");
const Post = require("../models/post");
const post = require("../controllers/post");
const isAuth = require("../middleware/isAuth");

router.get(
  "/Post",
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
  post.getAllPost
);

router.get(
  "/Post/:PostId",
  isAuth,
  [
    check("PostId")
      .trim()
      .custom(async (value, { req }) => {
        const PostItem = await Post.findById(value);
        if (!PostItem) {
          throw new Error("This register was not found");
        }
      }),
  ],
  post.getPostById
);

router.post(
  "/Post",
  isAuth,
  [
    body("title", "At least have to be more than 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  post.insertPost
);

router.put(
  "/post/:PostId",
  isAuth,
  [
    param("PostId", "At least select one register to update")
      .trim()
      .isLength({ min: 1 }),
    body("title", "At least have to be more than 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  post.updatePost
);

router.delete(
  "/post/:PostId",
  isAuth,
  [
    param("PostId", "At least select one register to delete")
      .trim()
      .isLength({ min: 1 }),
  ],
  post.deletePost
);

module.exports = router;
