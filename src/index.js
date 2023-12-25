import dotenv from "dotenv";
import dbConfig from "./dbconfig/dbConfig.js";
import app from "./app.js";

// config function for environment variables
dotenv.config({
  path: "./.env",
});

// config function for database connection
dbConfig()
  .then(() => {
    // express server listening
    app.listen(process.env.PORT || 4775, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
