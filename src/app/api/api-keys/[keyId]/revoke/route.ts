import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory storage for demonstration. In production, use a database.
const apiKeysStore = new Map<string, any>();

// Verify JWT token from Cognito
async function verifyToken(token: string) {
  // In production, verify the JWT token with Cognito
  // For now, we'll do basic validation
  if (!token || !token.startsWith("Bearer ")) {
    return null;
  }
  
  // Extract user info from token (in production, decode and verify JWT)
  return {
    userId: "user-" + crypto.randomBytes(8).toString("hex"),
    email: "user@example.com",
  };
}

// POST: Revoke an API key
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> }
) {
  const authHeader = request.headers.get("authorization");
  const user = await verifyToken(authHeader || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keyId } = await params;
  const apiKey = apiKeysStore.get(keyId);

  if (!apiKey) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  if (apiKey.userId !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  apiKey.isRevoked = true;
  apiKeysStore.set(keyId, apiKey);

  return NextResponse.json({ message: "API key revoked successfully" });
}
