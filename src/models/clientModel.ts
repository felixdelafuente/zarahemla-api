// models/Client.ts
import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Interface
export interface IClient extends Document {
  company: string;
  name: string;
  email: string;
  contact: string;
  dateIssued: Date;
}

// Mongoose Schema
const clientSchema = new Schema<IClient>({
  company: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  dateIssued: { type: Date, default: Date.now }
});

export default mongoose.model<IClient>('Client', clientSchema);