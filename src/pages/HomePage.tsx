/**
 * HomePage - 光的编年史首页
 * 首页 = 光的编年史，整合所有内容的入口
 *
 * 架构：
 * 1. 课程介绍（零一学院）
 * 2. 知识棱镜（光学全景图）
 * 3. 双轨时间线（光学史 + 偏振专题）
 * 4. 课程大纲（5个单元）
 * 5. 快捷导航（所有模块入口）
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarWorldLogo } from '@/components/icons'
import { useCourseProgress } from '@/hooks'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  BookOpen,
  FlaskConical,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Zap,
  Microscope,
  Sun,
  Layers,
  History,
  Calculator,
  Compass,
  Target,
  Atom,
  Eye,
  Clock,
  Users,
} from 'lucide-react'

// Chronicles components
import {
  OpticalOverviewDiagram,
  DualTrackCard,
  StoryModal,
  CenturyNavigator,
} from '@/components/chronicles'

// Data imports
import { TIMELINE_EVENTS } from '@/data/timeline-events'
import { CATEGORY_LABELS } from '@/data/chronicles-constants'

// ============================================================================
// 课程大纲数据结构 - 5个单元
// ============================================================================

interface UnitResource {
  type: 'demo' | 'experiment' | 'history' | 'game' | 'tool'
  id: string
  titleKey: string
  link: string
  icon?: React.ReactNode
}

interface CourseSection {
  id: string
  titleKey: string
  descKey: string
  resources: UnitResource[]
}

interface CourseUnit {
  id: string
  number: number
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  coreQuestion?: string // P-SRT 核心问题
  coreQuestionEn?: string
  scenario?: string // 情景导入
  scenarioEn?: string
  icon: React.ReactNode
  color: string
  gradient: string
  bgPattern: string
  sections: CourseSection[]
  keyExperiment?: {
    titleKey: string
    link: string
  }
}

// 5个单元课程数据 - P-SRT 风格
const COURSE_UNITS: CourseUnit[] = [
  {
    // 第一单元：光的偏振态及其调制和测量
    id: 'unit1',
    number: 1,
    titleKey: 'home.units.unit1.title',
    subtitleKey: 'home.units.unit1.subtitle',
    descriptionKey: 'home.units.unit1.description',
    coreQuestion: '透过冰洲石看字，为什么会看到两个像？',
    coreQuestionEn: 'Why do we see double images through Iceland spar?',
    scenario: '1669年，巴多林意外发现冰洲石的奇异现象，开启了偏振光学的大门...',
    scenarioEn: 'In 1669, Bartholin discovered the strange phenomenon of Iceland spar...',
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#22D3EE',
    gradient: 'from-cyan-500 to-blue-500',
    bgPattern: 'radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit1.keyExp',
      link: '/demos/birefringence',
    },
    sections: [
      {
        id: '1.1',
        titleKey: 'home.units.unit1.s1.title',
        descKey: 'home.units.unit1.s1.desc',
        resources: [
          { type: 'demo', id: 'light-wave', titleKey: 'home.res.lightWave', link: '/demos/light-wave', icon: <Sparkles className="w-4 h-4" /> },
          { type: 'demo', id: 'polarization-intro', titleKey: 'home.res.polarIntro', link: '/demos/polarization-intro', icon: <Eye className="w-4 h-4" /> },
        ],
      },
      {
        id: '1.2',
        titleKey: 'home.units.unit1.s2.title',
        descKey: 'home.units.unit1.s2.desc',
        resources: [
          { type: 'demo', id: 'birefringence', titleKey: 'home.res.birefringence', link: '/demos/birefringence', icon: <Layers className="w-4 h-4" /> },
          { type: 'history', id: 'calcite-history', titleKey: 'home.res.calciteHistory', link: '/chronicles?topic=calcite', icon: <History className="w-4 h-4" /> },
        ],
      },
      {
        id: '1.3',
        titleKey: 'home.units.unit1.s3.title',
        descKey: 'home.units.unit1.s3.desc',
        resources: [
          { type: 'demo', id: 'malus', titleKey: 'home.res.malus', link: '/demos/malus', icon: <Target className="w-4 h-4" /> },
          { type: 'history', id: 'malus-history', titleKey: 'home.res.malusHistory', link: '/chronicles?topic=malus', icon: <History className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    // 第二单元：界面反射的偏振特征
    id: 'unit2',
    number: 2,
    titleKey: 'home.units.unit2.title',
    subtitleKey: 'home.units.unit2.subtitle',
    descriptionKey: 'home.units.unit2.description',
    coreQuestion: '为什么偏振太阳镜能减少路面的刺眼反光？',
    coreQuestionEn: 'Why can polarized sunglasses reduce glare from road surfaces?',
    scenario: '马吕斯用冰洲石观察卢森堡宫玻璃窗反射的落日，发现旋转晶体时，两个太阳像变成一个...',
    scenarioEn: 'Malus observed the sunset reflected from palace windows through Iceland spar...',
    icon: <Zap className="w-5 h-5" />,
    color: '#A78BFA',
    gradient: 'from-violet-500 to-purple-500',
    bgPattern: 'radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit2.keyExp',
      link: '/demos/brewster',
    },
    sections: [
      {
        id: '2.1',
        titleKey: 'home.units.unit2.s1.title',
        descKey: 'home.units.unit2.s1.desc',
        resources: [
          { type: 'demo', id: 'fresnel', titleKey: 'home.res.fresnel', link: '/demos/fresnel', icon: <Sparkles className="w-4 h-4" /> },
        ],
      },
      {
        id: '2.2',
        titleKey: 'home.units.unit2.s2.title',
        descKey: 'home.units.unit2.s2.desc',
        resources: [
          { type: 'demo', id: 'brewster', titleKey: 'home.res.brewster', link: '/demos/brewster', icon: <Zap className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    // 第三单元：透明介质的偏振特征
    id: 'unit3',
    number: 3,
    titleKey: 'home.units.unit3.title',
    subtitleKey: 'home.units.unit3.subtitle',
    descriptionKey: 'home.units.unit3.description',
    coreQuestion: '玻璃幕墙边角为什么会出现彩色图案？糖水为什么能让偏振光旋转？',
    coreQuestionEn: 'Why do colorful patterns appear at glass curtain wall corners? Why does sugar water rotate polarized light?',
    scenario: '透过偏振片观察塑料袋、保鲜膜，你会发现意想不到的彩虹色...',
    scenarioEn: 'Look at plastic bags through a polarizer and discover unexpected rainbow colors...',
    icon: <Layers className="w-5 h-5" />,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    bgPattern: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit3.keyExp',
      link: '/demos/chromatic',
    },
    sections: [
      {
        id: '3.1',
        titleKey: 'home.units.unit3.s1.title',
        descKey: 'home.units.unit3.s1.desc',
        resources: [
          { type: 'demo', id: 'chromatic', titleKey: 'home.res.chromatic', link: '/demos/chromatic', icon: <Sparkles className="w-4 h-4" /> },
          { type: 'demo', id: 'anisotropy', titleKey: 'home.res.anisotropy', link: '/demos/anisotropy', icon: <Layers className="w-4 h-4" /> },
        ],
      },
      {
        id: '3.2',
        titleKey: 'home.units.unit3.s2.title',
        descKey: 'home.units.unit3.s2.desc',
        resources: [
          { type: 'demo', id: 'optical-rotation', titleKey: 'home.res.opticalRotation', link: '/demos/optical-rotation', icon: <Compass className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    // 第四单元：浑浊介质的偏振特征
    id: 'unit4',
    number: 4,
    titleKey: 'home.units.unit4.title',
    subtitleKey: 'home.units.unit4.subtitle',
    descriptionKey: 'home.units.unit4.description',
    coreQuestion: '天空为什么是蓝色的？夕阳为什么是红色的？云为什么是白色的？',
    coreQuestionEn: 'Why is the sky blue? Why are sunsets red? Why are clouds white?',
    scenario: '仰望蓝天，你其实在看偏振光——只是肉眼察觉不到...',
    scenarioEn: 'Looking up at the blue sky, you are actually seeing polarized light...',
    icon: <Sun className="w-5 h-5" />,
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    bgPattern: 'radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit4.keyExp',
      link: '/demos/rayleigh',
    },
    sections: [
      {
        id: '4.1',
        titleKey: 'home.units.unit4.s1.title',
        descKey: 'home.units.unit4.s1.desc',
        resources: [
          { type: 'demo', id: 'rayleigh', titleKey: 'home.res.rayleigh', link: '/demos/rayleigh', icon: <Sun className="w-4 h-4" /> },
          { type: 'demo', id: 'mie', titleKey: 'home.res.mie', link: '/demos/mie-scattering', icon: <Atom className="w-4 h-4" /> },
        ],
      },
      {
        id: '4.2',
        titleKey: 'home.units.unit4.s2.title',
        descKey: 'home.units.unit4.s2.desc',
        resources: [
          { type: 'demo', id: 'monte-carlo', titleKey: 'home.res.monteCarlo', link: '/demos/monte-carlo-scattering', icon: <Sparkles className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    // 第五单元：全偏振光学技术
    id: 'unit5',
    number: 5,
    titleKey: 'home.units.unit5.title',
    subtitleKey: 'home.units.unit5.subtitle',
    descriptionKey: 'home.units.unit5.description',
    coreQuestion: '如何完整描述光的偏振状态？如何用偏振揭示物质的微观结构？',
    coreQuestionEn: 'How to fully describe polarization states? How to reveal microstructure with polarization?',
    scenario: '从Stokes矢量到Mueller矩阵，偏振测量成为探索物质世界的强大工具...',
    scenarioEn: 'From Stokes vectors to Mueller matrices, polarimetry becomes a powerful tool...',
    icon: <Microscope className="w-5 h-5" />,
    color: '#8B5CF6',
    gradient: 'from-violet-600 to-indigo-600',
    bgPattern: 'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
    keyExperiment: {
      titleKey: 'home.units.unit5.keyExp',
      link: '/demos/mueller',
    },
    sections: [
      {
        id: '5.1',
        titleKey: 'home.units.unit5.s1.title',
        descKey: 'home.units.unit5.s1.desc',
        resources: [
          { type: 'demo', id: 'stokes', titleKey: 'home.res.stokes', link: '/demos/stokes', icon: <Target className="w-4 h-4" /> },
          { type: 'demo', id: 'mueller', titleKey: 'home.res.mueller', link: '/demos/mueller', icon: <Layers className="w-4 h-4" /> },
          { type: 'tool', id: 'stokes-calc', titleKey: 'home.res.stokesCalc', link: '/calc/stokes', icon: <Calculator className="w-4 h-4" /> },
          { type: 'tool', id: 'mueller-calc', titleKey: 'home.res.muellerCalc', link: '/calc/mueller', icon: <Calculator className="w-4 h-4" /> },
        ],
      },
      {
        id: '5.2',
        titleKey: 'home.units.unit5.s2.title',
        descKey: 'home.units.unit5.s2.desc',
        resources: [
          { type: 'demo', id: 'jones', titleKey: 'home.res.jones', link: '/demos/jones', icon: <Sparkles className="w-4 h-4" /> },
          { type: 'tool', id: 'jones-calc', titleKey: 'home.res.jonesCalc', link: '/calc/jones', icon: <Calculator className="w-4 h-4" /> },
          { type: 'tool', id: 'poincare', titleKey: 'home.res.poincare', link: '/calc/poincare', icon: <Compass className="w-4 h-4" /> },
        ],
      },
      {
        id: '5.3',
        titleKey: 'home.units.unit5.s3.title',
        descKey: 'home.units.unit5.s3.desc',
        resources: [
          { type: 'demo', id: 'microscopy', titleKey: 'home.res.microscopy', link: '/demos/polarimetric-microscopy', icon: <Microscope className="w-4 h-4" /> },
        ],
      },
    ],
  },
]

// ============================================================================
// 动态背景组件
// ============================================================================

function PolarizationBackground({ theme }: { theme: 'dark' | 'light' }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? `conic-gradient(from ${time}deg at 50% 50%,
                rgba(34, 211, 238, 0.03) 0deg,
                rgba(167, 139, 250, 0.03) 120deg,
                rgba(139, 92, 246, 0.03) 240deg,
                rgba(34, 211, 238, 0.03) 360deg)`
            : `conic-gradient(from ${time}deg at 50% 50%,
                rgba(34, 211, 238, 0.02) 0deg,
                rgba(167, 139, 250, 0.02) 120deg,
                rgba(139, 92, 246, 0.02) 240deg,
                rgba(34, 211, 238, 0.02) 360deg)`,
        }}
      />
    </div>
  )
}

// ============================================================================
// 资源类型标签组件
// ============================================================================

function ResourceBadge({ type }: { type: UnitResource['type'] }) {
  const { t } = useTranslation()

  const config = {
    demo: { color: '#22D3EE', labelKey: 'home.resType.demo' },
    experiment: { color: '#F59E0B', labelKey: 'home.resType.experiment' },
    history: { color: '#C9A227', labelKey: 'home.resType.history' },
    game: { color: '#EC4899', labelKey: 'home.resType.game' },
    tool: { color: '#8B5CF6', labelKey: 'home.resType.tool' },
  }

  const cfg = config[type]

  return (
    <span
      className="text-[9px] px-1.5 py-0.5 rounded font-medium"
      style={{
        backgroundColor: `${cfg.color}20`,
        color: cfg.color,
      }}
    >
      {t(cfg.labelKey)}
    </span>
  )
}

// ============================================================================
// 单元卡片组件
// ============================================================================

function UnitCard({
  unit,
  theme,
  isExpanded,
  onToggle,
  completedDemos,
}: {
  unit: CourseUnit
  theme: 'dark' | 'light'
  isExpanded: boolean
  onToggle: () => void
  completedDemos: string[]
}) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // 计算进度
  const allResources = unit.sections.flatMap(s => s.resources.filter(r => r.type === 'demo'))
  const completedCount = allResources.filter(r => completedDemos.includes(r.id)).length
  const progressPercent = allResources.length > 0 ? Math.round((completedCount / allResources.length) * 100) : 0

  return (
    <div
      className={cn(
        'rounded-2xl border overflow-hidden transition-all duration-300',
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700/50'
          : 'bg-white/90 border-gray-200'
      )}
      style={{
        borderColor: isExpanded ? unit.color : undefined,
        boxShadow: isExpanded ? `0 4px 30px ${unit.color}20` : undefined,
        background: isExpanded ? unit.bgPattern : undefined,
      }}
    >
      {/* 单元头部 - 可点击展开 */}
      <button
        className={cn(
          'w-full p-4 flex items-center gap-4 text-left transition-colors',
          theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
        )}
        onClick={onToggle}
      >
        {/* 单元编号 */}
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg',
            unit.gradient
          )}
        >
          <span className="text-white text-xl font-bold">{unit.number}</span>
        </div>

        {/* 单元信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'text-base font-bold truncate',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t(unit.titleKey)}
            </h3>
          </div>
          <p className={cn(
            'text-sm truncate',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {t(unit.subtitleKey)}
          </p>

          {/* 进度条 */}
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'flex-1 h-1 rounded-full',
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            )}>
              <div
                className={cn('h-full rounded-full bg-gradient-to-r transition-all', unit.gradient)}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={cn(
              'text-[10px] font-medium',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {completedCount}/{allResources.length}
            </span>
          </div>
        </div>

        {/* 展开指示器 */}
        <ChevronDown
          className={cn(
            'w-5 h-5 flex-shrink-0 transition-transform duration-300',
            isExpanded ? 'rotate-180' : '',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}
        />
      </button>

      {/* 展开内容 */}
      {isExpanded && (
        <div className={cn(
          'px-4 pb-4 border-t',
          theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
        )}>
          {/* P-SRT 核心问题 */}
          {unit.coreQuestion && (
            <div className={cn(
              'mt-3 p-3 rounded-xl border-l-4',
              theme === 'dark'
                ? 'bg-cyan-900/20 border-cyan-500'
                : 'bg-cyan-50 border-cyan-500'
            )}>
              <div className="flex items-start gap-2">
                <span className="text-lg">🤔</span>
                <div>
                  <p className={cn(
                    'text-sm font-medium italic',
                    theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
                  )}>
                    {isZh ? unit.coreQuestion : unit.coreQuestionEn}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 情景导入 */}
          {unit.scenario && (
            <p className={cn(
              'text-sm mt-3 mb-3 italic',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? unit.scenario : unit.scenarioEn}
            </p>
          )}

          {/* 单元描述 */}
          <p className={cn(
            'text-sm mb-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {t(unit.descriptionKey)}
          </p>

          {/* 核心实验入口 */}
          {unit.keyExperiment && (
            <Link
              to={unit.keyExperiment.link}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl mb-4 transition-all hover:scale-[1.01]',
                'bg-gradient-to-r text-white shadow-lg',
                unit.gradient
              )}
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs opacity-80">{t('home.keyExperiment')}</p>
                <p className="font-medium">{t(unit.keyExperiment.titleKey)}</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}

          {/* 各小节内容 */}
          <div className="space-y-4">
            {unit.sections.map((section) => (
              <div key={section.id}>
                {/* 小节标题 */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
                  >
                    {section.id}
                  </span>
                  <h4 className={cn(
                    'text-sm font-semibold',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {t(section.titleKey)}
                  </h4>
                </div>
                <p className={cn(
                  'text-xs mb-2',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {t(section.descKey)}
                </p>

                {/* 资源列表 */}
                <div className="flex flex-wrap gap-2">
                  {section.resources.map((resource) => (
                    <Link
                      key={resource.id}
                      to={resource.link}
                      className={cn(
                        'group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-105',
                        theme === 'dark'
                          ? 'bg-slate-700/50 hover:bg-slate-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                    >
                      <span style={{ color: unit.color }}>{resource.icon}</span>
                      <span className={cn(
                        'font-medium',
                        theme === 'dark' ? 'text-white' : 'text-gray-700'
                      )}>
                        {t(resource.titleKey)}
                      </span>
                      <ResourceBadge type={resource.type} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


// ============================================================================
// 课程介绍 Hero 组件 (零一学院)
// ============================================================================

function CourseBannerHero({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()

  return (
    <div className="relative mb-8">
      {/* 背景光晕 */}
      <div className="absolute inset-0 -z-10">
        <div className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px]',
          theme === 'dark'
            ? 'bg-gradient-to-r from-cyan-500/15 via-violet-500/10 to-amber-500/15'
            : 'bg-gradient-to-r from-cyan-400/10 via-violet-400/8 to-amber-400/10'
        )} />
      </div>

      <div className="text-center pt-8 pb-6">
        {/* 课程标签 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={cn(
            'text-xs px-3 py-1 rounded-full font-medium',
            theme === 'dark'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'bg-cyan-100 text-cyan-700'
          )}>
            {t('home.courseBanner.badge')}
          </span>
        </div>

        {/* 主标题 - 偏振光下的新世界 */}
        <h1 className={cn(
          'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6',
          'text-transparent bg-clip-text',
          theme === 'dark'
            ? 'bg-gradient-to-br from-white via-cyan-200 to-violet-300'
            : 'bg-gradient-to-br from-gray-900 via-cyan-700 to-violet-700'
        )}>
          {t('home.chronicles.title')}
        </h1>

        {/* 课程描述 */}
        <p className={cn(
          'text-sm sm:text-base max-w-4xl mx-auto leading-relaxed',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {t('home.courseBanner.description')}
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 快捷导航组件
// ============================================================================

interface QuickNavItem {
  id: string
  titleKey: string
  descKey: string
  icon: React.ReactNode
  link: string
  color: string
  gradient: string
}

const QUICK_NAV_ITEMS: QuickNavItem[] = [
  {
    id: 'calc',
    titleKey: 'home.quick.calc',
    descKey: 'home.formulaLab.subtitle',
    icon: <Calculator className="w-5 h-5" />,
    link: '/calc',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 'lab',
    titleKey: 'home.quick.lab',
    descKey: 'home.labGroup.subtitle',
    icon: <Users className="w-5 h-5" />,
    link: '/lab',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-blue-500',
  },
  // Note: 偏振造物局 (experiments) is hidden - module not ready
]

// 偏振演示馆 - 核心入口组件
function DemoGalleryHero({ theme }: { theme: 'dark' | 'light' }) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="mb-8">
      <Link
        to="/demos"
        className={cn(
          'group block relative overflow-hidden rounded-2xl border-2 p-6 transition-all hover:scale-[1.01]',
          theme === 'dark'
            ? 'bg-gradient-to-br from-cyan-900/30 via-slate-800/80 to-blue-900/30 border-cyan-500/30 hover:border-cyan-400/50'
            : 'bg-gradient-to-br from-cyan-50 via-white to-blue-50 border-cyan-200 hover:border-cyan-400'
        )}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={cn(
            'absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full blur-3xl',
            theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-300/20'
          )} />
          <div className={cn(
            'absolute -bottom-1/2 -left-1/4 w-96 h-96 rounded-full blur-3xl',
            theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-300/20'
          )} />
        </div>

        <div className="relative flex items-center gap-6">
          {/* 图标 */}
          <div className={cn(
            'flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center',
            'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25'
          )}>
            <Eye className="w-8 h-8 text-white" />
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '偏振演示馆' : 'Polarization Demo Gallery'}
              </h2>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-cyan-100 text-cyan-700'
              )}>
                {isZh ? '核心模块' : 'Core Module'}
              </span>
            </div>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh
                ? '20+ 交互式演示，探索偏振光的奇妙世界。从基础概念到前沿应用，边玩边学。'
                : '20+ interactive demos to explore the fascinating world of polarized light. Learn by doing, from basics to cutting-edge applications.'}
            </p>
          </div>

          {/* 箭头 */}
          <ArrowRight className={cn(
            'w-6 h-6 flex-shrink-0 transition-transform group-hover:translate-x-2',
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
          )} />
        </div>
      </Link>
    </div>
  )
}

function QuickNavigation({ theme }: { theme: 'dark' | 'light' }) {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-gradient-to-br from-violet-400 to-purple-500">
          <Compass className="w-4 h-4 text-white" />
        </div>
        <h2 className={cn(
          'text-lg font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '学习工具' : 'Learning Tools'}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className={cn(
              'group flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.02]',
              theme === 'dark'
                ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
                : 'bg-white/80 border-gray-200 hover:border-gray-300'
            )}
          >
            <div
              className={cn('p-2 rounded-lg bg-gradient-to-br text-white', item.gradient)}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'font-semibold text-sm truncate',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t(item.titleKey)}
              </p>
              <p className={cn(
                'text-xs truncate',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              )}>
                {t(item.descKey)}
              </p>
            </div>
            <ArrowRight className={cn(
              'w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )} />
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 时间线组件
// ============================================================================

function TimelineSection({
  theme,
  isZh,
  isMobile,
}: {
  theme: 'dark' | 'light'
  isZh: boolean
  isMobile: boolean
}) {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [trackFilter, setTrackFilter] = useState<'all' | 'optics' | 'polarization'>('all')
  const [filter, setFilter] = useState<string>('')
  const [storyModalEvent, setStoryModalEvent] = useState<number | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)

  // Filter events
  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter(e => {
      const categoryMatch = !filter || e.category === filter
      const trackMatch = trackFilter === 'all' || e.track === trackFilter
      return categoryMatch && trackMatch
    }).sort((a, b) => a.year - b.year)
  }, [filter, trackFilter])

  // Story modal handlers
  const handleOpenStory = (index: number) => setStoryModalEvent(index)
  const handleCloseStory = () => setStoryModalEvent(null)
  const handleNextStory = () => {
    if (storyModalEvent !== null && storyModalEvent < filteredEvents.length - 1) {
      setStoryModalEvent(storyModalEvent + 1)
    }
  }
  const handlePrevStory = () => {
    if (storyModalEvent !== null && storyModalEvent > 0) {
      setStoryModalEvent(storyModalEvent - 1)
    }
  }

  // Navigate to linked event
  const handleLinkTo = useCallback((year: number, track: 'optics' | 'polarization') => {
    setTrackFilter('all')
    setFilter('')
    const allEventsSorted = [...TIMELINE_EVENTS].sort((a, b) => a.year - b.year)
    const targetIndex = allEventsSorted.findIndex(e => e.year === year && e.track === track)
    if (targetIndex !== -1) {
      setExpandedEvent(targetIndex)
      setTimeout(() => {
        const targetElement = document.querySelector(`[data-event-index="${targetIndex}"]`)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [])

  return (
    <div className="mb-8">
      {/* Section Header */}
      <button
        onClick={() => setShowTimeline(!showTimeline)}
        className={cn(
          'w-full flex items-center justify-between gap-3 mb-4 p-4 rounded-xl border transition-all',
          theme === 'dark'
            ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
            : 'bg-white/80 border-gray-200 hover:border-gray-300'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '历史时间线' : 'Historical Timeline'}
            </h2>
            <p className={cn(
              'text-xs',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            )}>
              {isZh ? '从17世纪到现代的光学发现' : 'Optical discoveries from the 17th century to modern times'}
            </p>
          </div>
        </div>
        <ChevronDown className={cn(
          'w-5 h-5 transition-transform',
          showTimeline ? 'rotate-180' : '',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        )} />
      </button>

      {showTimeline && (
        <>
          {/* Track filters */}
          <div className={cn(
            'flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg',
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
          )}>
            <span className={cn('text-sm font-medium mr-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {isZh ? '轨道：' : 'Track:'}
            </span>
            <button
              onClick={() => setTrackFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                trackFilter === 'all'
                  ? 'bg-gray-600 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              )}
            >
              {isZh ? '全部' : 'All'}
            </button>
            <button
              onClick={() => setTrackFilter('optics')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                trackFilter === 'optics'
                  ? 'bg-amber-500 text-white'
                  : theme === 'dark'
                    ? 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/20'
                    : 'text-amber-600 hover:text-amber-700 hover:bg-amber-100'
              )}
            >
              <Sun className="w-3.5 h-3.5" />
              {isZh ? '广义光学' : 'Optics'}
            </button>
            <button
              onClick={() => setTrackFilter('polarization')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                trackFilter === 'polarization'
                  ? 'bg-cyan-500 text-white'
                  : theme === 'dark'
                    ? 'text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/20'
                    : 'text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isZh ? '偏振光' : 'Polarization'}
            </button>
          </div>

          {/* Category filters */}
          <div className={cn(
            'flex flex-wrap items-center gap-2 mb-6 p-3 rounded-lg',
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
          )}>
            <span className={cn('text-sm font-medium mr-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              {isZh ? '类型：' : 'Type:'}
            </span>
            <button
              onClick={() => setFilter('')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                !filter
                  ? 'bg-gray-600 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              )}
            >
              {isZh ? '全部' : 'All'}
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  filter === key
                    ? 'bg-gray-600 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {isZh ? val.zh : val.en}
              </button>
            ))}
          </div>

          {/* Century Navigator - Desktop only */}
          {!isMobile && <CenturyNavigator events={filteredEvents} isZh={isZh} />}

          {/* Timeline */}
          {isMobile ? (
            /* Mobile Single-Track Timeline */
            <div className="relative pl-8">
              <div className={cn(
                'absolute left-3 top-0 bottom-0 w-0.5',
                theme === 'dark'
                  ? 'bg-gradient-to-b from-amber-500/50 via-gray-500/50 to-cyan-500/50'
                  : 'bg-gradient-to-b from-amber-300 via-gray-300 to-cyan-300'
              )} />
              {filteredEvents.map((event, idx) => (
                <div
                  key={`${event.year}-${event.titleEn}`}
                  className="relative mb-4 last:mb-0"
                  data-event-index={idx}
                >
                  <div className={cn(
                    'absolute -left-5 w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2',
                    event.track === 'optics'
                      ? theme === 'dark'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-amber-100 border-amber-500 text-amber-700'
                      : theme === 'dark'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-cyan-100 border-cyan-500 text-cyan-700'
                  )}>
                    {String(event.year).slice(-2)}
                  </div>
                  <DualTrackCard
                    event={event}
                    eventIndex={idx}
                    isExpanded={expandedEvent === idx}
                    onToggle={() => setExpandedEvent(expandedEvent === idx ? null : idx)}
                    onReadStory={() => handleOpenStory(idx)}
                    onLinkTo={handleLinkTo}
                    side={event.track === 'optics' ? 'left' : 'right'}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Desktop Dual Track Timeline */
            <div className="relative">
              {/* Track Labels */}
              <div className="flex items-center justify-between mb-6">
                <div className={cn(
                  'flex-1 text-center py-2 rounded-l-lg border-r',
                  theme === 'dark'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-amber-50 border-amber-200'
                )}>
                  <div className="flex items-center justify-center gap-2">
                    <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                    <span className={cn('font-semibold', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                      {isZh ? '广义光学' : 'General Optics'}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  'w-20 text-center py-2',
                  theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                )}>
                  <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                    {isZh ? '年份' : 'Year'}
                  </span>
                </div>
                <div className={cn(
                  'flex-1 text-center py-2 rounded-r-lg border-l',
                  theme === 'dark'
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-cyan-50 border-cyan-200'
                )}>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                    <span className={cn('font-semibold', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                      {isZh ? '偏振光' : 'Polarization'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center vertical line */}
              <div className={cn(
                'absolute left-1/2 top-[60px] bottom-0 w-0.5 -translate-x-1/2',
                theme === 'dark'
                  ? 'bg-gradient-to-b from-amber-500/50 via-gray-500/50 to-cyan-500/50'
                  : 'bg-gradient-to-b from-amber-300 via-gray-300 to-cyan-300'
              )} />

              {/* Events by year */}
              {(() => {
                const years = [...new Set(filteredEvents.map(e => e.year))].sort((a, b) => a - b)
                return years.map((year) => {
                  const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                  const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')
                  const hasOptics = opticsEvents.length > 0
                  const hasPolarization = polarizationEvents.length > 0

                  return (
                    <div key={year} className="relative flex items-stretch mb-6 last:mb-0">
                      {/* Left - Optics */}
                      <div className="flex-1 pr-4 flex justify-end">
                        {hasOptics && (
                          <div className="w-full max-w-md space-y-3">
                            {opticsEvents.map((opticsEvent) => {
                              const opticsIndex = filteredEvents.findIndex(e => e === opticsEvent)
                              return (
                                <div key={opticsEvent.titleEn} data-event-index={opticsIndex}>
                                  <DualTrackCard
                                    event={opticsEvent}
                                    eventIndex={opticsIndex}
                                    isExpanded={expandedEvent === opticsIndex}
                                    onToggle={() => setExpandedEvent(expandedEvent === opticsIndex ? null : opticsIndex)}
                                    onReadStory={() => handleOpenStory(opticsIndex)}
                                    onLinkTo={handleLinkTo}
                                    side="left"
                                  />
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Center year marker */}
                      <div className="w-20 flex flex-col items-center justify-start relative z-10 flex-shrink-0">
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2',
                          hasOptics && hasPolarization
                            ? theme === 'dark'
                              ? 'bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border-gray-500 text-white'
                              : 'bg-gradient-to-br from-amber-100 to-cyan-100 border-gray-400 text-gray-800'
                            : hasOptics
                              ? theme === 'dark'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                : 'bg-amber-100 border-amber-500 text-amber-700'
                              : theme === 'dark'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                : 'bg-cyan-100 border-cyan-500 text-cyan-700'
                        )}>
                          {year}
                        </div>
                      </div>

                      {/* Right - Polarization */}
                      <div className="flex-1 pl-4 flex justify-start">
                        {hasPolarization && (
                          <div className="w-full max-w-md space-y-3">
                            {polarizationEvents.map((polarizationEvent) => {
                              const polarizationIndex = filteredEvents.findIndex(e => e === polarizationEvent)
                              return (
                                <div key={polarizationEvent.titleEn} data-event-index={polarizationIndex}>
                                  <DualTrackCard
                                    event={polarizationEvent}
                                    eventIndex={polarizationIndex}
                                    isExpanded={expandedEvent === polarizationIndex}
                                    onToggle={() => setExpandedEvent(expandedEvent === polarizationIndex ? null : polarizationIndex)}
                                    onReadStory={() => handleOpenStory(polarizationIndex)}
                                    onLinkTo={handleLinkTo}
                                    side="right"
                                  />
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          )}

          {/* Story Modal */}
          {storyModalEvent !== null && filteredEvents[storyModalEvent] && (
            <StoryModal
              event={filteredEvents[storyModalEvent]}
              onClose={handleCloseStory}
              onNext={handleNextStory}
              onPrev={handlePrevStory}
              hasNext={storyModalEvent < filteredEvents.length - 1}
              hasPrev={storyModalEvent > 0}
            />
          )}
        </>
      )}
    </div>
  )
}

// ============================================================================
// 主页组件
// ============================================================================

export function HomePage() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const { progress } = useCourseProgress()
  const { isMobile, isTablet } = useIsMobile()
  const isZh = i18n.language === 'zh'

  // 展开状态管理
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null)

  // 首个未完成单元自动展开
  useEffect(() => {
    const firstIncomplete = COURSE_UNITS.find(unit => {
      const demos = unit.sections.flatMap(s => s.resources.filter(r => r.type === 'demo'))
      return demos.some(d => !progress.completedDemos.includes(d.id))
    })
    if (firstIncomplete && !expandedUnitId) {
      setExpandedUnitId(firstIncomplete.id)
    }
  }, [progress.completedDemos])

  const handleToggleUnit = useCallback((unitId: string) => {
    setExpandedUnitId(prev => prev === unitId ? null : unitId)
  }, [])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* 动态背景 */}
      <PolarizationBackground theme={theme} />

      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className={cn(
          'flex items-center justify-between px-4 py-3',
          theme === 'dark'
            ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
            : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
        )}>
          <div className="flex items-center gap-3">
            <PolarWorldLogo size={36} theme={theme} />
            <span className={cn(
              'hidden sm:block font-bold text-base',
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
            )}>
              {t('home.chronicles.title')}
            </span>
          </div>
          <LanguageThemeSwitcher />
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        {/* 课程介绍 Hero (零一学院) */}
        <CourseBannerHero theme={theme} />

        {/* 知识棱镜 - 光学全景图 */}
        <OpticalOverviewDiagram />

        {/* 偏振演示馆 - 核心入口 */}
        <DemoGalleryHero theme={theme} />

        {/* 学习工具 */}
        <QuickNavigation theme={theme} />

        {/* 历史时间线 (可折叠) */}
        <TimelineSection theme={theme} isZh={isZh} isMobile={isMobile || isTablet} />

        {/* 课程大纲 - 5个单元 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {t('home.courseOutline.title')}
            </h2>
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded-full font-medium',
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-cyan-100 text-cyan-700'
            )}>
              5 {t('home.courseOutline.units')}
            </span>
          </div>

          <div className="space-y-3">
            {COURSE_UNITS.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                theme={theme}
                isExpanded={expandedUnitId === unit.id}
                onToggle={() => handleToggleUnit(unit.id)}
                completedDemos={progress.completedDemos}
              />
            ))}
          </div>
        </div>

        {/* 页脚 */}
        <footer className={cn(
          'mt-12 text-center text-xs',
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        )}>
          <p className="opacity-60">© 2025 开放智慧实验室 Open Wisdom Lab</p>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
