import React, { useRef, useState } from 'react';
import { RotateCcw, Info, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function FlowchartCanvas({
  nodes,
  connections,
  selectedNodeId,
  onSelectNode,
  onUpdateNodePosition,
  activeNodeId,
  visitedNodeIds = [],
  onResetFlowchart
}) {
  const svgRef = useRef(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [view, setView] = useState({ zoom: 1, panX: 0, panY: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [showLegend, setShowLegend] = useState(false);
  const didPanRef = useRef(false);

  const getSvgPoint = (e) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - svgRect.left) / svgRect.width) * 900,
      y: ((e.clientY - svgRect.top) / svgRect.height) * 720
    };
  };

  const fitToScreen = () => {
    if (!nodes.length || !svgRef.current) return;
    const bounds = nodes.reduce((result, node) => ({
      minX: Math.min(result.minX, node.x),
      minY: Math.min(result.minY, node.y),
      maxX: Math.max(result.maxX, node.x + 160),
      maxY: Math.max(result.maxY, node.y + 70)
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    const padding = 45;
    const contentWidth = bounds.maxX - bounds.minX + padding * 2;
    const contentHeight = bounds.maxY - bounds.minY + padding * 2;
    const zoom = Math.min(900 / contentWidth, 720 / contentHeight, 1.5);
    setView({
      zoom: Math.max(0.45, zoom),
      panX: (900 - contentWidth * zoom) / 2 - (bounds.minX - padding) * zoom,
      panY: (720 - contentHeight * zoom) / 2 - (bounds.minY - padding) * zoom
    });
  };

  const adjustZoom = (amount) => {
    setView(current => ({ ...current, zoom: Math.max(0.45, Math.min(2.2, current.zoom + amount)) }));
  };

  // Handle Mouse Dragging
  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    onSelectNode(node.id);
    setDraggingNodeId(node.id);

    const point = getSvgPoint(e);
    setDragOffset({
      x: (point.x - view.panX) / view.zoom - node.x,
      y: (point.y - view.panY) / view.zoom - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    if (draggingNodeId) {
      const point = getSvgPoint(e);
      const newX = Math.max(20, Math.min(850, (point.x - view.panX) / view.zoom - dragOffset.x));
      const newY = Math.max(20, Math.min(750, (point.y - view.panY) / view.zoom - dragOffset.y));
      onUpdateNodePosition(draggingNodeId, newX, newY);
    } else if (isPanning) {
      didPanRef.current = true;
      const svgRect = svgRef.current.getBoundingClientRect();
      setView(current => ({
        ...current,
        panX: panStart.panX + ((e.clientX - panStart.x) / svgRect.width) * 900,
        panY: panStart.panY + ((e.clientY - panStart.y) / svgRect.height) * 720
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleCanvasMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY, panX: view.panX, panY: view.panY });
  };

  const handleCanvasClick = () => {
    if (didPanRef.current) {
      didPanRef.current = false;
      return;
    }
    onSelectNode(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    adjustZoom(e.deltaY < 0 ? 0.1 : -0.1);
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    onSelectNode(node.id);
  };

  // Helper to get center anchor point for a node shape
  const getNodeCenter = (node) => {
    switch (node.type) {
      case 'START':
      case 'END':
        return { x: node.x + 60, y: node.y + 24 };
      case 'INPUT':
      case 'OUTPUT':
        return { x: node.x + 75, y: node.y + 24 };
      case 'PROCESS':
        return { x: node.x + 80, y: node.y + 26 };
      case 'DECISION':
        return { x: node.x + 80, y: node.y + 35 };
      default:
        return { x: node.x + 70, y: node.y + 25 };
    }
  };

  // Render SVG Path Arrow connecting source center to target center
  const renderConnection = (conn) => {
    const sourceNode = nodes.find(n => n.id === conn.source);
    const targetNode = nodes.find(n => n.id === conn.target);
    if (!sourceNode || !targetNode) return null;

    const sCenter = getNodeCenter(sourceNode);
    const tCenter = getNodeCenter(targetNode);

    const dx = tCenter.x - sCenter.x;
    const dy = tCenter.y - sCenter.y;
    const midX = (sCenter.x + tCenter.x) / 2;
    const midY = (sCenter.y + tCenter.y) / 2;

    let pathD = `M ${sCenter.x} ${sCenter.y} L ${tCenter.x} ${tCenter.y}`;
    if (Math.abs(dx) > 100 && Math.abs(dy) > 30) {
      pathD = `M ${sCenter.x} ${sCenter.y} C ${sCenter.x} ${midY}, ${tCenter.x} ${midY}, ${tCenter.x} ${tCenter.y}`;
    }

    const isBranchYes = (conn.label || '').toUpperCase() === 'YES';
    const isBranchNo = (conn.label || '').toUpperCase() === 'NO';

    return (
      <g key={conn.id} className="group">
        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          markerEnd="url(#arrowhead)"
          className={`transition-all duration-300 ${
            isBranchYes
              ? 'text-emerald-500/80 dark:text-emerald-400/80'
              : isBranchNo
              ? 'text-rose-500/80 dark:text-rose-400/80'
              : 'text-slate-400 dark:text-slate-600'
          }`}
        />

        {conn.label && (
          <g transform={`translate(${midX}, ${midY})`}>
            <rect
              x="-18"
              y="-11"
              width="36"
              height="22"
              rx="6"
              fill={isBranchYes ? '#10b981' : isBranchNo ? '#ef4444' : '#64748b'}
              className="shadow-sm"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="bold"
            >
              {conn.label.toUpperCase()}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Render individual Flowchart Node Shape
  const renderNodeShape = (node) => {
    const isSelected = selectedNodeId === node.id;
    const isActive = activeNodeId === node.id;
    const isVisited = visitedNodeIds.includes(node.id);

    let fill = '#ffffff';
    let stroke = '#64748b';
    let textFill = '#0f172a';

    switch (node.type) {
      case 'START':
      case 'END':
        fill = node.type === 'START' ? '#dcfce7' : '#fee2e2';
        stroke = node.type === 'START' ? '#16a34a' : '#dc2626';
        textFill = node.type === 'START' ? '#14532d' : '#7f1d1d';
        break;
      case 'INPUT':
      case 'OUTPUT':
        fill = '#e0f2fe';
        stroke = '#0284c7';
        textFill = '#075985';
        break;
      case 'PROCESS':
        fill = '#f1f5f9';
        stroke = '#475569';
        textFill = '#0f172a';
        break;
      case 'DECISION':
        fill = '#fef3c7';
        stroke = '#d97706';
        textFill = '#78350f';
        break;
    }

    return (
      <g
        key={node.id}
        transform={`translate(${node.x}, ${node.y})`}
        onClick={(e) => handleNodeClick(e, node)}
        onMouseDown={(e) => handleMouseDown(e, node)}
        className="cursor-pointer select-none transition-transform duration-100 hover:scale-[1.02]"
      >
        {/* Active Node Pulse */}
        {isActive && (
          <circle
            cx="75"
            cy="30"
            r="65"
            fill="none"
            stroke="#6366f1"
            strokeWidth="4"
            className="animate-ping opacity-75"
          />
        )}

        {/* Selected Highlight Ring */}
        {isSelected && (
          <rect
            x="-6"
            y="-6"
            width="172"
            height="82"
            rx="12"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
        )}

        {/* START / END */}
        {(node.type === 'START' || node.type === 'END') && (
          <rect
            x="0"
            y="0"
            width="120"
            height="48"
            rx="24"
            fill={fill}
            stroke={isActive || isSelected ? '#6366f1' : stroke}
            strokeWidth={isActive || isSelected ? '3.5' : '2'}
            className="shadow-sm"
          />
        )}

        {/* INPUT / OUTPUT */}
        {(node.type === 'INPUT' || node.type === 'OUTPUT') && (
          <polygon
            points="18,0 150,0 132,48 0,48"
            fill={fill}
            stroke={isActive || isSelected ? '#6366f1' : stroke}
            strokeWidth={isActive || isSelected ? '3.5' : '2'}
            className="shadow-sm"
          />
        )}

        {/* PROCESS */}
        {node.type === 'PROCESS' && (
          <rect
            x="0"
            y="0"
            width="160"
            height="52"
            rx="8"
            fill={fill}
            stroke={isActive || isSelected ? '#6366f1' : stroke}
            strokeWidth={isActive || isSelected ? '3.5' : '2'}
            className="shadow-sm"
          />
        )}

        {/* DECISION */}
        {node.type === 'DECISION' && (
          <polygon
            points="80,0 160,35 80,70 0,35"
            fill={fill}
            stroke={isActive || isSelected ? '#6366f1' : stroke}
            strokeWidth={isActive || isSelected ? '3.5' : '2'}
            className="shadow-sm"
          />
        )}

        {/* Text Label */}
        <text
          x={node.type === 'DECISION' ? '80' : node.type === 'START' || node.type === 'END' ? '60' : '75'}
          y={node.type === 'DECISION' ? '39' : '28'}
          textAnchor="middle"
          fill={textFill}
          fontSize="12"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {node.label.length > 22 ? node.label.substring(0, 20) + '…' : node.label}
        </text>

        {/* Visited Checkmark */}
        {isVisited && !isActive && (
          <circle cx="10" cy="5" r="8" fill="#10b981" />
        )}
      </g>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full relative overflow-hidden transition-colors">
      
      {/* Canvas Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Visual Flowchart Canvas
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium hidden sm:inline">
            Drag shapes to reposition • Click to edit
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend Toggle Tooltip Button */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle shape legend"
          >
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>Legend</span>
          </button>

          <button
            onClick={onResetFlowchart}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
            title="Restore default problem flowchart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Workspace */}
      <div className="flex-1 min-h-[580px] w-full bg-slate-50/70 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 p-1 shadow-md backdrop-blur-sm">
          <button onClick={() => adjustZoom(0.1)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-lg cursor-pointer" title="Zoom in" aria-label="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => adjustZoom(-0.1)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-lg cursor-pointer" title="Zoom out" aria-label="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={fitToScreen} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-lg cursor-pointer" title="Fit flowchart to canvas" aria-label="Fit flowchart to canvas">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 900 720"
          preserveAspectRatio="none"
          className={`w-full h-full min-h-[580px] block ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="8"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
            </marker>
          </defs>

          <g transform={`translate(${view.panX} ${view.panY}) scale(${view.zoom})`}>
            {/* Render Connections */}
            {connections.map(renderConnection)}

            {/* Render Nodes */}
            {nodes.map(renderNodeShape)}
          </g>
        </svg>

        {/* Floating Legend Popover / Tooltip */}
        {showLegend && (
          <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] shadow-lg flex flex-col gap-2 z-10 animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-4 font-bold border-b border-slate-100 dark:border-slate-800 pb-1 text-slate-800 dark:text-slate-200">
              <span>Standard Flowchart Shapes</span>
              <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-200 border border-emerald-600 inline-block" /> Oval: Start / End
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3.5 h-3.5 rounded bg-sky-200 border border-sky-600 inline-block" /> Parallelogram: Input / Output
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-600 inline-block" /> Rectangle: Process
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3.5 h-3.5 rotate-45 bg-amber-200 border border-amber-600 inline-block" /> Diamond: Decision
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
