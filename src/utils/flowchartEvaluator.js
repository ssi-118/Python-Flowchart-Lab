// Flowchart Graph Evaluator and Expression Engine

/**
 * Safely evaluates a math/boolean expression string using dynamic variable scope
 */
export function evaluateExpression(expr, scope) {
  if (!expr) return null;
  
  // Clean up assignment left-hand side if present (e.g. "largest = A" -> "A")
  let cleanExpr = expr;
  if (expr.includes('=')) {
    const parts = expr.split('=');
    // If it's an assignment (not comparison == or >= or <=)
    if (!['>', '<', '!', '='].includes(parts[0].slice(-1))) {
      cleanExpr = parts.slice(1).join('=').trim();
    }
  }

  // Replace problem variable tokens in expression with their values in scope
  // Sort scope keys by length descending to prevent partial variable name replacing (e.g. Total vs T)
  const keys = Object.keys(scope).sort((a, b) => b.length - a.length);
  
  // Replace string literals temporarily
  let evalString = cleanExpr;
  
  // Replace standard logical operators
  evalString = evalString
    .replace(/\bAND\b/gi, '&&')
    .replace(/\bOR\b/gi, '||')
    .replace(/\bNOT\b/gi, '!');

  // Build a Function body with scope variables declared
  try {
    const paramNames = keys;
    const paramValues = keys.map(k => scope[k]);
    const fn = new Function(...paramNames, `return (${evalString});`);
    return fn(...paramValues);
  } catch (err) {
    console.warn('Evaluation error for expression:', expr, err);
    return null;
  }
}

/**
 * Executes a process statement like "largest = A" or "bill = Units * 1.5"
 */
export function executeStatement(stmt, scope) {
  if (!stmt) return { scope, varName: null, varValue: null };

  const newScope = { ...scope };
  if (stmt.toLowerCase().startsWith('read ')) return { scope: newScope, varName: null };
  if (stmt.toLowerCase().startsWith('output =')) {
    const rhs = stmt.split('=')[1].trim();
    const val = evaluateExpression(rhs, scope);
    newScope.output = val;
    return { scope: newScope, varName: 'output', varValue: val };
  }

  if (stmt.includes('=')) {
    const eqIdx = stmt.indexOf('=');
    const varName = stmt.substring(0, eqIdx).trim();
    const rhs = stmt.substring(eqIdx + 1).trim();
    const val = evaluateExpression(rhs, scope);
    newScope[varName] = val;
    return { scope: newScope, varName, varValue: val };
  }

  return { scope: newScope, varName: null, varValue: null };
}

/**
 * Traverses and executes the flowchart graph step-by-step
 */
