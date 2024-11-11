import { Request, Response } from 'express';
import Sales from '../models/salesModel';

/**
 * Fetch all sales
 */
export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await Sales.find().populate('client').populate('cart.item');
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch a single sale by ID
 */
export const getSaleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const sale = await Sales.findById(req.params.id).populate('client').populate('cart.item');
    if (!sale) res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch paginated sales based on search input, client ID, and page number
 * Adds pagination metadata to the response header
 */
export const getPaginatedSales = async (req: Request, res: Response) => {
  const { pageNumber = 1, searchInput = '', clientId = '' } = req.query;
  const limit = 10;
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    // Build the filter object based on searchInput and clientId
    const filter: any = {};

    if (searchInput) {
      filter.branch = { $regex: searchInput, $options: 'i' }; // Case-insensitive search on branch
    }

    if (clientId) {
      filter.client = clientId; // Filter by client ID if provided
    }

    // Find sales matching filter criteria
    const sales = await Sales.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('client')
      .populate('cart.item');

    const totalSales = await Sales.countDocuments(filter);

    // Set pagination metadata in response headers
    res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalSales }));
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add a new sale
 */
export const addSale = async (req: Request, res: Response) => {
  try {
    const { transactionNumber, branch, client, cart, discount, totalPrice, paid, dateIssued, recurring } = req.body;

    // Create a new sale with the provided data
    const newSale = new Sales({
      transactionNumber,
      branch,
      client,
      cart,
      discount,
      totalPrice,
      paid,
      dateIssued,
      recurring
    });

    // Save the new sale to the database
    await newSale.save();
    res.status(201).json(newSale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a sale by ID
 */
export const updateSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const sale = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('client').populate('cart.item');
    if (!sale) res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete sales by ID
 */
export const deleteSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'IDs must be an array' });
    }

    const result = await Sales.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} sale(s) deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
