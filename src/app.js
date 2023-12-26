import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// express initialization
const app = express();

// express prebuilt middleware modules
// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
// in url special characters are turned into encoded form , for such encoded form this middleware is used
app.use(
  express.urlencoded({
    extended: true,
  })
);

// // app can use static files from public folder and is accessible from browser
// app.use(express.static("public"));

// for parsing cookies
app.use(cookieParser());

// for enabling cors(cross-origin resource sharing) which means that the browser can request resources from another domain
app.use(cors());

// express routes
import userRouter from "./routes/user.route.js";
app.use("/api/v1/users", userRouter);
// api should be versioned and general format for writing api route is /api/v1/...

export default app;
