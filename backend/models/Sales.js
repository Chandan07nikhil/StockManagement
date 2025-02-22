import mongoose from 'mongoose';

const salesSchema = mongoose.Schema({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  },
  quantitySold: {
    type: Number,
    required: true
  },
  saleDate: {
    type: Date,
    default: Date.now 
  },
});

const Sales = mongoose.model('Sales', salesSchema);

export default Sales;
