// 📁 app/api/issues/route.ts
// ✅ Your new Issues API route (exactly styled like your books/route.ts)

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';

// ✅ GET: Fetch all issues (for your IssueReturnPage)
export async function GET() {
  try {
    await dbConnect();
    const issues = await Issue.find({}).sort({ issueDate: -1 });

    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    console.error('GET issues error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

// ✅ POST: Issue a new book (updated fields as you requested)
export async function POST(request: NextRequest) {
  try {
    const {
      bookName,
      author,
      rfid,
      studentName,
      enrollmentNumber,
      branch,
      year,
    } = await request.json();

    if (
      !bookName ||
      !author ||
      !rfid ||
      !studentName ||
      !enrollmentNumber ||
      !branch ||
      !year
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Prevent issuing the same book twice without returning
    const existingActiveIssue = await Issue.findOne({
      rfid: rfid.trim(),
      returnDate: null,
    });

    if (existingActiveIssue) {
      return NextResponse.json(
        { error: 'Book is already issued' },
        { status: 409 }
      );
    }

    const newIssue = await Issue.create({
      bookName: bookName.trim(),
      author: author.trim(),
      rfid: rfid.trim(),
      studentName: studentName.trim(),
      enrollmentNumber: enrollmentNumber.trim(),
      branch: branch.trim(),
      year: year.trim(),
      issueDate: new Date(),
      returnDate: null,
      status: 'issued',
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error: any) {
    console.error('POST issue error:', error);
    return NextResponse.json(
      { error: 'Failed to issue book' },
      { status: 500 }
    );
  }
}

// ✅ PATCH: Mark book as returned (used by your "Mark as Returned" button)
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Issue ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      {
        returnDate: new Date(),
        status: 'returned',
      },
      { new: true }
    );

    if (!updatedIssue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Book returned successfully', issue: updatedIssue },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH return error:', error);
    return NextResponse.json(
      { error: 'Failed to return book' },
      { status: 500 }
    );
  }
}

// ✅ PUT: Check issue status by RFID (ESP32 hardware)
//     → Same logic as your Book RFID check
//     → Green light if currently issued, Red light if not issued
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

    const activeIssue = await Issue.findOne({
      rfid: uid,
      returnDate: null,     // only active (not returned) issues
    });

    if (activeIssue) {
      return NextResponse.json(
        { status: 'issued' },          // ✅ Green light on hardware
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: 'not_issued' },      // ❌ Red light on hardware
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Issue RFID check error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}