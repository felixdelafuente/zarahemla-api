import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the interface for Service Document
export interface IService extends Document {
  category: string;
  name: string;
  description: string;
  duration: string;
  frequency: string;
  price: number;
}

// Define the schema for Service collection
const ServiceSchema: Schema = new Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  frequency: { type: String, required: true },
  price: { type: Number, required: true }
});

export default mongoose.model<IService>('Service', ServiceSchema);
