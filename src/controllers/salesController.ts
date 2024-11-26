import { Request, Response } from 'express';
import Sales, {ISales} from '../models/salesModel';

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
  const { pageNumber = 1, searchInput = '', clientId = '', branch = '' } = req.query;
  const limit = 10;
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    // Build the filter object based on searchInput, clientId, and branch
    const filter: any = {};

    if (searchInput) {
      filter.transactionNumber = { $regex: searchInput, $options: 'i' }; // Case-insensitive search on transactionNumber
    }

    if (clientId) {
      filter.client = clientId; // Filter by client ID if provided
    }

    if (branch) {
      filter.branch = branch; // Filter by branch if provided
    }

    // Find sales matching filter criteria and sort by dateIssued in descending order
    const sales = await Sales.find(filter)
      .sort({ dateIssued: -1 }) // Sort by dateIssued descending
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
 * Generate a sales report based on date, week, month, and year filters
 */
export const salesReport = async (req: Request, res: Response): Promise<void> => {
  const { date, week, month, year } = req.query;

  try {
    // If no filters are provided, fetch all sales
    const filter: any = {};

    if (!month && !year) {
      // If month and year are not provided, fetch all sales
      const sales = await Sales.find(filter)
        .sort({ dateIssued: -1 })
        .populate('client')
        .populate('cart.item');
      res.json(sales);
      return;
    }

    // If month and year are provided, apply filters
    if (!month || !year) {
      res.status(400).json({ error: "Month and year are required for date or week filtering." });
      return;
    }

    const yearValue = Number(year);
    const monthValue = Number(month) - 1; // JavaScript months are 0-based

    if (date) {
      // Validate and calculate date range for the specified day
      const day = Number(date);
      const specificDate = new Date(yearValue, monthValue, day);
      if (specificDate.getMonth() !== monthValue) {
        res.status(400).json({ error: "Invalid date for the given month." });
        return;
      }
      const nextDay = new Date(yearValue, monthValue, day + 1);
      filter.dateIssued = {
        $gte: specificDate,
        $lt: nextDay,
      };
      return;
    }

    if (week) {
      // Validate and calculate the date range for the specified week
      const weekNumber = Number(week);
      if (weekNumber < 1 || weekNumber > 4) {
        res.status(400).json({ error: "Week must be between 1 and 4." });
        return;
      }

      const startOfWeek = new Date(yearValue, monthValue, (weekNumber - 1) * 7 + 1);
      const endOfWeek = new Date(yearValue, monthValue, weekNumber * 7 + 1);
      if (startOfWeek.getMonth() !== monthValue) {
        res.status(400).json({ error: "Invalid week for the given month." });
        return;
      }
      filter.dateIssued = {
        $gte: startOfWeek,
        $lt: endOfWeek,
      };
      return;
    }

    // Default filter if only month and year are provided
    if (!date && !week) {
      filter.dateIssued = {
        $gte: new Date(yearValue, monthValue, 1),
        $lt: new Date(yearValue, monthValue + 1, 1),
      };
      return;
    }

    // Query the database with the constructed filter
    const sales = await Sales.find(filter)
      .sort({ dateIssued: -1 })
      .populate('client')
      .populate('cart.item');

    res.json(sales);
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
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
 * Update the paid property and optionally the recurring property of a sale
 */
export const updatePaidAndRecurring = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Sale ID from request params
    const { paid, recurring } = req.body; // Properties to update

    // Prepare the update object with only allowed fields
    const update: Partial<ISales> = {};
    if (typeof paid === 'boolean') {
      update.paid = paid;
    }
    if (typeof recurring === 'boolean') {
      update.recurring = recurring;
    }

    // Update the sale with specified fields
    const updatedSale = await Sales.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true } // Return the updated document
    ).populate('client').populate('cart.item');

    // Handle case when the sale is not found
    if (!updatedSale) {
      res.status(404).json({ error: 'Sale not found' });
      return;
    }

    res.json(updatedSale);
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
