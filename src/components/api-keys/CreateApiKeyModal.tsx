"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, scopes: string[]) => Promise<any>;
}

const availableScopes = [
  {
    id: "scan:read",
    name: "Scan: Read",
    description: "Read scan results and contract analysis",
  },
  {
    id: "scan:write",
    name: "Scan: Write",
    description: "Submit contracts for scanning",
  },
  {
    id: "ai:inference",
    name: "AI: Inference",
    description: "Access to AI inference services",
  },
  {
    id: "reports:read",
    name: "Reports: Read",
    description: "Read vulnerability reports",
  },
  {
    id: "reports:export",
    name: "Reports: Export",
    description: "Export reports in various formats",
  },
];

export default function CreateApiKeyModal({
  isOpen,
  onClose,
  onCreate,
}: CreateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "scan:read",
    "ai:inference",
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Please enter a name for your API key");
      return;
    }

    if (selectedScopes.length === 0) {
      setError("Please select at least one permission");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const result = await onCreate(name, selectedScopes);
      setCreatedKey(result.key);
    } catch (err: any) {
      setError(err.message || "Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setName("");
    setSelectedScopes(["scan:read", "ai:inference"]);
    setCreatedKey(null);
    setCopied(false);
    setError("");
    onClose();
  };

  const toggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((s) => s !== scopeId)
        : [...prev, scopeId]
    );
  };

  const copyToClipboard = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl m-4">
      <div className="relative w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        {!createdKey ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Create API Key
              </h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Generate a new API key to access Mandoscan AI services
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <Label>API Key Name</Label>
                <input
                  type="text"
                  placeholder="e.g., Production Server Key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Choose a descriptive name to identify where this key will be
                  used
                </p>
              </div>

              {/* Scopes Selection */}
              <div>
                <Label>Permissions</Label>
                <p className="mt-1 mb-3 text-xs text-gray-500 dark:text-gray-400">
                  Select the permissions for this API key
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {availableScopes.map((scope) => (
                    <div
                      key={scope.id}
                      className="flex items-start p-3 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => toggleScope(scope.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(scope.id)}
                        onChange={() => toggleScope(scope.id)}
                        className="mt-1 w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <div className="ml-3 flex-1">
                        <label className="text-sm font-medium text-gray-800 dark:text-white cursor-pointer">
                          {scope.name}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {scope.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button size="sm" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create API Key"
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success View */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h4 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                API Key Created Successfully
              </h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Make sure to copy your API key now. You won&apos;t be able to see
                it again!
              </p>

              {/* API Key Display */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <code className="block text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                  {createdKey}
                </code>
              </div>

              <Button
                onClick={copyToClipboard}
                className="mt-4 w-full"
                size="sm"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy to Clipboard
                  </>
                )}
              </Button>

              {/* Warning */}
              <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 text-left">
                    Keep this key secure and never share it publicly. If
                    compromised, revoke it immediately from your API keys page.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleClose}
                variant="outline"
                className="mt-6"
                size="sm"
              >
                Done
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
