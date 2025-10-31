import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');

    // Check if data directory exists
    if (!existsSync(dataDir)) {
      return NextResponse.json({ files: [] });
    }

    // Read all subdirectories
    const directories = await readdir(dataDir, { withFileTypes: true });
    const files = [];

    for (const dir of directories) {
      if (dir.isDirectory()) {
        const metadataPath = path.join(dataDir, dir.name, 'metadata.json');
        if (existsSync(metadataPath)) {
          const metadata = JSON.parse(await readFile(metadataPath, 'utf-8'));
          files.push({
            ...metadata,
            status: 'Uploaded',
          });
        }
      }
    }

    // Sort by upload date (newest first)
    files.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}