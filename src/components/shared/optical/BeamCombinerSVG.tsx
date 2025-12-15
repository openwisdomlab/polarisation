/**
 * BeamCombinerSVG - 光束组合器SVG组件
 * Combines two beams coherently for interference
 * Visual: Y-shaped element with convergence point
 */

import type { BaseSVGProps } from './types'

export interface BeamCombinerSVGProps extends BaseSVGProps {
  angle?: number // Rotation angle
  linkedId?: string // ID of linked component
  isActive?: boolean // Whether beams are being combined
  size?: number
}

export function BeamCombinerSVG({
  x,
  y,
  angle = 0,
  linkedId,
  isActive = false,
  isDark = true,
  size = 1,
}: BeamCombinerSVGProps) {
  const color = '#10b981' // Emerald green
  const activeColor = '#34d399'

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${size})`}
    >
      {/* Active glow when combining */}
      {isActive && (
        <circle r="5" fill={activeColor} opacity="0.3">
          <animate
            attributeName="r"
            values="4;6;4"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      <g transform={`rotate(${angle})`}>
        {/* Main body - Y shape */}
        <polygon
          points="-3.5,-3 0,-1 3.5,-3 3,-3.5 0,0 -3,-3.5"
          fill={isDark ? '#064e3b' : '#d1fae5'}
          stroke={color}
          strokeWidth="0.5"
        />
        {/* Output arm */}
        <rect
          x="-1"
          y="0"
          width="2"
          height="4"
          fill={isDark ? '#064e3b' : '#d1fae5'}
          stroke={color}
          strokeWidth="0.5"
        />
        {/* Convergence point indicator */}
        <circle cy="0" r="1" fill={isActive ? activeColor : color}>
          {isActive && (
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="0.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        {/* Input arrows */}
        <path d="M -2.5 -2.5 L -1.5 -1.5" stroke={color} strokeWidth="0.4" />
        <path d="M 2.5 -2.5 L 1.5 -1.5" stroke={color} strokeWidth="0.4" />
        {/* Output arrow */}
        <path d="M 0 3 L 0 3.5 M -0.5 3 L 0 3.5 L 0.5 3" stroke={color} strokeWidth="0.4" fill="none" />
      </g>
      {/* Label */}
      <text y="8" textAnchor="middle" fill={color} fontSize="1.5">
        Combine
      </text>
      {/* Link indicator */}
      {linkedId && (
        <text y="-5" textAnchor="middle" fill={color} fontSize="1.2" opacity="0.7">
          ↔{linkedId.slice(0, 4)}
        </text>
      )}
    </g>
  )
}
