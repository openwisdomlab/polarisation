# Phase 2: 双栏对比 + 时序同步播放 使用指南

## 📦 组件概览

Phase 2 提供两个高级组件，用于深度集成真实实验与模拟器：

| 组件 | 用途 | 适用场景 |
|------|------|----------|
| **SideBySideComparison** | 双栏对比（左真实/右模拟） | 静态照片对比、参数同步、相似度指示 |
| **TimelineSyncPlayer** | 时序同步播放 | 视频/序列帧与模拟器动画同步 |

---

## 🎯 SideBySideComparison 组件

### 功能特性

- ✅ **可拖动分割线** - 左右拖动查看真实实验 vs 模拟器对比
- ✅ **参数同步** - 调整模拟器参数自动匹配最接近的真实资源
- ✅ **相似度指示器** - 实时显示匹配度（0-100%）
- ✅ **缩放控制** - 同步缩放真实图片和模拟器（0.5x - 3x）
- ✅ **双语支持** - 英文/中文界面切换
- ✅ **信息面板** - 显示真实资源元数据和模拟器参数

### 基础用法

```tsx
import { SideBySideComparison } from '@/components/real-experiments'
import { POLARIZATION_RESOURCES } from '@/data/resource-gallery'

function MyDemo() {
  const [angle, setAngle] = useState(45)
  const [intensity, setIntensity] = useState(70)

  // 找到相关的真实实验资源
  const brewsterResources = POLARIZATION_RESOURCES.filter(r =>
    r.relatedModules?.includes('brewster')
  )

  // 模拟器参数
  const simulatorParams = {
    angle,
    intensity,
    wavelength: 550,
  }

  return (
    <SideBySideComparison
      realResource={brewsterResources}
      simulatorComponent={
        <MySimulatorSVG angle={angle} intensity={intensity} />
      }
      simulatorParams={simulatorParams}
    />
  )
}
```

### 高级用法：参数同步 + 自动匹配

```tsx
import { SideBySideComparison } from '@/components/real-experiments'
import { getResourcesByModule } from '@/data/resource-gallery'

function BrewsterComparisonDemo() {
  const [polarizerAngle, setPolarizerAngle] = useState(0)
  const [glassAngle, setGlassAngle] = useState(56.3) // Brewster angle for glass

  // 获取所有布儒斯特实验资源
  const brewsterResources = getResourcesByModule('brewster')

  // 模拟器参数
  const simulatorParams = {
    polarizerAngle,
    glassAngle,
    polarizationSystem: polarizerAngle === 0 ? 'none' : 'parallel',
  }

  // 自动匹配资源函数
  const autoMatchResource = (params: ComparisonParams) => {
    const { polarizerAngle, polarizationSystem } = params

    // 根据偏振系统选择对应的真实资源
    if (polarizationSystem === 'none') {
      return brewsterResources.find(r => r.id.includes('no-polarizer'))
    } else if (polarizationSystem === 'parallel') {
      return brewsterResources.find(r => r.id.includes('parallel'))
    } else {
      return brewsterResources.find(r => r.id.includes('perpendicular'))
    }
  }

  // 计算相似度函数
  const calculateSimilarity = (params: ComparisonParams, resource: PolarizationResource) => {
    const { glassAngle } = params
    const brewsterAngle = 56.3 // 玻璃的布儒斯特角

    // 基于角度差计算相似度
    const angleDiff = Math.abs(glassAngle - brewsterAngle)
    const angleScore = Math.max(0, 100 - angleDiff * 2)

    // 基于偏振系统匹配度
    const systemMatch = resource.metadata.polarizationSystem === params.polarizationSystem ? 100 : 50

    // 综合评分
    return (angleScore + systemMatch) / 2
  }

  return (
    <div className="space-y-6">
      {/* 参数控制 */}
      <div className="flex gap-4">
        <SliderControl
          label="偏振片角度"
          value={polarizerAngle}
          min={0}
          max={90}
          onChange={setPolarizerAngle}
        />
        <SliderControl
          label="玻璃角度"
          value={glassAngle}
          min={0}
          max={90}
          onChange={setGlassAngle}
        />
      </div>

      {/* 双栏对比 */}
      <SideBySideComparison
        realResource={brewsterResources}
        simulatorComponent={
          <BrewsterSimulatorSVG
            polarizerAngle={polarizerAngle}
            glassAngle={glassAngle}
          />
        }
        simulatorParams={simulatorParams}
        autoMatchResource={autoMatchResource}
        calculateSimilarity={calculateSimilarity}
        title="Brewster Angle Comparison"
        titleZh="布儒斯特角对比"
      />
    </div>
  )
}
```

