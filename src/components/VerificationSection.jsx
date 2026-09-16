import React from 'react';
import { Cpu, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Search, AlertCircle } from 'lucide-react';

export default function VerificationSection({
  structResult,
  logicResult,
  analysisData,
  onRunVerification,
  hasVerified,
  isOutdated,
  onFindProblem,
  hasFailingTest
}) {
  const isVerified = structResult?.isStructureValid && logicResult?.isLogicValid;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>FLOWCHART VERIFICATION</span>
        </h2>

        {hasFailingTest && hasVerified && !isOutdated && (
          <button
            onClick={onFindProblem}
            className="py-1 px-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer animate-pulse"
          >
            <Search className="w-3 h-3" />
            <span>Find Problem</span>
          </button>
        )}
      </div>

      {/* Outdated Verification Notice */}
      {isOutdated && hasVerified && (
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Verification outdated — flowchart was modified. Run verification again.</span>
        </div>
      )}

      {/* Pre-Verification State */}
      {!hasVerified || isOutdated ? (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Ready to verify your flowchart.
          </p>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span>• Structure</span>
            <span>• Connections</span>
            <span>• Decision branches</span>
            <span>• Logic execution</span>
          </div>

          <button
            onClick={onRunVerification}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Flowchart</span>
          </button>
        </div>
      ) : (
        /* Post-Verification Results */
        <div className="space-y-3 animate-in fade-in duration-200">
          
          {/* Status Badge */}
          <div
            className={`p-3 rounded-xl border ${
              isVerified
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            <h3 className="text-xs font-extrabold flex items-center gap-1.5">
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>✓ FLOWCHART VERIFIED</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>⚠ Flowchart needs attention</span>
                </>
              )}
            </h3>

            {analysisData && (
              <p className="text-[11px] font-medium mt-1 leading-relaxed whitespace-pre-line">
                {analysisData.summary}
              </p>
            )}
          </div>

          {/* Results Checklist */}
          <div className="space-y-1.5 text-xs font-medium">
            <div className="flex items-center gap-2">
              {structResult.isStructureValid ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span className="text-slate-700 dark:text-slate-300">Structure valid</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Start/End present</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Nodes connected</span>
            </div>

            <div className="flex items-center gap-2">
              {logicResult.isLogicValid ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span className="text-slate-700 dark:text-slate-300">
                Test cases passed ({logicResult.passCount}/{logicResult.totalCount})
              </span>
            </div>
          </div>

          <button
            onClick={onRunVerification}
            className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-check Flowchart</span>
          </button>
        </div>
      )}

    </div>
  );
}
