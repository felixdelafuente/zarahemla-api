import { Request, Response } from 'express';
import Service from '../models/serviceModel';
import Inventory from '../models/inventoryModel'; // Assuming this exists

// Add new service item
export const addService = async (req: Request, res: Response) => {
  try {
    const { category, name, description, duration, frequency, price } = req.body;

    const newService = new Service({
      category,
      name,
      description,
      duration,
      frequency,
      price
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all service items
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get service item by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get paginated service items
export const getPaginatedServices = async (req: Request, res: Response) => {
  const { pageNumber = 1, searchInput = '' } = req.query;
  const limit = 10;
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    const filter = { name: { $regex: searchInput, $options: 'i' } };
    const services = await Service.find(filter)
      .skip(skip)
      .limit(limit);
    const totalItems = await Service.countDocuments(filter);
    res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalItems }));
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update service item
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedService) {
      res.status(404).json({ error: 'Service not found' });
    }

    res.json(updatedService);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete multiple service items by IDs
export const deleteServices = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'IDs must be an array' });
    }

    const result = await Service.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} service/s deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
