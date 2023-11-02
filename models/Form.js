import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schemas = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: { type: String },
    description: { type: String },
    questions: { type: Array },
    invites: { type: Array }, // ['a@mail.com', 'a@mail.com']
    public: { type: Boolean }, // true = public, false = private
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  }
);

Schemas.plugin(mongoosePaginate);

export default mongoose.model("Form", Schemas);
