/**
 * useLightTracer - 光路追踪Hook
 * 计算光线在光学系统中的传播路径
 * 可在2D游戏和教学Demo中复用
 */

import { useMemo } from 'react'
import type { OpticalComponent, LightBeamSegment, SensorState } from '@/components/shared/optical/types'
import {
  type Direction2D,
  DIRECTION_2D_VECTORS,
  applyMalusLaw,
  splitByBirefringence,
  getMirrorReflection,
  getBirefringenceEDirection,
  rotatePolarization,
  checkSensorActivation,
  applyAttenuation,
  isAboveThreshold,
} from '@/lib/opticsPhysics'

// 光路追踪配置
export interface LightTracerConfig {
  maxDepth?: number           // 最大递归深度，默认20
  minIntensity?: number       // 最小光强阈值，默认1
  mirrorLoss?: number         // 镜面反射损耗，默认0.95
  splitterLoss?: number       // 分光器损耗，默认0.95
  rotatorLoss?: number        // 波片损耗，默认0.98
  alignmentTolerance?: number // 对齐容差（位置），默认8
  minDistance?: number        // 最小检测距离，默认2
}

const DEFAULT_CONFIG: Required<LightTracerConfig> = {
  maxDepth: 20,
  minIntensity: 1,
  mirrorLoss: 0.95,
  splitterLoss: 0.95,
  rotatorLoss: 0.98,
  alignmentTolerance: 8,
  minDistance: 2,
}

// 光路追踪结果
export interface LightTraceResult {
  beams: LightBeamSegment[]
  sensorStates: SensorState[]
}

// 组件状态获取函数类型
type GetComponentStateFn = (component: OpticalComponent) => OpticalComponent

/**
 * 光路追踪核心函数
 */
function traceLightPath(
  startX: number,
  startY: number,
  direction: Direction2D,
  intensity: number,
  polarization: number,
  beams: LightBeamSegment[],
  sensors: SensorState[],
  components: OpticalComponent[],
  getState: GetComponentStateFn,
  depth: number,
  config: Required<LightTracerConfig>
): void {
  // 递归终止条件
  if (depth > config.maxDepth || !isAboveThreshold(intensity, config.minIntensity)) {
    return
  }

  const { dx, dy } = DIRECTION_2D_VECTORS[direction]

  // 查找路径上的下一个元件
  let nextComponent: OpticalComponent | null = null
  let minDist = Infinity

  for (const comp of components) {
    if (comp.type === 'emitter') continue

    const state = getState(comp)

    // 计算到元件的向量
    const toCompX = state.x - startX
    const toCompY = state.y - startY

    // 元件必须在行进方向上
    if (dx !== 0 && Math.sign(toCompX) !== Math.sign(dx)) continue
    if (dy !== 0 && Math.sign(toCompY) !== Math.sign(dy)) continue

    // 检查对齐（水平/垂直方向）
    if (dx !== 0 && Math.abs(toCompY) > config.alignmentTolerance) continue
    if (dy !== 0 && Math.abs(toCompX) > config.alignmentTolerance) continue

    const dist = Math.abs(toCompX) + Math.abs(toCompY)
    if (dist < minDist && dist > config.minDistance) {
      minDist = dist
      nextComponent = comp
    }
  }

  // 计算光束终点
  let endX: number, endY: number

  if (nextComponent) {
    const state = getState(nextComponent)
    endX = state.x
    endY = state.y
  } else {
    // 光线到达边界
    if (dx > 0) endX = 100
    else if (dx < 0) endX = 0
    else endX = startX

    if (dy > 0) endY = 100
    else if (dy < 0) endY = 0
    else endY = startY
  }

  // 添加光束段
  beams.push({
    startX,
    startY,
    endX,
    endY,
    intensity,
    polarization,
    direction,
  })

  if (!nextComponent) return

  const compState = getState(nextComponent)

  // 根据元件类型处理光线
  switch (nextComponent.type) {
    case 'polarizer': {
      const filterAngle = compState.polarizationAngle ?? 0
      const newIntensity = applyMalusLaw(intensity, polarization, filterAngle)

      if (isAboveThreshold(newIntensity, config.minIntensity)) {
        traceLightPath(
          endX, endY, direction,
          newIntensity, filterAngle,
          beams, sensors, components, getState,
          depth + 1, config
        )
      }
      break
    }

    case 'mirror': {
      const mirrorAngle = compState.angle ?? 45
      const reflectedDir = getMirrorReflection(direction, mirrorAngle)

      if (reflectedDir) {
        const newIntensity = applyAttenuation(intensity, config.mirrorLoss)
        traceLightPath(
          endX, endY, reflectedDir,
          newIntensity, polarization,
          beams, sensors, components, getState,
          depth + 1, config
        )
      }
      break
    }

    case 'splitter': {
      const { oRayIntensity, eRayIntensity } = splitByBirefringence(intensity, polarization)

      // o光继续直行，偏振角度为0°
      if (isAboveThreshold(oRayIntensity, config.minIntensity)) {
        traceLightPath(
          endX, endY, direction,
          applyAttenuation(oRayIntensity, config.splitterLoss), 0,
          beams, sensors, components, getState,
          depth + 1, config
        )
      }

      // e光偏折，偏振角度为90°
      const eDirection = getBirefringenceEDirection(direction)
      if (isAboveThreshold(eRayIntensity, config.minIntensity)) {
        traceLightPath(
          endX, endY, eDirection,
          applyAttenuation(eRayIntensity, config.splitterLoss), 90,
          beams, sensors, components, getState,
          depth + 1, config
        )
      }
      break
    }

    case 'rotator': {
      const rotAmount = compState.rotationAmount ?? 45
      const newPolarization = rotatePolarization(polarization, rotAmount)
      const newIntensity = applyAttenuation(intensity, config.rotatorLoss)

      traceLightPath(
        endX, endY, direction,
        newIntensity, newPolarization,
        beams, sensors, components, getState,
        depth + 1, config
      )
      break
    }

    case 'sensor': {
      // 更新传感器状态
      const sensorIdx = sensors.findIndex(s => s.id === nextComponent!.id)
      if (sensorIdx !== -1) {
        sensors[sensorIdx].receivedIntensity += intensity
        sensors[sensorIdx].receivedPolarization = polarization

        const reqIntensity = nextComponent.requiredIntensity ?? 50
        const reqPol = nextComponent.requiredPolarization

        sensors[sensorIdx].activated = checkSensorActivation(
          sensors[sensorIdx].receivedIntensity,
          polarization,
          reqIntensity,
          reqPol
        )
      }
      break
    }
  }
}

