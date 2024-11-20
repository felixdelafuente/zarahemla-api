import { Request, Response } from 'express';
import Trading from '../models/tradingModel';

/**
 * Fetch all trading items
 */
export const getAllTradingItems = async (req: Request, res: Response) => {
  try {
    const items = await Trading.find();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch a single trading item by ID
 */
export const getTradingItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Trading.findById(req.params.id);
    if (!item) res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get paginated list of trading items based on brand search and page number.
 * Adds pagination metadata to the response header.
 */
export const getPaginatedTradingItems = async (req: Request, res: Response) => {
  const { pageNumber = '1', searchInput = '' } = req.query; // Ensure query parameters are parsed correctly
  const limit = 10; // Number of items per page
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    // Search by brand (case insensitive)
    const items = await Trading.find({ brand: { $regex: searchInput, $options: 'i' } })
      .skip(skip)
      .limit(limit);

    const totalItems = await Trading.countDocuments({ brand: { $regex: searchInput, $options: 'i' } });

    // Set pagination metadata in the response headers
    res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalItems }));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add/delete quantity to an existing trading item's current quantity
 */
export const addQuantityToTradingItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the item ID from the URL parameter
    const { quantityToAdd } = req.body; // Get the quantity to add/subtract from the request body

    // Find the trading item by ID
    const item = await Trading.findById(id);

    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // Add or subtract the quantity
    item.quantity += quantityToAdd;

    // Optional: Prevent negative stock if needed
    if (item.quantity < 0) {
      item.quantity = 0; // You can adjust this behavior to allow negative stock if needed
    }

    // Save the updated item
    await item.save();

    res.json(item); // Send back the updated item
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add a new trading item
 */
export const addTradingItem = async (req: Request, res: Response) => {
  try {
    const { brand, name, description, category, size, quantity, unit, dateIssued, costPrice, sellingPrice } = req.body;

    // Create a new trading item with the provided data
    const newItem = new Trading({
      brand,
      name,
      description,
      category,
      size,
      quantity,
      unit,
      dateIssued,
      costPrice,
      sellingPrice,
    });

    // Save the new item to the database
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Update an trading item by ID
 */
export const updateTradingItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Trading.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an trading item by ID
 */
export const deleteTradingItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'IDs must be an array' });
    }

    const result = await Trading.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} trading item/s deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
