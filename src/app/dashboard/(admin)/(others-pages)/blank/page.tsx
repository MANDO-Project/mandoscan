'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CodeViewer from '@/components/ConsoleCode';
import Graph from '@/components/Graph';
import React, { useState, useEffect } from "react";

export default function BlankPage() {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [reportMessages, setReportMessages] = useState({});
  const [fineGrainedReport, setFineGrainedReport] = useState(null);
  const [hoveredLineNumber, setHoveredLineNumber] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [hoveredLinesFromGraph, setHoveredLinesFromGraph] = useState([]);
  const [scrollToLine, setScrollToLine] = useState(null);

  useEffect(() => {
    // Predefined list of Solidity files
    setFileNames(['contract_0.sol', 'Renora_DDCAAribitrum.sol', 'DAO.sol']);
  }, []);

  const handleFileChange = async (event) => {
    const fileName = event.target.value;
    const fileCore = fileName.substring(0, fileName.length - 4);
    setSelectedFile(fileName);

    // Fetch the source code of the selected file
    const response = await fetch(`/examples/${fileName}`);
    const reports = await fetch(`/examples/bug_report_${fileCore}.json`).then(reports => reports.json());
    setFineGrainedReport(reports['fine_grained']);
    const graph = await fetch(`/examples/graph_${fileCore}.json`).then(reports => reports.json());
    setGraphData(graph);
    
    // Loop the graph data and create the report with key is the line number and value is the message if the message is not empty
    let reportMessages = {};
    graph.nodes.forEach(node => {
      if (node.message && node.message !== '') {
        const lines = node.code_lines.split('-');
        if (lines.length === 1) {
          reportMessages[parseInt(lines[0], 10)] = node.message;
        } else if (lines.length === 2) {
          const start = parseInt(lines[0], 10);
          const end = parseInt(lines[1], 10);
          for (let i = start; i <= end; i++) {
            reportMessages[i] = node.message;
          }
        }
      }
    });

    setReportMessages(reportMessages);
    const code = await response.text();
    setSourceCode(code);
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Code Analysis" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-6">
          <select
            id="fileSelect"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            value={selectedFile}
            onChange={handleFileChange}
          >
            <option value="" disabled>-- Select a File --</option>
            {fileNames.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fineGrainedReport && sourceCode && (
            <CodeViewer 
              code={sourceCode} 
              fineGrainedReport={fineGrainedReport} 
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
