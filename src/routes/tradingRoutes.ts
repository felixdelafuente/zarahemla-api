import express from 'express';
import {
  getAllTradingItems,
  getTradingItemById,
  getPaginatedTradingItems,
  addTradingItem, // Import the new controller
  updateTradingItem,
  deleteTradingItems,
  addQuantityToTradingItem,
} from '../controllers/tradingController';

const router = express.Router();

// Route for fetching all trading items
router.get('/', getAllTradingItems);

// Route for fetching paginated items with optional search
router.get('/paginate', getPaginatedTradingItems);

// Route for fetching a single item by ID
router.get('/:id', getTradingItemById);

// Add quantity to a trading item
router.patch('/:id/add-quantity', addQuantityToTradingItem);

// Route for adding a new trading item
router.post('/', addTradingItem);

// Route for updating an trading item by ID
router.put('/:id', updateTradingItem);

// Route for deleting trading items by ID
router.delete('/', deleteTradingItems);

export default router;
