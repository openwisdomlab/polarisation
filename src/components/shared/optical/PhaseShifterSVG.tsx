/**
 * PhaseShifterSVG - 相位延迟器SVG组件
 * Introduces phase delay without changing polarization
 * Visual: Circular element with phase wave indicator
 */

import { useEffect } from 'react'
import type { InteractiveSVGProps } from './types'

export interface PhaseShifterSVGProps extends InteractiveSVGProps {
  phaseShift: number // Phase shift in degrees (0-360)
  onAdjust?: (delta: number) => void
  size?: number
}

export function PhaseShifterSVG({
  x,
  y,
  phaseShift,
  locked,
  selected,
  onClick,
  onAdjust,
  isDark = true,
  size = 1,
}: PhaseShifterSVGProps) {
  // Color based on phase shift amount
  const phaseNorm = (phaseShift % 360) / 360
  const color = `hsl(${180 + phaseNorm * 180}, 80%, 50%)` // Cyan to magenta gradient

  // Keyboard controls
  useEffect(() => {
    if (!selected || locked || !onAdjust) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onAdjust(-15)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onAdjust(15)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, locked, onAdjust])

  // Calculate wave path based on phase
  const waveRadius = 2.5
  const endAngle = (phaseShift / 180) * Math.PI
  const wavePath = `M ${-waveRadius} 0 A ${waveRadius} ${waveRadius} 0 ${phaseShift > 180 ? 1 : 0} 1 ${waveRadius * Math.cos(endAngle)} ${-waveRadius * Math.sin(endAngle)}`

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
      {/* Main circular body */}
      <circle
        r="4"
        fill={isDark ? '#1e3a5f' : '#dbeafe'}
        stroke={color}
        strokeWidth="0.5"
      />
      {/* Phase arc indicator */}
      <path
        d={wavePath}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle r="0.8" fill={color} />
      {/* Phase wave animation */}
      <g>
        <circle r="2" fill="none" stroke={color} strokeWidth="0.3" opacity="0.5">
          <animate
            attributeName="r"
            values="1;3.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
      {/* Locked indicator */}
      {locked && (
        <text x="4" y="-4" fontSize="2.5">
          🔒
        </text>
      )}
      {/* Label */}
      <text y="7" textAnchor="middle" fill={color} fontSize="1.6" fontWeight="bold">
        φ={Math.round(phaseShift)}°
      </text>
      {/* Symbol */}
      <text y="-5.5" textAnchor="middle" fill={color} fontSize="2.5">
        Δφ
      </text>
    </g>
  )
}
