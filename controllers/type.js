const { validationResult } = require("express-validator");
const { validationParams } = require("../utils/validationParams");
const { errorHandler } = require("../utils/errorHandler");
const Type = require("../models/type");
const type = require("../models/type");

exports.getAllTypes = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const currentPage = req.query.currentPage;
    const perPage = req.query.perPage;
    const totalItems = await Type.countDocuments();
    const types = await Type.find()
      .select("_id name")
      .sort({ createAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "OK", types: types, totalItems: totalItems });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getTypeById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const typeId = req.params.typeId;
    const typeObject = await Type.findById(typeId);
    res.status(200).json({ message: "OK", item: typeObject });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.insertType = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const name = req.body.name;
    const author = req.userId;
    const lastAuthor = req.userId;
    const type = new Type({
      name: name,
      author: author,
      lastAuthor: lastAuthor,
    });
    const result = await type.save();
    res.status(201).json({ message: "OK", isSaved: true, typeId: result._id });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updateType = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const typeId = req.params.typeId;
    const name = req.body.name;
    const typeObject = await type.findById(typeId);
    if (!typeObject) {
      throw new Error("This type dont exist anymore");
    }
    typeObject.name = name;
    typeObject.lastAuthor = req.userId;
    const result = await typeObject.save();
    res.status(201).json({ message: "OK", isSaved: true, typeId: result._id });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteType = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const typeId = req.params.typeId;
    const typeObject = await type.findById(typeId);

    if (!typeObject) {
      throw new Error("This type dont exist anymore");
    }
    await Type.findByIdAndDelete(typeId);
    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
