import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  whatsappNumber: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  }
});

export default mongoose.model('Settings', settingsSchema);