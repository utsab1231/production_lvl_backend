import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

//! --------------------------------Register user controller function ------------------------->
export const registerUser = asyncHandler(async (req, res) => {
  //extract data from req.body
  const { username, fullName, email, password } = req.body;
  if ([username, fullName, email, password].some((field) => field === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  // get local path of uploaded files
  const avatarFile = req.files.avatar;
  const coverImageFile = req.files.coverImage;

  const avatarLocalPath =
    avatarFile && avatarFile.length > 0 ? avatarFile[0].path : false;

  const coverImageLocalPath =
    coverImageFile && coverImageFile.length > 0
      ? coverImageFile[0].path
      : false;

  // if no avatar is uploaded
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  let coverImage;
  // if no cover image is uploaded
  if (!coverImageLocalPath) {
    coverImage = "";
  } else {
    coverImage = await uploadToCloudinary(coverImageLocalPath);
  }

  // upload files to cloudinary and get their urls
  const avatar = await uploadToCloudinary(avatarLocalPath);
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

//--------------------------------------------------------------------->

//!-------------------------------Login user controller function ------------------------->
export const loginUser = asyncHandler(async (req, res) => {
  //extract data from req.body
  const { email_or_username, password } = req.body;
  if ([email_or_username, password].some((field) => field === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // find user exist or not by email or username
  const user = await User.findOne({
    $or: [{ email: email_or_username }, { username: email_or_username }],
  });
  if (!user) {
    throw new ApiError(404, "User Doesnot exist");
  }

  // check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  // create access and refresh token
  const accessToken = user.createAcessToken();
  const refreshToken = user.createRefreshToken();

  // set access and refresh token in cookie
  const options = {
    httpOnly: true,
    secure: true, //only for https
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  // save refresh token to db
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  // will save the user without validating the schema as we are not passing all the fields of the schema

  res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
      coverImage: user.coverImage,
    })
  );
});

// --------------------------------------------------------------------->

//!-------------------------------Logout user controller function ------------------------->

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });

  // clear cookies
  const options = {
    httpOnly: true,
    secure: true, //only for https
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

//! ------------------------------Change password controller function ------------------------->
export const changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if ([currentPassword, newPassword].some((field) => field === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // user can be received from req.user as we have already verified the token in auth middleware
  const user = User.findById(req.user._id);

  // check if current password is correct
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  // update password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res.status(200).json(new ApiResponse(200, "Password changed", {}));
});
// --------------------------------------------------------------------->

//! ------------------------------get user profile controller function ------------------------->

export const getuserProfile = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully", req.user));
});

//! ------------------------------update user profile controller function ------------------------->

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, fullName, email } = req.body;
  if ([username, fullName, email].some((field) => field === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { username, fullName, email },
    },
    { new: true }
  ).select("-password -refreshToken");
  res.status(200).json(new ApiResponse(200, "User profile updated", user));
});

// --------------------------------------------------------------------->

//! ------------------------------update user avatar controller function ------------------------->
export const updateAvatar = asyncHandler(async (req, res) => {
  const avatarFile = req.file.avatar;
  if (!avatarFile) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatarLocalPath = avatarFile.path;
  const avatar = await uploadToCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: { avatar: avatar.url },
  }).select("-password -refreshToken");
  res.status(200).json(new ApiResponse(200, "Avatar updated", user));
});

// --------------------------------------------------------------------->
//! ------------------------------update user cover image controller function ------------------------->
export const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageFile = req.file.coverImage;
  if (!coverImageFile) {
    throw new ApiError(400, "Cover image is required");
  }
  const coverImageLocalPath = coverImageFile.path;
  const coverImage = await uploadToCloudinary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiError(500, "Something went wrong while uploading cover image");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: { coverImage: coverImage.url },
  }).select("-password -refreshToken");
  res.status(200).json(new ApiResponse(200, "Cover image updated", user));
});
