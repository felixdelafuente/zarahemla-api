"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salesController_1 = require("../controllers/salesController");
const router = express_1.default.Router();
// Route for fetching all Sales
router.get('/', salesController_1.getAllSales);
// Route for fetching paginated items with optional search
router.get('/paginate', salesController_1.getPaginatedSales);
// Route for fetching items with day, week, month, and year parameter
router.get('/report', salesController_1.salesReport);
// Route for fetching a single item by ID
router.get('/:id', salesController_1.getSaleById);
// Route for adding a new Sale
router.post('/', salesController_1.addSale);
// Route for updating an Sale by ID
router.put('/:id', salesController_1.updateSale);
// Route for updating the 'paid' and 'recurring' property of a Sale by ID
router.patch('/:id/paid-recurring', salesController_1.updatePaidAndRecurring);
// Route for deleting Sales by ID
router.delete('/', salesController_1.deleteSales);
exports.default = router;
