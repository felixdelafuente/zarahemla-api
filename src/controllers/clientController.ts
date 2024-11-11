import { Request, Response } from 'express';
import Client from '../models/clientModel';

/**
 * Fetch all clients
 */
export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch a single client by ID
 */
export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch paginated clients based on search input and page number
 * Adds pagination metadata to the response header
 */
export const getPaginatedClients = async (req: Request, res: Response) => {
  const { pageNumber = 1, searchInput = '' } = req.query;
  const limit = 10;
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    // Find clients matching search criteria (case-insensitive)
    const clients = await Client.find({ name: { $regex: searchInput, $options: 'i' } })
      .skip(skip)
      .limit(limit);
    const totalClients = await Client.countDocuments({ name: { $regex: searchInput, $options: 'i' } });

    // Set pagination metadata in headers
    res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalClients }));
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add a new client
 */
export const addClient = async (req: Request, res: Response) => {
  try {
    const { name, email, contact, dateIssued} = req.body;

    // Create a new client with the provided data
    const newClient = new Client({
      name,
      email,
      contact,
      dateIssued
    });

    // Save the new client to the database
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a client by ID
 */
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete clients by ID
 */
export const deleteClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'IDs must be an array' });
    }

    const result = await Client.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} client(s) deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
