# API Key Management System

This implementation provides a complete API key management system for Mandoscan, integrated with AWS Cognito authentication.

## Features

✅ **Secure API Key Generation**: Cryptographically secure key generation with `mds_` prefix
✅ **Cognito Integration**: Seamlessly works with existing Cognito authentication
✅ **Permission Scopes**: Fine-grained access control with customizable scopes
✅ **Key Management**: Create, view, revoke, and delete API keys
✅ **User-Friendly UI**: Similar to OpenAI/Gemini API key interfaces
✅ **Security Best Practices**: Keys are hashed before storage, only shown once at creation
✅ **Production Ready**: Includes DynamoDB setup for scalable production deployment

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── api-keys/
│   │       ├── route.ts                    # List & create API keys
│   │       └── [keyId]/
│   │           ├── route.ts                # Delete API key
│   │           └── revoke/
│   │               └── route.ts            # Revoke API key
│   └── dashboard/
│       └── (admin)/
│           └── (others-pages)/
│               └── api-keys/
│                   └── page.tsx            # API Keys management page
├── components/
│   └── api-keys/
│       ├── ApiKeyCard.tsx                  # Individual key display component
│       └── CreateApiKeyModal.tsx           # Modal for creating new keys
├── lib/
│   └── apiKeyManager.ts                    # Utility functions for production
└── layout/
    └── AppSidebar.tsx                      # Updated with API Keys link

docs/
└── API_DOCUMENTATION.md                    # API usage documentation
```

## Current Implementation (Development)

The current implementation uses in-memory storage for development and testing. This is suitable for:
- Local development
- Testing
- Demonstration purposes

**Note**: In-memory storage means API keys will be lost when the server restarts.

## Production Setup

For production deployment, follow these steps:

### 1. Set Up DynamoDB

Create a DynamoDB table with the following configuration:

```bash
aws dynamodb create-table \
  --table-name mandoscan-api-keys \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=keyHash,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"UserIdIndex\",
        \"KeySchema\": [{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],
        \"Projection\": {\"ProjectionType\":\"ALL\"},
        \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
      },
      {
        \"IndexName\": \"KeyHashIndex\",
        \"KeySchema\": [{\"AttributeName\":\"keyHash\",\"KeyType\":\"HASH\"}],
        \"Projection\": {\"ProjectionType\":\"ALL\"},
        \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
      }
    ]" \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### 2. Install AWS SDK

```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

### 3. Configure Environment Variables

Add to your `.env.local`:

```env
# AWS Configuration
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DYNAMODB_TABLE_NAME=mandoscan-api-keys

# Cognito Configuration (already present)
NEXT_PUBLIC_COGNITO_AUTHORITY=your-cognito-authority
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_REDIRECT_URI=your-redirect-uri
```

### 4. Update API Routes

Replace the in-memory storage in the API routes with the functions from `src/lib/apiKeyManager.ts`.

Example for `src/app/api/api-keys/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createApiKey, getUserApiKeys } from "@/lib/apiKeyManager";
import { verifyToken } from "@/lib/auth"; // Implement proper JWT verification

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const user = await verifyToken(authHeader || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKeys = await getUserApiKeys(user.userId);
  return NextResponse.json({ apiKeys });
}

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

  const apiKey = await createApiKey(user.userId, name, scopes);
  return NextResponse.json({ apiKey }, { status: 201 });
}
```

### 5. Implement JWT Verification

Create `src/lib/auth.ts` to properly verify Cognito JWT tokens:

```typescript
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
});

export async function verifyToken(authHeader: string) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verifier.verify(token);
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
```

Install the JWT verifier:
```bash
npm install aws-jwt-verify
```

## Available Scopes

The system supports the following permission scopes:

- `scan:read` - Read scan results and contract analysis
- `scan:write` - Submit contracts for scanning
- `ai:inference` - Access to AI inference services
- `reports:read` - Read vulnerability reports
- `reports:export` - Export reports in various formats

You can customize these scopes in `src/components/api-keys/CreateApiKeyModal.tsx`.

## Security Features

1. **API Key Format**: `mds_` prefix followed by secure random string
2. **Hashing**: Keys are hashed with SHA-256 before storage
3. **One-time Display**: Full key is only shown once during creation
4. **Masking**: Keys are partially masked in the UI
5. **Revocation**: Keys can be revoked without deletion for audit purposes
6. **Scoped Permissions**: Fine-grained access control
7. **Cognito Integration**: Leverages existing authentication system

## Usage

### For Users

1. Navigate to **Dashboard > API Keys**
2. Click **Create API Key**
3. Enter a descriptive name
4. Select required permissions
5. Copy the generated key (only shown once!)
6. Use the key in your API requests

### For Developers

Include the API key in your requests:

```bash
curl -X POST https://api.mandoscan.io/v1/scan \
  -H "Authorization: Bearer mds_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"contract_code": "...", "contract_name": "MyContract"}'
```

## Testing

To test the implementation locally:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboard/api-keys`

3. Sign in with your Cognito credentials

4. Create and manage API keys

## Future Enhancements

- [ ] Rate limiting per API key
- [ ] Usage analytics and monitoring
- [ ] API key expiration dates
- [ ] IP whitelist/blacklist
- [ ] Webhook support for key events
- [ ] API key rotation automation
- [ ] Team/organization-level keys
- [ ] Audit logs for all key operations

## Support

For questions or issues related to the API key system:
- Check the [API Documentation](../docs/API_DOCUMENTATION.md)
- Contact: support@mandoscan.io

## License

This implementation is part of the Mandoscan project.
