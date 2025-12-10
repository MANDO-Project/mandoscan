import { NextRequest, NextResponse } from 'next/server';

// POST /api/file/[id]/scan - Trigger scan for a file
export async function POST(
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
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const { id } = await params;

    // Get API base URL from environment variable
    const apiBaseUrl = process.env.NEXT_PUBLIC_SCAN_API_BASE_URL || 'https://5de91c29fdd0.ngrok-free.app';

    // Trigger scan via external API
    const scanResponse = await fetch(
      `${apiBaseUrl}/v1.0.0/vulnerability/detection/scan`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: id,
          model_type: 'transformer'
        }),
      }
    );

    if (!scanResponse.ok) {
      let errorMessage = 'Scan failed';
      try {
        const contentType = scanResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await scanResponse.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        }
      } catch (parseError) {
        errorMessage = `Scan failed: ${scanResponse.status} ${scanResponse.statusText}`;
      }
      
      return NextResponse.json({ 
        success: false,
        status: 'failed',
        error: errorMessage,
      }, { status: scanResponse.status });
    }

    const scanData = await scanResponse.json();

    return NextResponse.json({ 
      success: true, 
      status: scanData.status || 'scanned',
      message: 'Scan completed successfully',
      file_id: scanData.file_id,
      file_name: scanData.file_name,
      result_file_url: scanData.result_file_url,
      scan_summary: scanData.scan_summary,
      data: scanData
    });
  } catch (error: any) {
    console.error('Error processing scan request:', error);
    
    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Cannot connect to external API' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
