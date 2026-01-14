/**
 * Triple View Toggle Component (三视图切换组件)
 *
 * 允许用户在三种偏振系统视图间切换：
 * - Front View (正视图): 无偏振片
 * - Parallel Polarizers (平行偏振系统): 最大透射
 * - Crossed Polarizers (正交偏振系统): 显示双折射色彩
 *
 * 支持左右滑块对比真实照片与模拟结果（未来扩展）
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Maximize2, ArrowLeftRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PolarizationResource } from '@/data/resource-gallery'

type ViewMode = 'front' | 'parallel' | 'crossed'

interface TripleViewToggleProps {
  resource: PolarizationResource
  /** Enable side-by-side comparison slider (future feature) */
  enableComparison?: boolean
}

export function TripleViewToggle({
  resource,
  enableComparison = false,
}: TripleViewToggleProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const [viewMode, setViewMode] = useState<ViewMode>('crossed')
  const [comparisonSlider, setComparisonSlider] = useState(50) // 0-100

  // Get image URL based on current view mode
  const getCurrentImageUrl = () => {
    if (!resource.views) return resource.url

    switch (viewMode) {
      case 'front':
        return resource.views.front || resource.url
      case 'parallel':
        return resource.views.parallel || resource.url
      case 'crossed':
        return resource.views.crossed || resource.url
      default:
        return resource.url
    }
  }

  const currentImageUrl = getCurrentImageUrl()

  // View mode configurations
  const viewModes: Array<{
    id: ViewMode
    label: string
    labelZh: string
    description: string
    descriptionZh: string
    color: string
    available: boolean
  }> = [
    {
      id: 'front',
      label: 'Front View',
      labelZh: '正视图',
      description: 'Without polarizers',
      descriptionZh: '无偏振片',
      color: 'slate',
      available: !!resource.views?.front,
    },
    {
      id: 'parallel',
      label: 'Parallel',
      labelZh: '平行偏振',
      description: 'Maximum transmission',
      descriptionZh: '最大透射',
      color: 'green',
      available: !!resource.views?.parallel,
    },
    {
      id: 'crossed',
      label: 'Crossed',
      labelZh: '正交偏振',
      description: 'Birefringent colors',
      descriptionZh: '双折射色彩',
      color: 'cyan',
      available: !!resource.views?.crossed,
    },
  ]

  // Get polarization system info
  const getPolarizationInfo = () => {
    switch (viewMode) {
      case 'front':
        return {
          icon: '👁️',
          text: isZh ? '无偏振片 - 看到原始样品' : 'No Polarizers - See original sample',
        }
      case 'parallel':
        return {
          icon: '↕️',
          text: isZh
            ? '平行偏振系统 - 偏振片方向一致，光线最大透射'
            : 'Parallel Polarizers - Same orientation, maximum transmission',
        }
      case 'crossed':
        return {
          icon: '⊥',
          text: isZh
            ? '正交偏振系统 - 偏振片垂直，显示双折射色彩'
            : 'Crossed Polarizers - Perpendicular orientation, shows birefringent colors',
        }
    }
  }

  const polarizationInfo = getPolarizationInfo()

  return (
    <div className="p-6">
      {/* View Mode Selector */}
      <div className="flex gap-2 mb-4">
        {viewModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => mode.available && setViewMode(mode.id)}
            disabled={!mode.available}
            className={`flex-1 px-4 py-3 rounded-lg transition-all ${
              viewMode === mode.id
                ? `bg-${mode.color}-500 text-white shadow-lg shadow-${mode.color}-500/30`
                : mode.available
                ? `bg-slate-800 text-slate-300 hover:bg-slate-700`
                : `bg-slate-900 text-slate-600 cursor-not-allowed`
            }`}
          >
            <div className="text-sm font-semibold">
              {isZh ? mode.labelZh : mode.label}
            </div>
            <div className="text-xs opacity-80 mt-0.5">
              {isZh ? mode.descriptionZh : mode.description}
            </div>
          </button>
        ))}
      </div>

      {/* Polarization System Info */}
      <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="text-2xl">{polarizationInfo.icon}</span>
          <span>{polarizationInfo.text}</span>
        </div>
      </div>

      {/* Image Display */}
      <div className="relative rounded-lg overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageUrl}
            src={currentImageUrl}
            alt={`${isZh ? resource.titleZh : resource.title} - ${viewMode}`}
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* View Mode Badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-white text-sm font-medium">
              {isZh
                ? viewModes.find(m => m.id === viewMode)?.labelZh
                : viewModes.find(m => m.id === viewMode)?.label}
            </span>
          </div>
        </div>

        {/* Comparison Slider (Future Feature) */}
        {enableComparison && (
          <div className="absolute bottom-4 left-4 right-4">
            <ComparisonSlider
              value={comparisonSlider}
              onChange={setComparisonSlider}
            />
          </div>
        )}
      </div>

      {/* Metadata Display */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Material */}
        {resource.metadata.material && (
          <MetadataItem
            label={isZh ? '材质' : 'Material'}
            value={resource.metadata.material}
          />
        )}

        {/* Polarization System */}
        {resource.metadata.polarizationSystem && (
          <MetadataItem
            label={isZh ? '偏振系统' : 'Polarization'}
            value={resource.metadata.polarizationSystem}
          />
        )}

        {/* Layers (for sequences) */}
        {resource.metadata.layers && (
          <MetadataItem
            label={isZh ? '层数' : 'Layers'}
            value={`${resource.metadata.layers}`}
          />
        )}

        {/* Temperature (for thermal experiments) */}
        {resource.metadata.temperature && (
          <MetadataItem
            label={isZh ? '温度' : 'Temperature'}
            value={`${resource.metadata.temperature}°C`}
          />
        )}
      </div>

      {/* Video Link */}
      {resource.metadata.hasVideo && resource.metadata.videoUrl && (
        <div className="mt-4">
          <a
            href={resource.metadata.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 hover:bg-red-500/20
                     border border-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isZh ? '观看完整视频' : 'Watch Full Video'}
            </span>
          </a>
        </div>
      )}

      {/* Quick Switch Tips */}
      <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <ArrowLeftRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-cyan-300">
            {isZh
              ? '💡 提示：切换不同的偏振系统，观察样品的颜色和亮度变化。正交偏振系统下色彩最丰富！'
              : '💡 Tip: Switch between polarization systems to observe color and brightness changes. Crossed polarizers show the richest colors!'}
          </p>
        </div>
      </div>
    </div>
  )
}

// ===== Sub-components =====

interface MetadataItemProps {
  label: string
  value: string
}

function MetadataItem({ label, value }: MetadataItemProps) {
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-sm text-white font-medium">{value}</div>
    </div>
  )
}

interface ComparisonSliderProps {
  value: number
  onChange: (value: number) => void
}

function ComparisonSlider({ value, onChange }: ComparisonSliderProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="bg-black/70 backdrop-blur-sm p-3 rounded-lg border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white">
          {isZh ? '真实照片' : 'Real Photo'}
        </span>
        <span className="text-xs text-white">
          {isZh ? '模拟结果' : 'Simulation'}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="text-center text-xs text-slate-400 mt-1">
        {value}% / {100 - value}%
      </div>
    </div>
  )
}
