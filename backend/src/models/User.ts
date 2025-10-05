import mongoose, { Document, model, Schema, Types } from "mongoose";

// extends document mean this object can also contain other attributes _id,timestamps etc
export interface IUser extends Document {
  name: string;
  vid: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    vid: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
