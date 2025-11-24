'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";

// Define the TypeScript interface for uploaded files
interface UploadedFile {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  status: string;
  estimatedCost?: number;
  errorMessage?: string;
}

// Define props interface
interface RecentOrdersProps {
  uploadedFiles?: UploadedFile[];
  onStatusUpdate?: (id: string, status: string) => void;
}

export default function RecentOrders({ uploadedFiles = [], onStatusUpdate }: RecentOrdersProps) {
  const router = useRouter();
  const auth = useAuth();
  const [scanning, setScanning] = React.useState<string | null>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get badge color based on status
  const getBadgeColor = (status: string): "success" | "warning" | "error" | "info" => {
    switch (status.toLowerCase()) {
      case 'scanned':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  // Handle scan action for pending files
  const handleScan = async (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setScanning(fileId);

    try {
      const token = auth.user?.access_token;
      if (!token) {
        alert('Authentication required. Please log in.');
        return;
      }

      const response = await fetch(`/api/file/${fileId}/scan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Scan completed successfully!');
        if (onStatusUpdate) {
          onStatusUpdate(fileId, 'scanned');
        }
      } else {
        alert(`Scan failed: ${data.error || 'Unknown error'}`);
        if (onStatusUpdate) {
          onStatusUpdate(fileId, 'failed');
        }
      }
    } catch (error) {
      console.error('Error scanning file:', error);
      alert('Error scanning file');
      if (onStatusUpdate) {
        onStatusUpdate(fileId, 'failed');
      }
    } finally {
      setScanning(null);
    }
  };

  // Handle viewing error logs for failed files
  const handleViewError = (errorMessage: string, event: React.MouseEvent) => {
    event.stopPropagation();
    alert(`Error details:\n\n${errorMessage || 'No error message available'}`);
  };

  // Handle row click to navigate to detail page (only for scanned files)
  const handleRowClick = (file: UploadedFile, event: React.MouseEvent) => {
    if (file.status.toLowerCase() === 'scanned') {
      event.preventDefault();
      console.log('Navigating to:', `/dashboard/solidity/${file.id}`);
      router.push(`/dashboard/solidity/${file.id}`);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Uploads
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                File name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Upload Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                File Size
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Cost
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {!uploadedFiles || uploadedFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No files uploaded yet
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              uploadedFiles.map((file) => (
                <TableRow 
                  key={file.id} 
                  className={`transition-colors ${
                    file.status.toLowerCase() === 'scanned' 
                      ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]' 
                      : ''
                  }`}
                  onClick={(e) => handleRowClick(file, e)}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          src="/images/icons/contract.svg"
                          className="h-[50px] w-[50px]"
                          alt={file.fileName}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {file.fileName}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          ID: {file.id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDate(file.uploadDate)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatFileSize(file.fileSize)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white">
                      ${file.estimatedCost?.toFixed(2) || '1.00'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={getBadgeColor(file.status)}>
                      {file.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {(file.status.toLowerCase() === 'pending' || file.status.toLowerCase() === 'uploaded') && (
                      <button
                        onClick={(e) => handleScan(file.id, e)}
                        disabled={scanning === file.id}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {scanning === file.id ? 'Scanning...' : 'Scan'}
                      </button>
                    )}
                    {file.status.toLowerCase() === 'scanned' && (
                      <button
                        onClick={(e) => handleRowClick(file, e)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03] transition-colors"
                      >
                        View Details
                      </button>
                    )}
                    {file.status.toLowerCase() === 'failed' && (
                      <button
                        onClick={(e) => handleViewError(file.errorMessage || 'No error message', e)}
                        className="px-4 py-2 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/10 transition-colors"
                      >
                        View Error
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
