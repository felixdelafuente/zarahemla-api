"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Route for fetching all users
router.get('/', userController_1.getAllUsers);
// Route for fetching paginated users with optional search
router.get('/paginate', userController_1.getPaginatedUsers);
// Route for fetching a single user by ID
router.get('/:id', userController_1.getUserById);
// Route for adding a new user
router.post('/register', userController_1.addUser);
// Route for authenticating username and password
router.post('/authenticate', userController_1.authenticateUser);
// Route for updating a user by ID
router.put('/:id', userController_1.updateUser);
// Route for deleting users by ID
router.delete('/', userController_1.deleteUsers);
exports.default = router;
