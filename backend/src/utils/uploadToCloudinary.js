import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder = "recipes") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(fileBuffer);
  });
};