/**
 * PolarizationComparison - 偏振光对比展示组件
 * 用于首页展示非偏振光和偏振光的区别
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// 电场矢量组件
function EFieldVector({
  angle,
  length,
  color,
  animate = true,
  delay = 0,
}: {
  angle: number
  length: number
  color: string
  animate?: boolean
  delay?: number
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-center"
      style={{
        width: length * 2,
        height: 3,
        marginLeft: -length,
        marginTop: -1.5,
        rotate: angle,
      }}
      initial={{ scaleX: 0 }}
      animate={animate ? {
        scaleX: [0, 1, 0, -1, 0],
      } : { scaleX: 1 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {/* 箭头 */}
      <motion.div
        className="absolute right-0 top-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: `8px solid ${color}`,
          marginTop: -5,
          marginRight: -4,
        }}
        animate={animate ? {
          opacity: [0, 1, 0, 0, 0],
        } : { opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

export function PolarizationComparison() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [polarizationAngle, setPolarizationAngle] = useState(0)

  // 非偏振光的随机角度
  const randomAngles = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350]

  // 自动旋转偏振角度
  useEffect(() => {
    const interval = setInterval(() => {
      setPolarizationAngle(prev => (prev + 15) % 180)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn(
      'rounded-2xl border p-6 mx-auto max-w-4xl',
      theme === 'dark'
        ? 'bg-slate-900/80 border-slate-700'
        : 'bg-white/80 border-gray-200'
    )}>
      {/* 标题 */}
      <div className="text-center mb-6">
        <h3 className={cn(
          'text-xl font-bold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {t('home.polarizationDemo.title', '什么是偏振？')}
        </h3>
        <p className={cn(
          'text-sm',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {t('home.polarizationDemo.subtitle', 'What is Polarization?')}
        </p>
      </div>

      {/* 两面板对比 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 非偏振光面板 */}
        <div className={cn(
          'rounded-xl border p-4',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 via-slate-800/95 to-slate-900 border-slate-600/50'
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 border-gray-200'
        )}>
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-yellow-500">
              {t('demoUi.polarizationIntro.unpolarizedLight', '非偏振光')}
            </h4>
            <p className={cn(
              'text-xs mt-1',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              Unpolarized Light
            </p>
          </div>

          {/* 电场矢量可视化 */}
          <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
            {/* 背景圆 */}
            <div className={cn(
              'absolute inset-0 rounded-full border',
              theme === 'dark'
                ? 'border-slate-600/50 bg-slate-900/50'
                : 'border-gray-300 bg-gray-50'
            )} />

            {/* 中心光源点 */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full -ml-2 -mt-2 bg-yellow-400"
              animate={{
                boxShadow: [
                  '0 0 10px #fbbf24',
                  '0 0 20px #fbbf24',
                  '0 0 10px #fbbf24',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* 非偏振光 - 多个随机方向的矢量 */}
            {randomAngles.map((angle, i) => (
              <EFieldVector
                key={i}
                angle={angle}
                length={70}
                color={`hsl(${angle}, 70%, 60%)`}
                animate={true}
                delay={i * 0.1}
              />
            ))}
          </div>

          {/* 传播方向指示 */}
          <div className={cn(
            'flex items-center justify-center gap-2 text-sm',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="12" r="8" />
            </svg>
            <span>{t('demoUi.polarizationIntro.propagationDirection', 'k (传播方向，垂直纸面向外)')}</span>
          </div>
        </div>

        {/* 偏振光面板 */}
        <div className={cn(
          'rounded-xl border p-4',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 via-slate-800/95 to-slate-900 border-slate-600/50'
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 border-gray-200'
        )}>
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-cyan-500">
              {t('demoUi.polarizationIntro.polarizedLight', '偏振光')}
            </h4>
            <p className={cn(
              'text-xs mt-1',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              <span className="text-cyan-500">Polarized</span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>(极化) Light</span>
            </p>
          </div>

          {/* 电场矢量可视化 */}
          <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
            {/* 背景圆 */}
            <div className={cn(
              'absolute inset-0 rounded-full border',
              theme === 'dark'
                ? 'border-slate-600/50 bg-slate-900/50'
                : 'border-gray-300 bg-gray-50'
            )} />

            {/* 中心光源点 */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full -ml-2 -mt-2 bg-cyan-400"
              animate={{
                boxShadow: [
                  '0 0 10px #22d3ee',
                  '0 0 20px #22d3ee',
                  '0 0 10px #22d3ee',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* 偏振光 - 单一方向的矢量 */}
            <EFieldVector
              angle={polarizationAngle}
              length={80}
              color="#22d3ee"
              animate={true}
            />

            {/* 偏振方向指示线 */}
            <motion.div
              className={cn(
                'absolute left-1/2 top-1/2 w-[180px] h-[1px] -ml-[90px] border-t border-dashed',
                theme === 'dark' ? 'border-gray-500/50' : 'border-gray-400/50'
              )}
              style={{ rotate: polarizationAngle }}
            />
          </div>

          {/* 传播方向指示 */}
          <div className={cn(
            'flex items-center justify-center gap-2 text-sm',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="12" r="8" />
            </svg>
            <span>{t('demoUi.polarizationIntro.propagationDirection', 'k (传播方向，垂直纸面向外)')}</span>
          </div>

          {/* 偏振角显示 */}
          <motion.div
            className="mt-3 text-center text-cyan-400 font-mono text-sm"
            key={polarizationAngle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            θ = {polarizationAngle}°
          </motion.div>
        </div>
      </div>

      {/* 简要说明 */}
      <div className={cn(
        'mt-6 p-4 rounded-lg text-center',
        theme === 'dark'
          ? 'bg-slate-800/50'
          : 'bg-gray-50'
      )}>
        <p className={cn(
          'text-sm',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        )}>
          <span className="text-yellow-500 font-medium">
            {t('home.polarizationDemo.unpolarizedDesc', '非偏振光')}
          </span>
          {t('home.polarizationDemo.separator', '：电场在所有方向振动  |  ')}
          <span className="text-cyan-500 font-medium">
            {t('home.polarizationDemo.polarizedDesc', '偏振光')}
          </span>
          {t('home.polarizationDemo.ending', '：电场只在单一方向振动')}
        </p>
      </div>
    </div>
  )
}

export default PolarizationComparison
