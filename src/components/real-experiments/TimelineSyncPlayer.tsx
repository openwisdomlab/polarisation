/**
 * Timeline Synchronized Player (时序同步播放器)
 *
 * 统一时间轴控制，同步播放：
 * - 真实实验视频/序列
 * - 模拟器动画
 * - 物理参数曲线
 * - 视频标注（关键时间点）
 */

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  TrendingUp,
  Info,
  Maximize2,
} from 'lucide-react'
import type { PolarizationResource, VideoAnnotation } from '@/data/resource-gallery'

export interface TimelinePoint {
  time: number // 时间（秒）
  label: string
  labelZh: string
  type?: 'keyframe' | 'annotation' | 'custom'
}

export interface ParameterCurve {
  label: string
  labelZh?: string
  color: string
  unit?: string
  getValue: (time: number) => number
}

interface TimelineSyncPlayerProps {
  /** 真实资源（视频或序列） */
  realResource: PolarizationResource
  /** 模拟器组件（接收 currentTime 参数） */
  simulatorComponent: (currentTime: number) => ReactNode
  /** 总时长（秒） */
  duration: number
  /** 参数曲线（可选） */
  parameterCurves?: ParameterCurve[]
  /** 自定义时间点（可选） */
  customTimePoints?: TimelinePoint[]
  /** 标题 */
  title?: string
  titleZh?: string
  /** 初始播放速度 */
  initialPlaybackRate?: number
}

