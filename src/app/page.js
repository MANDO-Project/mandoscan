'use client';

import * as React from "react";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Select, SelectItem } from "@heroui/react";
import {Button, ButtonGroup} from "@heroui/button";


import Header from "./components/Header";
import Hero from "./components/Hero";
import DetectionForm from "./components/DetectionForm";
import VulnerabilityGrid from "./components/VulnerabilityGrid";
import CodeViewer from './components/ConsoleCode'
import Graph from './components/Graph'
import { c } from "react-syntax-highlighter/dist/esm/languages/hljs";
import { hover } from "framer-motion";
// import FileSelector from "./components/FileSelector";


export default function SmartContractVulnerability() {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [reportMessages, setReportMessages] = useState({});
  const [bugReport, setBugReport] = useState(null);
  const [coarseGrainedReport, setCoarseGrainedReport] = useState(null);
  const [fineGrainedReport, setFineGrainedReport] = useState(null);
  const [hoveredLineNumber, setHoveredLineNumber] = useState(null);

  const [highlightLines, setHighlightLines] = useState([2,3, 6]);
  const [graphData, setGraphData] = useState(null);
  const [hoveredLinesFromGraph, setHoveredLinesFromGraph] = useState([]);
  const [scrollToLine, setScrollToLine] = useState(null);

  useEffect(() => {
    // Predefined list of Solidity files
    setFileNames(['contract_0.sol', 'Renora_DDCAAribitrum.sol', 'DAO.sol']);
  }, []);
  const handleFileChange = async (event) => {
    const fileName = event.target.value;
    const fileCore = event.target.value.substring(0, fileName.length - 4)
    console.log(fileCore)
    setSelectedFile(fileName);
    // Fetch the source code of the selected file
    const response = await fetch(`/examples/${fileName}`);
    const reports = await fetch(`/examples/bug_report_${fileCore}.json`).then(reports => reports.json());
    setCoarseGrainedReport(reports['coarse_grained'])
    setFineGrainedReport(reports['fine_grained'])
    const graph = await fetch(`/examples/graph_${fileCore}.json`).then(reports => reports.json());
    setGraphData(graph)
    
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
    console.log(reportMessages);

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
    <main className="flex overflow-hidden min-h-screen flex-col pb-10 bg-slate-950">
      <Header />
      {/* <Image
        src="./top_background.svg"
        alt="Descriptive text for screen readers"
        width={500}
        height={300}
        layout="responsive"
      /> */}
      {/* <Hero /> */}
      <section
        className="flex justify-between items-center p-20 bg-gray-900 bg-opacity-70 max-md:px-5"
        aria-labelledby="detection-form-title"
      >
        <div className="flex flex-col items-center self-stretch py-10 my-auto min-w-[240px] w-[1280px]">
          <h1 className="text-4xl font-bold tracking-tight text-center text-white max-md:max-w-full mb-6">
            Smart Contract Vulnerability Detection
          </h1>
          <h2
            id="detection-form-title"
            className="text-2xl font-bold tracking-tight text-center text-white max-md:max-w-full mb-6"
          >
            Try examples
          </h2>
          {/* <DetectionForm /> */}

            <form>
              {/* <div className="flex relative gap-3 items-start w-full text-base">
                <label htmlFor="file-input" className="sr-only">
                  Attach file
                </label>
                <div className="flex z-0 flex-col flex-1 shrink w-full basis-8 min-w-[240px] text-zinc-400">
                  <div className="flex overflow-hidden gap-2.5 px-4 w-full bg-gray-100 rounded-xl border border-gray-100 border-solid min-h-[56px]">
                    <input
                      type="file"
                      id="file-input"
                      className="flex-1 shrink self-stretch bg-white bg-opacity-0 min-w-[240px] size-full text-ellipsis mt-3"
                      aria-label="Click to attaching a file"
                    />
                  </div>
                </div>
                <Button className="flex overflow-hidden absolute right-0 top-2/4 z-0 flex-col justify-center items-center px-4 h-14 font-bold text-center bg-blue-600 rounded-xl border border-solid -translate-y-2/4 border-zinc-200 min-h-[56px] min-w-[120px] text-white translate-x-[0%] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  tabIndex={0} color="primary">Attach File</Button>;
              </div> */}

              <div className="flex overflow-y-auto gap-2.5 px-4 w-full bg-white rounded-xl border border-gray-100 border-solid min-h-[56px] mt-3">
                <select
                  id="fileSelect"
                  className="flex-1 shrink self-stretch h-full text-base bg-black bg-opacity-0 min-w-[240px] text-ellipsis text-zinc-400"
                  value={selectedFile}
                  onChange={handleFileChange}
                  // placeholder='-- Select a File --'
                >
                  <option value="" disabled>-- Select a File --</option>
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
      
      {coarseGrainedReport && <VulnerabilityGrid coarseGrainedReports={coarseGrainedReport} />}
      

      {/* <button
        className="flex overflow-hidden flex-col justify-center items-center self-center px-4 mt-12 max-w-full text-base font-bold text-center text-blue-600 bg-white rounded-xl min-h-[56px] w-[300px] max-md:mt-10 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        tabIndex={0}
      >
        View Bugs Detail
      </button> */}
      <div className="grid grid-cols-2 gap-0">
        {fineGrainedReport && 
          <CodeViewer 
            code={sourceCode} 
            fineGrainedReport={fineGrainedReport} 
            reportMessages={reportMessages}
            onLineHover={handleLineHover}
            onLineLeave={handleLineLeave} 
            hoveredLinesFromGraph={hoveredLinesFromGraph}
            scrollToLine={scrollToLine}
          />
        }
        {graphData && 
          <Graph 
            graphData={graphData} 
            hoveredLineNumber={hoveredLineNumber}
            onNodeHover={handleNodeHover}
            onNodeLeave={handleNodeLeave}
            onNodeClick={handleNodeClick}
            />}
      </div>
    </main>
  );
}

// export default SmartContractVulnerability