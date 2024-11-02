// Import required modules
import mongoose, { Schema, Document } from 'mongoose';

// Define the schema for the inventory items
interface IInventoryItem extends Document {
  name: string;
  category: string;
  quantity: string;
  dateIssued: Date;
  description: string;
  costPrice: number;
  sellingPrice: number;
}

// Create the schema with properties
const inventorySchema = new Schema<IInventoryItem>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: String, required: true },
  dateIssued: { type: Date, default: Date.now },
  description: { type: String },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
});

// Export the model for use in controllers
export default mongoose.model<IInventoryItem>('Inventory', inventorySchema);
