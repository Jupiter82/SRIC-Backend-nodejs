const { required } = require("joi");
const mongoose = require("mongoose");

const skillsSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 3,
    required: true,
  },
});
const AboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      min: 3,
      required: true,
    },
    subTitle: {
      type: String,
      min: 3,
      required: true,
    },
    description: {
      type: String,
      min: 3,
      required: true,
    },
    skill: [skillsSchema],
    image: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
  }
);

const AboutModel =
  mongoose.models.About || mongoose.model("About", AboutSchema);

module.exports = AboutModel;
