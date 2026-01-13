/**
 * PathEntryCard - 探索路径入口卡片
 *
 * 显示一个好奇心问题，引导用户开始探索旅程
 */

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Clock, Sparkles, ArrowRight, BookOpen, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExplorationPath } from '@/data/exploration-paths'

interface PathEntryCardProps {
  path: ExplorationPath
  theme: 'dark' | 'light'
  onClick: () => void
  index?: number
  className?: string
}

// 难度配置
const DIFFICULTY_CONFIG = {
  beginner: { labelEn: 'Beginner', labelZh: '入门', color: 'green', icon: <Lightbulb className="w-3 h-3" /> },
  intermediate: { labelEn: 'Intermediate', labelZh: '进阶', color: 'amber', icon: <BookOpen className="w-3 h-3" /> },
  advanced: { labelEn: 'Advanced', labelZh: '深入', color: 'purple', icon: <Sparkles className="w-3 h-3" /> }
}

export function PathEntryCard({
  path,
  theme,
  onClick,
  index = 0,
  className
}: PathEntryCardProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const difficultyConfig = DIFFICULTY_CONFIG[path.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300',
        theme === 'dark'
          ? 'bg-slate-800/50 border border-slate-700 hover:border-slate-500'
          : 'bg-white border border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-lg',
        className
      )}
    >
      {/* 背景渐变光效 */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'bg-gradient-to-br'
        )}
        style={{
          backgroundImage: `linear-gradient(135deg, ${path.color}10 0%, transparent 50%, ${path.color}05 100%)`
        }}
      />

      {/* 顶部装饰条 */}
      <div
        className="h-1"
        style={{ backgroundColor: path.color }}
      />

      <div className="relative p-5 sm:p-6">
        {/* Emoji 和问题 */}
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl sm:text-5xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
            {path.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-lg sm:text-xl font-bold mb-2 leading-tight',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? path.questionZh : path.questionEn}
            </h3>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? path.subtitleZh : path.subtitleEn}
            </p>
          </div>
        </div>

        {/* 元信息 */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* 难度标签 */}
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              difficultyConfig.color === 'green' && (theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'),
              difficultyConfig.color === 'amber' && (theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'),
              difficultyConfig.color === 'purple' && (theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700')
            )}
          >
            {difficultyConfig.icon}
            {isZh ? difficultyConfig.labelZh : difficultyConfig.labelEn}
          </span>

          {/* 预计时间 */}
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
            theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
          )}>
            <Clock className="w-3 h-3" />
            {path.estimatedMinutes} {isZh ? '分钟' : 'min'}
          </span>

          {/* 节点数量 */}
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
            theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
          )}>
            {path.nodes.length} {isZh ? '个发现' : 'discoveries'}
          </span>

          {/* 开始探索按钮 */}
          <span
            className={cn(
              'ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              'opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0',
              theme === 'dark'
                ? 'bg-white/10 text-white'
                : 'bg-gray-900/10 text-gray-900'
            )}
            style={{ transitionDuration: '300ms' }}
          >
            {isZh ? '开始探索' : 'Start'}
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 悬停时的边框发光效果 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 20px ${path.color}20`
        }}
      />
    </motion.div>
  )
}

export default PathEntryCard
