import React, { useState, useEffect } from 'react';
import { PROBLEMS } from '../data/problemsData';
import { PlusCircle, Edit3, Link, Trash2, ChevronDown, Code2, Plus, Unlink, FileText, Copy, Check } from 'lucide-react';

export default function ProblemAndBuildPanel({
  selectedProblemId,
  onSelectProblem,
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

  // Tab State: 'build' | 'edit' | 'connect' | 'pseudocode'
  const [activeTab, setActiveTab] = useState('build');
  const [codeTab, setCodeTab] = useState('algorithm');
  const [copied, setCopied] = useState(false);

  // Auto-switch to 'edit' when node is selected
  useEffect(() => {
    if (selectedNodeId) {
      setActiveTab('edit');
    }
  }, [selectedNodeId]);

  // Form States
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
    navigator.clipboard.writeText(codeTab === 'algorithm' ? problem.algorithm.join('\n') : problem.pseudocode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. COMPACT PROBLEM CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
          <span>PROBLEM {PROBLEMS.findIndex(p => p.id === selectedProblemId) + 1}</span>
        </div>

        <div className="relative mb-2">
          <select
            value={selectedProblemId}
            onChange={(e) => onSelectProblem(e.target.value)}
            aria-label="Select problem challenge"
            className="w-full px-3 py-2 text-xs font-extrabold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer appearance-none shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            {PROBLEMS.map((prob) => (
              <option key={prob.id} value={prob.id}>
                {prob.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* 2. BUILD YOUR FLOWCHART PANEL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
        
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('build')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'build'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Build</span>
          </button>

          {selectedNode && (
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'connect'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Connect</span>
          </button>

          <button
            onClick={() => setActiveTab('pseudocode')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'pseudocode'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 space-y-3">
          
          {/* TAB 1: BUILD YOUR FLOWCHART */}
          {activeTab === 'build' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                BUILD YOUR FLOWCHART
              </h2>

              {/* Shape Key */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>○ Start / End</span>
                <span>▱ Input / Output</span>
                <span>▭ Process</span>
                <span>◇ Decision</span>
              </div>

              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                Choose a shape, enter its text, then add it.
              </p>

              <form onSubmit={handleCreateNode} className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Shape Type:
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    aria-label="Select shape type to add"
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
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
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Shape Text:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. largest = B"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    aria-label="Enter shape text"
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add to Flowchart</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: EDIT SELECTED SHAPE */}
          {activeTab === 'edit' && selectedNode && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  EDIT SHAPE ({selectedNode.type})
                </h2>
                <button
                  onClick={() => onDeleteNode(selectedNode.id)}
                  aria-label="Delete selected shape"
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Display Text:
                  </label>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
                    aria-label="Edit display text"
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Logic Code:
                  </label>
                  <input
                    type="text"
                    value={selectedNode.code || ''}
                    onChange={(e) => onUpdateNode(selectedNode.id, { code: e.target.value })}
                    placeholder="e.g. A > B && A > C"
                    aria-label="Edit logic code expression"
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONNECT PATHS */}
          {activeTab === 'connect' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                CONNECT PATHS
              </h2>

              <form onSubmit={handleCreateConnection} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">From:</label>
                    <select
                      value={connSource}
                      onChange={(e) => setConnSource(e.target.value)}
                      aria-label="Source shape"
                      className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="">Source</option>
                      {nodes.map(n => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">To:</label>
                    <select
                      value={connTarget}
                      onChange={(e) => setConnTarget(e.target.value)}
                      aria-label="Target shape"
                      className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="">Target</option>
                      {nodes.map(n => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Branch:</label>
                  <select
                    value={connLabel}
                    onChange={(e) => setConnLabel(e.target.value)}
                    aria-label="Branch condition label"
                    className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="">None (Normal)</option>
                    <option value="YES">YES (True)</option>
                    <option value="NO">NO (False)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Add Path
                </button>
              </form>

              {/* Active Connections List */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Paths ({connections.length}):
                </span>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {connections.map(c => {
                    const src = nodes.find(n => n.id === c.source);
                    const tgt = nodes.find(n => n.id === c.target);
                    return (
                      <div key={c.id} className="flex items-center justify-between text-[10px] p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                        <span className="truncate max-w-[150px] font-medium text-slate-700 dark:text-slate-300">
                          {src?.label || 'Node'} → {tgt?.label || 'Node'} {c.label ? `[${c.label}]` : ''}
                        </span>
                        <button
                          onClick={() => onDeleteConnection(c.id)}
                          aria-label="Remove path connection"
                          className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
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

          {/* TAB 4: CODE / PSEUDOCODE */}
          {activeTab === 'pseudocode' && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  CODE
                </h2>
                <button
                  onClick={handleCopyCode}
                  aria-label="Copy pseudocode to clipboard"
                  className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setCodeTab('algorithm')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${codeTab === 'algorithm' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Algorithm
                </button>
                <button
                  onClick={() => setCodeTab('pseudocode')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${codeTab === 'pseudocode' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Pseudocode
                </button>
              </div>

              {codeTab === 'algorithm' ? (
                <div className="font-sans text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 max-h-[220px] overflow-y-auto">
                  {problem.algorithm.map((step, index) => <div key={index}>{step}</div>)}
                </div>
              ) : (
                <pre className="font-mono text-xs text-indigo-900 dark:text-indigo-200 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto">
                  {problem.pseudocode}
                </pre>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
