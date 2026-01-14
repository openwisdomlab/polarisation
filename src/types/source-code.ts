/**
 * Source Code Type Definitions
 * 源码类型定义
 *
 * Supports multi-language source code access for educational demos
 * 支持多语言源码访问的教学演示系统
 */

/**
 * Supported programming languages for demos
 * 支持的演示编程语言
 */
export type SourceLanguage = 'typescript' | 'python' | 'matlab' | 'julia' | 'r'

/**
 * Language metadata for display and processing
 * 语言元数据，用于显示和处理
 */
export interface LanguageInfo {
  id: SourceLanguage
  name: string
  nameZh: string
  icon: string // emoji
  fileExtension: string
  highlightLanguage: string // Prism.js language key
  color: string // Brand color
  description: string
  descriptionZh: string
  category: 'web' | 'scientific' | 'statistical'
}

/**
 * Language information registry
 * 语言信息注册表
 */
export const LANGUAGE_INFO: Record<SourceLanguage, LanguageInfo> = {
  typescript: {
    id: 'typescript',
    name: 'TypeScript/React',
    nameZh: 'TypeScript/React',
    icon: '🌐',
    fileExtension: '.tsx',
    highlightLanguage: 'tsx',
    color: '#3178c6',
    description: 'Interactive web demo (recommended for online experience)',
    descriptionZh: '交互式网页演示（推荐在线体验）',
    category: 'web',
  },
  python: {
    id: 'python',
    name: 'Python',
    nameZh: 'Python',
    icon: '🐍',
    fileExtension: '.py',
    highlightLanguage: 'python',
    color: '#3776ab',
    description: 'Scientific computing with NumPy + Matplotlib (most popular)',
    descriptionZh: '科学计算 NumPy + Matplotlib（最流行）',
    category: 'scientific',
  },
  matlab: {
    id: 'matlab',
    name: 'MATLAB/Octave',
    nameZh: 'MATLAB/Octave',
    icon: '🔬',
    fileExtension: '.m',
    highlightLanguage: 'matlab',
    color: '#e16737',
    description: 'Traditional scientific computing standard',
    descriptionZh: '传统科学计算标准',
    category: 'scientific',
  },
  julia: {
    id: 'julia',
    name: 'Julia',
    nameZh: 'Julia',
    icon: '🚀',
    fileExtension: '.jl',
    highlightLanguage: 'julia',
    color: '#9558b2',
    description: 'Modern high-performance scientific computing',
    descriptionZh: '现代高性能科学计算',
    category: 'scientific',
  },
  r: {
    id: 'r',
    name: 'R',
    nameZh: 'R',
    icon: '📊',
    fileExtension: '.R',
    highlightLanguage: 'r',
    color: '#276dc3',
    description: 'Statistical computing and data visualization',
    descriptionZh: '统计计算与数据可视化',
    category: 'statistical',
  },
}

/**
 * Source code implementation for a specific language
 * 特定语言的源码实现
 */
export interface LanguageImplementation {
  language: SourceLanguage
  sourceCode: string
  dependencies: Record<string, string>
  setup?: string // Setup instructions (e.g., conda environment)
  setupZh?: string
  notes?: string // Special notes for this implementation
  notesZh?: string
}

/**
 * Complete demo source code with multiple language implementations
 * 包含多语言实现的完整演示源码
 */
export interface DemoSourceCode {
  /** Unique demo identifier */
  id: string

  /** Demo name (English) */
  name: string

  /** Demo name (Chinese) */
  nameZh: string

  /** Brief description */
  description: string
  descriptionZh: string

  /** Learning complexity level */
  complexity: 'beginner' | 'intermediate' | 'advanced'

  /** Physical concepts demonstrated */
  concepts: string[]
  conceptsZh: string[]

  /** Related demos */
  relatedDemos?: string[]

  /** Tags for categorization */
  tags: string[]

  /** Language implementations */
  implementations: LanguageImplementation[]

  /** Learning resources */
  resources?: LearningResource[]
}

/**
 * Learning resource link
 * 学习资源链接
 */
export interface LearningResource {
  type: 'documentation' | 'tutorial' | 'paper' | 'video' | 'book'
  title: string
  titleZh?: string
  url: string
  description?: string
  descriptionZh?: string
}

/**
 * Package download options
 * 包下载选项
 */
export interface PackageDownloadOptions {
  /** Include README */
  includeReadme: boolean

  /** Include dependencies file (requirements.txt, package.json, etc.) */
  includeDependencies: boolean

  /** Include setup/configuration files */
  includeConfig: boolean

  /** Include example data (if applicable) */
  includeData: boolean

  /** Include LICENSE file */
  includeLicense: boolean
}

/**
 * Default package download options
 */
export const DEFAULT_PACKAGE_OPTIONS: PackageDownloadOptions = {
  includeReadme: true,
  includeDependencies: true,
  includeConfig: true,
  includeData: false,
  includeLicense: true,
}
