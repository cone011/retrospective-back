const { validationResult } = require("express-validator");
const { validationParams } = require("../utils/validationParams");
const { errorHandler } = require("../utils/errorHandler");
const Comments = require("../models/comments");
const io = require("../socket/socket");

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
    const comments = await Comments.find({ postId: postId }).select(
      "_id comment postId"
    );
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

exports.saveComments = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const comments = req.body.comments;
    const postId = req.body.postId;
    const newComments = comments.map((item) => {
      if (item.isNew) {
        return {
          comment: item.comment,
          postId: postId,
          creator: req.userId,
          lastUser: req.userId,
        };
      }
    });
    const updateComments = await Promise.all(
      comments.map(async (item) => {
        if (!item.isNew) {
          return await Comments.updateOne(
            { _id: item._id },
            { comment: item.comment, lastUser: req.userId }
          );
        }
      })
    );
    const result = await Comments.insertMany(newComments);
    io.getIO().emit("comments", {
      action: "save",
      comment: { comments, creator: { _id: req.userId } },
    });
    res.status(201).json({
      message: "OK",
      isSaved: true,
      newComments: result,
      updateComments: updateComments,
    });
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
    io.getIO().emit("comments", {
      action: "delete",
      comment: commentId,
    });
    res.status(201).json({ message: "OK", isDelete: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
