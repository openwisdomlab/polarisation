/**
 * Resource Registry (资源注册表)
 *
 * 统一管理实验资源与各模块的关联关系
 * - 支持按模块、概念、时间线事件查询资源
 * - 提供资源分组和推荐功能
 * - 方便跨模块调用和展示
 */

import {
  POLARIZATION_RESOURCES,
  getResourceById,
  getResourcesByModule,
  type PolarizationResource,
  type ResourceCategory,
} from './resource-gallery'

// ===== 资源与模块的映射 =====

/** 模块类型定义 */
export type ModuleType =
  | 'birefringence'        // 双折射
  | 'stress-analysis'      // 应力分析
  | 'photoelasticity'      // 光弹性法
  | 'chromatic-polarization' // 色偏振
  | 'interference'         // 干涉
  | 'waveplate'            // 波片
  | 'optical-rotation'     // 旋光
  | 'malus-law'           // 马吕斯定律
  | 'polarization-intro'   // 偏振入门
  | 'daily-polarization'   // 日常偏振
  | 'anisotropy'          // 各向异性
  | 'thermal-stress'       // 热应力

/** 概念/主题类型 */
export type ConceptType =
  | 'stress-visualization'    // 应力可视化
  | 'thickness-interference'  // 厚度干涉
  | 'material-properties'     // 材料属性
  | 'optical-activity'        // 旋光活性
  | 'polarizer-system'        // 偏振系统

/** 资源组定义 - 用于分组展示 */
export interface ResourceGroup {
  id: string
  title: string
  titleZh: string
  description: string
  descriptionZh: string
  resourceIds: string[]
  displayMode: 'gallery' | 'sequence' | 'comparison' | 'single'
  concept: ConceptType
}

/** 时间线关联定义 */
export interface TimelineResourceMapping {
  year: number
  eventTitle: string
  resourceIds: string[]
  featuredResourceId?: string  // 主推资源
  videoIds?: string[]          // 关联视频资源ID
}

// ===== 资源分组注册 =====

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: 'glass-stress-series',
    title: 'Glass Thermal Stress Series',
    titleZh: '玻璃热应力系列',
    description: 'Complete thermal stress visualization from heating to cooling',
    descriptionZh: '从加热到冷却的完整热应力可视化',
    resourceIds: ['glass-heating-cooling', 'glass-corner-heating', 'glass-cooled', 'tempered-glass', 'ordinary-glass', 'glass-comparison'],
    displayMode: 'sequence',
    concept: 'stress-visualization',
  },
  {
    id: 'plastic-wrap-series',
    title: 'Plastic Wrap Thickness Interference',
    titleZh: '保鲜膜厚度干涉系列',
    description: 'Layer-by-layer interference color changes',
    descriptionZh: '逐层叠加的干涉色变化',
    resourceIds: ['plastic-wrap', 'plastic-wrap-thickness', 'plastic-wrap-stretching'],
    displayMode: 'sequence',
    concept: 'thickness-interference',
  },
  {
    id: 'tape-patterns',
    title: 'Clear Tape Pattern Gallery',
    titleZh: '透明胶图案画廊',
    description: 'Various tape arrangements showing interference patterns',
    descriptionZh: '各种胶带排列展示的干涉图案',
    resourceIds: ['clear-tape', 'clear-tape-x', 'clear-tape-array', 'tape-roll'],
    displayMode: 'gallery',
    concept: 'thickness-interference',
  },
  {
    id: 'daily-objects',
    title: 'Daily Life Polarization',
    titleZh: '日常生活中的偏振',
    description: 'Discover polarization in everyday objects',
    descriptionZh: '发现日常物品中的偏振现象',
    resourceIds: ['glasses', 'water-bottle', 'sugar-bag', 'protective-film'],
    displayMode: 'gallery',
    concept: 'material-properties',
  },
  {
    id: 'stress-comparison',
    title: 'Tempered vs Ordinary Glass',
    titleZh: '钢化玻璃与普通玻璃对比',
    description: 'Side-by-side stress pattern comparison',
    descriptionZh: '应力图案对比',
    resourceIds: ['tempered-glass', 'ordinary-glass'],
    displayMode: 'comparison',
    concept: 'stress-visualization',
  },
  {
    id: 'optical-rotation',
    title: 'Optical Rotation Demo',
    titleZh: '旋光性演示',
    description: 'Optically active materials rotating polarization',
    descriptionZh: '旋光性物质旋转偏振方向',
    resourceIds: ['sugar-bag'],
    displayMode: 'single',
    concept: 'optical-activity',
  },
]

// ===== 时间线资源映射 =====
// 将资源与历史事件关联

