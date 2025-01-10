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
    console.log('Creating product with body:', req.body);
    console.log('Files received:', req.files);

    const { title, description, price } = req.body;
    const files = req.files || {};
    const images = files.images || [];
    const videos = files.videos || [];

    const uploadedImages = images.length > 0 ? await Promise.all(
      images.map(image => uploadMedia(image.path, 'products/images'))
    ) : [];

    const uploadedVideos = videos.length > 0 ? await Promise.all(
      videos.map(video => uploadMedia(video.path, 'products/videos'))
    ) : [];

    const product = new Product({
      title,
      description,
      price: Number(price),
      images: uploadedImages,
      videos: uploadedVideos
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;
    const files = req.files || {};
    const images = files.images || [];
    const videos = files.videos || [];

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle new images
    if (images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map(image => uploadMedia(image.path, 'products/images'))
      );
      product.images.push(...uploadedImages);
    }

    // Handle new videos
    if (videos.length > 0) {
      const uploadedVideos = await Promise.all(
        videos.map(video => uploadMedia(video.path, 'products/videos'))
      );
      product.videos.push(...uploadedVideos);
    }

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

    // Delete media from Cloudinary
    await Promise.all([
      ...product.images.map(image => deleteMedia(image.publicId)),
      ...product.videos.map(video => deleteMedia(video.publicId))
    ]);

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};