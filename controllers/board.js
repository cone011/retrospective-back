const { validationResult } = require("express-validator");
const Board = require("../models/board");
const { validationParams } = require("../utils/validationParams");
const { errorHandler } = require("../utils/errorHandler");

exports.getAllBoard = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const currentPage = req.query.currentPage;
    const perPage = req.query.perPage;
    const totalItems = await Board.find().countDocuments();
    const boards = await Board.find()
      .populate("creator")
      .sort({ createAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "OK", boards: boards, totalItems: totalItems });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getBoardById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const boardId = req.params.boardId;
    const boardItem = await Board.findById(boardId);
    res.status(200).json({ message: "OK", item: boardItem });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.insertBoard = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const title = req.body.title;
    const comments = req.body.comments;
    const likes = req.body.likes;
    const creator = req.userId;
    const lastUser = req.userId;
    const board = new Board({
      title: title,
      comments: comments,
      likes: likes,
      creator: creator,
      lastUser: lastUser,
    });
    const result = await board.save();
    res
      .status(201)
      .json({ message: "OK", isSaved: true, result: result._id.toString() });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateBoard = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const boardId = req.params.boardId;
    const title = req.body.title;
    const comments = req.body.comments;
    const likes = req.body.likes;
    const lastUser = req.userId;
    const boardItem = await Board.findById(boardId);
    if (!boardItem) {
      const error = new Error("Board register not found!");
      error.statusCode = 404;
      throw error;
    }
    boardItem.title = title;
    boardItem.comments = comments;
    boardItem.likes = likes;
    boardItem.lastUser = lastUser;
    await boardItem.save();
    res.status(201).json({ message: "OK", isSaved: true });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteBoard = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const boardId = req.params.boardId;
    const boardItem = await Board.findById(boardId);
    if (!boardItem) {
      const error = new Error("Board register not found!");
      error.statusCode = 404;
      throw error;
    }
    await Board.findByIdAndDelete(boardId);
    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
