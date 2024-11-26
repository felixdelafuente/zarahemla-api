"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tradingController_1 = require("../controllers/tradingController");
const router = express_1.default.Router();
// Route for fetching all trading items
router.get('/', tradingController_1.getAllTradingItems);
// Route for fetching paginated items with optional search
router.get('/paginate', tradingController_1.getPaginatedTradingItems);
// Route for fetching items with quantity less than 10
router.get('/low-stock', tradingController_1.getLowStockTradingItems);
// Route for fetching a single item by ID
router.get('/:id', tradingController_1.getTradingItemById);
// Add quantity to a trading item
router.patch('/:id/add-quantity', tradingController_1.addQuantityToTradingItem);
// Route for adding a new trading item
router.post('/', tradingController_1.addTradingItem);
// Route for updating an trading item by ID
router.put('/:id', tradingController_1.updateTradingItem);
// Route for deleting trading items by ID
router.delete('/', tradingController_1.deleteTradingItems);
exports.default = router;
