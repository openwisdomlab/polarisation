/**
 * PolarizerSVG - 偏振片元件SVG组件
 * 支持选中、旋转交互
 */

import { useEffect } from 'react'
import type { InteractiveSVGProps, GetPolarizationColorFn } from './types'

export interface PolarizerSVGProps extends InteractiveSVGProps {
  polarizationAngle: number
  onRotate: (delta: number) => void
  getPolarizationColor?: GetPolarizationColorFn
  rotationStep?: number // 旋转步长，默认15度
  size?: number
}

export function PolarizerSVG({
  x,
  y,
  polarizationAngle,
  locked,
  selected,
  onClick,
  onRotate,
  getPolarizationColor,
  isDark = true,
  rotationStep = 15,
  size = 1,
}: PolarizerSVGProps) {
  // 默认色彩函数
  const getColor = getPolarizationColor || ((angle: number) => {
    const normalizedAngle = ((angle % 180) + 180) % 180
    if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'
    if (normalizedAngle < 67.5) return '#ffaa00'
    if (normalizedAngle < 112.5) return '#44ff44'
    return '#4444ff'
  })

  const color = getColor(polarizationAngle)
  const bgColor = isDark ? '#1e293b' : '#e2e8f0'

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
        <rect
          x="-5.5"
          y="-5.5"
          width="11"
          height="11"
          rx="2"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="0.5"
          strokeDasharray="2,1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;6"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      )}
      {/* 背景方块 */}
      <rect
        x="-4"
        y="-4"
        width="8"
        height="8"
        rx="1"
        fill={bgColor}
        stroke={locked ? '#64748b' : color}
        strokeWidth="0.4"
      />
      {/* 栅格线 (偏振方向指示) */}
      <g transform={`rotate(${polarizationAngle})`}>
        {[-2.5, -1.25, 0, 1.25, 2.5].map((offset, i) => (
          <line
            key={i}
            x1={offset}
            y1="-3"
            x2={offset}
            y2="3"
            stroke={color}
            strokeWidth="0.3"
            opacity="0.7"
          />
        ))}
      </g>
      {/* 锁定指示 */}
      {locked && (
        <text x="3" y="-3" fontSize="2.5">
          🔒
        </text>
      )}
      {/* 角度标签 */}
      <text y="7" textAnchor="middle" fill={color} fontSize="2" fontWeight="bold">
        {polarizationAngle}°
      </text>
      {/* 旋转按钮 (选中时显示) */}
      {selected && !locked && (
        <>
          <g
            transform="translate(-8, 0)"
            onClick={(e) => {
              e.stopPropagation()
              onRotate(-rotationStep)
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle r="2.5" fill="#22d3ee" opacity="0.8" />
            <text textAnchor="middle" y="0.8" fill="white" fontSize="3" fontWeight="bold">
              -
            </text>
          </g>
          <g
            transform="translate(8, 0)"
            onClick={(e) => {
              e.stopPropagation()
              onRotate(rotationStep)
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle r="2.5" fill="#22d3ee" opacity="0.8" />
            <text textAnchor="middle" y="0.8" fill="white" fontSize="3" fontWeight="bold">
              +
            </text>
          </g>
        </>
      )}
    </g>
  )
}
