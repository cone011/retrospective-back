const { validationResult } = require("express-validator");
const { validationParams } = require("../utils/validationParams");
const { errorHandler } = require("../utils/errorHandler");
const Comments = require("../models/comments");

exports.getAllComments = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const currentPage = req.query.currentPage;
    const perPage = parseInt(req.query.perPage);
    const totalItems = await Comments.find().countDocuments();
    const comments = await Comments.find()
      .sort({ createAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "OK", comments: comments, totalItems: totalItems });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getCommentsByPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const postId = req.params.postId;
    const totalItems = await Comments.find({ postId: postId }).count();
    const comments = await Comments.find({ postId: postId });
    res
      .status(200)
      .json({ message: "OK", comments: comments, totalItems: totalItems });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getCommentById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const commentId = req.params.commentId;
    const commentObject = await Comments.findById(commentId);
    if (!commentObject) {
      throw new Error("Cant not find this comment");
    }
    res.status(200).json({ message: "OK", item: commentObject });
  } catch (er) {
    errorHandler(err, next);
  }
};

exports.insertComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const text = req.body.text;
    const likes = req.body.likes ? req.body.likes : 0;
    const boardId = req.body.boardId;
    const author = req.userId;
    const lastAuth = req.userId;
    const comment = new Comments({
      text: text,
      likes: likes,
      boardId: boardId,
      author: author,
      lastAuth: lastAuth,
    });
    const result = await comment.save();
    res
      .status(201)
      .json({ message: "OK", isSaved: true, commentId: result._id });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const text = req.body.text;
    const likes = req.body.likes ? req.body.likes : 0;
    const commentId = req.params.commentId;
    const commentObject = await Comments.findById(commentId);
    if (!commentObject) {
      throw new Error("Cant find this comment");
    }
    commentObject.text = text;
    commentObject.likes = likes;
    commentObject.lastAuth = req.userId;
    const result = await commentObject.save();
    res
      .status(201)
      .json({ message: "OK", isSaved: true, commentId: result._id });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const commentId = req.params.commentId;
    const commentObject = await Comments.findById(commentId);
    if (!commentObject) {
      throw new Error("Cant find this comment");
    }
    await Comments.findByIdAndDelete(commentId);
    res.status(201).json({ message: "OK", isDelete: true });
  } catch (error) {
    errorHandler(err, next);
  }
};
