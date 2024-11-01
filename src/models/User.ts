import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing a User document in MongoDB.
 */
export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  accountType: string;
}

// Define the schema for the User model with validation and constraints
const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true }, // Unique to prevent duplicate usernames
  password: { type: String, required: true }, // Will be hashed before saving
  name: { type: String, required: true },
  accountType: { type: String, required: true }, // E.g., "Cashier", "Clerk", or "Admin"
});

export default mongoose.model<IUser>('User', userSchema);
