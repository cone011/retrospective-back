const express = require("express");
const router = express.Router();
const { param, body, query } = require("express-validator");
const type = require("../controllers/type");
const isAuth = require("../middleware/isAuth");

router.get(
  "/type",
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
  type.getAllTypes
);

router.get(
  "/type/:typeId",
  isAuth,
  param("typeId", "At least select one register to delete")
    .trim()
    .isLength({ min: 1 }),
  type.getTypeById
);

router.post(
  "/type",
  isAuth,
  [
    body("name", "At least the name have a length of 3 characters")
      .trim()
      .isLength({ min: 3 }),
  ],
  type.insertType
);

router.put(
  "/type/:typeId",
  isAuth,
  [
    body("name", "At least the name have a length of 5 characters")
      .trim()
      .isLength({ min: 5 }),
    param("typeId", "At least select one register to update")
      .trim()
      .isLength({ min: 1 }),
  ],
  type.updateType
);

router.delete(
  "/type/:typeId",
  isAuth,
  param("typeId", "At least select one register to delete")
    .trim()
    .isLength({ min: 1 }),
  type.deleteType
);

module.exports = router;
