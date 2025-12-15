/**
 * QuarterWavePlateSVG - λ/4 波片SVG组件
 * Converts linear ↔ circular polarization
 * Visual: Diamond shape with circular indicator
 */

import { useEffect } from 'react'
import type { InteractiveSVGProps } from './types'

export interface QuarterWavePlateSVGProps extends InteractiveSVGProps {
  angle: number // Fast axis angle
  onRotate?: (delta: number) => void
  size?: number
}

export function QuarterWavePlateSVG({
  x,
  y,
  angle,
  locked,
  selected,
  onClick,
  onRotate,
  isDark = true,
  size = 1,
}: QuarterWavePlateSVGProps) {
  const color = '#06b6d4' // Cyan for QWP

  // Keyboard controls
  useEffect(() => {
    if (!selected || locked || !onRotate) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onRotate(-15)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onRotate(15)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, locked, onRotate])

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${size})`}
      style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
      onClick={onClick}
    >
      {/* Selection indicator */}
      {selected && !locked && (
        <circle r="6" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2,1">
          <animate
            attributeName="stroke-dashoffset"
            values="0;6"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* Diamond main body rotated by fast axis angle */}
      <g transform={`rotate(${angle})`}>
        <rect
          x="-3.5"
          y="-3.5"
          width="7"
          height="7"
          rx="0.5"
          transform="rotate(45)"
          fill={isDark ? '#164e63' : '#e0f2fe'}
          stroke={color}
          strokeWidth="0.5"
        />
        {/* λ/4 indicator - quarter circle */}
        <path
          d="M 0 -2.5 A 2.5 2.5 0 0 1 2.5 0"
          fill="none"
          stroke={color}
          strokeWidth="0.6"
        />
        {/* Fast axis indicator line */}
        <line x1="-3" y1="0" x2="3" y2="0" stroke={color} strokeWidth="0.4" strokeDasharray="1,0.5" />
      </g>
      {/* Locked indicator */}
      {locked && (
        <text x="4" y="-4" fontSize="2.5">
          🔒
        </text>
      )}
      {/* Label */}
      <text y="8" textAnchor="middle" fill={color} fontSize="1.8" fontWeight="bold">
        λ/4
      </text>
      {/* Angle display */}
      <text y="-6" textAnchor="middle" fill={color} fontSize="1.5">
        {Math.round(angle)}°
      </text>
    </g>
  )
}
