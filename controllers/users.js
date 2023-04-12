const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { validationParams } = require("../utils/validationParams");
const { errorHandler } = require("../utils/errorHandler");

exports.signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    });
    const result = await user.save();
    res.status(201).json({ message: "OK", userId: result._id.toString() });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const userId = req.body.userId;
    const newPassword = req.body.newPassword;
    const userFound = await User.findOne(userId);
    if (!userFound) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    userFound.password = hashedPassword;
    await userFound.save();
    res.status(201).json({ message: "OK", isSaved: true });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const email = req.body.email;
    const password = req.body.password;
    const userFound = await User.findOne({ email: email });
    if (!userFound) {
      const error = new Error(
        "The user with this email are not register, please sign in!"
      );
      error.statusCode = 401;
      throw error;
    }
    const isEqual = bcrypt.compare(password, userFound.password);
    if (!isEqual) {
      const error = new Error("Invalid password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: userFound.email, userId: userFound._id.toString() },
      `${process.env.JWT_TOKEN}`,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: userFound._id.toString() });
  } catch (err) {
    errorHandler(err, next);
  }
};