### Props 接口

```typescript
interface SideBySideComparisonProps {
  /** 真实资源（单个或数组） */
  realResource: PolarizationResource | PolarizationResource[]

  /** 右侧模拟器组件 */
  simulatorComponent: ReactNode

  /** 当前模拟器参数 */
  simulatorParams: ComparisonParams

  /** 参数变化回调（可选） */
  onParamsChange?: (params: ComparisonParams) => void

  /** 自动匹配真实资源的函数（可选） */
  autoMatchResource?: (params: ComparisonParams) => PolarizationResource | null

  /** 计算相似度的函数（可选，返回0-100） */
  calculateSimilarity?: (params: ComparisonParams, resource: PolarizationResource) => number

  /** 标题（可选） */
  title?: string
  titleZh?: string
}

interface ComparisonParams {
  [key: string]: number | string
}
```

---

## 🎬 TimelineSyncPlayer 组件

### 功能特性

- ✅ **统一时间轴** - 左侧真实视频/序列与右侧模拟器动画同步播放
- ✅ **视频标注** - 在关键时间点显示文字标注（使用 `videoAnnotations` 元数据）
- ✅ **参数曲线** - Canvas 绘制物理参数随时间变化曲线
- ✅ **关键帧导航** - 跳转到序列帧、标注点或自定义时间点
- ✅ **播放控制** - 播放/暂停、上一帧/下一帧、倍速调节（0.25x - 2x）
- ✅ **时间点标记** - 时间轴上显示所有关键帧、标注、自定义点
- ✅ **进度拖动** - 拖动时间轴直接跳转到任意时刻

### 基础用法

```tsx
import { TimelineSyncPlayer } from '@/components/real-experiments'
import { POLARIZATION_RESOURCES } from '@/data/resource-gallery'

function MyDemo() {
  const [currentTime, setCurrentTime] = useState(0)

  // 找到有视频的真实资源
  const videoResource = POLARIZATION_RESOURCES.find(
    r => r.id === 'brewster-perpendicular-vertical-laser-video'
  )

  // 模拟器组件：接收当前时间，返回对应状态的渲染
  const simulatorComponent = (time: number) => {
    // 根据时间计算旋转角度
    const rotation = (time / 10) * 360 // 10秒旋转一圈

    return (
      <svg viewBox="0 0 400 400">
        <rect
          x="150"
          y="150"
          width="100"
          height="100"
          fill="#22d3ee"
          transform={`rotate(${rotation} 200 200)`}
        />
      </svg>
    )
  }

  return (
    <TimelineSyncPlayer
      realResource={videoResource}
      simulatorComponent={simulatorComponent}
      duration={10} // 视频时长（秒）
    />
  )
}
```

### 高级用法：参数曲线 + 视频标注

