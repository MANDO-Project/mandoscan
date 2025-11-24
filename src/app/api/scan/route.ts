/**
 * Example Protected API Endpoint
 * 
 * This demonstrates how to use API key authentication
 * in your API routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyApiKeyMiddleware } from "@/lib/middleware/apiAuth";

/**
 * POST /api/scan
 * Submit a smart contract for vulnerability scanning
 * 
 * Required Scopes: scan:write, ai:inference
 */
export async function POST(request: NextRequest) {
  // Verify API key with required scopes
  const auth = await verifyApiKeyMiddleware(request, [
    "scan:write",
    "ai:inference",
  ]);

  if (auth.error) {
    return auth.error;
  }

  const { apiKey } = auth;

  try {
    const body = await request.json();
    const { contract_code, contract_name, compiler_version } = body;

    // Validate request body
    if (!contract_code || !contract_name) {
      return NextResponse.json(
        { error: "Missing required fields: contract_code, contract_name" },
        { status: 400 }
      );
    }

    // TODO: Implement actual scanning logic
    // This is where you would:
    // 1. Save the contract to storage
    // 2. Queue it for processing
    // 3. Run AI analysis
    // 4. Return scan ID

    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return NextResponse.json(
      {
        scan_id: scanId,
        status: "processing",
        contract_name,
        compiler_version: compiler_version || "auto-detect",
        estimated_time: 30, // seconds
        userId: apiKey.userId,
        message: "Contract submitted for scanning",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error processing scan request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/scan
 * List all scans for the authenticated user
 * 
 * Required Scopes: scan:read
 */
export async function GET(request: NextRequest) {
  // Verify API key with required scopes
  const auth = await verifyApiKeyMiddleware(request, ["scan:read"]);

  if (auth.error) {
    return auth.error;
  }

  const { apiKey } = auth;

  try {
    // TODO: Implement actual data fetching from database
    // This is a mock response
    const scans = [
      {
        scan_id: "scan_1234567890_abc123",
        contract_name: "Example Contract",
        status: "completed",
        created_at: new Date().toISOString(),
        vulnerabilities_count: 3,
      },
    ];

    return NextResponse.json({
      scans,
      total: scans.length,
      userId: apiKey.userId,
    });
  } catch (error: any) {
    console.error("Error fetching scans:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
