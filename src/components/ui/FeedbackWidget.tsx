import * as React from 'react'
import { useState, useCallback, useMemo } from 'react'
import { MessageSquarePlus, X, Bug, Lightbulb, HelpCircle, FileText, Github, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from './button'

// GitHub 仓库配置
const GITHUB_REPO = 'openwisdomlab/polarisationcourse'

// 反馈类型
type FeedbackType = 'bug' | 'feature' | 'content' | 'other'

interface FeedbackTypeOption {
  value: FeedbackType
  labelKey: string
  icon: React.ReactNode
  githubLabel: string
  isDiscussion: boolean // true = Discussion, false = Issue
}

const FEEDBACK_TYPES: FeedbackTypeOption[] = [
  {
    value: 'bug',
    labelKey: 'feedback.types.bug',
    icon: <Bug className="w-4 h-4" />,
    githubLabel: 'bug',
    isDiscussion: false
  },
  {
    value: 'feature',
    labelKey: 'feedback.types.feature',
    icon: <Lightbulb className="w-4 h-4" />,
    githubLabel: 'enhancement',
    isDiscussion: true
  },
  {
    value: 'content',
    labelKey: 'feedback.types.content',
    icon: <FileText className="w-4 h-4" />,
    githubLabel: 'documentation',
    isDiscussion: false
  },
  {
    value: 'other',
    labelKey: 'feedback.types.other',
    icon: <HelpCircle className="w-4 h-4" />,
    githubLabel: 'question',
    isDiscussion: true
  },
]

// 无价值反馈检测模式（中英文）
const LOW_VALUE_PATTERNS = [
  // 中文
  /^(好|很好|不错|棒|好棒|非常好|太棒了|厉害|牛|666|赞|点赞|支持|加油|辛苦了|谢谢|感谢|哈哈|嘻嘻|呵呵|嗯|哦|ok|OK|好的|可以|行|没问题)[!！。.~～]*$/i,
  // 英文
  /^(good|great|nice|awesome|cool|amazing|excellent|wonderful|perfect|thanks|thank you|thx|lol|haha|yes|no|ok|okay)[!.~]*$/i,
  // 太短
  /^.{0,5}$/,
  // 纯符号或表情
  /^[!！?？.。,，~～\s👍👎❤️🎉🔥💯😀😃😄😁😆🥹😅😂🤣🥲☺️😊😇🙂🙃😉😌]*$/,
]

// 检查反馈是否有价值
function isValueableFeedback(content: string): boolean {
  const trimmed = content.trim()

  // 检查是否匹配无价值模式
  for (const pattern of LOW_VALUE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return false
    }
  }

  // 至少需要 10 个字符才算有价值
  if (trimmed.length < 10) {
    return false
  }

  return true
}

// 生成 GitHub Issue URL
function generateGitHubIssueUrl(
  type: FeedbackType,
  title: string,
  content: string,
  currentPage: string
): string {
  const typeOption = FEEDBACK_TYPES.find(t => t.value === type)
  const label = typeOption?.githubLabel || 'feedback'

  const body = `## 反馈内容 / Feedback Content

${content}

---
**页面 / Page**: ${currentPage}
**时间 / Time**: ${new Date().toISOString()}
**来源 / Source**: Feedback Widget`

  const params = new URLSearchParams({
    title: title || `[${label}] 用户反馈`,
    body,
    labels: label,
  })

  return `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`
}

// 生成 GitHub Discussion URL
function generateGitHubDiscussionUrl(
  type: FeedbackType,
  title: string,
  content: string,
  currentPage: string
): string {
  const typeOption = FEEDBACK_TYPES.find(t => t.value === type)

  // Discussion category based on type
  const category = type === 'feature' ? 'ideas' : 'q-a'

  const body = `## 反馈内容 / Feedback Content

${content}

---
**页面 / Page**: ${currentPage}
**时间 / Time**: ${new Date().toISOString()}
**来源 / Source**: Feedback Widget`

  const params = new URLSearchParams({
    title: title || `用户反馈 - ${typeOption?.labelKey || type}`,
    body,
    category,
  })

  return `https://github.com/${GITHUB_REPO}/discussions/new?${params.toString()}`
}

