"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTradingItems = exports.updateTradingItem = exports.addTradingItem = exports.addQuantityToTradingItem = exports.getLowStockTradingItems = exports.getPaginatedTradingItems = exports.getTradingItemById = exports.getAllTradingItems = void 0;
const tradingModel_1 = __importDefault(require("../models/tradingModel"));
/**
 * Fetch all trading items
 */
const getAllTradingItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield tradingModel_1.default.find();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllTradingItems = getAllTradingItems;
/**
 * Fetch a single trading item by ID
 */
const getTradingItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield tradingModel_1.default.findById(req.params.id);
        if (!item)
            res.status(404).json({ error: 'Item not found' });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getTradingItemById = getTradingItemById;
/**
 * Get paginated list of trading items based on size search and page number.
 * Adds pagination metadata to the response header.
 */
const getPaginatedTradingItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber = '1', searchInput = '' } = req.query; // Ensure query parameters are parsed correctly
    const limit = 10; // Number of items per page
    const skip = (parseInt(pageNumber) - 1) * limit;
    try {
        // Search by size (case insensitive)
        const items = yield tradingModel_1.default.find({ size: { $regex: searchInput, $options: 'i' } })
            .skip(skip)
            .limit(limit);
        const totalItems = yield tradingModel_1.default.countDocuments({ size: { $regex: searchInput, $options: 'i' } });
        // Set pagination metadata in the response headers
        res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalItems }));
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPaginatedTradingItems = getPaginatedTradingItems;
const getLowStockTradingItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield tradingModel_1.default.find({ quantity: { $lt: 10 } }); // Find items with quantity less than 10
        res.json(items); // Return the matching items
    }
    catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});
exports.getLowStockTradingItems = getLowStockTradingItems;
/**
 * Add/delete quantity to an existing trading item's current quantity
 */
const addQuantityToTradingItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the item ID from the URL parameter
        const { quantityToAdd } = req.body; // Get the quantity to add/subtract from the request body
        // Find the trading item by ID
        const item = yield tradingModel_1.default.findById(id);
        if (!item) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        // Add or subtract the quantity
        item.quantity += quantityToAdd;
        // Optional: Prevent negative stock if needed
        if (item.quantity < 0) {
            item.quantity = 0; // You can adjust this behavior to allow negative stock if needed
        }
        // Save the updated item
        yield item.save();
        res.json(item); // Send back the updated item
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addQuantityToTradingItem = addQuantityToTradingItem;
/**
 * Add a new trading item
 */
const addTradingItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brand, name, description, category, size, quantity, unit, dateIssued, costPrice, sellingPrice } = req.body;
        // Create a new trading item with the provided data
        const newItem = new tradingModel_1.default({
            brand,
            name,
            description,
            category,
            size,
            quantity,
            unit,
            dateIssued,
            costPrice,
            sellingPrice,
        });
        // Save the new item to the database
        yield newItem.save();
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addTradingItem = addTradingItem;
/**
 * Update an trading item by ID
 */
const updateTradingItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield tradingModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item)
            res.status(404).json({ error: 'Item not found' });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateTradingItem = updateTradingItem;
/**
 * Delete an trading item by ID
 */
const deleteTradingItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            res.status(400).json({ error: 'IDs must be an array' });
        }
        const result = yield tradingModel_1.default.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${result.deletedCount} trading item/s deleted` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteTradingItems = deleteTradingItems;
