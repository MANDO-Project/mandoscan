# API Key System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COGNITO AUTHENTICATION                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  User signs in → Cognito returns JWT token                │  │
│  │  Token stored in browser via react-oidc-context           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React/Next.js)                    │
│  ┌──────────────────────┐      ┌──────────────────────────┐    │
│  │  API Keys Page       │      │  API Reference Page      │    │
│  │  /dashboard/api-keys │      │  /dashboard/api-reference│    │
│  └──────────────────────┘      └──────────────────────────┘    │
│           │                                                      │
│           ├─ Create API Key (Modal)                            │
│           ├─ List API Keys (Card View)                         │
│           ├─ Copy/Show/Hide Keys                               │
│           └─ Revoke/Delete Keys                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API ROUTES (Next.js)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  POST   /api/api-keys          → Create API Key          │  │
│  │  GET    /api/api-keys          → List User's Keys        │  │
│  │  DELETE /api/api-keys/[id]     → Delete Key              │  │
│  │  POST   /api/api-keys/[id]/revoke → Revoke Key           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Authorization: Bearer <JWT Token from Cognito>                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API KEY MANAGER (Utilities)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • generateApiKey()     → Create secure key              │  │
│  │  • hashApiKey()         → Hash for storage               │  │
│  │  • verifyApiKey()       → Validate incoming key          │  │
│  │  • createApiKey()       → Full creation logic            │  │
│  │  • getUserApiKeys()     → Fetch user's keys              │  │
│  │  • revokeApiKey()       → Mark as revoked                │  │
│  │  • deleteApiKey()       → Remove from storage            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        STORAGE LAYER                             │
│  ┌──────────────────┐              ┌──────────────────────┐    │
│  │  DEVELOPMENT     │              │  PRODUCTION          │    │
│  │  In-Memory Map   │    →→→→→→→   │  AWS DynamoDB        │    │
│  │  (Current)       │              │  (Ready to Deploy)   │    │
│  └──────────────────┘              └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL API USAGE                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Developer's Application                                  │  │
│  │  ↓                                                        │  │
│  │  HTTP Request to Mandoscan API                           │  │
│  │  Authorization: Bearer mds_xxxxxxxxxxxxx                 │  │
│  │  ↓                                                        │  │
│  │  API Middleware (apiAuth.ts)                             │  │
│  │  • Verify API Key                                        │  │
│  │  • Check Scopes                                          │  │
│  │  • Update Last Used                                      │  │
│  │  ↓                                                        │  │
│  │  Protected Endpoint (e.g., /api/scan)                    │  │
│  │  • Process Request                                       │  │
│  │  • Return Response                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

```
┌────────────────┐
│  User Browser  │
└───────┬────────┘
        │
        │ 1. User signs in
        ▼
┌────────────────────┐
│  Cognito OAuth     │
└───────┬────────────┘
        │
        │ 2. JWT Token returned
        ▼
┌──────────────────────────────────┐
│  React App (useAuth hook)        │
│  - Token stored in context       │
└───────┬──────────────────────────┘
        │
        │ 3. User navigates to /dashboard/api-keys
        ▼
┌──────────────────────────────────┐
│  API Keys Page Component         │
│  - Fetches user's keys           │
│  - Displays UI                   │
└───────┬──────────────────────────┘
        │
        │ 4. User clicks "Create API Key"
        ▼
┌──────────────────────────────────┐
│  CreateApiKeyModal               │
│  - Name input                    │
│  - Scope selection               │
└───────┬──────────────────────────┘
        │
        │ 5. POST /api/api-keys
        │    Authorization: Bearer <JWT>
        │    Body: {name, scopes}
        ▼
┌──────────────────────────────────┐
│  API Route Handler               │
│  1. Verify JWT token             │
│  2. Extract userId               │
│  3. Call apiKeyManager           │
└───────┬──────────────────────────┘
        │
        │ 6. generateApiKey()
        ▼
┌──────────────────────────────────┐
│  API Key Manager                 │
│  - Generate secure key           │
│  - Hash for storage              │
│  - Save to database              │
└───────┬──────────────────────────┘
        │
        │ 7. Return API key (plain text, only once!)
        ▼
┌──────────────────────────────────┐
│  CreateApiKeyModal (Success)     │
│  - Display key                   │
│  - Copy to clipboard button      │
│  - Security warning              │
└──────────────────────────────────┘
```

