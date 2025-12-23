/**
 * Gallery Hero - 演示馆顶部偏振光可视化组件
 *
 * A compact hero section for the polarization demo gallery,
 * designed to work with the left sidebar navigation.
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  Lightbulb,
  Waves,
  Layers,
  FlaskConical,
  Atom,
  Microscope,
  Play,
  Sparkles
} from 'lucide-react'

// Polarization angle colors
const POLARIZATION_COLORS = ['#ff4444', '#ffaa00', '#44ff44', '#4488ff']

// Exhibition hall configuration for each unit
interface ExhibitionHall {
  id: string
  unit: number
  titleKey: string
  subtitleKey: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  glowColor: string
  bgGradient: string
  demos: string[]
}

const EXHIBITION_HALLS: ExhibitionHall[] = [
  {
    id: 'optical-basics',
    unit: 0,
    titleKey: 'museum.halls.basics.title',
    subtitleKey: 'museum.halls.basics.subtitle',
    icon: Lightbulb,
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    bgGradient: 'from-amber-500/20 via-amber-400/10 to-transparent',
    demos: ['em-wave', 'polarization-intro', 'polarization-types-unified', 'optical-bench']
  },
  {
    id: 'polarization-fundamentals',
    unit: 1,
    titleKey: 'museum.halls.fundamentals.title',
    subtitleKey: 'museum.halls.fundamentals.subtitle',
    icon: Waves,
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    bgGradient: 'from-cyan-500/20 via-cyan-400/10 to-transparent',
    demos: ['polarization-state', 'malus', 'birefringence', 'waveplate']
  },
  {
    id: 'interface-reflection',
    unit: 2,
    titleKey: 'museum.halls.reflection.title',
    subtitleKey: 'museum.halls.reflection.subtitle',
    icon: Layers,
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    bgGradient: 'from-violet-500/20 via-violet-400/10 to-transparent',
    demos: ['fresnel', 'brewster']
  },
  {
    id: 'transparent-media',
    unit: 3,
    titleKey: 'museum.halls.media.title',
    subtitleKey: 'museum.halls.media.subtitle',
    icon: FlaskConical,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    bgGradient: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
    demos: ['anisotropy', 'chromatic', 'optical-rotation']
  },
  {
    id: 'scattering',
    unit: 4,
    titleKey: 'museum.halls.scattering.title',
    subtitleKey: 'museum.halls.scattering.subtitle',
    icon: Atom,
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    bgGradient: 'from-pink-500/20 via-pink-400/10 to-transparent',
    demos: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering']
  },
  {
    id: 'polarimetry',
    unit: 5,
    titleKey: 'museum.halls.polarimetry.title',
    subtitleKey: 'museum.halls.polarimetry.subtitle',
    icon: Microscope,
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    bgGradient: 'from-blue-500/20 via-blue-400/10 to-transparent',
    demos: ['stokes', 'mueller', 'jones', 'polarimetric-microscopy']
  }
]

// Animated Light Beams component - compact version
function AnimatedPolarizationVisual() {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central light source */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)`,
          filter: 'blur(15px)'
        }}
      />

      {/* Rotating polarization beams - smaller and centered */}
      {[0, 45, 90, 135].map((angle, i) => (
        <div
          key={angle}
          className="absolute top-1/2 left-1/2 w-0.5 origin-center"
          style={{
            height: '100%',
            background: `linear-gradient(to bottom, transparent 20%, ${POLARIZATION_COLORS[i]}60 50%, transparent 80%)`,
            transform: `translate(-50%, -50%) rotate(${angle + time * 0.3}deg)`,
            opacity: 0.4 + 0.2 * Math.sin((time + angle) * Math.PI / 180),
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 3,
            height: 3 + Math.random() * 3,
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
            background: POLARIZATION_COLORS[i % 4],
            opacity: 0.2 + 0.3 * Math.sin(time * 0.1 + i),
            filter: 'blur(1px)',
            animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${-Math.random() * 3}s`
          }}
        />
      ))}

      {/* Interference pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <defs>
          <pattern id="gallery-interference" width="15" height="15" patternUnits="userSpaceOnUse">
            <circle cx="7.5" cy="7.5" r="6" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gallery-interference)" className="text-cyan-400" />
      </svg>
    </div>
  )
}

// Exhibition Hall Card - compact version
function ExhibitionHallCard({
  hall,
  isHovered,
  onHover,
  onClick
}: {
  hall: ExhibitionHall
  isHovered: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const Icon = hall.icon

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden cursor-pointer",
        "transition-all duration-300 transform",
        isHovered ? "scale-[1.02] z-10" : "scale-100",
        theme === 'dark' ? "bg-slate-800/80" : "bg-white/90"
      )}
      style={{
        boxShadow: isHovered
          ? `0 15px 30px -8px ${hall.glowColor}, 0 0 0 1px ${hall.color}30`
          : 'none'
      }}
      onMouseEnter={() => onHover(hall.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          `bg-gradient-to-br ${hall.bgGradient}`
        )}
      />

      {/* Content */}
      <div className="relative p-4 h-full flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            "transition-all duration-300 group-hover:scale-110"
          )}
          style={{
            backgroundColor: `${hall.color}15`,
            boxShadow: isHovered ? `0 0 20px ${hall.glowColor}` : 'none'
          }}
        >
          <Icon
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6"
            style={{ color: hall.color }}
          />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Unit badge */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${hall.color}20`,
                color: hall.color
              }}
            >
              Unit {hall.unit}
            </span>
            <span className={cn(
              "text-[10px]",
              theme === 'dark' ? "text-slate-500" : "text-slate-400"
            )}>
              {hall.demos.length} demos
            </span>
          </div>

          {/* Title */}
          <h3 className={cn(
            "text-sm font-semibold mb-0.5 truncate",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t(hall.titleKey)}
          </h3>

          {/* Subtitle */}
          <p className={cn(
            "text-xs line-clamp-2",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t(hall.subtitleKey)}
          </p>
        </div>

        {/* Arrow */}
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
            "transition-all duration-300",
            isHovered ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          )}
          style={{ backgroundColor: `${hall.color}20` }}
        >
          <ChevronRight className="w-3 h-3" style={{ color: hall.color }} />
        </div>
      </div>
    </div>
  )
}

// Knowledge Star Map data - constellation of knowledge nodes
interface StarNode {
  id: string
  x: number  // percentage position
  y: number
  size: 'large' | 'medium' | 'small'
  color: string
  label: string
  labelKey: string
  unit: number
  connections: string[]  // IDs of connected nodes
}

const STAR_NODES: StarNode[] = [
  // Unit 0: Optical Basics - Left constellation
  { id: 'em-wave', x: 8, y: 30, size: 'large', color: '#fbbf24', label: '电磁波', labelKey: 'demos.emWave.title', unit: 0, connections: ['polarization-intro'] },
  { id: 'polarization-intro', x: 18, y: 22, size: 'large', color: '#fbbf24', label: '偏振入门', labelKey: 'demos.polarizationIntro.title', unit: 0, connections: ['polarization-types', 'polarization-state'] },
  { id: 'polarization-types', x: 22, y: 42, size: 'medium', color: '#fbbf24', label: '偏振类型', labelKey: 'demos.polarizationTypes.title', unit: 0, connections: ['malus'] },

  // Unit 1: Polarization Fundamentals - Central constellation
  { id: 'polarization-state', x: 35, y: 18, size: 'medium', color: '#22d3ee', label: '偏振态', labelKey: 'demos.polarizationState.title', unit: 1, connections: ['stokes'] },
  { id: 'malus', x: 40, y: 35, size: 'large', color: '#22d3ee', label: '马吕斯定律', labelKey: 'demos.malus.title', unit: 1, connections: ['birefringence', 'brewster'] },
  { id: 'birefringence', x: 38, y: 52, size: 'medium', color: '#22d3ee', label: '双折射', labelKey: 'demos.birefringence.title', unit: 1, connections: ['waveplate', 'chromatic'] },
  { id: 'waveplate', x: 32, y: 68, size: 'small', color: '#22d3ee', label: '波片', labelKey: 'demos.waveplate.title', unit: 1, connections: ['mueller'] },

  // Unit 2: Interface Reflection - Upper right
  { id: 'fresnel', x: 58, y: 22, size: 'medium', color: '#a78bfa', label: '菲涅尔', labelKey: 'demos.fresnel.title', unit: 2, connections: ['brewster'] },
  { id: 'brewster', x: 65, y: 32, size: 'large', color: '#a78bfa', label: '布儒斯特', labelKey: 'demos.brewster.title', unit: 2, connections: ['rayleigh'] },

  // Unit 3: Transparent Media - Center right
  { id: 'chromatic', x: 55, y: 55, size: 'medium', color: '#34d399', label: '色偏振', labelKey: 'demos.chromatic.title', unit: 3, connections: ['optical-rotation'] },
  { id: 'optical-rotation', x: 50, y: 72, size: 'small', color: '#34d399', label: '旋光', labelKey: 'demos.opticalRotation.title', unit: 3, connections: ['mueller'] },

  // Unit 4: Scattering - Right side
  { id: 'rayleigh', x: 75, y: 42, size: 'large', color: '#f472b6', label: '瑞利散射', labelKey: 'demos.rayleigh.title', unit: 4, connections: ['mie'] },
  { id: 'mie', x: 80, y: 58, size: 'medium', color: '#f472b6', label: '米氏散射', labelKey: 'demos.mieScattering.title', unit: 4, connections: ['polarimetric'] },

  // Unit 5: Polarimetry - Far right (destination)
  { id: 'stokes', x: 88, y: 28, size: 'large', color: '#60a5fa', label: '斯托克斯', labelKey: 'demos.stokes.title', unit: 5, connections: ['mueller'] },
  { id: 'mueller', x: 90, y: 52, size: 'large', color: '#60a5fa', label: '穆勒矩阵', labelKey: 'demos.mueller.title', unit: 5, connections: ['polarimetric'] },
  { id: 'polarimetric', x: 85, y: 75, size: 'medium', color: '#60a5fa', label: '偏振成像', labelKey: 'demos.polarimetricMicroscopy.title', unit: 5, connections: [] },
]

// Learning path definitions
const LEARNING_PATHS = [
  { id: 'quick', name: '快速入门', nameKey: 'knowledgeMap.paths.quickStart.name', color: '#22d3ee', nodes: ['em-wave', 'polarization-intro', 'malus', 'birefringence'] },
  { id: 'deep', name: '深度探索', nameKey: 'knowledgeMap.paths.deepDive.name', color: '#a78bfa', nodes: ['em-wave', 'polarization-intro', 'polarization-types', 'malus', 'birefringence', 'waveplate', 'stokes', 'mueller'] },
  { id: 'apps', name: '应用之旅', nameKey: 'knowledgeMap.paths.applications.name', color: '#f59e0b', nodes: ['malus', 'brewster', 'chromatic', 'rayleigh'] },
]

// Compact Knowledge Star Map component
function KnowledgeStarMap({
  onSelectDemo
}: {
  onSelectDemo: (demoId: string) => void
}) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [time, setTime] = useState(0)
  const [hoveredStar, setHoveredStar] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  // Animation loop for twinkling stars
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Get path nodes
  const highlightedNodes = selectedPath
    ? LEARNING_PATHS.find(p => p.id === selectedPath)?.nodes || []
    : []

  // Check if connection should be highlighted
  const isConnectionHighlighted = (fromId: string, toId: string) => {
    if (!selectedPath) return false
    const fromIdx = highlightedNodes.indexOf(fromId)
    const toIdx = highlightedNodes.indexOf(toId)
    return fromIdx !== -1 && toIdx !== -1 && Math.abs(fromIdx - toIdx) === 1
  }

  // Get star size in pixels
  const getStarSize = (size: 'large' | 'medium' | 'small') => {
    switch (size) {
      case 'large': return 14
      case 'medium': return 10
      case 'small': return 7
    }
  }

  // Calculate twinkle effect
  const getTwinkle = (id: string, baseOpacity: number) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const twinkle = Math.sin((time + hash * 10) * Math.PI / 180) * 0.3
    return Math.max(0.3, Math.min(1, baseOpacity + twinkle))
  }

  return (
    <div className={cn(
      "rounded-xl overflow-hidden relative",
      theme === 'dark'
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700"
        : "bg-gradient-to-br from-slate-100 via-white to-slate-50 border border-slate-200"
    )}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-opacity-20 border-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className={cn(
            "text-sm font-semibold",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('knowledgeMap.title', '知识星图')}
          </h3>
        </div>

        {/* Path selector pills */}
        <div className="flex gap-1.5">
          {LEARNING_PATHS.map(path => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium transition-all",
                selectedPath === path.id
                  ? "ring-1 ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              )}
              style={{
                backgroundColor: selectedPath === path.id ? `${path.color}30` : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: selectedPath === path.id ? path.color : theme === 'dark' ? '#94a3b8' : '#64748b',
                // @ts-expect-error - CSS custom property
                '--tw-ring-color': path.color,
                '--tw-ring-offset-color': theme === 'dark' ? '#1e293b' : '#ffffff'
              }}
            >
              {t(path.nameKey, path.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Star Map SVG */}
      <div className="relative" style={{ height: 280 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Star glow filter */}
            <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Connection gradient */}
            <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.5" />
            </linearGradient>

            {/* Animated dash pattern */}
            <pattern id="dash-pattern" patternUnits="userSpaceOnUse" width="6" height="1">
              <line x1="0" y1="0.5" x2="3" y2="0.5" stroke="white" strokeWidth="0.3" strokeOpacity="0.6">
                <animate attributeName="x1" from="0" to="6" dur="1s" repeatCount="indefinite" />
                <animate attributeName="x2" from="3" to="9" dur="1s" repeatCount="indefinite" />
              </line>
            </pattern>
          </defs>

          {/* Background nebula effect */}
          <circle cx="25" cy="35" r="20" fill="url(#region-glow-0)" opacity="0.3">
            <animate attributeName="r" values="18;22;18" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="45" r="25" fill="url(#region-glow-1)" opacity="0.25">
            <animate attributeName="r" values="23;27;23" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="50" r="20" fill="url(#region-glow-2)" opacity="0.3">
            <animate attributeName="r" values="18;22;18" dur="4.5s" repeatCount="indefinite" />
          </circle>

          {/* Region glow gradients */}
          <defs>
            <radialGradient id="region-glow-0">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="region-glow-1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="region-glow-2">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connection lines */}
          {STAR_NODES.map(node =>
            node.connections.map(targetId => {
              const target = STAR_NODES.find(n => n.id === targetId)
              if (!target) return null

              const isHighlighted = isConnectionHighlighted(node.id, targetId)
              const isHovered = hoveredStar === node.id || hoveredStar === targetId

              return (
                <g key={`${node.id}-${targetId}`}>
                  {/* Base connection line */}
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isHighlighted
                      ? LEARNING_PATHS.find(p => p.id === selectedPath)?.color || '#fff'
                      : theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
                    }
                    strokeWidth={isHighlighted ? 0.6 : isHovered ? 0.4 : 0.2}
                    strokeDasharray={isHighlighted ? 'none' : '1,1'}
                    className="transition-all duration-300"
                  />

                  {/* Animated traveling particles for highlighted paths */}
                  {isHighlighted && (
                    <>
                      <circle r="0.6" fill={LEARNING_PATHS.find(p => p.id === selectedPath)?.color || '#fff'}>
                        <animateMotion
                          dur="2s"
                          repeatCount="indefinite"
                          path={`M${node.x},${node.y} L${target.x},${target.y}`}
                        />
                      </circle>
                      <circle r="0.4" fill="#fff" opacity="0.8">
                        <animateMotion
                          dur="2s"
                          repeatCount="indefinite"
                          begin="0.5s"
                          path={`M${node.x},${node.y} L${target.x},${target.y}`}
                        />
                      </circle>
                    </>
                  )}
                </g>
              )
            })
          )}

          {/* Star nodes */}
          {STAR_NODES.map(node => {
            const size = getStarSize(node.size)
            const isHovered = hoveredStar === node.id
            const isInPath = highlightedNodes.includes(node.id)
            const opacity = getTwinkle(node.id, isHovered || isInPath ? 1 : 0.7)

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredStar(node.id)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => onSelectDemo(node.id)}
              >
                {/* Outer glow ring */}
                <circle
                  r={size * 0.15 + (isHovered ? 2 : 0)}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="0.3"
                  opacity={opacity * 0.5}
                  className="transition-all duration-200"
                >
                  {node.size === 'large' && (
                    <animate
                      attributeName="r"
                      values={`${size * 0.15};${size * 0.2};${size * 0.15}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>

                {/* Main star body */}
                <circle
                  r={size * 0.1 * (isHovered ? 1.3 : 1)}
                  fill={theme === 'dark' ? '#0f172a' : '#ffffff'}
                  stroke={node.color}
                  strokeWidth={isHovered || isInPath ? 0.5 : 0.3}
                  filter={isHovered ? 'url(#star-glow)' : 'none'}
                  opacity={opacity}
                  className="transition-all duration-200"
                />

                {/* Inner bright core */}
                <circle
                  r={size * 0.05 * (isHovered ? 1.2 : 1)}
                  fill={node.color}
                  opacity={opacity}
                  className="transition-all duration-200"
                />

                {/* Star sparkle effect */}
                {(isHovered || node.size === 'large') && (
                  <>
                    <line
                      x1={-size * 0.08}
                      y1="0"
                      x2={size * 0.08}
                      y2="0"
                      stroke={node.color}
                      strokeWidth="0.15"
                      opacity={opacity * 0.6}
                    />
                    <line
                      x1="0"
                      y1={-size * 0.08}
                      x2="0"
                      y2={size * 0.08}
                      stroke={node.color}
                      strokeWidth="0.15"
                      opacity={opacity * 0.6}
                    />
                  </>
                )}

                {/* Label */}
                {(isHovered || node.size === 'large') && (
                  <text
                    y={size * 0.18 + 3}
                    textAnchor="middle"
                    fill={theme === 'dark' ? '#e2e8f0' : '#334155'}
                    fontSize="2.5"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    className="pointer-events-none select-none"
                    opacity={isHovered ? 1 : 0.8}
                  >
                    {t(node.labelKey, node.label)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Floating cosmic dust particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={`dust-${i}`}
              cx={5 + (i * 17) % 90}
              cy={10 + (i * 23) % 80}
              r={0.3 + Math.sin(time * 0.02 + i) * 0.2}
              fill={POLARIZATION_COLORS[i % 4]}
              opacity={0.2 + Math.sin(time * 0.03 + i * 0.5) * 0.15}
            />
          ))}
        </svg>

        {/* Hover tooltip */}
        {hoveredStar && (
          <div
            className={cn(
              "absolute px-2 py-1 rounded text-xs pointer-events-none",
              "animate-in fade-in-0 zoom-in-95 duration-150",
              theme === 'dark'
                ? "bg-slate-800 border border-slate-700 text-white"
                : "bg-white border border-slate-200 text-slate-900 shadow-lg"
            )}
            style={{
              left: `${STAR_NODES.find(n => n.id === hoveredStar)?.x || 50}%`,
              top: `${(STAR_NODES.find(n => n.id === hoveredStar)?.y || 50) - 8}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <span className="flex items-center gap-1">
              <Play className="w-2.5 h-2.5" />
              {t('knowledgeMap.clickToExplore', '点击探索')}
            </span>
          </div>
        )}

        {/* Legend */}
        <div className={cn(
          "absolute bottom-2 left-2 px-2 py-1.5 rounded-lg text-[10px]",
          theme === 'dark' ? "bg-slate-900/80" : "bg-white/90"
        )}>
          <div className="flex items-center gap-3">
            {EXHIBITION_HALLS.slice(0, 3).map((hall) => (
              <div key={hall.id} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: hall.color }}
                />
                <span className={cn(
                  theme === 'dark' ? "text-slate-400" : "text-slate-500"
                )}>
                  {t(hall.titleKey).slice(0, 4)}
                </span>
              </div>
            ))}
            <span className={cn(
              theme === 'dark' ? "text-slate-500" : "text-slate-400"
            )}>...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Gallery Hero Component
interface GalleryHeroProps {
  onSelectDemo: (demoId: string) => void
  onSelectUnit: (unit: number) => void
  isCompact?: boolean
}

export function GalleryHero({ onSelectDemo, onSelectUnit, isCompact = false }: GalleryHeroProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [hoveredHall, setHoveredHall] = useState<string | null>(null)

  const handleSelectHall = (hallId: string) => {
    const hall = EXHIBITION_HALLS.find(h => h.id === hallId)
    if (hall) {
      onSelectUnit(hall.unit)
      // Navigate to the first demo of this unit
      if (hall.demos.length > 0) {
        onSelectDemo(hall.demos[0])
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Polarization Visualization */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          isCompact ? "h-40" : "h-48",
          theme === 'dark'
            ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"
            : "bg-gradient-to-br from-slate-100 via-white to-slate-50"
        )}
      >
        {/* Animated background */}
        <AnimatedPolarizationVisual />

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Badge */}
          <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-medium",
            theme === 'dark'
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              : "bg-cyan-500/10 text-cyan-600 border border-cyan-500/30"
          )}>
            <div className="flex gap-0.5">
              {POLARIZATION_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color, opacity: 0.8 }}
                />
              ))}
            </div>
            <span>{t('museum.badge', '偏振演示馆')}</span>
          </div>

          {/* Title */}
          <h1 className={cn(
            "text-2xl md:text-3xl font-bold mb-2",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.title', '探索光的奥秘')}
          </h1>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            {[
              { value: '6', label: t('museum.stats.halls', '展厅') },
              { value: '17+', label: t('museum.stats.demos', '演示') },
              { value: '3', label: t('museum.stats.levels', '难度') }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className={cn(
                  "font-bold",
                  theme === 'dark' ? "text-cyan-400" : "text-cyan-600"
                )}>
                  {stat.value}
                </span>
                <span className={cn(
                  theme === 'dark' ? "text-slate-400" : "text-slate-500"
                )}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exhibition Halls Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn(
            "text-lg font-semibold",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.halls.title', '展厅导览')}
          </h2>
          <span className={cn(
            "text-xs",
            theme === 'dark' ? "text-slate-500" : "text-slate-400"
          )}>
            {t('museum.halls.selectHint', '选择展厅开始探索')}
          </span>
        </div>

        {/* Halls Grid */}
        <div className={cn(
          "grid gap-3",
          isCompact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {EXHIBITION_HALLS.map((hall) => (
            <ExhibitionHallCard
              key={hall.id}
              hall={hall}
              isHovered={hoveredHall === hall.id}
              onHover={setHoveredHall}
              onClick={() => handleSelectHall(hall.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Start CTA */}
      <div className={cn(
        "rounded-xl p-4 flex items-center justify-between",
        theme === 'dark'
          ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
          : "bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200"
      )}>
        <div>
          <h3 className={cn(
            "font-medium mb-1",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            {t('museum.quickStart.title', '快速开始')}
          </h3>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            {t('museum.quickStart.description', '从电磁波基础开始你的偏振之旅')}
          </p>
        </div>
        <button
          onClick={() => onSelectDemo('em-wave')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm",
            "transition-all duration-200 hover:scale-105",
            "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
            "shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
          )}
        >
          <Play className="w-4 h-4" />
          {t('museum.cta', '开始探索')}
        </button>
      </div>

      {/* Knowledge Star Map - Interactive constellation visualization */}
      <KnowledgeStarMap onSelectDemo={onSelectDemo} />
    </div>
  )
}

export default GalleryHero
