import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['news', 'tip'], default: 'tip' },
}, { timestamps: true });

export default mongoose.model('News', newsSchema);
