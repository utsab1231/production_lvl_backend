import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // CLOUDINARY URL
      required: true,
    },
    coverImage: {
      type: String, //CLOUDINARY URL
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// will hash the password before saving
// pre is a hook provided by mongodb that will run before
// the save method is called
// should always be callback function not arrow as "this" is used
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  }
  return next();
});

// custom methods can be added to the schema to be used later
// this method will be used to compare the password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // will be either true or false
  // this.password is the hashed password accesed as this is a method of the schema
};

// custom method to create a jwt access token
userSchema.methods.createAcessToken = function () {
  const data = {
    _id: this._id, // this refers to user object
    username: this.username,
    email: this.email,
    fullName: this.fullName,
  };
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// custom method to create a jwt refresh token
userSchema.methods.createRefreshToken = function () {
  const data = {
    _id: this._id, // this refers to user object
  };
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);
