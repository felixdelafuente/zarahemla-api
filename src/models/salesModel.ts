import mongoose, { Schema } from "mongoose";

export interface ISales extends Document {
  transactionNumber: number;
  branch: string;
  client: mongoose.Types.ObjectId;
  cart: { item: mongoose.Types.ObjectId, itemPrice: number, quantity: number, subTotal: number }[];
  discount: number;
  totalPrice: number;
  paid: boolean;
  dateIssued: Date;
  recurring: boolean;
}

const SalesSchema: Schema = new Schema({
  transactionNumber: { type: Number, required: true, unique: true },
  branch: { type: String, required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  cart: [{
    item: { type: Schema.Types.ObjectId, required: true },
    itemPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subTotal: { type: Number, required: true }
  }],
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  dateIssued: { type: Date, default: Date.now },
  recurring: { type: Boolean, default: false },
});

const Sales = mongoose.model<ISales>('Sales', SalesSchema);
export default Sales;
