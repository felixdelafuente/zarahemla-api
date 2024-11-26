"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Map routes to controller functions
router.get('/', userController_1.getAllUsers); // GET /api/users
router.get('/:id', userController_1.getUserById); // GET /api/users/:id
router.get('/paginate', userController_1.getPaginatedUsers); // GET /api/users/paginate
router.post('/register', userController_1.addUser); // POST /api/users/register
router.put('/:id', userController_1.updateUser); // PUT /api/users/:id
router.delete('/:id', userController_1.deleteUser); // DELETE /api/users/:id
router.post('/authenticate', userController_1.authenticateUser); // POST /api/users/authenticate
exports.default = router;
