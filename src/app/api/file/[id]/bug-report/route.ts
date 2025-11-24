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

    console.log('File metadata:', { id, resultFileUrl, status: fileData.status });

    if (!resultFileUrl) {
      return NextResponse.json({ error: 'Scan results not available yet. Please run scan first.' }, { status: 404 });
    }

    // Fetch the scan results from S3 URL
    console.log('Fetching scan results from S3:', resultFileUrl);
    const s3Response = await fetch(resultFileUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('S3 response status:', s3Response.status, s3Response.statusText);
    console.log('S3 response headers:', Object.fromEntries(s3Response.headers.entries()));
    
    if (!s3Response.ok) {
      const errorText = await s3Response.text();
      console.error('S3 fetch failed:', errorText);
      return NextResponse.json({ 
        error: 'Failed to fetch scan results from S3',
        details: `Status: ${s3Response.status}, URL: ${resultFileUrl}`,
        message: errorText.substring(0, 200)
      }, { status: s3Response.status });
    }

    const contentType = s3Response.headers.get('content-type');
    console.log('S3 content type:', contentType);
    
    let scanResults;
    try {
      const textResponse = await s3Response.text();
      console.log('S3 response preview:', textResponse.substring(0, 200));
      scanResults = JSON.parse(textResponse);
    } catch (parseError: any) {
      console.error('Failed to parse S3 response as JSON:', parseError);
      return NextResponse.json({ 
        error: 'Invalid scan results format',
        details: parseError.message
      }, { status: 500 });
    }
    
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