'use client';

import * as React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeViewer = ({
  code,
  fineGrainedReport = [],
  reportMessages = {},
  onLineHover = () => {},
  onLineLeave = () => {},
  hoveredLinesFromGraph = [],
  scrollToLine = null,
  clickedLineMessage = null,
}) => {
  const [hoveredLine, setHoveredLine] = React.useState(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef(null);
  const codeRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollToLine && codeRef.current) {
      const lineElements =
        codeRef.current.querySelectorAll('[data-line-number]');
      const targetLine = Array.from(lineElements).find(
        (el) => parseInt(el.dataset.lineNumber) === scrollToLine
      );

      if (targetLine) {
        targetLine.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        // Add highlight animation
        targetLine.classList.add('highlight-scroll');
        setTimeout(() => {
          targetLine.classList.remove('highlight-scroll');
        }, 2000);
      }
    }
  }, [scrollToLine]);

  const handleMouseMove = (event) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
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
    const message =
      reportMessages[lineNumber] || `Issue detected on line ${lineNumber}`;
    const lines = message.split('\n').filter((line) => line.trim());
    return lines;
  };

  return (
    <div
      ref={containerRef}
      className="relative mt-6 flex h-screen flex-col rounded-xl border-[3px] border-blue-700 bg-gray-200 p-5"
      onMouseMove={handleMouseMove}
    >
      <style jsx global>{`
        @keyframes highlight-pulse {
          0% {
            background-color: rgba(255, 165, 0, 0.2);
          }
          50% {
            background-color: rgba(255, 165, 0, 0.5);
          }
          100% {
            background-color: rgba(255, 165, 0, 0.2);
          }
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
          0% {
            background-color: rgba(255, 220, 0, 0.8);
          }
          100% {
            background-color: transparent;
          }
        }
        .highlight-click {
          animation: highlight-click 5s ease-out;
        }

        @keyframes highlight-click {
          0% {
            background-color: rgba(255, 0, 0, 0.4);
          }
          10% {
            background-color: rgba(255, 0, 0, 0.6);
          }
          20% {
            background-color: rgba(255, 0, 0, 0.4);
          }
          100% {
            background-color: transparent;
          }
        }
      `}</style>
      <h1 className="mb-4 text-center text-2xl font-bold text-black">
        Smart contract
      </h1>

      <div ref={codeRef} className="relative flex-1 overflow-auto">
        <SyntaxHighlighter
          language="solidity"
          style={coy}
          showLineNumbers={true}
          wrapLongLines={true}
          lineProps={(lineNumber) => {
            const style = { display: 'block', width: 'fit-content' };
            const isHighlighted = fineGrainedReport.includes(lineNumber);
            const isHighlightedFromGraph =
              hoveredLinesFromGraph.includes(lineNumber);

            if (isHighlightedFromGraph) {
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
              onMouseEnter: isHighlighted
                ? () => handleLineHover(lineNumber)
                : undefined,
              onMouseLeave: isHighlighted ? () => handleLineLeave() : undefined,
            };
          }}
        >
          {code}
        </SyntaxHighlighter>

        {/* Popup Message Box */}
        {hoveredLine && (
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full transform rounded-lg bg-gray-800 px-3 py-2 text-xl text-white shadow-lg"
            style={{
              left: mousePosition.x,
              top: mousePosition.y - 10,
              animation: 'fadeInScale 0.2s ease-out forwards',
              minWidth: '600px',
              maxWidth: '600px',
            }}
          >
            <ul className="list-disc space-y-2 pl-4">
              {getMessageForLine(hoveredLine).map((line, index) => (
                <li key={index} className="leading-tight">
                  {line.replace(/^[-•]\s*/, '').trim()}
                </li>
              ))}
            </ul>
            {/* Arrow pointing down */}
            <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeViewer;
