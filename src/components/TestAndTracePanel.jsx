import React from 'react';
import { Play, SkipForward, RotateCcw, SlidersHorizontal, Activity, CheckCircle, XCircle, Flag } from 'lucide-react';

export default function TestAndTracePanel({
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
  onLoadTestCase
}) {
  const currentStepItem = trace[stepIndex] || null;

  // Preset button options for quick test input loading
  const handleApplyPreset = (presetType) => {
    if (problem.id === 'largest_three') {
      if (presetType === 'normal') onChangeInput('all', { A: 25, B: 12, C: 18 });
      else if (presetType === 'equal') onChangeInput('all', { A: 15, B: 15, C: 15 });
      else if (presetType === 'negative') onChangeInput('all', { A: -10, B: -5, C: -2 });
    } else {
      const cases = problem.generateTestCases();
      if (cases.length > 0) onChangeInput('all', cases[0].inputs);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-4">
      
      {/* Panel Title */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>TEST & SIMULATE</span>
        </h2>
        {isRunning && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Executing
          </span>
        )}
      </div>

      {/* Inputs Form */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
          Input Values:
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          {problem.inputs.map((inp) => (
            <div key={inp.name} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-slate-500 font-bold">Value {inp.name}</span>
              <input
                type={inp.type || 'number'}
                value={inputValues[inp.name] ?? inp.defaultVal}
                onChange={(e) => onChangeInput(inp.name, e.target.value)}
                aria-label={`Input value for ${inp.name}`}
                className="w-full px-2 py-1.5 text-xs font-extrabold text-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400">Presets:</span>
          <button
            onClick={() => handleApplyPreset('normal')}
            className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Normal
          </button>
          <button
            onClick={() => handleApplyPreset('equal')}
            className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Equal
          </button>
          <button
            onClick={() => handleApplyPreset('negative')}
            className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Negative
          </button>
        </div>
      </div>

      {/* Buttons Hierarchy */}
      <div className="space-y-2 pt-1">
        {/* Primary CTA */}
        <button
          onClick={onRunSimulation}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>▶ Run Simulation</span>
        </button>

        {/* Secondary Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNextStep}
            className="flex-1 py-1.5 px-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Next Step ({stepIndex + 1}/{totalSteps || '—'})</span>
          </button>

          <button
            onClick={onResetSimulation}
            aria-label="Reset simulation execution"
            className="py-1.5 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Current Step Execution Detail */}
      {currentStepItem && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Step {currentStepItem.step} of {totalSteps}</span>
            <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
              {currentStepItem.nodeType}
            </span>
          </div>

          <p className="font-bold text-slate-900 dark:text-white leading-tight">
            {currentStepItem.text}
          </p>
        </div>
      )}

      {/* Output Result */}
      {finalResult !== undefined && (
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Flag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Result:
          </span>
          <span className="font-extrabold font-mono text-indigo-700 dark:text-indigo-300">
            {problem.outputLabel || 'Output'} = {finalResult}
          </span>
        </div>
      )}

      {/* Test Cases Summary List */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
          Test Scenarios ({testResults.length}):
        </span>

        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {testResults.map((tr) => (
            <div
              key={tr.testCase.id}
              onClick={() => onLoadTestCase(tr.testCase)}
              className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                tr.pass
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/60'
                  : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100/60'
              }`}
            >
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                  {tr.testCase.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Exp: {String(tr.testCase.expected)} | Act: {String(tr.actual)}
                </span>
              </div>

              {tr.pass ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-700 dark:text-rose-400">
                  <XCircle className="w-3.5 h-3.5" />
                  FAIL
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
