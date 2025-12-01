'use client';

import React, { useState, useEffect } from "react";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import FileUpload from "@/components/solidity/FileUpload";
import { useAuth } from "react-oidc-context";

interface UploadedFile {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  status: string;
  estimatedCost?: number;
  errorMessage?: string;
}

export default function Ecommerce() {
  const auth = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch uploaded files list on component mount
  useEffect(() => {
    if (!mounted || auth.isLoading) {
      return; // Wait for client mount and auth to load
    }
    
    if (auth.user?.access_token) {
      fetchUploadedFiles();
    } else if (!auth.isAuthenticated) {
      setLoading(false);
      setError('Please log in to view files');
    }
  }, [mounted, auth.user?.access_token, auth.isLoading, auth.isAuthenticated]);

  const fetchUploadedFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = auth.user?.access_token;
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/files?page=1&page_size=50', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch files';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUploadedFiles(data.files || []);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      setError(error.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (newFile: UploadedFile) => {
    setUploadedFiles(prev => [newFile, ...prev]);
  };

  const handleStatusUpdate = (id: string, status: string) => {
    setUploadedFiles(prev =>
      prev.map(file =>
        file.id === id ? { ...file, status } : file
      )
    );
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && uploadedFiles.length === 0) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400">Loading files...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && uploadedFiles.length === 0) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchUploadedFiles}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
      </div> */}

      <div className="col-span-12 xl:col-span-7">
        <FileUpload 
          onFileUploaded={handleFileUploaded}
          onStatusUpdate={handleStatusUpdate}
        />
        <RecentOrders 
          uploadedFiles={uploadedFiles}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
}
