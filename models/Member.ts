// models/Member.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  name: string;
  email: string;
  phone: string;
  memberId: string;
}

const memberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true 
    },
    phone: { type: String, required: true, trim: true },
    memberId: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model<IMember>('Member', memberSchema);