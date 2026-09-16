import React from 'react';
import { Network, Sun, Moon, Check, BookOpen } from 'lucide-react';

export default function Header({ isDarkMode, setIsDarkMode, currentStep }) {
  // Stepper definition: 1. Build -> 2. Test -> 3. Verify -> 4. Results
  const steps = [
    { id: 'build', label: 'Build', anchor: '#sec-workspace' },
    { id: 'test', label: 'Test', anchor: '#sec-test' },
    { id: 'verify', label: 'Verify', anchor: '#sec-verify' },
    { id: 'results', label: 'Results', anchor: '#sec-verify' }
  ];

  const getStepStatus = (stepId) => {
    const order = ['build', 'test', 'verify', 'results'];
    const currIdx = order.indexOf(currentStep);
    const stepIdx = order.indexOf(stepId);

    if (stepIdx < currIdx) return 'completed';
    if (stepIdx === currIdx) return 'current';
    return 'future';
  };

  const handleStepClick = (anchor) => {
    const elem = document.querySelector(anchor);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      
      {/* Top Header Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
        
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                Python Flowchart Lab
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <BookOpen className="w-3 h-3" />
                Unit 1
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Computational Thinking & Algorithm Logic Simulator
            </p>
          </div>
        </div>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 py-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-2 sm:gap-6 text-xs font-bold">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.id);

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && <span className="text-slate-300 dark:text-slate-700 font-normal">→</span>}
                <button
                  onClick={() => handleStepClick(step.anchor)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    status === 'completed'
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'
                      : status === 'current'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                      : 'text-slate-400 dark:text-slate-600 font-medium'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                  ) : status === 'current' ? (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  )}
                  <span>{step.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </header>
  );
}
