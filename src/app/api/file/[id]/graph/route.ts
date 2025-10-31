import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
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
      return NextResponse.json({ error: 'Directory not found' }, { status: 404 });
    }

    // Read metadata to get filename
    const metadataPath = path.join(dataDir, 'metadata.json');
    if (!existsSync(metadataPath)) {
      return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
    }
    const metadata = JSON.parse(await readFile(metadataPath, 'utf-8'));

    // Get filename without extension
    const fileCore = metadata.fileName.substring(0, metadata.fileName.length - 4);

    // Look for graph file with pattern graph_[filename].json
    const graphFileName = `graph_${fileCore}.json`;
    const graphPath = path.join(dataDir, graphFileName);

    if (!existsSync(graphPath)) {
      return NextResponse.json({ error: 'Graph file not found' }, { status: 404 });
    }

    const graphData = JSON.parse(await readFile(graphPath, 'utf-8'));

    return NextResponse.json(graphData);
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return NextResponse.json({ error: 'Failed to fetch graph data' }, { status: 500 });
  }
}