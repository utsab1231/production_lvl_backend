import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const app = express();

app.get("/", (req, res) => res.send("Hellow World"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
