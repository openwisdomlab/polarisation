/**
 * SensorSVG - 光传感器元件SVG组件
 * 显示激活状态、接收光强和偏振要求
 */

import type { BaseSVGProps, SensorState, GetPolarizationColorFn } from './types'

export interface SensorSVGProps extends BaseSVGProps {
  sensorState: SensorState | undefined
  requiredIntensity: number
  requiredPolarization?: number
  isAnimating?: boolean
  getPolarizationColor?: GetPolarizationColorFn
  size?: number
}

export function SensorSVG({
  x,
  y,
  sensorState,
  requiredIntensity,
  requiredPolarization,
  isDark = true,
  isAnimating = true,
  getPolarizationColor,
  size = 1,
}: SensorSVGProps) {
  const activated = sensorState?.activated ?? false
  const intensity = sensorState?.receivedIntensity ?? 0

  // 默认色彩函数
  const getColor = getPolarizationColor || ((angle: number) => {
    const normalizedAngle = ((angle % 180) + 180) % 180
    if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'
    if (normalizedAngle < 67.5) return '#ffaa00'
    if (normalizedAngle < 112.5) return '#44ff44'
    return '#4444ff'
  })

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* 激活时的外发光 */}
      {activated && (
        <circle r="6" fill="#22c55e" opacity="0.3">
          {isAnimating && (
            <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
          )}
        </circle>
      )}
      {/* 主体外壳 */}
      <rect
        x="-4"
        y="-4"
        width="8"
        height="8"
        rx="1.5"
        fill={activated ? '#166534' : isDark ? '#1e293b' : '#e2e8f0'}
        stroke={activated ? '#22c55e' : '#64748b'}
        strokeWidth="0.5"
      />
      {/* 感应透镜 */}
      <circle
        r="2.5"
        fill={activated ? '#4ade80' : isDark ? '#334155' : '#cbd5e1'}
        stroke={activated ? '#86efac' : '#94a3b8'}
        strokeWidth="0.3"
      >
        {activated && isAnimating && (
          <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" repeatCount="indefinite" />
        )}
      </circle>
      {/* 状态LED */}
      <circle cx="3" cy="-3" r="0.8" fill={activated ? '#22c55e' : '#ef4444'}>
        {isAnimating && (
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
      {/* 所需强度标签 */}
      <text y="7" textAnchor="middle" fill={activated ? '#22c55e' : '#94a3b8'} fontSize="1.8">
        ≥{requiredIntensity}%
      </text>
      {/* 接收强度显示 */}
      <text
        y="-6"
        textAnchor="middle"
        fill={activated ? '#22c55e' : '#f97316'}
        fontSize="2"
        fontWeight="bold"
      >
        {Math.round(intensity)}%
      </text>
      {/* 所需偏振角度指示 */}
      {requiredPolarization !== undefined && (
        <circle
          cx="-3"
          cy="-3"
          r="1"
          fill={getColor(requiredPolarization)}
          opacity="0.8"
        />
      )}
    </g>
  )
}
