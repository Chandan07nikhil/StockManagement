import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantityRemaining: { type: Number, required: true },
  quantitySold: { type: Number, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('Stock', stockSchema);
