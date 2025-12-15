/**
 * HalfWavePlateSVG - λ/2 波片SVG组件
 * Flips polarization about fast axis
 * Visual: Elongated hexagon with half-circle indicator
 */

import { useEffect } from 'react'
import type { InteractiveSVGProps } from './types'

export interface HalfWavePlateSVGProps extends InteractiveSVGProps {
  angle: number // Fast axis angle
  onRotate?: (delta: number) => void
  size?: number
}

export function HalfWavePlateSVG({
  x,
  y,
  angle,
  locked,
  selected,
  onClick,
  onRotate,
  isDark = true,
  size = 1,
}: HalfWavePlateSVGProps) {
  const color = '#8b5cf6' // Purple for HWP

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
      {/* Hexagonal main body rotated by fast axis angle */}
      <g transform={`rotate(${angle})`}>
        <polygon
          points="0,-4 3.5,-2 3.5,2 0,4 -3.5,2 -3.5,-2"
          fill={isDark ? '#2e1065' : '#f3e8ff'}
          stroke={color}
          strokeWidth="0.5"
        />
        {/* λ/2 indicator - half circle */}
        <path
          d="M -2 0 A 2 2 0 0 1 2 0"
          fill="none"
          stroke={color}
          strokeWidth="0.6"
        />
        {/* Fast axis indicator line */}
        <line x1="-3" y1="0" x2="3" y2="0" stroke={color} strokeWidth="0.4" strokeDasharray="1,0.5" />
        {/* Flip arrows */}
        <path d="M 0 -2 L -0.6 -1 M 0 -2 L 0.6 -1" stroke={color} strokeWidth="0.4" fill="none" />
        <path d="M 0 2 L -0.6 1 M 0 2 L 0.6 1" stroke={color} strokeWidth="0.4" fill="none" />
      </g>
      {/* Locked indicator */}
      {locked && (
        <text x="4" y="-4" fontSize="2.5">
          🔒
        </text>
      )}
      {/* Label */}
      <text y="8" textAnchor="middle" fill={color} fontSize="1.8" fontWeight="bold">
        λ/2
      </text>
      {/* Angle display */}
      <text y="-6" textAnchor="middle" fill={color} fontSize="1.5">
        {Math.round(angle)}°
      </text>
    </g>
  )
}