export function TimelineSyncPlayer({
  realResource,
  simulatorComponent,
  duration,
  parameterCurves = [],
  customTimePoints = [],
  title,
  titleZh,
  initialPlaybackRate = 1,
}: TimelineSyncPlayerProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // 状态
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(initialPlaybackRate)
  const [showCurves, setShowCurves] = useState(true)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [hoveredTimePoint, setHoveredTimePoint] = useState<TimelinePoint | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  // 合并所有时间点
  const allTimePoints: TimelinePoint[] = [
    // 来自序列的关键帧
    ...(realResource.frames?.map((frame) => ({
      time: frame.time,
      label: frame.label,
      labelZh: frame.labelZh,
      type: 'keyframe' as const,
    })) || []),
    // 来自视频标注
    ...(realResource.videoAnnotations?.map((anno) => ({
      time: anno.time,
      label: anno.label,
      labelZh: anno.labelZh,
      type: 'annotation' as const,
    })) || []),
    // 自定义时间点
    ...customTimePoints,
  ].sort((a, b) => a.time - b.time)

  // 播放/暂停
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // 跳转到时间点
  const seekTo = useCallback((time: number) => {
    const clampedTime = Math.max(0, Math.min(duration, time))
    setCurrentTime(clampedTime)
    if (videoRef.current) {
      videoRef.current.currentTime = clampedTime
    }
  }, [duration])

  // 重置
  const reset = useCallback(() => {
    seekTo(0)
    setIsPlaying(false)
  }, [seekTo])

  // 跳到上一个/下一个关键帧
  const skipToPrevious = useCallback(() => {
    const prev = allTimePoints
      .filter((p) => p.time < currentTime)
      .sort((a, b) => b.time - a.time)[0]
    if (prev) {
      seekTo(prev.time)
    } else {
      seekTo(0)
    }
  }, [allTimePoints, currentTime, seekTo])

  const skipToNext = useCallback(() => {
    const next = allTimePoints.find((p) => p.time > currentTime)
    if (next) {
      seekTo(next.time)
    } else {
      seekTo(duration)
    }
  }, [allTimePoints, currentTime, duration, seekTo])

  // 动画循环
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp
      }

      const deltaTime = (timestamp - lastTimeRef.current) / 1000 // 转换为秒
      lastTimeRef.current = timestamp

      setCurrentTime((prev) => {
        const newTime = prev + deltaTime * playbackRate
        if (newTime >= duration) {
          setIsPlaying(false)
          return duration
        }
        return newTime
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      lastTimeRef.current = 0
    }
  }, [isPlaying, playbackRate, duration])

  // 同步视频时间
  useEffect(() => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = currentTime
    }
  }, [currentTime, isPlaying])

  // 获取当前显示的序列帧
  const getCurrentFrame = () => {
    if (!realResource.frames) return null
    // 找到最接近当前时间的帧
    const frame = realResource.frames
      .slice()
      .sort((a, b) => Math.abs(a.time - currentTime) - Math.abs(b.time - currentTime))[0]
    return frame
  }

  // 获取当前活跃的标注
  const getCurrentAnnotation = (): VideoAnnotation | null => {
    if (!realResource.videoAnnotations) return null
    // 找到最近的标注（当前时间±2秒内）
    const annotation = realResource.videoAnnotations.find(
      (anno) => Math.abs(anno.time - currentTime) < 2
    )
    return annotation || null
  }

  const currentFrame = getCurrentFrame()
  const currentAnnotation = getCurrentAnnotation()

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isZh ? (titleZh || title || '时序同步播放') : (title || 'Timeline Synchronized Playback')}
              </h3>
              <p className="text-xs text-slate-400">
                {isZh ? '统一时间轴控制真实实验与模拟' : 'Unified timeline control'}
              </p>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCurves(!showCurves)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showCurves
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {isZh ? '参数曲线' : 'Curves'}
            </button>
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showAnnotations
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {isZh ? '标注' : 'Annotations'}
            </button>
          </div>
        </div>
      </div>

      {/* 主播放区域 */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* 左侧：真实实验 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-cyan-400">
              {isZh ? '真实实验' : 'Real Experiment'}
            </h4>
            {currentFrame && (
              <span className="text-xs text-slate-400">
                {isZh ? currentFrame.labelZh : currentFrame.label}
              </span>
            )}
          </div>
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-700">
            {realResource.type === 'video' ? (
              <video
                ref={videoRef}
                src={realResource.url}
                className="w-full h-full object-contain"
                muted
                playsInline
              />
            ) : currentFrame ? (
              <img
                src={currentFrame.url}
                alt={isZh ? currentFrame.labelZh : currentFrame.label}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                {isZh ? '无可用帧' : 'No frame available'}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：模拟器 */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-purple-400">
            {isZh ? '模拟器' : 'Simulator'}
          </h4>
          <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center">
            {simulatorComponent(currentTime)}
          </div>
        </div>
      </div>

      {/* 参数曲线 */}
      {showCurves && parameterCurves.length > 0 && (
        <div className="px-4 pb-4">
          <ParameterCurveChart
            curves={parameterCurves}
            currentTime={currentTime}
            duration={duration}
          />
        </div>
      )}

      {/* 当前标注 */}
      <AnimatePresence>
        {showAnnotations && currentAnnotation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-cyan-400">
                  {isZh ? currentAnnotation.labelZh : currentAnnotation.label}
                </h5>
                <p className="text-xs text-slate-300 mt-1">
                  {isZh ? currentAnnotation.descriptionZh : currentAnnotation.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 时间轴控制 */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/30 space-y-3">
        {/* 进度条 */}
        <div className="relative">
          {/* 时间点标记 */}
          {allTimePoints.map((point, index) => (
            <button
              key={index}
              onClick={() => seekTo(point.time)}
              onMouseEnter={() => setHoveredTimePoint(point)}
              onMouseLeave={() => setHoveredTimePoint(null)}
              className="absolute top-0 -translate-x-1/2 group"
              style={{ left: `${(point.time / duration) * 100}%` }}
            >
              <div className={`w-2 h-2 rounded-full transition-all ${
                point.type === 'keyframe'
                  ? 'bg-purple-400 group-hover:scale-150'
                  : point.type === 'annotation'
                  ? 'bg-cyan-400 group-hover:scale-150'
                  : 'bg-yellow-400 group-hover:scale-150'
              }`} />

              {/* 悬停提示 */}
              {hoveredTimePoint === point && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                  {isZh ? point.labelZh : point.label}
                </div>
              )}
            </button>
          ))}

          {/* 进度条 */}
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg relative z-10"
          />
        </div>

        {/* 时间显示 */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* 播放控制 */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={skipToPrevious}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-white shadow-lg"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={skipToNext}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* 播放速度 */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300"
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Maximize2 className="w-4 h-4" />
          <span>
            {isZh
              ? '💡 提示：点击时间轴上的标记跳转到关键时刻。调整播放速度以细致观察物理过程。'
              : '💡 Tip: Click markers on timeline to jump to key moments. Adjust playback speed for detailed observation.'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ===== 辅助组件 =====

interface ParameterCurveChartProps {
  curves: ParameterCurve[]
  currentTime: number
  duration: number
}

function ParameterCurveChart({ curves, currentTime, duration }: ParameterCurveChartProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 绘制每条曲线
    curves.forEach((curve) => {
      ctx.strokeStyle = curve.color
      ctx.lineWidth = 2
      ctx.beginPath()

      const steps = 100
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration
        const value = curve.getValue(t)
        const x = (t / duration) * width
        const y = height - (value / 100) * height // 假设值范围0-100

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    })

    // 绘制当前时间线
    const currentX = (currentTime / duration) * width
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(currentX, 0)
    ctx.lineTo(currentX, height)
    ctx.stroke()
    ctx.setLineDash([])
  }, [curves, currentTime, duration])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-purple-400">
          {isZh ? '参数曲线' : 'Parameter Curves'}
        </h4>
        <div className="flex items-center gap-3">
          {curves.map((curve, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: curve.color }}
              />
              <span className="text-xs text-slate-400">
                {isZh ? (curve.labelZh || curve.label) : curve.label}
              </span>
              <span className="text-xs font-mono text-white">
                {curve.getValue(currentTime).toFixed(1)}
                {curve.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={150}
        className="w-full bg-slate-950 rounded-lg border border-slate-700"
      />
    </div>
  )
}

// 时间格式化
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
