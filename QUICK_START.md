# Quick Start Guide - API Key System

## 🚀 Getting Started in 5 Minutes

### Step 1: Start Your Development Server

```bash
cd /Users/minh/Documents/2022/smart_contract/mando/builder_figma/mandoscan
npm run dev
```

### Step 2: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### Step 3: Sign In with Cognito

1. Click "Sign In" or navigate to the protected area
2. Use your Cognito credentials to authenticate
3. You'll be redirected to the dashboard

### Step 4: Generate Your First API Key

1. Click on **"API Keys"** in the sidebar
2. Click the **"Create API Key"** button
3. Enter a name (e.g., "Test Key")
4. Select permissions:
   - ✅ Scan: Read
   - ✅ AI: Inference
5. Click **"Create API Key"**
6. **Copy the key immediately** (you won't see it again!)

### Step 5: Test Your API Key

#### Using cURL:
```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "contract_code": "pragma solidity ^0.8.0; contract Test {}",
    "contract_name": "TestContract",
    "compiler_version": "0.8.0"
  }'
```

#### Using Python:
```python
import requests

API_KEY = "YOUR_API_KEY_HERE"
response = requests.post(
    "http://localhost:3000/api/scan",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    },
    json={
        "contract_code": "pragma solidity ^0.8.0; contract Test {}",
        "contract_name": "TestContract"
    }
)

print(response.json())
```

#### Using JavaScript:
```javascript
const apiKey = "YOUR_API_KEY_HERE";

fetch("http://localhost:3000/api/scan", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    contract_code: "pragma solidity ^0.8.0; contract Test {}",
    contract_name: "TestContract"
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## 📍 Important URLs

| Page | URL | Description |
|------|-----|-------------|
| API Keys Management | `/dashboard/api-keys` | Create, view, and manage API keys |
| API Reference | `/dashboard/api-reference` | Documentation and code examples |
| User Profile | `/dashboard/profile` | User settings |
| Home | `/` | Landing page |

## 🔑 Key Locations in the Code

### Frontend Components:
```
src/components/api-keys/
├── ApiKeyCard.tsx           # Displays individual API key
└── CreateApiKeyModal.tsx    # Modal for creating new keys
```

### Pages:
```
src/app/dashboard/(admin)/(others-pages)/
├── api-keys/page.tsx        # API keys management page
└── api-reference/page.tsx   # API documentation page
```

### API Routes:
```
src/app/api/
├── api-keys/
│   ├── route.ts            # GET (list) & POST (create)
│   └── [keyId]/
│       ├── route.ts        # DELETE
│       └── revoke/
│           └── route.ts    # POST (revoke)
└── scan/
    └── route.ts            # Example protected endpoint
```

### Utilities:
```
src/lib/
├── apiKeyManager.ts         # Core API key functions
└── middleware/
    └── apiAuth.ts          # Authentication middleware
```

## 🎯 Common Tasks

### Create a New API Key
1. Go to `/dashboard/api-keys`
2. Click "Create API Key"
3. Fill in details
4. Copy the key

### Revoke an API Key
1. Go to `/dashboard/api-keys`
2. Find the key you want to revoke
3. Click "Revoke Key"
4. Confirm the action

### Delete an API Key
1. Go to `/dashboard/api-keys`
2. Find the key you want to delete
3. Click the trash icon
4. Confirm the deletion

### View API Documentation
1. Go to `/dashboard/api-reference`
2. Browse through tabs:
   - Overview
   - Authentication
   - Endpoints
   - Code Examples

## 🛠️ Customization

### Add New Scopes
Edit `src/components/api-keys/CreateApiKeyModal.tsx`:

```typescript
const availableScopes = [
  {
    id: "your:scope",
    name: "Your Scope",
    description: "Description of your scope",
  },
  // ... existing scopes
];
```

### Change API Key Prefix
Edit `src/lib/apiKeyManager.ts`:

```typescript
export function generateApiKey(): string {
  const prefix = "your_prefix"; // Change this
  const random = crypto.randomBytes(32).toString("base64url");
  return `${prefix}_${random}`;
}
```

### Modify UI Colors
Edit the component classes in `ApiKeyCard.tsx` or `CreateApiKeyModal.tsx` to match your brand colors.

## 🐛 Troubleshooting

### "Cannot find module" Error
This is a TypeScript caching issue. Try:
```bash
# Stop the dev server (Ctrl+C)
# Delete Next.js cache
rm -rf .next
# Restart
npm run dev
```

### API Key Not Working
1. Check that the key is not revoked
2. Verify you're including it in the `Authorization` header
3. Make sure the format is: `Bearer YOUR_KEY`
4. Check that your key has the required scopes

### Can't See API Keys Page
1. Make sure you're signed in with Cognito
2. Check that the route exists in your sidebar
3. Verify the page file is in the correct location

## 📚 Documentation

For more detailed information, see:

- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Architecture Details**: `ARCHITECTURE.md`
- **API Keys Setup**: `API_KEYS_README.md`
- **API Documentation**: `docs/API_DOCUMENTATION.md`

## 💡 Pro Tips

1. **Use Environment Variables** for API keys in your applications
2. **Create Different Keys** for different environments (dev, staging, prod)
3. **Set Minimal Permissions** - only grant scopes that are needed
4. **Rotate Keys Regularly** - delete old keys and create new ones
5. **Monitor Usage** - check the "Last Used" date on your keys
6. **Keep Keys Secret** - never commit them to version control

## 🎉 You're All Set!

You now have a fully functional API key management system integrated with Cognito. Start building amazing applications with Mandoscan's AI-powered smart contract vulnerability detection!

Need help? Check the documentation or contact support.
