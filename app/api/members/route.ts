// app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Member from '@/models/Member';

// ✅ GET: Fetch all members
export async function GET() {
  try {
    await dbConnect();
    const members = await Member.find({}).sort({ createdAt: -1 });

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error('GET members error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// ✅ POST: Add new member
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, memberId } = await request.json();

    if (!name || !email || !phone || !memberId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const newMember = await Member.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      memberId: memberId.trim().toUpperCase(),
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error: any) {
    console.error('POST member error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email or Member ID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove member
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Member deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE member error:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}