/**
 * Optical Components Types - 光学元件共享类型定义
 */

import type { Direction2D } from '@/lib/opticsPhysics'

// 光学元件类型
export type OpticalComponentType =
  | 'emitter'
  | 'polarizer'
  | 'mirror'
  | 'splitter'
  | 'rotator'
  | 'sensor'

// 光学元件基础接口
export interface OpticalComponent {
  id: string
  type: OpticalComponentType
  x: number                      // 位置百分比 (0-100)
  y: number                      // 位置百分比 (0-100)
  angle: number                  // 旋转角度
  polarizationAngle?: number     // 偏振角度 (用于polarizer和emitter)
  rotationAmount?: number        // 旋转量 (用于rotator: 45或90)
  locked: boolean                // 是否锁定
  direction?: Direction2D        // 发射方向 (用于emitter)
  requiredIntensity?: number     // 所需强度 (用于sensor)
  requiredPolarization?: number  // 所需偏振 (用于sensor)
}

// 光束段
export interface LightBeamSegment {
  startX: number
  startY: number
  endX: number
  endY: number
  intensity: number
  polarization: number
  direction: Direction2D
}

// 传感器状态
export interface SensorState {
  id: string
  activated: boolean
  receivedIntensity: number
  receivedPolarization: number | null
}

// SVG组件通用Props
export interface BaseSVGProps {
  x: number
  y: number
  isDark?: boolean
}

// 交互式组件Props
export interface InteractiveSVGProps extends BaseSVGProps {
  locked: boolean
  selected: boolean
  onClick: () => void
}

// 偏振色彩函数类型
export type GetPolarizationColorFn = (angle: number) => string
