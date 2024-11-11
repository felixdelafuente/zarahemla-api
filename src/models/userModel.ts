import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  accountType: string;
  access: {
    trading: string[];  // Array of strings for trading access
    services: string[]; // Array of strings for services access
  }[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  accountType: { type: String, required: true },
  access: [{
    trading: { type: [String], default: [] },  // Array of strings for trading access
    services: { type: [String], default: [] }  // Array of strings for services access
  }]
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;