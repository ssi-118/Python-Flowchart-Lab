import React from 'react';
import { Play, SkipForward, RefreshCw, Sparkles, RotateCcw } from 'lucide-react';

export default function StickyActionBar({
  onRunSimulation,
  onNextStep,
  onCheckFlowchart,
  onRunTestSuite,
  onReset,
  isRunning,
  stepIndex,
  totalSteps
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2.5 px-4 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Quick Controls</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-center">
          <button
            onClick={onRunSimulation}
            className="flex-1 sm:flex-initial py-2 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>▶ Run Simulation</span>
          </button>

          <button
            onClick={onNextStep}
            className="py-2 px-3.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
            <span className="hidden sm:inline">Next Step ({stepIndex + 1}/{totalSteps || '—'})</span>
          </button>

          <button
            onClick={onCheckFlowchart}
            className="py-2 px-3.5 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Flowchart</span>
          </button>

          <button
            onClick={onRunTestSuite}
            className="hidden sm:flex py-2 px-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run Test Suite</span>
          </button>

          <button
            onClick={onReset}
            className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
