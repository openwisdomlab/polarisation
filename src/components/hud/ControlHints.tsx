/**
 * ControlHints - Shows contextual control hints based on camera mode
 * Monument Valley-inspired minimal design
 */
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameStore, CameraMode } from '@/stores/gameStore'
import { cn } from '@/lib/utils'

interface ControlHint {
  key: string
  action: string
}

const CONTROL_HINTS: Record<CameraMode, { en: ControlHint[]; zh: ControlHint[] }> = {
  'first-person': {
    en: [
      { key: 'WASD', action: 'Move' },
      { key: 'Mouse', action: 'Look around' },
      { key: 'Click', action: 'Place/Remove' },
      { key: 'ESC', action: 'Exit view' },
    ],
    zh: [
      { key: 'WASD', action: '移动' },
      { key: '鼠标', action: '环顾' },
      { key: '点击', action: '放置/删除' },
      { key: 'ESC', action: '退出视角' },
    ],
  },
  'isometric': {
    en: [
      { key: 'Drag', action: 'Rotate view' },
      { key: 'Right drag', action: 'Pan' },
      { key: 'Scroll', action: 'Zoom' },
      { key: 'Click', action: 'Place/Remove' },
    ],
    zh: [
      { key: '拖动', action: '旋转视角' },
      { key: '右键拖动', action: '平移' },
      { key: '滚轮', action: '缩放' },
      { key: '点击', action: '放置/删除' },
    ],
  },
  'top-down': {
    en: [
      { key: 'Right drag', action: 'Pan' },
      { key: 'Scroll', action: 'Zoom' },
      { key: 'Click', action: 'Place/Remove' },
      { key: 'R', action: 'Rotate block' },
    ],
    zh: [
      { key: '右键拖动', action: '平移' },
      { key: '滚轮', action: '缩放' },
      { key: '点击', action: '放置/删除' },
      { key: 'R', action: '旋转方块' },
    ],
  },
}

export function ControlHints() {
  const { t, i18n } = useTranslation()
  void t
  const { cameraMode } = useGameStore()
  const [isVisible, setIsVisible] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  const isZh = i18n.language === 'zh'
  const hints = CONTROL_HINTS[cameraMode][isZh ? 'zh' : 'en']

  // Hide hints after user starts interacting
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true)
    }

    window.addEventListener('mousedown', handleInteraction)
    window.addEventListener('keydown', handleInteraction)

    return () => {
      window.removeEventListener('mousedown', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  // Auto-hide after interaction, but show again when mode changes
  useEffect(() => {
    setIsVisible(true)
    setHasInteracted(false)

    const timer = setTimeout(() => {
      if (hasInteracted) {
        setIsVisible(false)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [cameraMode])

  // Hide after 5 seconds if user has interacted
  useEffect(() => {
    if (hasInteracted) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasInteracted])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'absolute bottom-28 left-1/2 -translate-x-1/2 transition-all duration-500',
        'flex items-center gap-3 px-4 py-2 rounded-xl',
        'bg-black/60 backdrop-blur-sm border border-cyan-400/20',
        hasInteracted && 'opacity-50'
      )}
    >
      {hints.map((hint, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-400 font-mono text-[10px]">
            {hint.key}
          </span>
          <span className="text-gray-400">{hint.action}</span>
          {i < hints.length - 1 && <span className="text-gray-600 ml-2">•</span>}
        </div>
      ))}
    </div>
  )
}
