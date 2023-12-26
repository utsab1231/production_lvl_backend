import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  //extract data from req.body
  const { username, fullName, email, password } = req.body;
  if ([username, fullName, email, password].some((field) => field === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  // get local path of uploaded files
  const avatarLocalPath = req.files?.avatar[0]?.path;

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  // upload files to cloudinary and get their urls
  const avatar = await uploadToCloudinary(avatarLocalPath);
  const coverImage = await uploadToCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  // create a new user
  const newUser = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage ? coverImage.url : "",
  });

  const existedUser = await User.findById(newUser._id).select(
    "-password  -refreshToken"
  );
  if (!existedUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }
  res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully", existedUser));
});