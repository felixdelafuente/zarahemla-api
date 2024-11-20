import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the interface for Service Document
export interface IService extends Document {
  name: string;
  description: string;
  duration: string;
  frequency: string;
  sellingPrice: number;
  parts: Types.ObjectId[];  // Array of Trading item ObjectIds
}

// Define the schema for Service collection
const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  frequency: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
  parts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trading', required: true }]
});

export default mongoose.model<IService>('Service', ServiceSchema);