export const TIMELINE_RESOURCE_MAPPINGS: TimelineResourceMapping[] = [
  {
    year: 1669,
    eventTitle: 'Birefringence Discovery',
    resourceIds: ['tempered-glass', 'plastic-wrap'],
    featuredResourceId: 'tempered-glass',
  },
  {
    year: 1808,
    eventTitle: 'Polarization by Reflection',
    resourceIds: ['glass-comparison'],
    featuredResourceId: 'glass-comparison',
  },
  {
    year: 1811,
    eventTitle: 'Chromatic Polarization',
    resourceIds: ['clear-tape-array', 'plastic-wrap-thickness', 'glass-heating-cooling'],
    featuredResourceId: 'clear-tape-array',
  },
  {
    year: 1815,
    eventTitle: 'Optical Rotation Discovery',
    resourceIds: ['sugar-bag'],
    featuredResourceId: 'sugar-bag',
  },
  {
    year: 1817,
    eventTitle: 'Transverse Wave Theory',
    resourceIds: ['plastic-wrap-stretching'],
  },
  {
    year: 1835,
    eventTitle: 'Arago Chromatic Polarization',
    resourceIds: ['glass-heating-cooling', 'plastic-wrap-thickness', 'clear-tape-array', 'tempered-glass', 'plastic-wrap'],
    featuredResourceId: 'clear-tape-array',
  },
  {
    year: 1906,
    eventTitle: 'Photoelasticity Method',
    resourceIds: ['tempered-glass', 'ordinary-glass', 'glass-comparison', 'glass-heating-cooling'],
    featuredResourceId: 'glass-comparison',
  },
]

// ===== 视频资源映射 =====
// 关联可用的实验视频文件

export interface VideoResource {
  id: string
  url: string
  title: string
  titleZh: string
  description: string
  descriptionZh: string
  relatedResourceIds: string[]  // 关联的图片资源
  relatedConcepts: ConceptType[]
  relatedModules: ModuleType[]
  duration?: number  // 秒
  category: 'experiment' | 'cultural'
}

