/**
 * CircularFilterSVG - 圆偏振滤波器SVG组件
 * Passes only RCP (right) or LCP (left) circular polarization
 * Visual: Circular element with spiral indicator
 */

import { useEffect } from 'react'
import type { InteractiveSVGProps } from './types'

export interface CircularFilterSVGProps extends InteractiveSVGProps {
  handedness: 'right' | 'left' // RCP or LCP
  onToggle?: () => void
  size?: number
}

export function CircularFilterSVG({
  x,
  y,
  handedness,
  locked,
  selected,
  onClick,
  onToggle,
  isDark = true,
  size = 1,
}: CircularFilterSVGProps) {
  // Color: right (RCP) = orange, left (LCP) = blue
  const color = handedness === 'right' ? '#f97316' : '#3b82f6'
  const bgColor = handedness === 'right'
    ? (isDark ? '#7c2d12' : '#ffedd5')
    : (isDark ? '#1e3a8a' : '#dbeafe')

  // Keyboard controls
  useEffect(() => {
    if (!selected || locked || !onToggle) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        onToggle()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, locked, onToggle])

  // Spiral path (direction based on handedness)
  const spiralDir = handedness === 'right' ? 1 : -1
  const spiral = `M 0 0
    Q ${spiralDir * 0.8} -0.8 ${spiralDir * 1.2} 0
    Q ${spiralDir * 1.6} 1.2 ${spiralDir * 2.2} 0.4
    Q ${spiralDir * 2.8} -0.8 ${spiralDir * 3} 0`

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
        fill={bgColor}
        stroke={color}
        strokeWidth="0.5"
      />
      {/* Spiral indicator */}
      <path
        d={spiral}
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        strokeLinecap="round"
        transform="translate(-1.5, 0)"
      />
      {/* Rotation arrow */}
      <g transform={`rotate(${handedness === 'right' ? 0 : 180})`}>
        <path
          d="M 2.5 -1 L 3.2 0 L 2.5 1"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          transform="translate(-1.5, 0)"
        />
      </g>
      {/* Animated rotation indicator */}
      <circle r="2.8" fill="none" stroke={color} strokeWidth="0.3" strokeDasharray="2,6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={handedness === 'right' ? '0' : '360'}
          to={handedness === 'right' ? '360' : '0'}
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Locked indicator */}
      {locked && (
        <text x="4" y="-4" fontSize="2.5">
          🔒
        </text>
      )}
      {/* Handedness label */}
      <text y="7" textAnchor="middle" fill={color} fontSize="1.8" fontWeight="bold">
        {handedness === 'right' ? 'RCP' : 'LCP'}
      </text>
      {/* Toggle button when selected */}
      {selected && !locked && onToggle && (
        <g
          transform="translate(6, 0)"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          style={{ cursor: 'pointer' }}
        >
          <circle r="2.5" fill={color} opacity="0.8" />
          <text textAnchor="middle" y="0.8" fill="white" fontSize="2">
            ⇄
          </text>
        </g>
      )}
    </g>
  )
}
