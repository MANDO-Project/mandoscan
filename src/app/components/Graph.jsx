"use client"
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { ssr: false });

export default function Graph({
  graphData, 
  hoveredLineNumber = null, 
  onNodeHover = () => {},
  onNodeLeave = () => {},
  onNodeClick = () => {}
}) {
  const fgRef = useRef();
  const [highlightedNodes, setHighlightedNodes] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [animatedNodes, setAnimatedNodes] = useState(new Set());

  // Find nodes that contain the hovered line number
  useEffect(() => {
    if (hoveredLineNumber && graphData) {
      const matchingNodes = graphData.nodes.filter(node => {
        if (!node.code_lines) return false;
        
        const lines = node.code_lines.split('-');
        if (lines.length === 1) {
          return parseInt(lines[0], 10) === hoveredLineNumber;
        } else { return false;}
      });
      console.log('Matching nodes for line', matchingNodes);
      setHighlightedNodes(new Set(matchingNodes.map(node => node.id)));
    } else {
      setHighlightedNodes(new Set());
    }
  }, [hoveredLineNumber, graphData]);

  //     if (matchingNodes.length > 0) {
  //       setHoveredNodeId(matchingNodes[0].id);
  //       setAnimatedNodes(new Set(matchingNodes.map(node => node.id)));
        
  //       // Focus on the first matching node
  //       if (fgRef.current) {
  //         const node = matchingNodes[0];
  //         fgRef.current.centerAt(node.x, node.y, 1000);
  //         fgRef.current.zoom(3, 1000);
  //       }
  //     }
  //   } else {
  //     setHoveredNodeId(null);
  //     setAnimatedNodes(new Set());
      
  //     // Reset zoom when not hovering
  //     if (fgRef.current) {
  //       fgRef.current.zoom(1, 1000);
  //     }
  //   }
  // }, [hoveredLineNumber, graphData]);

  const paintRing = (node, ctx) => {
    // const isHighlighted = node.id === hoveredNodeId;
    const isHighlighted = highlightedNodes.has(node.id);
    const scale = isHighlighted ? 2.2 : 1.8;
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, 4 * scale, 0, 2 * Math.PI, false);

    if (isHighlighted) {
      ctx.fillStyle = '#FF4500'; // Bright orange for highlighted nodes
      ctx.strokeStyle = '#FFA500'; // Light orange border
      ctx.lineWidth = 3;
    } else {
      ctx.fillStyle = node.message === '' ? 'white' : 'red';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
    }
    
    ctx.fill();
    ctx.stroke();
  
    if (isHighlighted) {
      ctx.shadowColor = '#FF4500';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#FF4500';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow for other nodes
    }
  };


  const getNodeSize = (node) => {
    if (animatedNodes.has(node.id)) {
      // Dynamic size based on time for breathing effect
      const time = Date.now() * 0.008;
      const breathe = 1 + Math.sin(time) * 0.3;
      return 15 * breathe;
    }
    return 4;
  };

  const handleNodeHover = (node) => {
    if (!node) {
      onNodeLeave();
      return;
    }
    
    // Convert code_lines to array of line numbers
    const lines = node.code_lines.split('-');
    if (lines.length === 1) {
      onNodeHover(parseInt(lines[0], 10));
    } else if (lines.length === 2) {
      const start = parseInt(lines[0], 10);
      const end = parseInt(lines[1], 10);
      // Create array of all lines in range
      const lineRange = Array.from(
        { length: end - start + 1 }, 
        (_, i) => start + i
      );
      // Send all lines at once
      lineRange.forEach(line => onNodeHover(line));
    }
  };

  const handleNodeClick = (node) => {
    if (!node) return;
    
    // Convert code_lines to array of line numbers
    const lines = node.code_lines.split('-');
    if (lines.length === 1) {
      onNodeClick(parseInt(lines[0], 10));
    } else if (lines.length === 2) {
      const start = parseInt(lines[0], 10);
      const end = parseInt(lines[1], 10);
      const center = parseInt((start + end) / 2, 10);
      onNodeClick(start); // Scroll to the start of the range
    }
  };

  return (
    <>
    {/* Custom CSS for larger tooltips */}
      <style jsx global>{`
        .float-tooltip-kap {
          font-size: 19px !important;
          padding: 12px 16px !important;
          color: white !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
          line-height: 1.4 !important;
          white-space: pre-wrap !important;
          z-index: 1000 !important;
          background: rgba(0, 0, 0, 0.65) !important;  
        }
      `}</style>
    <div className="flex flex-col h-screen bg-gray-200 p-5 mt-6 border-blue-700 border-[3px] rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Graph Visualizer</h1>
      <div className="flex-1 overflow-hidden rounded shadow-md bg-white">
        <ForceGraph
          ref={fgRef}
          nodeCanvasObject={paintRing}
          nodeCanvasObjectMode={node => 'before'}
          graphData={graphData}
          nodeLabel={(node) => `Lines: ${node.code_lines}\n${node.label}\nNode Type: ${node.node_type}`}
          linkLabel={(link) => link.edge_type}
          nodeAutoColorBy="group"
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          onNodeHover={(node) => handleNodeHover(node)}
          onNodeOut={() => onNodeLeave()}
          onNodeClick={(node) => handleNodeClick(node)}
        />
      </div>
    </div>
  </>
  );
}