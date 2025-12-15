/**
 * Advanced Levels for PolarQuest 2D
 *
 * "Zachtronics-style" puzzles that use the full power of Jones Calculus:
 * - Interference (constructive/destructive)
 * - Circular polarization
 * - Wave plates (λ/4, λ/2)
 * - Phase manipulation
 *
 * Design Philosophy: "Simple Tools, Complex Systems"
 * Give players basic blocks and ask them to build logic gates or specific wave states.
 */

import type { OpticalComponent } from '@/components/shared/optical/types'

// Helper to create standard Jones vectors (for future use in advanced levels)
// const jonesRCP = (): [{ re: number; im: number }, { re: number; im: number }] => [
//   { re: 1 / Math.SQRT2, im: 0 },
//   { re: 0, im: -1 / Math.SQRT2 },
// ]
// const jonesLCP = (): [{ re: number; im: number }, { re: number; im: number }] => [
//   { re: 1 / Math.SQRT2, im: 0 },
//   { re: 0, im: 1 / Math.SQRT2 },
// ]

export interface AdvancedLevel {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  difficulty: 'master' | 'grandmaster' | 'legendary'
  category: 'interference' | 'circular' | 'logic' | 'quantum'
  hint?: string
  hintZh?: string
  components: OpticalComponent[]
  gridSize: { width: number; height: number }
  openEnded: boolean

  // Learning objectives
  concepts: string[]
  conceptsZh: string[]

  // Success criteria description
  goalDescription: string
  goalDescriptionZh: string
}

/**
 * MASTER CLASS LEVELS
 *
 * These levels require understanding of interference and wave plates.
 */
