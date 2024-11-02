import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import bcrypt from 'bcryptjs';

/**
 * Retrieve all users from the database.
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users); // Send the list of users as JSON
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve a single user by ID.
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get paginated list of users based on search input and page number.
 * Adds pagination metadata to the response header.
 */
export const getPaginatedUsers = async (req: Request, res: Response) => {
  const { pageNumber = '1', searchInput = '' } = req.query;
  const limit = 10;
  const skip = (parseInt(pageNumber as string) - 1) * limit;

  try {
    // Filter by username containing search input (case insensitive)
    const users = await User.find({ name: { $regex: searchInput, $options: 'i' } })
      .skip(skip)
      .limit(limit);
    const totalItems = await User.countDocuments({ username: { $regex: searchInput, $options: 'i' } });

    // Set pagination metadata in response headers
    res.set('Pagination', JSON.stringify({ currentPage: pageNumber, totalItems }));
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Add a new user (registration). Hashes password before saving.
 */
export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, name, accountType } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, name, accountType });
    
    await newUser.save();
    res.status(201).json(newUser); // 201 Created
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update user data by ID. Updates only fields provided in the request body.
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, name, accountType } = req.body;

  try {
    const updatedData: Partial<IUser> = { username, name, accountType };
    if (password) updatedData.password = await bcrypt.hash(password, 10); // Hash new password if provided

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!user) res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a user by ID.
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Authenticate user by checking username and password.
 * If valid, returns user's name and account type.
 */
export const authenticateUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'Invalid username or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    res.json({ id: user._id , name: user.name, accountType: user.accountType });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};