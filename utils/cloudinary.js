// import { v2 as cloudinary } from 'cloudinary';
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploader = async (folder, localFilePath) => {
  try {
    const options = {
      folder: folder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
    // Upload the image
    const result = await cloudinary.uploader.upload(localFilePath, options);
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    // return error;
  }
};

module.exports = uploader;
