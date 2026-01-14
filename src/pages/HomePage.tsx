/**
 * HomePage - 光的编年史首页
 * 首页 = 时间线为核心内容
 *
 * 架构：
 * 1. 顶部导航栏（logo + 学习模块）
 * 2. 知识棱镜（光学全景图）
 * 3. 三栏布局：课程大纲 + 广义光学时间线 + 偏振光时间线
 */

import { useState, useCallback, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'
import { PolarWorldLogo } from '@/components/icons'
import { OpticalOverviewDiagram } from '@/components/chronicles/OpticalOverviewDiagram'
import { PolarizationComparison } from '@/components/shared/PolarizationComparison'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sun,
  Sparkles,
  FlaskConical,
  Lightbulb,
  Target,
  Telescope,
  Zap,
  Eye,
  Menu,
  X,
  Calculator,
  Users,
  Palette,
  ArrowRight,
  Search,
  Beaker,
  Layers,
  Rocket,
} from 'lucide-react'

// Data imports
import { TIMELINE_EVENTS, type TimelineEvent } from '@/data/timeline-events'
import { PSRT_CURRICULUM } from '@/data/psrt-curriculum'
import {
  COURSE_TIMELINE_MAPPINGS,
  type CourseTimelineMapping,
} from '@/data/course-timeline-integration'

// ============================================================================
// Module Entry Points Data - Header版（简洁）
// ============================================================================

interface ModuleEntry {
  id: string
  titleZh: string
  titleEn: string
  icon: React.ReactNode
  link: string
  color: string
}

const MODULE_ENTRIES: ModuleEntry[] = [
  {
    id: 'optical-studio',
    titleZh: '设计室',
    titleEn: 'Studio',
    icon: <Palette className="w-4 h-4" />,
    link: '/optical-studio',
    color: '#6366F1',
  },
  {
    id: 'calc',
    titleZh: '计算工坊',
    titleEn: 'Calculators',
    icon: <Calculator className="w-4 h-4" />,
    link: '/calc',
    color: '#8B5CF6',
  },
  {
    id: 'lab',
    titleZh: '虚拟课题组',
    titleEn: 'Virtual Lab',
    icon: <Users className="w-4 h-4" />,
    link: '/lab',
    color: '#10B981',
  },
]

// ============================================================================
// Category Filter Data - 分类筛选
// ============================================================================

interface CategoryFilter {
  id: 'all' | 'discovery' | 'theory' | 'experiment' | 'application'
  labelZh: string
  labelEn: string
  icon: React.ReactNode
  color: string
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', labelZh: '全部', labelEn: 'All', icon: <Layers className="w-4 h-4" />, color: '#64748b' },
  { id: 'discovery', labelZh: '发现', labelEn: 'Discovery', icon: <Search className="w-4 h-4" />, color: '#F59E0B' },
  { id: 'theory', labelZh: '理论', labelEn: 'Theory', icon: <Lightbulb className="w-4 h-4" />, color: '#3B82F6' },
  { id: 'experiment', labelZh: '实验', labelEn: 'Experiment', icon: <Beaker className="w-4 h-4" />, color: '#10B981' },
  { id: 'application', labelZh: '应用', labelEn: 'Application', icon: <Rocket className="w-4 h-4" />, color: '#EC4899' },
]

// ============================================================================
// Course Outline Column - 课程大纲列（用于三栏布局）
// ============================================================================

interface CourseOutlineColumnProps {
  theme: 'dark' | 'light'
  isZh: boolean
  activeUnitId: string | null
  onUnitClick: (unitId: string | null, years?: number[]) => void
}

