const express = require("express");
const router = express.Router();
const { body, check, param, query } = require("express-validator");
const userController = require("../controllers/users");
const isAuth = require("../middleware/isAuth");
const User = require("../models/users");

router.get(
  "/users",
  isAuth,
  [
    query("currentPage", "Select at least one page")
      .isNumeric()
      .isLength({ min: 1 }),
    query("perPage", "Select the limit of users per page")
      .isNumeric()
      .isLength({ min: 1 }),
  ],
  userController.getAllUsers
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  userController.login
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (value, { req }) => {
        const userFound = await User.findOne({ emai: value });
        if (userFound) {
          throw new Error(
            "This email is already exists, please enter a diffrent one"
          );
        }
      })
      .normalizeEmail(),
    body("password", "Please enter a password with at least 5 characters")
      .trim()
      .isLength({ min: 5 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("The password has to match");
        }
      }),
    body("firstName", "Please enter a name to complete the registration")
      .trim()
      .isLength({ min: 5 }),
    body("lastName", "Please enter your lastname to complete the registration")
      .trim()
      .isLength({ min: 5 }),
  ],
  userController.signUp
);

router.post(
  "/reset",
  isAuth,
  [
    body("userId", "At least select a register").trim().isLength({ min: 1 }),
    body("newPassword", "Please enter a password with at least 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  userController.resetPassword
);

router.delete(
  "/user/:userId",
  isAuth,
  [param("userId", "At least select a register").trim().isLength({ min: 1 })],
  userController.deleteUser
);

module.exports = router;
