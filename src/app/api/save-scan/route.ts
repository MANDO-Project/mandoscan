import { NextRequest, NextResponse } from 'next/server';

// This route is deprecated - scan results are now saved directly by the external API
// Keeping it for backward compatibility but it just returns success
export async function POST(request: NextRequest) {
  try {
    const { id, scanData } = await request.json();

    if (!id || !scanData) {
      return NextResponse.json({ error: 'Missing id or scanData' }, { status: 400 });
    }

    // Scan results are automatically saved by the external API
    // This endpoint is kept for backward compatibility
    return NextResponse.json({ 
      success: true, 
      message: 'Scan results are managed by external API',
      deprecated: true
    });
  } catch (error) {
    console.error('Save scan error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}