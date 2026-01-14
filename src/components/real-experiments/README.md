# Real Experiments Components (真实实验场景组件)

## 📦 组件清单

### 1. RealExperimentMicroGallery
**嵌入式真实实验微画廊**

自动根据 `relatedModules` 参数匹配并展示相关的真实实验照片和视频。

#### 使用方法:

```tsx
import { RealExperimentMicroGallery } from '@/components/real-experiments'

function MyDemo() {
  return (
    <div>
      {/* Your demo content */}

      {/* Add micro gallery at the bottom */}
      <RealExperimentMicroGallery
        relatedModules={['malus', 'polarization-intro']}
        includeCulturalArt={false}
        initialShowCount={6}
      />
    </div>
  )
}
```

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `relatedModules` | `string[]` | **required** | 相关模块ID列表，用于筛选资源 |
| `title` | `string?` | 自动 | 自定义标题（英文） |
| `initialShowCount` | `number?` | `6` | 初始显示的资源数量 |
| `includeCulturalArt` | `boolean?` | `false` | 是否包含文创艺术资源 |

#### 可用的 relatedModules:

**基础光学**:
- `'polarization-intro'` - 偏振光基础
- `'malus'` - 马吕斯定律
- `'birefringence'` - 双折射
- `'waveplate'` - 波片
- `'chromatic-polarization'` - 色偏振

**应用**:
- `'stress-analysis'` - 应力分析
- `'interference'` - 干涉效应
- `'optical-rotation'` - 旋光性
- `'brewster'` - 布儒斯特角
- `'scattering'` - 散射

**其他**:
- `'daily-polarization'` - 日常偏振现象
- `'food-quality'` - 食品质量检测

---

### 2. TripleViewToggle
**三视图切换组件**

允许用户在三种偏振系统视图间切换：正视图、平行偏振、正交偏振。

#### 使用方法:

```tsx
import { TripleViewToggle } from '@/components/real-experiments'

function MyModal() {
  return (
    <TripleViewToggle
      resource={polarizationResource}
      enableComparison={false}
    />
  )
}
```

#### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resource` | `PolarizationResource` | **required** | 偏振资源对象（必须包含 views 字段） |
| `enableComparison` | `boolean?` | `false` | 启用左右对比滑块（未来功能） |

---

## 🎯 已集成的演示页面

### 1. MalusLawDemo (马吕斯定律)
**文件**: `src/components/demos/unit1/MalusLawDemo.tsx`

**相关资源**:
- 眼镜（应力双折射）
- 矿泉水瓶（PET应力图案）
- 钢化玻璃 vs 普通玻璃对比

**配置**:
```tsx
<RealExperimentMicroGallery
  relatedModules={['malus', 'polarization-intro', 'stress-analysis']}
  includeCulturalArt={false}
/>
```

---

### 2. BirefringenceDemo (双折射)
**文件**: `src/components/demos/unit1/BirefringenceDemo.tsx`

**相关资源**:
- 冰洲石双折射序列（4角度）
- 保鲜膜层数序列（5层）
- 透明胶带干涉图案
- 文创艺术作品（乌萨奇、辛普森等）

**配置**:
```tsx
<RealExperimentMicroGallery
  relatedModules={['birefringence', 'waveplate', 'chromatic-polarization', 'stress-analysis']}
  includeCulturalArt={true}
/>
```

---

### 3. ChromaticDemo (色偏振)
**文件**: `src/components/demos/unit3/ChromaticDemo.tsx`

**相关资源**:
- 保鲜膜拉伸视频（带时间点标注）
- 透明胶条重叠阵列
- 玻璃加热冷却序列（7帧）
- 文创艺术全系列

**配置**:
```tsx
<RealExperimentMicroGallery
  relatedModules={['chromatic-polarization', 'birefringence', 'stress-analysis', 'interference']}
  includeCulturalArt={true}
/>
```

---

## 🔧 添加新演示页面集成

### 步骤:

1. **导入组件**:
   ```tsx
   import { RealExperimentMicroGallery } from '@/components/real-experiments'
   ```

2. **在返回的 JSX 末尾添加**（通常在 InfoCard 部分之后）:
   ```tsx
   {/* 真实实验案例 */}
   <RealExperimentMicroGallery
     relatedModules={['your-module-id']}
     includeCulturalArt={false}
   />
   ```

3. **选择合适的 relatedModules**:
   - 查看 `src/data/resource-gallery.ts` 中资源的 `relatedModules` 字段
   - 选择与当前演示最相关的1-4个模块ID

---

## 📊 数据源

### 偏振实验资源
**文件**: `src/data/resource-gallery.ts`

