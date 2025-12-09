/**
 * Polarization utilities - 偏振光色彩和角度处理工具库
 * 可在2D游戏、3D游戏和课程Demo中复用
 */

import type { PolarizationAngle } from '@/core/types'

// 偏振角度对应的十六进制颜色
export const POLARIZATION_HEX_COLORS: Record<PolarizationAngle, string> = {
  0: '#ff4444',    // 红色 - 水平偏振 (0°)
  45: '#ffaa00',   // 橙黄色 - 45度偏振
  90: '#44ff44',   // 绿色 - 垂直偏振 (90°)
  135: '#4444ff', // 蓝色 - 135度偏振
}

// 偏振角度对应的CSS颜色名称
export const POLARIZATION_COLOR_NAMES: Record<PolarizationAngle, { en: string; zh: string }> = {
  0: { en: 'Red (Horizontal)', zh: '红色 (水平)' },
  45: { en: 'Orange (45°)', zh: '橙黄色 (45°)' },
  90: { en: 'Green (Vertical)', zh: '绿色 (垂直)' },
  135: { en: 'Blue (135°)', zh: '蓝色 (135°)' },
}

// 偏振角度范围边界
const ANGLE_BOUNDARIES = {
  RED_MAX: 22.5,      // 0° ± 22.5°
  ORANGE_MAX: 67.5,   // 45° ± 22.5°
  GREEN_MAX: 112.5,   // 90° ± 22.5°
  BLUE_MAX: 157.5,    // 135° ± 22.5°
}

/**
 * 根据偏振角度获取对应的显示颜色
 * 将连续角度映射到4个离散颜色
 * @param angle 偏振角度 (任意数值，会被归一化到0-180)
 * @returns 十六进制颜色字符串
 */
export function getPolarizationColor(angle: number): string {
  const normalizedAngle = normalizeAngle(angle)

  if (normalizedAngle < ANGLE_BOUNDARIES.RED_MAX || normalizedAngle >= ANGLE_BOUNDARIES.BLUE_MAX) {
    return POLARIZATION_HEX_COLORS[0]
  }
  if (normalizedAngle < ANGLE_BOUNDARIES.ORANGE_MAX) {
    return POLARIZATION_HEX_COLORS[45]
  }
  if (normalizedAngle < ANGLE_BOUNDARIES.GREEN_MAX) {
    return POLARIZATION_HEX_COLORS[90]
  }
  return POLARIZATION_HEX_COLORS[135]
}

/**
 * 根据偏振角度获取最接近的离散偏振态
 * @param angle 偏振角度
 * @returns 离散偏振角度 (0, 45, 90, 135)
 */
export function getNearestPolarizationAngle(angle: number): PolarizationAngle {
  const normalizedAngle = normalizeAngle(angle)

  if (normalizedAngle < ANGLE_BOUNDARIES.RED_MAX || normalizedAngle >= ANGLE_BOUNDARIES.BLUE_MAX) {
    return 0
  }
  if (normalizedAngle < ANGLE_BOUNDARIES.ORANGE_MAX) {
    return 45
  }
  if (normalizedAngle < ANGLE_BOUNDARIES.GREEN_MAX) {
    return 90
  }
  return 135
}

/**
 * 获取偏振角度的颜色名称
 * @param angle 偏振角度
 * @param lang 语言 ('en' | 'zh')
 * @returns 颜色名称
 */
export function getPolarizationColorName(angle: number, lang: 'en' | 'zh' = 'en'): string {
  const discreteAngle = getNearestPolarizationAngle(angle)
  return POLARIZATION_COLOR_NAMES[discreteAngle][lang]
}

/**
 * 将角度归一化到 [0, 180) 范围
 * @param angle 任意角度
 * @returns 归一化后的角度
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 180) + 180) % 180
}

/**
 * 检查两个偏振角度是否正交（相差90°）
 * @param angle1 第一个角度
 * @param angle2 第二个角度
 * @returns 是否正交
 */
export function isOrthogonal(angle1: number, angle2: number): boolean {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2))
  return Math.abs(diff - 90) < 5 // 允许5度误差
}

/**
 * 检查两个偏振角度是否平行（相差接近0°或180°）
 * @param angle1 第一个角度
 * @param angle2 第二个角度
 * @param tolerance 容差角度，默认5度
 * @returns 是否平行
 */
export function isParallel(angle1: number, angle2: number, tolerance: number = 5): boolean {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2))
  return diff < tolerance || diff > (180 - tolerance)
}

/**
 * 计算两个偏振角度之间的最小差值
 * @param angle1 第一个角度
 * @param angle2 第二个角度
 * @returns 角度差值 (0-90)
 */
export function getAngleDifference(angle1: number, angle2: number): number {
  const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2))
  return Math.min(diff, 180 - diff)
}

/**
 * 获取所有标准偏振角度列表
 * @returns 标准偏振角度数组
 */
export function getStandardAngles(): PolarizationAngle[] {
  return [0, 45, 90, 135]
}

/**
 * 偏振色彩配置，用于UI显示
 */
export const POLARIZATION_DISPLAY_CONFIG = [
  { angle: 0 as PolarizationAngle, label: '0°', color: POLARIZATION_HEX_COLORS[0] },
  { angle: 45 as PolarizationAngle, label: '45°', color: POLARIZATION_HEX_COLORS[45] },
  { angle: 90 as PolarizationAngle, label: '90°', color: POLARIZATION_HEX_COLORS[90] },
  { angle: 135 as PolarizationAngle, label: '135°', color: POLARIZATION_HEX_COLORS[135] },
] as const
