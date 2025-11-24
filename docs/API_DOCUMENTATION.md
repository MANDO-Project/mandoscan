# Mandoscan API Documentation

## Authentication

All API requests require authentication using an API key. Include your API key in the request header:

```bash
Authorization: Bearer YOUR_API_KEY
```

## Getting Started

1. **Generate an API Key**: Navigate to the API Keys page in your dashboard and create a new key.
2. **Select Permissions**: Choose the appropriate scopes for your use case.
3. **Secure Your Key**: Store your API key securely and never commit it to version control.

## Base URL

```
https://api.mandoscan.io/v1
```

## Endpoints

### Scan a Smart Contract

Submit a smart contract for vulnerability analysis.

**Endpoint**: `POST /scan`

**Required Scopes**: `scan:write`, `ai:inference`

**Request Body**:
```json
{
  "contract_code": "pragma solidity ^0.8.0; contract MyContract { ... }",
  "contract_name": "MyContract",
  "compiler_version": "0.8.0"
}
```

**Response**:
```json
{
  "scan_id": "uuid",
  "status": "processing",
  "estimated_time": 30
}
```

### Get Scan Results

Retrieve the results of a completed scan.

**Endpoint**: `GET /scan/{scan_id}`

**Required Scopes**: `scan:read`

**Response**:
```json
{
  "scan_id": "uuid",
  "status": "completed",
  "vulnerabilities": [
    {
      "type": "Reentrancy",
      "severity": "High",
      "line": 42,
      "description": "Potential reentrancy vulnerability detected",
      "recommendation": "Use the checks-effects-interactions pattern"
    }
  ],
  "gas_optimization": [...],
  "best_practices": [...]
}
```

### Export Report

Export a vulnerability report in various formats.

**Endpoint**: `GET /scan/{scan_id}/report`

**Required Scopes**: `reports:read`, `reports:export`

**Query Parameters**:
- `format`: `json`, `pdf`, or `html`

## Rate Limits

| Plan | Requests per Minute | Daily Limit |
|------|-------------------|-------------|
| Free | 10 | 100 |
| Pro | 100 | 10,000 |
| Enterprise | Custom | Custom |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Insufficient permissions |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Code Examples

### Python

```python
import requests

API_KEY = "your_api_key_here"
BASE_URL = "https://api.mandoscan.io/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Submit a scan
contract_code = """
pragma solidity ^0.8.0;
contract MyContract {
    // Your contract code
}
"""

response = requests.post(
    f"{BASE_URL}/scan",
    headers=headers,
    json={
        "contract_code": contract_code,
        "contract_name": "MyContract",
        "compiler_version": "0.8.0"
    }
)

scan_id = response.json()["scan_id"]

# Get results
results = requests.get(
    f"{BASE_URL}/scan/{scan_id}",
    headers=headers
)

print(results.json())
```

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.mandoscan.io/v1';

const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
};

// Submit a scan
async function scanContract() {
    const response = await axios.post(
        `${BASE_URL}/scan`,
        {
            contract_code: 'pragma solidity ^0.8.0; contract MyContract { ... }',
            contract_name: 'MyContract',
            compiler_version: '0.8.0'
        },
        { headers }
    );
    
    const scanId = response.data.scan_id;
    
    // Get results
    const results = await axios.get(
        `${BASE_URL}/scan/${scanId}`,
        { headers }
    );
    
    console.log(results.data);
}

scanContract();
```

### cURL

```bash
# Submit a scan
curl -X POST https://api.mandoscan.io/v1/scan \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contract_code": "pragma solidity ^0.8.0; contract MyContract { ... }",
    "contract_name": "MyContract",
    "compiler_version": "0.8.0"
  }'

# Get results
curl -X GET https://api.mandoscan.io/v1/scan/{scan_id} \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Best Practices

1. **Keep Your API Key Secure**: Never expose your API key in client-side code or public repositories.
2. **Use Environment Variables**: Store API keys in environment variables, not in your codebase.
3. **Implement Error Handling**: Always handle potential errors and rate limits in your code.
4. **Monitor Usage**: Regularly check your API usage to avoid hitting rate limits.
5. **Revoke Compromised Keys**: If you suspect your API key has been compromised, revoke it immediately and generate a new one.

## Support

For API support and questions:
- Email: api-support@mandoscan.io
- Documentation: https://docs.mandoscan.io
- Discord: https://discord.gg/mandoscan
