const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = new Schema(
  {
    text: { type: String, require: true },
    likes: { type: Number, require: false },
    author: { type: Schema.Types.ObjectId, ref: "user", require: true },
    lastAuth: { type: Schema.Types.ObjectId, ref: "user", require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", commentsSchema);
