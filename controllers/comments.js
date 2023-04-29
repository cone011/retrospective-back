const { validationResult } = require("express-validator");
const { validationParams } = require("../utils/validationParams");
const { errorHandler } = require("../utils/errorHandler");
const Comments = require("../models/comments");

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
    const author = req.userId;
    const lastAuth = req.userId;
    const comment = new Comments({
      text: text,
      likes: likes,
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
