import express from 'express';
import { addDiscount, deleteDiscounts, getAllDiscounts, getDiscountById, getPaginatedDiscounts, updateDiscount } from '../controllers/discountController';

const router = express.Router();

// Route for fetching all Discounts
router.get('/', getAllDiscounts);

// Route for fetching paginated items with optional search
router.get('/paginate', getPaginatedDiscounts);

// Route for fetching a single item by ID
router.get('/:id', getDiscountById);

// Route for adding a new Discount
router.post('/', addDiscount);

// Route for updating an Discount by ID
router.put('/:id', updateDiscount);

// Route for deleting Discounts by ID
router.delete('/', deleteDiscounts);

export default router;
