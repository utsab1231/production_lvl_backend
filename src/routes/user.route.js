import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import testing from "../controllers/testing.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

//get request

// this is production level practice eather than using app.get() in app.js
// register user route
userRouter.route("/register").post(
  // upload middleware allows us to upload files to the server
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// login user route
userRouter.route("/login").post(loginUser);

// logout user route // protected route
userRouter.route("/logout").post(authJWT, logoutUser);

//testing route
userRouter.route("/test").get(testing);

export default userRouter;