export const ADVANCED_LEVELS: AdvancedLevel[] = [
  // =========================================
  // Level A1: The Mach-Zehnder Interferometer
  // =========================================
  {
    id: 'mach-zehnder',
    name: 'The Mach-Zehnder Interferometer',
    nameZh: '马赫-曾德尔干涉仪',
    description:
      'Split a beam, phase-shift one arm, recombine. Control which output receives 100% intensity purely through phase.',
    descriptionZh:
      '分束、相移、合束。仅通过相位控制来决定哪个输出获得100%的光强。',
    difficulty: 'master',
    category: 'interference',
    hint: 'At 0° phase shift, beams add constructively at one output. At 180°, they add destructively.',
    hintZh: '相移为0°时，光束在一个输出端相长干涉。相移为180°时，相消干涉。',
    concepts: [
      'Beam splitting preserves coherence',
      'Phase shift changes interference outcome',
      'Constructive interference: same phase',
      'Destructive interference: opposite phase',
    ],
    conceptsZh: [
      '分束保持相干性',
      '相移改变干涉结果',
      '相长干涉：同相位',
      '相消干涉：反相位',
    ],
    goalDescription: 'Route 100% intensity to Sensor A, 0% to Sensor B',
    goalDescriptionZh: '将100%的光强引导至传感器A，0%到传感器B',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      // Light source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // First beam splitter (50/50)
      {
        id: 'bs1',
        type: 'splitter',
        x: 30,
        y: 50,
        angle: 0,
        crystalAxisAngle: 45, // 45° splits equally for 0° input
        locked: true,
      },
      // Upper arm mirror
      {
        id: 'm1',
        type: 'mirror',
        x: 30,
        y: 20,
        angle: 135,
        locked: true,
      },
      // Phase shifter on upper arm (adjustable!)
      {
        id: 'ps1',
        type: 'phaseShifter',
        x: 55,
        y: 20,
        angle: 0,
        phaseShift: 0, // Player adjusts this!
        locked: false,
      },
      // Lower arm continues straight, then mirror
      {
        id: 'm2',
        type: 'mirror',
        x: 70,
        y: 50,
        angle: 45,
        locked: true,
      },
      // Upper arm mirror to recombine
      {
        id: 'm3',
        type: 'mirror',
        x: 70,
        y: 20,
        angle: 45,
        locked: true,
      },
      // Second beam splitter (recombination point)
      {
        id: 'bs2',
        type: 'splitter',
        x: 70,
        y: 35,
        angle: 0,
        crystalAxisAngle: 45,
        locked: true,
      },
      // Output sensors
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 35,
        angle: 0,
        requiredIntensity: 90,
        locked: true,
      },
      {
        id: 's2',
        type: 'sensor',
        x: 70,
        y: 10,
        angle: 0,
        requiredIntensity: 5, // Should receive ~0%
        requiredPolarizationType: 'any',
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A2: The Optical XOR Gate
  // =========================================
  {
    id: 'optical-xor',
    name: 'The Optical XOR Gate',
    nameZh: '光学异或门',
    description:
      'Build an XOR gate: output ON if A OR B is active, but OFF if BOTH are active (destructive interference).',
    descriptionZh:
      '构建异或门：当A或B激活时输出ON，但当A和B同时激活时输出OFF（相消干涉）。',
    difficulty: 'grandmaster',
    category: 'logic',
    hint: 'Two beams with 180° phase difference cancel out completely.',
    hintZh: '相位差为180°的两束光完全抵消。',
    concepts: [
      'XOR truth table: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0',
      'Destructive interference = logical 0',
      'Single beam = logical 1',
    ],
    conceptsZh: [
      '异或真值表：0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0',
      '相消干涉 = 逻辑0',
      '单束光 = 逻辑1',
    ],
    goalDescription:
      'Sensor activates when exactly ONE source is on, not both',
    goalDescriptionZh: '当且仅当恰好一个光源开启时传感器激活',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      // Source A
      {
        id: 'ea',
        type: 'emitter',
        x: 10,
        y: 30,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Source B
      {
        id: 'eb',
        type: 'emitter',
        x: 10,
        y: 70,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Phase shifter for A path (player adjusts)
      {
        id: 'ps_a',
        type: 'phaseShifter',
        x: 35,
        y: 30,
        angle: 0,
        phaseShift: 0,
        locked: false,
      },
      // Phase shifter for B path (player adjusts)
      {
        id: 'ps_b',
        type: 'phaseShifter',
        x: 35,
        y: 70,
        angle: 0,
        phaseShift: 180, // 180° = opposite phase
        locked: false,
      },
      // Mirrors to combine paths
      {
        id: 'm1',
        type: 'mirror',
        x: 60,
        y: 30,
        angle: 45,
        locked: false,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 60,
        y: 70,
        angle: 135,
        locked: false,
      },
      // Output sensor
      {
        id: 's1',
        type: 'sensor',
        x: 60,
        y: 50,
        angle: 0,
        requiredIntensity: 40,
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A3: The Circular Key
  // =========================================
  {
    id: 'circular-key',
    name: 'The Circular Key',
    nameZh: '圆偏振密钥',
    description:
      'Generate Left-Hand Circular Polarization (LCP) to pass through a circular filter. Linear and RCP are blocked!',
    descriptionZh:
      '生成左旋圆偏振光(LCP)以通过圆偏振滤光片。线偏振和右旋圆偏振都会被阻挡！',
    difficulty: 'master',
    category: 'circular',
    hint: 'Linear 45° + QWP at 0° fast axis = RCP. Linear -45° + QWP at 0° = LCP.',
    hintZh: '线偏振45° + 快轴0°的四分之一波片 = 右旋。线偏振-45° + 快轴0°的四分之一波片 = 左旋。',
    concepts: [
      'Quarter wave plate converts linear to circular',
      'Input angle relative to QWP fast axis determines handedness',
      '+45° input → Right circular polarization',
      '-45° input → Left circular polarization',
    ],
    conceptsZh: [
      '四分之一波片将线偏振转换为圆偏振',
      '输入角度相对于波片快轴决定旋向',
      '+45°输入 → 右旋圆偏振',
      '-45°输入 → 左旋圆偏振',
    ],
    goalDescription: 'Create LCP light to activate the circular filter sensor',
    goalDescriptionZh: '创建左旋圆偏振光以激活圆偏振滤光传感器',
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    components: [
      // Linear polarized source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0, // Horizontal
        direction: 'right',
        locked: true,
      },
      // Rotatable polarizer to set input angle
      {
        id: 'p1',
        type: 'polarizer',
        x: 30,
        y: 50,
        angle: 0,
        polarizationAngle: 135, // Player adjusts to get -45° (135°)
        locked: false,
      },
      // Quarter wave plate (player adjusts fast axis)
      {
        id: 'qwp1',
        type: 'quarterWavePlate',
        x: 50,
        y: 50,
        angle: 0, // Fast axis at 0°
        locked: false,
      },
      // Circular filter (LCP only)
      {
        id: 'cf1',
        type: 'circularFilter',
        x: 70,
        y: 50,
        angle: 0,
        filterHandedness: 'left', // Only passes LCP
        locked: true,
      },
      // Output sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 50,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarizationType: 'circular',
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A4: The Quantum Eraser (Simulated)
  // =========================================
  {
    id: 'quantum-eraser',
    name: 'The Quantum Eraser',
    nameZh: '量子擦除器',
    description:
      'An interference pattern exists. Add a polarizer to "mark" which-path information and destroy it. Then "erase" the mark to restore interference!',
    descriptionZh:
      '存在干涉图样。添加偏振片"标记"路径信息以破坏干涉。然后"擦除"标记以恢复干涉！',
    difficulty: 'grandmaster',
    category: 'quantum',
    hint: 'Orthogonal polarizations cannot interfere. A 45° polarizer at the end can "erase" which-path info.',
    hintZh:
      '正交偏振无法干涉。最后放置45°偏振片可以"擦除"路径信息。',
    concepts: [
      'Interference requires coherence',
      'Orthogonal polarizations mark which-path info',
      'Marking destroys interference',
      'Erasing restores interference (with 50% intensity loss)',
    ],
    conceptsZh: [
      '干涉需要相干性',
      '正交偏振标记路径信息',
      '标记破坏干涉',
      '擦除恢复干涉（损失50%强度）',
    ],
    goalDescription:
      'First destroy the interference, then restore it to reach the sensor',
    goalDescriptionZh: '首先破坏干涉，然后恢复它以到达传感器',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      // Light source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 45, // 45° linear
        direction: 'right',
        locked: true,
      },
      // Beam splitter
      {
        id: 'bs1',
        type: 'splitter',
        x: 25,
        y: 50,
        angle: 0,
        locked: true,
      },
      // Upper path
      {
        id: 'm1',
        type: 'mirror',
        x: 25,
        y: 25,
        angle: 135,
        locked: true,
      },
      // Lower path continues
      {
        id: 'm2',
        type: 'mirror',
        x: 55,
        y: 50,
        angle: 45,
        locked: true,
      },
      // Upper path continues
      {
        id: 'm3',
        type: 'mirror',
        x: 55,
        y: 25,
        angle: 45,
        locked: true,
      },
      // Polarizer slot for upper arm (player places "marker")
      {
        id: 'p_mark_upper',
        type: 'polarizer',
        x: 40,
        y: 25,
        angle: 0,
        polarizationAngle: 0, // 0° = marks this path as horizontal
        locked: false,
      },
      // Convergence point
      {
        id: 'bs2',
        type: 'splitter',
        x: 55,
        y: 37,
        angle: 0,
        locked: true,
      },
      // Eraser polarizer (45° projects both paths to same state)
      {
        id: 'p_eraser',
        type: 'polarizer',
        x: 72,
        y: 37,
        angle: 0,
        polarizationAngle: 45, // Erases which-path info
        locked: false,
      },
      // Final sensor
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 37,
        angle: 0,
        requiredIntensity: 20,
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A5: Berry Phase
  // =========================================
  {
    id: 'berry-phase',
    name: 'Berry Phase',
    nameZh: '贝里相位',
    description:
      'Rotate polarization around the Poincaré sphere using a sequence of wave plates. The geometric phase adds up!',
    descriptionZh:
      '使用一系列波片使偏振在庞加莱球上旋转。几何相位会累加！',
    difficulty: 'legendary',
    category: 'quantum',
    hint: 'A closed path on the Poincaré sphere picks up a phase equal to half the solid angle enclosed.',
    hintZh:
      '庞加莱球上的闭合路径获得的相位等于所围立体角的一半。',
    concepts: [
      'Geometric phase from cyclic polarization evolution',
      'HWP at angle θ rotates by 2θ on the equator',
      'QWP moves between equator and poles',
      'Total phase = ½ × solid angle on Poincaré sphere',
    ],
    conceptsZh: [
      '循环偏振演化产生几何相位',
      '角度θ的半波片在赤道上旋转2θ',
      '四分之一波片在赤道和极点之间移动',
      '总相位 = ½ × 庞加莱球上的立体角',
    ],
    goalDescription:
      'Use wave plates to create a 90° geometric phase shift',
    goalDescriptionZh: '使用波片创建90°几何相移',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      // Linear source
      {
        id: 'e1',
        type: 'emitter',
        x: 5,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // QWP 1 (move to pole: H → RCP)
      {
        id: 'qwp1',
        type: 'quarterWavePlate',
        x: 20,
        y: 50,
        angle: 45, // Fast axis at 45° for H→RCP
        locked: false,
      },
      // HWP 1 (rotate around pole)
      {
        id: 'hwp1',
        type: 'halfWavePlate',
        x: 35,
        y: 50,
        angle: 0, // Player adjusts
        locked: false,
      },
      // QWP 2 (return to equator)
      {
        id: 'qwp2',
        type: 'quarterWavePlate',
        x: 50,
        y: 50,
        angle: 45,
        locked: false,
      },
      // Phase measurement via interference
      // Reference beam (no phase shift)
      {
        id: 'bs1',
        type: 'splitter',
        x: 65,
        y: 50,
        angle: 0,
        locked: true,
      },
      // Mirror for reference
      {
        id: 'm1',
        type: 'mirror',
        x: 65,
        y: 30,
        angle: 135,
        locked: true,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 85,
        y: 30,
        angle: 45,
        locked: true,
      },
      // Main beam continues
      {
        id: 'm3',
        type: 'mirror',
        x: 85,
        y: 50,
        angle: 45,
        locked: true,
      },
      // Recombination
      {
        id: 'bs2',
        type: 'splitter',
        x: 85,
        y: 40,
        angle: 0,
        locked: true,
      },
      // Sensor detects interference
      {
        id: 's1',
        type: 'sensor',
        x: 95,
        y: 40,
        angle: 0,
        requiredIntensity: 80, // Constructive interference at 90° phase
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A6: Double Slit (Classical Simulation)
  // =========================================
  {
    id: 'double-slit',
    name: 'Double Slit Interference',
    nameZh: '双缝干涉',
    description:
      'Create two coherent beams with adjustable path length difference. Find the phase that gives constructive interference at the detector.',
    descriptionZh:
      '创建两束相干光，调节光程差。找到使探测器处产生相长干涉的相位。',
    difficulty: 'master',
    category: 'interference',
    hint: 'Path difference of λ/2 (180° phase) gives destructive interference. 0° or 360° gives constructive.',
    hintZh:
      'λ/2的光程差（180°相位）产生相消干涉。0°或360°产生相长干涉。',
    concepts: [
      'Young\'s double slit experiment',
      'Path difference determines interference',
      'Δφ = 2π × Δx / λ',
      'Constructive: Δφ = 0, 2π, 4π, ...',
      'Destructive: Δφ = π, 3π, 5π, ...',
    ],
    conceptsZh: [
      '杨氏双缝实验',
      '光程差决定干涉',
      'Δφ = 2π × Δx / λ',
      '相长干涉：Δφ = 0, 2π, 4π, ...',
      '相消干涉：Δφ = π, 3π, 5π, ...',
    ],
    goalDescription: 'Achieve maximum intensity (constructive interference) at the detector',
    goalDescriptionZh: '在探测器处实现最大光强（相长干涉）',
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    components: [
      // Source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Beam splitter (the "double slit")
      {
        id: 'bs1',
        type: 'splitter',
        x: 30,
        y: 50,
        angle: 0,
        locked: true,
      },
      // Upper slit path
      {
        id: 'm1',
        type: 'mirror',
        x: 30,
        y: 30,
        angle: 135,
        locked: true,
      },
      // Phase shifter on upper path
      {
        id: 'ps1',
        type: 'phaseShifter',
        x: 50,
        y: 30,
        angle: 0,
        phaseShift: 90, // Player adjusts
        locked: false,
      },
      // Upper path to screen
      {
        id: 'm2',
        type: 'mirror',
        x: 70,
        y: 30,
        angle: 45,
        locked: true,
      },
      // Lower path to screen
      {
        id: 'm3',
        type: 'mirror',
        x: 70,
        y: 50,
        angle: 45,
        locked: true,
      },
      // Combiner at "screen"
      {
        id: 'bc1',
        type: 'beamCombiner',
        x: 70,
        y: 40,
        angle: 0,
        locked: true,
      },
      // Detector
      {
        id: 's1',
        type: 'sensor',
        x: 90,
        y: 40,
        angle: 0,
        requiredIntensity: 90,
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A7: Optical AND Gate
  // =========================================
  {
    id: 'optical-and',
    name: 'Optical AND Gate',
    nameZh: '光学与门',
    description:
      'Build an AND gate using a coincidence counter: output ON only when BOTH inputs arrive with correct phase relationship.',
    descriptionZh:
      '使用符合计数器构建与门：只有当两个输入以正确的相位关系同时到达时，输出才为ON。',
    difficulty: 'grandmaster',
    category: 'logic',
    hint: 'The coincidence counter requires two beams with Δφ=0° (in-phase) to activate.',
    hintZh: '符合计数器需要两束相位差Δφ=0°（同相）的光才能激活。',
    concepts: [
      'AND truth table: 0∧0=0, 0∧1=0, 1∧0=0, 1∧1=1',
      'Coincidence detection requires simultaneous arrival',
      'Phase matching is essential for coincidence',
      'Two independent paths must be aligned',
    ],
    conceptsZh: [
      '与门真值表：0∧0=0, 0∧1=0, 1∧0=0, 1∧1=1',
      '符合检测需要同时到达',
      '相位匹配对于符合检测至关重要',
      '两条独立路径必须对齐',
    ],
    goalDescription: 'Coincidence counter activates only when both sources are on and in-phase',
    goalDescriptionZh: '只有当两个光源都开启且同相时，符合计数器才激活',
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    components: [
      // Source A
      {
        id: 'ea',
        type: 'emitter',
        x: 10,
        y: 30,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Source B
      {
        id: 'eb',
        type: 'emitter',
        x: 10,
        y: 70,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Phase shifter for path A (player adjusts)
      {
        id: 'ps_a',
        type: 'phaseShifter',
        x: 35,
        y: 30,
        angle: 0,
        phaseShift: 0,
        locked: false,
      },
      // Phase shifter for path B (player adjusts)
      {
        id: 'ps_b',
        type: 'phaseShifter',
        x: 35,
        y: 70,
        angle: 0,
        phaseShift: 0,
        locked: false,
      },
      // Mirror A
      {
        id: 'm_a',
        type: 'mirror',
        x: 60,
        y: 30,
        angle: 45,
        locked: true,
      },
      // Mirror B
      {
        id: 'm_b',
        type: 'mirror',
        x: 60,
        y: 70,
        angle: 135,
        locked: true,
      },
      // Coincidence counter - requires BOTH beams with Δφ=0
      {
        id: 'cc1',
        type: 'coincidenceCounter',
        x: 60,
        y: 50,
        angle: 0,
        requiredBeamCount: 2,
        requiredPhaseDifference: 0, // In-phase
        phaseTolerance: 30,
        locked: true,
      },
      // Output sensor
      {
        id: 's1',
        type: 'sensor',
        x: 85,
        y: 50,
        angle: 0,
        requiredIntensity: 80,
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A8: Optical Diode
  // =========================================
  {
    id: 'optical-diode',
    name: 'Optical Diode',
    nameZh: '光学二极管',
    description:
      'Use an optical isolator to create a one-way light path. Light must reach the sensor, but back-reflections must be blocked.',
    descriptionZh:
      '使用光学隔离器创建单向光路。光必须到达传感器，但反射光必须被阻挡。',
    difficulty: 'master',
    category: 'logic',
    hint: 'The optical isolator uses Faraday rotation. Forward light passes with rotation, backward light is blocked.',
    hintZh: '光学隔离器使用法拉第旋转。正向光通过并旋转，反向光被阻挡。',
    concepts: [
      'Non-reciprocal optical devices',
      'Faraday rotation breaks time-reversal symmetry',
      'Optical isolators protect laser sources',
      '45° Faraday rotation + polarizer = one-way valve',
    ],
    conceptsZh: [
      '非互易光学器件',
      '法拉第旋转打破时间反演对称性',
      '光学隔离器保护激光源',
      '45°法拉第旋转 + 偏振片 = 单向阀',
    ],
    goalDescription: 'Light reaches the sensor, but reflections cannot return to source',
    goalDescriptionZh: '光到达传感器，但反射不能返回光源',
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    components: [
      // Light source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Input polarizer
      {
        id: 'p1',
        type: 'polarizer',
        x: 25,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        locked: false,
      },
      // Optical isolator (player positions correctly)
      {
        id: 'iso1',
        type: 'opticalIsolator',
        x: 45,
        y: 50,
        angle: 0,
        allowedDirection: 'right',
        faradayRotation: 45,
        locked: false,
      },
      // Mirror (creates potential back-reflection)
      {
        id: 'm1',
        type: 'mirror',
        x: 70,
        y: 50,
        angle: 45,
        locked: true,
      },
      // Second mirror
      {
        id: 'm2',
        type: 'mirror',
        x: 70,
        y: 30,
        angle: 135,
        locked: true,
      },
      // Partial mirror that creates back-reflection
      {
        id: 'm3',
        type: 'mirror',
        x: 85,
        y: 30,
        angle: 45,
        locked: true,
      },
      // Output sensor
      {
        id: 's1',
        type: 'sensor',
        x: 85,
        y: 50,
        angle: 0,
        requiredIntensity: 30,
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A9: Polarization Multiplexer
  // =========================================
  {
    id: 'polarization-mux',
    name: 'Polarization Multiplexer',
    nameZh: '偏振复用器',
    description:
      'Encode two independent signals on orthogonal polarizations (H and V). Both must reach their respective sensors without crosstalk.',
    descriptionZh:
      '将两个独立信号编码在正交偏振上（水平和垂直）。两者都必须到达各自的传感器而不发生串扰。',
    difficulty: 'grandmaster',
    category: 'logic',
    hint: 'PBS (Polarizing Beam Splitter) separates H and V. Use 90° rotator to switch between paths.',
    hintZh: '偏振分束器（PBS）分离H和V。使用90°旋光器在路径之间切换。',
    concepts: [
      'Polarization Division Multiplexing (PDM)',
      'Orthogonal polarizations do not interfere',
      'PBS separates H and V components',
      'Doubling channel capacity with dual polarization',
    ],
    conceptsZh: [
      '偏振分复用（PDM）',
      '正交偏振不会干涉',
      'PBS分离H和V分量',
      '使用双偏振使信道容量翻倍',
    ],
    goalDescription: 'H-signal to Sensor H, V-signal to Sensor V, with no crosstalk',
    goalDescriptionZh: 'H信号到传感器H，V信号到传感器V，无串扰',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      // H-polarized source
      {
        id: 'e_h',
        type: 'emitter',
        x: 10,
        y: 35,
        angle: 0,
        polarizationAngle: 0, // Horizontal
        direction: 'right',
        locked: true,
      },
      // V-polarized source
      {
        id: 'e_v',
        type: 'emitter',
        x: 10,
        y: 65,
        angle: 0,
        polarizationAngle: 90, // Vertical
        direction: 'right',
        locked: true,
      },
      // Combiner mirrors
      {
        id: 'm1',
        type: 'mirror',
        x: 30,
        y: 35,
        angle: 45,
        locked: false,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 30,
        y: 65,
        angle: 135,
        locked: false,
      },
      // Combined beam splitter (PBS - separates by polarization)
      {
        id: 'pbs1',
        type: 'splitter',
        x: 50,
        y: 50,
        angle: 0,
        crystalAxisAngle: 0, // H passes, V reflects
        locked: false,
      },
      // Demux mirrors
      {
        id: 'm3',
        type: 'mirror',
        x: 70,
        y: 50,
        angle: 45,
        locked: false,
      },
      {
        id: 'm4',
        type: 'mirror',
        x: 50,
        y: 30,
        angle: 135,
        locked: false,
      },
      // H sensor
      {
        id: 's_h',
        type: 'sensor',
        x: 90,
        y: 35,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarization: 0,
        locked: true,
      },
      // V sensor
      {
        id: 's_v',
        type: 'sensor',
        x: 90,
        y: 65,
        angle: 0,
        requiredIntensity: 40,
        requiredPolarization: 90,
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A10: Quantum Key Distribution (BB84 Simulator)
  // =========================================
  {
    id: 'qkd-bb84',
    name: 'BB84 Key Distribution',
    nameZh: 'BB84密钥分发',
    description:
      'Simulate the BB84 quantum key distribution protocol. Encode bits using two bases: rectilinear (H/V) and diagonal (+45/-45). Only matching bases allow successful key exchange.',
    descriptionZh:
      '模拟BB84量子密钥分发协议。使用两种基：直角基（H/V）和对角基（+45/-45）编码比特。只有匹配的基才能成功交换密钥。',
    difficulty: 'legendary',
    category: 'quantum',
    hint: 'Alice encodes in random basis, Bob measures in random basis. Only when bases match is the bit correctly received.',
    hintZh: 'Alice用随机基编码，Bob用随机基测量。只有基匹配时才能正确接收比特。',
    concepts: [
      'Quantum key distribution (QKD)',
      'BB84 protocol uses two conjugate bases',
      'No-cloning theorem prevents eavesdropping',
      'Basis mismatch = 50% chance of wrong result',
    ],
    conceptsZh: [
      '量子密钥分发（QKD）',
      'BB84协议使用两个共轭基',
      '不可克隆定理防止窃听',
      '基不匹配 = 50%概率错误结果',
    ],
    goalDescription: 'Correctly decode the key bit by choosing the matching measurement basis',
    goalDescriptionZh: '通过选择匹配的测量基正确解码密钥比特',
    gridSize: { width: 100, height: 100 },
    openEnded: false,
    components: [
      // Alice's source (encoding bit "1" in diagonal basis = -45°)
      {
        id: 'e_alice',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 135, // -45° = "1" in diagonal basis
        direction: 'right',
        locked: true,
      },
      // Bob's basis choice (polarizer)
      {
        id: 'p_bob',
        type: 'polarizer',
        x: 40,
        y: 50,
        angle: 0,
        polarizationAngle: 135, // Player must match Alice's basis!
        locked: false,
      },
      // Measurement device (splitter to detect polarization)
      {
        id: 'bs_measure',
        type: 'splitter',
        x: 60,
        y: 50,
        angle: 0,
        crystalAxisAngle: 135, // Diagonal basis measurement
        locked: false,
      },
      // "0" detector (135°)
      {
        id: 's_0',
        type: 'sensor',
        x: 85,
        y: 30,
        angle: 0,
        requiredIntensity: 30,
        locked: true,
      },
      // "1" detector (45°) - should light up for correct measurement
      {
        id: 's_1',
        type: 'sensor',
        x: 85,
        y: 50,
        angle: 0,
        requiredIntensity: 70, // Most light should go here
        locked: true,
      },
      // Mirror for path routing
      {
        id: 'm1',
        type: 'mirror',
        x: 60,
        y: 30,
        angle: 135,
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A11: The Photonic Router
  // =========================================
  {
    id: 'photonic-router',
    name: 'The Photonic Router',
    nameZh: '光子路由器',
    description:
      'Build a 2×2 optical switch. Using polarization and phase, route input A to output 1 AND input B to output 2, without any crosstalk.',
    descriptionZh:
      '构建2×2光学开关。使用偏振和相位，将输入A路由到输出1，将输入B路由到输出2，不产生任何串扰。',
    difficulty: 'legendary',
    category: 'logic',
    hint: 'Use different polarizations to avoid crosstalk. Phase shifters and rotators can help direct beams.',
    hintZh: '使用不同的偏振来避免串扰。相移器和旋光器可以帮助引导光束。',
    concepts: [
      'Optical switching and routing',
      'Non-blocking switch architecture',
      'Polarization as routing address',
      'Phase control for constructive/destructive routing',
    ],
    conceptsZh: [
      '光开关和路由',
      '无阻塞开关架构',
      '偏振作为路由地址',
      '相位控制实现建设性/破坏性路由',
    ],
    goalDescription: 'Input A→Output 1, Input B→Output 2, with full isolation',
    goalDescriptionZh: '输入A→输出1，输入B→输出2，完全隔离',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      // Input A (H-polarized)
      {
        id: 'e_a',
        type: 'emitter',
        x: 5,
        y: 25,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Input B (V-polarized)
      {
        id: 'e_b',
        type: 'emitter',
        x: 5,
        y: 75,
        angle: 0,
        polarizationAngle: 90,
        direction: 'right',
        locked: true,
      },
      // Rotator for A
      {
        id: 'r_a',
        type: 'rotator',
        x: 20,
        y: 25,
        angle: 0,
        rotationAmount: 45,
        locked: false,
      },
      // Rotator for B
      {
        id: 'r_b',
        type: 'rotator',
        x: 20,
        y: 75,
        angle: 0,
        rotationAmount: 45,
        locked: false,
      },
      // Phase shifter A
      {
        id: 'ps_a',
        type: 'phaseShifter',
        x: 35,
        y: 25,
        angle: 0,
        phaseShift: 0,
        locked: false,
      },
      // Phase shifter B
      {
        id: 'ps_b',
        type: 'phaseShifter',
        x: 35,
        y: 75,
        angle: 0,
        phaseShift: 180,
        locked: false,
      },
      // First crossing point - mirrors
      {
        id: 'm1',
        type: 'mirror',
        x: 50,
        y: 25,
        angle: 45,
        locked: false,
      },
      {
        id: 'm2',
        type: 'mirror',
        x: 50,
        y: 75,
        angle: 135,
        locked: false,
      },
      // Central PBS
      {
        id: 'pbs1',
        type: 'splitter',
        x: 50,
        y: 50,
        angle: 0,
        locked: false,
      },
      // Second set of mirrors
      {
        id: 'm3',
        type: 'mirror',
        x: 65,
        y: 50,
        angle: 45,
        locked: false,
      },
      {
        id: 'm4',
        type: 'mirror',
        x: 65,
        y: 35,
        angle: 135,
        locked: false,
      },
      // Optical isolators to prevent back-propagation
      {
        id: 'iso1',
        type: 'opticalIsolator',
        x: 80,
        y: 25,
        angle: 0,
        allowedDirection: 'right',
        faradayRotation: 45,
        locked: false,
      },
      {
        id: 'iso2',
        type: 'opticalIsolator',
        x: 80,
        y: 75,
        angle: 0,
        allowedDirection: 'right',
        faradayRotation: 45,
        locked: false,
      },
      // Output 1 sensor (should receive A)
      {
        id: 's_1',
        type: 'sensor',
        x: 95,
        y: 25,
        angle: 0,
        requiredIntensity: 40,
        locked: true,
      },
      // Output 2 sensor (should receive B)
      {
        id: 's_2',
        type: 'sensor',
        x: 95,
        y: 75,
        angle: 0,
        requiredIntensity: 40,
        locked: true,
      },
    ],
  },

  // =========================================
  // Level A12: Sagnac Interferometer
  // =========================================
  {
    id: 'sagnac',
    name: 'Sagnac Interferometer',
    nameZh: 'Sagnac干涉仪',
    description:
      'Build a Sagnac loop where counter-propagating beams interfere. In the absence of rotation, both outputs show specific interference patterns.',
    descriptionZh:
      '构建Sagnac环，其中反向传播的光束发生干涉。在没有旋转的情况下，两个输出显示特定的干涉图样。',
    difficulty: 'grandmaster',
    category: 'interference',
    hint: 'In a Sagnac interferometer, CW and CCW beams travel the same path length. Any non-reciprocal element breaks the symmetry.',
    hintZh: '在Sagnac干涉仪中，顺时针和逆时针光束经过相同的光程。任何非互易元件都会打破对称性。',
    concepts: [
      'Sagnac effect measures rotation',
      'Counter-propagating beams are naturally phase-locked',
      'Non-reciprocal elements create phase difference',
      'Used in fiber optic gyroscopes',
    ],
    conceptsZh: [
      'Sagnac效应测量旋转',
      '反向传播光束自然相位锁定',
      '非互易元件产生相位差',
      '用于光纤陀螺仪',
    ],
    goalDescription: 'Create balanced interference at both output ports',
    goalDescriptionZh: '在两个输出端创建平衡的干涉',
    gridSize: { width: 100, height: 100 },
    openEnded: true,
    components: [
      // Light source
      {
        id: 'e1',
        type: 'emitter',
        x: 10,
        y: 50,
        angle: 0,
        polarizationAngle: 0,
        direction: 'right',
        locked: true,
      },
      // Input beam splitter
      {
        id: 'bs1',
        type: 'splitter',
        x: 30,
        y: 50,
        angle: 0,
        locked: true,
      },
      // Loop corner 1 (upper left)
      {
        id: 'm1',
        type: 'mirror',
        x: 30,
        y: 25,
        angle: 135,
        locked: true,
      },
      // Loop corner 2 (upper right)
      {
        id: 'm2',
        type: 'mirror',
        x: 70,
        y: 25,
        angle: 45,
        locked: true,
      },
      // Loop corner 3 (lower right)
      {
        id: 'm3',
        type: 'mirror',
        x: 70,
        y: 75,
        angle: 135,
        locked: true,
      },
      // Loop corner 4 (lower left) - back to splitter
      {
        id: 'm4',
        type: 'mirror',
        x: 30,
        y: 75,
        angle: 45,
        locked: true,
      },
      // Phase shifter in loop (affects both directions equally)
      {
        id: 'ps1',
        type: 'phaseShifter',
        x: 50,
        y: 25,
        angle: 0,
        phaseShift: 0,
        locked: false,
      },
      // Output port 1
      {
        id: 's1',
        type: 'sensor',
        x: 10,
        y: 25,
        angle: 0,
        requiredIntensity: 45,
        locked: true,
      },
      // Output port 2
      {
        id: 's2',
        type: 'sensor',
        x: 10,
        y: 75,
        angle: 0,
        requiredIntensity: 45,
        locked: true,
      },
    ],
  },
]

/**
 * Get level by ID
 */
export function getAdvancedLevel(id: string): AdvancedLevel | undefined {
  return ADVANCED_LEVELS.find((level) => level.id === id)
}

/**
 * Get levels by category
 */
export function getLevelsByCategory(
  category: AdvancedLevel['category']
): AdvancedLevel[] {
  return ADVANCED_LEVELS.filter((level) => level.category === category)
}

/**
 * Get levels by difficulty
 */
export function getLevelsByDifficulty(
  difficulty: AdvancedLevel['difficulty']
): AdvancedLevel[] {
  return ADVANCED_LEVELS.filter((level) => level.difficulty === difficulty)
}
