import React from 'react';
import { ListOrdered, CheckCircle2, AlertCircle, ArrowRight, Flag } from 'lucide-react';

export default function ExecutionTrace({ trace = [], currentStepIndex = -1, finalResult, problem }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Execution Trace Log</span>
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
          {trace.length} Steps Recorded
        </span>
      </div>

      {/* Step Log List */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px] pr-1">
        {trace.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 italic">
            Click "▶ Run Simulation" to see step-by-step trace output.
          </div>
        ) : (
          trace.map((item, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isExecuted = idx <= currentStepIndex;
            const isError = item.nodeType === 'ERROR';

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400/80 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                    : isExecuted
                    ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-90'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/50 opacity-40'
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-bold ${isCurrent ? 'text-indigo-950 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'}`}>
                      Step {item.step}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                      {item.nodeType}
                    </span>
                  </div>

                  <p className={`mt-0.5 font-medium leading-tight ${isError ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}`}>
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Final Output Result Banner */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/40 p-3 rounded-xl border border-indigo-200/60 dark:border-indigo-800/50">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Flag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Final Result:
        </span>
        <span className="text-sm font-extrabold text-indigo-700 dark:text-indigo-300 font-mono">
          {finalResult !== undefined && finalResult !== null
            ? `${problem.outputLabel || 'Result'} = ${finalResult}`
            : '—'}
        </span>
      </div>
    </div>
  );
}