```tsx
import { TimelineSyncPlayer, ParameterCurve } from '@/components/real-experiments'

function BrewsterRotationDemo() {
  // 定义参数曲线：反射光强度随玻璃旋转角度变化
  const parameterCurves: ParameterCurve[] = [
    {
      label: '反射光强度',
      labelZh: 'Reflected Intensity',
      color: '#22d3ee',
      unit: '%',
      getValue: (time: number) => {
        // 时间 → 旋转角度 → 反射率（使用 Fresnel 公式）
        const rotation = (time / 10) * 360
        const brewsterAngle = 56.3
        const angleDiff = Math.abs((rotation % 180) - brewsterAngle)

        // 简化的反射率公式
        const reflectivity = Math.pow(Math.sin(angleDiff * Math.PI / 180), 2)
        return reflectivity * 100
      },
    },
    {
      label: 'p偏振透射率',
      labelZh: 'p-polarization Transmission',
      color: '#a78bfa',
      unit: '%',
      getValue: (time: number) => {
        const rotation = (time / 10) * 360
        const brewsterAngle = 56.3
        const angleDiff = Math.abs((rotation % 180) - brewsterAngle)

        // 在布儒斯特角处，p偏振完全透射
        const transmission = Math.pow(Math.cos(angleDiff * Math.PI / 180), 2)
        return transmission * 100
      },
    },
  ]

  // 自定义时间点标记
  const customTimePoints = [
    { time: 0, label: '起始位置', labelZh: 'Start' },
    { time: 3.14, label: '布儒斯特角', labelZh: 'Brewster Angle' },
    { time: 6.28, label: '垂直入射', labelZh: 'Normal Incidence' },
    { time: 10, label: '结束', labelZh: 'End' },
  ]

  const simulatorComponent = (time: number) => {
    const rotation = (time / 10) * 360
    const glassAngle = rotation % 180

    return (
      <svg viewBox="0 0 600 400">
        {/* 激光光束 */}
        <line x1="50" y1="200" x2="250" y2="200" stroke="#22d3ee" strokeWidth="3" />

        {/* 玻璃片 */}
        <rect
          x="250"
          y="100"
          width="20"
          height="200"
          fill="rgba(100, 200, 255, 0.3)"
          stroke="#67e8f9"
          strokeWidth="2"
          transform={`rotate(${glassAngle} 260 200)`}
        />

        {/* 反射光束 */}
        <line
          x1="260"
          y1="200"
          x2={260 + 150 * Math.cos(glassAngle * 2 * Math.PI / 180)}
          y2={200 - 150 * Math.sin(glassAngle * 2 * Math.PI / 180)}
          stroke="#ef4444"
          strokeWidth="2"
          opacity={Math.max(0.2, Math.sin(glassAngle * Math.PI / 180))}
        />

        {/* 角度标注 */}
        <text x="300" y="380" fill="#94a3b8" fontSize="14">
          玻璃角度: {glassAngle.toFixed(1)}°
        </text>
      </svg>
    )
  }

  return (
    <TimelineSyncPlayer
      realResource={POLARIZATION_RESOURCES.find(
        r => r.id === 'brewster-perpendicular-vertical-laser-video'
      )}
      simulatorComponent={simulatorComponent}
      duration={10}
      parameterCurves={parameterCurves}
      customTimePoints={customTimePoints}
    />
  )
}
```

### 使用序列帧资源

```tsx
function StressAnalysisSequence() {
  // 找到序列帧资源
  const sequenceResource = POLARIZATION_RESOURCES.find(
    r => r.metadata.isSequence === true
  )

  // 如果资源有定义序列帧
  const frames = sequenceResource?.metadata.sequenceFrames || []

  const simulatorComponent = (time: number) => {
    // 根据时间计算应力分布
    const stress = Math.sin(time * Math.PI / 5) * 100

    return (
      <svg viewBox="0 0 400 400">
        {/* 应力颜色映射 */}
        <rect
          x="100"
          y="100"
          width="200"
          height="200"
          fill={`hsl(${stress + 180}, 70%, 50%)`}
        />
      </svg>
    )
  }

  return (
    <TimelineSyncPlayer
      realResource={sequenceResource}
      simulatorComponent={simulatorComponent}
      duration={frames.length} // 序列长度
      parameterCurves={[
        {
          label: '应力值',
          color: '#ef4444',
          unit: 'MPa',
          getValue: (t) => Math.sin(t * Math.PI / 5) * 100,
        },
      ]}
    />
  )
}
```

### Props 接口

```typescript
interface TimelineSyncPlayerProps {
  /** 真实资源（视频或序列帧） */
  realResource: PolarizationResource

  /** 模拟器组件工厂函数（接收当前时间，返回渲染） */
  simulatorComponent: (currentTime: number) => ReactNode

  /** 总时长（秒） */
  duration: number

  /** 参数曲线数组（可选） */
  parameterCurves?: ParameterCurve[]

  /** 自定义时间点（可选） */
  customTimePoints?: TimelinePoint[]

  /** 标题（可选） */
  title?: string
  titleZh?: string
}

interface ParameterCurve {
  label: string
  labelZh?: string
  color: string
  unit?: string
  getValue: (time: number) => number
}

interface TimelinePoint {
  time: number
  label: string
  labelZh?: string
  type?: 'keyframe' | 'annotation' | 'custom'
}
```

