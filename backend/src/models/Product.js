import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  videos: [{
    url: String,
    publicId: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema);