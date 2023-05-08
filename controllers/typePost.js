const { validationResult } = require("express-validator");
const { errorHandler } = require("../utils/errorHandler");
const { validationParams } = require("../utils/validationParams");
const TypePost = require("../models/typePost");

exports.getAllTypePost = async (req, res, next) => {
  try {
    const result = await TypePost.aggregate([
      {
        $project: {
          value: "$_id",
          label: "$name",
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ message: "OK", result: result });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getTypePostById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const typePostId = req.params.typePostId;
    const typeObject = await TypePost.findById(typePostId);
    res.status(200).json({ message: "OK", item: typeObject });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.insertTypePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const name = req.body.name;
    const createdBy = req.userId;
    const lastUser = req.userId;
    const typePost = new TypePost({
      name: name,
      createdBy: createdBy,
      lastUser: lastUser,
    });
    const result = await typePost.save();
    res.status(201).json({
      message: "OK",
      isSaved: true,
      typePostId: result._id.toString(),
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateTypePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const name = req.body.name;
    const lastUser = req.userId;
    const typePostId = req.params.typePostId;
    const typePost = await TypePost.findById(typePostId);
    typePost.name = name;
    typePost.lastUser = lastUser;
    const result = await typePost.save();
    res.status(201).json({
      message: "OK",
      isSaved: true,
      typePostId: result._id.toString(),
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteTypePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const typePostId = req.params.typePostId;
    const typeItem = await TypePost.findById(PostId);
    if (!typeItem) {
      const error = new Error("Type Post register not found!");
      error.statusCode = 404;
      throw error;
    }
    await typeItem.findByIdAndDelete(typePostId);
    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
