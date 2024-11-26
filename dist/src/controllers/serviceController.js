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
exports.deleteServices = exports.updateService = exports.getPaginatedServices = exports.getServiceById = exports.getAllServices = exports.addService = void 0;
const serviceModel_1 = __importDefault(require("../models/serviceModel"));
// Add new service item
const addService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, name, description, duration, frequency, sellingPrice } = req.body;
        // // Ensure parts are valid Inventory IDs
        // for (const part of parts) {
        //   const exists = await Inventory.exists({ _id: part });
        //   if (!exists) {
        //     res.status(400).json({ error: `Invalid Inventory item ID: ${part}` });
        //   }
        // }
        const newService = new serviceModel_1.default({
            category,
            name,
            description,
            duration,
            frequency,
            sellingPrice,
            // parts
        });
        yield newService.save();
        res.status(201).json(newService);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addService = addService;
// Get all service items
const getAllServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield serviceModel_1.default.find(); //.populate('parts');
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllServices = getAllServices;
// Get service item by ID
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const service = yield serviceModel_1.default.findById(id); //.populate('parts');
        if (!service) {
            res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getServiceById = getServiceById;
// Get paginated service items
const getPaginatedServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber = 1, searchInput = '' } = req.query;
    const limit = 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    try {
        const filter = { name: { $regex: searchInput, $options: 'i' } };
        const services = yield serviceModel_1.default.find(filter)
            .skip(skip)
            .limit(limit);
        //.populate('parts');
        const totalItems = yield serviceModel_1.default.countDocuments(filter);
        res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalItems }));
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPaginatedServices = getPaginatedServices;
// Update service item
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedService = yield serviceModel_1.default.findByIdAndUpdate(id, updateData, { new: true }); //.populate('parts');
        if (!updatedService) {
            res.status(404).json({ error: 'Service not found' });
        }
        res.json(updatedService);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateService = updateService;
// Delete multiple service items by IDs
const deleteServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            res.status(400).json({ error: 'IDs must be an array' });
        }
        const result = yield serviceModel_1.default.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${result.deletedCount} service/s deleted` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteServices = deleteServices;
