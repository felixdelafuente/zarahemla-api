import express from 'express';
import {
  getAllInventoryItems,
  getInventoryItemById,
  getPaginatedInventoryItems,
  addInventoryItem, // Import the new controller
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController';

const router = express.Router();

// Route for fetching all inventory items
router.get('/', getAllInventoryItems);

// Route for fetching paginated items with optional search
router.get('/paginate', getPaginatedInventoryItems);

// Route for fetching a single item by ID
router.get('/:id', getInventoryItemById);

// Route for adding a new inventory item
router.post('/', addInventoryItem);

// Route for updating an inventory item by ID
router.put('/:id', updateInventoryItem);

// Route for deleting an inventory item by ID
router.delete('/:id', deleteInventoryItem);

export default router;
