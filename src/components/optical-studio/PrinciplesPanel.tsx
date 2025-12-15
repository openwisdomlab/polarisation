/**
 * PrinciplesPanel - 偏振光学原理面板 (改进版 V3)
 *
 * 改进设计:
 * 1. 浮动式设计 - 不占用垂直空间
 * 2. 紧凑模式 - 最小化时显示4个原理图标
 * 3. 点击交互 - 触屏友好
 * 4. 键盘快捷键 - P键切换
 * 5. 上下文提示 - 根据选中器件显示相关原理
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  Route,
  X,
  ChevronRight,
  ChevronLeft,
  Minimize2,
  Maximize2,
  Pin,
  PinOff,
} from 'lucide-react'

// ============================================
// Types
// ============================================

type PanelTab = 'principles' | 'paths'
type PanelMode = 'minimized' | 'compact' | 'expanded'

interface Principle {
  id: string
  icon: string
  titleEn: string
  titleZh: string
  formula?: string
  descriptionEn: string
  descriptionZh: string
  tipEn: string
  tipZh: string
  color: string
  relatedComponents: string[]
}

// ============================================
// Principle Data
// ============================================

const PRINCIPLES: Principle[] = [
  {
    id: 'orthogonality',
    icon: '⊥',
    titleEn: 'Orthogonality',
    titleZh: '正交性',
    descriptionEn: 'Light with perpendicular polarizations (90° apart) can coexist without interference.',
    descriptionZh: '偏振方向相差90°的光可以共存而不发生干涉。',
    tipEn: 'Use orthogonal polarizations to separate light paths in interferometers.',
    tipZh: '利用正交偏振可以在干涉仪中分离光路。',
    color: '#22d3ee',
    relatedComponents: ['polarizer', 'splitter'],
  },
  {
    id: 'malus',
    icon: '∠',
    titleEn: "Malus's Law",
    titleZh: '马吕斯定律',
    formula: 'I = I₀cos²θ',
    descriptionEn: 'Intensity through a polarizer depends on the angle θ between light polarization and filter axis.',
    descriptionZh: '通过偏振片的光强取决于入射光偏振方向与透光轴夹角θ。',
    tipEn: '90° angle blocks all light; 45° passes 50% intensity.',
    tipZh: '90°夹角完全阻挡光；45°夹角透过50%光强。',
    color: '#3b82f6',
    relatedComponents: ['polarizer', 'emitter'],
  },
  {
    id: 'birefringence',
    icon: '◇',
    titleEn: 'Birefringence',
    titleZh: '双折射',
    descriptionEn: 'Crystals (e.g., calcite) split light into o-ray (0°) and e-ray (90°).',
    descriptionZh: '晶体（如方解石）将光分解为寻常光(o光)和非常光(e光)。',
    tipEn: 'Birefringent crystals are used in PBS and waveplates.',
    tipZh: '双折射晶体用于偏振分束器和波片。',
    color: '#8b5cf6',
    relatedComponents: ['splitter', 'waveplate'],
  },
  {
    id: 'interference',
    icon: '∿',
    titleEn: 'Interference',
    titleZh: '干涉',
    formula: 'φ=0: + | φ=π: −',
    descriptionEn: 'Same-phase light adds intensity; opposite-phase cancels.',
    descriptionZh: '同相位光叠加增强；反相位光相互抵消。',
    tipEn: 'Interference is key to understanding waveplate behavior.',
    tipZh: '理解干涉是掌握波片原理的关键。',
    color: '#f59e0b',
    relatedComponents: ['waveplate'],
  },
]

// ============================================
// Compact Principle Icon Button
// ============================================

interface PrincipleIconProps {
  principle: Principle
  isActive: boolean
  onClick: () => void
  size?: 'sm' | 'md'
}

function PrincipleIcon({ principle, isActive, onClick, size = 'md' }: PrincipleIconProps) {
  const { theme } = useTheme()
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-sm' : 'w-9 h-9 text-base'

  return (
    <button
      onClick={onClick}
      className={cn(
        sizeClass,
        'rounded-lg flex items-center justify-center transition-all duration-200',
        'hover:scale-110 active:scale-95',
        isActive
          ? 'shadow-lg'
          : 'hover:shadow-md'
      )}
      style={{
        backgroundColor: isActive
          ? `${principle.color}30`
          : theme === 'dark' ? '#1e293b' : '#f1f5f9',
        color: principle.color,
        borderColor: isActive ? principle.color : 'transparent',
        // Ring color applied via box-shadow for active state
        boxShadow: isActive ? `0 0 0 2px ${principle.color}` : undefined,
      }}
      title={principle.titleEn}
    >
      {principle.icon}
    </button>
  )
}

// ============================================
// Principle Detail Card
// ============================================

interface PrincipleDetailCardProps {
  principle: Principle
  onClose: () => void
}

function PrincipleDetailCard({ principle, onClose }: PrincipleDetailCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div
      className={cn(
        'rounded-xl border shadow-xl p-4 w-72 animate-in fade-in slide-in-from-left-2 duration-200',
        theme === 'dark'
          ? 'bg-slate-900/95 border-slate-700 backdrop-blur-xl'
          : 'bg-white/95 border-gray-200 backdrop-blur-xl'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{
              backgroundColor: `${principle.color}20`,
              color: principle.color,
            }}
          >
            {principle.icon}
          </div>
          <div>
            <h4 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? principle.titleZh : principle.titleEn}
            </h4>
            {principle.formula && (
              <code
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded font-mono',
                  theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
                )}
              >
                {principle.formula}
              </code>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className={cn(
            'p-1 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className={cn('text-sm mb-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
        {isZh ? principle.descriptionZh : principle.descriptionEn}
      </p>

      {/* Tip */}
      <div
        className={cn(
          'p-2 rounded-lg text-xs',
          theme === 'dark' ? 'bg-slate-800' : 'bg-amber-50'
        )}
      >
        <span className="mr-1">💡</span>
        <span className={theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}>
          {isZh ? principle.tipZh : principle.tipEn}
        </span>
      </div>

      {/* Mini Diagram */}
      <div className="mt-3">
        <PrincipleMiniDiagram principleId={principle.id} />
      </div>
    </div>
  )
}

