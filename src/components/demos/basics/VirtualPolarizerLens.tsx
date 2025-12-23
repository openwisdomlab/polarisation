/**
 * VirtualPolarizerLens - 虚拟偏振片镜头组件
 * 模拟偏振滤镜去除反射眩光的效果（如水面反光）
 *
 * 物理原理：
 * - 使用马吕斯定律：I = I₀ × cos²(θ)
 * - 0° 时显示原始图像（全部眩光）
 * - 90° 时显示过滤后图像（无眩光）
 *
 * 交互方式：
 * - 鼠标/触摸移动镜头位置
 * - 滚轮/滑块旋转偏振片角度
 */
import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { SliderControl } from '../DemoControls'

interface VirtualPolarizerLensProps {
  /** 基础图像（有眩光） */
  imageBase: string
  /** 过滤后图像（无眩光） */
  imageFiltered: string
  /** 容器宽度 */
  width?: number | string
  /** 容器高度 */
  height?: number | string
  /** 镜头半径 */
  lensRadius?: number
  /** 初始角度 */
  initialAngle?: number
  /** 是否显示滑块控制 */
  showSlider?: boolean
  /** 是否显示角度指示器 */
  showAngleIndicator?: boolean
  /** 是否显示偏振轴线 */
  showPolarizationAxis?: boolean
  /** 背景暗化程度 (0-1) */
  backgroundDim?: number
  /** 自定义类名 */
  className?: string
}

