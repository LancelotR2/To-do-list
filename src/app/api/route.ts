import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Example response data
  const data = {
    message: 'Hello, this is a GET response!',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