function CourseOutlineColumn({
  theme,
  isZh,
  activeUnitId,
  onUnitClick,
}: CourseOutlineColumnProps) {
  const unitColors = ['#22D3EE', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']
  const unitIcons = [
    <Lightbulb key="1" className="w-4 h-4" />,
    <Zap key="2" className="w-4 h-4" />,
    <Sparkles key="3" className="w-4 h-4" />,
    <Target key="4" className="w-4 h-4" />,
    <Telescope key="5" className="w-4 h-4" />,
  ]

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden',
      theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700'
        : 'bg-white/80 border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'p-4 border-b',
        theme === 'dark'
          ? 'bg-slate-800/80 border-slate-700'
          : 'bg-gray-50/80 border-gray-200'
      )}>
        <h2 className={cn(
          'text-sm font-bold flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <BookOpen className="w-4 h-4 text-amber-500" />
          {isZh ? '课程大纲' : 'Course Outline'}
        </h2>
        <p className={cn(
          'text-xs mt-1',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          {isZh ? '点击单元筛选时间线' : 'Click to filter timeline'}
        </p>
      </div>

      {/* Show All Button */}
      <div className="p-3 pb-0">
        <button
          onClick={() => onUnitClick(null)}
          className={cn(
            'w-full text-left p-3 rounded-xl border transition-all duration-200',
            !activeUnitId
              ? theme === 'dark'
                ? 'bg-slate-700 border-cyan-500 shadow-lg'
                : 'bg-white border-cyan-500 shadow-lg'
              : theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                : 'bg-gray-50 border-gray-200 hover:bg-white'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-cyan-500 to-blue-500"
            >
              <Layers className="w-4 h-4" />
            </div>
            <span className={cn(
              'text-sm font-medium',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '显示全部' : 'Show All'}
            </span>
          </div>
        </button>
      </div>

      {/* Units list */}
      <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
        {PSRT_CURRICULUM.map((unit, index) => {
          const mapping = COURSE_TIMELINE_MAPPINGS.find(m => m.unitNumber === unit.unitNumber)
          const color = unitColors[index % unitColors.length]
          const isActive = activeUnitId === unit.id

          return (
            <button
              key={unit.id}
              onClick={() => onUnitClick(unit.id, mapping?.relatedTimelineYears)}
              className={cn(
                'w-full text-left p-3 rounded-xl border transition-all duration-200',
                isActive
                  ? theme === 'dark'
                    ? 'bg-slate-700 shadow-lg'
                    : 'bg-white shadow-lg'
                  : theme === 'dark'
                    ? 'bg-slate-800/50 hover:bg-slate-700'
                    : 'bg-gray-50 hover:bg-white'
              )}
              style={{
                borderColor: isActive ? color : theme === 'dark' ? '#334155' : '#e5e7eb',
                boxShadow: isActive ? `0 4px 20px ${color}20` : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Unit number */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: color }}
                >
                  {unit.unitNumber}
                </div>

                {/* Unit info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span style={{ color }}>{unitIcons[index]}</span>
                    <span className={cn(
                      'text-xs font-medium',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {mapping?.historicalOriginYear}
                    </span>
                  </div>
                  <h3 className={cn(
                    'text-sm font-medium leading-tight',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? unit.titleZh : unit.titleEn}
                  </h3>
                  <p className={cn(
                    'text-xs mt-1 line-clamp-2',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {isZh ? unit.subtitleZh : unit.subtitleEn}
                  </p>
                </div>

                <ChevronRight className={cn(
                  'w-4 h-4 flex-shrink-0 transition-transform',
                  isActive ? 'rotate-90' : '',
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                )} />
              </div>

              {/* Sections preview when active */}
              {isActive && (
                <div className="mt-3 pt-3 border-t space-y-1.5"
                  style={{ borderColor: theme === 'dark' ? '#334155' : '#e5e7eb' }}
                >
                  {unit.sections.slice(0, 3).map(section => (
                    <Link
                      key={section.id}
                      to={section.relatedDemos[0] ? `/demos/${section.relatedDemos[0]}` : '#'}
                      onClick={e => e.stopPropagation()}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg text-xs transition-colors',
                        theme === 'dark'
                          ? 'hover:bg-slate-600/50 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-600'
                      )}
                    >
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {section.id}
                      </span>
                      <span className="flex-1 truncate">
                        {isZh ? section.titleZh : section.titleEn}
                      </span>
                      <FlaskConical className="w-3 h-3 opacity-50" />
                    </Link>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Timeline Event Card - 时间线事件卡片
// ============================================================================

interface TimelineEventCardProps {
  event: TimelineEvent
  theme: 'dark' | 'light'
  isZh: boolean
  isExpanded: boolean
  onToggle: () => void
  relatedUnit?: CourseTimelineMapping
}

function TimelineEventCard({
  event,
  theme,
  isZh,
  isExpanded,
  onToggle,
  relatedUnit,
}: TimelineEventCardProps) {
  const isOptics = event.track === 'optics'
  const trackColor = isOptics ? '#F59E0B' : '#22D3EE'
  const scientistName = isZh ? event.scientistZh : event.scientistEn

  // Category badge color
  const categoryColors: Record<string, string> = {
    discovery: '#F59E0B',
    theory: '#3B82F6',
    experiment: '#10B981',
    application: '#EC4899',
  }
  const categoryLabels: Record<string, { zh: string; en: string }> = {
    discovery: { zh: '发现', en: 'Discovery' },
    theory: { zh: '理论', en: 'Theory' },
    experiment: { zh: '实验', en: 'Experiment' },
    application: { zh: '应用', en: 'Application' },
  }

  return (
    <div
      data-year={event.year}
      className={cn(
        'rounded-xl border-2 overflow-hidden transition-all duration-300',
        isExpanded
          ? theme === 'dark'
            ? 'bg-slate-800 shadow-xl'
            : 'bg-white shadow-xl'
          : theme === 'dark'
            ? 'bg-slate-800/70 hover:bg-slate-800'
            : 'bg-white/90 hover:bg-white'
      )}
      style={{
        borderColor: isExpanded ? trackColor : theme === 'dark' ? '#334155' : '#e5e7eb',
        boxShadow: isExpanded ? `0 8px 32px ${trackColor}20` : undefined,
      }}
    >
      {/* Card header */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-3">
          {/* Track indicator */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${trackColor}20` }}
          >
            {isOptics
              ? <Sun className="w-5 h-5" style={{ color: trackColor }} />
              : <Sparkles className="w-5 h-5" style={{ color: trackColor }} />
            }
          </div>

          {/* Event info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn(
                'text-xs font-bold px-2 py-0.5 rounded-full',
                isOptics
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'bg-cyan-500/20 text-cyan-500'
              )}>
                {event.year}
              </span>
              {/* Category badge instead of redundant track label */}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${categoryColors[event.category]}20`,
                  color: categoryColors[event.category],
                }}
              >
                {isZh ? categoryLabels[event.category].zh : categoryLabels[event.category].en}
              </span>
            </div>
            <h3 className={cn(
              'font-bold text-sm mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? event.titleZh : event.titleEn}
            </h3>
            <p className={cn(
              'text-xs line-clamp-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? event.descriptionZh : event.descriptionEn}
            </p>
          </div>

          <ChevronDown className={cn(
            'w-4 h-4 flex-shrink-0 transition-transform',
            isExpanded ? 'rotate-180' : '',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className={cn(
          'px-4 pb-4 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
        )}>
          {/* Scientist info */}
          {scientistName && (
            <div className={cn(
              'mt-3 p-3 rounded-lg flex items-center gap-3',
              theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
            )}>
              {event.scientistBio?.portraitEmoji && (
                <span className="text-3xl">{event.scientistBio.portraitEmoji}</span>
              )}
              <div>
                <p className={cn(
                  'text-sm font-medium',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {scientistName}
                </p>
                {event.scientistBio?.bioEn && (
                  <p className={cn(
                    'text-xs line-clamp-2',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {isZh ? event.scientistBio.bioZh : event.scientistBio.bioEn}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Story */}
          {event.story && (
            <div className={cn(
              'mt-3 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50/80'
            )}>
              <p className={cn(
                'text-xs italic',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {isZh ? event.story.zh : event.story.en}
              </p>
            </div>
          )}

          {/* Thinking question */}
          {event.thinkingQuestion && (
            <div className={cn(
              'mt-3 p-3 rounded-lg border',
              theme === 'dark'
                ? 'bg-cyan-900/10 border-cyan-500/30'
                : 'bg-cyan-50 border-cyan-200'
            )}>
              <p className={cn(
                'text-xs font-medium',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
              )}>
                🤔 {isZh ? event.thinkingQuestion.zh : event.thinkingQuestion.en}
              </p>
            </div>
          )}

          {/* Related course unit */}
          {relatedUnit && (
            <Link
              to={relatedUnit.keyExperimentDemo}
              className={cn(
                'mt-3 p-3 rounded-lg border flex items-center gap-2 transition-colors',
                theme === 'dark'
                  ? 'bg-violet-900/10 border-violet-500/30 hover:bg-violet-900/20'
                  : 'bg-violet-50 border-violet-200 hover:bg-violet-100'
              )}
            >
              <BookOpen className="w-4 h-4 text-violet-500" />
              <div className="flex-1">
                <span className={cn(
                  'text-xs font-bold',
                  theme === 'dark' ? 'text-violet-400' : 'text-violet-600'
                )}>
                  {isZh ? `单元 ${relatedUnit.unitNumber}` : `Unit ${relatedUnit.unitNumber}`}
                </span>
                <span className={cn(
                  'text-xs ml-2',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? relatedUnit.unitTitleZh : relatedUnit.unitTitleEn}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-violet-500" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Year Marker - 年份标记
// ============================================================================

function YearMarker({ year, theme, hasOptics, hasPolarization }: {
  year: number
  theme: 'dark' | 'light'
  hasOptics: boolean
  hasPolarization: boolean
}) {
  return (
    <div className={cn(
      'w-16 h-16 rounded-full flex flex-col items-center justify-center font-mono font-bold border-2',
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
      <span className="text-lg">{year}</span>
    </div>
  )
}

// ============================================================================
// 主页组件
// ============================================================================

export function HomePage() {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [activeUnitId, setActiveUnitId] = useState<string | null>(null)
  const [activeYears, setActiveYears] = useState<number[] | null>(null)
  const [expandedEventKey, setExpandedEventKey] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'discovery' | 'theory' | 'experiment' | 'application'>('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const mainRef = useRef<HTMLDivElement>(null)

  // Filter events by category and unit years
  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter(e => {
      // Category filter
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      // Unit years filter
      if (activeYears && activeYears.length > 0 && !activeYears.includes(e.year)) return false
      return true
    }).sort((a, b) => a.year - b.year)
  }, [categoryFilter, activeYears])

  // Get unique years
  const years = useMemo(() => {
    return [...new Set(filteredEvents.map(e => e.year))].sort((a, b) => a - b)
  }, [filteredEvents])

  // Find related course unit for an event
  const findRelatedUnit = useCallback((event: TimelineEvent): CourseTimelineMapping | undefined => {
    return COURSE_TIMELINE_MAPPINGS.find(m =>
      m.relatedTimelineYears.includes(event.year)
    )
  }, [])

  // Handle unit click from course outline
  const handleUnitClick = useCallback((unitId: string | null, years?: number[]) => {
    setActiveUnitId(unitId)
    setActiveYears(years || null)
  }, [])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* Header with logo and learning modules */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'flex items-center justify-between px-4 py-2',
        theme === 'dark'
          ? 'bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50'
          : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50'
      )}>
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <PolarWorldLogo size={32} theme={theme} />
          <span className={cn(
            'hidden sm:block font-bold text-sm',
            theme === 'dark'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600'
          )}>
            {t('home.chronicles.title')}
          </span>
        </div>

        {/* Center: Learning modules */}
        <div className="hidden md:flex items-center gap-1">
          {MODULE_ENTRIES.map(module => (
            <Link
              key={module.id}
              to={module.link}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                theme === 'dark'
                  ? 'hover:bg-slate-800 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              )}
            >
              <span style={{ color: module.color }}>{module.icon}</span>
              <span>{isZh ? module.titleZh : module.titleEn}</span>
            </Link>
          ))}
        </div>

        {/* Right: Settings */}
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg',
              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
            )}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <LanguageThemeSwitcher />
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className={cn(
          'fixed top-14 left-0 right-0 z-40 md:hidden p-4 border-b',
          theme === 'dark'
            ? 'bg-slate-900/95 border-slate-700'
            : 'bg-white/95 border-gray-200'
        )}>
          <div className="flex flex-wrap gap-2">
            {MODULE_ENTRIES.map(module => (
              <Link
                key={module.id}
                to={module.link}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium',
                  theme === 'dark'
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                <span style={{ color: module.color }}>{module.icon}</span>
                <span>{isZh ? module.titleZh : module.titleEn}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <main ref={mainRef} className="pt-14 px-4 lg:px-8 py-6">
        {/* Hero section - 课程介绍 */}
        <div className="text-center mb-6 max-w-4xl mx-auto">
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
          <h1 className={cn(
            'text-2xl sm:text-3xl font-bold mb-4',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {t('home.courseBanner.title')}
          </h1>
          <p className={cn(
            'text-sm sm:text-base max-w-3xl mx-auto mb-6 leading-relaxed',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {t('home.courseBanner.description')}
          </p>

          {/* 偏振演示馆 入口 */}
          <Link
            to="/demos"
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all hover:scale-105',
              'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
            )}
          >
            <Eye className="w-5 h-5" />
            {isZh ? '进入偏振演示馆' : 'Enter Demo Gallery'}
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              'bg-white/20'
            )}>
              20+
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Knowledge Prism - 知识棱镜 */}
        <div className="max-w-6xl mx-auto mb-8">
          <OpticalOverviewDiagram />
        </div>

        {/* Category filters - 分类筛选 */}
        <div className={cn(
          'flex flex-wrap items-center justify-center gap-2 mb-6 p-3 rounded-xl max-w-xl mx-auto',
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
        )}>
          <span className={cn(
            'text-xs font-medium mr-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {isZh ? '分类筛选：' : 'Category:'}
          </span>
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                categoryFilter === cat.id
                  ? 'text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
              style={{
                backgroundColor: categoryFilter === cat.id ? cat.color : undefined,
              }}
            >
              {cat.icon}
              {isZh ? cat.labelZh : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Active filter indicator */}
        {activeUnitId && (
          <div className={cn(
            'flex items-center justify-center gap-2 mb-6 p-3 rounded-xl max-w-xl mx-auto',
            theme === 'dark' ? 'bg-violet-900/20 border border-violet-500/30' : 'bg-violet-50 border border-violet-200'
          )}>
            <BookOpen className="w-4 h-4 text-violet-500" />
            <span className={cn(
              'text-sm',
              theme === 'dark' ? 'text-violet-300' : 'text-violet-700'
            )}>
              {isZh ? '正在查看单元相关时间线' : 'Viewing unit-related timeline'}
            </span>
            <button
              onClick={() => handleUnitClick(null)}
              className={cn(
                'ml-2 px-2 py-0.5 rounded text-xs',
                theme === 'dark' ? 'bg-violet-500/30 text-violet-300' : 'bg-violet-200 text-violet-700'
              )}
            >
              {isZh ? '清除筛选' : 'Clear filter'}
            </button>
          </div>
        )}

        {/* Three-column layout: Course Outline | Optics Timeline | Polarization Timeline */}
        <div className="max-w-7xl mx-auto">
          {/* Desktop: Three columns */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr_1fr] gap-6">
            {/* Column 1: Course Outline */}
            <div className="sticky top-20 h-fit">
              <CourseOutlineColumn
                theme={theme}
                isZh={isZh}
                activeUnitId={activeUnitId}
                onUnitClick={handleUnitClick}
              />
            </div>

            {/* Column 2: General Optics Timeline */}
            <div className={cn(
              'rounded-2xl border overflow-hidden',
              theme === 'dark'
                ? 'bg-amber-900/10 border-amber-500/30'
                : 'bg-amber-50/50 border-amber-200'
            )}>
              <div className={cn(
                'sticky top-14 z-10 px-4 py-3 border-b backdrop-blur-sm',
                theme === 'dark'
                  ? 'bg-amber-900/30 border-amber-500/30'
                  : 'bg-amber-100/80 border-amber-200'
              )}>
                <div className="flex items-center justify-center gap-2">
                  <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                  <span className={cn('font-semibold', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                    {isZh ? '广义光学' : 'General Optics'}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {years.map(year => {
                  const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                  if (opticsEvents.length === 0) return null

                  return (
                    <div key={year}>
                      <div className={cn(
                        'text-xs font-bold px-2 py-1 rounded-full inline-block mb-2',
                        'bg-amber-500/20 text-amber-500'
                      )}>
                        {year}
                      </div>
                      <div className="space-y-3">
                        {opticsEvents.map(event => (
                          <TimelineEventCard
                            key={`${event.year}-${event.titleEn}`}
                            event={event}
                            theme={theme}
                            isZh={isZh}
                            isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                            onToggle={() => setExpandedEventKey(
                              expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                            )}
                            relatedUnit={findRelatedUnit(event)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
                {filteredEvents.filter(e => e.track === 'optics').length === 0 && (
                  <div className={cn(
                    'text-center py-8',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{isZh ? '没有匹配的事件' : 'No matching events'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Polarization Timeline */}
            <div className={cn(
              'rounded-2xl border overflow-hidden',
              theme === 'dark'
                ? 'bg-cyan-900/10 border-cyan-500/30'
                : 'bg-cyan-50/50 border-cyan-200'
            )}>
              <div className={cn(
                'sticky top-14 z-10 px-4 py-3 border-b backdrop-blur-sm',
                theme === 'dark'
                  ? 'bg-cyan-900/30 border-cyan-500/30'
                  : 'bg-cyan-100/80 border-cyan-200'
              )}>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                  <span className={cn('font-semibold', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                    {isZh ? '偏振光' : 'Polarization'}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {years.map(year => {
                  const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')
                  if (polarizationEvents.length === 0) return null

                  return (
                    <div key={year}>
                      <div className={cn(
                        'text-xs font-bold px-2 py-1 rounded-full inline-block mb-2',
                        'bg-cyan-500/20 text-cyan-500'
                      )}>
                        {year}
                      </div>
                      <div className="space-y-3">
                        {polarizationEvents.map(event => (
                          <TimelineEventCard
                            key={`${event.year}-${event.titleEn}`}
                            event={event}
                            theme={theme}
                            isZh={isZh}
                            isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                            onToggle={() => setExpandedEventKey(
                              expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                            )}
                            relatedUnit={findRelatedUnit(event)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
                {filteredEvents.filter(e => e.track === 'polarization').length === 0 && (
                  <div className={cn(
                    'text-center py-8',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{isZh ? '没有匹配的事件' : 'No matching events'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Single column with tabs */}
          <div className="lg:hidden space-y-6">
            {/* Course outline (collapsible on mobile) */}
            <CourseOutlineColumn
              theme={theme}
              isZh={isZh}
              activeUnitId={activeUnitId}
              onUnitClick={handleUnitClick}
            />

            {/* Timeline events */}
            <div className="space-y-6">
              {years.map(year => {
                const opticsEvents = filteredEvents.filter(e => e.year === year && e.track === 'optics')
                const polarizationEvents = filteredEvents.filter(e => e.year === year && e.track === 'polarization')
                const hasOptics = opticsEvents.length > 0
                const hasPolarization = polarizationEvents.length > 0

                if (!hasOptics && !hasPolarization) return null

                return (
                  <div key={year}>
                    {/* Year badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <YearMarker
                        year={year}
                        theme={theme}
                        hasOptics={hasOptics}
                        hasPolarization={hasPolarization}
                      />
                      <div className={cn(
                        'flex-1 h-0.5',
                        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                      )} />
                    </div>

                    {/* All events for this year */}
                    <div className="space-y-3 pl-4">
                      {[...opticsEvents, ...polarizationEvents].map(event => (
                        <TimelineEventCard
                          key={`${event.year}-${event.titleEn}`}
                          event={event}
                          theme={theme}
                          isZh={isZh}
                          isExpanded={expandedEventKey === `${event.year}-${event.titleEn}`}
                          onToggle={() => setExpandedEventKey(
                            expandedEventKey === `${event.year}-${event.titleEn}` ? null : `${event.year}-${event.titleEn}`
                          )}
                          relatedUnit={findRelatedUnit(event)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Polarization Comparison Demo - 偏振演示 */}
        <div className="mt-12 max-w-7xl mx-auto">
          <PolarizationComparison />
        </div>

        {/* Footer */}
        <footer className={cn(
          'mt-12 text-center text-xs',
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        )}>
          <p className="opacity-60">
            {isZh ? '© 2025 开放智慧实验室' : '© 2025 Open Wisdom Lab'}
          </p>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
