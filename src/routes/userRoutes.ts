
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

// Route for fetching all users
router.get('/', getAllUsers);

// Route for fetching paginated users with optional search
router.get('/paginate', getPaginatedUsers);

// Route for fetching a single user by ID
router.get('/:id', getUserById);

// Route for adding a new user
router.post('/register', addUser);

// Route for authenticating username and password
router.post('/authenticate', authenticateUser);

// Route for updating a user by ID
router.put('/:id', updateUser);

// Route for deleting a user by ID
router.delete('/:id', deleteUser);

export default router;