/**
 * MirrorSVG - 反射镜元件SVG组件
 * 支持45°和135°两种角度
 */

import { useEffect } from 'react'
import type { InteractiveSVGProps } from './types'

export interface MirrorSVGProps extends InteractiveSVGProps {
  angle: number
  onRotate: (delta: number) => void
  rotationStep?: number // 旋转步长，默认45度
  size?: number
}

export function MirrorSVG({
  x,
  y,
  angle,
  locked,
  selected,
  onClick,
  onRotate,
  isDark = true,
  rotationStep = 45,
  size = 1,
}: MirrorSVGProps) {
  // 键盘控制
  useEffect(() => {
    if (!selected || locked) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onRotate(-rotationStep)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onRotate(rotationStep)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, locked, onRotate, rotationStep])

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${size})`}
      style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
      onClick={onClick}
    >
      {/* 选中指示环 */}
      {selected && !locked && (
        <circle r="5" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2,1">
          <animate
            attributeName="stroke-dashoffset"
            values="0;6"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* 镜面主体 */}
      <g transform={`rotate(${angle})`}>
        {/* 反射面 */}
        <rect
          x="-4"
          y="-0.5"
          width="8"
          height="1"
          fill={isDark ? '#e2e8f0' : '#94a3b8'}
          rx="0.2"
        />
        {/* 高光效果 */}
        <rect x="-3.5" y="-0.3" width="7" height="0.3" fill="white" opacity="0.6" />
        {/* 镜子背面 */}
        <rect
          x="-4"
          y="0.5"
          width="8"
          height="0.4"
          fill={isDark ? '#64748b' : '#475569'}
          rx="0.1"
        />
      </g>
      {/* 锁定指示 */}
      {locked && (
        <text x="3" y="-3" fontSize="2.5">
          🔒
        </text>
      )}
      {/* 角度标签 */}
      <text y="6" textAnchor="middle" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="2">
        {angle}°
      </text>
      {/* 旋转按钮 */}
      {selected && !locked && (
        <>
          <g
            transform="translate(-7, 0)"
            onClick={(e) => {
              e.stopPropagation()
              onRotate(-rotationStep)
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle r="2" fill="#22d3ee" opacity="0.8" />
            <text textAnchor="middle" y="0.8" fill="white" fontSize="2.5">
              ↺
            </text>
          </g>
          <g
            transform="translate(7, 0)"
            onClick={(e) => {
              e.stopPropagation()
              onRotate(rotationStep)
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle r="2" fill="#22d3ee" opacity="0.8" />
            <text textAnchor="middle" y="0.8" fill="white" fontSize="2.5">
              ↻
            </text>
          </g>
        </>
      )}
    </g>
  )
}
