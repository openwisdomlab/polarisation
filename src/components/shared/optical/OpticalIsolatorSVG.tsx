/**
 * OpticalIsolatorSVG - 光学隔离器SVG组件
 * One-way light valve using Faraday rotation
 * Visual: Asymmetric element with directional arrow
 */

import type { BaseSVGProps } from './types'
import type { Direction2D } from '@/lib/opticsPhysics'

export interface OpticalIsolatorSVGProps extends BaseSVGProps {
  allowedDirection: Direction2D
  faradayRotation?: number // degrees, default 45
  isBlocking?: boolean // True when blocking reverse direction
  isAnimating?: boolean
  size?: number
}

const directionToAngle: Record<Direction2D, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
}

export function OpticalIsolatorSVG({
  x,
  y,
  allowedDirection,
  faradayRotation = 45,
  isBlocking = false,
  isAnimating = true,
  isDark = true,
  size = 1,
}: OpticalIsolatorSVGProps) {
  const color = '#ec4899' // Pink
  const blockColor = '#ef4444' // Red when blocking
  const displayColor = isBlocking ? blockColor : color
  const rotationAngle = directionToAngle[allowedDirection]

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* Blocking flash effect */}
      {isBlocking && isAnimating && (
        <circle r="6" fill={blockColor} opacity="0.4">
          <animate
            attributeName="opacity"
            values="0.4;0;0.4"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      <g transform={`rotate(${rotationAngle})`}>
        {/* Main body - asymmetric trapezoid */}
        <polygon
          points="-3,-3.5 3,-3.5 4,3.5 -4,3.5"
          fill={isDark ? '#4a044e' : '#fce7f3'}
          stroke={displayColor}
          strokeWidth="0.5"
        />
        {/* Faraday rotation indicator */}
        <g transform="translate(0, 0)">
          {/* Magnetic field lines */}
          <path
            d="M -2 -1.5 Q 0 -2.5 2 -1.5"
            fill="none"
            stroke={displayColor}
            strokeWidth="0.3"
            opacity="0.6"
          />
          <path
            d="M -1.5 0 Q 0 -1 1.5 0"
            fill="none"
            stroke={displayColor}
            strokeWidth="0.3"
            opacity="0.6"
          />
          <path
            d="M -2 1.5 Q 0 0.5 2 1.5"
            fill="none"
            stroke={displayColor}
            strokeWidth="0.3"
            opacity="0.6"
          />
        </g>
        {/* Direction arrow */}
        <path
          d="M -2 0 L 2 0 M 1 -1 L 2 0 L 1 1"
          fill="none"
          stroke={displayColor}
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        {/* Block indicator (X) on back side */}
        <g transform="translate(0, 2.5)" opacity="0.5">
          <path d="M -0.8 -0.8 L 0.8 0.8 M -0.8 0.8 L 0.8 -0.8"
            stroke={blockColor}
            strokeWidth="0.5"
          />
        </g>
      </g>
      {/* Label */}
      <text y="8" textAnchor="middle" fill={displayColor} fontSize="1.5">
        {faradayRotation}° Isolator
      </text>
      {/* One-way symbol */}
      <text y="-5.5" textAnchor="middle" fill={displayColor} fontSize="2">
        ⊳
      </text>
      {/* Blocking indicator */}
      {isBlocking && (
        <text x="4" y="-3" fill={blockColor} fontSize="2">
          ✗
        </text>
      )}
    </g>
  )
}
