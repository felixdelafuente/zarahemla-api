import { Request, Response } from 'express';
import Vehicle from '../models/vehicleModel'; // Change to the appropriate Vehicle model path

/**
 * Fetch all vehicles
 */
export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch a single vehicle by ID
 */
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch paginated vehicles based on search input, client ID, and page number
 * Adds pagination metadata to the response header
 */
export const getPaginatedVehicles = async (req: Request, res: Response) => {
  const { pageNumber = 1, searchInput = '', clientId = '' } = req.query;
  const limit = 10;
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    // Build the filter object based on searchInput and clientId
    const filter: any = {};

    if (searchInput) {
      filter.model = { $regex: searchInput, $options: 'i' }; // Case-insensitive search on model
    }

    if (clientId) {
      filter.client = clientId; // Filter by client ID if provided
    }

    // Find vehicles matching filter criteria
    const vehicles = await Vehicle.find(filter)
      .skip(skip)
      .limit(limit);

    const totalVehicles = await Vehicle.countDocuments(filter);

    // Set pagination metadata in response headers
    res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalVehicles }));
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add a new vehicle
 */
export const addVehicle = async (req: Request, res: Response) => {
  try {
    const { manufacturer, model, plateNumber, client } = req.body;

    // Create a new vehicle with the provided data
    const newVehicle = new Vehicle({
      manufacturer,
      model,
      plateNumber,
      client
    });

    // Save the new vehicle to the database
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a vehicle by ID
 */
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete vehicles by ID
 */
export const deleteVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'IDs must be an array' });
    }

    const result = await Vehicle.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} vehicle(s) deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