**数据结构**:
```typescript
export interface PolarizationResource {
  id: string
  type: 'image' | 'video' | 'sequence'
  title: string
  titleZh: string
  category: 'stress' | 'interference' | 'art' | 'daily' | ...
  url: string
  thumbnail?: string
  relatedModules: string[]  // ← 用于匹配
  metadata: {
    polarizationSystem?: 'parallel' | 'crossed' | 'front'
    material?: string
    hasVideo?: boolean
    videoUrl?: string
    // ... more
  }
  views?: {
    front?: string
    parallel?: string
    crossed?: string
  }
  frames?: Array<{  // 用于序列
    time: number
    label: string
    labelZh: string
    url: string
  }>
}
```

**统计**:
- 总资源: 41项
- 应力分析: 6项
- 干涉/厚度: 8项
- 双折射: 5项
- 旋光性: 6项
- 布儒斯特角: 3项
- 散射: 2项

---

### 文创艺术资源
**文件**: `src/data/cultural-creations.ts`

**数据结构**:
```typescript
export interface CulturalMedia {
  id: string
  type: 'image' | 'video'
  path: string
  name: string
  nameZh: string
  category: 'character' | 'logo' | 'animal' | 'abstract'
  series: string
  polarizationSystem: 'parallel' | 'crossed' | 'front'
  tags?: string[]  // ← 用于匹配
}
```

**统计**:
- 总资源: 37项
- 系列: 5个（乌萨奇、辛普森巴特、辛普森丽莎、学院Logo、小猫小狗）

---

## 🎨 UI 特性

### 缩略图网格
- 响应式布局：2列（移动端）→ 3列（平板）→ 6列（桌面）
- 悬停效果：放大 + 显示标题
- 类型徽章：视频（红色 Play）、序列（紫色帧数）
- 查看图标：悬停显示眼睛图标

### 详情模态窗
- **有 viewPairs 的资源**：显示 TripleViewToggle（三视图切换）
- **序列资源**：显示帧选择器
- **视频资源**：显示原生视频播放器
- **导航**：上一个/下一个按钮，显示进度（X / Y）
- **元数据**：类别、材质、偏振系统等

### 三视图切换
- 三个按钮：正视图（灰色）、平行偏振（绿色）、正交偏振（青色）
- 图片切换动画：淡入淡出
- 当前视图徽章：右上角显示
- 物理原理提示：底部信息栏
- 视频链接：如果有对应视频，显示"观看完整视频"按钮

---

## 🚀 未来扩展

### 计划中的功能:

1. **双栏对比模式** (Side-by-Side Comparison)
   - 左侧：真实照片
   - 右侧：模拟器
   - 参数同步
   - 相似度指示器

2. **时序同步播放** (Timeline Sync)
   - 视频与模拟动画统一时间轴
   - 关键帧自动跳转
   - 物理参数曲线实时绘制

3. **实验复现挑战** (Recreation Challenge)
   - 显示目标照片
   - 在光学工作台中复现
   - 相似度评分
   - 解锁成就系统

4. **AR标注层** (AR Annotations)
   - 照片上叠加物理公式
   - 光路追踪可视化
   - 测量标注
   - 实验步骤引导

---

## 📝 维护指南

### 添加新实验资源:

1. 在 `src/data/resource-gallery.ts` 中添加资源定义
2. 确保包含 `relatedModules` 字段
3. 如果有三视图，填写 `views` 字段
4. 如果是序列，填写 `frames` 字段
5. 如果有视频标注，填写 `videoAnnotations` 字段

### 添加新文创作品:

1. 在 `src/data/cultural-creations.ts` 中添加定义
2. 确保包含 `tags` 字段（包含 `'chromatic-polarization'`）
3. 将图片放在 `/public/images/chromatic-polarization/` 目录
4. 将视频放在 `/public/videos/chromatic-polarization/` 目录

---

## 🐛 故障排除

### 问题: 没有资源显示

**原因**: `relatedModules` 参数与资源定义不匹配

**解决**:
1. 检查 `src/data/resource-gallery.ts` 中资源的 `relatedModules` 字段
2. 确保传入的模块ID与资源定义中的ID完全一致（区分大小写）
3. 使用 `getResourcesByModule()` 辅助函数测试

### 问题: 三视图切换不显示

**原因**: 资源没有 `views` 字段

**解决**:
1. 确保资源定义中包含 `views` 对象
2. 至少提供 `views.parallel` 或 `views.crossed` 中的一个
3. 如果资源不支持三视图，将显示单视图

### 问题: TypeScript 类型错误

**原因**: 资源类型不匹配

**解决**:
1. 确保导入正确的类型：`import type { PolarizationResource } from '@/data/resource-gallery'`
2. CulturalMedia 会自动转换为 PolarizationResource 格式
3. 检查 `as unknown as PolarizationResource` 类型断言是否正确

---

## 📧 联系与贡献

如有问题或建议，请在项目中提交 Issue 或 PR。

**设计文档**: `REAL_EXPERIMENT_SCENES_REDESIGN.md`
