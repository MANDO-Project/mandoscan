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
    const resultFileUrl = fileData.result_file_url;

    if (!resultFileUrl) {
      return NextResponse.json({ error: 'Scan results not available yet' }, { status: 404 });
    }

    // Fetch the scan results from S3 URL
    const s3Response = await fetch(resultFileUrl);
    
    if (!s3Response.ok) {
      return NextResponse.json({ error: 'Failed to fetch scan results from S3' }, { status: s3Response.status });
    }

    const scanResults = await s3Response.json();
    
    // Extract bug report data from scan results
    const bugReport = {
      fine_grained: scanResults.fine_grained || scanResults.vulnerabilities || [],
      coarse_grained: scanResults.coarse_grained || scanResults.summary || [],
    };
    
    return NextResponse.json(bugReport);
  } catch (error: any) {
    console.error('Error fetching bug report data:', error);
    
    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Cannot connect to external API' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to fetch bug report data' }, { status: 500 });
  }
}