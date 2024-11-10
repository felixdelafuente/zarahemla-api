// Import required modules
import mongoose, { Schema, Document } from 'mongoose';

// Define the schema for the inventory items
interface IInventoryItem extends Document {
  category: string;
  size: string;
  brand: string;
  description: string;  
  quantity: string;
  unit: string;
  sellingPrice: number;
}

// Create the schema with properties
const inventorySchema = new Schema<IInventoryItem>({
  category: { type: String, required: true },
  size: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String },
  quantity: { type: String, required: true },
  unit: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
});

// Export the model for use in controllers
export default mongoose.model<IInventoryItem>('Inventory', inventorySchema);
