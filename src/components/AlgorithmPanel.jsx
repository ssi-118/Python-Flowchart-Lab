import React, { useState } from 'react';
import { FileText, Code2, Copy, Check } from 'lucide-react';

export default function AlgorithmPanel({ problem }) {
  const [activeTab, setActiveTab] = useState('algorithm');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeTab === 'algorithm' ? problem.algorithm.join('\n') : problem.pseudocode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors flex flex-col h-full">
      {/* Panel Tab Header */}
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('algorithm')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'algorithm'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Algorithm
          </button>

          <button
            onClick={() => setActiveTab('pseudocode')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pseudocode'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Pseudocode
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 overflow-y-auto max-h-[300px]">
        {activeTab === 'algorithm' ? (
          <div className="space-y-1.5 font-sans text-xs">
            {problem.algorithm.map((step, idx) => (
              <div
                key={idx}
                className="text-slate-700 dark:text-slate-300 py-1 px-2 rounded hover:bg-white dark:hover:bg-slate-900/60 transition-colors font-medium leading-relaxed"
              >
                {step}
              </div>
            ))}
          </div>
        ) : (
          <pre className="font-mono text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed whitespace-pre-wrap">
            {problem.pseudocode}
          </pre>
        )}
      </div>
    </div>
  );
}
