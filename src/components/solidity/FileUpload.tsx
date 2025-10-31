'use client';

import React, { useState } from "react";

interface FileUploadProps {
  onFileUploaded: (file: {
    id: string;
    fileName: string;
    uploadDate: string;
    fileSize: number;
    status: string;
  }) => void;
  onStatusUpdate: (id: string, status: string) => void;
}

export default function FileUpload({ onFileUploaded, onStatusUpdate }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Convert file content to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:*/*;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file extension
    if (!file.name.endsWith('.sol')) {
      alert('Please upload a Solidity (.sol) file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to local storage
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const newFile = {
          id: data.id,
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          fileSize: file.size,
          status: 'Uploaded',
        };
        
        // Notify parent component of successful upload
        onFileUploaded(newFile);

        // Convert file content to base64
        const base64Content = await fileToBase64(file);

        // Call REST API for scanning
        try {
          // TODO: Update API_URL and headers as needed
          const scanResponse = await fetch('http://localhost:5555/v1.0.0/vulnerability/detection/nodetype?model_type=transformer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'key': 'MqQVfJ6Fq1umZnUI7ZuaycciCjxi3gM0'
            },
            body: JSON.stringify({
              contract_name: file.name,
              ID: data.id,
              smart_contract: base64Content,
            }),
          });

          const scanData = await scanResponse.json();

          if (scanResponse.ok) {
            // Update status to 'Scanned'
            onStatusUpdate(data.id, 'Scanned');
          } else {
            console.error('Scan failed:', scanData);
            onStatusUpdate(data.id, 'Scan Failed');
          }
        } catch (scanError) {
          console.error('Error calling scan API:', scanError);
          onStatusUpdate(data.id, 'Scan Failed');
        }
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
          {isUploading ? 'Uploading & Scanning...' : 'Choose File'}
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