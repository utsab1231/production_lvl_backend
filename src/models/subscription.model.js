import mongoose from "mongoose";
const subscriptionSchema = new mongoose.Schema(
  {
    // since channel are also users, we can use the user model
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
