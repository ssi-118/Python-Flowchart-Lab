// Intelligent Local Verification Engine & Diagnostic Rule Synthesis

import { evaluateFlowchart } from './flowchartEvaluator';

/**
 * Performs Structural Verification on the flowchart graph
 */
export function verifyStructure(nodes, connections) {
  const checks = [];

  // Check 1: START node existence
  const startNodes = nodes.filter(n => n.type === 'START');
  if (startNodes.length === 1) {
    checks.push({ title: 'Start Node', status: 'PASS', msg: 'Single valid START node present.' });
  } else if (startNodes.length === 0) {
    checks.push({ title: 'Start Node', status: 'FAIL', msg: 'Missing START node in flowchart.' });
  } else {
    checks.push({ title: 'Start Node', status: 'FAIL', msg: 'Multiple START nodes found. Only 1 is allowed.' });
  }

  // Check 2: END node existence
  const endNodes = nodes.filter(n => n.type === 'END');
  if (endNodes.length >= 1) {
    checks.push({ title: 'End Node', status: 'PASS', msg: 'Valid END node present.' });
  } else {
    checks.push({ title: 'End Node', status: 'FAIL', msg: 'Missing END node in flowchart.' });
  }

  // Check 3: Input Node existence
  const inputNodes = nodes.filter(n => n.type === 'INPUT');
  if (inputNodes.length >= 1) {
    checks.push({ title: 'Input Node', status: 'PASS', msg: 'Input node configured to read problem values.' });
  } else {
    checks.push({ title: 'Input Node', status: 'WARN', msg: 'No INPUT node detected.' });
  }

  // Check 4: Output Node existence
  const outputNodes = nodes.filter(n => n.type === 'OUTPUT');
  if (outputNodes.length >= 1) {
    checks.push({ title: 'Output Node', status: 'PASS', msg: 'Output node configured to display final result.' });
  } else {
    checks.push({ title: 'Output Node', status: 'FAIL', msg: 'Missing OUTPUT node in flowchart.' });
  }

  // Check 5: Decision Node Branch Completeness
  const decisionNodes = nodes.filter(n => n.type === 'DECISION');
  let decisionBranchErrors = 0;

  decisionNodes.forEach(dNode => {
    const outgoing = connections.filter(c => c.source === dNode.id);
    const hasYes = outgoing.some(c => (c.label || '').toUpperCase() === 'YES');
    const hasNo = outgoing.some(c => (c.label || '').toUpperCase() === 'NO');

    if (!hasYes || !hasNo) {
      decisionBranchErrors++;
    }
  });

  if (decisionNodes.length === 0) {
    checks.push({ title: 'Decision Branches', status: 'PASS', msg: 'No decision nodes in this sequential flowchart.' });
  } else if (decisionBranchErrors === 0) {
    checks.push({ title: 'Decision Branches', status: 'PASS', msg: 'All decision nodes have YES and NO branches connected.' });
  } else {
    checks.push({ title: 'Decision Branches', status: 'FAIL', msg: `${decisionBranchErrors} decision node(s) missing required YES or NO branch connections.` });
  }

  // Check 6: Graph Connectivity / Unreachable Nodes
  const reachableNodeIds = new Set();
  if (startNodes.length === 1) {
    const queue = [startNodes[0].id];
    reachableNodeIds.add(startNodes[0].id);

    while (queue.length > 0) {
      const currentId = queue.shift();
      const outgoing = connections.filter(c => c.source === currentId);
      outgoing.forEach(conn => {
        if (!reachableNodeIds.has(conn.target)) {
          reachableNodeIds.add(conn.target);
          queue.push(conn.target);
        }
      });
    }
  }

  const unreachableCount = nodes.length - reachableNodeIds.size;
  if (unreachableCount === 0) {
    checks.push({ title: 'Path Connectivity', status: 'PASS', msg: 'All nodes are connected and reachable from START.' });
  } else {
    checks.push({ title: 'Path Connectivity', status: 'FAIL', msg: `${unreachableCount} isolated or unreachable node(s) detected.` });
  }

  const isStructureValid = checks.every(c => c.status !== 'FAIL');
  return { isStructureValid, checks, reachableNodeIds: Array.from(reachableNodeIds) };
}

