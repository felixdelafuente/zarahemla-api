import { Router } from 'express';
import {
  addService,
  getAllServices,
  getServiceById,
  getPaginatedServices,
  updateService,
  deleteServices
} from '../controllers/serviceController';

const router = Router();

// Route for fetching all services
router.post('/', addService);       

// Route for fetching paginated services with optional search
router.get('/', getAllServices);   

// Route for fetching a single service by ID
router.get('/paginate', getPaginatedServices); 

// Route for adding a new service
router.get('/:id', getServiceById);    

// Route for updating a service by ID
router.put('/:id', updateService);    

// Route for deleting services by ID
router.delete('/', deleteServices);            

export default router;