"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discountController_1 = require("../controllers/discountController");
const router = express_1.default.Router();
// Route for fetching all Discounts
router.get('/', discountController_1.getAllDiscounts);
// Route for fetching paginated items with optional search
router.get('/paginate', discountController_1.getPaginatedDiscounts);
// Route for fetching a single item by ID
router.get('/:id', discountController_1.getDiscountById);
// Route for adding a new Discount
router.post('/', discountController_1.addDiscount);
// Route for updating an Discount by ID
router.put('/:id', discountController_1.updateDiscount);
// Route for deleting Discounts by ID
router.delete('/', discountController_1.deleteDiscounts);
exports.default = router;