export const VIDEO_RESOURCES: VideoResource[] = [
  // ===== 玻璃应力实验视频 =====
  {
    id: 'video-glass-heating',
    url: '/videos/chromatic-polarization/实验-打火机烧玻璃-正交偏振系统-长时间观察视频.mp4',
    title: 'Glass Heating Stress Evolution',
    titleZh: '玻璃加热应力演变',
    description: 'Watch thermal stress develop and dissipate in real-time',
    descriptionZh: '实时观察热应力的产生与消散',
    relatedResourceIds: ['glass-heating-cooling', 'glass-corner-heating', 'glass-cooled'],
    relatedConcepts: ['stress-visualization'],
    relatedModules: ['stress-analysis', 'photoelasticity', 'thermal-stress'],
    category: 'experiment',
  },
  {
    id: 'video-tempered-glass',
    url: '/videos/chromatic-polarization/实验-偏振片看钢化玻璃-朝西.mp4',
    title: 'Tempered Glass Under Polarizer',
    titleZh: '偏振片观察钢化玻璃',
    description: 'Stress patterns in tempered glass revealed by polarization',
    descriptionZh: '偏振光揭示钢化玻璃中的应力图案',
    relatedResourceIds: ['tempered-glass', 'glass-comparison'],
    relatedConcepts: ['stress-visualization'],
    relatedModules: ['stress-analysis', 'birefringence'],
    category: 'experiment',
  },
  // ===== 保鲜膜实验视频 =====
  {
    id: 'video-plastic-wrap-stretch',
    url: '/videos/chromatic-polarization/实验-保鲜膜拉伸-正交偏振系统-旋转样品视频.mp4',
    title: 'Plastic Wrap Stretching',
    titleZh: '保鲜膜拉伸实验',
    description: 'See how stretching changes birefringence and colors',
    descriptionZh: '观察拉伸如何改变双折射和颜色',
    relatedResourceIds: ['plastic-wrap', 'plastic-wrap-stretching'],
    relatedConcepts: ['stress-visualization', 'thickness-interference'],
    relatedModules: ['birefringence', 'waveplate', 'stress-analysis'],
    category: 'experiment',
  },
  {
    id: 'video-plastic-wrap-layers',
    url: '/videos/chromatic-polarization/实验-保鲜膜3次重叠-正交偏振系统-旋转样品视频.mp4',
    title: 'Plastic Wrap Layers',
    titleZh: '保鲜膜重叠实验',
    description: 'Color changes with increasing layers',
    descriptionZh: '层数增加时颜色的变化',
    relatedResourceIds: ['plastic-wrap-thickness'],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['birefringence', 'chromatic-polarization'],
    category: 'experiment',
  },
  // ===== 透明胶实验视频 =====
  {
    id: 'video-tape-rotate-sample',
    url: '/videos/chromatic-polarization/实验-透明胶条-正交偏振系统-旋转样品视频.mp4',
    title: 'Clear Tape Sample Rotation',
    titleZh: '透明胶条旋转样品',
    description: 'Rotating the tape sample shows angle-dependent colors',
    descriptionZh: '旋转样品展示角度相关的颜色变化',
    relatedResourceIds: ['clear-tape'],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['birefringence', 'malus-law'],
    category: 'experiment',
  },
  {
    id: 'video-tape-rotate-polarizer',
    url: '/videos/chromatic-polarization/实验-透明胶条-正交偏振系统-旋转偏振片视频.mp4',
    title: 'Clear Tape Polarizer Rotation',
    titleZh: '透明胶条旋转偏振片',
    description: 'Rotating the polarizer reveals color shifts',
    descriptionZh: '旋转偏振片揭示颜色变化',
    relatedResourceIds: ['clear-tape'],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['malus-law', 'polarization-intro'],
    category: 'experiment',
  },
  {
    id: 'video-tape-x',
    url: '/videos/chromatic-polarization/实验-透明胶条（X）-正交偏振系统-旋转样品视频.mp4',
    title: 'X-Pattern Tape Rotation',
    titleZh: 'X形透明胶旋转',
    description: 'X-pattern showing overlapping birefringence',
    descriptionZh: 'X形图案展示重叠的双折射效果',
    relatedResourceIds: ['clear-tape-x'],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['interference', 'birefringence'],
    category: 'experiment',
  },
  {
    id: 'video-tape-array',
    url: '/videos/chromatic-polarization/实验-透明胶条（重叠阵列）-正交偏振系统-旋转偏振片视频.mp4',
    title: 'Tape Array Color Gradients',
    titleZh: '透明胶阵列色彩渐变',
    description: 'Beautiful color gradients from overlapping tape strips',
    descriptionZh: '重叠胶条产生的美丽色彩渐变',
    relatedResourceIds: ['clear-tape-array'],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['chromatic-polarization', 'interference'],
    category: 'experiment',
  },
  // ===== 日常物品视频 =====
  {
    id: 'video-glasses',
    url: '/videos/chromatic-polarization/实验-眼镜-正交偏振系统-旋转样品视频.mp4',
    title: 'Eyeglasses Under Polarizer',
    titleZh: '偏振光下的眼镜',
    description: 'Stress patterns in eyeglass lenses',
    descriptionZh: '眼镜镜片中的应力图案',
    relatedResourceIds: ['glasses'],
    relatedConcepts: ['stress-visualization', 'material-properties'],
    relatedModules: ['daily-polarization', 'stress-analysis'],
    category: 'experiment',
  },
  {
    id: 'video-water-bottle',
    url: '/videos/chromatic-polarization/实验-矿泉水瓶-正交偏振系统-旋转样品视频.mp4',
    title: 'Water Bottle Stress Patterns',
    titleZh: '矿泉水瓶应力图案',
    description: 'Blow molding stress revealed in PET bottles',
    descriptionZh: '吹塑工艺在PET瓶中留下的应力',
    relatedResourceIds: ['water-bottle'],
    relatedConcepts: ['stress-visualization', 'material-properties'],
    relatedModules: ['daily-polarization', 'stress-analysis'],
    category: 'experiment',
  },
  {
    id: 'video-sugar-bag',
    url: '/videos/chromatic-polarization/实验-白砂糖袋子-正交偏振系统-旋转样品视频.mp4',
    title: 'Sugar Bag Optical Rotation',
    titleZh: '白砂糖袋子旋光',
    description: 'Chiral sugar molecules rotate polarization plane',
    descriptionZh: '手性糖分子旋转偏振面',
    relatedResourceIds: ['sugar-bag'],
    relatedConcepts: ['optical-activity'],
    relatedModules: ['optical-rotation', 'daily-polarization'],
    category: 'experiment',
  },
  // ===== 文创艺术视频 =====
  {
    id: 'video-usagi',
    url: '/videos/chromatic-polarization/文创-乌萨奇-正交偏振系统（竖直）-旋转样品视频.mp4',
    title: 'Usagi Polarization Art',
    titleZh: '乌萨奇偏振艺术',
    description: 'Artistic creation using chromatic polarization',
    descriptionZh: '利用色偏振制作的艺术创作',
    relatedResourceIds: [],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['chromatic-polarization'],
    category: 'cultural',
  },
  {
    id: 'video-simpsons-bart',
    url: '/videos/chromatic-polarization/文创-辛普森一家巴特-正交偏振系统-旋转偏振片视频.mp4',
    title: 'Simpsons Bart Polarization Art',
    titleZh: '辛普森巴特偏振艺术',
    description: 'The Simpsons character in polarized light',
    descriptionZh: '辛普森角色的偏振光艺术',
    relatedResourceIds: [],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['chromatic-polarization'],
    category: 'cultural',
  },
  {
    id: 'video-simpsons-lisa',
    url: '/videos/chromatic-polarization/文创-辛普森一家丽莎-正交偏振系统-旋转偏振片视频.mp4',
    title: 'Simpsons Lisa Polarization Art',
    titleZh: '辛普森丽莎偏振艺术',
    description: 'Lisa Simpson in polarized light',
    descriptionZh: '丽莎辛普森的偏振光艺术',
    relatedResourceIds: [],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['chromatic-polarization'],
    category: 'cultural',
  },
  {
    id: 'video-college-logo',
    url: '/videos/chromatic-polarization/文创-学院logo-正交偏振系统-旋转偏振片视频.mp4',
    title: 'College Logo Polarization Art',
    titleZh: '学院Logo偏振艺术',
    description: 'College logo created with chromatic polarization',
    descriptionZh: '用色偏振制作的学院Logo',
    relatedResourceIds: [],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['chromatic-polarization'],
    category: 'cultural',
  },
  {
    id: 'video-cat-dog',
    url: '/videos/chromatic-polarization/文创-小猫小狗-正交偏振系统-旋转偏振片视频.mp4',
    title: 'Cat & Dog Polarization Art',
    titleZh: '小猫小狗偏振艺术',
    description: 'Cute pets in polarized light',
    descriptionZh: '可爱宠物的偏振光艺术',
    relatedResourceIds: [],
    relatedConcepts: ['thickness-interference'],
    relatedModules: ['chromatic-polarization'],
    category: 'cultural',
  },
]

