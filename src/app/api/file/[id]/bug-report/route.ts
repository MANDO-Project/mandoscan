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

    // Look for bug report file with pattern bug_report_[filename].json
    const bugReportFileName = `bug_report_${fileCore}.json`;
    const bugReportPath = path.join(dataDir, bugReportFileName);

    if (!existsSync(bugReportPath)) {
      return NextResponse.json({ error: 'Bug report file not found' }, { status: 404 });
    }

    const bugReportData = JSON.parse(await readFile(bugReportPath, 'utf-8'));

    return NextResponse.json(bugReportData);
  } catch (error) {
    console.error('Error fetching bug report data:', error);
    return NextResponse.json({ error: 'Failed to fetch bug report data' }, { status: 500 });
  }
}