import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadMedia = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `abkhd-store/${folder}`
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    throw new Error('Error uploading to Cloudinary');
  }
};

export const deleteMedia = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error('Error deleting from Cloudinary');
  }
};