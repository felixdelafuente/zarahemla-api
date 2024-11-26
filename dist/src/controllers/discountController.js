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
exports.deleteDiscounts = exports.updateDiscount = exports.addDiscount = exports.getPaginatedDiscounts = exports.getDiscountById = exports.getAllDiscounts = void 0;
const discountModel_1 = __importDefault(require("../models/discountModel"));
/**
 * Fetch all discounts
 */
const getAllDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discounts = yield discountModel_1.default.find();
        res.json(discounts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllDiscounts = getAllDiscounts;
/**
 * Fetch a single discount by ID
 */
const getDiscountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discount = yield discountModel_1.default.findById(req.params.id);
        if (!discount)
            res.status(404).json({ error: 'Discount not found' });
        res.json(discount);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getDiscountById = getDiscountById;
/**
 * Fetch paginated discounts based on search input, client ID, and page number
 * Adds pagination metadata to the response header
 */
const getPaginatedDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber = 1, searchInput = '', clientId = '' } = req.query;
    const limit = 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    try {
        // Build the filter object based on searchInput and clientId
        const filter = {};
        if (searchInput) {
            let loyaltyNumberInput = Number(searchInput);
            filter.loyaltyNumber = { $regex: loyaltyNumberInput, $options: 'i' }; // Case-insensitive search on name
        }
        if (clientId) {
            filter.client = clientId; // Filter by client ID if provided
        }
        // Find discounts matching filter criteria
        const discounts = yield discountModel_1.default.find(filter)
            .skip(skip)
            .limit(limit);
        const totalDiscounts = yield discountModel_1.default.countDocuments(filter);
        // Set pagination metadata in response headers
        res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalDiscounts }));
        res.json(discounts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPaginatedDiscounts = getPaginatedDiscounts;
/**
 * Add a new discount
 */
const addDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { value, client, dateIssued } = req.body;
        // Find the latest discount by sorting in descending order by loyaltyNumber
        const lastDiscount = yield discountModel_1.default.findOne().sort({ loyaltyNumber: -1 });
        // If there are no discounts, set the loyaltyNumber to 1; otherwise, increment the last loyaltyNumber by 1
        const loyaltyNumber = lastDiscount ? lastDiscount.loyaltyNumber + 1 : 1;
        // Create a new discount with the generated loyaltyNumber and provided data
        const newDiscount = new discountModel_1.default({
            loyaltyNumber,
            value,
            client,
            dateIssued
        });
        // Save the new discount to the database
        yield newDiscount.save();
        res.status(201).json(newDiscount);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addDiscount = addDiscount;
/**
 * Update a discount by ID
 */
const updateDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discount = yield discountModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!discount)
            res.status(404).json({ error: 'Discount not found' });
        res.json(discount);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateDiscount = updateDiscount;
/**
 * Delete discounts by ID
 */
const deleteDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            res.status(400).json({ error: 'IDs must be an array' });
        }
        const result = yield discountModel_1.default.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${result.deletedCount} discount(s) deleted` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteDiscounts = deleteDiscounts;
