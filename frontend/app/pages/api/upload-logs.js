// pages/api/upload-logs.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('logFile');

  // Forward the file to your backend API
  const backendResponse = await fetch('http://localhost:3000/api/upload-logs', {
    method: 'POST',
    body: formData,
  });
  const data = await backendResponse.json();

  return NextResponse.json(data);
}