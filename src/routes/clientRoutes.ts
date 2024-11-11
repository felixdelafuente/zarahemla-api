import express from 'express';
import { addClient, deleteClients, getAllClients, getClientById, getPaginatedClients, updateClient } from '../controllers/clientController';

const router = express.Router();

// Route for fetching all clients
router.get('/', getAllClients);

// Route for fetching paginated items with optional search
router.get('/paginate', getPaginatedClients);

// Route for fetching a single item by ID
router.get('/:id', getClientById);

// Route for adding a new client
router.post('/', addClient);

// Route for updating an client by ID
router.put('/:id', updateClient);

// Route for deleting clients by ID
router.delete('/', deleteClients);

export default router;
