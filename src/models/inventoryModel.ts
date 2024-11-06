// Import required modules
import mongoose, { Schema, Document } from 'mongoose';

// Define the schema for the inventory items
interface IInventoryItem extends Document {
  brand: string;
  name: string;
  description: string;
  category: string;
  size: string;
  quantity: string;
  unit: string;
  dateIssued: Date;
  costPrice: number;
  sellingPrice: number;
}

// Create the schema with properties
const inventorySchema = new Schema<IInventoryItem>({
  brand: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, required: true },
  dateIssued: { type: Date, default: Date.now },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
});

// Export the model for use in controllers
export default mongoose.model<IInventoryItem>('Inventory', inventorySchema);
