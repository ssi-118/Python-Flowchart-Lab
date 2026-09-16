import React, { useState } from 'react';
import { Play, SkipForward, RotateCcw, SlidersHorizontal, Activity, ListOrdered, CheckCircle2, AlertCircle, ArrowRight, Flag, Sparkles, CheckCircle, XCircle, Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function TestWorkflowPanel({
  problem,
  inputValues,
  onChangeInput,
  onRunSimulation,
  onNextStep,
  onResetSimulation,
  isRunning,
  stepIndex,
  totalSteps,
  speed,
  setSpeed,
  trace = [],
  finalResult,
  testResults = [],
  onGenerateTestCases,
  onLoadTestCase,
  passCount = 0,
  totalCount = 0
}) {
  // Sub-tabs: 'simulate' | 'trace' | 'testcases'
  const [subTab, setSubTab] = useState('simulate');
  const [tableExpanded, setTableExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
      
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Test & Trace Workflow</span>
            {totalCount > 0 && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  passCount === totalCount
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {passCount}/{totalCount} Tests Passed
              </span>
            )}
          </h2>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSubTab('simulate')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'simulate'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>1. Simulate</span>
          </button>

          <button
            onClick={() => setSubTab('trace')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'trace'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>2. Trace Log ({trace.length})</span>
          </button>

          <button
            onClick={() => setSubTab('testcases')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'testcases'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Test Cases</span>
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="p-4 sm:p-5">
        
        {/* SUB-TAB 1: SIMULATE */}
        {subTab === 'simulate' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Input Variables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {problem.inputs.map((inp) => (
                <div key={inp.name} className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>{inp.label}:</span>
                    <span className="text-[10px] font-mono font-normal text-slate-500">[{inp.name}]</span>
                  </label>
                  <input
                    type={inp.type || 'number'}
                    value={inputValues[inp.name] ?? inp.defaultVal}
                    onChange={(e) => onChangeInput(inp.name, e.target.value)}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Execution Buttons & Speed */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onRunSimulation}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Simulation</span>
                </button>

                <button
                  onClick={onNextStep}
                  className="py-2.5 px-4 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Next Step ({stepIndex + 1}/{totalSteps || '—'})</span>
                </button>

                <button
                  onClick={onResetSimulation}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">Speed:</span>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
                >
                  <option value={1200}>Slow (1.2s)</option>
                  <option value={700}>Normal (0.7s)</option>
                  <option value={300}>Fast (0.3s)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: TRACE LOG */}
        {subTab === 'trace' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
              {trace.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 italic">
                  Run simulation to generate step-by-step execution trace log.
                </div>
              ) : (
                trace.map((item, idx) => {
                  const isCurrent = idx === stepIndex;
                  const isExecuted = idx <= stepIndex;
                  const isError = item.nodeType === 'ERROR';

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 font-bold'
                          : isExecuted
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-40'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isError ? (
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                        ) : isExecuted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200">Step {item.step}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {item.nodeType}
                          </span>
                        </div>
                        <p className="mt-0.5 text-slate-600 dark:text-slate-300 font-medium">{item.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Final Result Pill */}
            {finalResult !== undefined && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Result Output:
                </span>
                <span className="text-sm font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                  {problem.outputLabel || 'Result'} = {finalResult}
                </span>
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 3: TEST CASES */}
        {subTab === 'testcases' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Header Action Bar */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Automated Test Suite (6 Scenarios)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onGenerateTestCases}
                  className="py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ Run Test Suite</span>
                </button>

                <button
                  onClick={() => setTableExpanded(!tableExpanded)}
                  className="py-1.5 px-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <span>{tableExpanded ? 'Hide Details' : 'View Full Table'}</span>
                  {tableExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Test Table (Expanded or Collapsed Summary) */}
            {tableExpanded ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2 px-3">Test Scenario</th>
                      <th className="py-2 px-3">Input Values</th>
                      <th className="py-2 px-3">Expected</th>
                      <th className="py-2 px-3">Actual Flowchart Output</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {testResults.map((tr) => (
                      <tr
                        key={tr.testCase.id}
                        className={tr.pass ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : 'bg-rose-50/40 dark:bg-rose-950/20'}
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">{tr.testCase.name}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {Object.entries(tr.testCase.inputs).map(([k, v]) => `${k}=${v}`).join(', ')}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{String(tr.testCase.expected)}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{String(tr.actual)}</td>
                        <td className="py-2.5 px-3">
                          {tr.pass ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-extrabold">
                              <CheckCircle className="w-3.5 h-3.5" /> PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-extrabold">
                              <XCircle className="w-3.5 h-3.5" /> FAIL
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onLoadTestCase(tr.testCase)}
                            className="px-2 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded cursor-pointer"
                          >
                            Test Input
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {passCount === totalCount ? '✓ All test cases passed expected logic output.' : `⚠ ${totalCount - passCount} failing test case(s) detected.`}
                </span>
                <button
                  onClick={() => setTableExpanded(true)}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Expand 6 Rows
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
