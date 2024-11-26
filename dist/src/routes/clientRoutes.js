"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
const router = express_1.default.Router();
// Route for fetching all clients
router.get('/', clientController_1.getAllClients);
// Route for fetching paginated items with optional search
router.get('/paginate', clientController_1.getPaginatedClients);
// Route for fetching a single item by ID
router.get('/:id', clientController_1.getClientById);
// Route for adding a new client
router.post('/', clientController_1.addClient);
// Route for updating an client by ID
router.put('/:id', clientController_1.updateClient);
// Route for deleting clients by ID
router.delete('/', clientController_1.deleteClients);
exports.default = router;
