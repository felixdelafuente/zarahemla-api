import mongoose, { Schema } from "mongoose";

interface IVehicle extends Document {
  manufacturer: string;
  model: string;
  plateNumber: string;
  client: mongoose.Types.ObjectId;
}

const VehicleSchema: Schema = new Schema({
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  plateNumber: { type: String, required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true }
});

const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
export default Vehicle;