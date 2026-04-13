// 📁 models/Issue.ts
// ✅ Create this new model file first (same folder as your Book model)

import mongoose, { Schema, Document } from 'mongoose';

export interface IIssue extends Document {
  bookName: string;
  author: string;
  rfid: string;                    // Needed for ESP32 hardware check (green/red light)
  studentName: string;
  enrollmentNumber: string;
  branch: string;
  year: string;
  issueDate: Date;
  returnDate: Date | null;
  status: 'issued' | 'returned';
}

const issueSchema = new Schema<IIssue>(
  {
    bookName: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    rfid: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    enrollmentNumber: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['issued', 'returned'],
      default: 'issued',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Issue || mongoose.model<IIssue>('Issue', issueSchema);