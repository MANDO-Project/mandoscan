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
    const apiBaseUrl = process.env.NEXT_PUBLIC_SCAN_API_BASE_URL || 'https://5de91c29fdd0.ngrok-free.app';

    // First, get file metadata to retrieve the result_file_url
    const fileResponse = await fetch(`${apiBaseUrl}/v1.0.0/vulnerability/detection/files/${id}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!fileResponse.ok) {
      if (fileResponse.status === 404) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch file metadata' }, { status: fileResponse.status });
    }

    const fileData = await fileResponse.json();
    const fileStatus = fileData.status;

    console.log('File metadata:', { id, status: fileStatus });

    if (fileStatus !== 'scanned') {
      return NextResponse.json({ 
        error: 'Scan results not available yet. Please run scan first.',
        status: fileStatus 
      }, { status: 404 });
    }

    // Fetch the graph data through backend API (which has S3 access)
    console.log('Fetching graph from backend API');
    const graphResponse = await fetch(
      `${apiBaseUrl}/v1.0.0/vulnerability/detection/files/${id}/graph`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Graph response status:', graphResponse.status);
    
    if (!graphResponse.ok) {
      const errorText = await graphResponse.text();
      console.error('Graph fetch failed:', errorText);
      return NextResponse.json({ 
        error: 'Failed to fetch graph data',
        details: `Status: ${graphResponse.status}`,
      }, { status: graphResponse.status });
    }

    const graphData = await graphResponse.json();
    
    console.log('Graph data received:', Object.keys(graphData));
    
    // Return the graph data (backend already formats it correctly)
    return NextResponse.json(graphData);
  } catch (error: any) {
    console.error('Error fetching graph data:', error);
    
    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Cannot connect to external API' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to fetch graph data' }, { status: 500 });
  }
}