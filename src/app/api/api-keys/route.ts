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

// Generate API key
function generateApiKey(): string {
  const prefix = "mds"; // Mandoscan prefix
  const random = crypto.randomBytes(32).toString("base64url");
  return `${prefix}_${random}`;
}

// GET: List all API keys for a user
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const user = await verifyToken(authHeader || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all keys for this user
  const userKeys = Array.from(apiKeysStore.values()).filter(
    (key) => key.userId === user.userId
  );

  // Don't return the full key, only show prefix
  const sanitizedKeys = userKeys.map((key) => ({
    ...key,
    key: key.prefix + "..." + key.key.slice(-8),
  }));

  return NextResponse.json({ apiKeys: sanitizedKeys });
}

// POST: Create a new API key
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const user = await verifyToken(authHeader || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, scopes } = body;

  if (!name || !scopes || scopes.length === 0) {
    return NextResponse.json(
      { error: "Name and scopes are required" },
      { status: 400 }
    );
  }

  const apiKey = generateApiKey();
  const keyId = crypto.randomBytes(16).toString("hex");

  const apiKeyData = {
    id: keyId,
    userId: user.userId,
    name,
    key: apiKey,
    prefix: apiKey.split("_")[0] + "_" + apiKey.substring(4, 16),
    scopes,
    createdAt: new Date().toISOString(),
    lastUsed: null,
    isRevoked: false,
  };

  apiKeysStore.set(keyId, apiKeyData);

  return NextResponse.json({ apiKey: apiKeyData }, { status: 201 });
}
