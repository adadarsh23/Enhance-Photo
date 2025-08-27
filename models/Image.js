import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Image', imageSchema);
