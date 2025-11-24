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
  onLineHover = (lineNumber) => {},
  onLineLeave = () => {},
  hoveredLinesFromGraph = [],
  scrollToLine = null,
  clickedLineMessage = null
}) => {

  const [hoveredLine, setHoveredLine] = React.useState(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [linePosition, setLinePosition] = React.useState({ top: 0, left: 0, width: 0 });
  const containerRef = React.useRef(null);
  const codeRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollToLine && codeRef.current) {
      const lineElements = codeRef.current.querySelectorAll('[data-line-number]');
      const targetLine = Array.from(lineElements).find(
        el => parseInt(el.dataset.lineNumber) === scrollToLine
      );
      
      if (targetLine) {
        targetLine.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Add highlight animation
        targetLine.classList.add('highlight-scroll');
        setTimeout(() => {
          targetLine.classList.remove('highlight-scroll');
        }, 2000);
      }
    }
  }, [scrollToLine]);

  // React.useEffect(() => {
  //   if (clickedLineMessage && codeRef.current) {
  //     const lineElements = codeRef.current.querySelectorAll('[data-line-number]');
  //     const targetLine = Array.from(lineElements).find(
  //       el => parseInt(el.dataset.lineNumber) === clickedLineMessage.line
  //     );
      
  //     if (targetLine && fineGrainedReport.includes(clickedLineMessage.line)) {
  //       const rect = targetLine.getBoundingClientRect();
  //       const containerRect = containerRef.current.getBoundingClientRect();
        
  //       setMousePosition({
  //         x: containerRect.width / 2,
  //         y: rect.top - containerRect.top + rect.height / 2
  //       });
  //       setHoveredLine(clickedLineMessage.line);
        
  //       // Add highlight animation class
  //       targetLine.classList.add('highlight-click');

  //       // // Auto-hide message after 5 seconds
  //       // const timer = setTimeout(() => {
  //       //   setHoveredLine(null);
  //       // }, 5000);
  //       // Auto-hide message and remove highlight after 5 seconds
  //       const timer = setTimeout(() => {
  //         setHoveredLine(null);
  //         targetLine.classList.remove('highlight-click');
  //       }, 5000);
        
  //       return () => {
  //         clearTimeout(timer);
  //         targetLine.classList.remove('highlight-click');
  //       };
  //     }
  //   }
  // }, [clickedLineMessage, fineGrainedReport]);

  const handleMouseMove = (event) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  };

  const handleLineHover = (lineNumber, event) => {
    setHoveredLine(lineNumber);
    
    // Get the absolute viewport position of the hovered line and code container
    if (event && event.currentTarget && codeRef.current) {
      const lineRect = event.currentTarget.getBoundingClientRect();
      const codeContainerRect = codeRef.current.getBoundingClientRect();
      
      // Use viewport coordinates for fixed positioning
      // Center the popup horizontally within the code container
      setLinePosition({
        top: lineRect.top, // Absolute position in viewport
        left: codeContainerRect.left + codeContainerRect.width / 2, // Center of code container
        width: lineRect.width
      });
    }
    
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
        .highlight-scroll {
          animation: highlight-scroll 2s ease-out;
        }
        @keyframes highlight-scroll {
          0% { background-color: rgba(255, 220, 0, 0.8); }
          100% { background-color: transparent; }
        }
        .highlight-click {
          animation: highlight-click 5s ease-out;
        }
        
        @keyframes highlight-click {
          0% { background-color: rgba(255, 0, 0, 0.4); }
          10% { background-color: rgba(255, 0, 0, 0.6); }
          20% { background-color: rgba(255, 0, 0, 0.4); }
          100% { background-color: transparent; }
        }
      `}</style>
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Smart contract</h1>
      
      <div ref={codeRef} className="relative flex-1 overflow-auto">
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
              'data-line-number': lineNumber,
              onMouseEnter: isHighlighted ? (e) => handleLineHover(lineNumber, e) : undefined,
              onMouseLeave: isHighlighted ? () => handleLineLeave() : undefined,
            };
          }}
        >
          {code}
        </SyntaxHighlighter>

        {/* Popup Message Box */}
        {hoveredLine && (
          <div 
            className="fixed z-[9999] px-3 py-2 text-xl bg-gray-800 text-white rounded-lg shadow-xl pointer-events-none border-2 border-gray-600"
            style={{
              left: `${linePosition.left}px`,
              top: `${linePosition.top}px`,
              transform: 'translate(-50%, calc(-100% - 15px))',
              animation: 'fadeInScale 0.2s ease-out forwards',
              minWidth: '600px',
              maxWidth: '600px'
            }}
          >
            <ul className="list-disc pl-4 space-y-2">
              {getMessageForLine(hoveredLine).map((line, index) => (
                <li key={index} className="leading-tight">
                  {line.replace(/^[-•]\s*/, '').trim()}
                </li>
              ))}
            </ul>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeViewer;