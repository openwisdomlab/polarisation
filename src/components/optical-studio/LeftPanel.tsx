/**
 * Left Panel Component - 左侧面板组件
 *
 * Redesigned panel combining:
 * - Mode tabs (Experiments / Design / Challenges / Tutorials)
 * - Component palette (in Design mode)
 * - Content lists for each mode
 * - Better visual hierarchy and spacing
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/shared'
import {
  Play, Eye, ChevronRight, ChevronLeft,
  FlaskConical, Wrench, Target, GraduationCap,
  CheckCircle2, Lightbulb, Search
} from 'lucide-react'
import { useOpticalBenchStore } from '@/stores/opticalBenchStore'
import {
  CLASSIC_EXPERIMENTS,
  CHALLENGES,
  TUTORIALS,
  PALETTE_COMPONENTS,
  DIFFICULTY_CONFIG,
} from '@/data'
import type { ClassicExperiment, Challenge, Tutorial } from '@/stores/opticalBenchStore'

type PanelTab = 'experiments' | 'design' | 'challenges' | 'tutorials'

// ============================================
// Tab Button Component
// ============================================

interface TabButtonProps {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
  badge?: number
}

function TabButton({ active, icon, label, onClick, badge }: TabButtonProps) {
  const { theme } = useTheme()

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all',
        active
          ? theme === 'dark'
            ? 'bg-violet-500/20 text-violet-400'
            : 'bg-violet-100 text-violet-700'
          : theme === 'dark'
            ? 'text-gray-500 hover:text-gray-300 hover:bg-slate-800'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      )}
    >
      <span className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center rounded-full bg-violet-500 text-white text-[10px] font-bold">
            {badge}
          </span>
        )}
      </span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

// ============================================
// Experiment Card Component
// ============================================

interface ExperimentCardProps {
  experiment: ClassicExperiment
  onLoad: () => void
  isActive?: boolean
}

function ExperimentCard({ experiment, onLoad, isActive }: ExperimentCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[experiment.difficulty]

  return (
    <div className={cn(
      'rounded-lg border p-2.5 transition-all cursor-pointer group',
      isActive
        ? theme === 'dark'
          ? 'bg-violet-500/10 border-violet-500/50'
          : 'bg-violet-50 border-violet-300'
        : theme === 'dark'
          ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
          : 'bg-white/50 border-gray-200 hover:border-gray-300'
    )}
    onClick={onLoad}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className={cn(
          'font-medium text-xs line-clamp-1',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? experiment.nameZh : experiment.nameEn}
        </h4>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <p className={cn(
        'text-[10px] mb-2 line-clamp-2',
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      )}>
        {isZh ? experiment.descriptionZh : experiment.descriptionEn}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onLoad()
          }}
          className={cn(
            'flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
            theme === 'dark'
              ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
          )}
        >
          <Play className="w-3 h-3" />
          {isZh ? '加载' : 'Load'}
        </button>
        {experiment.linkedDemo && (
          <Link
            to={`/demos?demo=${experiment.linkedDemo}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'p-1 rounded transition-colors',
              theme === 'dark' ? 'text-gray-500 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'
            )}
            title={isZh ? '查看演示' : 'View Demo'}
          >
            <Eye className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  )
}

// ============================================
// Challenge Card Component
// ============================================

interface ChallengeCardProps {
  challenge: Challenge
  onLoad: () => void
  isCompleted?: boolean
  isActive?: boolean
}

function ChallengeCard({ challenge, onLoad, isCompleted, isActive }: ChallengeCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[challenge.difficulty]

  return (
    <div className={cn(
      'rounded-lg border p-2.5 transition-all cursor-pointer',
      isCompleted
        ? theme === 'dark'
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-emerald-50 border-emerald-200'
        : isActive
          ? theme === 'dark'
            ? 'bg-amber-500/10 border-amber-500/50'
            : 'bg-amber-50 border-amber-300'
          : theme === 'dark'
            ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
            : 'bg-white/50 border-gray-200 hover:border-gray-300'
    )}
    onClick={onLoad}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
          <h4 className={cn(
            'font-medium text-xs line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? challenge.nameZh : challenge.nameEn}
          </h4>
        </div>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <div className={cn(
        'p-1.5 rounded text-[10px] mb-2',
        theme === 'dark' ? 'bg-slate-800/50 text-cyan-400' : 'bg-cyan-50 text-cyan-700'
      )}>
        <Target className="w-3 h-3 inline mr-1" />
        {isZh ? challenge.goal.zh : challenge.goal.en}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onLoad()
        }}
        className={cn(
          'w-full flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
          theme === 'dark'
            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
        )}
      >
        <Target className="w-3 h-3" />
        {isZh ? '开始' : 'Start'}
      </button>
    </div>
  )
}

// ============================================
// Tutorial Card Component
// ============================================

interface TutorialCardProps {
  tutorial: Tutorial
  onStart: () => void
}

function TutorialCard({ tutorial, onStart }: TutorialCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'rounded-lg border p-2.5 transition-all cursor-pointer',
      theme === 'dark'
        ? 'bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/50'
        : 'bg-white/50 border-gray-200 hover:border-cyan-300'
    )}
    onClick={onStart}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          'w-6 h-6 rounded flex items-center justify-center',
          theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
        )}>
          <GraduationCap className={cn('w-3.5 h-3.5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-medium text-xs line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? tutorial.nameZh : tutorial.nameEn}
          </h4>
          <p className={cn('text-[10px]', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            {tutorial.steps.length} {isZh ? '步骤' : 'steps'}
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onStart()
        }}
        className={cn(
          'w-full flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
          theme === 'dark'
            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
        )}
      >
        <GraduationCap className="w-3 h-3" />
        {isZh ? '开始教程' : 'Start'}
      </button>
    </div>
  )
}

// ============================================
// Component Palette (Design Tab)
// ============================================

function ComponentPalette() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const addComponent = useOpticalBenchStore(state => state.addComponent)

  return (
    <div className="space-y-3">
      <div className={cn(
        'flex items-center gap-2 p-2 rounded-lg',
        theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50'
      )}>
        <Lightbulb className={cn('w-4 h-4', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
        <p className={cn('text-[10px]', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {isZh ? '点击添加组件到光路' : 'Click to add components'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PALETTE_COMPONENTS.map((item, index) => (
          <button
            key={item.type}
            data-component={item.type}
            onClick={() => addComponent(item.type)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all hover:scale-[1.02]',
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50 hover:bg-slate-800'
                : 'bg-white border-gray-200 hover:border-violet-400 hover:bg-violet-50'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className={cn('text-[10px] font-medium text-center', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? item.nameZh : item.nameEn}
            </span>
            <kbd className={cn(
              'text-[9px] px-1.5 py-0.5 rounded',
              theme === 'dark' ? 'bg-slate-700/50 text-gray-500' : 'bg-gray-100 text-gray-400'
            )}>
              {index + 1}
            </kbd>
          </button>
        ))}
      </div>

      {/* Quick Tips */}
      <div className={cn(
        'p-2 rounded-lg border text-[10px]',
        theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500'
      )}>
        <p className="mb-1 font-medium">{isZh ? '提示：' : 'Tips:'}</p>
        <ul className="space-y-0.5">
          <li>• {isZh ? '按 1-7 快速添加组件' : 'Press 1-7 to quick add'}</li>
          <li>• {isZh ? '拖动组件调整位置' : 'Drag to move components'}</li>
          <li>• {isZh ? '按 R 旋转选中组件' : 'Press R to rotate'}</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================
