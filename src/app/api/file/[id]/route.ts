import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const dataDir = path.join(process.cwd(), 'data', id);

    // Check if directory exists
    if (!existsSync(dataDir)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read metadata
    const metadataPath = path.join(dataDir, 'metadata.json');
    if (!existsSync(metadataPath)) {
      return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
    }
    const metadata = JSON.parse(await readFile(metadataPath, 'utf-8'));

    // Read source file content
    const filePath = path.join(dataDir, metadata.fileName);
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Source file not found' }, { status: 404 });
    }
    const content = await readFile(filePath, 'utf-8');

    // Read scan results if available
    let scanData = null;
    const scanResultPath = path.join(dataDir, 'scan_results.json');
    if (existsSync(scanResultPath)) {
      scanData = JSON.parse(await readFile(scanResultPath, 'utf-8'));
    }

    return NextResponse.json({
      id: metadata.id,
      fileName: metadata.fileName,
      uploadDate: metadata.uploadDate,
      fileSize: metadata.fileSize,
      content,
      scanData,
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}