import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Link, Unlink, PlusCircle, Code2, FileText, Copy, Check } from 'lucide-react';

export default function NodeToolbox({
  nodes,
  connections,
  selectedNodeId,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
  onAddConnection,
  onDeleteConnection,
  problem
}) {
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Unified Left Tabbed Panel State: 'build' | 'connect' | 'pseudocode'
  const [activeTab, setActiveTab] = useState('build');
  const [codeTab, setCodeTab] = useState('algorithm'); // 'algorithm' | 'pseudocode'
  const [copied, setCopied] = useState(false);

  // Automatically switch to 'build' tab when a node is selected for editing
  useEffect(() => {
    if (selectedNodeId) {
      setActiveTab('build');
    }
  }, [selectedNodeId]);

  // Form State
  const [newType, setNewType] = useState('PROCESS');
  const [newLabel, setNewLabel] = useState('');
  const [newCode, setNewCode] = useState('');

  const [connSource, setConnSource] = useState('');
  const [connTarget, setConnTarget] = useState('');
  const [connLabel, setConnLabel] = useState('');

  const handleCreateNode = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    onAddNode({
      type: newType,
      label: newLabel.trim(),
      code: newCode.trim() || newLabel.trim()
    });
    setNewLabel('');
    setNewCode('');
  };

  const handleCreateConnection = (e) => {
    e.preventDefault();
    if (!connSource || !connTarget || connSource === connTarget) return;
    onAddConnection({
      source: connSource,
      target: connTarget,
      label: connLabel
    });
    setConnSource('');
    setConnTarget('');
    setConnLabel('');
  };

  const handleCopyCode = () => {
    const textToCopy = codeTab === 'algorithm' ? problem.algorithm.join('\n') : problem.pseudocode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all overflow-hidden flex flex-col h-full">
      
      {/* 3 Main Header Tabs */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('build')}
          className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'build'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Build Shape</span>
        </button>

        <button
          onClick={() => setActiveTab('connect')}
          className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'connect'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>Connect Paths</span>
        </button>

        <button
          onClick={() => setActiveTab('pseudocode')}
          className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'pseudocode'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Pseudocode</span>
        </button>
      </div>

      {/* Tab Content Panel */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        
        {/* TAB 1: BUILD SHAPE & EDIT SELECTED NODE */}
        {activeTab === 'build' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {selectedNode ? (
              <div className="bg-indigo-50/80 dark:bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Edit Selected Shape ({selectedNode.type})
                  </span>
                  <button
                    onClick={() => onDeleteNode(selectedNode.id)}
                    className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/60 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Display Label:
                  </label>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Logic Code / Condition:
                  </label>
                  <input
                    type="text"
                    value={selectedNode.code || ''}
                    onChange={(e) => onUpdateNode(selectedNode.id, { code: e.target.value })}
                    placeholder="e.g. A > B && A > C or largest = A"
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                💡 Click any shape on the visual canvas to inspect and edit its properties.
              </div>
            )}

            {/* Add Shape Form */}
            <form onSubmit={handleCreateNode} className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
                Add New Shape
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Shape Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="START">START (Oval)</option>
                    <option value="INPUT">INPUT (Parallelogram)</option>
                    <option value="PROCESS">PROCESS (Rectangle)</option>
                    <option value="DECISION">DECISION (Diamond)</option>
                    <option value="OUTPUT">OUTPUT (Parallelogram)</option>
                    <option value="END">END (Oval)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Display Text:</label>
                  <input
                    type="text"
                    placeholder="e.g. largest = B"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Shape to Canvas
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CONNECT PATHS */}
        {activeTab === 'connect' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <form onSubmit={handleCreateConnection} className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-indigo-500" />
                Connect Arrow Path
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">From Shape:</label>
                  <select
                    value={connSource}
                    onChange={(e) => setConnSource(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="">Select Source</option>
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">To Shape:</label>
                  <select
                    value={connTarget}
                    onChange={(e) => setConnTarget(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="">Select Target</option>
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Branch Label:</label>
                <select
                  value={connLabel}
                  onChange={(e) => setConnLabel(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="">None (Sequential flow)</option>
                  <option value="YES">YES (If True)</option>
                  <option value="NO">NO (If False)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                <Link className="w-3.5 h-3.5" />
                Add Arrow Path
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Active Arrow Paths ({connections.length}):
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {connections.map(c => {
                  const src = nodes.find(n => n.id === c.source);
                  const tgt = nodes.find(n => n.id === c.target);
                  return (
                    <div key={c.id} className="flex items-center justify-between text-[10px] p-1.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="truncate max-w-[170px] text-slate-700 dark:text-slate-300 font-medium">
                        {src?.label || 'Node'} → {tgt?.label || 'Node'} {c.label ? `[${c.label}]` : ''}
                      </span>
                      <button
                        onClick={() => onDeleteConnection(c.id)}
                        className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
                        title="Remove connection"
                      >
                        <Unlink className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PSEUDOCODE / ALGORITHM */}
        {activeTab === 'pseudocode' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCodeTab('algorithm')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    codeTab === 'algorithm'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Algorithm
                </button>
                <button
                  onClick={() => setCodeTab('pseudocode')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    codeTab === 'pseudocode'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Pseudocode
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs overflow-y-auto max-h-[280px]">
              {codeTab === 'algorithm' ? (
                <div className="space-y-1 font-sans">
                  {problem.algorithm.map((step, idx) => (
                    <div key={idx} className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="font-mono text-indigo-900 dark:text-indigo-200 whitespace-pre-wrap leading-relaxed">
                  {problem.pseudocode}
                </pre>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
