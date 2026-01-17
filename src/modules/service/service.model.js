const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      min: 3,
      required: true,
    },
    description: {
      type: String,
      min: 3,
      required: true,
    },
    icon: {
      type: String,
      min: 3,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
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

const ServiceModel = mongoose.model("Service", ServiceSchema);

module.exports = ServiceModel;