export function VirtualPolarizerLens({
  imageBase,
  imageFiltered,
  width = '100%',
  height = 400,
  lensRadius = 80,
  initialAngle = 0,
  showSlider = true,
  showAngleIndicator = true,
  showPolarizationAxis = true,
  backgroundDim = 0.3,
  className,
}: VirtualPolarizerLensProps) {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  // 状态
  const [angle, setAngle] = useState(initialAngle)
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 })
  const [isLensActive, setIsLensActive] = useState(false)

  // 使用马吕斯定律计算透射率
  // 0° = 完全显示 imageBase (cos²0° = 1 → glare = 100%)
  // 90° = 完全显示 imageFiltered (cos²90° = 0 → glare = 0%)
  const glareOpacity = useMemo(() => {
    return Math.pow(Math.cos(angle * Math.PI / 180), 2)
  }, [angle])

  // filteredOpacity 是 glareOpacity 的反向
  const filteredOpacity = 1 - glareOpacity

  // 监控容器尺寸并初始化镜头位置
  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // 初始化镜头位置到中心
        if (!isLensActive) {
          setLensPosition({ x: rect.width / 2, y: rect.height / 2 })
        }
      }
    }

    updateSize()
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [isLensActive])

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(lensRadius, Math.min(rect.width - lensRadius, e.clientX - rect.left))
    const y = Math.max(lensRadius, Math.min(rect.height - lensRadius, e.clientY - rect.top))
    setLensPosition({ x, y })
    setIsLensActive(true)
  }, [lensRadius])

  // 处理触摸移动
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(lensRadius, Math.min(rect.width - lensRadius, touch.clientX - rect.left))
    const y = Math.max(lensRadius, Math.min(rect.height - lensRadius, touch.clientY - rect.top))
    setLensPosition({ x, y })
    setIsLensActive(true)
  }, [lensRadius])

  // 处理滚轮旋转
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    setAngle(prev => {
      const delta = e.deltaY > 0 ? 5 : -5
      let newAngle = prev + delta
      // 限制在 0-90 度范围内
      newAngle = Math.max(0, Math.min(90, newAngle))
      return newAngle
    })
  }, [])

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    setIsLensActive(false)
  }, [])

  // 计算镜头的 clip-path
  const lensClipPath = useMemo(() => {
    return `circle(${lensRadius}px at ${lensPosition.x}px ${lensPosition.y}px)`
  }, [lensRadius, lensPosition])

  return (
    <div className={cn('space-y-4', className)}>
      {/* 主视觉区域 */}
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-xl cursor-none select-none',
          theme === 'dark'
            ? 'border border-slate-700/50'
            : 'border border-gray-200 shadow-lg'
        )}
        style={{
          width,
          height,
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        {/* 背景图层 - 基础图像（带暗化） */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-200"
          style={{
            backgroundImage: `url(${imageBase})`,
            opacity: 1 - backgroundDim,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
            opacity: backgroundDim,
          }}
        />

        {/* 镜头内部 - 图像混合区域 */}
        <AnimatePresence>
          {isLensActive && (
            <>
              {/* 镜头内的基础图像层 */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url(${imageBase})`,
                  clipPath: lensClipPath,
                  opacity: glareOpacity,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: glareOpacity }}
                transition={{ duration: 0.1 }}
              />

              {/* 镜头内的过滤图像层 */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url(${imageFiltered})`,
                  clipPath: lensClipPath,
                  opacity: filteredOpacity,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: filteredOpacity }}
                transition={{ duration: 0.1 }}
              />

              {/* 镜头边框 */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: lensPosition.x - lensRadius,
                  top: lensPosition.y - lensRadius,
                  width: lensRadius * 2,
                  height: lensRadius * 2,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* 外环 */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-full border-2',
                    theme === 'dark'
                      ? 'border-cyan-400/70 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                      : 'border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  )}
                />

                {/* 内环装饰 */}
                <div
                  className={cn(
                    'absolute inset-2 rounded-full border',
                    theme === 'dark'
                      ? 'border-cyan-400/30'
                      : 'border-cyan-400/40'
                  )}
                />

                {/* 偏振轴线 */}
                {showPolarizationAxis && (
                  <motion.div
                    className="absolute left-1/2 top-1/2 w-full"
                    style={{
                      height: 2,
                      marginLeft: '-50%',
                      marginTop: -1,
                    }}
                    animate={{ rotate: angle }}
                    transition={{ duration: 0.1 }}
                  >
                    <div
                      className={cn(
                        'w-full h-full rounded-full',
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent'
                          : 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
                      )}
                    />
                    {/* 轴端点标记 */}
                    <div
                      className={cn(
                        'absolute -left-1 -top-1 w-2 h-2 rounded-full',
                        theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                      )}
                    />
                    <div
                      className={cn(
                        'absolute -right-1 -top-1 w-2 h-2 rounded-full',
                        theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                      )}
                    />
                  </motion.div>
                )}

                {/* 角度指示器 */}
                {showAngleIndicator && (
                  <motion.div
                    className={cn(
                      'absolute -bottom-8 left-1/2 -translate-x-1/2',
                      'px-2 py-1 rounded-md text-xs font-mono whitespace-nowrap',
                      theme === 'dark'
                        ? 'bg-slate-800/90 text-cyan-400 border border-cyan-400/30'
                        : 'bg-white/90 text-cyan-600 border border-cyan-200 shadow-sm'
                    )}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    θ = {angle.toFixed(0)}° | I/I₀ = {glareOpacity.toFixed(2)}
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 提示文字 - 无镜头时显示 */}
        {!isLensActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className={cn(
                'px-4 py-2 rounded-lg text-sm',
                theme === 'dark'
                  ? 'bg-slate-800/80 text-gray-300 border border-slate-600/50'
                  : 'bg-white/80 text-gray-600 border border-gray-200'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              移动鼠标/触摸屏幕查看偏振效果
            </motion.div>
          </div>
        )}

        {/* 滚轮提示 */}
        {isLensActive && (
          <motion.div
            className={cn(
              'absolute bottom-3 right-3 px-2 py-1 rounded text-xs',
              theme === 'dark'
                ? 'bg-slate-800/80 text-gray-400 border border-slate-600/50'
                : 'bg-white/80 text-gray-500 border border-gray-200'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            滚轮旋转偏振片
          </motion.div>
        )}
      </div>

      {/* 控制滑块 */}
      {showSlider && (
        <div
          className={cn(
            'p-4 rounded-xl',
            theme === 'dark'
              ? 'bg-slate-800/70 border border-cyan-400/20'
              : 'bg-white border border-gray-200 shadow-sm'
          )}
        >
          <SliderControl
            label="偏振片角度 θ"
            value={angle}
            min={0}
            max={90}
            step={1}
            unit="°"
            onChange={setAngle}
            color="purple"
          />

          {/* 马吕斯定律实时计算 */}
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="flex justify-between items-center text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                马吕斯定律: I/I₀ = cos²θ
              </span>
              <span className={cn('font-mono', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
                cos²({angle}°) = {glareOpacity.toFixed(3)}
              </span>
            </div>

            {/* 光强条 */}
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs w-16', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                  眩光
                </span>
                <div className={cn('flex-1 h-2 rounded-full overflow-hidden', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                    animate={{ width: `${glareOpacity * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className={cn('text-xs w-12 text-right font-mono', theme === 'dark' ? 'text-orange-400' : 'text-orange-600')}>
                  {(glareOpacity * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-xs w-16', theme === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
                  清晰度
                </span>
                <div className={cn('flex-1 h-2 rounded-full overflow-hidden', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-green-400"
                    animate={{ width: `${filteredOpacity * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className={cn('text-xs w-12 text-right font-mono', theme === 'dark' ? 'text-green-400' : 'text-green-600')}>
                  {(filteredOpacity * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* 物理解释 */}
          <div className={cn(
            'mt-3 p-2 rounded-lg text-xs',
            theme === 'dark'
              ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300'
              : 'bg-purple-50 border border-purple-100 text-purple-700'
          )}>
            {angle < 10 && '偏振片与反射光偏振方向平行，眩光完全通过'}
            {angle >= 10 && angle < 40 && '偏振片开始过滤部分反射光，眩光逐渐减弱'}
            {angle >= 40 && angle < 50 && '偏振片与反射光成45°角，过滤一半眩光'}
            {angle >= 50 && angle < 80 && '偏振片接近垂直于反射光偏振方向，大部分眩光被过滤'}
            {angle >= 80 && '偏振片垂直于反射光偏振方向，眩光几乎完全被消除'}
          </div>
        </div>
      )}
    </div>
  )
}

export default VirtualPolarizerLens
