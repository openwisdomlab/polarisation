/**
 * Bench Page - Optical Path Designer
 * 光路设计室 - 搭建光路 × 模拟验证
 *
 * Interactive optical bench where users can:
 * - Drag and drop optical components
 * - Build classic experiments or free designs
 * - See real-time light path simulation
 * - Link to UC2 hardware for real-world builds
 *
 * Enhanced features:
 * - Centered optical path that adapts to viewport
 * - Collapsible sidebar that doesn't interfere with visualization
 * - Rich hover interactions with physics explanations
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Tabs, Badge } from '@/components/shared'
import {
  Home, Play, Pause, RotateCcw,
  ChevronRight, ChevronLeft, Trash2, Eye, EyeOff,
  Lightbulb, Layers, HelpCircle,
  Box, ExternalLink, Move, ZoomIn, ZoomOut, Maximize2
} from 'lucide-react'
import {
  OpticalComponentMap,
  LightBeam,
  type OpticalComponentType
} from '@/components/bench'

// Component types for the optical bench
type BenchComponentType = 'emitter' | 'polarizer' | 'waveplate' | 'mirror' | 'splitter' | 'sensor' | 'lens'

interface BenchComponent {
  id: string
  type: BenchComponentType
  x: number
  y: number
  rotation: number
  properties: Record<string, number | string | boolean>
}

interface ClassicExperiment {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  difficulty: 'easy' | 'medium' | 'hard'
  components: BenchComponent[]
  learningPoints: { en: string[]; zh: string[] }
  linkedDemo?: string
}

// Palette components available for building
const PALETTE_COMPONENTS: { type: BenchComponentType; icon: string; nameEn: string; nameZh: string; color: string }[] = [
  { type: 'emitter', icon: '💡', nameEn: 'Light Source', nameZh: '光源', color: 'yellow' },
  { type: 'polarizer', icon: '◐', nameEn: 'Polarizer', nameZh: '偏振片', color: 'indigo' },
  { type: 'waveplate', icon: '◈', nameEn: 'Wave Plate', nameZh: '波片', color: 'violet' },
  { type: 'mirror', icon: '🪞', nameEn: 'Mirror', nameZh: '反射镜', color: 'cyan' },
  { type: 'splitter', icon: '◇', nameEn: 'Beam Splitter', nameZh: '分束器', color: 'emerald' },
  { type: 'sensor', icon: '📡', nameEn: 'Detector', nameZh: '探测器', color: 'rose' },
  { type: 'lens', icon: '🔍', nameEn: 'Lens', nameZh: '透镜', color: 'amber' },
]

// Classic experiments catalog
const CLASSIC_EXPERIMENTS: ClassicExperiment[] = [
  {
    id: 'malus-law',
    nameEn: 'Malus\'s Law Verification',
    nameZh: '马吕斯定律验证',
    descriptionEn: 'Measure intensity through two polarizers as function of angle.',
    descriptionZh: '测量光通过两块偏振片时强度随角度的变化。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 250, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'p2', type: 'polarizer', x: 400, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 550, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['I = I₀ cos²θ', 'Crossed polarizers block light', 'Intensity varies smoothly with angle'],
      zh: ['I = I₀ cos²θ', '正交偏振片阻挡光线', '强度随角度平滑变化'],
    },
    linkedDemo: 'malus-law',
  },
  {
    id: 'brewster-angle',
    nameEn: 'Brewster\'s Angle',
    nameZh: '布儒斯特角实验',
    descriptionEn: 'Find the angle where reflected light is completely polarized.',
    descriptionZh: '寻找反射光完全偏振的入射角。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 150, rotation: 56, properties: { polarization: -1 } },
      { id: 'm1', type: 'mirror', x: 300, y: 250, rotation: 0, properties: { material: 'glass' } },
      { id: 'p1', type: 'polarizer', x: 450, y: 150, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 550, y: 150, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['tan θ_B = n₂/n₁', 'Reflected light is s-polarized', 'Used for polarizer-free polarization'],
      zh: ['tan θ_B = n₂/n₁', '反射光为s偏振', '用于无偏振片的偏振获取'],
    },
    linkedDemo: 'brewster-angle',
  },
  {
    id: 'quarter-wave',
    nameEn: 'Circular Polarization Generation',
    nameZh: '圆偏振光产生',
    descriptionEn: 'Use linear polarizer and quarter-wave plate to create circular polarization.',
    descriptionZh: '使用线偏振片和四分之一波片产生圆偏振光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 220, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'w1', type: 'waveplate', x: 340, y: 200, rotation: 0, properties: { retardation: 90, fastAxis: 0 } },
      { id: 's1', type: 'sensor', x: 480, y: 200, rotation: 0, properties: { mode: 'polarization' } },
    ],
    learningPoints: {
      en: ['45° linear + λ/4 → circular', 'Phase difference creates rotation', 'Handedness depends on orientation'],
      zh: ['45°线偏振 + λ/4 → 圆偏振', '相位差产生旋转', '旋向取决于取向'],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'birefringence',
    nameEn: 'Birefringent Crystal',
    nameZh: '双折射晶体',
    descriptionEn: 'Split light into ordinary and extraordinary rays using calcite.',
    descriptionZh: '使用方解石将光分裂为寻常光和非常光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 45 } },
      { id: 'c1', type: 'splitter', x: 280, y: 200, rotation: 0, properties: { type: 'calcite' } },
      { id: 's1', type: 'sensor', x: 450, y: 150, rotation: 0, properties: {} },
      { id: 's2', type: 'sensor', x: 450, y: 250, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['O-ray: nₒ constant', 'E-ray: nₑ varies with angle', 'Beams have orthogonal polarizations'],
      zh: ['o光：折射率nₒ恒定', 'e光：折射率nₑ随角度变化', '两束光偏振正交'],
    },
    linkedDemo: 'birefringence',
  },
  {
    id: 'stress-analysis',
    nameEn: 'Photoelastic Stress Analysis',
    nameZh: '光弹应力分析',
    descriptionEn: 'Visualize stress in transparent materials between crossed polarizers.',
    descriptionZh: '在正交偏振片之间观察透明材料的应力分布。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1, spectrum: 'white' } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'sample', type: 'lens', x: 320, y: 200, rotation: 0, properties: { type: 'sample' } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: { mode: 'imaging' } },
    ],
    learningPoints: {
      en: ['Stress induces birefringence', 'Isochromatic fringes show stress levels', 'Used in engineering design'],
      zh: ['应力诱导双折射', '等色线显示应力水平', '用于工程设计'],
    },
    linkedDemo: 'stress-birefringence',
  },
  // New experiments added
  {
    id: 'half-wave-rotation',
    nameEn: 'Half-Wave Plate Rotation',
    nameZh: '半波片偏振旋转',
    descriptionEn: 'Use a half-wave plate to rotate polarization direction by 2θ.',
    descriptionZh: '使用半波片将偏振方向旋转2θ角。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'w1', type: 'waveplate', x: 320, y: 200, rotation: 0, properties: { retardation: 180, fastAxis: 22.5 } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['λ/2 plate rotates polarization by 2θ', 'Output remains linear polarization', 'Fast axis at θ → rotation by 2θ'],
      zh: ['λ/2波片使偏振旋转2θ', '输出仍为线偏振', '快轴在θ角→偏振旋转2θ'],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'optical-isolator',
    nameEn: 'Optical Isolator',
    nameZh: '光学隔离器',
    descriptionEn: 'Build a one-way optical path using polarizers and a Faraday rotator.',
    descriptionZh: '使用偏振片和法拉第旋转器构建单向光路。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 150, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'w1', type: 'waveplate', x: 280, y: 200, rotation: 0, properties: { retardation: 45, faraday: true } },
      { id: 'p2', type: 'polarizer', x: 410, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'm1', type: 'mirror', x: 520, y: 200, rotation: 0, properties: {} },
      { id: 's1', type: 'sensor', x: 60, y: 300, rotation: 0, properties: { mode: 'isolation' } },
    ],
    learningPoints: {
      en: ['Faraday rotation is non-reciprocal', 'Forward: 0° → 45° → passes', 'Backward: 45° → 90° → blocked'],
      zh: ['法拉第旋转是非互易的', '正向: 0° → 45° → 通过', '反向: 45° → 90° → 阻挡'],
    },
  },
  {
    id: 'polarization-interferometer',
    nameEn: 'Polarization Interferometer',
    nameZh: '偏振干涉仪',
    descriptionEn: 'Create interference using orthogonally polarized beams.',
    descriptionZh: '使用正交偏振光束产生干涉。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: 45 } },
      { id: 'c1', type: 'splitter', x: 180, y: 200, rotation: 0, properties: { type: 'pbs' } },
      { id: 'm1', type: 'mirror', x: 180, y: 100, rotation: 90, properties: {} },
      { id: 'm2', type: 'mirror', x: 320, y: 200, rotation: 0, properties: {} },
      { id: 'c2', type: 'splitter', x: 320, y: 100, rotation: 0, properties: { type: 'pbs' } },
      { id: 'p1', type: 'polarizer', x: 450, y: 100, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 550, y: 100, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['PBS splits by polarization', 'Recombined beams interfere with analyzer', 'Phase sensitive measurement'],
      zh: ['PBS按偏振分光', '重组光束经检偏器干涉', '相位敏感测量'],
    },
    linkedDemo: 'polarization-state',
  },
  {
    id: 'ellipsometry',
    nameEn: 'Ellipsometry Setup',
    nameZh: '椭偏仪配置',
    descriptionEn: 'Measure thin film properties using polarization state changes.',
    descriptionZh: '利用偏振态变化测量薄膜特性。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 150, rotation: 56, properties: { polarization: 45 } },
      { id: 'p1', type: 'polarizer', x: 140, y: 180, rotation: 56, properties: { angle: 45 } },
      { id: 'sample', type: 'mirror', x: 280, y: 250, rotation: 0, properties: { type: 'thin-film' } },
      { id: 'w1', type: 'waveplate', x: 420, y: 180, rotation: -56, properties: { retardation: 90 } },
      { id: 'p2', type: 'polarizer', x: 500, y: 150, rotation: -56, properties: { angle: 0, rotatable: true } },
      { id: 's1', type: 'sensor', x: 580, y: 120, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['Ψ: amplitude ratio change', 'Δ: phase difference change', 'Film thickness & refractive index'],
      zh: ['Ψ: 振幅比变化', 'Δ: 相位差变化', '薄膜厚度与折射率'],
    },
  },
  {
    id: 'polarimeter',
    nameEn: 'Polarimeter',
    nameZh: '旋光仪',
    descriptionEn: 'Measure optical rotation of chiral substances.',
    descriptionZh: '测量手性物质的旋光度。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1, wavelength: 589 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'sample', type: 'lens', x: 330, y: 200, rotation: 0, properties: { type: 'sugar-solution', concentration: 0.1 } },
      { id: 'p2', type: 'polarizer', x: 480, y: 200, rotation: 0, properties: { angle: 10, rotatable: true } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['α = [α] × c × L', 'D-glucose rotates right', 'L-glucose rotates left'],
      zh: ['α = [α] × c × L', 'D-葡萄糖右旋', 'L-葡萄糖左旋'],
    },
    linkedDemo: 'optical-rotation',
  },
  {
    id: 'wollaston-prism',
    nameEn: 'Wollaston Prism Separator',
    nameZh: '渥拉斯顿棱镜分束',
    descriptionEn: 'Split light into two diverging orthogonally polarized beams.',
    descriptionZh: '将光分成两束发散的正交偏振光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: 45 } },
      { id: 'c1', type: 'splitter', x: 250, y: 200, rotation: 0, properties: { type: 'wollaston', angle: 15 } },
      { id: 's1', type: 'sensor', x: 500, y: 130, rotation: 0, properties: {} },
      { id: 's2', type: 'sensor', x: 500, y: 270, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['Two calcite prisms with perpendicular axes', 'Both beams exit at equal angles', 'Angular separation depends on wedge angle'],
      zh: ['两块方解石棱镜光轴垂直', '两束光以相等角度出射', '分离角取决于楔角'],
    },
    linkedDemo: 'birefringence',
  },
  {
    id: 'senarmont-compensator',
    nameEn: 'Sénarmont Compensator',
    nameZh: '塞纳蒙补偿器',
    descriptionEn: 'Precise phase measurement using quarter-wave plate and analyzer.',
    descriptionZh: '使用四分之一波片和检偏器精确测量相位。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 140, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'sample', type: 'lens', x: 260, y: 200, rotation: 0, properties: { type: 'birefringent', retardation: 30 } },
      { id: 'w1', type: 'waveplate', x: 380, y: 200, rotation: 0, properties: { retardation: 90, fastAxis: 0 } },
      { id: 'p2', type: 'polarizer', x: 500, y: 200, rotation: 0, properties: { angle: 15, rotatable: true } },
      { id: 's1', type: 'sensor', x: 600, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['Elliptical → circular → linear', 'Analyzer angle = δ/2', 'Precise retardation measurement'],
      zh: ['椭圆→圆→线偏振', '检偏器角度 = δ/2', '精确测量延迟量'],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'three-polarizer-paradox',
    nameEn: 'Three Polarizer Paradox',
    nameZh: '三偏振片悖论',
    descriptionEn: 'Demonstrate how adding a third polarizer can increase transmitted light.',
    descriptionZh: '演示添加第三块偏振片如何增加透射光强。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 160, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'p2', type: 'polarizer', x: 300, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'p3', type: 'polarizer', x: 440, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 560, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['0° and 90° polarizers block all light', 'Adding 45° polarizer allows some through', 'I = I₀ × cos²45° × cos²45° = I₀/4'],
      zh: ['0°和90°偏振片阻挡所有光', '添加45°偏振片允许部分通过', 'I = I₀ × cos²45° × cos²45° = I₀/4'],
    },
    linkedDemo: 'malus-law',
  },
]

// UC2 hardware mapping
const UC2_COMPONENT_MAP: Record<BenchComponentType, { uc2Id: string; nameEn: string; nameZh: string; stlUrl?: string }> = {
  emitter: { uc2Id: 'UC2-LED', nameEn: 'UC2 LED Module', nameZh: 'UC2 LED模块' },
  polarizer: { uc2Id: 'UC2-POL', nameEn: 'UC2 Polarizer Cube', nameZh: 'UC2 偏振片模块' },
  waveplate: { uc2Id: 'UC2-WP', nameEn: 'UC2 Waveplate Holder', nameZh: 'UC2 波片支架' },
  mirror: { uc2Id: 'UC2-MIR', nameEn: 'UC2 Mirror Mount', nameZh: 'UC2 反射镜支架' },
  splitter: { uc2Id: 'UC2-BS', nameEn: 'UC2 Beam Splitter Cube', nameZh: 'UC2 分束器模块' },
  sensor: { uc2Id: 'UC2-CAM', nameEn: 'UC2 Camera Module', nameZh: 'UC2 相机模块' },
  lens: { uc2Id: 'UC2-LENS', nameEn: 'UC2 Lens Holder', nameZh: 'UC2 透镜支架' },
}

// Component physics descriptions for hover tooltips
const COMPONENT_PHYSICS: Record<BenchComponentType, {
  principleEn: string
  principleZh: string
  formulaEn?: string
  formulaZh?: string
  tipsEn: string[]
  tipsZh: string[]
}> = {
  emitter: {
    principleEn: 'Emits polarized or unpolarized light with controllable wavelength and intensity.',
    principleZh: '发射偏振或非偏振光，可控制波长和强度。',
    tipsEn: ['Click to select', 'Drag to reposition', 'Set polarization in properties'],
    tipsZh: ['点击选择', '拖拽移动', '在属性面板设置偏振'],
  },
  polarizer: {
    principleEn: 'Filters light based on polarization direction using Malus\'s Law.',
    principleZh: '根据马吕斯定律按偏振方向过滤光线。',
    formulaEn: 'I = I₀ × cos²θ',
    formulaZh: 'I = I₀ × cos²θ',
    tipsEn: ['Rotate to change filter angle', '90° blocks crossed polarization', 'Two crossed polarizers block all light'],
    tipsZh: ['旋转改变过滤角度', '90°阻挡交叉偏振', '两个正交偏振片阻挡所有光'],
  },
  waveplate: {
    principleEn: 'Introduces phase retardation between orthogonal polarization components.',
    principleZh: '在正交偏振分量之间引入相位延迟。',
    formulaEn: 'δ = 2π(nₑ - nₒ)d / λ',
    formulaZh: 'δ = 2π(nₑ - nₒ)d / λ',
    tipsEn: ['λ/4 plate: linear → circular', 'λ/2 plate: rotates polarization by 2θ', 'Fast axis orientation matters'],
    tipsZh: ['λ/4波片：线偏振→圆偏振', 'λ/2波片：偏振旋转2θ', '快轴方向很重要'],
  },
  mirror: {
    principleEn: 'Reflects light at the incident angle. Can introduce phase shift.',
    principleZh: '以入射角反射光线。可能引入相移。',
    formulaEn: 'θ_reflection = θ_incident',
    formulaZh: 'θ_反射 = θ_入射',
    tipsEn: ['Rotate to set reflection angle', 'Metal mirrors maintain polarization', 'Dielectric mirrors at Brewster\'s angle polarize light'],
    tipsZh: ['旋转设置反射角', '金属镜保持偏振', '介质镜在布儒斯特角偏振光'],
  },
  splitter: {
    principleEn: 'Birefringent crystal that separates o-ray and e-ray based on polarization.',
    principleZh: '双折射晶体，根据偏振分离o光和e光。',
    formulaEn: 'Δn = nₑ - nₒ (calcite: 0.172)',
    formulaZh: 'Δn = nₑ - nₒ (方解石: 0.172)',
    tipsEn: ['Calcite creates two beams', 'Beams have orthogonal polarizations', 'Separation depends on crystal thickness'],
    tipsZh: ['方解石产生两束光', '两束光偏振正交', '分离取决于晶体厚度'],
  },
  sensor: {
    principleEn: 'Detects light intensity and can analyze polarization state.',
    principleZh: '检测光强，可分析偏振态。',
    tipsEn: ['Measures transmitted intensity', 'Can filter by polarization', 'Shows activation status'],
    tipsZh: ['测量透射强度', '可按偏振过滤', '显示激活状态'],
  },
  lens: {
    principleEn: 'Focuses or diverges light. Used for imaging and beam shaping.',
    principleZh: '聚焦或发散光线。用于成像和光束整形。',
    formulaEn: '1/f = 1/u + 1/v',
    formulaZh: '1/f = 1/u + 1/v',
    tipsEn: ['Convex lens: f > 0', 'Concave lens: f < 0', 'Focal length determines magnification'],
    tipsZh: ['凸透镜: f > 0', '凹透镜: f < 0', '焦距决定放大倍数'],
  },
}

const DIFFICULTY_CONFIG = {
  easy: { labelEn: 'Easy', labelZh: '简单', color: 'green' as const },
  medium: { labelEn: 'Medium', labelZh: '中等', color: 'yellow' as const },
  hard: { labelEn: 'Hard', labelZh: '困难', color: 'red' as const },
}

// Component on bench visualization - now rendered as part of SVG canvas
// This function is kept for legacy purposes but the main rendering is done in the canvas SVG

// Experiment card component
function ExperimentCard({
  experiment,
  onLoad,
}: {
  experiment: ClassicExperiment
  onLoad: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[experiment.difficulty]

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-all hover:shadow-md',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className={cn(
          'font-semibold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? experiment.nameZh : experiment.nameEn}
        </h4>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <p className={cn(
        'text-sm mb-3 line-clamp-2',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? experiment.descriptionZh : experiment.descriptionEn}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onLoad}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            theme === 'dark'
              ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
          )}
        >
          <Play className="w-4 h-4" />
          {isZh ? '加载' : 'Load'}
        </button>
        {experiment.linkedDemo && (
          <Link
            to={`/demos?demo=${experiment.linkedDemo}`}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            )}
            title={isZh ? '查看演示' : 'View Demo'}
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

// UC2 Hardware Panel
function UC2Panel({
  components,
  onClose,
}: {
  components: BenchComponent[]
  onClose: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Group components by type and count
  const componentCounts = components.reduce((acc, comp) => {
    acc[comp.type] = (acc[comp.type] || 0) + 1
    return acc
  }, {} as Record<BenchComponentType, number>)

  return (
    <div className={cn(
      'absolute right-4 top-4 w-80 rounded-xl border shadow-xl z-20',
      theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className={cn(
        'flex items-center justify-between p-4 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <Box className={cn('w-5 h-5', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')} />
          <h3 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? 'UC2 零件清单' : 'UC2 Parts List'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className={cn(
            'p-1 rounded transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {Object.entries(componentCounts).map(([type, count]) => {
          const uc2Info = UC2_COMPONENT_MAP[type as BenchComponentType]
          return (
            <div
              key={type}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {PALETTE_COMPONENTS.find(p => p.type === type)?.icon}
                </span>
                <div>
                  <p className={cn(
                    'text-sm font-medium',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? uc2Info.nameZh : uc2Info.nameEn}
                  </p>
                  <p className={cn(
                    'text-xs',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {uc2Info.uc2Id}
                  </p>
                </div>
              </div>
              <Badge color="green">×{count}</Badge>
            </div>
          )
        })}
      </div>

      <div className={cn(
        'p-4 border-t',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <a
          href="https://github.com/openUC2/UC2-GIT"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium transition-colors',
            'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
          )}
        >
          <ExternalLink className="w-4 h-4" />
          {isZh ? '获取 UC2 模块' : 'Get UC2 Modules'}
        </a>
      </div>
    </div>
  )
}

// Hover tooltip component for component physics info
function ComponentTooltip({
  component,
  x,
  y,
  isZh,
  theme,
}: {
  component: BenchComponent
  x: number
  y: number
  isZh: boolean
  theme: string
}) {
  const physics = COMPONENT_PHYSICS[component.type]
  const paletteInfo = PALETTE_COMPONENTS.find(p => p.type === component.type)

  return (
    <div
      className={cn(
        'absolute z-50 w-64 rounded-xl border shadow-xl pointer-events-none transition-all duration-200',
        theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
      )}
      style={{
        left: x + 60,
        top: y - 80,
        transform: 'translateY(-50%)',
      }}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center gap-2 p-3 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <span className="text-2xl">{paletteInfo?.icon}</span>
        <div>
          <h4 className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? paletteInfo?.nameZh : paletteInfo?.nameEn}
          </h4>
          <p className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            {isZh ? `角度: ${component.rotation}°` : `Angle: ${component.rotation}°`}
          </p>
        </div>
      </div>

      {/* Physics principle */}
      <div className="p-3 space-y-2">
        <p className={cn('text-xs', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
          {isZh ? physics.principleZh : physics.principleEn}
        </p>

        {/* Formula */}
        {physics.formulaEn && (
          <div className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-mono',
            theme === 'dark' ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'
          )}>
            <span className="font-bold">f(x)</span>
            <span>{isZh ? physics.formulaZh : physics.formulaEn}</span>
          </div>
        )}

        {/* Tips */}
        <div className="space-y-1 pt-1">
          {(isZh ? physics.tipsZh : physics.tipsEn).slice(0, 2).map((tip, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className={cn('text-xs mt-0.5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>•</span>
              <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with action hint */}
      <div className={cn(
        'px-3 py-2 border-t text-xs flex items-center gap-2',
        theme === 'dark' ? 'border-slate-700 text-gray-500' : 'border-gray-200 text-gray-400'
      )}>
        <Move className="w-3 h-3" />
        {isZh ? '点击选择 • 拖拽移动' : 'Click to select • Drag to move'}
      </div>
    </div>
  )
}

// Main page tabs
const PAGE_TABS = [
  { id: 'classic', labelEn: 'Classic Setups', labelZh: '经典光路', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'free', labelEn: 'Free Design', labelZh: '自由设计', icon: <Layers className="w-4 h-4" /> },
]

export function BenchPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // Canvas ref for measuring dimensions
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 })

  const [activeTab, setActiveTab] = useState<'classic' | 'free'>('classic')
  const [components, setComponents] = useState<BenchComponent[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showUC2Panel, setShowUC2Panel] = useState(false)
  const [showPolarization, setShowPolarization] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Zoom and pan state for canvas
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragComponentId, setDragComponentId] = useState<string | null>(null)

  // Measure canvas size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setCanvasSize({ width: rect.width, height: rect.height })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [sidebarCollapsed])

  // Calculate center position for optical rail
  const opticalPathCenter = useMemo(() => ({
    x: canvasSize.width / 2,
    y: canvasSize.height / 2,
  }), [canvasSize])

  // Calculate optical rail bounds (centered)
  const railBounds = useMemo(() => {
    const railWidth = Math.min(canvasSize.width - 100, 800)
    const railHeight = 8
    return {
      x: (canvasSize.width - railWidth) / 2,
      y: canvasSize.height / 2 - railHeight / 2,
      width: railWidth,
      height: railHeight,
    }
  }, [canvasSize])

  // Load classic experiment - center components on the optical rail
  const loadExperiment = useCallback((experiment: ClassicExperiment) => {
    // Calculate bounding box of experiment components
    const minX = Math.min(...experiment.components.map(c => c.x))
    const maxX = Math.max(...experiment.components.map(c => c.x))
    const expWidth = maxX - minX

    // Calculate offset to center experiment on rail
    const targetCenterX = canvasSize.width / 2
    const expCenterX = minX + expWidth / 2
    const offsetX = targetCenterX - expCenterX
    const offsetY = canvasSize.height / 2 - 200 // Original Y was around 200

    // Apply offset to all components
    const centeredComponents = experiment.components.map(c => ({
      ...c,
      x: c.x + offsetX,
      y: c.y + offsetY,
    }))

    setComponents(centeredComponents)
    setSelectedId(null)
    setIsSimulating(false)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [canvasSize])

  // Add component to bench - place near center
  const addComponent = useCallback((type: BenchComponentType) => {
    const newComponent: BenchComponent = {
      id: `${type}-${Date.now()}`,
      type,
      x: canvasSize.width / 2 + (Math.random() - 0.5) * 100,
      y: canvasSize.height / 2 + (Math.random() - 0.5) * 40,
      rotation: 0,
      properties: {},
    }
    setComponents(prev => [...prev, newComponent])
    setSelectedId(newComponent.id)
  }, [canvasSize])

  // Delete selected component
  const deleteSelected = useCallback(() => {
    if (selectedId) {
      setComponents(prev => prev.filter(c => c.id !== selectedId))
      setSelectedId(null)
    }
  }, [selectedId])

  // Clear all components
  const clearBench = useCallback(() => {
    setComponents([])
    setSelectedId(null)
    setIsSimulating(false)
  }, [])

  // Rotate selected component
  const rotateSelected = useCallback((delta: number) => {
    if (selectedId) {
      setComponents(prev => prev.map(c =>
        c.id === selectedId ? { ...c, rotation: (c.rotation + delta) % 360 } : c
      ))
    }
  }, [selectedId])

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.5))
  }, [])

  const handleResetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // Component drag handling
  const handleComponentMouseDown = useCallback((e: React.MouseEvent, componentId: string) => {
    e.stopPropagation()
    setSelectedId(componentId)
    setDragComponentId(componentId)
    setDragStart({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }, [])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && dragComponentId) {
      const dx = (e.clientX - dragStart.x) / zoom
      const dy = (e.clientY - dragStart.y) / zoom
      setComponents(prev => prev.map(c =>
        c.id === dragComponentId
          ? { ...c, x: c.x + dx, y: c.y + dy }
          : c
      ))
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }, [isDragging, dragComponentId, dragStart, zoom])

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragComponentId(null)
  }, [])

  // Get hovered component for tooltip
  const hoveredComponent = useMemo(() => {
    return components.find(c => c.id === hoveredId)
  }, [components, hoveredId])

  const selectedComponent = components.find(c => c.id === selectedId)

  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                )}
              >
                <Home className="w-5 h-5" />
              </Link>
              <div>
                <h1 className={cn(
                  'text-xl font-bold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '光路设计室' : 'Optical Path Designer'}
                </h1>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? '搭建光路 × 模拟验证' : 'Build Light Paths × Simulate Results'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* UC2 Hardware Button */}
              <button
                onClick={() => setShowUC2Panel(!showUC2Panel)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  showUC2Panel
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-300 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
                disabled={components.length === 0}
              >
                <Box className="w-4 h-4" />
                <span className="hidden sm:inline">{isZh ? 'UC2 硬件' : 'UC2 Hardware'}</span>
              </button>
              <LanguageThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar Toggle Button - visible when collapsed */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-r-lg border-y border-r transition-all',
              theme === 'dark'
                ? 'bg-slate-900/95 border-slate-700 text-gray-400 hover:text-white'
                : 'bg-white/95 border-gray-200 text-gray-500 hover:text-gray-900'
            )}
            title={isZh ? '展开侧边栏' : 'Expand sidebar'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Left Sidebar - Tabs & Components (Collapsible) */}
        <aside className={cn(
          'border-r flex flex-col transition-all duration-300 relative',
          sidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-72',
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-gray-200'
        )}>
          {/* Collapse button */}
          <button
            onClick={() => setSidebarCollapsed(true)}
            className={cn(
              'absolute right-2 top-2 z-20 p-1.5 rounded-lg transition-colors',
              theme === 'dark'
                ? 'text-gray-500 hover:text-gray-300 hover:bg-slate-800'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            )}
            title={isZh ? '收起侧边栏' : 'Collapse sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {/* Tab Selector */}
          <Tabs
            tabs={PAGE_TABS.map(tab => ({
              ...tab,
              label: isZh ? tab.labelZh : tab.labelEn,
            }))}
            activeTab={activeTab}
            onChange={(id: string) => setActiveTab(id as 'classic' | 'free')}
            className="p-3"
          />

          {/* Content based on tab */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'classic' ? (
              <div className="space-y-3">
                <p className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {isZh ? '选择一个经典实验开始学习' : 'Select a classic experiment to start learning'}
                </p>
                {CLASSIC_EXPERIMENTS.map(exp => (
                  <ExperimentCard
                    key={exp.id}
                    experiment={exp}
                    onLoad={() => loadExperiment(exp)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {isZh ? '点击器件添加到光学平台' : 'Click a component to add it to the bench'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PALETTE_COMPONENTS.map(item => (
                    <button
                      key={item.type}
                      onClick={() => addComponent(item.type)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all hover:scale-105',
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 hover:border-violet-500/50'
                          : 'bg-white border-gray-200 hover:border-violet-400'
                      )}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className={cn(
                        'text-xs font-medium',
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        {isZh ? item.nameZh : item.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Link to Device Library */}
          <div className={cn(
            'p-3 border-t',
            theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
          )}>
            <Link
              to="/devices"
              className={cn(
                'flex items-center gap-2 text-sm',
                theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
              )}
            >
              <HelpCircle className="w-4 h-4" />
              {isZh ? '查看器件原理详解' : 'Learn device principles'}
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative">
          {/* Toolbar */}
          <div className={cn(
            'absolute top-4 left-4 flex items-center gap-2 p-2 rounded-xl border z-10',
            theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
          )}>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isSimulating
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isSimulating ? (isZh ? '暂停' : 'Pause') : (isZh ? '开始模拟' : 'Start Simulation')}
            >
              {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className={cn('w-px h-6', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
            <button
              onClick={() => setShowPolarization(!showPolarization)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showPolarization
                  ? 'bg-violet-500/20 text-violet-400'
                  : theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '显示偏振' : 'Show Polarization'}
            >
              {showPolarization ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => rotateSelected(-15)}
              disabled={!selectedId}
              className={cn(
                'p-2 rounded-lg transition-colors',
                selectedId
                  ? theme === 'dark' ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  : 'opacity-40 cursor-not-allowed',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}
              title={isZh ? '逆时针旋转' : 'Rotate CCW'}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedId}
              className={cn(
                'p-2 rounded-lg transition-colors',
                selectedId
                  ? 'text-red-400 hover:bg-red-500/20'
                  : 'opacity-40 cursor-not-allowed text-gray-500'
              )}
              title={isZh ? '删除' : 'Delete'}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className={cn('w-px h-6', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
            <button
              onClick={clearBench}
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '清空' : 'Clear'}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className={cn(
            'absolute top-4 right-4 flex items-center gap-1 p-1.5 rounded-xl border z-10',
            theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
          )}>
            <button
              onClick={handleZoomIn}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '放大' : 'Zoom In'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className={cn(
              'px-2 text-xs font-mono min-w-[3rem] text-center',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '缩小' : 'Zoom Out'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className={cn('w-px h-5 mx-1', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
            <button
              onClick={handleResetView}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '重置视图' : 'Reset View'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* UC2 Panel */}
          {showUC2Panel && components.length > 0 && (
            <UC2Panel
              components={components}
              onClose={() => setShowUC2Panel(false)}
            />
          )}

          {/* Canvas */}
          <div
            ref={canvasRef}
            className={cn(
              'absolute inset-0 overflow-hidden cursor-crosshair',
              isDragging && 'cursor-grabbing',
              theme === 'dark' ? 'bg-slate-950/50' : 'bg-gray-50/50'
            )}
            onClick={() => setSelectedId(null)}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* Hover Tooltip */}
            {hoveredComponent && !isDragging && (
              <ComponentTooltip
                component={hoveredComponent}
                x={hoveredComponent.x}
                y={hoveredComponent.y}
                isZh={isZh}
                theme={theme}
              />
            )}

            {/* Full SVG Canvas for optical bench */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: 'center center',
              }}
            >
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={theme === 'dark' ? '#334155' : '#94a3b8'}
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </pattern>
                <pattern id="grid-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="0" cy="0" r="1.5" fill={theme === 'dark' ? '#475569' : '#94a3b8'} opacity="0.3" />
                </pattern>
                {/* Optical table surface gradient */}
                <linearGradient id="table-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={theme === 'dark' ? '#0f172a' : '#f8fafc'} />
                  <stop offset="100%" stopColor={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
                </linearGradient>
              </defs>

              {/* Optical table surface */}
              <rect width="100%" height="100%" fill="url(#table-grad)" />
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#grid-dots)" />

              {/* Centered Optical rail visualization */}
              <rect
                x={railBounds.x}
                y={railBounds.y}
                width={railBounds.width}
                height={railBounds.height}
                rx="2"
                fill={theme === 'dark' ? '#334155' : '#94a3b8'}
                opacity="0.5"
              />
              <rect
                x={railBounds.x}
                y={railBounds.y + 2}
                width={railBounds.width}
                height={railBounds.height - 4}
                rx="1"
                fill={theme === 'dark' ? '#1e293b' : '#cbd5e1'}
                opacity="0.8"
              />

              {/* Center marker */}
              <circle
                cx={opticalPathCenter.x}
                cy={opticalPathCenter.y}
                r="4"
                fill={theme === 'dark' ? '#475569' : '#94a3b8'}
                opacity="0.3"
              />
              <line
                x1={opticalPathCenter.x - 10}
                y1={opticalPathCenter.y}
                x2={opticalPathCenter.x + 10}
                y2={opticalPathCenter.y}
                stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
                strokeWidth="1"
                opacity="0.3"
              />
              <line
                x1={opticalPathCenter.x}
                y1={opticalPathCenter.y - 10}
                x2={opticalPathCenter.x}
                y2={opticalPathCenter.y + 10}
                stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
                strokeWidth="1"
                opacity="0.3"
              />

              {/* Light beams (rendered first, behind components) */}
              {isSimulating && components.length > 0 && (
                <g className="light-beams">
                  {components.filter(c => c.type === 'emitter').map(emitter => {
                    // Calculate light path through components
                    const beamEndX = Math.min(emitter.x + 500, 750)
                    const polarAngle = (emitter.properties.polarization as number) || 0

                    // Find components in the beam path
                    const componentsInPath = components
                      .filter(c => c.type !== 'emitter' && c.x > emitter.x && Math.abs(c.y - emitter.y) < 40)
                      .sort((a, b) => a.x - b.x)

                    // Generate beam segments
                    const segments: { x1: number; y1: number; x2: number; y2: number; polarAngle: number; intensity: number }[] = []
                    let currentX = emitter.x
                    let currentPolarAngle = polarAngle
                    let currentIntensity = 100

                    componentsInPath.forEach((comp) => {
                      // Beam to component
                      segments.push({
                        x1: currentX + 30,
                        y1: emitter.y,
                        x2: comp.x - 30,
                        y2: comp.y,
                        polarAngle: currentPolarAngle,
                        intensity: currentIntensity
                      })

                      // Modify polarization based on component type
                      if (comp.type === 'polarizer') {
                        const polarizerAngle = (comp.properties.angle as number) || 0
                        const angleDiff = Math.abs(currentPolarAngle - polarizerAngle)
                        currentIntensity *= Math.pow(Math.cos(angleDiff * Math.PI / 180), 2)
                        currentPolarAngle = polarizerAngle
                      } else if (comp.type === 'waveplate') {
                        currentPolarAngle = (currentPolarAngle + 45) % 180
                      }

                      currentX = comp.x
                    })

                    // Final beam segment to end
                    if (currentIntensity > 5) {
                      segments.push({
                        x1: currentX + 30,
                        y1: emitter.y,
                        x2: beamEndX,
                        y2: emitter.y,
                        polarAngle: currentPolarAngle,
                        intensity: currentIntensity
                      })
                    }

                    return segments.map((seg, idx) => (
                      <LightBeam
                        key={`${emitter.id}-beam-${idx}`}
                        x1={seg.x1}
                        y1={seg.y1}
                        x2={seg.x2}
                        y2={seg.y2}
                        polarizationAngle={seg.polarAngle}
                        intensity={seg.intensity}
                        showPolarization={showPolarization}
                        animated={true}
                      />
                    ))
                  })}
                </g>
              )}

              {/* Optical components */}
              <g className="optical-components">
                {components.map(component => {
                  const ComponentViz = OpticalComponentMap[component.type as OpticalComponentType]
                  if (ComponentViz) {
                    const isHovered = component.id === hoveredId
                    const isSelected = component.id === selectedId
                    return (
                      <g
                        key={component.id}
                        onMouseEnter={() => setHoveredId(component.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onMouseDown={(e) => handleComponentMouseDown(e as unknown as React.MouseEvent, component.id)}
                        style={{ cursor: isDragging && dragComponentId === component.id ? 'grabbing' : 'grab' }}
                      >
                        {/* Hover highlight ring */}
                        {(isHovered || isSelected) && (
                          <circle
                            cx={component.x}
                            cy={component.y}
                            r={35}
                            fill="none"
                            stroke={isSelected ? '#8b5cf6' : '#22d3ee'}
                            strokeWidth={isSelected ? 3 : 2}
                            strokeDasharray={isSelected ? 'none' : '4 2'}
                            opacity={0.6}
                            className="pointer-events-none"
                          />
                        )}
                        <ComponentViz
                          x={component.x}
                          y={component.y}
                          rotation={component.rotation}
                          selected={isSelected}
                          polarizationAngle={(component.properties.angle as number) || (component.properties.polarization as number) || 0}
                          onClick={(e) => {
                            e?.stopPropagation()
                            setSelectedId(component.id)
                          }}
                        />
                      </g>
                    )
                  }
                  return null
                })}
              </g>
            </svg>

            {/* Empty state */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                  )}>
                    <Layers className={cn('w-10 h-10', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')} />
                  </div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '开始设计你的光路' : 'Start designing your optical path'}
                  </h3>
                  <p className={cn(
                    'text-sm max-w-sm mx-auto',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {isZh
                      ? '从左侧选择一个经典实验，或切换到自由设计模式添加器件'
                      : 'Select a classic experiment from the left, or switch to free design mode to add components'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected component properties panel */}
          {selectedComponent && (
            <div className={cn(
              'absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 rounded-xl border p-4 z-10',
              theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
            )}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.icon}
                </span>
                <div>
                  <h4 className={cn(
                    'font-semibold',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh
                      ? PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.nameZh
                      : PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.nameEn}
                  </h4>
                  <p className={cn(
                    'text-xs',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {isZh ? `角度: ${selectedComponent.rotation}°` : `Angle: ${selectedComponent.rotation}°`}
                  </p>
                </div>
              </div>

              {/* Properties would go here in a full implementation */}
              <div className={cn(
                'text-sm p-3 rounded-lg',
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
              )}>
                <p className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  {isZh ? '拖拽移动位置，使用工具栏旋转或删除' : 'Drag to move, use toolbar to rotate or delete'}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
