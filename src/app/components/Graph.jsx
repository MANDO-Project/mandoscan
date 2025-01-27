"use client"
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { ssr: false });

const initialGraph = {
  nodes: [
    { "id": "1", "label": "Node 1", "group": "A" },
      { "id": "2", "label": "Node 2", "group": "B" },
      { "id": "3", "label": "Node 3", "group": "A" },
      { "id": "4", "label": "Node 4", "group": "C" },
      { "id": "5", "label": "Node 5", "group": "B" },
      { "id": "6", "label": "Node 6", "group": "A" },
      { "id": "7", "label": "Node 7", "group": "C" },
      { "id": "8", "label": "Node 8", "group": "B" },
      { "id": "9", "label": "Node 9", "group": "A" },
      { "id": "10", "label": "Node 10", "group": "C" }
  ],
  links: [
    { "source": "1", "target": "2", "label": "Edge 1" },
      { "source": "2", "target": "3", "label": "Edge 2" },
      { "source": "3", "target": "4", "label": "Edge 3" },
      { "source": "4", "target": "5", "label": "Edge 4" },
      { "source": "5", "target": "6", "label": "Edge 5" },
      { "source": "6", "target": "7", "label": "Edge 6" },
      { "source": "7", "target": "8", "label": "Edge 7" },
      { "source": "8", "target": "9", "label": "Edge 8" },
      { "source": "9", "target": "10", "label": "Edge 9" },
      { "source": "10", "target": "1", "label": "Edge 10" },
      { "source": "1", "target": "5", "label": "Edge 11" },
      { "source": "2", "target": "6", "label": "Edge 12" },
      { "source": "3", "target": "7", "label": "Edge 13" },
      { "source": "4", "target": "8", "label": "Edge 14" },
      { "source": "9", "target": "2", "label": "Edge 15" }
  ]
};
  

export default function Graph({graphData}) {
  // const [graphData, setGraphData] = useState(initialGraph);

  // const handleInputChange = (e) => {
  //   try {
  //     const updatedGraph = JSON.parse(e.target.value);
  //     setGraphData(updatedGraph);
  //   } catch (err) {
  //     console.error('Invalid JSON input', err);
  //   }
  // };
  const paintRing = (node, ctx) => {
    // add ring just for highlighted nodes
    // let gData=graphData;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 4 * 1.8, 0, 2 * Math.PI, false);
    ctx.fillStyle = (node.message === '') ? 'white': 'red' // gData.nodes[node.id].nodeColor;
    ctx.fill();
    ctx.stroke();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 p-5 mt-6 border-blue-700 border-[3px] rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Graph Visualizer</h1>
      {/* <textarea
        className="w-full h-40 p-2 border rounded mb-4"
        placeholder="Paste your JSON here..."
        onChange={handleInputChange}
      /> */}
      <div className="flex flex-col p-4 rounded shadow-md bg-white')]">
        <ForceGraph
          nodeCanvasObject={paintRing}
          nodeCanvasObjectMode={node => 'before'}
          graphData={graphData}
          nodeLabel={(node) => `Lines: ${node.code_lines} ${node.label} - Node Type: ${node.node_type} ${node.message}`}
          linkLabel={(link) => link.edge_type}
          nodeAutoColorBy="group"
        />
      </div>
    </div>
  );
}
