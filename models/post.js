const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, require: true },
    typePost: { type: Schema.Types.ObjectId, ref: "typePost", require: true },
    type: [{ type: Schema.Types.ObjectId, ref: "type", require: true }],
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

module.exports = mongoose.model("post", postSchema);
