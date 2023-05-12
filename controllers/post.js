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
    const perPage = parseInt(req.query.perPage);
    const totalItems = await Post.find().countDocuments();
    const Posts = await Post.aggregate([
      {
        $lookup: {
          from: "typeposts",
          localField: "typePost",
          foreignField: "_id",
          pipeline: [
            {
              $project: { name: 1 },
            },
          ],
          as: "typePost",
        },
      },
      {
        $unwind: "$typePost",
      },
    ]);
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
    const postId = req.params.postId;
    const PostItem = await Post.findById(postId).select(
      "_id title type typePost"
    );
    res.status(200).json({ message: "OK", item: PostItem });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getSearchPostByParameters = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const typePost = req.query.typePost;
    const type = req.query.type;
    let totalItems, postItems;
    if (type !== undefined && typePost !== undefined) {
      totalItems = await Post.find({
        type: { $elemMatch: { $in: type } },
      }).countDocuments();
      postItems = await Post.find({
        type: { $elemMatch: { $in: type } },
      });
    } else if (type !== undefined) {
      totalItems = await Post.find({
        type: { $elemMatch: { $in: type } },
      }).countDocuments();
      postItems = await Post.find({
        type: { $elemMatch: { $in: type } },
      });
    } else if (typePost !== undefined) {
      totalItems = await Post.find({
        typePost: typePost,
      }).countDocuments();
      postItems = await Post.find({
        typePost: typePost,
      });
    }
    res
      .status(200)
      .json({ message: "OK", posts: postItems, totalItems: totalItems });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.insertPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const title = req.body.title;
    const typePost = req.body.typePost;
    const type = req.body.type;
    const creator = req.userId;
    const lastUser = req.userId;
    const post = new Post({
      title: title,
      typePost: typePost.value,
      type: type,
      creator: creator,
      lastUser: lastUser,
    });
    const result = await post.save();
    const returnPost = {
      title: title,
      typePost: typePost,
      type: type,
      creator: creator,
      lastUser: lastUser,
      _id: result._id,
    };
    io.getIO().emit("posts", {
      action: "create",
      post: { ...returnPost, creator: { _id: req.userId } },
    });
    res.status(201).json({ message: "OK", isSaved: true, postId: result._id });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const postId = req.params.postId;
    const title = req.body.title;
    const typePost = req.body.typePost;
    const type = req.body.type;
    const lastUser = req.userId;
    const PostItem = await Post.findById(postId);
    if (!PostItem) {
      const error = new Error("Post register not found!");
      error.statusCode = 404;
      throw error;
    }
    PostItem.title = title;
    PostItem.typePost = typePost.value;
    PostItem.type = type;
    PostItem.lastUser = lastUser;
    const result = await PostItem.save();
    const returnPost = {
      title: title,
      typePost: typePost,
      type: type,
      lastUser: lastUser,
      _id: result._id,
    };
    io.getIO().emit("posts", {
      action: "update",
      post: returnPost,
    });
    res.status(201).json({ message: "OK", isSaved: true, postId: postId });
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
