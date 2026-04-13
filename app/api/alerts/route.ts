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
    const alerts = await Alert.find({}).sort({ createdAt: -1 });

    return NextResponse.json(alerts, { status: 200 });
  } catch (error) {
    console.error('GET alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// ✅ POST: RFID Scan from ESP32
export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      console.log('❌ No UID received');
      return NextResponse.json(
        { error: 'UID (RFID) is required' },
        { status: 400 }
      );
    }

    console.log(`📡 RFID Scanned: ${uid}`);

    await dbConnect();

    // ✅ Find book
    const book = await Book.findOne({ rfid: uid.trim() });

    if (!book) {
      console.log(`⚠️ Unknown RFID: ${uid}`);
      return NextResponse.json({
        status: 'unknown_rfid',
        message: 'Unknown RFID tag scanned',
      });
    }

    console.log(`✅ Book Found → ${book.title}`);

    // ✅ Check active issue (FIXED)
    const activeIssue = await Issue.findOne({
      rfid: uid.trim(),
      $or: [
        { returnDate: null },
        { returnDate: { $exists: false } }
      ],
    });

    // 🟢 SAFE CASE
    if (activeIssue) {
      console.log(`🟢 SAFE: Book is issued`);

      return NextResponse.json({
        status: 'issued',
        message: 'Book is currently issued - Safe scan',
        bookTitle: book.title,
        bookAuthor: book.author,
        rfid: uid,
      });
    }

    // 🔴 ALERT CASE

    // ✅ 1. Prevent duplicate active alert
    const existingAlert = await Alert.findOne({
      rfidTag: uid.trim(),
      status: { $ne: 'resolved' },
    });

    if (existingAlert) {
      console.log(`⚠️ Duplicate alert prevented`);

      return NextResponse.json({
        status: 'already_alerted',
        message: 'Alert already exists for this book',
      });
    }

    // ✅ 2. Cooldown (10 sec)
    const lastAlert = await Alert.findOne({
      rfidTag: uid.trim(),
    }).sort({ createdAt: -1 });

    if (
      lastAlert &&
      Date.now() - new Date(lastAlert.createdAt).getTime() < 10000
    ) {
      console.log(`⏳ Cooldown active`);

      return NextResponse.json({
        status: 'cooldown',
        message: 'Please wait before scanning again',
      });
    }

    console.log(`🔴 Creating ALERT for ${book.title}`);

    const newAlert = await Alert.create({
      rfidTag: uid.trim(),
      bookTitle: book.title,
      bookAuthor: book.author,
      issueStatus: 'Not Issued',
      status: 'active',
    });

    console.log(`🚨 ALERT CREATED: ${newAlert._id}`);

    return NextResponse.json(
      {
        status: 'alert_created',
        message: 'Unauthorized scan detected',
        alert: newAlert,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Alert POST Error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// ✅ PATCH: Resolve alert
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const updated = await Alert.findByIdAndUpdate(
      id,
      {
        status: 'resolved',
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Alert resolved: ${updated._id}`);

    return NextResponse.json({
      message: 'Alert resolved successfully',
      alert: updated,
    });
  } catch (error) {
    console.error('PATCH alert error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve alert' },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete alert
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deleted = await Alert.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    console.log(`🗑️ Deleted alert: ${deleted._id}`);

    return NextResponse.json({
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    console.error('DELETE alert error:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}