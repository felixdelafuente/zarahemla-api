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
exports.deleteClients = exports.updateClient = exports.addClient = exports.getPaginatedClients = exports.getClientById = exports.getAllClients = void 0;
const clientModel_1 = __importDefault(require("../models/clientModel"));
/**
 * Fetch all clients
 */
const getAllClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield clientModel_1.default.find();
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllClients = getAllClients;
/**
 * Fetch a single client by ID
 */
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield clientModel_1.default.findById(req.params.id);
        if (!client)
            res.status(404).json({ error: 'Client not found' });
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getClientById = getClientById;
/**
 * Fetch paginated clients based on search input and page number
 * Adds pagination metadata to the response header
 */
const getPaginatedClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber = 1, searchInput = '' } = req.query;
    const limit = 10;
    const skip = (parseInt(pageNumber) - 1) * limit;
    try {
        // Find clients matching search criteria (case-insensitive)
        const clients = yield clientModel_1.default.find({ name: { $regex: searchInput, $options: 'i' } })
            .skip(skip)
            .limit(limit);
        const totalClients = yield clientModel_1.default.countDocuments({ name: { $regex: searchInput, $options: 'i' } });
        // Set pagination metadata in headers
        res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalClients }));
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPaginatedClients = getPaginatedClients;
/**
 * Add a new client
 */
const addClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, contact, dateIssued } = req.body;
        // Create a new client with the provided data
        const newClient = new clientModel_1.default({
            name,
            email,
            contact,
            dateIssued
        });
        // Save the new client to the database
        yield newClient.save();
        res.status(201).json(newClient);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addClient = addClient;
/**
 * Update a client by ID
 */
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield clientModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!client)
            res.status(404).json({ error: 'Client not found' });
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateClient = updateClient;
/**
 * Delete clients by ID
 */
const deleteClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            res.status(400).json({ error: 'IDs must be an array' });
        }
        const result = yield clientModel_1.default.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${result.deletedCount} client(s) deleted` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteClients = deleteClients;
