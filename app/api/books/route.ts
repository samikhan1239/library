// app/api/books/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

// ✅ GET: Fetch all books
export async function GET() {
  try {
    await dbConnect();
    const books = await Book.find({}).sort({ createdAt: -1 });

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error('GET books error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// ✅ POST: Add new book
export async function POST(request: NextRequest) {
  try {
    const { title, author, isbn, rfid } = await request.json();

    if (!title || !author || !isbn || !rfid) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const newBook = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      rfid: rfid.trim(),
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error: any) {
    console.error('POST book error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'ISBN or RFID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove book
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Book deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE book error:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}

// ✅ PUT: Check RFID (ESP32)
export async function PUT(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'UID required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const book = await Book.findOne({ rfid: uid });

    if (book) {
      return NextResponse.json(
        { status: 'registered' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: 'not_registered' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('RFID check error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}