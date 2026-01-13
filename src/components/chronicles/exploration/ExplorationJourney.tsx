/**
 * ExplorationJourney - 沉浸式探索旅程
 *
 * 渐进式呈现探索节点，追踪用户进度
 * 参考 Google Learn About 的对话式探索体验
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  RotateCcw,
  Map,
  Check,
  Circle,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExplorationCard } from './ExplorationCard'
import type { ExplorationPath, ExplorationNode } from '@/data/exploration-paths'

interface ExplorationJourneyProps {
  path: ExplorationPath
  theme: 'dark' | 'light'
  onBack: () => void
  className?: string
}

interface VisitedNode {
  nodeId: string
  timestamp: number
}

export function ExplorationJourney({
  path,
  theme,
  onBack,
  className
}: ExplorationJourneyProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // 访问过的节点和当前活跃节点
  const [visitedNodes, setVisitedNodes] = useState<VisitedNode[]>([])
  const [activeNodeId, setActiveNodeId] = useState<string>(path.entryNodeId)
  const [showPathMap, setShowPathMap] = useState(false)

  // 初始化：添加入口节点
  useEffect(() => {
    setVisitedNodes([{ nodeId: path.entryNodeId, timestamp: Date.now() }])
    setActiveNodeId(path.entryNodeId)
  }, [path.entryNodeId])

  // 已访问的节点ID集合
  const visitedNodeIds = useMemo(() => {
    return new Set(visitedNodes.map(v => v.nodeId))
  }, [visitedNodes])

  // 获取节点
  const getNode = useCallback((nodeId: string): ExplorationNode | undefined => {
    return path.nodes.find(n => n.id === nodeId)
  }, [path.nodes])

  // 当前活跃节点
  const activeNode = useMemo(() => {
    return getNode(activeNodeId)
  }, [activeNodeId, getNode])

  // 导航到下一个节点
  const handleNavigateNext = useCallback((nextNodeId: string) => {
    if (!visitedNodeIds.has(nextNodeId)) {
      setVisitedNodes(prev => [...prev, { nodeId: nextNodeId, timestamp: Date.now() }])
    }
    setActiveNodeId(nextNodeId)

    // 滚动到顶部
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }, [visitedNodeIds])

  // 重新开始
  const handleRestart = useCallback(() => {
    setVisitedNodes([{ nodeId: path.entryNodeId, timestamp: Date.now() }])
    setActiveNodeId(path.entryNodeId)
  }, [path.entryNodeId])

  // 跳转到已访问的节点
  const handleJumpToNode = useCallback((nodeId: string) => {
    setActiveNodeId(nodeId)
    setShowPathMap(false)
  }, [])

  // 计算进度
  const progress = useMemo(() => {
    return Math.round((visitedNodes.length / path.nodes.length) * 100)
  }, [visitedNodes.length, path.nodes.length])

  // 是否探索完成
  const isComplete = useMemo(() => {
    return visitedNodes.length >= path.nodes.length
  }, [visitedNodes.length, path.nodes.length])

  if (!activeNode) {
    return null
  }

  return (
    <div className={cn('min-h-screen', className)}>
      {/* 顶部导航栏 */}
      <div className={cn(
        'sticky top-0 z-30 backdrop-blur-md border-b',
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-700'
          : 'bg-white/90 border-gray-200'
      )}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 返回按钮 */}
            <button
              onClick={onBack}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              {isZh ? '返回' : 'Back'}
            </button>

            {/* 路径标题 */}
            <div className="flex items-center gap-2">
              <span className="text-xl">{path.emoji}</span>
              <span className={cn(
                'text-sm font-medium hidden sm:block',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? path.questionZh : path.questionEn}
              </span>
            </div>

            {/* 工具按钮 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPathMap(!showPathMap)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showPathMap
                    ? theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
                title={isZh ? '探索地图' : 'Exploration Map'}
              >
                <Map className="w-4 h-4" />
              </button>
              <button
                onClick={handleRestart}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
                title={isZh ? '重新开始' : 'Restart'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {isZh ? '探索进度' : 'Progress'}
              </span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {visitedNodes.length}/{path.nodes.length} {isZh ? '已探索' : 'explored'}
              </span>
            </div>
            <div className={cn(
              'h-1.5 rounded-full overflow-hidden',
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            )}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: path.color }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 探索地图 (可折叠) */}
      <AnimatePresence>
        {showPathMap && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'border-b',
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
            )}>
              <div className="max-w-3xl mx-auto px-4 py-4">
                <h4 className={cn(
                  'text-sm font-medium mb-3',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '探索地图' : 'Exploration Map'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {path.nodes.map((node, idx) => {
                    const isVisited = visitedNodeIds.has(node.id)
                    const isActive = node.id === activeNodeId

                    return (
                      <button
                        key={node.id}
                        onClick={() => isVisited && handleJumpToNode(node.id)}
                        disabled={!isVisited}
                        className={cn(
                          'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all',
                          isActive && (theme === 'dark' ? 'bg-cyan-500/30 text-cyan-300 ring-1 ring-cyan-500' : 'bg-cyan-100 text-cyan-800 ring-1 ring-cyan-400'),
                          !isActive && isVisited && (theme === 'dark' ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'),
                          !isVisited && (theme === 'dark' ? 'bg-slate-800 text-gray-600' : 'bg-gray-100 text-gray-400'),
                          isVisited && 'cursor-pointer',
                          !isVisited && 'cursor-not-allowed'
                        )}
                      >
                        {isVisited ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Circle className="w-3 h-3" />
                        )}
                        {idx + 1}. {node.emoji}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区 */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* 完成提示 */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mb-6 p-4 rounded-2xl text-center',
              theme === 'dark'
                ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30'
                : 'bg-gradient-to-r from-green-100 to-cyan-100 border border-green-300'
            )}
          >
            <span className="text-2xl mb-2 block">🎉</span>
            <h3 className={cn(
              'text-lg font-bold mb-1',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '探索完成！' : 'Exploration Complete!'}
            </h3>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            )}>
              {isZh
                ? `你已经探索了"${path.questionZh}"的全部内容`
                : `You've explored all of "${path.questionEn}"`}
            </p>
          </motion.div>
        )}

        {/* 当前节点卡片 */}
        <AnimatePresence mode="wait">
          <ExplorationCard
            key={activeNode.id}
            node={activeNode}
            theme={theme}
            isExpanded={true}
            showNextPrompt={true}
            onNavigateNext={handleNavigateNext}
          />
        </AnimatePresence>

        {/* 探索历史面包屑 */}
        {visitedNodes.length > 1 && (
          <div className={cn(
            'mt-6 p-4 rounded-xl',
            theme === 'dark' ? 'bg-slate-800/30' : 'bg-gray-50'
          )}>
            <h4 className={cn(
              'text-xs font-medium mb-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '你的探索路径' : 'Your exploration path'}
            </h4>
            <div className="flex items-center gap-1 flex-wrap">
              {visitedNodes.map((visited, idx) => {
                const node = getNode(visited.nodeId)
                if (!node) return null
                const isActive = visited.nodeId === activeNodeId

                return (
                  <div key={visited.nodeId} className="flex items-center">
                    <button
                      onClick={() => handleJumpToNode(visited.nodeId)}
                      className={cn(
                        'px-2 py-1 rounded text-xs transition-colors',
                        isActive
                          ? theme === 'dark' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                          : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {node.emoji} {isZh ? node.titleZh.slice(0, 8) : node.titleEn.slice(0, 15)}...
                    </button>
                    {idx < visitedNodes.length - 1 && (
                      <ChevronRight className={cn(
                        'w-3 h-3 mx-1',
                        theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 相关探索路径建议 (探索完成后显示) */}
        {isComplete && (
          <div className={cn(
            'mt-6 p-4 rounded-xl',
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
          )}>
            <h4 className={cn(
              'text-sm font-medium mb-3',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '继续探索其他问题' : 'Explore other questions'}
            </h4>
            <button
              onClick={onBack}
              className={cn(
                'w-full py-3 rounded-xl text-sm font-medium transition-all',
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-white hover:from-cyan-500/40 hover:to-purple-500/40'
                  : 'bg-gradient-to-r from-cyan-100 to-purple-100 text-gray-900 hover:from-cyan-200 hover:to-purple-200'
              )}
            >
              {isZh ? '返回选择新问题' : 'Back to choose a new question'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExplorationJourney
