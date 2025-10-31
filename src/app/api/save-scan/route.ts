import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { id, scanData } = await request.json();

    if (!id || !scanData) {
      return NextResponse.json({ error: 'Missing id or scanData' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data', id);

    // Check if directory exists
    if (!existsSync(dataDir)) {
      return NextResponse.json({ error: 'Directory not found' }, { status: 404 });
    }

    // Read metadata to get filename
    const metadataPath = path.join(dataDir, 'metadata.json');
    const metadata = JSON.parse(await readFile(metadataPath, 'utf-8'));
    const fileCore = metadata.fileName.substring(0, metadata.fileName.length - 4);

    // Save scan results to JSON file
    const scanResultPath = path.join(dataDir, 'scan_results.json');
    await writeFile(scanResultPath, JSON.stringify(scanData, null, 2));

    // Save graph data separately if it exists in scanData
    if (scanData.graph) {
      const graphPath = path.join(dataDir, `graph_${fileCore}.json`);
      await writeFile(graphPath, JSON.stringify(scanData.graph, null, 2));
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Scan results saved successfully',
      filePath: scanResultPath
    });
  } catch (error) {
    console.error('Save scan error:', error);
    return NextResponse.json({ error: 'Failed to save scan results' }, { status: 500 });
  }
}