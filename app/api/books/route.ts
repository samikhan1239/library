// app/api/books/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

// ✅ NEW: CHECK RFID (for ESP32)
export async function PUT(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'UID required' }, { status: 400 });
    }

    await dbConnect();

    const book = await Book.findOne({ rfid: uid });

    if (book) {
      return NextResponse.json({ status: 'registered' }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'not_registered' }, { status: 200 });
    }

  } catch (error) {
    console.error('RFID check error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}