export function FeedbackWidget() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentPage = typeof window !== 'undefined' ? window.location.href : ''

  const selectedTypeOption = useMemo(
    () => FEEDBACK_TYPES.find(t => t.value === feedbackType),
    [feedbackType]
  )

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
    setError(null)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setError(null)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 验证内容
    if (!content.trim()) {
      setError(t('feedback.errors.empty'))
      return
    }

    if (!isValueableFeedback(content)) {
      setError(t('feedback.errors.lowValue'))
      return
    }

    setIsSubmitting(true)

    // 生成 GitHub URL
    const url = selectedTypeOption?.isDiscussion
      ? generateGitHubDiscussionUrl(feedbackType, title, content, currentPage)
      : generateGitHubIssueUrl(feedbackType, title, content, currentPage)

    // 打开 GitHub 页面
    window.open(url, '_blank', 'noopener,noreferrer')

    // 重置表单
    setTimeout(() => {
      setIsSubmitting(false)
      setTitle('')
      setContent('')
      setIsOpen(false)
    }, 500)
  }, [content, title, feedbackType, selectedTypeOption, currentPage, t])

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={handleToggle}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-14 h-14 rounded-full',
          'bg-gradient-to-br from-cyan-500 to-purple-600',
          'text-white shadow-lg',
          'flex items-center justify-center',
          'transition-all duration-300 ease-out',
          'hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/25',
          'active:scale-95',
          isOpen && 'rotate-45 bg-gradient-to-br from-red-500 to-orange-600'
        )}
        aria-label={t('feedback.button')}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquarePlus className="w-6 h-6" />
        )}
      </button>

      {/* 反馈表单面板 */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50',
          'w-[360px] max-w-[calc(100vw-48px)]',
          'bg-slate-900/95 backdrop-blur-xl',
          'border border-slate-700/50',
          'rounded-2xl shadow-2xl shadow-black/50',
          'transition-all duration-300 ease-out',
          'origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">
              {t('feedback.title')}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* 反馈类型选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              {t('feedback.typeLabel')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FEEDBACK_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFeedbackType(type.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    'text-sm font-medium transition-all',
                    'border',
                    feedbackType === type.value
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  )}
                >
                  {type.icon}
                  <span>{t(type.labelKey)}</span>
                </button>
              ))}
            </div>
            {/* 类型说明 */}
            <p className="text-xs text-slate-500 flex items-center gap-1">
              {selectedTypeOption?.isDiscussion ? (
                <>
                  <span>→</span>
                  <span>{t('feedback.goesToDiscussion')}</span>
                </>
              ) : (
                <>
                  <span>→</span>
                  <span>{t('feedback.goesToIssue')}</span>
                </>
              )}
            </p>
          </div>

          {/* 标题输入 */}
          <div className="space-y-2">
            <label htmlFor="feedback-title" className="text-sm font-medium text-slate-300">
              {t('feedback.titleLabel')}
              <span className="text-slate-500 ml-1">({t('feedback.optional')})</span>
            </label>
            <input
              id="feedback-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('feedback.titlePlaceholder')}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg',
                'bg-slate-800/50 border border-slate-700/50',
                'text-white placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
                'transition-all'
              )}
            />
          </div>

          {/* 内容输入 */}
          <div className="space-y-2">
            <label htmlFor="feedback-content" className="text-sm font-medium text-slate-300">
              {t('feedback.contentLabel')}
              <span className="text-red-400 ml-1">*</span>
            </label>
            <textarea
              id="feedback-content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                setError(null)
              }}
              placeholder={t('feedback.contentPlaceholder')}
              rows={4}
              className={cn(
                'w-full px-4 py-3 rounded-lg resize-none',
                'bg-slate-800/50 border border-slate-700/50',
                'text-white placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
                'transition-all',
                error && 'border-red-500/50 focus:ring-red-500/50'
              )}
            />
            {/* 字符计数 */}
            <div className="flex justify-between items-center">
              <span className={cn(
                'text-xs',
                content.length < 10 ? 'text-slate-500' : 'text-green-500'
              )}>
                {content.length} {t('feedback.characters')}
              </span>
              {content.length >= 10 && (
                <span className="text-xs text-green-500">✓ {t('feedback.validLength')}</span>
              )}
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={cn(
              'w-full py-3 rounded-lg font-medium',
              'bg-gradient-to-r from-cyan-500 to-purple-600',
              'hover:from-cyan-400 hover:to-purple-500',
              'text-white shadow-lg',
              'flex items-center justify-center gap-2',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('feedback.submitting')}</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>{t('feedback.submit')}</span>
              </>
            )}
          </Button>

          {/* 说明文字 */}
          <p className="text-xs text-center text-slate-500">
            {t('feedback.note')}
          </p>
        </form>
      </div>

      {/* 背景遮罩（移动端） */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={handleClose}
        />
      )}
    </>
  )
}

export default FeedbackWidget
