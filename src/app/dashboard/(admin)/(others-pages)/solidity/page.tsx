'use client';

import React, { useState, useEffect } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import FileUpload from "@/components/solidity/FileUpload";

interface UploadedFile {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  status: string;
}

export default function Ecommerce() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Fetch uploaded files list on component mount
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      setUploadedFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
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

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <FileUpload 
          onFileUploaded={handleFileUploaded}
          onStatusUpdate={handleStatusUpdate}
        />
        <RecentOrders uploadedFiles={uploadedFiles} />
      </div>
    </div>
  );
}
