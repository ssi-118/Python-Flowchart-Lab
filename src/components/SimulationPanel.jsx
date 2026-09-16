import React from 'react';
import { Play, SkipForward, RotateCcw, SlidersHorizontal, Activity } from 'lucide-react';

export default function SimulationPanel({
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
  setSpeed
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Test the Algorithm</span>
            {isRunning && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Executing...
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter test values and run step-by-step to visualize flowchart traversal.
          </p>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-600 dark:text-slate-300 font-semibold">Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-transparent text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
          >
            <option value={1200}>Slow (1.2s)</option>
            <option value={700}>Normal (0.7s)</option>
            <option value={300}>Fast (0.3s)</option>
          </select>
        </div>
      </div>

      {/* Input Variable Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
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
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
            />
          </div>
        ))}
      </div>

      {/* Execution Control Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onRunSimulation}
          className="flex-1 min-w-[130px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Run Simulation</span>
        </button>

        <button
          onClick={onNextStep}
          className="py-2.5 px-4 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <SkipForward className="w-4 h-4" />
          <span>Next Step ({stepIndex + 1}/{totalSteps || '—'})</span>
        </button>

        <button
          onClick={onResetSimulation}
          className="py-2.5 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
