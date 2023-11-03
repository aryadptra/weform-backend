import mongoose from "mongoose";

const Schemas = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: number,
    },
    updatedAt: {
      type: number,
    },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
    strict: false,
  }
);

export default mongoose.model("Answer", Schemas);
