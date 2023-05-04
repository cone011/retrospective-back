const { validationResult } = require("express-validator");
const Post = require("../models/post");
const { validationParams } = require("../utils/validationParams");
const { errorHandler } = require("../utils/errorHandler");
const io = require("../socket/socket");

exports.getAllPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const currentPage = req.query.currentPage;
    const perPage = req.query.perPage;
    const totalItems = await Post.find().countDocuments();
    const Posts = await Post.find()
      .populate("creator")
      .sort({ createAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "OK", Posts: Posts, totalItems: totalItems });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const PostId = req.params.PostId;
    const PostItem = await Post.findById(PostId);
    res.status(200).json({ message: "OK", item: PostItem });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.insertPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const title = req.body.title;
    const type = req.body.type;
    const creator = req.userId;
    const lastUser = req.userId;
    const post = new Post({
      title: title,
      type: type,
      creator: creator,
      lastUser: lastUser,
    });
    const result = await post.save();
    io.getIO().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId } },
    });
    res.status(201).json({ message: "OK", isSaved: true, result: result._id });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const PostId = req.params.PostId;
    const title = req.body.title;
    const comments = req.body.comments;
    const likes = req.body.likes;
    const lastUser = req.userId;
    const PostItem = await Post.findById(PostId);
    if (!PostItem) {
      const error = new Error("Post register not found!");
      error.statusCode = 404;
      throw error;
    }
    PostItem.title = title;
    PostItem.comments = comments;
    PostItem.likes = likes;
    PostItem.lastUser = lastUser;
    const result = await PostItem.save();
    io.getIO().emit("posts", {
      action: "update",
      post: result,
    });
    res.status(201).json({ message: "OK", isSaved: true });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const PostId = req.params.PostId;
    const PostItem = await Post.findById(PostId);
    if (!PostItem) {
      const error = new Error("Post register not found!");
      error.statusCode = 404;
      throw error;
    }
    await Post.findByIdAndDelete(PostId);
    io.getIO().emit("posts", {
      action: "delete",
      post: PostId,
    });
    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