---

## 📊 完整示例：布儒斯特角演示集成

```tsx
import { useState } from 'react'
import {
  SideBySideComparison,
  TimelineSyncPlayer,
  RealExperimentMicroGallery,
} from '@/components/real-experiments'
import { getResourcesByModule } from '@/data/resource-gallery'

export function BrewsterDemoWithPhase2() {
  const [mode, setMode] = useState<'static' | 'dynamic'>('static')
  const [glassAngle, setGlassAngle] = useState(56.3)
  const [polarizerAngle, setPolarizerAngle] = useState(0)

  const brewsterResources = getResourcesByModule('brewster')
  const videoResource = brewsterResources.find(r => r.type === 'video')

  // 静态对比模式
  if (mode === 'static') {
    return (
      <div className="space-y-6">
        <h2>布儒斯特角演示 - 静态对比</h2>

        {/* 参数控制 */}
        <SliderControl
          label="玻璃角度"
          value={glassAngle}
          min={0}
          max={90}
          onChange={setGlassAngle}
        />

        {/* 双栏对比 */}
        <SideBySideComparison
          realResource={brewsterResources}
          simulatorComponent={
            <BrewsterSimulator angle={glassAngle} />
          }
          simulatorParams={{ glassAngle, polarizerAngle }}
          autoMatchResource={(params) => {
            // 根据角度选择最接近的资源
            const targetAngle = params.glassAngle as number
            return brewsterResources.reduce((best, curr) => {
              const currAngle = curr.metadata.angle || 0
              const bestAngle = best.metadata.angle || 0
              return Math.abs(currAngle - targetAngle) < Math.abs(bestAngle - targetAngle)
                ? curr
                : best
            })
          }}
          calculateSimilarity={(params, resource) => {
            const targetAngle = params.glassAngle as number
            const resourceAngle = resource.metadata.angle || 0
            const angleDiff = Math.abs(targetAngle - resourceAngle)
            return Math.max(0, 100 - angleDiff * 2)
          }}
        />

        <button onClick={() => setMode('dynamic')}>切换到动态模式</button>
      </div>
    )
  }

  // 动态同步模式
  return (
    <div className="space-y-6">
      <h2>布儒斯特角演示 - 动态同步</h2>

      {/* 时序同步播放器 */}
      <TimelineSyncPlayer
        realResource={videoResource}
        simulatorComponent={(time) => {
          const rotation = (time / 10) * 360
          return <BrewsterSimulator angle={rotation % 180} />
        }}
        duration={10}
        parameterCurves={[
          {
            label: 'Reflection',
            color: '#ef4444',
            unit: '%',
            getValue: (t) => {
              const angle = ((t / 10) * 360) % 180
              const brewsterAngle = 56.3
              return Math.pow(Math.sin(Math.abs(angle - brewsterAngle) * Math.PI / 180), 2) * 100
            },
          },
        ]}
        customTimePoints={[
          { time: 3.14, label: 'Brewster Angle', labelZh: '布儒斯特角' },
        ]}
      />

      <button onClick={() => setMode('static')}>切换到静态模式</button>

      {/* 底部缩略图库 */}
      <RealExperimentMicroGallery
        relatedModules={['brewster', 'fresnel']}
      />
    </div>
  )
}
```

---

## 🎨 样式定制

两个组件都使用 Tailwind CSS 并遵循项目设计系统：

```tsx
// 自定义容器样式
<SideBySideComparison
  className="rounded-2xl border-2 border-cyan-500/30"
  // ...其他 props
/>

// 自定义时间轴样式
<TimelineSyncPlayer
  timelineColor="#22d3ee"
  markerColor="#a78bfa"
  // ...其他 props
/>
```

---

## 🚀 性能优化

### SideBySideComparison

