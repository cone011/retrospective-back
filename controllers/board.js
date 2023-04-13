const { validationResult } = require("express-validator");
const Board = require("../models/board");
const { validationParams } = require("../utils/validationParams");
const { errorHandler } = require("../utils/errorHandler");

exports.insertBoard = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const title = req.body.title;
    const comments = req.body.comments;
    const likes = req.body.likes;
    const creator = req.userId;
    const board = new Board({
      title: title,
      comments: comments,
      likes: likes,
      creator: creator,
    });
    const result = await board.save();
    res
      .status(201)
      .json({ message: "OK", isSaved: true, result: result._id.toString() });
  } catch (err) {
    errorHandler(err, next);
  }
};
