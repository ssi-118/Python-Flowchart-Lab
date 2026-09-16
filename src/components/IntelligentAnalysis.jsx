import React from 'react';
import { Brain, Search, Sparkles, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

export default function IntelligentAnalysis({
  analysisData,
  onFindProblem,
  hasFailingTest
}) {
  if (!analysisData) return null;

  const isSuccess = analysisData.type === 'SUCCESS';
  const isError = analysisData.type === 'ERROR';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-sm ${
        isSuccess
          ? 'bg-gradient-to-r from-emerald-50/90 to-teal-50/90 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200 dark:border-emerald-800'
          : isError
          ? 'bg-gradient-to-r from-rose-50/90 to-amber-50/90 dark:from-rose-950/40 dark:to-amber-950/40 border-rose-200 dark:border-rose-800'
          : 'bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-200 dark:border-amber-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isSuccess
                ? 'bg-emerald-600 text-white'
                : isError
                ? 'bg-rose-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🧠 Intelligent Analysis</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300">
                Rule-Based System
              </span>
            </h3>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {analysisData.headline}
            </p>
          </div>
        </div>

        {/* 🔎 Find a Problem Button */}
        {hasFailingTest && (
          <button
            onClick={onFindProblem}
            className="py-2 px-3.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 shrink-0 animate-pulse"
          >
            <Search className="w-4 h-4" />
            <span>🔎 Find a Problem</span>
          </button>
        )}
      </div>

      {/* Explanation Text */}
      <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed shadow-inner">
        {analysisData.summary}
      </div>
    </div>
  );
}