// ============================================
// Principle Mini Diagrams
// ============================================

function PrincipleMiniDiagram({ principleId }: { principleId: string }) {
  const { theme } = useTheme()

  const diagrams: Record<string, React.ReactNode> = {
    orthogonality: (
      <svg viewBox="0 0 200 60" className="w-full h-12">
        <rect width="200" height="60" fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} rx="6" />
        {/* Horizontal polarization */}
        <line x1="30" y1="30" x2="170" y2="30" stroke="#ff4444" strokeWidth="2" opacity="0.8" />
        {/* Vertical polarization */}
        <line x1="100" y1="8" x2="100" y2="52" stroke="#44ff44" strokeWidth="2" opacity="0.8" />
        {/* Labels */}
        <text x="175" y="34" fontSize="8" fill="#ff4444">0°</text>
        <text x="104" y="12" fontSize="8" fill="#44ff44">90°</text>
        {/* Perpendicular symbol */}
        <circle cx="100" cy="30" r="3" fill="none" stroke={theme === 'dark' ? '#fff' : '#333'} strokeWidth="1" />
      </svg>
    ),
    malus: (
      <svg viewBox="0 0 200 60" className="w-full h-12">
        <rect width="200" height="60" fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} rx="6" />
        {/* Input light */}
        <line x1="10" y1="30" x2="60" y2="30" stroke="#ff4444" strokeWidth="3" />
        {/* Polarizer */}
        <rect x="65" y="12" width="6" height="36" fill={theme === 'dark' ? '#64748b' : '#94a3b8'} rx="2" />
        <line x1="68" y1="15" x2="68" y2="45" stroke="#22d3ee" strokeWidth="2" />
        {/* Attenuated output */}
        <line x1="75" y1="30" x2="145" y2="30" stroke="#ffaa00" strokeWidth="2" opacity="0.6" />
        {/* Sensor */}
        <rect x="150" y="22" width="16" height="16" fill="#10b981" rx="2" />
        {/* Intensity indicator */}
        <text x="168" y="50" fontSize="9" fill={theme === 'dark' ? '#22d3ee' : '#0891b2'} fontFamily="monospace">
          I=I₀cos²θ
        </text>
      </svg>
    ),
    birefringence: (
      <svg viewBox="0 0 200 60" className="w-full h-12">
        <rect width="200" height="60" fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} rx="6" />
        {/* Input light */}
        <line x1="10" y1="30" x2="55" y2="30" stroke="#ff4444" strokeWidth="2" />
        {/* Crystal */}
        <polygon points="60,15 85,15 95,45 70,45" fill={theme === 'dark' ? '#8b5cf6' : '#a78bfa'} opacity="0.6" />
        {/* o-ray */}
        <line x1="95" y1="22" x2="160" y2="15" stroke="#ff4444" strokeWidth="2" />
        {/* e-ray */}
        <line x1="95" y1="38" x2="160" y2="45" stroke="#44ff44" strokeWidth="2" />
        {/* Labels */}
        <text x="165" y="18" fontSize="7" fill="#ff4444">o</text>
        <text x="165" y="48" fontSize="7" fill="#44ff44">e</text>
      </svg>
    ),
    interference: (
      <svg viewBox="0 0 200 60" className="w-full h-12">
        <rect width="200" height="60" fill={theme === 'dark' ? '#0f172a' : '#f8fafc'} rx="6" />
        {/* Constructive (top) */}
        <path d="M 15,20 Q 40,10 65,20 T 115,20" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
        <circle cx="135" cy="20" r="8" fill="#22d3ee" opacity="0.5" />
        <text x="150" y="24" fontSize="8" fill={theme === 'dark' ? '#22d3ee' : '#0891b2'}>φ=0 (Bright)</text>
        {/* Destructive (bottom) */}
        <path d="M 15,42 Q 40,32 65,42 T 115,42" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M 15,42 Q 40,52 65,42 T 115,42" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,2" />
        <line x1="131" y1="38" x2="139" y2="46" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} strokeWidth="1.5" />
        <line x1="131" y1="46" x2="139" y2="38" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} strokeWidth="1.5" />
        <text x="150" y="46" fontSize="8" fill={theme === 'dark' ? '#ef4444' : '#dc2626'}>φ=π (Dark)</text>
      </svg>
    ),
  }

  return diagrams[principleId] || null
}