- 使用 `useMemo` 缓存相似度计算结果
- 防抖处理分割线拖动事件
- 仅在参数变化时重新匹配资源

```tsx
const memoizedSimilarity = useMemo(
  () => calculateSimilarity(simulatorParams, selectedResource),
  [simulatorParams, selectedResource]
)
```

### TimelineSyncPlayer

- 使用 `requestAnimationFrame` 优化动画循环
- Canvas 渲染参数曲线（高性能）
- 视频懒加载，仅在播放时加载

```tsx
// 仅在播放状态下运行动画循环
useEffect(() => {
  if (!isPlaying) return

  let animationFrameId: number
  const animate = (timestamp: number) => {
    // 更新时间
    setCurrentTime(...)
    animationFrameId = requestAnimationFrame(animate)
  }

  animationFrameId = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(animationFrameId)
}, [isPlaying])
```

---

## 📝 类型定义

```typescript
// 从 resource-gallery.ts 导入
import type { PolarizationResource } from '@/data/resource-gallery'

// 组件类型
type ComparisonParams = Record<string, number | string>

interface ParameterCurve {
  label: string
  labelZh?: string
  color: string
  unit?: string
  getValue: (time: number) => number
}

interface TimelinePoint {
  time: number
  label: string
  labelZh?: string
  type?: 'keyframe' | 'annotation' | 'custom'
}
```

---

## ✅ 最佳实践

### 1. 参数同步策略

```tsx
// ❌ 不推荐：每次参数变化都遍历所有资源
autoMatchResource={(params) => {
  return allResources.find(r => /* 复杂计算 */)
}}

// ✅ 推荐：预先筛选和索引
const resourcesByAngle = useMemo(() => {
  const map = new Map()
  allResources.forEach(r => {
    const angle = r.metadata.angle || 0
    map.set(angle, r)
  })
  return map
}, [allResources])

autoMatchResource={(params) => {
  const targetAngle = Math.round(params.angle as number)
  return resourcesByAngle.get(targetAngle) || null
}}
```

### 2. 相似度计算

```tsx
// 多维度评分
calculateSimilarity={(params, resource) => {
  const angleScore = computeAngleScore(params.angle, resource.metadata.angle)
  const systemScore = params.system === resource.metadata.polarizationSystem ? 100 : 0
  const intensityScore = computeIntensityScore(params.intensity, resource.metadata.intensity)

  // 加权平均
  return (angleScore * 0.5 + systemScore * 0.3 + intensityScore * 0.2)
}}
```

### 3. 时序同步精度

```tsx
// 使用高精度时间戳
const simulatorComponent = (time: number) => {
  // time 是精确到毫秒的浮点数
  const frameIndex = Math.floor(time * 30) // 假设30fps

  return <MySimulator frame={frameIndex} />
}
```

---

## 🐛 常见问题

### Q: 相似度始终显示 0%？

**A:** 检查 `calculateSimilarity` 函数是否返回了有效的数值（0-100）。

```tsx
calculateSimilarity={(params, resource) => {
  console.log('Params:', params)
  console.log('Resource:', resource)
  const score = /* 你的计算逻辑 */
  console.log('Score:', score)
  return score
}}
```

### Q: 视频播放不同步？

**A:** 确保 `duration` prop 与视频实际时长一致。如果资源有 `metadata.duration`，优先使用：

```tsx
<TimelineSyncPlayer
  duration={videoResource.metadata.duration || 10}
  // ...
/>
```

### Q: 参数曲线不显示？

**A:** 检查 `getValue` 函数是否返回了有效数值，并且时间范围正确：

```tsx
parameterCurves={[{
  getValue: (time) => {
    console.log('Time:', time, 'Value:', /* 计算结果 */)
    return /* 0-100 之间的数值 */
  }
}]}
```

---

## 📚 相关文档

- [Phase 1 组件文档](./README.md)
- [资源库数据结构](../../data/resource-gallery.ts)
- [视频标注规范](./VIDEO_ANNOTATIONS.md)
- [布儒斯特实验整合总结](../../../BREWSTER_INTEGRATION_SUMMARY.md)

---

**更新时间**: 2026-01-14
**版本**: Phase 2.0
**作者**: PolarCraft Team
