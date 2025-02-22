import Sales from '../models/Sales.js';
import Stock from '../models/Stock.js';

export const getStockData = async (startDate, endDate) => {
  let filter = {};

  if (startDate || endDate) {
    filter.date = {};
    
    if (startDate) {
      const parsedStartDate = new Date(startDate);
      if (!isNaN(parsedStartDate)) filter.date.$gte = parsedStartDate;
    }
    
    if (endDate) {
      const parsedEndDate = new Date(endDate);
      if (!isNaN(parsedEndDate)) filter.date.$lte = parsedEndDate;
    }
  }

  return await Stock.find(filter).sort({ date: -1 });
};


export const addStock = async (productName, quantityRemaining, cost) => {
  const stock = new Stock({
    productName,
    quantityRemaining,
    quantitySold: 0,
    cost
  });
  return await stock.save();
};


export const decreaseStockQuantity = async (id, quantity) => {
  const stock = await Stock.findById(id);
  if (!stock || stock.quantityRemaining <= 0) {
    throw new Error('Stock not found or out of stock');
  }

  if (quantity > stock.quantityRemaining) {
    throw new Error("Decrease amount exceeds available stock");
  }

  stock.quantityRemaining -= quantity;
  stock.quantitySold += quantity;

  const sale = new Sales({
    stockId: stock._id,
    quantitySold: quantity,
    saleDate: new Date()
  });
  await sale.save();

  return await stock.save();
};


export const increaseStockQuantity = async (id, quantity) => {
  const stock = await Stock.findById(id);
  if (!stock) {
    throw new Error("Stock item not found");
  }

  stock.quantityRemaining = (stock.quantityRemaining || 0) + quantity;
  return await stock.save();
};
