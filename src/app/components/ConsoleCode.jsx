'use client';

import * as React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solidity } from 'react-syntax-highlighter/dist/esm/languages/hljs';
import {coy} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeViewer = ({ 
  code,
  fineGrainedReport = [],
  reportMessages = {},
  onLineHover = () => {},
  onLineLeave = () => {},
  hoveredLinesFromGraph = []
}) => {

  const [hoveredLine, setHoveredLine] = React.useState(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef(null);

  const handleMouseMove = (event) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top + 40
      });
    }
  };

  const handleLineHover = (lineNumber) => {
    setHoveredLine(lineNumber);
    onLineHover(lineNumber); // Notify parent component
  };

  const handleLineLeave = () => {
    setHoveredLine(null);
    onLineLeave(); // Notify parent component
  };

  const getMessageForLine = (lineNumber) => {
    // If reportMessages prop is provided, use it. Otherwise, use default message.
    const message = reportMessages[lineNumber] || `Issue detected on line ${lineNumber}`;
    const lines = message.split('\n').filter(line => line.trim());
    return lines;
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col h-screen bg-gray-200 p-5 mt-6 border-blue-700 border-[3px] rounded-xl"
      onMouseMove={handleMouseMove}
    >
      <style jsx global>{`
        @keyframes highlight-pulse {
          0% { background-color: rgba(255, 165, 0, 0.2); }
          50% { background-color: rgba(255, 165, 0, 0.5); }
          100% { background-color: rgba(255, 165, 0, 0.2); }
        }
        .highlight-from-graph {
          animation: highlight-pulse 1.5s ease-in-out infinite;
          background-color: rgba(255, 165, 0, 0.2);
          border-radius: 4px;
          margin: -2px;
          padding: 2px;
        }
      `}</style>
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Smart contract</h1>
      
      <div className="relative flex-1 overflow-auto">
        <SyntaxHighlighter
          language="solidity"
          style={coy}
          showLineNumbers={true}
          wrapLongLines={true}
          lineProps={(lineNumber) => {
            const style = { display: 'block', width: 'fit-content' };
            const isHighlighted = fineGrainedReport.includes(lineNumber);
            const isHighlightedFromGraph = hoveredLinesFromGraph.includes(lineNumber);
            
            // if (isHighlighted || isHighlightedFromGraph) {
            //   style.backgroundColor = isHighlightedFromGraph ? '#FFE4B5' : '#FFDB81';
            //   style.cursor = 'pointer';
            //   style.transition = 'all 0.2s ease-in-out';
            //   style.position = 'relative';
            //   style.transform = hoveredLine === lineNumber ? 'scale(1.1)' : 'scale(1)';
            //   style.boxShadow = isHighlightedFromGraph ? '0 0 8px rgba(255, 165, 0, 0.5)' : 'none';
            // }
            
            if (isHighlightedFromGraph) {
              // style.position = 'relative';
              // style.zIndex = 1;
              style.animation = 'highlight-pulse 1.5s ease-in-out infinite';
              style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
            }
            
            if (isHighlighted) {
              style.backgroundColor = '#FFDB81';
              style.cursor = 'pointer';
            }
            
            return { 
              style,
              className: isHighlightedFromGraph ? 'highlight-from-graph' : '',
              onMouseEnter: isHighlighted ? () => handleLineHover(lineNumber) : undefined,
              onMouseLeave: isHighlighted ? () => handleLineLeave() : undefined,
            };
          }}
        >
          {code}
        </SyntaxHighlighter>

        {/* Popup Message Box */}
        {hoveredLine && (
          <div 
            className="fixed z-50 px-3 py-2 text-xl bg-gray-800 text-white rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: mousePosition.x,
              top: mousePosition.y - 10,
              animation: 'fadeInScale 0.2s ease-out forwards',
              minWidth: '600px',
              maxWidth: '1000px'
            }}
          >
            <ul className="list-disc pl-4 space-y-2">
              {getMessageForLine(hoveredLine).map((line, index) => (
                <li key={index} className="leading-tight">
                  {line.replace(/^[-•]\s*/, '').trim()}
                </li>
              ))}
            </ul>
            {/* {getMessageForLine(hoveredLine)} */}
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeViewer;