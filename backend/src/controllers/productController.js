import Product from '../models/Product.js';
import { uploadMedia, deleteMedia } from '../utils/cloudinary.js';

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find().sort({ createdAt: -1 });
		res.json(products);
	} catch (error) {
		console.error('Error fetching products:', error);
		res.status(500).json({ message: 'Error fetching products', error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { title, description, price } = req.body;
		const files = req.files || {};

		// Upload images
		const uploadedImages = await Promise.all(
			(files.images || []).map(image =>
				uploadMedia(image.path, 'products/images')
			)
		);

		// Upload videos
		const uploadedVideos = await Promise.all(
			(files.videos || []).map(video =>
				uploadMedia(video.path, 'products/videos', 'video')
			)
		);

		const product = new Product({
			title,
			description,
			price,
			images: uploadedImages,
			videos: uploadedVideos
		});

		await product.save();
		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, price, existingImages } = req.body;
		const files = req.files || {};

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Get the existing images from the request
		const remainingImages = JSON.parse(existingImages || '[]');

		// Find images that were removed
		const removedImages = product.images.filter(oldImage =>
			!remainingImages.some(newImage => newImage.publicId === oldImage.publicId)
		);

		// Delete removed images from Cloudinary
		for (const image of removedImages) {
			try {
				if (image.publicId) {
					console.log('Deleting image from Cloudinary:', image.publicId);
					await deleteMedia(image.publicId);
				}
			} catch (error) {
				console.error(`Failed to delete image ${image.publicId}:`, error);
			}
		}

		// Update product with remaining images
		product.images = remainingImages;

		// Handle new images
		if (files.images?.length > 0) {
			const uploadedImages = await Promise.all(
				files.images.map(image => uploadMedia(image.path, 'products/images'))
			);
			product.images.push(...uploadedImages);
		}

		// Update other fields
		product.title = title || product.title;
		product.description = description || product.description;
		product.price = price ? Number(price) : product.price;

		await product.save();
		res.json(product);
	} catch (error) {
		console.error('Error updating product:', error);
		res.status(500).json({ message: 'Error updating product', error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Delete media from Cloudinary with error handling for each item
		const deletePromises = [
			...product.images.map(async (image) => {
				try {
					if (image.publicId) {
						await deleteMedia(image.publicId);
					}
				} catch (error) {
					console.error(`Failed to delete image ${image.publicId}:`, error);
					// Continue with deletion even if Cloudinary fails
				}
			}),
			...product.videos.map(async (video) => {
				try {
					if (video.publicId) {
						await deleteMedia(video.publicId);
					}
				} catch (error) {
					console.error(`Failed to delete video ${video.publicId}:`, error);
					// Continue with deletion even if Cloudinary fails
				}
			})
		];

		// Wait for all delete operations to complete
		await Promise.all(deletePromises);

		// Delete the product from database
		await Product.findByIdAndDelete(id);
		res.json({ message: 'Product deleted successfully' });
	} catch (error) {
		console.error('Error deleting product:', error);
		res.status(500).json({ message: 'Error deleting product', error: error.message });
	}
};