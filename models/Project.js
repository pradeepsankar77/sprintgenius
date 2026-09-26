const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rawText: { type: String, default: "" }, // parsed text from uploaded requirement doc
    status: {
      type: String,
      enum: ["uploaded", "analyzed", "planned"],
      default: "uploaded",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
