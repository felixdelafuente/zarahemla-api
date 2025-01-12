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
exports.deleteSales = exports.updatePaidAndRecurring = exports.updateSale = exports.addSale = exports.salesReport = exports.getPaginatedSales = exports.getSaleById = exports.getAllSales = void 0;
const salesModel_1 = __importDefault(require("../models/salesModel"));
/**
 * Fetch all sales
 */
const getAllSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield salesModel_1.default.find().populate('client').populate('cart.item');
        res.json(sales);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllSales = getAllSales;
/**
 * Fetch a single sale by ID
 */
const getSaleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = yield salesModel_1.default.findById(req.params.id).populate('client').populate('cart.item');
        if (!sale)
            res.status(404).json({ error: 'Sale not found' });
        res.json(sale);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSaleById = getSaleById;
/**
 * Fetch paginated sales based on search input, client ID, branch, and paid status
 * Adds pagination metadata to the response header
 */
const getPaginatedSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber = 1, searchInput = '', clientId = '', branch = '', paid, // Extract the optional `paid` parameter
     } = req.query;
    const limit = 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    try {
        // Build the filter object based on searchInput, clientId, branch, and paid
        const filter = {};
        if (searchInput) {
            filter.transactionNumber = { $regex: searchInput, $options: 'i' }; // Case-insensitive search on transactionNumber
        }
        if (clientId) {
            filter.client = clientId; // Filter by client ID if provided
        }
        if (branch) {
            filter.branch = branch; // Filter by branch if provided
        }
        if (paid !== undefined) {
            // Convert `paid` to a boolean dynamically and filter only if provided
            filter.paid = paid === 'true' ? true : paid === 'false' ? false : undefined;
        }
        // Find sales matching filter criteria and sort by dateIssued in descending order
        const sales = yield salesModel_1.default.find(filter)
            .sort({ dateIssued: -1 }) // Sort by dateIssued descending
            .skip(skip)
            .limit(limit)
            .populate('client')
            .populate('cart.item');
        const totalSales = yield salesModel_1.default.countDocuments(filter);
        // Set pagination metadata in response headers
        res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalSales }));
        res.json(sales);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPaginatedSales = getPaginatedSales;
/**
 * Generate a sales report based on date, week, month, and year filters
 */
const salesReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, week, month, year } = req.query;
    try {
        // If no filters are provided, fetch all sales
        const filter = {};
        if (!month && !year) {
            // If month and year are not provided, fetch all sales
            const sales = yield salesModel_1.default.find(filter)
                .sort({ dateIssued: -1 })
                .populate('client')
                .populate('cart.item');
            res.json(sales);
            return;
        }
        // If month and year are provided, apply filters
        if (!month || !year) {
            res.status(400).json({ error: "Month and year are required for date or week filtering." });
            return;
        }
        const yearValue = Number(year);
        const monthValue = Number(month) - 1; // JavaScript months are 0-based
        if (date) {
            // Validate and calculate date range for the specified day
            const day = Number(date);
            const specificDate = new Date(yearValue, monthValue, day);
            if (specificDate.getMonth() !== monthValue) {
                res.status(400).json({ error: "Invalid date for the given month." });
                return;
            }
            const nextDay = new Date(yearValue, monthValue, day + 1);
            filter.dateIssued = {
                $gte: specificDate,
                $lt: nextDay,
            };
            return;
        }
        if (week) {
            // Validate and calculate the date range for the specified week
            const weekNumber = Number(week);
            if (weekNumber < 1 || weekNumber > 4) {
                res.status(400).json({ error: "Week must be between 1 and 4." });
                return;
            }
            const startOfWeek = new Date(yearValue, monthValue, (weekNumber - 1) * 7 + 1);
            const endOfWeek = new Date(yearValue, monthValue, weekNumber * 7 + 1);
            if (startOfWeek.getMonth() !== monthValue) {
                res.status(400).json({ error: "Invalid week for the given month." });
                return;
            }
            filter.dateIssued = {
                $gte: startOfWeek,
                $lt: endOfWeek,
            };
            return;
        }
        // Default filter if only month and year are provided
        if (!date && !week) {
            filter.dateIssued = {
                $gte: new Date(yearValue, monthValue, 1),
                $lt: new Date(yearValue, monthValue + 1, 1),
            };
            return;
        }
        // Query the database with the constructed filter
        const sales = yield salesModel_1.default.find(filter)
            .sort({ dateIssued: -1 })
            .populate('client')
            .populate('cart.item');
        res.json(sales);
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
});
exports.salesReport = salesReport;
/**
 * Add a new sale
 */
const addSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionNumber, branch, client, cart, discount, totalPrice, paid, dateIssued, recurring } = req.body;
        // Create a new sale with the provided data
        const newSale = new salesModel_1.default({
            transactionNumber,
            branch,
            client,
            cart,
            discount,
            totalPrice,
            paid,
            dateIssued,
            recurring
        });
        // Save the new sale to the database
        yield newSale.save();
        res.status(201).json(newSale);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addSale = addSale;
/**
 * Update a sale by ID
 */
const updateSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = yield salesModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('client').populate('cart.item');
        if (!sale)
            res.status(404).json({ error: 'Sale not found' });
        res.json(sale);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateSale = updateSale;
/**
 * Update the paid property and optionally the recurring property of a sale
 */
const updatePaidAndRecurring = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Sale ID from request params
        const { paid, recurring } = req.body; // Properties to update
        // Prepare the update object with only allowed fields
        const update = {};
        if (typeof paid === 'boolean') {
            update.paid = paid;
        }
        if (typeof recurring === 'boolean') {
            update.recurring = recurring;
        }
        // Update the sale with specified fields
        const updatedSale = yield salesModel_1.default.findByIdAndUpdate(id, { $set: update }, { new: true } // Return the updated document
        ).populate('client').populate('cart.item');
        // Handle case when the sale is not found
        if (!updatedSale) {
            res.status(404).json({ error: 'Sale not found' });
            return;
        }
        res.json(updatedSale);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updatePaidAndRecurring = updatePaidAndRecurring;
/**
 * Delete sales by ID
 */
const deleteSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            res.status(400).json({ error: 'IDs must be an array' });
        }
        const result = yield salesModel_1.default.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${result.deletedCount} sale(s) deleted` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteSales = deleteSales;