/**
 * Performs Logic Verification against generated test cases
 */
export function verifyLogic(nodes, connections, problem) {
  const testCases = problem.generateTestCases();
  const testResults = [];
  let passCount = 0;

  testCases.forEach(tc => {
    const evalRes = evaluateFlowchart(nodes, connections, tc.inputs, problem);

    let isPass = false;
    let actual = evalRes.finalOutput;

    if (evalRes.success && actual !== undefined && actual !== null) {
      if (typeof tc.expected === 'number') {
        isPass = Math.abs(Number(actual) - Number(tc.expected)) < 0.001;
      } else {
        isPass = String(actual).trim().toUpperCase() === String(tc.expected).trim().toUpperCase();
      }
    }

    if (isPass) passCount++;

    testResults.push({
      testCase: tc,
      pass: isPass,
      actual: evalRes.success ? (actual !== undefined ? actual : 'No Output') : 'Execution Error',
      error: evalRes.error,
      trace: evalRes.trace,
      visitedNodeIds: evalRes.visitedNodeIds
    });
  });

  const totalCount = testCases.length;
  const isLogicValid = passCount === totalCount;

  return { isLogicValid, passCount, totalCount, testResults };
}

/**
 * Synthesizes intelligent rule-based explanation analysis
 */
export function generateIntelligentAnalysis(structRes, logicRes, problem) {
  if (!structRes.isStructureValid) {
    const failChecks = structRes.checks.filter(c => c.status === 'FAIL');
    const reasons = failChecks.map(c => `• ${c.title}: ${c.msg}`).join('\n');
    return {
      type: 'ERROR',
      headline: 'Structural Flaws Detected',
      summary: `Your flowchart structure is incomplete or broken:\n${reasons}\n\nTip: Make sure every decision node has both YES and NO outgoing branches and connects properly to an Output or End node.`
    };
  }

  if (logicRes.isLogicValid) {
    return {
      type: 'SUCCESS',
      headline: 'Flowchart Fully Verified!',
      summary: `The flowchart contains all required Start, Input, Decision, Output, and End nodes. All ${logicRes.totalCount}/${logicRes.totalCount} generated test cases produced expected results! The algorithm logic matches the Unit 1 requirement for "${problem.title}".`
    };
  }

  // Logic issues exist - find failing cases
  const failing = logicRes.testResults.filter(t => !t.pass);
  const firstFail = failing[0];

  let hint = '';
  if (problem.id === 'largest_three') {
    if (firstFail.testCase.inputs.C > firstFail.testCase.inputs.A && firstFail.testCase.inputs.C > firstFail.testCase.inputs.B) {
      hint = 'The flowchart fails when Value C is the largest number. Check if the decision branch comparing B and C routes correctly to largest = C.';
    } else if (firstFail.testCase.inputs.B > firstFail.testCase.inputs.A) {
      hint = 'The flowchart fails when Value B is the largest number. Verify the decision logic for B > C.';
    }
  } else if (problem.id === 'student_grade') {
    hint = `Failing score case (${JSON.stringify(firstFail.testCase.inputs)}). Check the decision boundaries (e.g. Marks >= 90, 75, 50).`;
  } else if (problem.id === 'electricity_bill') {
    hint = `Failing consumption case (${JSON.stringify(firstFail.testCase.inputs)}). Verify slab calculation formulas (Units <= 100 vs Units <= 200).`;
  }

  return {
    type: 'WARNING',
    headline: 'Logic Issue Detected',
    summary: `The flowchart structure is valid, but ${logicRes.passCount}/${logicRes.totalCount} test cases passed.\nFailed case: ${firstFail.testCase.name} (Inputs: ${JSON.stringify(firstFail.testCase.inputs)} → Expected "${firstFail.testCase.expected}", got "${firstFail.actual}").\n\n${hint || 'Review the decision expressions and process statements to handle all input variations.'}`
  };
}
