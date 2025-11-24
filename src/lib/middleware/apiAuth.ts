/**
 * API Authentication Middleware
 * 
 * This middleware verifies API keys for protected endpoints.
 * Use this to protect your API routes that require authentication.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, hasRequiredScopes } from "@/lib/apiKeyManager";

export interface AuthenticatedRequest extends NextRequest {
  apiKey?: {
    id: string;
    userId: string;
    scopes: string[];
  };
}

/**
 * Middleware to verify API key from request headers
 */
export async function verifyApiKeyMiddleware(
  request: NextRequest,
  requiredScopes: string[] = []
) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      ),
    };
  }

  const apiKey = authHeader.substring(7); // Remove "Bearer " prefix

  // Verify the API key
  const keyData = await verifyApiKey(apiKey);

  if (!keyData) {
    return {
      error: NextResponse.json(
        { error: "Invalid or revoked API key" },
        { status: 401 }
      ),
    };
  }

  // Check if the key has required scopes
  if (requiredScopes.length > 0 && !hasRequiredScopes(keyData, requiredScopes)) {
    return {
      error: NextResponse.json(
        {
          error: "Insufficient permissions",
          required: requiredScopes,
          provided: keyData.scopes,
        },
        { status: 403 }
      ),
    };
  }

  // Return authenticated key data
  return {
    apiKey: {
      id: keyData.id,
      userId: keyData.userId,
      scopes: keyData.scopes,
    },
  };
}

/**
 * Example usage in an API route:
 * 
 * ```typescript
 * import { NextRequest } from "next/server";
 * import { verifyApiKeyMiddleware } from "@/lib/middleware/apiAuth";
 * 
 * export async function POST(request: NextRequest) {
 *   // Verify API key with required scopes
 *   const auth = await verifyApiKeyMiddleware(request, ["scan:write", "ai:inference"]);
 *   
 *   if (auth.error) {
 *     return auth.error;
 *   }
 *   
 *   const { apiKey } = auth;
 *   
 *   // Process the request with authenticated user
 *   const body = await request.json();
 *   
 *   // Your API logic here
 *   return NextResponse.json({ 
 *     message: "Success",
 *     userId: apiKey.userId 
 *   });
 * }
 * ```
 */
