import React from 'react';
import { Sparkles, CheckCircle, XCircle, Play, Layers } from 'lucide-react';

export default function TestCasePanel({
  testResults = [],
  onGenerateTestCases,
  onLoadTestCase,
  passCount = 0,
  totalCount = 0
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Automated Test Cases</span>
            {totalCount > 0 && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  passCount === totalCount
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}
              >
                {passCount}/{totalCount} Passed
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Executes 6 generated input scenarios against your flowchart graph to compare expected vs actual results.
          </p>
        </div>

        <button
          onClick={onGenerateTestCases}
          className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>✨ Run Test Suite</span>
        </button>
      </div>

      {testResults.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
          Click <span className="font-bold text-indigo-600 dark:text-indigo-400">"✨ Run Test Suite"</span> to run automated tests against your flowchart.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Test Scenario</th>
                <th className="py-2.5 px-3">Input Values</th>
                <th className="py-2.5 px-3">Expected Output</th>
                <th className="py-2.5 px-3">Flowchart Output</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {testResults.map((tr) => (
                <tr
                  key={tr.testCase.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {tr.testCase.name}
                  </td>

                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {Object.entries(tr.testCase.inputs).map(([k, v]) => `${k}=${v}`).join(', ')}
                  </td>

                  <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {String(tr.testCase.expected)}
                  </td>

                  <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {String(tr.actual)}
                  </td>

                  <td className="py-2.5 px-3">
                    {tr.pass ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        FAIL
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onLoadTestCase(tr.testCase)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Load into Simulator"
                    >
                      <Play className="w-3 h-3" />
                      Test Input
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
