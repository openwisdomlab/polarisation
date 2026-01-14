/**
 * OpticalOverviewDiagram - 知识棱镜
 * 交互式光谱导航图：展示光学学科各分支与偏振光的核心位置
 */

import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Sun, Sparkles, Zap, FlaskConical, ChevronDown } from 'lucide-react'
import { BranchCard } from './BranchCard'

export interface OpticalOverviewDiagramProps {
  onFilterChange?: (branch: string) => void
}

export function OpticalOverviewDiagram({ onFilterChange }: OpticalOverviewDiagramProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // 折叠状态 - 默认收起
  const [isExpanded, setIsExpanded] = useState(false)
  // 选中的分支 - 默认选中偏振光学
  const [selectedBranch, setSelectedBranch] = useState<string>('polarization')

  const handleBranchSelect = useCallback((branchId: string) => {
    setSelectedBranch(branchId)
    onFilterChange?.(branchId)
  }, [onFilterChange])


  // 光学分支数据
  const branches = useMemo(() => [
    {
      id: 'geometric',
      nameEn: 'Geometric Optics',
      nameZh: '几何光学',
      descEn: 'Ray tracing, lenses, mirrors - where light travels in straight lines',
      descZh: '光线追踪、透镜、反射镜 - 光沿直线传播的世界',
      category: 'geometric' as const,
      scaleEn: 'Macroscopic (mm+)',
      scaleZh: '宏观尺度 (mm+)',
      beamColor: '#f97316',
      icon: <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-orange-400' : 'text-orange-600')} />,
      topics: [
        { en: 'Reflection & Refraction', zh: '反射与折射' },
        { en: 'Lens Systems', zh: '透镜系统' },
        { en: 'Optical Instruments', zh: '光学仪器' },
      ]
    },
    {
      id: 'wave',
      nameEn: 'Wave Optics',
      nameZh: '波动光学',
      descEn: 'Interference, diffraction - light as waves creating patterns',
      descZh: '干涉、衍射 - 光波创造的奇妙图案',
      category: 'wave' as const,
      scaleEn: 'Wavelength (μm)',
      scaleZh: '波长尺度 (μm)',
      beamColor: '#22c55e',
      icon: <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-green-400' : 'text-green-600')} />,
      topics: [
        { en: 'Interference', zh: '干涉' },
        { en: 'Diffraction', zh: '衍射' },
        { en: 'Coherence', zh: '相干性' },
      ]
    },
    {
      id: 'polarization',
      nameEn: 'Polarization Optics',
      nameZh: '偏振光学',
      descEn: 'The transverse nature of light - vibrations perpendicular to propagation reveal hidden dimensions of electromagnetic waves',
      descZh: '光的横波本质 - 垂直于传播方向的振动，揭示电磁波的隐藏维度',
      category: 'polarization' as const,
      scaleEn: 'Wave vector (nm)',
      scaleZh: '波矢尺度 (nm)',
      isHighlight: true,
      beamColor: '#22d3ee',
      icon: <Zap className={cn('w-6 h-6', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />,
      topics: [
        { en: "Malus's Law", zh: '马吕斯定律' },
        { en: 'Birefringence', zh: '双折射' },
        { en: 'Waveplates', zh: '波片' },
        { en: 'Stokes & Mueller', zh: '斯托克斯与穆勒' },
      ]
    },
    {
      id: 'quantum',
      nameEn: 'Quantum Optics',
      nameZh: '量子光学',
      descEn: 'Photon physics - light as discrete packets of energy',
      descZh: '光子物理 - 光作为离散能量包的量子世界',
      category: 'quantum' as const,
      scaleEn: 'Photon (single)',
      scaleZh: '光子尺度',
      beamColor: '#a855f7',
      icon: <FlaskConical className={cn('w-5 h-5', theme === 'dark' ? 'text-purple-400' : 'text-purple-600')} />,
      topics: [
        { en: 'Photoelectric Effect', zh: '光电效应' },
        { en: 'Quantum Entanglement', zh: '量子纠缠' },
        { en: 'Single Photon', zh: '单光子' },
      ]
    },
  ], [theme])

  return (
    <motion.div
      className={cn(
        'mb-8 rounded-3xl border overflow-hidden',
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-800/95 to-slate-900 border-slate-700/50'
          : 'bg-gradient-to-br from-white via-gray-50/80 to-white border-gray-200/80',
        'shadow-xl'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 可折叠标题区域 - 增强版 */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full px-6 py-5 flex items-center justify-between cursor-pointer transition-all duration-300',
          theme === 'dark'
            ? 'bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-slate-900/80 hover:from-slate-800/80 hover:via-slate-700/50 hover:to-slate-800/80'
            : 'bg-gradient-to-r from-white/80 via-gray-50/50 to-white/80 hover:from-gray-50/80 hover:via-gray-100/50 hover:to-gray-50/80',
          isExpanded && (theme === 'dark' ? 'border-b border-slate-700/50' : 'border-b border-gray-200/50')
        )}
        whileHover={{ scale: 1.002 }}
        whileTap={{ scale: 0.998 }}
      >
        <div className="flex items-center gap-4">
          {/* 动态棱镜图标 */}
          <motion.div
            className={cn(
              'relative p-3 rounded-2xl',
              theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' : 'bg-gradient-to-br from-cyan-100 to-purple-100'
            )}
            animate={isExpanded ? {
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 2, repeat: isExpanded ? Infinity : 0 }}
          >
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              {/* 棱镜主体 */}
              <motion.polygon
                points="16,4 28,26 4,26"
                fill={theme === 'dark' ? 'url(#prism-grad-dark)' : 'url(#prism-grad-light)'}
                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                strokeWidth="1.5"
              />
              {/* 动态色散光线 - 科学说明：
                  棱镜色散遵循斯涅尔定律，短波长(紫色)折射率更大，偏折更多
                  从上到下依次为：红(700nm)→橙→黄→绿→蓝→紫(380nm) */}
              {/* 红光 - 折射最小，偏向最上 */}
              <motion.line
                x1="20" y1="14" x2="30" y2="6"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              {/* 橙光 */}
              <motion.line
                x1="20" y1="15" x2="30" y2="10"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />
              {/* 黄光 */}
              <motion.line
                x1="21" y1="16" x2="30" y2="14"
                stroke="#eab308"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              {/* 绿光 */}
              <motion.line
                x1="21" y1="17" x2="30" y2="18"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              />
              {/* 蓝光 */}
              <motion.line
                x1="21" y1="19" x2="30" y2="23"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              {/* 紫光 - 折射最大，偏向最下 */}
              <motion.line
                x1="20" y1="21" x2="30" y2="28"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              />
              <defs>
                <linearGradient id="prism-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="prism-grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>
            </svg>
            {/* 发光效果 */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)',
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="text-left">
            <h3 className={cn(
              'font-bold text-xl tracking-tight',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '知识棱镜：光学全景图' : 'The Prism of Knowledge'}
            </h3>
            <p className={cn(
              'text-sm mt-0.5',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh
                ? '探索光学四大分支，发现偏振光的核心地位'
                : 'Explore the four branches of optics and discover the central role of polarization'}
            </p>
          </div>
        </div>

        <motion.div
          className={cn(
            'p-2.5 rounded-xl',
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'
          )}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown className={cn(
            'w-5 h-5',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )} />
        </motion.div>
      </motion.button>

      {/* 可折叠内容区域 - 使用 AnimatePresence */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* 主要内容区域 - 横向排列的四大分支 */}
            <div className="p-6">
              {/* 横向排列的分支卡片 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {branches.map((branch, index) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    isSelected={selectedBranch === branch.id}
                    isZh={isZh}
                    theme={theme}
                    onClick={() => handleBranchSelect(branch.id)}
                    onHover={() => {}}
                    index={index}
                  />
                ))}
              </div>

              {/* 简化的底部说明 */}
              <p className={cn(
                'text-center text-xs mt-4',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {isZh
                  ? '点击卡片了解更多 · 偏振光学是连接经典与量子光学的桥梁'
                  : 'Click cards to learn more · Polarization bridges classical and quantum optics'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
