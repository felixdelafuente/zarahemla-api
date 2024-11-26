import express from 'express';
import { addSale, deleteSales, getAllSales, getSaleById, getPaginatedSales, updateSale, updatePaidAndRecurring, salesReport } from '../controllers/salesController';

const router = express.Router();

// Route for fetching all Sales
router.get('/', getAllSales);

// Route for fetching paginated items with optional search
router.get('/paginate', getPaginatedSales);

// Route for fetching items with day, week, month, and year parameter
router.get('/report', salesReport);

// Route for fetching a single item by ID
router.get('/:id', getSaleById);

// Route for adding a new Sale
router.post('/', addSale);

// Route for updating an Sale by ID
router.put('/:id', updateSale);

// Route for updating the 'paid' and 'recurring' property of a Sale by ID
router.patch('/:id/paid-recurring', updatePaidAndRecurring);

// Route for deleting Sales by ID
router.delete('/', deleteSales);

export default router;
