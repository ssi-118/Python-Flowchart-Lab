import React from 'react';
import { PROBLEMS } from '../data/problemsData';
import { ChevronDown, BookOpen } from 'lucide-react';

export default function ProblemSelector({ selectedProblemId, onSelectProblem }) {
  const selectedProblem = PROBLEMS.find(p => p.id === selectedProblemId) || PROBLEMS[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Title & Dropdown Label */}
        <div className="flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
            Unit 1 Problem Challenge
          </label>
          <div className="relative">
            <select
              value={selectedProblemId}
              onChange={(e) => onSelectProblem(e.target.value)}
              className="w-full sm:max-w-md px-3.5 py-2.5 pr-10 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-indigo-500/50 dark:border-indigo-500/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer appearance-none shadow-sm"
            >
              {PROBLEMS.map((prob) => (
                <option key={prob.id} value={prob.id}>
                  {prob.title} — ({prob.badge})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Selected Problem Description Pill */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/50 p-3 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 text-xs sm:max-w-md">
          <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-0.5">
            {selectedProblem.title}
          </span>
          <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {selectedProblem.description}
          </p>
        </div>

      </div>
    </div>
  );
}
