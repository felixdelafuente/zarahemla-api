
import express from 'express';

import {
  getAllUsers,
  getUserById,
  getPaginatedUsers,
  updateUser,
  deleteUser,
  authenticateUser,
  addUser,
} from '../controllers/userController';

const router = express.Router();

// Map routes to controller functions
router.get('/', getAllUsers); // GET /api/users
router.get('/paginate', getPaginatedUsers); // GET /api/users/paginate
router.get('/:id', getUserById); // GET /api/users/:id
router.post('/register', addUser); // POST /api/users/register
router.post('/authenticate', authenticateUser); // POST /api/users/authenticate
router.put('/:id', updateUser); // PUT /api/users/:id
router.delete('/:id', deleteUser); // DELETE /api/users/:id

export default router;