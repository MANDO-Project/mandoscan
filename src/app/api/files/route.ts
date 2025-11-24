import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

    // Get pagination parameters from query string
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('page_size') || '50';

    // Get API base URL from environment variable
    const apiBaseUrl = process.env.SCAN_API_BASE_URL || 'https://5de91c29fdd0.ngrok-free.app';
    console.log('Using SCAN_API_BASE_URL:', apiBaseUrl);

    // Call external API to get files list
    const apiUrl = `${apiBaseUrl}/v1.0.0/vulnerability/detection/files?page=${page}&page_size=${pageSize}`;
    
    console.log('Fetching files from external API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('External API response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch files from API';
      let statusCode = response.status;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('External API error response:', errorData);
          errorMessage = errorData.error || errorData.message || errorData.detail || errorMessage;
        } else {
          const textResponse = await response.text();
          console.error('External API non-JSON response:', textResponse);
          errorMessage = `External API error (${response.status}): ${textResponse.substring(0, 200)}`;
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorMessage = `External API returned status ${response.status} ${response.statusText}`;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          apiUrl: apiUrl,
          statusCode: statusCode
        },
        { status: statusCode }
      );
    }

    let data;
    try {
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        return NextResponse.json(
          { error: `External API returned non-JSON response: ${textResponse.substring(0, 100)}` },
          { status: 500 }
        );
      }
      data = await response.json();
    } catch (parseError: any) {
      return NextResponse.json(
        { error: 'Failed to parse JSON response from external API', details: parseError.message },
        { status: 500 }
      );
    }
    
    // Transform the response to match the expected format
    // Assuming the API returns a list of files, we need to map them to our format
    const files = (data.files || data.items || data || []).map((file: any) => ({
      id: file.id || file.file_id,
      fileName: file.fileName || file.file_name || file.name,
      uploadDate: file.uploadDate || file.upload_date || file.created_at,
      fileSize: file.fileSize || file.file_size || file.size || 0,
      status: file.status || 'pending',
      estimatedCost: file.estimatedCost || file.estimated_cost,
      errorMessage: file.errorMessage || file.error_message,
    }));

    return NextResponse.json({ 
      files,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: data.total || files.length,
      }
    });
  } catch (error: any) {
    console.error('Error fetching files:', error);
    console.error('Error details:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    });
    
    // Check if it's a network error (external API not reachable)
    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return NextResponse.json(
        { 
          error: 'Cannot connect to external API. Please ensure the API server is running.',
          apiUrl: `${process.env.SCAN_API_BASE_URL || 'https://5de91c29fdd0.ngrok-free.app'}/v1.0.0/vulnerability/detection/files`,
          details: error.message
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch files', 
        details: error.message,
        errorType: error.constructor.name
      },
      { status: 500 }
    );
  }
}