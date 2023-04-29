const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeSchema = new Schema(
  {
    name: { type: String, require: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    lastAuthor: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("type", typeSchema);