export function evaluateFlowchart(nodes, connections, inputVars, problem) {
  const vars = { ...inputVars };
  const trace = [];
  const visitedNodeIds = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Find START node
  const startNode = nodes.find(n => n.type === 'START');
  if (!startNode) {
    return {
      success: false,
      error: 'Missing START node in flowchart.',
      trace: [{ step: 1, node: null, type: 'ERROR', text: 'Error: Flowchart has no START node.', vars: { ...vars } }],
      visitedNodeIds: []
    };
  }

  let currNode = startNode;
  let stepNum = 1;
  const maxSteps = 100;
  let finalOutput = undefined;

  while (currNode && stepNum <= maxSteps) {
    visitedNodeIds.push(currNode.id);

    // Get outgoing connections from current node
    const outgoing = connections.filter(c => c.source === currNode.id);

    if (currNode.type === 'START') {
      trace.push({
        step: stepNum++,
        nodeId: currNode.id,
        nodeType: 'START',
        text: `Program started. Initializing variables.`,
        vars: { ...vars }
      });

      if (outgoing.length === 0) {
        trace.push({
          step: stepNum,
          nodeId: currNode.id,
          nodeType: 'ERROR',
          text: `Error: START node has no outgoing connection.`,
          vars: { ...vars }
        });
        return { success: false, error: 'START node is disconnected.', trace, visitedNodeIds };
      }
      currNode = nodeMap.get(outgoing[0].target);
    }
    else if (currNode.type === 'INPUT') {
      const formattedInputs = Object.entries(inputVars).map(([k, v]) => `${k} = ${v}`).join(', ');
      trace.push({
        step: stepNum++,
        nodeId: currNode.id,
        nodeType: 'INPUT',
        text: `Input values received: ${formattedInputs}`,
        vars: { ...vars }
      });

      if (outgoing.length === 0) {
        return { success: false, error: `Input node '${currNode.label}' has no outgoing connection.`, trace, visitedNodeIds };
      }
      currNode = nodeMap.get(outgoing[0].target);
    }
    else if (currNode.type === 'PROCESS') {
      const code = currNode.code || currNode.label;
      const res = executeStatement(code, vars);
      Object.assign(vars, res.scope);

      let detail = `Executed calculation: ${currNode.label}`;
      if (res.varName && res.varValue !== null) {
        detail += ` → (${res.varName} = ${res.varValue})`;
      }

      trace.push({
        step: stepNum++,
        nodeId: currNode.id,
        nodeType: 'PROCESS',
        text: detail,
        vars: { ...vars }
      });

      if (outgoing.length === 0) {
        return { success: false, error: `Process node '${currNode.label}' is missing an outgoing connection.`, trace, visitedNodeIds };
      }
      currNode = nodeMap.get(outgoing[0].target);
    }
    else if (currNode.type === 'DECISION') {
      const expr = currNode.code || currNode.label;
      const condBool = evaluateExpression(expr, vars);
      const branchLabel = condBool ? 'YES' : 'NO';

      trace.push({
        step: stepNum++,
        nodeId: currNode.id,
        nodeType: 'DECISION',
        text: `Checked condition '${currNode.label}': evaluated ${condBool ? 'TRUE' : 'FALSE'} → Branch taken: ${branchLabel}`,
        vars: { ...vars }
      });

      // Find connection with matching label (case-insensitive)
      const targetConn = outgoing.find(c => (c.label || '').toUpperCase() === branchLabel);

      if (!targetConn) {
        const errorText = `Decision node '${currNode.label}' has no outgoing '${branchLabel}' branch connection.`;
        trace.push({
          step: stepNum,
          nodeId: currNode.id,
          nodeType: 'ERROR',
          text: `Error: ${errorText}`,
          vars: { ...vars }
        });
        return { success: false, error: errorText, trace, visitedNodeIds };
      }

      currNode = nodeMap.get(targetConn.target);
    }
    else if (currNode.type === 'OUTPUT') {
      // Determine final output value from variable environment
      if (vars.output !== undefined) finalOutput = vars.output;
      else if (vars[problem.outputKey] !== undefined) finalOutput = vars[problem.outputKey];
      else {
        // Fallback to last updated numerical or string variable
        const keys = Object.keys(vars).filter(k => !Object.keys(inputVars).includes(k));
        if (keys.length > 0) finalOutput = vars[keys[keys.length - 1]];
        else finalOutput = Object.values(vars)[0];
      }

      trace.push({
        step: stepNum++,
        nodeId: currNode.id,
        nodeType: 'OUTPUT',
        text: `Displayed result: ${problem.outputLabel || 'Output'} = ${finalOutput}`,
        vars: { ...vars }
      });

      if (outgoing.length === 0) {
        return { success: false, error: `Output node '${currNode.label}' has no connection to END.`, trace, visitedNodeIds };
      }
      currNode = nodeMap.get(outgoing[0].target);
    }
    else if (currNode.type === 'END') {
      trace.push({
        step: stepNum++,
        nodeId: currNode.id,
        nodeType: 'END',
        text: `Program execution finished successfully.`,
        vars: { ...vars }
      });
      break;
    }
    else {
      break;
    }
  }

  if (stepNum > maxSteps) {
    return {
      success: false,
      error: 'Execution exceeded maximum allowed steps (potential infinite loop).',
      trace,
      visitedNodeIds
    };
  }

  return {
    success: true,
    finalOutput,
    trace,
    visitedNodeIds,
    vars
  };
}
