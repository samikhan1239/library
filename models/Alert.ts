// models/Alert.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  rfidTag: string;
  bookTitle: string;
  bookAuthor?: string;
  timestamp: Date;
  status: 'active' | 'resolved';
}

const alertSchema = new Schema<IAlert>(
  {
    rfidTag: { type: String, required: true, trim: true },
    bookTitle: { type: String, required: true, trim: true },
    bookAuthor: { type: String, trim: true },
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Alert || mongoose.model<IAlert>('Alert', alertSchema);