## API Key Usage Flow

```
┌─────────────────────┐
│  Developer App      │
└──────────┬──────────┘
           │
           │ HTTP Request
           │ Authorization: Bearer mds_xxxxx
           ▼
┌──────────────────────────────────┐
│  Mandoscan API Endpoint          │
│  (e.g., POST /api/scan)          │
└──────────┬───────────────────────┘
           │
           │ 1. Extract API key from header
           ▼
┌──────────────────────────────────┐
│  verifyApiKeyMiddleware          │
│  (lib/middleware/apiAuth.ts)     │
└──────────┬───────────────────────┘
           │
           │ 2. Hash the key
           │ 3. Look up in database
           ▼
┌──────────────────────────────────┐
│  API Key Manager                 │
│  - verifyApiKey()                │
└──────────┬───────────────────────┘
           │
           ├─ Key found & not revoked?
           │  YES → Continue
           │  NO  → 401 Unauthorized
           ▼
┌──────────────────────────────────┐
│  Check Scopes                    │
│  - hasRequiredScopes()           │
└──────────┬───────────────────────┘
           │
           ├─ Has required permissions?
           │  YES → Continue
           │  NO  → 403 Forbidden
           ▼
┌──────────────────────────────────┐
│  Update Last Used                │
│  - Mark key as recently used     │
└──────────┬───────────────────────┘
           │
           │ 4. Process request
           ▼
┌──────────────────────────────────┐
│  API Handler Logic               │
│  - Scan contract                 │
│  - Generate report               │
│  - Return response               │
└──────────┬───────────────────────┘
           │
           │ 5. JSON Response
           ▼
┌─────────────────────┐
│  Developer App      │
└─────────────────────┘
```

## Security Layers

```
┌────────────────────────────────────────────────┐
│  Layer 1: Transport Security                   │
│  • HTTPS/TLS encryption                        │
└────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────┐
│  Layer 2: Authentication                       │
│  • JWT token verification (Cognito)            │
│  • API key validation                          │
└────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────┐
│  Layer 3: Authorization                        │
│  • Scope-based permissions                     │
│  • User ownership validation                   │
└────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────┐
│  Layer 4: Storage Security                     │
│  • Keys hashed with SHA-256                    │
│  • Never store plain text keys                 │
└────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────┐
│  Layer 5: Access Control                       │
│  • Rate limiting (future)                      │
│  • IP restrictions (future)                    │
│  • Revocation system                           │
└────────────────────────────────────────────────┘
```

## Data Model

### API Key Object
```typescript
{
  id: string              // Unique identifier
  userId: string          // Cognito user ID
  name: string            // User-provided name
  key: string             // Plain text (only at creation)
  keyHash: string         // SHA-256 hash (for storage)
  prefix: string          // First 12 chars (for display)
  scopes: string[]        // Permission array
  createdAt: string       // ISO timestamp
  lastUsed: string|null   // ISO timestamp
  isRevoked: boolean      // Revocation status
}
```

### Available Scopes
```
scan:read       → Read scan results
scan:write      → Submit scans
ai:inference    → Use AI services
reports:read    → Access reports
reports:export  → Export reports
```

## Integration Points

### With Cognito
- Uses existing authentication
- JWT tokens for user identification
- Seamless user experience
- No additional login required

### With DynamoDB (Production)
- Persistent storage
- Fast lookups with GSI
- Scalable and reliable
- Pay-per-use pricing

### With Your Application
- RESTful API design
- Standard Bearer token auth
- Clear error messages
- Well-documented endpoints
