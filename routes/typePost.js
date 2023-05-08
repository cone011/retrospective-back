const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const typeForm = require("../controllers/typePost");
const isAuth = require("../middleware/isAuth");

router.get("/type-post", isAuth, typeForm.getAllTypePost);

router.get(
  "/type-post/:typePostId",
  isAuth,
  [param("typePostId", "At least select a data").trim().isLength({ min: 1 })],
  typeForm.getTypePostById
);

router.post(
  "/type-post",
  isAuth,
  [
    body("name", "At least have to be more than 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  typeForm.insertTypePost
);

router.put(
  "/type-post",
  isAuth,
  [
    param("typePostId", "At least select a data").trim().isLength({ min: 1 }),
    body("name", "At least have to be more than 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  typeForm.updateTypePost
);

router.delete(
  "/type-post/:typePostId",
  isAuth,
  [param("typePostId", "At least select a data").trim().isLength({ min: 1 })],
  typeForm.deleteTypePost
);

module.exports = router;
