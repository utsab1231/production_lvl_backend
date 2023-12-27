import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// ! ==================================Login user middleware function ==========================>
export const loginAuth = asyncHandler(async (req, res, next) => {
  // check if refresh token is present in the cookie
  if (req.cookies.refreshToken && !req.cookies.accessToken) {
    const refreshTokenDecoded = jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(refreshTokenDecoded._id);

    // FIXME:if refresh token is invalid it should break out of this if condition and proceed to login

    if (user.refreshToken !== req.cookies.refreshToken) {
      next();
    }
    // FIXME: -------------------------------------------------------------------------------------^^^^

    const accessToken = user.createAcessToken();
    const refreshToken = user.createRefreshToken();
    const options = {
      httpOnly: true,
      secure: true, //only for https
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
  }
});

// ! ==================================logout auth middleware function ==========================>
export const authLogout = asyncHandler(async (req, res, next) => {
  try {
    const acessToken =
      req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

    if (!acessToken) {
      throw new ApiError(401, "Unauthorized");
    }
    //note req.header("Authorization") is when token is send in header as bearer token generally from mobile apps
    const acccessTokenDecoded = jwt.verify(
      acessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const user = await User.findById(acccessTokenDecoded._id);
    if (!user) {
      throw new ApiError(401, "Invalid acess token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized");
  }
});
