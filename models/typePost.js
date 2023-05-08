const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typePostSchema = new Schema(
  {
    name: { type: String, require: true },
    createdBy: {
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("typePost", typePostSchema);