// ===== Helper Functions =====

/** 获取模块相关的所有资源（图片+视频） */
export function getModuleResources(moduleId: ModuleType): {
  images: PolarizationResource[]
  videos: VideoResource[]
} {
  const images = getResourcesByModule(moduleId)
  const videos = VIDEO_RESOURCES.filter(v => v.relatedModules.includes(moduleId))
  return { images, videos }
}

/** 获取概念相关的资源组 */
export function getConceptResourceGroups(concept: ConceptType): ResourceGroup[] {
  return RESOURCE_GROUPS.filter(g => g.concept === concept)
}

/** 获取时间线事件的资源 */
export function getTimelineResources(year: number): {
  images: PolarizationResource[]
  videos: VideoResource[]
  featuredImage?: PolarizationResource
} | null {
  const mapping = TIMELINE_RESOURCE_MAPPINGS.find(m => m.year === year)
  if (!mapping) return null

  const images = mapping.resourceIds
    .map(id => getResourceById(id))
    .filter((r): r is PolarizationResource => r !== undefined)

  const featuredImage = mapping.featuredResourceId
    ? getResourceById(mapping.featuredResourceId)
    : images[0]

  // 查找关联的视频
  const videos = VIDEO_RESOURCES.filter(v =>
    v.relatedResourceIds.some(rid => mapping.resourceIds.includes(rid))
  )

  return { images, videos, featuredImage }
}

/** 获取资源组的完整数据 */
export function getResourceGroupWithData(groupId: string): {
  group: ResourceGroup
  resources: PolarizationResource[]
  videos: VideoResource[]
} | null {
  const group = RESOURCE_GROUPS.find(g => g.id === groupId)
  if (!group) return null

  const resources = group.resourceIds
    .map(id => getResourceById(id))
    .filter((r): r is PolarizationResource => r !== undefined)

  const videos = VIDEO_RESOURCES.filter(v =>
    v.relatedResourceIds.some(rid => group.resourceIds.includes(rid))
  )

  return { group, resources, videos }
}

/** 获取所有实验视频 */
export function getExperimentVideos(): VideoResource[] {
  return VIDEO_RESOURCES.filter(v => v.category === 'experiment')
}

/** 获取所有文创视频 */
export function getCulturalVideos(): VideoResource[] {
  return VIDEO_RESOURCES.filter(v => v.category === 'cultural')
}

/** 根据视频ID获取视频资源 */
export function getVideoById(id: string): VideoResource | undefined {
  return VIDEO_RESOURCES.find(v => v.id === id)
}

/** 获取资源的关联视频 */
export function getResourceVideos(resourceId: string): VideoResource[] {
  return VIDEO_RESOURCES.filter(v => v.relatedResourceIds.includes(resourceId))
}

/** 统计信息 */
export const REGISTRY_STATS = {
  totalResourceGroups: RESOURCE_GROUPS.length,
  totalVideoResources: VIDEO_RESOURCES.length,
  experimentVideos: getExperimentVideos().length,
  culturalVideos: getCulturalVideos().length,
  timelineMappings: TIMELINE_RESOURCE_MAPPINGS.length,
}
