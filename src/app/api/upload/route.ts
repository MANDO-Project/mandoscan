import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const estimatedCost = formData.get('estimated_cost') || '1';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Get API base URL from environment variable
    const apiBaseUrl = process.env.SCAN_API_BASE_URL || 'https://5de91c29fdd0.ngrok-free.app';

    // Create new FormData to send to external API
    const externalFormData = new FormData();
    externalFormData.append('file', file);
    externalFormData.append('estimated_cost', estimatedCost.toString());

    // Upload file to external API using direct upload endpoint
    const response = await fetch(`${apiBaseUrl}/v1.0.0/vulnerability/detection/upload/direct`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: externalFormData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        }
      } catch (parseError) {
        errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      id: data.id || data.file_id,
      file_id: data.id || data.file_id,
      fileName: data.fileName || data.file_name || file.name,
      file_name: data.file_name || data.fileName || file.name,
      uploadDate: data.uploadDate || data.upload_date || new Date().toISOString(),
      upload_date: data.upload_date || data.uploadDate || new Date().toISOString(),
      fileSize: data.fileSize || data.file_size || file.size,
      file_size: data.file_size || data.fileSize || file.size,
      status: data.status || 'pending',
      estimatedCost: data.estimatedCost || data.estimated_cost || 1.0,
      estimated_cost: data.estimated_cost || data.estimatedCost || 1.0,
      message: 'File uploaded successfully' 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Cannot connect to external API' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}