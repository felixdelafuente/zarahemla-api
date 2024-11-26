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
exports.authenticateUser = exports.deleteUsers = exports.updateUser = exports.addUser = exports.getPaginatedUsers = exports.getUserById = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Retrieve all users from the database.
 */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        res.json(users); // Send the list of users as JSON
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
/**
 * Retrieve a single user by ID.
 */
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.params.id);
        if (!user)
            res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUserById = getUserById;
/**
 * Get paginated list of users based on search input and page number.
 * Adds pagination metadata to the response header.
 */
const getPaginatedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber = '1', searchInput = '' } = req.query;
    const limit = 5;
    const skip = (parseInt(pageNumber) - 1) * limit;
    try {
        // Filter by username containing search input (case insensitive)
        const users = yield userModel_1.default.find({ name: { $regex: searchInput, $options: 'i' } })
            .skip(skip)
            .limit(limit);
        const totalItems = yield userModel_1.default.countDocuments({ username: { $regex: searchInput, $options: 'i' } });
        // Set pagination metadata in response headers
        res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalItems }));
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPaginatedUsers = getPaginatedUsers;
/**
 * Add a new user (registration). Hashes password before saving.
 * Now accepts "access" field.
 */
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name, accountType, access } = req.body;
    try {
        const existingUser = yield userModel_1.default.findOne({ username });
        if (existingUser)
            res.status(400).json({ message: 'Username already exists' });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.default({ username, password: hashedPassword, name, accountType, access });
        yield newUser.save();
        res.status(201).json(newUser); // 201 Created
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addUser = addUser;
/**
 * Update user data by ID. Updates only fields provided in the request body.
 * Now allows updating "access" field.
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name, accountType, access } = req.body;
    try {
        const updatedData = { username, name, accountType, access };
        if (password)
            updatedData.password = yield bcryptjs_1.default.hash(password, 10); // Hash new password if provided
        const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!user)
            res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateUser = updateUser;
/**
 * Delete a user by ID.
 */
const deleteUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            res.status(400).json({ error: 'IDs must be an array' });
        }
        const result = yield userModel_1.default.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${result.deletedCount} user/s deleted` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteUsers = deleteUsers;
/**
 * Authenticate user by checking username and password.
 * If valid, returns user's name, account type, and access rights.
 */
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ username });
        if (!user) {
            res.status(404).json({ message: 'Invalid username or password' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }
        // Return user data including access rights
        res.json({ id: user._id, name: user.name, accountType: user.accountType, access: user.access });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.authenticateUser = authenticateUser;
