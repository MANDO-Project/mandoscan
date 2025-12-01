import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const { id } = await params;

    // Get API base URL from environment variable
    const apiBaseUrl = process.env.SCAN_API_BASE_URL || 'https://5de91c29fdd0.ngrok-free.app';

    // Fetch source code from external API
    const response = await fetch(`${apiBaseUrl}/v1.0.0/vulnerability/detection/files/${id}/source_code`, {
      method: 'GET',
      headers: {
        'accept': 'text/plain',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new NextResponse('Source code not found', { status: 404 });
      }
      
      return new NextResponse(`Failed to fetch source code: ${response.statusText}`, { 
        status: response.status 
      });
    }

    const sourceCode = await response.text();
    
    // Return plain text source code
    return new NextResponse(sourceCode, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error: any) {
    console.error('Error fetching source code:', error);
    
    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return new NextResponse('Cannot connect to external API', { status: 503 });
    }
    
    return new NextResponse('Failed to fetch source code', { status: 500 });
  }
}
