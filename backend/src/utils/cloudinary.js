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
			folder: `abkhd-store/${folder}`,
			resource_type: 'auto'
		});

		return {
			url: result.secure_url,
			publicId: result.public_id
		};
	} catch (error) {
		console.error('Upload error:', error);
		throw new Error('Failed to upload file');
	}
};

export const deleteMedia = async (publicId) => {
	if (!publicId) {
		console.warn('No publicId provided for deletion');
		return;
	}

	try {
		console.log('Deleting media from Cloudinary:', publicId);
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: 'auto'
		});
		console.log('Delete result:', result);

		if (result.result !== 'ok') {
			throw new Error(`Cloudinary deletion failed: ${result.result}`);
		}
	} catch (error) {
		console.error('Cloudinary delete error:', error);
		throw new Error(`Error deleting from Cloudinary: ${error.message}`);
	}
};