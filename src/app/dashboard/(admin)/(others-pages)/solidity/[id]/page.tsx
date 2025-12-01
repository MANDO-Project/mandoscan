'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CodeViewer from '@/components/ConsoleCode';
import Graph from '@/components/Graph';
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";

export default function SolidityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const fileId = params.id as string;

  const [sourceCode, setSourceCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [reportMessages, setReportMessages] = useState({});
  const [fineGrainedReport, setFineGrainedReport] = useState(null);
  const [coarseGrainedReport, setCoarseGrainedReport] = useState(null);
  const [hoveredLineNumber, setHoveredLineNumber] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [hoveredLinesFromGraph, setHoveredLinesFromGraph] = useState([]);
  const [scrollToLine, setScrollToLine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bug type names corresponding to coarse_grained array indices
  const bugTypes = [
    'Access Control',
    'Arithmetic',
    'Denial of Service',
    'Front Running',
    'Reentrancy',
    'Time Manipulation',
    'Unchecked Low Level Calls'
  ];

  useEffect(() => {
    if (fileId) {
      fetchFileData();
    }
  }, [fileId]);

  const fetchFileData = async () => {
    try {
      setLoading(true);
      
      const token = auth.user?.access_token;
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      
      // Fetch file metadata and content
      const response = await fetch(`/api/file/${fileId}`, { headers });
      if (!response.ok) {
        throw new Error('File not found');
      }
      
      const data = await response.json();
      setFileName(data.fileName);
      setSourceCode(data.content);

      // Fetch bug report
      try {
        const bugReportResponse = await fetch(`/api/file/${fileId}/bug-report`, { headers });
        if (bugReportResponse.ok) {
          const bugReport = await bugReportResponse.json();
          setFineGrainedReport(bugReport.fine_grained);
          setCoarseGrainedReport(bugReport.coarse_grained);
        }
      } catch (bugReportError) {
        console.warn('Bug report not available:', bugReportError);
      }

      // Fetch graph data
      try {
        const graphResponse = await fetch(`/api/file/${fileId}/graph`, { headers });
        if (graphResponse.ok) {
          const graph = await graphResponse.json();
          setGraphData(graph);

          // Process graph data for report messages
          if (graph && graph.nodes) {
            let reportMessages = {};
            graph.nodes.forEach(node => {
              if (node.message && node.message !== '' && Array.isArray(node.code_lines)) {
                node.code_lines.forEach(lineNumber => {
                  reportMessages[lineNumber] = node.message;
                });
              }
            });
            setReportMessages(reportMessages);
          }
        }
      } catch (graphError) {
        console.warn('Graph data not available:', graphError);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching file data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for synchronizing hover effects
  const handleLineHover = (lineNumber) => {
    setHoveredLineNumber(lineNumber);
  };

  const handleLineLeave = () => {
    setHoveredLineNumber(null);
  };

  const handleNodeHover = (lineNumber) => {
    setHoveredLinesFromGraph(prev => {
      const currentLines = Array.isArray(prev) ? prev : Array.from(prev);
      if (!currentLines.includes(lineNumber)) {
        return [...currentLines, lineNumber];
      }
      return currentLines;
    });
  };

  const handleNodeLeave = () => {
    setHoveredLinesFromGraph([]);
  };

  const handleNodeClick = (lineNumber) => {
    setScrollToLine(lineNumber);
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Code Analysis" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Code Analysis" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard/solidity')}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
            >
              Back to Files
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={`Code Analysis - ${fileName}`} />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{fileName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {fileId}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/solidity')}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Back to Files
          </button>
        </div>

        {/* Bug Type Indicators */}
        {coarseGrainedReport && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Detected Vulnerabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {coarseGrainedReport.map((hasVulnerability, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-lg font-medium text-white shadow-sm transition-all ${
                    hasVulnerability === 1
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      hasVulnerability === 1 ? 'bg-red-200' : 'bg-green-200'
                    }`}></span>
                    <span className="text-sm">{bugTypes[index]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {sourceCode && (
            <CodeViewer 
              code={sourceCode} 
              fineGrainedReport={fineGrainedReport || []} 
              reportMessages={reportMessages}
              onLineHover={handleLineHover}
              onLineLeave={handleLineLeave} 
              hoveredLinesFromGraph={hoveredLinesFromGraph}
              scrollToLine={scrollToLine}
            />
          )}
          {graphData && (
            <Graph 
              graphData={graphData} 
              hoveredLineNumber={hoveredLineNumber}
              onNodeHover={handleNodeHover}
              onNodeLeave={handleNodeLeave}
              onNodeClick={handleNodeClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}