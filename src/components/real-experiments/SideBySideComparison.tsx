/**
 * Side-by-Side Comparison Component (双栏对比组件)
 *
 * 将真实实验照片/视频与模拟器并排显示，实现参数同步
 * - 左侧：真实照片/视频
 * - 右侧：模拟器（SVG/Canvas/自定义组件）
 * - 中间：可拖动的分割线
 * - 参数同步：调整参数自动切换到对应的真实资源
 * - 相似度指示器：量化模拟与真实的匹配程度
 */

import { useState, useRef, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GripVertical,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Activity,
  Maximize2,
  Check,
} from 'lucide-react'
import type { PolarizationResource } from '@/data/resource-gallery'

interface ComparisonParams {
  [key: string]: number | string
}

interface SideBySideComparisonProps {
  /** 真实资源（可以是单个或数组） */
  realResource: PolarizationResource | PolarizationResource[]
  /** 右侧模拟器组件 */
  simulatorComponent: ReactNode
  /** 当前模拟器参数 */
  simulatorParams: ComparisonParams
  /** 参数变化回调 */
  onParamsChange?: (params: ComparisonParams) => void
  /** 自动匹配真实资源的函数（根据参数选择最接近的真实资源） */
  autoMatchResource?: (params: ComparisonParams) => PolarizationResource | null
  /** 计算相似度的函数（返回0-100） */
  calculateSimilarity?: (params: ComparisonParams, resource: PolarizationResource) => number
  /** 标题 */
  title?: string
  titleZh?: string
}

