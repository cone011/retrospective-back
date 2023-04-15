const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    title: { type: String, require: true },
    comments: {
      type: [{ type: String }],
      require: false,
      commentCreator: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: false,
      },
    },
    likes: { type: Number, require: false },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    lastUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("board", boardSchema);
