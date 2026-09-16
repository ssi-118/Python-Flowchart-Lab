// Computational Thinking & Programming Basics Problems Data

export const PROBLEMS = [
  {
    id: 'largest_three',
    title: '1. Largest of Three Numbers',
    badge: 'Decision Logic',
    icon: 'Trophy',
    description: 'Read three numbers (A, B, C) and determine which one has the maximum value.',
    inputs: [
      { name: 'A', label: 'Value A', defaultVal: 25, type: 'number' },
      { name: 'B', label: 'Value B', defaultVal: 12, type: 'number' },
      { name: 'C', label: 'Value C', defaultVal: 18, type: 'number' }
    ],
    defaultValues: { A: 25, B: 12, C: 18 },
    outputKey: 'largest',
    outputLabel: 'Largest Value',
    algorithm: [
      '1. Start',
      '2. Input three values: A, B, and C',
      '3. Check if A > B AND A > C:',
      '   - If YES: Set largest = A',
      '   - If NO: Proceed to compare B and C',
      '4. Check if B > C:',
      '   - If YES: Set largest = B',
      '   - If NO: Set largest = C',
      '5. Output largest',
      '6. End'
    ],
    pseudocode: `START
INPUT A, B, C

IF A > B AND A > C THEN
    largest = A
ELSE IF B > C THEN
    largest = B
ELSE
    largest = C
ENDIF

OUTPUT largest
END`,
    starterNodes: [
      { id: 'node-start', type: 'START', label: 'START', x: 280, y: 30 },
      { id: 'node-in', type: 'INPUT', label: 'Input A, B, C', code: 'read A, B, C', x: 260, y: 110 },
      { id: 'node-dec1', type: 'DECISION', label: 'Is A > B AND A > C?', code: 'A > B && A > C', x: 230, y: 200 },
      { id: 'node-proc1', type: 'PROCESS', label: 'largest = A', code: 'largest = A', x: 70, y: 320 },
      { id: 'node-dec2', type: 'DECISION', label: 'Is B > C?', code: 'B > C', x: 390, y: 310 },
      { id: 'node-proc2', type: 'PROCESS', label: 'largest = B', code: 'largest = B', x: 300, y: 430 },
      { id: 'node-proc3', type: 'PROCESS', label: 'largest = C', code: 'largest = C', x: 500, y: 430 },
      { id: 'node-out', type: 'OUTPUT', label: 'Display largest', code: 'output = largest', x: 260, y: 540 },
      { id: 'node-end', type: 'END', label: 'END', x: 280, y: 630 }
    ],
    starterConnections: [
      { id: 'c1', source: 'node-start', target: 'node-in' },
      { id: 'c2', source: 'node-in', target: 'node-dec1' },
      { id: 'c3', source: 'node-dec1', target: 'node-proc1', label: 'YES' },
      { id: 'c4', source: 'node-dec1', target: 'node-dec2', label: 'NO' },
      { id: 'c5', source: 'node-proc1', target: 'node-out' },
      { id: 'c6', source: 'node-dec2', target: 'node-proc2', label: 'YES' },
      { id: 'c7', source: 'node-dec2', target: 'node-proc3', label: 'NO' },
      { id: 'c8', source: 'node-proc2', target: 'node-out' },
      { id: 'c9', source: 'node-proc3', target: 'node-out' },
      { id: 'c10', source: 'node-out', target: 'node-end' }
    ],
    generateTestCases: () => [
      { id: 't1', name: 'Default Case (A largest)', inputs: { A: 25, B: 12, C: 18 }, expected: 25 },
      { id: 't2', name: 'B is Largest', inputs: { A: 10, B: 50, C: 20 }, expected: 50 },
      { id: 't3', name: 'C is Largest', inputs: { A: 10, B: 20, C: 60 }, expected: 60 },
      { id: 't4', name: 'All Equal Values', inputs: { A: 15, B: 15, C: 15 }, expected: 15 },
      { id: 't5', name: 'Negative Values (C max)', inputs: { A: -10, B: -5, C: -2 }, expected: -2 },
      { id: 't6', name: 'Two Equal Largest (A & B)', inputs: { A: 40, B: 40, C: 10 }, expected: 40 }
    ],
    referenceEvaluator: (inputs) => {
      const { A, B, C } = inputs;
      return Math.max(Number(A), Number(B), Number(C));
    }
  },

  {
    id: 'student_grade',
    title: '2. Student Grade Calculation',
    badge: 'Multi-Branch Conditional',
    icon: 'GraduationCap',
    description: 'Calculate student letter grade (A, B, C, D, F) based on numerical score (0 to 100).',
    inputs: [
      { name: 'Marks', label: 'Exam Score (0-100)', defaultVal: 85, type: 'number', min: 0, max: 100 }
    ],
    defaultValues: { Marks: 85 },
    outputKey: 'grade',
    outputLabel: 'Calculated Grade',
    algorithm: [
      '1. Start',
      '2. Read score: Marks',
      '3. If Marks >= 90 -> grade = "A"',
      '4. Else if Marks >= 75 -> grade = "B"',
      '5. Else if Marks >= 50 -> grade = "C"',
      '6. Else if Marks >= 35 -> grade = "D"',
      '7. Else -> grade = "F"',
      '8. Display grade',
      '9. End'
    ],
    pseudocode: `START
INPUT Marks

IF Marks >= 90 THEN
    grade = "A"
ELSE IF Marks >= 75 THEN
    grade = "B"
ELSE IF Marks >= 50 THEN
    grade = "C"
ELSE IF Marks >= 35 THEN
    grade = "D"
ELSE
    grade = "F"
ENDIF

OUTPUT grade
END`,
    starterNodes: [
      { id: 'g-start', type: 'START', label: 'START', x: 280, y: 30 },
      { id: 'g-in', type: 'INPUT', label: 'Input Marks', code: 'read Marks', x: 260, y: 110 },
      { id: 'g-dec1', type: 'DECISION', label: 'Marks >= 90?', code: 'Marks >= 90', x: 250, y: 190 },
      { id: 'g-p1', type: 'PROCESS', label: 'grade = "A"', code: 'grade = "A"', x: 80, y: 280 },
      { id: 'g-dec2', type: 'DECISION', label: 'Marks >= 75?', code: 'Marks >= 75', x: 400, y: 280 },
      { id: 'g-p2', type: 'PROCESS', label: 'grade = "B"', code: 'grade = "B"', x: 260, y: 370 },
      { id: 'g-dec3', type: 'DECISION', label: 'Marks >= 50?', code: 'Marks >= 50', x: 520, y: 370 },
      { id: 'g-p3', type: 'PROCESS', label: 'grade = "C"', code: 'grade = "C"', x: 400, y: 460 },
      { id: 'g-p4', type: 'PROCESS', label: 'grade = "F"', code: 'grade = "F"', x: 620, y: 460 },
      { id: 'g-out', type: 'OUTPUT', label: 'Display grade', code: 'output = grade', x: 260, y: 570 },
      { id: 'g-end', type: 'END', label: 'END', x: 280, y: 660 }
    ],
    starterConnections: [
      { id: 'gc1', source: 'g-start', target: 'g-in' },
      { id: 'gc2', source: 'g-in', target: 'g-dec1' },
      { id: 'gc3', source: 'g-dec1', target: 'g-p1', label: 'YES' },
      { id: 'gc4', source: 'g-dec1', target: 'g-dec2', label: 'NO' },
      { id: 'gc5', source: 'g-dec2', target: 'g-p2', label: 'YES' },
      { id: 'gc6', source: 'g-dec2', target: 'g-dec3', label: 'NO' },
      { id: 'gc7', source: 'g-dec3', target: 'g-p3', label: 'YES' },
      { id: 'gc8', source: 'g-dec3', target: 'g-p4', label: 'NO' },
      { id: 'gc9', source: 'g-p1', target: 'g-out' },
      { id: 'gc10', source: 'g-p2', target: 'g-out' },
      { id: 'gc11', source: 'g-p3', target: 'g-out' },
      { id: 'gc12', source: 'g-p4', target: 'g-out' },
      { id: 'gc13', source: 'g-out', target: 'g-end' }
    ],
    generateTestCases: () => [
      { id: 'gt1', name: 'Grade A (Marks 95)', inputs: { Marks: 95 }, expected: 'A' },
      { id: 'gt2', name: 'Grade B (Marks 85)', inputs: { Marks: 85 }, expected: 'B' },
      { id: 'gt3', name: 'Grade C (Marks 60)', inputs: { Marks: 60 }, expected: 'C' },
      { id: 'gt4', name: 'Grade B Boundary (Marks 75)', inputs: { Marks: 75 }, expected: 'B' },
      { id: 'gt5', name: 'Failing Marks (Marks 30)', inputs: { Marks: 30 }, expected: 'F' },
      { id: 'gt6', name: 'Perfect Score (Marks 100)', inputs: { Marks: 100 }, expected: 'A' }
    ],
    referenceEvaluator: (inputs) => {
      const m = Number(inputs.Marks);
      if (m >= 90) return 'A';
      if (m >= 75) return 'B';
      if (m >= 50) return 'C';
      if (m >= 35) return 'D';
      return 'F';
    }
  },

  {
    id: 'electricity_bill',
    title: '3. Electricity Bill Calculation',
    badge: 'Tiered Pricing Algorithm',
    icon: 'Zap',
    description: 'Calculate monthly electricity bill based on unit consumption slab rates.',
    inputs: [
      { name: 'Units', label: 'Units Consumed', defaultVal: 250, type: 'number', min: 0 }
    ],
    defaultValues: { Units: 250 },
    outputKey: 'bill',
    outputLabel: 'Total Bill ($)',
    algorithm: [
      '1. Start',
      '2. Read Units',
      '3. If Units <= 100: bill = Units * 1.0',
      '4. Else if Units <= 200: bill = 100*1.0 + (Units - 100)*1.5',
      '5. Else: bill = 100*1.0 + 100*1.5 + (Units - 200)*2.0',
      '6. Display bill',
      '7. End'
    ],
    pseudocode: `START
INPUT Units

IF Units <= 100 THEN
    bill = Units * 1.0
ELSE IF Units <= 200 THEN
    bill = 100 + (Units - 100) * 1.5
ELSE
    bill = 250 + (Units - 200) * 2.0
ENDIF

OUTPUT bill
END`,
    starterNodes: [
      { id: 'eb-start', type: 'START', label: 'START', x: 280, y: 30 },
      { id: 'eb-in', type: 'INPUT', label: 'Input Units', code: 'read Units', x: 260, y: 110 },
      { id: 'eb-dec1', type: 'DECISION', label: 'Units <= 100?', code: 'Units <= 100', x: 250, y: 190 },
      { id: 'eb-p1', type: 'PROCESS', label: 'bill = Units * 1', code: 'bill = Units * 1', x: 90, y: 290 },
      { id: 'eb-dec2', type: 'DECISION', label: 'Units <= 200?', code: 'Units <= 200', x: 400, y: 290 },
      { id: 'eb-p2', type: 'PROCESS', label: 'bill = 100 + (Units-100)*1.5', code: 'bill = 100 + (Units - 100) * 1.5', x: 240, y: 390 },
      { id: 'eb-p3', type: 'PROCESS', label: 'bill = 250 + (Units-200)*2', code: 'bill = 250 + (Units - 200) * 2', x: 490, y: 390 },
      { id: 'eb-out', type: 'OUTPUT', label: 'Display bill', code: 'output = bill', x: 260, y: 500 },
      { id: 'eb-end', type: 'END', label: 'END', x: 280, y: 590 }
    ],
    starterConnections: [
      { id: 'ebc1', source: 'eb-start', target: 'eb-in' },
      { id: 'ebc2', source: 'eb-in', target: 'eb-dec1' },
      { id: 'ebc3', source: 'eb-dec1', target: 'eb-p1', label: 'YES' },
      { id: 'ebc4', source: 'eb-dec1', target: 'eb-dec2', label: 'NO' },
      { id: 'ebc5', source: 'eb-dec2', target: 'eb-p2', label: 'YES' },
      { id: 'ebc6', source: 'eb-dec2', target: 'eb-p3', label: 'NO' },
      { id: 'ebc7', source: 'eb-p1', target: 'eb-out' },
      { id: 'ebc8', source: 'eb-p2', target: 'eb-out' },
      { id: 'ebc9', source: 'eb-p3', target: 'eb-out' },
      { id: 'ebc10', source: 'eb-out', target: 'eb-end' }
    ],
    generateTestCases: () => [
      { id: 'ebt1', name: 'Low Consumption (50 units)', inputs: { Units: 50 }, expected: 50 },
      { id: 'ebt2', name: 'Slab 1 Boundary (100 units)', inputs: { Units: 100 }, expected: 100 },
      { id: 'ebt3', name: 'Medium Consumption (150 units)', inputs: { Units: 150 }, expected: 175 },
      { id: 'ebt4', name: 'Default High (250 units)', inputs: { Units: 250 }, expected: 350 },
      { id: 'ebt5', name: 'Heavy Usage (400 units)', inputs: { Units: 400 }, expected: 650 },
      { id: 'ebt6', name: 'Zero Consumption (0 units)', inputs: { Units: 0 }, expected: 0 }
    ],
    referenceEvaluator: (inputs) => {
      const u = Number(inputs.Units);
      if (u <= 100) return u * 1;
      if (u <= 200) return 100 + (u - 100) * 1.5;
      return 250 + (u - 200) * 2;
    }
  },

  {
    id: 'simple_interest',
    title: '4. Simple Interest',
    badge: 'Sequential Arithmetic',
    icon: 'Calculator',
    description: 'Calculate simple interest and total maturity amount given Principal, Rate, and Time.',
    inputs: [
      { name: 'P', label: 'Principal ($)', defaultVal: 1000, type: 'number', min: 0 },
      { name: 'R', label: 'Annual Rate (%)', defaultVal: 5, type: 'number', min: 0 },
      { name: 'T', label: 'Time (Years)', defaultVal: 2, type: 'number', min: 0 }
    ],
    defaultValues: { P: 1000, R: 5, T: 2 },
    outputKey: 'interest',
    outputLabel: 'Simple Interest ($)',
    algorithm: [
      '1. Start',
      '2. Read Principal P, Rate R, Time T',
      '3. Calculate interest = (P * R * T) / 100',
      '4. Calculate total = P + interest',
      '5. Display interest',
      '6. End'
    ],
    pseudocode: `START
INPUT P, R, T

interest = (P * R * T) / 100
total = P + interest

OUTPUT interest
END`,
    starterNodes: [
      { id: 'si-start', type: 'START', label: 'START', x: 280, y: 40 },
      { id: 'si-in', type: 'INPUT', label: 'Input P, R, T', code: 'read P, R, T', x: 260, y: 130 },
      { id: 'si-p1', type: 'PROCESS', label: 'interest = (P * R * T) / 100', code: 'interest = (P * R * T) / 100', x: 220, y: 230 },
      { id: 'si-p2', type: 'PROCESS', label: 'total = P + interest', code: 'total = P + interest', x: 240, y: 340 },
      { id: 'si-out', type: 'OUTPUT', label: 'Display interest', code: 'output = interest', x: 260, y: 440 },
      { id: 'si-end', type: 'END', label: 'END', x: 280, y: 540 }
    ],
    starterConnections: [
      { id: 'sic1', source: 'si-start', target: 'si-in' },
      { id: 'sic2', source: 'si-in', target: 'si-p1' },
      { id: 'sic3', source: 'si-p1', target: 'si-p2' },
      { id: 'sic4', source: 'si-p2', target: 'si-out' },
      { id: 'sic5', source: 'si-out', target: 'si-end' }
    ],
    generateTestCases: () => [
      { id: 'sit1', name: 'Standard Case ($1000, 5%, 2 yrs)', inputs: { P: 1000, R: 5, T: 2 }, expected: 100 },
      { id: 'sit2', name: 'High Interest ($5000, 10%, 3 yrs)', inputs: { P: 5000, R: 10, T: 3 }, expected: 1500 },
      { id: 'sit3', name: 'Short Period ($2000, 6%, 1 yr)', inputs: { P: 2000, R: 6, T: 1 }, expected: 120 },
      { id: 'sit4', name: 'Fractional Rate ($1500, 4.5%, 2 yrs)', inputs: { P: 1500, R: 4.5, T: 2 }, expected: 135 },
      { id: 'sit5', name: 'Zero Principal ($0, 5%, 3 yrs)', inputs: { P: 0, R: 5, T: 3 }, expected: 0 },
      { id: 'sit6', name: 'Decades Loan ($10000, 8%, 10 yrs)', inputs: { P: 10000, R: 8, T: 10 }, expected: 8000 }
    ],
    referenceEvaluator: (inputs) => {
      const P = Number(inputs.P);
      const R = Number(inputs.R);
      const T = Number(inputs.T);
      return (P * R * T) / 100;
    }
  },

  {
    id: 'area_calc',
    title: '5. Area Calculation',
    badge: 'Geometric Formulas',
    icon: 'Shapes',
    description: 'Calculate rectangle area given Width and Height dimensions.',
    inputs: [
      { name: 'Width', label: 'Width / Radius', defaultVal: 10, type: 'number', min: 0 },
      { name: 'Height', label: 'Height', defaultVal: 5, type: 'number', min: 0 }
    ],
    defaultValues: { Width: 10, Height: 5 },
    outputKey: 'area',
    outputLabel: 'Calculated Area',
    algorithm: [
      '1. Start',
      '2. Read Width and Height',
      '3. Calculate area = Width * Height',
      '4. Display area',
      '5. End'
    ],
    pseudocode: `START
INPUT Width, Height

area = Width * Height

OUTPUT area
END`,
    starterNodes: [
      { id: 'ac-start', type: 'START', label: 'START', x: 280, y: 40 },
      { id: 'ac-in', type: 'INPUT', label: 'Input Width, Height', code: 'read Width, Height', x: 250, y: 130 },
      { id: 'ac-p1', type: 'PROCESS', label: 'area = Width * Height', code: 'area = Width * Height', x: 240, y: 240 },
      { id: 'ac-out', type: 'OUTPUT', label: 'Display area', code: 'output = area', x: 260, y: 350 },
      { id: 'ac-end', type: 'END', label: 'END', x: 280, y: 450 }
    ],
    starterConnections: [
      { id: 'acc1', source: 'ac-start', target: 'ac-in' },
      { id: 'acc2', source: 'ac-in', target: 'ac-p1' },
      { id: 'acc3', source: 'ac-p1', target: 'ac-out' },
      { id: 'acc4', source: 'ac-out', target: 'ac-end' }
    ],
    generateTestCases: () => [
      { id: 'act1', name: 'Rectangle (10 x 5)', inputs: { Width: 10, Height: 5 }, expected: 50 },
      { id: 'act2', name: 'Square (8 x 8)', inputs: { Width: 8, Height: 8 }, expected: 64 },
      { id: 'act3', name: 'Large Field (100 x 50)', inputs: { Width: 100, Height: 50 }, expected: 5000 },
      { id: 'act4', name: 'Decimal Dimensions (4.5 x 2.0)', inputs: { Width: 4.5, Height: 2 }, expected: 9 },
      { id: 'act5', name: 'Zero Dimension (0 x 10)', inputs: { Width: 0, Height: 10 }, expected: 0 },
      { id: 'act6', name: 'Tiny Rectangle (0.5 x 0.4)', inputs: { Width: 0.5, Height: 0.4 }, expected: 0.2 }
    ],
    referenceEvaluator: (inputs) => {
      return Number(inputs.Width) * Number(inputs.Height);
    }
  },

  {
    id: 'unit_conversion',
    title: '6. Unit Conversion',
    badge: 'Formula Transformation',
    icon: 'ArrowLeftRight',
    description: 'Convert temperature from Celsius (°C) to Fahrenheit (°F).',
    inputs: [
      { name: 'Celsius', label: 'Temperature (°C)', defaultVal: 25, type: 'number' }
    ],
    defaultValues: { Celsius: 25 },
    outputKey: 'fahrenheit',
    outputLabel: 'Temperature (°F)',
    algorithm: [
      '1. Start',
      '2. Read Celsius',
      '3. Calculate fahrenheit = (Celsius * 9/5) + 32',
      '4. Display fahrenheit',
      '5. End'
    ],
    pseudocode: `START
INPUT Celsius

fahrenheit = (Celsius * 9/5) + 32

OUTPUT fahrenheit
END`,
    starterNodes: [
      { id: 'uc-start', type: 'START', label: 'START', x: 280, y: 40 },
      { id: 'uc-in', type: 'INPUT', label: 'Input Celsius', code: 'read Celsius', x: 260, y: 130 },
      { id: 'uc-p1', type: 'PROCESS', label: 'fahrenheit = (Celsius * 9/5) + 32', code: 'fahrenheit = (Celsius * 9/5) + 32', x: 210, y: 240 },
      { id: 'uc-out', type: 'OUTPUT', label: 'Display fahrenheit', code: 'output = fahrenheit', x: 260, y: 350 },
      { id: 'uc-end', type: 'END', label: 'END', x: 280, y: 450 }
    ],
    starterConnections: [
      { id: 'ucc1', source: 'uc-start', target: 'uc-in' },
      { id: 'ucc2', source: 'uc-in', target: 'uc-p1' },
      { id: 'ucc3', source: 'uc-p1', target: 'uc-out' },
      { id: 'ucc4', source: 'uc-out', target: 'uc-end' }
    ],
    generateTestCases: () => [
      { id: 'uct1', name: 'Room Temp (25°C)', inputs: { Celsius: 25 }, expected: 77 },
      { id: 'uct2', name: 'Freezing Point (0°C)', inputs: { Celsius: 0 }, expected: 32 },
      { id: 'uct3', name: 'Boiling Point (100°C)', inputs: { Celsius: 100 }, expected: 212 },
      { id: 'uct4', name: 'Negative Temp (-40°C)', inputs: { Celsius: -40 }, expected: -40 },
      { id: 'uct5', name: 'Body Temp (37°C)', inputs: { Celsius: 37 }, expected: 98.6 },
      { id: 'uct6', name: 'Hot Summer (40°C)', inputs: { Celsius: 40 }, expected: 104 }
    ],
    referenceEvaluator: (inputs) => {
      const c = Number(inputs.Celsius);
      return (c * 9 / 5) + 32;
    }
  }
];
