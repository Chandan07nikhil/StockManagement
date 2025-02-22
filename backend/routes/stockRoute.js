import express from 'express';
import { getStockData, addStock, decreaseStockQuantity, increaseStockQuantity } from '../services/stockService.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Sales from '../models/Sales.js';
import Stock from '../models/Stock.js';
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const stockData = await getStockData(startDate, endDate);
        res.json(stockData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/add', protect, admin, async (req, res) => {
    try {
        const { productName, quantityRemaining, cost } = req.body;

        if (!productName || quantityRemaining == null || cost == null) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await addStock(productName, quantityRemaining, cost);

        res.status(201).json({ message: "Stock item successfully added" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



router.put('/:id/decrease', protect, admin, async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid amount specified" });
        }

        const updatedStock = await decreaseStockQuantity(req.params.id, quantity);
        if (!updatedStock) {
            return res.status(404).json({ message: "Stock item not found" });
        }

        res.json({ message: "Stock quantity successfully decreased" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.put('/:id/increase', protect, admin, async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid amount specified" });
        }

        const updatedStock = await increaseStockQuantity(req.params.id, quantity);

        if (!updatedStock) {
            return res.status(404).json({ message: "Stock item not found" });
        }

        res.json({ message: "Stock quantity successfully increased" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete('/delete/:id', protect, admin, async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id);

        if (!stock) {
            return res.status(404).json({ message: "Stock item not found" });
        }

        await stock.deleteOne();
        res.json({ message: "Stock item successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/sales-report", protect, admin, async (req, res) => {
    try {
        let { startDate, endDate } = req.query;

        const isValidDate = (date) => !isNaN(new Date(date).getTime());

        let matchStage = {};
        let currentDate = new Date();
        let thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);

        if (startDate && endDate && isValidDate(startDate) && isValidDate(endDate)) {
            matchStage.saleDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            matchStage.saleDate = {
                $gte: thirtyDaysAgo,
                $lte: currentDate,
            };
        }

        const salesData = await Sales.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "stocks",
                    localField: "stockId",
                    foreignField: "_id",
                    as: "stockInfo",
                },
            },
            { $unwind: "$stockInfo" },
            {
                $project: {
                    productName: "$stockInfo.productName",
                    quantitySold: 1,
                    saleDate: 1,
                    totalAmount: { $multiply: ["$quantitySold", "$stockInfo.cost"] },
                },
            },
            { $sort: { saleDate: -1 } }
        ]);


        res.json(salesData);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/sales-report/download", protect, admin, async (req, res) => {
    try {
        let { startDate, endDate } = req.query;

        const isValidDate = (date) => !isNaN(new Date(date).getTime());

        let matchStage = {};
        let currentDate = new Date();
        let thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);

        if (startDate && endDate && isValidDate(startDate) && isValidDate(endDate)) {
            matchStage.saleDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            matchStage.saleDate = {
                $gte: thirtyDaysAgo,
                $lte: currentDate,
            };
        }

        const salesData = await Sales.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "stocks",
                    localField: "stockId",
                    foreignField: "_id",
                    as: "stockInfo",
                },
            },
            { $unwind: "$stockInfo" },
            {
                $project: {
                    productName: "$stockInfo.productName",
                    quantitySold: 1,
                    saleDate: 1,
                    totalAmount: { $multiply: ["$quantitySold", "$stockInfo.cost"] },
                },
            },
            { $sort: { saleDate: -1 } }
        ]);

        if (salesData.length === 0) {
            return res.status(404).json({ message: "No sales data found" });
        }

        // ✅ Ensure the "public" folder exists before writing the file
        const publicDir = path.join(__dirname, '../public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // Generate Excel file
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report");

        worksheet.columns = [
            { header: "Product Name", key: "productName", width: 20 },
            { header: "Quantity Sold", key: "quantitySold", width: 15 },
            { header: "Sale Date", key: "saleDate", width: 20 },
            { header: "Total Amount", key: "totalAmount", width: 15 },
        ];

        salesData.forEach((data) => {
            worksheet.addRow({
                productName: data.productName,
                quantitySold: data.quantitySold,
                saleDate: new Date(data.saleDate).toLocaleDateString(),
                totalAmount: data.totalAmount,
            });
        });

        // ✅ Save file in the "public" directory
        const fileName = "sales_report.xlsx";
        const filePath = path.join(publicDir, fileName);

        await workbook.xlsx.writeFile(filePath);

        // ✅ Return the downloadable file URL
        res.json({ fileUrl: `${req.protocol}://${req.get("host")}/static/${fileName}` });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



export default router;
