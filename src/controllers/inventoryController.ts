import { Request, Response } from 'express';
import Inventory from '../models/inventoryModel';

/**
 * Fetch all inventory items
 */
export const getAllInventoryItems = async (req: Request, res: Response) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch a single inventory item by ID
 */
export const getInventoryItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch paginated inventory items based on search input and page number
 * Adds pagination metadata to the response header
 */
export const getPaginatedInventoryItems = async (req: Request, res: Response) => {
  const { pageNumber = 1, searchInput = '' } = req.query;
  const limit = 10;
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    // Find items matching search criteria (case-insensitive)
    const items = await Inventory.find({ name: { $regex: searchInput, $options: 'i' } })
      .skip(skip)
      .limit(limit);
    const totalItems = await Inventory.countDocuments({ name: { $regex: searchInput, $options: 'i' } });

    // Set pagination metadata in headers
    res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalItems }));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add a new inventory item
 */
export const addInventoryItem = async (req: Request, res: Response) => {
  try {
    const { brand, name, description, category, size, quantity, unit, dateIssued, costPrice, sellingPrice } = req.body;

    // Create a new inventory item with the provided data
    const newItem = new Inventory({
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
 * Update an inventory item by ID
 */
export const updateInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an inventory item by ID
 */
export const deleteInventoryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'IDs must be an array' });
    }

    const result = await Inventory.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} inventory item/s deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
