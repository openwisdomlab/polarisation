/**
 * SplitterSVG - 双折射分光器(方解石晶体)SVG组件
 * 将入射光分为o光(0°偏振)和e光(90°偏振)
 */

import type { BaseSVGProps } from './types'

export interface SplitterSVGProps extends BaseSVGProps {
  showLabels?: boolean
  size?: number
}

export function SplitterSVG({
  x,
  y,
  isDark = true,
  showLabels = true,
  size = 1,
}: SplitterSVGProps) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {/* 菱形晶体 */}
      <polygon
        points="0,-4 4,0 0,4 -4,0"
        fill={isDark ? '#0e7490' : '#06b6d4'}
        opacity="0.7"
        stroke="#22d3ee"
        strokeWidth="0.4"
      />
      {/* o光方向指示 (红色, 继续直行) */}
      <line x1="1" y1="0" x2="5" y2="0" stroke="#ff4444" strokeWidth="0.4" opacity="0.8" />
      {/* e光方向指示 (绿色, 向上偏折) */}
      <line x1="0" y1="-1" x2="0" y2="-5" stroke="#44ff44" strokeWidth="0.4" opacity="0.8" />
      {/* 内部光学结构线 */}
      <line x1="-2" y1="-2" x2="2" y2="2" stroke="#22d3ee" strokeWidth="0.2" opacity="0.5" />
      <line x1="-2" y1="2" x2="2" y2="-2" stroke="#22d3ee" strokeWidth="0.2" opacity="0.5" />
      {/* 标签 */}
      {showLabels && (
        <text y="7" textAnchor="middle" fill="#22d3ee" fontSize="2">
          Splitter
        </text>
      )}
    </g>
  )
}
