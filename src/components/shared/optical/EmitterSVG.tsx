/**
 * EmitterSVG - 光源元件SVG组件
 * 可在2D游戏和教学Demo中复用
 */

import type { Direction2D } from '@/lib/opticsPhysics'
import type { BaseSVGProps, GetPolarizationColorFn } from './types'

export interface EmitterSVGProps extends BaseSVGProps {
  polarization: number
  direction: Direction2D
  isAnimating?: boolean
  showPolarization?: boolean
  getPolarizationColor?: GetPolarizationColorFn
  size?: number // 缩放大小, 默认1
}

// 方向旋转映射
const DIRECTION_ROTATION: Record<Direction2D, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
}

export function EmitterSVG({
  x,
  y,
  polarization,
  direction,
  isAnimating = true,
  showPolarization = true,
  getPolarizationColor,
  size = 1,
}: EmitterSVGProps) {
  // 默认色彩函数
  const getColor = getPolarizationColor || ((angle: number) => {
    const normalizedAngle = ((angle % 180) + 180) % 180
    if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'
    if (normalizedAngle < 67.5) return '#ffaa00'
    if (normalizedAngle < 112.5) return '#44ff44'
    return '#4444ff'
  })

  const color = showPolarization ? getColor(polarization) : '#ffdd00'
  const directionRotation = DIRECTION_ROTATION[direction]

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* 外部光晕 */}
      <circle r="5" fill={color} opacity={isAnimating ? 0.3 : 0.2}>
        {isAnimating && (
          <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
        )}
      </circle>
      {/* 主体外壳 */}
      <circle r="3.5" fill="#1a1a2e" stroke={color} strokeWidth="0.6" />
      {/* 发光核心 */}
      <circle r="2" fill={color}>
        {isAnimating && (
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
      {/* 方向指示箭头 */}
      <g transform={`rotate(${directionRotation})`}>
        <path d="M 0 2.5 L 0 5 M -1 4 L 0 5 L 1 4" stroke={color} strokeWidth="0.5" fill="none" />
      </g>
      {/* 偏振角度标签 */}
      <text y="-6" textAnchor="middle" fill={color} fontSize="2.5" fontWeight="bold">
        {polarization}°
      </text>
    </g>
  )
}
