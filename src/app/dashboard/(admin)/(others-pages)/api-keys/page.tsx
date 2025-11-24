"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import ApiKeyCard from "@/components/api-keys/ApiKeyCard";
import CreateApiKeyModal from "@/components/api-keys/CreateApiKeyModal";
import Button from "@/components/ui/button/Button";

export default function ApiKeysPage() {
  const auth = useAuth();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchApiKeys();
    }
  }, [auth.isAuthenticated]);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const token = auth.user?.access_token;
      const response = await fetch("/api/api-keys", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys || []);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApiKey = async (name: string, scopes: string[]) => {
    try {
      const token = auth.user?.access_token;
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, scopes }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys([...apiKeys, data.apiKey]);
        setIsCreateModalOpen(false);
        return data.apiKey;
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      throw error;
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      const token = auth.user?.access_token;
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== keyId));
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    try {
      const token = auth.user?.access_token;
      const response = await fetch(`/api/api-keys/${keyId}/revoke`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchApiKeys();
      }
    } catch (error) {
      console.error("Error revoking API key:", error);
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">
          Please sign in to manage API keys
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              API Keys
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your API keys for accessing Mandoscan AI services
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create API Key
          </Button>
        </div>

        {/* Info Banner */}
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-300">
                Keep your API keys secure
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-400">
                Your API keys provide access to our AI services. Keep them
                confidential and never share them publicly. If compromised,
                revoke them immediately.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No API keys
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first API key
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create API Key
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <ApiKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                onDelete={handleDeleteApiKey}
                onRevoke={handleRevokeApiKey}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateApiKey}
      />
    </div>
  );
}
