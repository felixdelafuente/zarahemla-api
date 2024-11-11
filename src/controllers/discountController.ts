import { Request, Response } from 'express';
import Discount from '../models/discountModel';

/**
 * Fetch all discounts
 */
export const getAllDiscounts = async (req: Request, res: Response) => {
  try {
    const discounts = await Discount.find();
    res.json(discounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch a single discount by ID
 */
export const getDiscountById = async (req: Request, res: Response): Promise<void> => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) res.status(404).json({ error: 'Discount not found' });
    res.json(discount);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch paginated discounts based on search input, client ID, and page number
 * Adds pagination metadata to the response header
 */
export const getPaginatedDiscounts = async (req: Request, res: Response) => {
  const { pageNumber = 1, searchInput = '', clientId = '' } = req.query;
  const limit = 10;
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    // Build the filter object based on searchInput and clientId
    const filter: any = {};

    if (searchInput) {
      filter.name = { $regex: searchInput, $options: 'i' }; // Case-insensitive search on name
    }

    if (clientId) {
      filter.client = clientId; // Filter by client ID if provided
    }

    // Find discounts matching filter criteria
    const discounts = await Discount.find(filter)
      .skip(skip)
      .limit(limit);

    const totalDiscounts = await Discount.countDocuments(filter);

    // Set pagination metadata in response headers
    res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalDiscounts }));
    res.json(discounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Add a new discount
 */
export const addDiscount = async (req: Request, res: Response) => {
  try {
    const { value, client, dateIssued } = req.body;

    // Find the latest discount by sorting in descending order by loyaltyNumber
    const lastDiscount = await Discount.findOne().sort({ loyaltyNumber: -1 });

    // If there are no discounts, set the loyaltyNumber to 1; otherwise, increment the last loyaltyNumber by 1
    const loyaltyNumber = lastDiscount ? lastDiscount.loyaltyNumber + 1 : 1;

    // Create a new discount with the generated loyaltyNumber and provided data
    const newDiscount = new Discount({
      loyaltyNumber,
      value,
      client,
      dateIssued
    });

    // Save the new discount to the database
    await newDiscount.save();
    res.status(201).json(newDiscount);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a discount by ID
 */
export const updateDiscount = async (req: Request, res: Response): Promise<void> => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!discount) res.status(404).json({ error: 'Discount not found' });
    res.json(discount);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete discounts by ID
 */
export const deleteDiscounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'IDs must be an array' });
    }

    const result = await Discount.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} discount(s) deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
