import React from 'react';
import { AlertCircle, X, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProblemFinderModal({
  failingCase,
  onClose,
  onLoadAndHighlight
}) {
  if (!failingCase) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-rose-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            <h3 className="text-base font-extrabold tracking-tight">
              🔎 Issue Found in Flowchart Logic
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="bg-rose-50 dark:bg-rose-950/40 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900">
            <p className="text-xs font-bold text-rose-900 dark:text-rose-200 mb-1">
              "Your flowchart does not correctly handle this test case."
            </p>
            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
              Scenario: <span className="font-bold">{failingCase.testCase.name}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Test Inputs:
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {Object.entries(failingCase.testCase.inputs).map(([k, v]) => `${k} = ${v}`).join(', ')}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Comparison:
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Exp: {String(failingCase.testCase.expected)}</span>
                <span className="text-slate-400">vs</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">Act: {String(failingCase.actual)}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            💡 Clicking below will automatically load these exact input values into the simulator and start step-by-step traversal so you can see where the flowchart branch went wrong!
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-xl transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={onLoadAndHighlight}
            className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Load Failing Case in Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
