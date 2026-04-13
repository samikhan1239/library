// app/api/alerts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Alert from '@/models/Alert';
import Book from '@/models/Book';
import Issue from '@/models/Issue';

// ✅ GET: Fetch all alerts (for the AlertsPage)
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

// ✅ POST: Hardware RFID Scan → Create Alert if book is NOT issued
export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();   // uid = RFID tag from ESP32

    if (!uid) {
      return NextResponse.json({ error: 'UID (RFID) is required' }, { status: 400 });
    }

    await dbConnect();

    // 1. Find the book by RFID
    const book = await Book.findOne({ rfid: uid });
    if (!book) {
      return NextResponse.json({
        status: 'unknown_rfid',
        message: 'Unknown RFID tag scanned'
      }, { status: 200 });
    }

    // 2. Check if the book is currently issued (active issue)
    const activeIssue = await Issue.findOne({
      rfid: uid,
      returnDate: null,
    });

    if (activeIssue) {
      // Book is issued → no alert (normal scan, maybe return)
      return NextResponse.json({
        status: 'issued',
        message: 'Book is currently issued',
        bookTitle: book.title,
      }, { status: 200 });
    }

    // 3. Book exists but NOT issued → Create Alert (unauthorized scan)
    const newAlert = await Alert.create({
      rfidTag: uid,
      bookTitle: book.title,
      bookAuthor: book.author,
      status: 'active',
    });

    return NextResponse.json({
      status: 'alert_created',
      alert: newAlert,
      message: 'Unauthorized scan detected - Alert created'
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

    if (!id) return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });

    await dbConnect();

    const updated = await Alert.findByIdAndUpdate(
      id,
      { status: 'resolved' },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: 'Alert not found' }, { status: 404 });

    return NextResponse.json({ message: 'Alert resolved', alert: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve alert' }, { status: 500 });
  }
}

// ✅ DELETE: Delete resolved alert
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });

    await dbConnect();
    const deleted = await Alert.findByIdAndDelete(id);

    if (!deleted) return NextResponse.json({ error: 'Alert not found' }, { status: 404 });

    return NextResponse.json({ message: 'Alert deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}