import React, { useState, useEffect } from 'react';
import { PROBLEMS } from './data/problemsData';
import { evaluateFlowchart } from './utils/flowchartEvaluator';
import { verifyStructure, verifyLogic, generateIntelligentAnalysis } from './utils/verifier';

import Header from './components/Header';
import ProblemAndBuildPanel from './components/ProblemAndBuildPanel';
import FlowchartCanvas from './components/FlowchartCanvas';
import TestAndTracePanel from './components/TestAndTracePanel';
import VerificationSection from './components/VerificationSection';
import ProblemFinderModal from './components/ProblemFinderModal';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Stepper state: 'build' | 'test' | 'verify' | 'results'
  const [currentStep, setCurrentStep] = useState('build');

  // Problem State
  const [selectedProblemId, setSelectedProblemId] = useState('largest_three');
  const currentProblem = PROBLEMS.find(p => p.id === selectedProblemId) || PROBLEMS[0];

  // Flowchart Graph State
  const [nodes, setNodes] = useState(currentProblem.starterNodes);
  const [connections, setConnections] = useState(currentProblem.starterConnections);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Simulation Input State
  const [inputValues, setInputValues] = useState(currentProblem.defaultValues);

  // Simulation Execution State
  const [trace, setTrace] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [visitedNodeIds, setVisitedNodeIds] = useState([]);
  const [finalResult, setFinalResult] = useState(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(700);

  // Verification & Analysis State
  const [hasVerified, setHasVerified] = useState(false);
  const [isOutdated, setIsOutdated] = useState(false);
  const [structResult, setStructResult] = useState(null);
  const [logicResult, setLogicResult] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  // Spotlight Problem Finder Modal
  const [failingModalOpen, setFailingModalOpen] = useState(false);
  const [targetFailingCase, setTargetFailingCase] = useState(null);

  // Dark Mode toggle on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Problem Switching
  const handleSelectProblem = (probId) => {
    const newProb = PROBLEMS.find(p => p.id === probId);
    if (!newProb) return;

    setSelectedProblemId(probId);
    setNodes(newProb.starterNodes);
    setConnections(newProb.starterConnections);
    setInputValues(newProb.defaultValues);
    setSelectedNodeId(null);
    setHasVerified(false);
    setIsOutdated(false);
    setCurrentStep('build');
    resetSimulationState();

    const sRes = verifyStructure(newProb.starterNodes, newProb.starterConnections);
    const lRes = verifyLogic(newProb.starterNodes, newProb.starterConnections, newProb);
    setStructResult(sRes);
    setLogicResult(lRes);
  };

  // Reset Simulation State
  const resetSimulationState = () => {
    setIsRunning(false);
    setTrace([]);
    setCurrentStepIndex(-1);
    setActiveNodeId(null);
    setVisitedNodeIds([]);
    setFinalResult(undefined);
  };

  // Run Verification Engine on Demand
  const handleCheckFlowchart = () => {
    const sRes = verifyStructure(nodes, connections);
    const lRes = verifyLogic(nodes, connections, currentProblem);
    const aData = generateIntelligentAnalysis(sRes, lRes, currentProblem);

    setStructResult(sRes);
    setLogicResult(lRes);
    setAnalysisData(aData);
    setHasVerified(true);
    setIsOutdated(false);
    setCurrentStep(sRes.isStructureValid && lRes.isLogicValid ? 'results' : 'verify');

    // Scroll to verify section
    const elem = document.querySelector('#sec-verify');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  // Graph Mutation Handlers (Invalidates verification state when modified!)
  const invalidateVerification = () => {
    if (hasVerified) {
      setIsOutdated(true);
    }
  };

  const handleAddNode = (newNodeData) => {
    const id = `node-${Date.now()}`;
    const newNode = {
      id,
      ...newNodeData,
      x: 280,
      y: Math.max(40, ...nodes.map(n => n.y)) + 90
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(id);
    invalidateVerification();
  };

  const handleUpdateNode = (id, fields) => {
    setNodes(nodes.map(n => (n.id === id ? { ...n, ...fields } : n)));
    invalidateVerification();
  };

  const handleUpdateNodePosition = (id, x, y) => {
    setNodes(nodes.map(n => (n.id === id ? { ...n, x, y } : n)));
  };

  const handleDeleteNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.source !== id && c.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    invalidateVerification();
  };

  const handleAddConnection = (connData) => {
    const id = `c-${Date.now()}`;
    setConnections([...connections, { id, ...connData }]);
    invalidateVerification();
  };

  const handleDeleteConnection = (id) => {
    setConnections(connections.filter(c => c.id !== id));
    invalidateVerification();
  };

  // Reset to starter default flowchart
  const handleResetFlowchart = () => {
    setNodes(currentProblem.starterNodes);
    setConnections(currentProblem.starterConnections);
    setSelectedNodeId(null);
    setHasVerified(false);
    setIsOutdated(false);
    setCurrentStep('build');
    resetSimulationState();

    const sRes = verifyStructure(currentProblem.starterNodes, currentProblem.starterConnections);
    const lRes = verifyLogic(currentProblem.starterNodes, currentProblem.starterConnections, currentProblem);
    setStructResult(sRes);
    setLogicResult(lRes);
  };

  // Execute Step-by-Step Simulation Animation
  const handleRunSimulation = () => {
    resetSimulationState();
    const evalResult = evaluateFlowchart(nodes, connections, inputValues, currentProblem);

    setTrace(evalResult.trace);
    setFinalResult(evalResult.finalOutput);
    setCurrentStep('test');

    if (evalResult.trace.length === 0) return;

    setIsRunning(true);
    setCurrentStepIndex(0);
    setActiveNodeId(evalResult.trace[0].nodeId);
    setVisitedNodeIds(evalResult.visitedNodeIds);
  };

  // Auto-play timer for simulation steps
  useEffect(() => {
    let timer;
    if (isRunning && currentStepIndex >= 0 && currentStepIndex < trace.length - 1) {
      timer = setTimeout(() => {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        setActiveNodeId(trace[nextIdx].nodeId);
      }, speed);
    } else if (isRunning && currentStepIndex >= trace.length - 1) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, trace, speed]);

  const handleNextStep = () => {
    if (trace.length === 0) {
      handleRunSimulation();
      return;
    }
    if (currentStepIndex < trace.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setActiveNodeId(trace[nextIdx].nodeId);
    }
  };

  // Load a Test Case into Simulator
  const handleLoadTestCase = (testCase) => {
    setInputValues({ ...testCase.inputs });
    resetSimulationState();
    setTimeout(() => {
      const evalResult = evaluateFlowchart(nodes, connections, testCase.inputs, currentProblem);
      setTrace(evalResult.trace);
      setFinalResult(evalResult.finalOutput);
      setIsRunning(true);
      setCurrentStepIndex(0);
      setActiveNodeId(evalResult.trace[0]?.nodeId || null);
      setVisitedNodeIds(evalResult.visitedNodeIds);
      setCurrentStep('test');
    }, 50);
  };

  // Change input value helper (single key or 'all')
  const handleChangeInputValue = (key, val) => {
    if (key === 'all') {
      setInputValues({ ...val });
    } else {
      setInputValues({ ...inputValues, [key]: val });
    }
  };

  // "🔎 Find a Problem" Feature
  const handleFindProblem = () => {
    if (!logicResult) return;
    const failing = logicResult.testResults.find(t => !t.pass);
    if (failing) {
      setTargetFailingCase(failing);
      setFailingModalOpen(true);
    }
  };

  const handleLoadAndHighlightFailingCase = () => {
    if (!targetFailingCase) return;
    setFailingModalOpen(false);
    handleLoadTestCase(targetFailingCase.testCase);
  };

  const hasFailingTest = logicResult && logicResult.passCount < logicResult.totalCount;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Header with Progress Stepper */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentStep={currentStep}
      />

      {/* Main 3-Column Desktop Workspace (Problem/Build | Canvas | Test/Verify) */}
      <main id="sec-workspace" className="max-w-[1700px] w-full mx-auto p-4 sm:p-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* COLUMN 1: LEFT SIDEBAR — Problem Selector & Build Tools (~23% width / 3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <ProblemAndBuildPanel
              selectedProblemId={selectedProblemId}
              onSelectProblem={handleSelectProblem}
              nodes={nodes}
              connections={connections}
              selectedNodeId={selectedNodeId}
              onAddNode={handleAddNode}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
              onAddConnection={handleAddConnection}
              onDeleteConnection={handleDeleteConnection}
              problem={currentProblem}
            />
          </div>

          {/* COLUMN 2: CENTER — Dominant Flowchart Canvas (~54% width / 6.5 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <FlowchartCanvas
              nodes={nodes}
              connections={connections}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onUpdateNodePosition={handleUpdateNodePosition}
              activeNodeId={activeNodeId}
              visitedNodeIds={visitedNodeIds}
              onResetFlowchart={handleResetFlowchart}
            />
          </div>

          {/* COLUMN 3: RIGHT SIDEBAR — Test, Trace & Verification (~23% width / 2.5 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <section id="sec-test">
              <TestAndTracePanel
                problem={currentProblem}
                inputValues={inputValues}
                onChangeInput={handleChangeInputValue}
                onRunSimulation={handleRunSimulation}
                onNextStep={handleNextStep}
                onResetSimulation={resetSimulationState}
                isRunning={isRunning}
                stepIndex={currentStepIndex}
                totalSteps={trace.length}
                speed={speed}
                setSpeed={setSpeed}
                trace={trace}
                finalResult={finalResult}
                testResults={logicResult?.testResults || []}
                onLoadTestCase={handleLoadTestCase}
              />
            </section>

            <section id="sec-verify">
              <VerificationSection
                structResult={structResult}
                logicResult={logicResult}
                analysisData={analysisData}
                onRunVerification={handleCheckFlowchart}
                hasVerified={hasVerified}
                isOutdated={isOutdated}
                onFindProblem={handleFindProblem}
                hasFailingTest={hasFailingTest}
              />
            </section>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 py-3.5 px-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        Python Flowchart Lab • Unit 1: Computational Thinking & Programming Basics • 100% Local Browser Engine
      </footer>

      {/* Spotlight Problem Finder Modal */}
      {failingModalOpen && (
        <ProblemFinderModal
          failingCase={targetFailingCase}
          onClose={() => setFailingModalOpen(false)}
          onLoadAndHighlight={handleLoadAndHighlightFailingCase}
        />
      )}

    </div>
  );
}
