import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// upload image to cloudinary function
const uploadToCloudinary = async (localFilePath) => {
  // cloudinary configuration for uploading images
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  try {
    if (!localFilePath) return null;

    // upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // will detect file type on its own
    if (response) {
      console.log("File uploaded successfully", response.url);
      fs.unlinkSync(localFilePath); // will remove locally stored file after uploading
      return response;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath); // will remove locally stored file if somethiiing goes wrong
    return null;
  }
};

export { uploadToCloudinary };
