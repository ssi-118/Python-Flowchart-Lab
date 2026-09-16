import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Cpu, RefreshCw, Sparkles, Brain, Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function VerificationPanel({
  structResult,
  logicResult,
  analysisData,
  onRunVerification,
  hasVerified,
  onFindProblem,
  hasFailingTest
}) {
  const isVerified = structResult?.isStructureValid && logicResult?.isLogicValid;
  const [detailsExpanded, setDetailsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Intelligent Verification & Analysis</span>
            {hasVerified && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {isVerified ? 'FLOWCHART VERIFIED' : 'NEEDS REVIEW'}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rule-based engine checks node graph structure, branch paths, and logic execution against test cases.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasFailingTest && (
            <button
              onClick={onFindProblem}
              className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Search className="w-3.5 h-3.5" />
              <span>🔎 Find Problem</span>
            </button>
          )}

          <button
            onClick={onRunVerification}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Flowchart</span>
          </button>
        </div>
      </div>

      {/* Initial Standby Card */}
      {!hasVerified ? (
        <div className="mt-4 p-6 text-center bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Flowchart Verification Standby
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md font-medium">
            Click <span className="font-bold text-indigo-600 dark:text-indigo-400">"Check Flowchart"</span> above to test graph structure, branch connectivity, and logic accuracy against all test cases.
          </p>
        </div>
      ) : (
        /* Unified Verification & Analysis Card */
        <div className="mt-4 space-y-4 animate-in fade-in duration-200">
          
          {/* Analysis Explanation Header */}
          {analysisData && (
            <div className={`p-4 rounded-xl border ${isVerified ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'}`}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                  <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{analysisData.headline}</span>
                </div>
                <button
                  onClick={() => setDetailsExpanded(!detailsExpanded)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <span>{detailsExpanded ? 'Hide Details' : 'Show Details'}</span>
                  {detailsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {analysisData.summary}
              </p>
            </div>
          )}

          {/* Expandable Structural & Logic Details */}
          {detailsExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              
              {/* Structural Checks */}
              <div className="bg-slate-50/80 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
                  <span>A. Structural Graph Checks</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${structResult.isStructureValid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
                    {structResult.isStructureValid ? 'VALID' : 'ISSUES'}
                  </span>
                </h3>

                <div className="space-y-1.5">
                  {structResult.checks.map((chk, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      {chk.status === 'PASS' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                      )}
                      <span className="font-medium text-slate-700 dark:text-slate-300">{chk.msg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logic Execution */}
              <div className="bg-slate-50/80 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
                  <span>B. Logic Execution Pass Rate</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {logicResult.passCount}/{logicResult.totalCount} PASSED
                  </span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${logicResult.isLogicValid ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${(logicResult.passCount / logicResult.totalCount) * 100}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {logicResult.isLogicValid
                      ? '✓ All 6 test inputs evaluate to expected outputs.'
                      : `⚠ ${logicResult.totalCount - logicResult.passCount} test case(s) produced unexpected logic output.`}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
