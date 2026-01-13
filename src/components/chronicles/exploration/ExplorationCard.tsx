/**
 * ExplorationCard - 探索卡片组件
 *
 * 渐进式呈现的核心组件，根据节点类型显示不同样式
 * 支持：惊奇时刻、故事、概念、实验、问题、连接
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
  Lightbulb,
  FlaskConical,
  HelpCircle,
  Link2,
  Play,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExplorationNode, NodeType } from '@/data/exploration-paths'

interface ExplorationCardProps {
  node: ExplorationNode
  theme: 'dark' | 'light'
  isExpanded?: boolean
  onToggle?: () => void
  onNavigateNext?: (nodeId: string) => void
  showNextPrompt?: boolean
  className?: string
}

// 节点类型配置
const NODE_TYPE_CONFIG: Record<NodeType, {
  icon: React.ReactNode
  colorClass: { dark: string; light: string }
  labelEn: string
  labelZh: string
}> = {
  wonder: {
    icon: <Sparkles className="w-4 h-4" />,
    colorClass: { dark: 'text-amber-400 bg-amber-500/20', light: 'text-amber-600 bg-amber-100' },
    labelEn: 'Wonder Moment',
    labelZh: '惊奇时刻'
  },
  story: {
    icon: <BookOpen className="w-4 h-4" />,
    colorClass: { dark: 'text-purple-400 bg-purple-500/20', light: 'text-purple-600 bg-purple-100' },
    labelEn: 'Story',
    labelZh: '故事'
  },
  concept: {
    icon: <Lightbulb className="w-4 h-4" />,
    colorClass: { dark: 'text-cyan-400 bg-cyan-500/20', light: 'text-cyan-600 bg-cyan-100' },
    labelEn: 'Concept',
    labelZh: '概念'
  },
  experiment: {
    icon: <FlaskConical className="w-4 h-4" />,
    colorClass: { dark: 'text-green-400 bg-green-500/20', light: 'text-green-600 bg-green-100' },
    labelEn: 'Try It',
    labelZh: '动手试试'
  },
  question: {
    icon: <HelpCircle className="w-4 h-4" />,
    colorClass: { dark: 'text-rose-400 bg-rose-500/20', light: 'text-rose-600 bg-rose-100' },
    labelEn: 'Question',
    labelZh: '问题'
  },
  demo: {
    icon: <Play className="w-4 h-4" />,
    colorClass: { dark: 'text-blue-400 bg-blue-500/20', light: 'text-blue-600 bg-blue-100' },
    labelEn: 'Demo',
    labelZh: '演示'
  },
  connection: {
    icon: <Link2 className="w-4 h-4" />,
    colorClass: { dark: 'text-indigo-400 bg-indigo-500/20', light: 'text-indigo-600 bg-indigo-100' },
    labelEn: 'Connection',
    labelZh: '连接'
  }
}

export function ExplorationCard({
  node,
  theme,
  isExpanded = false,
  onToggle,
  onNavigateNext,
  showNextPrompt = true,
  className
}: ExplorationCardProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [showFullContent, setShowFullContent] = useState(false)

  const config = NODE_TYPE_CONFIG[node.type]
  const title = isZh ? node.titleZh : node.titleEn
  const content = isZh ? node.contentZh : node.contentEn
  const prompt = isZh ? node.promptZh : node.promptEn
  const scientist = node.scientist ? (isZh ? node.scientist.zh : node.scientist.en) : null

  // 将内容分段
  const paragraphs = content.split('\n\n').filter(p => p.trim())
  const previewParagraphs = paragraphs.slice(0, 2)
  const hasMoreContent = paragraphs.length > 2

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border overflow-hidden transition-all duration-300',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
          : 'bg-white border-gray-200 hover:border-gray-300',
        isExpanded && theme === 'dark' && 'ring-1 ring-slate-600',
        isExpanded && theme !== 'dark' && 'ring-1 ring-gray-300',
        className
      )}
    >
      {/* 卡片头部 - 始终可见 */}
      <div
        className={cn(
          'p-4 sm:p-5 cursor-pointer',
          onToggle && 'hover:bg-slate-700/20'
        )}
        onClick={onToggle}
      >
        {/* 类型标签和元信息 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
            config.colorClass[theme]
          )}>
            {config.icon}
            {isZh ? config.labelZh : config.labelEn}
          </span>

          {node.year && (
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
              theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            )}>
              <Calendar className="w-3 h-3" />
              {node.year}
            </span>
          )}

          {scientist && (
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
              theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            )}>
              <User className="w-3 h-3" />
              {scientist}
            </span>
          )}

          {onToggle && (
            <span className="ml-auto">
              {isExpanded ? (
                <ChevronDown className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
              ) : (
                <ChevronRight className={cn('w-5 h-5', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
              )}
            </span>
          )}
        </div>

        {/* 标题 */}
        <div className="flex items-start gap-3">
          {node.emoji && (
            <span className="text-2xl sm:text-3xl flex-shrink-0">{node.emoji}</span>
          )}
          <h3 className={cn(
            'text-lg sm:text-xl font-bold',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h3>
        </div>
      </div>

      {/* 展开内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'px-4 sm:px-5 pb-5 border-t',
              theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
            )}>
              {/* 内容段落 */}
              <div className="mt-4 space-y-4">
                {(showFullContent ? paragraphs : previewParagraphs).map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={cn(
                      'text-sm sm:text-base leading-relaxed whitespace-pre-line',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}
                  >
                    {paragraph}
                  </p>
                ))}

                {/* 显示更多按钮 */}
                {hasMoreContent && !showFullContent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowFullContent(true)
                    }}
                    className={cn(
                      'text-sm font-medium flex items-center gap-1 transition-colors',
                      theme === 'dark'
                        ? 'text-cyan-400 hover:text-cyan-300'
                        : 'text-cyan-600 hover:text-cyan-700'
                    )}
                  >
                    {isZh ? '阅读更多' : 'Read more'}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 演示链接 */}
              {node.demoRoute && (
                <Link
                  to={node.demoRoute}
                  className={cn(
                    'mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    theme === 'dark'
                      ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                      : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Play className="w-4 h-4" />
                  {isZh ? '打开交互演示' : 'Open Interactive Demo'}
                </Link>
              )}

              {/* 探索提示 */}
              {showNextPrompt && prompt && (
                <div className={cn(
                  'mt-5 p-4 rounded-xl',
                  theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
                )}>
                  <p className={cn(
                    'text-sm italic',
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                  )}>
                    {prompt}
                  </p>
                </div>
              )}

              {/* 继续探索按钮 */}
              {node.nextNodes && node.nextNodes.length > 0 && onNavigateNext && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {node.nextNodes.length === 1 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onNavigateNext(node.nextNodes![0])
                      }}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-white hover:from-cyan-500/40 hover:to-purple-500/40'
                          : 'bg-gradient-to-r from-cyan-100 to-purple-100 text-gray-900 hover:from-cyan-200 hover:to-purple-200'
                      )}
                    >
                      {isZh ? '继续探索' : 'Continue Exploring'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <span className={cn(
                        'text-sm mr-2 self-center',
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        {isZh ? '接下来探索：' : 'Explore next:'}
                      </span>
                      {node.nextNodes.map((nextId) => (
                        <button
                          key={nextId}
                          onClick={(e) => {
                            e.stopPropagation()
                            onNavigateNext(nextId)
                          }}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                            theme === 'dark'
                              ? 'bg-slate-600 text-gray-200 hover:bg-slate-500'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          )}
                        >
                          {nextId.split('-').slice(-1)[0]}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ExplorationCard
