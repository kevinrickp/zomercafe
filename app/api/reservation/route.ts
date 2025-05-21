import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM reservations ORDER BY date DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/reservation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, date, time, guests, table } = body;

    const [result] = await db.query(
      'INSERT INTO reservations (name, date, time, guests, table) VALUES (?, ?, ?, ?, ?)',
      [name, date, time, guests, table]
    );

    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    console.error('POST /api/reservation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
