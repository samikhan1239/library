// app/api/alerts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Alert from '@/models/Alert';
import Book from '@/models/Book';
import Issue from '@/models/Issue';

// ✅ GET: Fetch all alerts
export async function GET() {
  try {
    await dbConnect();
    const alerts = await Alert.find({}).sort({ timestamp: -1 });
    return NextResponse.json(alerts, { status: 200 });
  } catch (error) {
    console.error('GET alerts error:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

// ✅ POST: RFID Scan from Hardware (ESP32) - Main Logic
export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'UID (RFID) is required' }, { status: 400 });
    }

    await dbConnect();

    // 1. Find the book by RFID
    const book = await Book.findOne({ rfid: uid });
    if (!book) {
      return NextResponse.json({
        status: 'unknown_rfid',
        message: 'Unknown RFID tag scanned',
      }, { status: 200 });
    }

    // 2. Check if book is currently issued (using your Issue route logic)
    const activeIssue = await Issue.findOne({
      rfid: uid,
      returnDate: null,        // Only active (not returned) issues
    });

    const issueStatus = activeIssue ? 'Issued' : 'Not Issued';

    // === If book is issued → No alert (Safe/Green) ===
    if (activeIssue) {
      return NextResponse.json({
        status: 'issued',
        message: 'Book is currently issued - Safe scan',
        bookTitle: book.title,
        bookAuthor: book.author,
        issueStatus: 'Issued',
      }, { status: 200 });
    }

    // === If book is NOT issued → Create Alert (Red) ===
    const newAlert = await Alert.create({
      rfidTag: uid,
      bookTitle: book.title,
      bookAuthor: book.author,
      issueStatus: 'Not Issued',     // ← Saving according to your model
    });

    return NextResponse.json({
      status: 'alert_created',
      message: 'Unauthorized scan detected! Book is not issued.',
      alert: newAlert,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Alert scan error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ✅ PATCH: Resolve an alert
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
    }

    await dbConnect();

    const updated = await Alert.findByIdAndUpdate(
      id,
      { 
        status: 'resolved',
        timestamp: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Alert resolved successfully', 
      alert: updated 
    }, { status: 200 });
  } catch (error) {
    console.error('PATCH alert error:', error);
    return NextResponse.json({ error: 'Failed to resolve alert' }, { status: 500 });
  }
}

// ✅ DELETE: Delete resolved alert
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
    }

    await dbConnect();

    const deleted = await Alert.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Alert deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE alert error:', error);
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}