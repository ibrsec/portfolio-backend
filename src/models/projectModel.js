"use strict";

/* -------------------------------------------------------------------------- */
/*                               Category Model                               */
/* -------------------------------------------------------------------------- */

const { mongoose } = require("../configs/dbConnection");

const uniqueValidator = require("mongoose-unique-validator");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    projectLiveLink: {
      type: String,
      required: true,
      trim: true,
    },
    projectLiveLink: {
      type: String,
      required: true,
      trim: true,
    },
    projectRepo: {
      type: String,
      required: true,
      trim: true,
    },
    projectGif: {
      type: String,
      required: true,
      trim: true,
    },
    category: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    collection: "projects",
    timestamps: true,
  }
);

module.exports.Project = mongoose.model("Project", projectSchema);
