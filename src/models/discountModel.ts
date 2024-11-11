import mongoose, { Schema } from "mongoose";

interface IDiscount extends Document {
  loyaltyNumber: number;
  value: number;
  client: mongoose.Types.ObjectId;
  dateIssued: Date;
}

const DiscountSchema: Schema = new Schema({
  loyaltyNumber: { type: Number, required: true, unique: true },
  value: { type: Number, required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  dateIssued: { type: Date, default: Date.now }
});

const Discount = mongoose.model<IDiscount>('Discount', DiscountSchema);
export default Discount;