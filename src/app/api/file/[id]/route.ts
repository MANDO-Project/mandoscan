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

    // Fetch file details from external API
    const response = await fetch(`${apiBaseUrl}/v1.0.0/vulnerability/detection/files/${id}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      let errorMessage = 'Failed to fetch file details';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        }
      } catch (parseError) {
        errorMessage = `External API error: ${response.status} ${response.statusText}`;
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    
    // Transform response to expected format
    return NextResponse.json({
      id: data.id || data.file_id || id,
      fileName: data.fileName || data.file_name || data.name,
      uploadDate: data.uploadDate || data.upload_date || data.created_at,
      fileSize: data.fileSize || data.file_size || data.size || 0,
      content: data.content || data.source_code || data.code,
      scanData: data.scanData || data.scan_results || data.results,
      status: data.status,
      result_file_url: data.result_file_url,
    });
  } catch (error: any) {
    console.error('Error fetching file:', error);
    
    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Cannot connect to external API' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}