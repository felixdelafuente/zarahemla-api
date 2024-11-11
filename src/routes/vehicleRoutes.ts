import express from 'express';
import { addVehicle, deleteVehicles, getAllVehicles, getVehicleById, getPaginatedVehicles, updateVehicle } from '../controllers/vehicleController';

const router = express.Router();

// Route for fetching all Vehicles
router.get('/', getAllVehicles);

// Route for fetching paginated items with optional search
router.get('/paginate', getPaginatedVehicles);

// Route for fetching a single item by ID
router.get('/:id', getVehicleById);

// Route for adding a new Vehicle
router.post('/', addVehicle);

// Route for updating an Vehicle by ID
router.put('/:id', updateVehicle);

// Route for deleting Vehicles by ID
router.delete('/', deleteVehicles);

export default router;
