"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";

export default function ApiReferencePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    python: `import requests

API_KEY = "your_api_key_here"
BASE_URL = "https://api.mandoscan.io/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Submit a scan
response = requests.post(
    f"{BASE_URL}/scan",
    headers=headers,
    json={
        "contract_code": "pragma solidity ^0.8.0; ...",
        "contract_name": "MyContract",
        "compiler_version": "0.8.0"
    }
)

scan_id = response.json()["scan_id"]
print(f"Scan ID: {scan_id}")`,
    javascript: `const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.mandoscan.io/v1';

const headers = {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json'
};

async function scanContract() {
    const response = await axios.post(
        \`\${BASE_URL}/scan\`,
        {
            contract_code: 'pragma solidity ^0.8.0; ...',
            contract_name: 'MyContract',
            compiler_version: '0.8.0'
        },
        { headers }
    );
    
    console.log('Scan ID:', response.data.scan_id);
}`,
    curl: `curl -X POST https://api.mandoscan.io/v1/scan \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contract_code": "pragma solidity ^0.8.0; ...",
    "contract_name": "MyContract",
    "compiler_version": "0.8.0"
  }'`,
  };

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            API Reference
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Complete guide to integrating with Mandoscan AI services
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-800">
          {[
            { id: "overview", label: "Overview" },
            { id: "authentication", label: "Authentication" },
            { id: "endpoints", label: "Endpoints" },
            { id: "examples", label: "Code Examples" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-500 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                  Getting Started
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The Mandoscan API provides programmatic access to our AI-powered
                  smart contract vulnerability detection services. Use our API to
                  integrate security scanning into your development workflow.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                  Base URL
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    https://api.mandoscan.io/v1
                  </code>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>AI-powered vulnerability detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Comprehensive security reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Gas optimization suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>RESTful API design</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "authentication" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                  Authentication
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  All API requests require authentication using an API key. Include
                  your API key in the Authorization header of each request.
                </p>
              </div>

              <div>
                <h5 className="text-md font-semibold text-gray-800 dark:text-white/90 mb-2">
                  Header Format
                </h5>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> Keep your API key secure and never expose
                  it in client-side code or public repositories.
                </p>
              </div>

              <div>
                <h5 className="text-md font-semibold text-gray-800 dark:text-white/90 mb-2">
                  Get Your API Key
                </h5>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Generate your API key from the{" "}
                  <a
                    href="/dashboard/api-keys"
                    className="text-brand-500 hover:text-brand-600"
                  >
                    API Keys
                  </a>{" "}
                  page in your dashboard.
                </p>
              </div>
            </div>
          )}

          {activeTab === "endpoints" && (
            <div className="space-y-8">
              {/* Scan Endpoint */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded dark:bg-green-900/30 dark:text-green-400">
                    POST
                  </span>
                  <code className="text-lg font-mono text-gray-800 dark:text-gray-200">
                    /scan
                  </code>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Submit a smart contract for vulnerability scanning.
                </p>
                <div className="space-y-4">
                  <div>
                    <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Required Scopes
                    </h6>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                        scan:write
                      </span>
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                        ai:inference
                      </span>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Request Body
                    </h6>
                    <pre className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm">
                      <code>{`{
  "contract_code": "pragma solidity ^0.8.0; ...",
  "contract_name": "MyContract",
  "compiler_version": "0.8.0"
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Get Results Endpoint */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded dark:bg-blue-900/30 dark:text-blue-400">
                    GET
                  </span>
                  <code className="text-lg font-mono text-gray-800 dark:text-gray-200">
                    /scan/{"{scan_id}"}
                  </code>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Retrieve the results of a completed scan.
                </p>
                <div className="space-y-4">
                  <div>
                    <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Required Scopes
                    </h6>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                        scan:read
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "examples" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                  Code Examples
                </h4>
              </div>

              {/* Python Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                    Python
                  </h5>
                  <button
                    onClick={() => copyCode(codeExamples.python, "python")}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {copiedCode === "python" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.python}</code>
                </pre>
              </div>

              {/* JavaScript Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                    JavaScript (Node.js)
                  </h5>
                  <button
                    onClick={() => copyCode(codeExamples.javascript, "javascript")}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {copiedCode === "javascript" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.javascript}</code>
                </pre>
              </div>

              {/* cURL Example */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                    cURL
                  </h5>
                  <button
                    onClick={() => copyCode(codeExamples.curl, "curl")}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {copiedCode === "curl" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.curl}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
