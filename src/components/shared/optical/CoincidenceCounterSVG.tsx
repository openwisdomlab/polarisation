/**
 * CoincidenceCounterSVG - 符合计数器SVG组件
 * Requires multiple beams with specific phase relationship to activate
 * Visual: Rectangular element with dual input indicators and phase matcher
 */

import type { BaseSVGProps } from './types'

export interface CoincidenceCounterSVGProps extends BaseSVGProps {
  requiredBeamCount?: number
  requiredPhaseDifference?: number // in degrees
  currentBeamCount?: number
  isMatched?: boolean // Whether phase conditions are met
  isAnimating?: boolean
  size?: number
}

export function CoincidenceCounterSVG({
  x,
  y,
  requiredBeamCount = 2,
  requiredPhaseDifference = 0,
  currentBeamCount = 0,
  isMatched = false,
  isAnimating = true,
  isDark = true,
  size = 1,
}: CoincidenceCounterSVGProps) {
  const baseColor = '#f59e0b' // Amber
  const activeColor = '#22c55e' // Green when matched
  const color = isMatched ? activeColor : baseColor

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* Matched glow */}
      {isMatched && (
        <rect x="-5.5" y="-5.5" width="11" height="11" rx="2" fill={activeColor} opacity="0.3">
          {isAnimating && (
            <animate
              attributeName="opacity"
              values="0.2;0.4;0.2"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </rect>
      )}
      {/* Main body */}
      <rect
        x="-4.5"
        y="-4.5"
        width="9"
        height="9"
        rx="1.5"
        fill={isMatched ? '#166534' : isDark ? '#451a03' : '#fef3c7'}
        stroke={color}
        strokeWidth="0.5"
      />
      {/* Dual input indicators */}
      <g transform="translate(0, -2)">
        {/* Input 1 */}
        <circle cx="-2" cy="0" r="1.2"
          fill={currentBeamCount >= 1 ? color : isDark ? '#1c1917' : '#e5e7eb'}
          stroke={color}
          strokeWidth="0.3"
        />
        {/* Input 2 */}
        <circle cx="2" cy="0" r="1.2"
          fill={currentBeamCount >= 2 ? color : isDark ? '#1c1917' : '#e5e7eb'}
          stroke={color}
          strokeWidth="0.3"
        />
        {/* Phase connection indicator */}
        <path
          d={`M -0.8 0 Q 0 ${requiredPhaseDifference === 0 ? -0.8 : 0.8} 0.8 0`}
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          strokeDasharray={isMatched ? 'none' : '0.5,0.5'}
        />
      </g>
      {/* Phase difference display */}
      <text y="1.5" textAnchor="middle" fill={color} fontSize="1.5" fontWeight="bold">
        Δφ={requiredPhaseDifference}°
      </text>
      {/* Status LED */}
      <circle cx="3" cy="-3" r="0.8" fill={isMatched ? '#22c55e' : '#ef4444'}>
        {isAnimating && (
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      {/* Beam count indicator */}
      <text y="7" textAnchor="middle" fill={color} fontSize="1.4">
        {currentBeamCount}/{requiredBeamCount} beams
      </text>
      {/* Symbol */}
      <text x="-3" y="-2.5" fill={color} fontSize="2">
        ⊗
      </text>
    </g>
  )
}
