'use client';

import * as React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solidity } from 'react-syntax-highlighter/dist/esm/languages/hljs';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {coy} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';



const CodeViewer = ({ code, fineGrainedReport = [] }) => {
  const lines = code.split('\n');

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 p-5 mt-6 border-blue-700 border-[3px] rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Smart contract</h1>
      {/* <SyntaxHighlighter language="solidity" style={solarizedlight}>
          {code}
      </SyntaxHighlighter> */}
      <pre className="text-xs overflow-x-scroll overflow-y-scroll p-0 m-0 max-h-[800px]">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted = fineGrainedReport.includes(lineNumber);

          return (
            <div
              key={lineNumber}
              className={`flex items-center space-x-4 pl-2 p-0 m-0 gap-0 ${
                isHighlighted
                  ? 'bg-yellow-100 border border-red-500 rounded-md'
                  : ''
              }`}
            >
              {/* Line Number */}
              <span
                className={`overflow-x-auto text-right pr-2 p-0 m-0 ${
                  isHighlighted ? 'font-bold text-red-500' : 'text-gray-500'
                }`}
              >
                {lineNumber}
              </span>
              {/* Code Line */}
              <span className="flex-1 p-0 m-0">
                <SyntaxHighlighter
                  className="flex p-0 m-0"
                  language="solidity"
                  style={coy}
                  PreTag="span"
                >
                  {line}
                </SyntaxHighlighter>
              </span>
            </div>
          );
        })}
      </pre>
    </div> 
  );
};

export default CodeViewer;