// Main Left Panel Component
// ============================================

interface LeftPanelProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function LeftPanel({ collapsed = false, onToggleCollapse }: LeftPanelProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [activeTab, setActiveTab] = useState<PanelTab>('design')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    loadExperiment,
    loadChallenge,
    startTutorial,
    currentExperiment,
    currentChallenge,
    challengeCompleted,
  } = useOpticalBenchStore()

  const tabs: { id: PanelTab; icon: React.ReactNode; labelEn: string; labelZh: string }[] = [
    { id: 'design', icon: <Wrench className="w-4 h-4" />, labelEn: 'Design', labelZh: '设计' },
    { id: 'experiments', icon: <FlaskConical className="w-4 h-4" />, labelEn: 'Experiments', labelZh: '实验' },
    { id: 'challenges', icon: <Target className="w-4 h-4" />, labelEn: 'Challenges', labelZh: '挑战' },
    { id: 'tutorials', icon: <GraduationCap className="w-4 h-4" />, labelEn: 'Tutorials', labelZh: '教程' },
  ]

  // Filter content based on search
  const filteredExperiments = CLASSIC_EXPERIMENTS.filter(exp =>
    searchQuery === '' ||
    exp.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.nameZh.includes(searchQuery)
  )

  const filteredChallenges = CHALLENGES.filter(ch =>
    searchQuery === '' ||
    ch.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.nameZh.includes(searchQuery)
  )

  return (
    <aside className={cn(
      'flex flex-col flex-shrink-0 border-r transition-all duration-300',
      collapsed ? 'w-14' : 'w-64',
      theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-gray-200'
    )}>
      {/* Collapse Toggle */}
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      )}>
        {!collapsed && (
          <span className={cn('font-semibold text-xs', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? '工具箱' : 'Toolbox'}
          </span>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500',
              collapsed && 'mx-auto'
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Tab Selector */}
      {!collapsed && (
        <div className={cn(
          'flex items-stretch gap-1 p-2 border-b',
          theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
        )}>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              icon={tab.icon}
              label={isZh ? tab.labelZh : tab.labelEn}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      )}

      {/* Collapsed View - Show icons only */}
      {collapsed && (
        <div className="flex flex-col items-center gap-1 p-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                onToggleCollapse?.()
              }}
              className={cn(
                'p-2 rounded-lg transition-colors',
                activeTab === tab.id
                  ? theme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
                  : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              )}
              title={isZh ? tab.labelZh : tab.labelEn}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      )}

      {/* Search (for experiments/challenges) */}
      {!collapsed && (activeTab === 'experiments' || activeTab === 'challenges') && (
        <div className="p-2">
          <div className="relative">
            <Search className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )} />
            <input
              type="text"
              placeholder={isZh ? '搜索...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-7 pr-2 py-1.5 rounded-lg border text-xs',
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              )}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {activeTab === 'design' && <ComponentPalette />}

          {activeTab === 'experiments' && (
            <>
              {filteredExperiments.length === 0 ? (
                <p className={cn('text-xs text-center py-4', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                  {isZh ? '未找到实验' : 'No experiments found'}
                </p>
              ) : (
                filteredExperiments.map(exp => (
                  <ExperimentCard
                    key={exp.id}
                    experiment={exp}
                    onLoad={() => loadExperiment(exp)}
                    isActive={currentExperiment?.id === exp.id}
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'challenges' && (
            <>
              {filteredChallenges.length === 0 ? (
                <p className={cn('text-xs text-center py-4', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                  {isZh ? '未找到挑战' : 'No challenges found'}
                </p>
              ) : (
                filteredChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onLoad={() => loadChallenge(challenge)}
                    isCompleted={currentChallenge?.id === challenge.id && challengeCompleted}
                    isActive={currentChallenge?.id === challenge.id}
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'tutorials' && (
            TUTORIALS.map(tutorial => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                onStart={() => startTutorial(tutorial)}
              />
            ))
          )}
        </div>
      )}
    </aside>
  )
}

export default LeftPanel
