'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import VulnerabilityGrid from './components/VulnerabilityGrid';
import CodeViewer from './components/ConsoleCode';
import Graph from './components/Graph';

export default function SmartContractVulnerability() {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [reportMessages, setReportMessages] = useState({});
  const [bugReport, setBugReport] = useState(null);
  const [coarseGrainedReport, setCoarseGrainedReport] = useState(null);
  const [fineGrainedReport, setFineGrainedReport] = useState(null);
  const [hoveredLineNumber, setHoveredLineNumber] = useState(null);

  const [highlightLines, setHighlightLines] = useState([2, 3, 6]);
  const [graphData, setGraphData] = useState(null);
  const [hoveredLinesFromGraph, setHoveredLinesFromGraph] = useState([]);
  const [scrollToLine, setScrollToLine] = useState(null);

  useEffect(() => {
    // Predefined list of Solidity files
    setFileNames(['contract_0.sol', 'Renora_DDCAAribitrum.sol', 'DAO.sol']);
  }, []);
  const handleFileChange = async (event) => {
    const fileName = event.target.value;
    const fileCore = event.target.value.substring(0, fileName.length - 4);
    setSelectedFile(fileName);
    // Fetch the source code of the selected file
    const response = await fetch(`/examples/${fileName}`);
    const reports = await fetch(`/examples/bug_report_${fileCore}.json`).then(
      (reports) => reports.json()
    );
    setCoarseGrainedReport(reports['coarse_grained']);
    setFineGrainedReport(reports['fine_grained']);
    const graph = await fetch(`/examples/graph_${fileCore}.json`).then(
      (reports) => reports.json()
    );
    setGraphData(graph);

    // Loop the graph data and create the report with key is the line number and value is the message if the message is not empty
    let reportMessages = {};
    graph.nodes.forEach((node) => {
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
    setHoveredLinesFromGraph((prev) => {
      // Convert to array if it's a Set
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
    <main className="flex min-h-screen flex-col overflow-hidden bg-slate-950 pb-10">
      <Header />
      <section
        className="flex items-center justify-between bg-gray-900 bg-opacity-70 p-20 max-md:px-5"
        aria-labelledby="detection-form-title"
      >
        <div className="flex w-[1280px] min-w-[240px] flex-col items-center self-stretch py-10">
          <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-white max-md:max-w-full">
            Smart Contract Vulnerability Detection
          </h1>
          <h2
            id="detection-form-title"
            className="mb-6 text-center text-2xl font-bold tracking-tight text-white max-md:max-w-full"
          >
            Try examples
          </h2>

          <form>
            <div className="mt-3 flex min-h-[56px] w-full gap-2.5 overflow-y-auto rounded-xl border border-solid border-gray-100 bg-white px-4">
              <select
                id="fileSelect"
                className="h-full min-w-[240px] flex-1 shrink self-stretch text-ellipsis bg-black bg-opacity-0 text-base text-zinc-400"
                value={selectedFile}
                onChange={handleFileChange}
              >
                <option value="" disabled>
                  -- Select a File --
                </option>
                {fileNames.map((file) => (
                  <option key={file} value={file}>
                    {file}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </section>

      {coarseGrainedReport && (
        <VulnerabilityGrid coarseGrainedReports={coarseGrainedReport} />
      )}

      <div className="grid grid-cols-2 gap-0">
        {fineGrainedReport && (
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
    </main>
  );
}
