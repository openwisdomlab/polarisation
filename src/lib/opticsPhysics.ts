/**
 * Optics Physics - 光学物理计算库
 * 包含马吕斯定律、双折射分光、镜面反射等核心物理计算
 * 可在2D游戏、3D游戏和课程Demo中复用
 */

// 2D方向类型
export type Direction2D = 'up' | 'down' | 'left' | 'right'

// 方向向量映射
export const DIRECTION_2D_VECTORS: Record<Direction2D, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

// 相反方向映射
export const OPPOSITE_DIRECTION_2D: Record<Direction2D, Direction2D> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

/**
 * 马吕斯定律 - 计算光通过偏振片后的强度
 * I = I₀ × cos²(θ)
 * @param inputIntensity 输入光强 (0-100)
 * @param inputPolarization 入射光偏振角度
 * @param filterAngle 偏振片角度
 * @returns 输出光强
 */
export function applyMalusLaw(
  inputIntensity: number,
  inputPolarization: number,
  filterAngle: number
): number {
  const angleDiff = Math.abs(inputPolarization - filterAngle) % 180
  const transmission = Math.cos((angleDiff * Math.PI) / 180) ** 2
  return inputIntensity * transmission
}

/**
 * 计算马吕斯定律的透射率
 * @param inputPolarization 入射光偏振角度
 * @param filterAngle 偏振片角度
 * @returns 透射率 (0-1)
 */
export function getMalusTransmission(
  inputPolarization: number,
  filterAngle: number
): number {
  const angleDiff = Math.abs(inputPolarization - filterAngle) % 180
  return Math.cos((angleDiff * Math.PI) / 180) ** 2
}

/**
 * 双折射分光 - 计算o光和e光的强度
 * 方解石晶体将入射光分为正常光(o-ray, 0°偏振)和非常光(e-ray, 90°偏振)
 * @param inputIntensity 输入光强
 * @param inputPolarization 入射光偏振角度
 * @returns o光和e光的强度
 */
export function splitByBirefringence(
  inputIntensity: number,
  inputPolarization: number
): { oRayIntensity: number; eRayIntensity: number } {
  // o光沿原方向传播，偏振角度为0°
  const oRayIntensity = inputIntensity * Math.cos((inputPolarization * Math.PI) / 180) ** 2
  // e光偏折，偏振角度为90°
  const eRayIntensity = inputIntensity * Math.cos(((inputPolarization - 90) * Math.PI) / 180) ** 2

  return { oRayIntensity, eRayIntensity }
}

/**
 * 旋光效应 - 波片旋转偏振方向
 * @param inputPolarization 入射光偏振角度
 * @param rotationAmount 旋转量（45°或90°）
 * @returns 输出偏振角度
 */
export function rotatePolarization(
  inputPolarization: number,
  rotationAmount: number
): number {
  return (inputPolarization + rotationAmount) % 180
}

/**
 * 镜面反射 - 根据镜子角度计算反射方向
 * 支持45°和135°两种标准镜面角度
 * @param incomingDir 入射方向
 * @param mirrorAngle 镜面角度 (应该接近45°或135°)
 * @returns 反射方向，如果无法反射则返回null
 */
export function getMirrorReflection(
  incomingDir: Direction2D,
  mirrorAngle: number
): Direction2D | null {
  const normalizedAngle = ((mirrorAngle % 180) + 180) % 180

  // 45° 镜面: right<->up, left<->down
  if (normalizedAngle >= 40 && normalizedAngle <= 50) {
    const reflections: Record<Direction2D, Direction2D> = {
      right: 'up',
      up: 'right',
      left: 'down',
      down: 'left',
    }
    return reflections[incomingDir]
  }

  // 135° 镜面: right<->down, left<->up
  if (normalizedAngle >= 130 && normalizedAngle <= 140) {
    const reflections: Record<Direction2D, Direction2D> = {
      right: 'down',
      down: 'right',
      left: 'up',
      up: 'left',
    }
    return reflections[incomingDir]
  }

  return null
}

/**
 * 获取双折射e光的偏折方向
 * e光相对于入射方向偏转90°
 * @param incomingDir 入射方向
 * @returns e光传播方向
 */
export function getBirefringenceEDirection(incomingDir: Direction2D): Direction2D {
  const eRayDirections: Record<Direction2D, Direction2D> = {
    right: 'up',
    left: 'down',
    down: 'right',
    up: 'left',
  }
  return eRayDirections[incomingDir]
}

/**
 * 检查传感器是否被激活
 * @param receivedIntensity 接收到的光强
 * @param receivedPolarization 接收到的偏振角度
 * @param requiredIntensity 所需最小光强
 * @param requiredPolarization 所需偏振角度（可选）
 * @param polarizationTolerance 偏振角度容差，默认5度
 * @returns 是否激活
 */
export function checkSensorActivation(
  receivedIntensity: number,
  receivedPolarization: number | null,
  requiredIntensity: number,
  requiredPolarization?: number,
  polarizationTolerance: number = 5
): boolean {
  // 强度检查
  const intensityOk = receivedIntensity >= requiredIntensity

  // 偏振检查（如果有要求）
  if (requiredPolarization === undefined || receivedPolarization === null) {
    return intensityOk
  }

  const polDiff = Math.abs(receivedPolarization - requiredPolarization)
  const polOk = polDiff <= polarizationTolerance ||
                Math.abs(polDiff - 180) <= polarizationTolerance

  return intensityOk && polOk
}

/**
 * 计算光衰减（如镜面反射损耗）
 * @param intensity 输入光强
 * @param factor 衰减因子 (0-1)，默认0.95表示5%损耗
 * @returns 衰减后的光强
 */
export function applyAttenuation(
  intensity: number,
  factor: number = 0.95
): number {
  return intensity * factor
}

/**
 * 光强阈值检查
 * @param intensity 光强
 * @param threshold 最小阈值，默认1
 * @returns 是否超过阈值
 */
export function isAboveThreshold(
  intensity: number,
  threshold: number = 1
): boolean {
  return intensity >= threshold
}

/**
 * 计算多个光包的合成强度（简化的干涉模型）
 * @param intensities 光强数组
 * @param phases 相位数组 (1 或 -1)
 * @returns 合成光强
 */
export function combineIntensities(
  intensities: number[],
  phases?: (1 | -1)[]
): number {
  if (intensities.length === 0) return 0

  // 没有相位信息时，简单相加
  if (!phases || phases.length !== intensities.length) {
    return intensities.reduce((sum, i) => sum + i, 0)
  }

  // 有相位信息时，考虑干涉
  let totalAmplitude = 0
  for (let i = 0; i < intensities.length; i++) {
    const amplitude = Math.sqrt(intensities[i]) * phases[i]
    totalAmplitude += amplitude
  }
  return totalAmplitude ** 2
}

/**
 * 角度转弧度
 * @param degrees 角度
 * @returns 弧度
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * 弧度转角度
 * @param radians 弧度
 * @returns 角度
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}
