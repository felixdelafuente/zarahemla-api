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
exports.deleteVehicles = exports.updateVehicle = exports.addVehicle = exports.getPaginatedVehicles = exports.getVehicleById = exports.getAllVehicles = void 0;
const vehicleModel_1 = __importDefault(require("../models/vehicleModel")); // Change to the appropriate Vehicle model path
/**
 * Fetch all vehicles
 */
const getAllVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield vehicleModel_1.default.find();
        res.json(vehicles);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllVehicles = getAllVehicles;
/**
 * Fetch a single vehicle by ID
 */
const getVehicleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield vehicleModel_1.default.findById(req.params.id);
        if (!vehicle)
            res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getVehicleById = getVehicleById;
/**
 * Fetch paginated vehicles based on search input, client ID, and page number
 * Adds pagination metadata to the response header
 */
const getPaginatedVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber = 1, searchInput = '', clientId = '' } = req.query;
    const limit = 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    try {
        // Build the filter object based on searchInput and clientId
        const filter = {};
        if (searchInput) {
            filter.model = { $regex: searchInput, $options: 'i' }; // Case-insensitive search on model
        }
        if (clientId) {
            filter.client = clientId; // Filter by client ID if provided
        }
        // Find vehicles matching filter criteria
        const vehicles = yield vehicleModel_1.default.find(filter)
            .skip(skip)
            .limit(limit);
        const totalVehicles = yield vehicleModel_1.default.countDocuments(filter);
        // Set pagination metadata in response headers
        res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalVehicles }));
        res.json(vehicles);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPaginatedVehicles = getPaginatedVehicles;
/**
 * Add a new vehicle
 */
const addVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { manufacturer, model, plateNumber, client } = req.body;
        // Create a new vehicle with the provided data
        const newVehicle = new vehicleModel_1.default({
            manufacturer,
            model,
            plateNumber,
            client
        });
        // Save the new vehicle to the database
        yield newVehicle.save();
        res.status(201).json(newVehicle);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addVehicle = addVehicle;
/**
 * Update a vehicle by ID
 */
const updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield vehicleModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle)
            res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateVehicle = updateVehicle;
/**
 * Delete vehicles by ID
 */
const deleteVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            res.status(400).json({ error: 'IDs must be an array' });
        }
        const result = yield vehicleModel_1.default.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${result.deletedCount} vehicle(s) deleted` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteVehicles = deleteVehicles;
