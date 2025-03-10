// pages/api/stats.js
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch stats from your backend API
  const backendResponse = await fetch('http://localhost:3000/api/stats');
  const data = await backendResponse.json();

  return NextResponse.json(data);
}