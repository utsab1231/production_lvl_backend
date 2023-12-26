import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // every property is a function with req, file, callback(cb) as parameters
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // we can modify the name of the file here if we want
  },
});

export const upload = multer({ storage: storage });
