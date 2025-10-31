import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate unique ID for the upload using UUID4
    const uniqueId = randomUUID();

    const dataDir = path.join(process.cwd(), 'data', uniqueId);

    // Create directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(dataDir, file.name);
    await writeFile(filePath, buffer);

    // Save metadata
    const metadata = {
      id: uniqueId,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      fileSize: file.size,
      filePath: filePath,
    };

    const metadataPath = path.join(dataDir, 'metadata.json');
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ 
      success: true, 
      id: uniqueId,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}