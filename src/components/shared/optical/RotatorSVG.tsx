/**
 * RotatorSVG - 波片/旋光器元件SVG组件
 * 支持45°和90°两种旋转量
 */

import { useEffect } from 'react'
import type { InteractiveSVGProps } from './types'

export interface RotatorSVGProps extends InteractiveSVGProps {
  rotationAmount: number // 45 或 90
  onToggle: () => void   // 切换旋转量
  size?: number
}

export function RotatorSVG({
  x,
  y,
  rotationAmount,
  locked,
  selected,
  onClick,
  onToggle,
  isDark = true,
  size = 1,
}: RotatorSVGProps) {
  // 根据旋转量设置颜色
  const color = rotationAmount === 90 ? '#a855f7' : '#ec4899'

  // 键盘控制
  useEffect(() => {
    if (!selected || locked) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        onToggle()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, locked, onToggle])

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${size})`}
      style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
      onClick={onClick}
    >
      {/* 选中指示环 */}
      {selected && !locked && (
        <circle r="5.5" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2,1">
          <animate
            attributeName="stroke-dashoffset"
            values="0;6"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* 六边形主体 */}
      <polygon
        points="0,-4 3.5,-2 3.5,2 0,4 -3.5,2 -3.5,-2"
        fill={isDark ? '#2d1b4e' : '#f3e8ff'}
        stroke={color}
        strokeWidth="0.5"
      />
      {/* 螺旋指示符 */}
      <path
        d={
          rotationAmount === 90
            ? 'M -2 0 Q -2 -2 0 -2 Q 2 -2 2 0 Q 2 2 0 2'
            : 'M -1.5 0 Q -1.5 -1.5 0 -1.5 Q 1.5 -1.5 1.5 0'
        }
        fill="none"
        stroke={color}
        strokeWidth="0.5"
      />
      {/* 箭头指示 */}
      <g transform={`rotate(${rotationAmount === 90 ? 180 : 90})`}>
        <path d="M 0 2 L -0.8 1 M 0 2 L 0.8 1" stroke={color} strokeWidth="0.4" fill="none" />
      </g>
      {/* 锁定指示 */}
      {locked && (
        <text x="3" y="-3" fontSize="2.5">
          🔒
        </text>
      )}
      {/* 旋转量标签 */}
      <text y="7" textAnchor="middle" fill={color} fontSize="2" fontWeight="bold">
        {rotationAmount}°
      </text>
      {/* 切换按钮 */}
      {selected && !locked && (
        <g
          transform="translate(7, 0)"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          style={{ cursor: 'pointer' }}
        >
          <circle r="2.5" fill={color} opacity="0.8" />
          <text textAnchor="middle" y="0.8" fill="white" fontSize="2">
            ⟳
          </text>
        </g>
      )}
    </g>
  )
}
