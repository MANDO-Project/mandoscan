'use client';

import React, { useState } from "react";
import { useAuth } from "react-oidc-context";

interface FileUploadProps {
  onFileUploaded: (file: {
    id: string;
    fileName: string;
    uploadDate: string;
    fileSize: number;
    status: string;
    estimatedCost: number;
  }) => void;
  onStatusUpdate: (id: string, status: string) => void;
}

export default function FileUpload({ onFileUploaded, onStatusUpdate }: FileUploadProps) {
  const auth = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file extension
    if (!file.name.endsWith('.sol')) {
      alert('Please upload a Solidity (.sol) file');
      return;
    }

    // Check authentication
    const token = auth.user?.access_token;
    if (!token) {
      alert('Please log in to upload files');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('estimated_cost', '1');

      // Upload file to backend API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const newFile = {
          id: data.id || data.file_id,
          fileName: data.file_name || data.fileName || file.name,
          uploadDate: data.upload_date || data.uploadDate || new Date().toISOString(),
          fileSize: data.file_size || data.fileSize || file.size,
          status: data.status || 'pending', // Default to 'pending' if status not provided
          estimatedCost: data.estimated_cost || data.estimatedCost || 1.0,
        };
        
        console.log('New file uploaded:', newFile); // Debug log
        
        // Notify parent component of successful upload
        onFileUploaded(newFile);
        
        alert('File uploaded successfully! Click "Scan" to start the analysis.');
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Upload Solidity Contract
      </h3>
      <div className="flex items-center gap-4">
        <label
          htmlFor="file-upload"
          className={`flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isUploading ? 'Uploading...' : 'Choose File'}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".sol"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Only .sol files are accepted
        </span>
      </div>
    </div>
  );
}