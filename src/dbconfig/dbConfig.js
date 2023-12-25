import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConfig = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
    // 0 means end the process without any kind of failure and 1 means end the process with some failure.
  }
};

export default dbConfig;