// ============================================
// Optical Path Templates
// ============================================

function OpticalPathsContent() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const paths = [
    {
      id: 'basic',
      nameEn: 'Basic',
      nameZh: '基础',
      descEn: 'Polarized Light Generation',
      descZh: '偏振光生成',
      color: '#10b981',
      components: ['emitter', 'polarizer', 'sensor'],
    },
    {
      id: 'malus',
      nameEn: 'Malus',
      nameZh: '马吕斯',
      descEn: 'Intensity Measurement',
      descZh: '强度测量',
      color: '#3b82f6',
      components: ['emitter', 'P1', 'P2(θ)', 'sensor'],
    },
    {
      id: 'birefringent',
      nameEn: 'Split',
      nameZh: '分束',
      descEn: 'Beam Splitting',
      descZh: '光束分离',
      color: '#8b5cf6',
      components: ['emitter', 'crystal', 'sensors×2'],
    },
  ]

  return (
    <div className="space-y-2">
      {paths.map((path) => (
        <div
          key={path.id}
          className={cn(
            'p-2 rounded-lg border transition-colors cursor-pointer',
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              : 'bg-white border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: path.color }}
            />
            <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? path.nameZh : path.nameEn}
            </span>
            <span className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
              {isZh ? path.descZh : path.descEn}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {path.components.map((comp, idx) => (
              <div key={idx} className="flex items-center">
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-mono',
                    theme === 'dark' ? 'bg-slate-900 text-gray-300' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {comp}
                </span>
                {idx < path.components.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-gray-400 mx-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={cn('text-[10px] text-center pt-1', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
        💡 {isZh ? '点击光路模板快速搭建' : 'Click template to quickly build'}
      </div>
    </div>
  )
}

// ============================================
// Main Principles Panel Component
// ============================================

export function PrinciplesPanel() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [mode, setMode] = useState<PanelMode>('compact')
  const [activeTab, setActiveTab] = useState<PanelTab>('principles')
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null)
  const [isPinned, setIsPinned] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut: P to toggle panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setMode((prev) => {
          if (prev === 'minimized') return 'compact'
          if (prev === 'compact') return 'expanded'
          return 'minimized'
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Click outside to close when not pinned
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isPinned && mode === 'expanded' && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMode('compact')
        setSelectedPrinciple(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isPinned, mode])

  const handlePrincipleClick = useCallback((principle: Principle) => {
    if (selectedPrinciple?.id === principle.id) {
      setSelectedPrinciple(null)
    } else {
      setSelectedPrinciple(principle)
      setMode('expanded')
    }
  }, [selectedPrinciple])

  // Minimized mode: just a floating button
  if (mode === 'minimized') {
    return (
      <div className="fixed left-4 top-28 z-30">
        <button
          onClick={() => setMode('compact')}
          className={cn(
            'p-2.5 rounded-xl shadow-lg transition-all hover:scale-105',
            'bg-gradient-to-br',
            theme === 'dark'
              ? 'from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-400'
              : 'from-amber-50 to-amber-100 border border-amber-200 text-amber-600'
          )}
          title={isZh ? '显示光学原理 (P)' : 'Show Optical Principles (P)'}
        >
          <Lightbulb className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // Compact mode: floating bar with principle icons
  if (mode === 'compact') {
    return (
      <div
        ref={panelRef}
        className={cn(
          'fixed left-4 top-28 z-30 rounded-xl shadow-xl border transition-all duration-200',
          theme === 'dark'
            ? 'bg-slate-900/95 border-slate-700 backdrop-blur-xl'
            : 'bg-white/95 border-gray-200 backdrop-blur-xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50">
          <Lightbulb className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
          <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '光学原理' : 'Principles'}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setMode('expanded')}
              className={cn(
                'p-1 rounded transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '展开' : 'Expand'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('minimized')}
              className={cn(
                'p-1 rounded transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '最小化 (P)' : 'Minimize (P)'}
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Principle Icons */}
        <div className="flex items-center gap-1.5 p-2">
          {PRINCIPLES.map((principle) => (
            <PrincipleIcon
              key={principle.id}
              principle={principle}
              isActive={selectedPrinciple?.id === principle.id}
              onClick={() => handlePrincipleClick(principle)}
              size="sm"
            />
          ))}
        </div>

        {/* Expanded Principle Detail */}
        {selectedPrinciple && (
          <div className="absolute left-full top-0 ml-2">
            <PrincipleDetailCard
              principle={selectedPrinciple}
              onClose={() => setSelectedPrinciple(null)}
            />
          </div>
        )}

        {/* Keyboard hint */}
        <div className={cn(
          'px-3 py-1 text-[10px] border-t',
          theme === 'dark' ? 'text-gray-500 border-slate-700/50' : 'text-gray-400 border-gray-200/50'
        )}>
          <kbd className={cn(
            'px-1 rounded text-[9px]',
            theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
          )}>P</kbd>
          {' '}{isZh ? '切换模式' : 'toggle'}
        </div>
      </div>
    )
  }

  // Expanded mode: full panel with tabs
  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed left-4 top-28 z-30 rounded-xl shadow-xl border transition-all duration-200 w-80',
        theme === 'dark'
          ? 'bg-slate-900/95 border-slate-700 backdrop-blur-xl'
          : 'bg-white/95 border-gray-200 backdrop-blur-xl'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-3 py-2 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <Lightbulb className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
          <span className={cn('text-sm font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '光学原理' : 'Optical Principles'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={cn(
              'p-1.5 rounded transition-colors',
              isPinned
                ? theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                : theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
            title={isPinned ? (isZh ? '取消固定' : 'Unpin') : (isZh ? '固定面板' : 'Pin panel')}
          >
            {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setMode('compact')}
            className={cn(
              'p-1.5 rounded transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            )}
            title={isZh ? '收起' : 'Collapse'}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={cn(
        'flex border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <button
          onClick={() => setActiveTab('principles')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
            activeTab === 'principles'
              ? theme === 'dark'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {isZh ? '第一性原理' : 'First Principles'}
        </button>
        <button
          onClick={() => setActiveTab('paths')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
            activeTab === 'paths'
              ? theme === 'dark'
                ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-500/5'
                : 'text-violet-600 border-b-2 border-violet-500 bg-violet-50'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Route className="w-3.5 h-3.5" />
          {isZh ? '光路模板' : 'Path Templates'}
        </button>
      </div>

      {/* Content */}
      <div className="p-3 max-h-[400px] overflow-y-auto">
        {activeTab === 'principles' ? (
          <div className="space-y-3">
            {/* Principle Grid */}
            <div className="grid grid-cols-2 gap-2">
              {PRINCIPLES.map((principle) => (
                <button
                  key={principle.id}
                  onClick={() => handlePrincipleClick(principle)}
                  className={cn(
                    'p-2 rounded-lg border text-left transition-all',
                    selectedPrinciple?.id === principle.id
                      ? 'shadow-md'
                      : 'hover:shadow',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  )}
                  style={{
                    boxShadow: selectedPrinciple?.id === principle.id ? `0 0 0 2px ${principle.color}` : undefined,
                    borderColor: selectedPrinciple?.id === principle.id ? principle.color : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: `${principle.color}20`,
                        color: principle.color,
                      }}
                    >
                      {principle.icon}
                    </span>
                    <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {isZh ? principle.titleZh : principle.titleEn}
                    </span>
                  </div>
                  {principle.formula && (
                    <code className={cn(
                      'text-[10px] px-1 rounded font-mono',
                      theme === 'dark' ? 'bg-slate-900 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
                    )}>
                      {principle.formula}
                    </code>
                  )}
                </button>
              ))}
            </div>

            {/* Selected Principle Detail */}
            {selectedPrinciple && (
              <div
                className={cn(
                  'p-3 rounded-lg border',
                  theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
                )}
              >
                <p className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                  {isZh ? selectedPrinciple.descriptionZh : selectedPrinciple.descriptionEn}
                </p>
                <div className={cn(
                  'p-2 rounded text-xs',
                  theme === 'dark' ? 'bg-slate-900' : 'bg-amber-50'
                )}>
                  <span className="mr-1">💡</span>
                  <span className={theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}>
                    {isZh ? selectedPrinciple.tipZh : selectedPrinciple.tipEn}
                  </span>
                </div>
                <div className="mt-2">
                  <PrincipleMiniDiagram principleId={selectedPrinciple.id} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <OpticalPathsContent />
        )}
      </div>

      {/* Footer */}
      <div className={cn(
        'px-3 py-2 border-t text-[10px] flex items-center justify-between',
        theme === 'dark' ? 'border-slate-700 text-gray-500' : 'border-gray-200 text-gray-400'
      )}>
        <span>
          <kbd className={cn('px-1 rounded', theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100')}>P</kbd>
          {' '}{isZh ? '切换模式' : 'toggle'}
        </span>
        {isPinned && (
          <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>
            📌 {isZh ? '已固定' : 'Pinned'}
          </span>
        )}
      </div>
    </div>
  )
}

export default PrinciplesPanel
