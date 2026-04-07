// models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  rfid: string;
  createdAt: Date;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, trim: true, unique: true },
  rfid: { type: String, required: true, trim: true, unique: true },
}, {
  timestamps: true,
});

const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;