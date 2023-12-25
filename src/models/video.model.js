import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 80,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 20,
    },
    duration: {
      type: Number, //will be in provided by cloudinary
      required: true,
    },
    isPublished: {
      type: Boolean,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);
