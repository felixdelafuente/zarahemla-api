// Import required modules
import mongoose, { Schema, Document } from 'mongoose';

// Define the schema for the trading items
interface ITradingItem extends Document {
  category: string;
  size: string;
  brand: string;
  description: string;
  quantity: number;
  unit: string;
  sellingPrice: number;
}

// Create the schema with properties
const tradingSchema = new Schema<ITradingItem>({
  category: { type: String, required: true },
  size: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
});

// Export the model for use in controllers
export default mongoose.model<ITradingItem>('Trading', tradingSchema);
