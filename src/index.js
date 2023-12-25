import express from "express";
import dotenv from "dotenv";
import dbConfig from "./dbconfig/dbConfig.js";

// config function for environment variables
dotenv.config({
  path: "./.env",
});

// config function for database connection
dbConfig();

// express initialization
const app = express();

app.get("/", (req, res) => res.send("Hellow World"));


// express server listening
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