/**
 * useLightTracer Hook
 * 计算光学系统中的光路传播
 */
export function useLightTracer(
  components: OpticalComponent[],
  componentStates: Record<string, Partial<OpticalComponent>>,
  config?: LightTracerConfig
): LightTraceResult {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  return useMemo(() => {
    const beams: LightBeamSegment[] = []
    const sensors: SensorState[] = []

    // 初始化传感器状态
    components.filter(c => c.type === 'sensor').forEach(s => {
      sensors.push({
        id: s.id,
        activated: false,
        receivedIntensity: 0,
        receivedPolarization: null,
      })
    })

    // 组件状态获取函数
    const getComponentState: GetComponentStateFn = (component) => {
      const state = componentStates[component.id] || {}
      return {
        ...component,
        angle: state.angle ?? component.angle,
        polarizationAngle: state.polarizationAngle ?? component.polarizationAngle,
        rotationAmount: state.rotationAmount ?? component.rotationAmount,
      }
    }

    // 处理每个光源
    const emitters = components.filter(c => c.type === 'emitter')

    for (const emitter of emitters) {
      const state = getComponentState(emitter)
      if (!state.direction) continue

      traceLightPath(
        state.x,
        state.y,
        state.direction,
        100, // 初始光强
        state.polarizationAngle ?? 0,
        beams,
        sensors,
        components,
        getComponentState,
        0,
        mergedConfig
      )
    }

    return { beams, sensorStates: sensors }
  }, [components, componentStates, mergedConfig])
}

/**
 * 独立的光路追踪函数（非Hook版本）
 * 用于不需要React状态管理的场景
 */
export function traceLightSystem(
  components: OpticalComponent[],
  componentStates: Record<string, Partial<OpticalComponent>> = {},
  config?: LightTracerConfig
): LightTraceResult {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const beams: LightBeamSegment[] = []
  const sensors: SensorState[] = []

  // 初始化传感器状态
  components.filter(c => c.type === 'sensor').forEach(s => {
    sensors.push({
      id: s.id,
      activated: false,
      receivedIntensity: 0,
      receivedPolarization: null,
    })
  })

  // 组件状态获取函数
  const getComponentState: GetComponentStateFn = (component) => {
    const state = componentStates[component.id] || {}
    return {
      ...component,
      angle: state.angle ?? component.angle,
      polarizationAngle: state.polarizationAngle ?? component.polarizationAngle,
      rotationAmount: state.rotationAmount ?? component.rotationAmount,
    }
  }

  // 处理每个光源
  const emitters = components.filter(c => c.type === 'emitter')

  for (const emitter of emitters) {
    const state = getComponentState(emitter)
    if (!state.direction) continue

    traceLightPath(
      state.x,
      state.y,
      state.direction,
      100,
      state.polarizationAngle ?? 0,
      beams,
      sensors,
      components,
      getComponentState,
      0,
      mergedConfig
    )
  }

  return { beams, sensorStates: sensors }
}