export function SideBySideComparison({
  realResource,
  simulatorComponent,
  simulatorParams,
  onParamsChange, // Reserved for future use: callback when user changes params
  autoMatchResource,
  calculateSimilarity,
  title,
  titleZh,
}: SideBySideComparisonProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Prevent unused variable warnings (these are reserved for future features)
  void onParamsChange

  // 状态
  const [splitPosition, setSplitPosition] = useState(50) // 分割线位置 (0-100)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedResource, setSelectedResource] = useState<PolarizationResource | null>(
    Array.isArray(realResource) ? realResource[0] : realResource
  )
  const [similarity, setSimilarity] = useState<number>(0)
  const [showInfo, setShowInfo] = useState(true)
  const [zoom, setZoom] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)

  // 处理分割线拖动
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSplitPosition(Math.max(10, Math.min(90, percentage)))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  // 自动匹配资源
  useEffect(() => {
    if (autoMatchResource && Array.isArray(realResource)) {
      const matched = autoMatchResource(simulatorParams)
      if (matched) {
        setSelectedResource(matched)
      }
    }
  }, [simulatorParams, autoMatchResource, realResource])

  // 计算相似度
  useEffect(() => {
    if (calculateSimilarity && selectedResource) {
      const sim = calculateSimilarity(simulatorParams, selectedResource)
      setSimilarity(sim)
    }
  }, [simulatorParams, selectedResource, calculateSimilarity])

  // 重置分割线
  const resetSplit = () => {
    setSplitPosition(50)
  }

  // 缩放控制
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleZoomReset = () => {
    setZoom(1)
  }

  // 获取相似度颜色
  const getSimilarityColor = (sim: number) => {
    if (sim >= 90) return 'text-green-400'
    if (sim >= 75) return 'text-cyan-400'
    if (sim >= 50) return 'text-yellow-400'
    return 'text-orange-400'
  }

  // 获取相似度等级
  const getSimilarityLevel = (sim: number) => {
    if (sim >= 90) return { en: 'Excellent Match', zh: '极佳匹配' }
    if (sim >= 75) return { en: 'Good Match', zh: '良好匹配' }
    if (sim >= 50) return { en: 'Fair Match', zh: '一般匹配' }
    return { en: 'Poor Match', zh: '匹配较差' }
  }

  const currentResource = selectedResource || (Array.isArray(realResource) ? realResource[0] : realResource)

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isZh ? (titleZh || title || '真实与模拟对比') : (title || 'Real vs Simulation Comparison')}
              </h3>
              <p className="text-xs text-slate-400">
                {isZh ? '拖动中间分割线查看对比' : 'Drag the divider to compare'}
              </p>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center gap-2">
            {/* 相似度指示器 */}
            {calculateSimilarity && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700">
                <Activity className={`w-4 h-4 ${getSimilarityColor(similarity)}`} />
                <span className={`text-sm font-bold ${getSimilarityColor(similarity)}`}>
                  {similarity.toFixed(0)}%
                </span>
                <span className="text-xs text-slate-400">
                  {isZh ? getSimilarityLevel(similarity).zh : getSimilarityLevel(similarity).en}
                </span>
              </div>
            )}

            {/* 信息切换 */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg transition-colors ${
                showInfo ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Info className="w-4 h-4" />
            </button>

            {/* 缩放控制 */}
            <div className="flex items-center gap-1 bg-slate-900 rounded-lg border border-slate-700 p-1">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomReset}
                className="px-2 py-1 hover:bg-slate-800 rounded transition-colors text-xs text-slate-400 hover:text-white"
              >
                {(zoom * 100).toFixed(0)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* 重置分割线 */}
            <button
              onClick={resetSplit}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 信息面板 */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-700 bg-slate-800/30"
          >
            <div className="p-4 grid grid-cols-2 gap-4">
              {/* 左侧：真实资源信息 */}
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                  {isZh ? '真实实验' : 'Real Experiment'}
                </h4>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isZh ? '资源' : 'Resource'}:</span>
                    <span className="font-medium">{isZh ? currentResource.titleZh : currentResource.title}</span>
                  </div>
                  {currentResource.metadata.material && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isZh ? '材质' : 'Material'}:</span>
                      <span>{currentResource.metadata.material}</span>
                    </div>
                  )}
                  {currentResource.metadata.polarizationSystem && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isZh ? '偏振系统' : 'Polarization'}:</span>
                      <span>{currentResource.metadata.polarizationSystem}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 右侧：模拟器参数 */}
              <div>
                <h4 className="text-sm font-semibold text-purple-400 mb-2">
                  {isZh ? '模拟器参数' : 'Simulator Parameters'}
                </h4>
                <div className="space-y-1 text-xs text-slate-300">
                  {Object.entries(simulatorParams).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400">{key}:</span>
                      <span className="font-medium font-mono">
                        {typeof value === 'number' ? value.toFixed(1) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主对比区域 */}
      <div
        ref={containerRef}
        className="relative h-[600px] bg-black overflow-hidden"
        style={{ cursor: isDragging ? 'ew-resize' : 'default' }}
      >
        {/* 左侧：真实照片/视频 */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${splitPosition}%` }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            {currentResource.type === 'video' ? (
              <video
                src={currentResource.url}
                controls
                className="max-w-full max-h-full"
                style={{ transform: `scale(${zoom})` }}
              />
            ) : (
              <img
                src={currentResource.url}
                alt={isZh ? currentResource.titleZh : currentResource.title}
                className="max-w-full max-h-full object-contain"
                style={{ transform: `scale(${zoom})` }}
              />
            )}
          </div>

          {/* 左侧标签 */}
          <div className="absolute top-4 left-4 bg-cyan-500/90 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
            {isZh ? '真实实验' : 'Real Experiment'}
          </div>
        </div>

        {/* 右侧：模拟器 */}
        <div
          className="absolute inset-y-0 right-0 overflow-hidden"
          style={{ width: `${100 - splitPosition}%` }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
              {simulatorComponent}
            </div>
          </div>

          {/* 右侧标签 */}
          <div className="absolute top-4 right-4 bg-purple-500/90 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
            {isZh ? '模拟器' : 'Simulator'}
          </div>
        </div>

        {/* 分割线 */}
        <div
          className="absolute inset-y-0 z-10"
          style={{ left: `${splitPosition}%` }}
        >
          {/* 可拖动手柄 */}
          <div
            onMouseDown={handleMouseDown}
            className={`absolute inset-y-0 -left-1 w-2 cursor-ew-resize transition-colors ${
              isDragging ? 'bg-cyan-500' : 'bg-white/30 hover:bg-cyan-400/50'
            }`}
          />

          {/* 中心抓手图标 */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-full p-2 shadow-lg cursor-ew-resize transition-all ${
              isDragging ? 'scale-110 bg-cyan-500' : 'hover:scale-105'
            }`}
            onMouseDown={handleMouseDown}
          >
            <GripVertical className={`w-5 h-5 ${isDragging ? 'text-white' : 'text-slate-700'}`} />
          </div>
        </div>

        {/* 匹配提示（高相似度时） */}
        {calculateSimilarity && similarity >= 90 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="font-semibold">
                {isZh ? '极佳匹配！' : 'Excellent Match!'}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Maximize2 className="w-4 h-4" />
          <span>
            {isZh
              ? '💡 提示：拖动中间的分割线左右移动，对比真实实验与模拟结果的差异。调整模拟器参数以获得更高的匹配度！'
              : '💡 Tip: Drag the center divider to compare real vs simulation. Adjust simulator parameters for higher similarity!'}
          </span>
        </div>
      </div>
    </div>
  )
}
