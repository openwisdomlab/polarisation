# Source Code Access Feature - 演示源码开放计划

## 📋 需求分析

### 目标用户
- **高级学习者**: 想要深入理解实现原理
- **开发者**: 希望复用和修改代码
- **教育工作者**: 需要定制化教学内容
- **研究人员**: 用于学术研究和论文复现

### 核心需求
1. ✅ **查看源码**: 在页面内直接查看demo的完整源代码
2. ✅ **语法高亮**: 代码高亮显示，易于阅读
3. ✅ **复制代码**: 一键复制到剪贴板
4. ✅ **下载源码**: 下载单个demo的完整代码包
5. ✅ **独立运行**: 下载后可以独立运行和修改
6. 🔧 **在线编辑**: 在线实时编辑和预览（可选）
7. 🔧 **代码沙箱**: 一键在CodeSandbox/StackBlitz中打开（可选）

## 🎯 实现方案（三阶段）

### Phase 1: 源码查看和下载 ⭐ (优先级最高)

#### 1.1 组件架构

```
src/components/demos/
├── source-code/
│   ├── SourceCodeViewer.tsx      # 源码查看器主组件
│   ├── CodeBlock.tsx              # 代码块组件（语法高亮）
│   ├── SourceCodeButton.tsx       # "View Source"按钮
│   ├── DownloadButton.tsx         # 下载按钮
│   └── index.ts                   # 导出
└── ...existing demos
```

#### 1.2 功能特性

**SourceCodeViewer组件**:
```tsx
interface SourceCodeViewerProps {
  demoId: string              // Demo唯一标识
  demoName: string            // Demo名称
  sourceCode: string          // 源代码内容
  language?: string           // 语言 (tsx/ts/jsx/js)
  dependencies?: string[]     // 依赖列表
  description?: string        // 代码说明
  showLineNumbers?: boolean   // 显示行号
  highlightLines?: number[]   // 高亮特定行
}
```

**主要功能**:
- 📖 语法高亮显示（使用Prism.js或react-syntax-highlighter）
- 📋 复制代码到剪贴板
- 💾 下载单文件（.tsx）
- 📦 下载完整包（包含依赖和配置）
- 🔍 代码搜索
- 📏 折叠/展开代码块
- 🎨 主题切换（light/dark/高对比度）

#### 1.3 源码获取方式

**方案A: 构建时读取（推荐）**
```typescript
// 使用Vite的?raw后缀导入源码
import MalusLawDemoSource from './unit1/MalusLawDemo.tsx?raw'

// 在DEMOS配置中添加source字段
{
  id: 'malus-law',
  component: MalusLawDemo,
  sourceCode: MalusLawDemoSource,
  dependencies: ['framer-motion', 'lucide-react'],
}
```

**方案B: 运行时通过API获取**
```typescript
// 通过fetch从public目录读取
const sourceCode = await fetch(`/demo-sources/${demoId}.tsx`).then(r => r.text())
```

**推荐**: 方案A（构建时），因为：
- 不需要额外的HTTP请求
- 构建时就能验证源码存在
- 更好的性能

#### 1.4 下载包结构

**单文件下载**: `MalusLawDemo.tsx`

**完整包下载**: `MalusLawDemo-standalone.zip`
```
MalusLawDemo-standalone/
├── README.md                 # 运行说明
├── package.json              # 依赖配置
├── tsconfig.json             # TypeScript配置
├── vite.config.ts            # Vite配置
├── index.html                # 入口HTML
├── src/
│   ├── App.tsx               # 包装器
│   ├── MalusLawDemo.tsx      # Demo源码
│   ├── DemoControls.tsx      # 控件组件（如果需要）
│   └── styles.css            # 样式
└── public/
    └── assets/               # 资源文件
```

### Phase 2: 独立运行支持 🔧

#### 2.1 模板生成器

创建一个构建时脚本，自动为每个demo生成standalone版本：

```typescript
// scripts/generate-demo-packages.ts
interface DemoPackageConfig {
  demoId: string
  demoName: string
  dependencies: Record<string, string>
  sourceFiles: string[]
  description: string
}

function generateStandalonePackage(config: DemoPackageConfig): void {
  // 1. 创建临时目录
  // 2. 复制必要文件
  // 3. 生成package.json
  // 4. 生成README.md
  // 5. 打包为zip
  // 6. 保存到public/demo-packages/
}
```

#### 2.2 README模板

```markdown
# {Demo Name} - Standalone Version

## Overview
{Description}

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Build for Production
\`\`\`bash
npm run build
\`\`\`

## Dependencies
- React 19.0.0
- Framer Motion (for animations)
- Lucide React (for icons)
- [... other dependencies]

## Customization
[... 自定义说明]

## License
MIT License - Free to use and modify

## Attribution
Original demo from PolarCraft (https://polarcraft.app)
Created with ❤️ by the PolarCraft Team
```

#### 2.3 Package.json模板

```json
{
  "name": "@polarcraft/demo-{demo-id}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

### Phase 3: 在线编辑器集成 🚀 (可选)

#### 3.1 StackBlitz集成

```tsx
import { openProject } from '@stackblitz/sdk'

async function openInStackBlitz(demoId: string) {
  const project = {
    title: `PolarCraft Demo - ${demoName}`,
    description: 'Interactive polarization optics demo',
    template: 'node' as const,
    files: {
      'index.html': generateHTML(),
      'package.json': generatePackageJson(),
      'src/App.tsx': sourceCode,
      'src/main.tsx': generateMainEntry(),
      'vite.config.ts': generateViteConfig(),
    },
  }

  openProject(project, {
    newWindow: true,
    openFile: 'src/App.tsx',
  })
}
```

#### 3.2 CodeSandbox集成

```tsx
function openInCodeSandbox(demoId: string) {
  const parameters = {
    files: {
      'package.json': {
        content: generatePackageJson(),
      },
      'src/App.tsx': {
        content: sourceCode,
      },
      // ... more files
    },
  }

  const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${
    compress(JSON.stringify(parameters))
  }`

  window.open(url, '_blank')
}
```

## 🎨 UI/UX设计

### 1. "View Source"按钮位置

**选项A: Demo顶部工具栏**
```
┌─────────────────────────────────────┐
│ Malus's Law Demo        [View Source│ ← 按钮
├─────────────────────────────────────┤
│                                     │
│        Demo Content                 │
│                                     │
└─────────────────────────────────────┘
```

**选项B: Demo底部**
```
┌─────────────────────────────────────┐
│        Demo Content                 │
├─────────────────────────────────────┤
│ 📖 Principle  |  💡 Tips  | </> Source│ ← 标签页
└─────────────────────────────────────┘
```

**推荐**: 选项B - 作为标签页的一部分，与"原理"、"提示"并列

### 2. 源码查看器Modal设计

```
┌──────────────────────────────────────────────┐
│ MalusLawDemo.tsx                    [✕]      │
├──────────────────────────────────────────────┤
│ [📋 Copy] [💾 Download] [🚀 Open in Sandbox] │
├──────────────────────────────────────────────┤
│   1  import { useState } from 'react'        │
│   2  import { motion } from 'framer-motion'  │
│   3                                          │
│   4  export function MalusLawDemo() {        │
│   5    const [angle, setAngle] = useState(0) │
│   6    ...                                   │
│                                              │
│  [Scroll area with syntax highlighting]     │
│                                              │
├──────────────────────────────────────────────┤
│ Dependencies: react, framer-motion, lucide   │
└──────────────────────────────────────────────┘
```

### 3. 下载选项Menu

```
┌──────────────────────────────┐
│ Download Options             │
├──────────────────────────────┤
│ 📄 Source File (.tsx)        │
│ 📦 Standalone Package (.zip) │
│ 📋 Copy to Clipboard         │
└──────────────────────────────┘
```

## 📦 技术栈选择

### 语法高亮库对比

| 库 | 大小 | 特性 | 推荐度 |
|---|---|---|---|
| **Prism.js** | ~2KB | 轻量、主题丰富 | ⭐⭐⭐⭐⭐ |
| react-syntax-highlighter | ~40KB | React组件、功能全 | ⭐⭐⭐⭐ |
| Shiki | ~3MB | VS Code同款、超精确 | ⭐⭐⭐ |
| Highlight.js | ~5KB | 自动语言检测 | ⭐⭐⭐⭐ |

**推荐**: **Prism.js** + 手动包装React组件
- 体积最小
- 主题选择多
- 性能好
- 足够的功能

### 依赖安装

```bash
npm install prismjs
npm install --save-dev @types/prismjs
npm install jszip  # 用于打包下载
```

### 可选依赖（Phase 3）

```bash
npm install @stackblitz/sdk  # StackBlitz集成
npm install lz-string        # CodeSandbox URL压缩
```

## 🔧 实现细节

### 1. 源码注册系统

```typescript
// src/data/demo-sources.ts
import MalusLawDemoSource from '@/components/demos/unit1/MalusLawDemo.tsx?raw'
import BirefringenceDemoSource from '@/components/demos/unit1/BirefringenceDemo.tsx?raw'
// ... 更多导入

export interface DemoSourceMetadata {
  id: string
  name: string
  nameZh: string
  sourceCode: string
  language: 'tsx' | 'ts' | 'jsx' | 'js'
  dependencies: Record<string, string>
  description: string
  descriptionZh: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  relatedDemos?: string[]
}

export const DEMO_SOURCES: Record<string, DemoSourceMetadata> = {
  'malus-law': {
    id: 'malus-law',
    name: "Malus's Law Demo",
    nameZh: '马吕斯定律演示',
    sourceCode: MalusLawDemoSource,
    language: 'tsx',
    dependencies: {
      'react': '^19.0.0',
      'framer-motion': '^11.0.0',
      'lucide-react': '^0.460.0',
    },
    description: 'Interactive demo showing intensity variation through polarizers',
    descriptionZh: '展示通过偏振片的光强变化的交互演示',
    complexity: 'beginner',
    tags: ['polarization', 'malus-law', 'intensity'],
  },
  // ... 更多demo源码配置
}

export function getDemoSource(demoId: string): DemoSourceMetadata | null {
  return DEMO_SOURCES[demoId] || null
}
```

### 2. SourceCodeViewer实现

```tsx
// src/components/demos/source-code/SourceCodeViewer.tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Download, ExternalLink, Check } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'

interface SourceCodeViewerProps {
  demoId: string
  onClose: () => void
}

export function SourceCodeViewer({ demoId, onClose }: SourceCodeViewerProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [copied, setCopied] = useState(false)

  const metadata = getDemoSource(demoId)
  if (!metadata) return null

  const highlightedCode = Prism.highlight(
    metadata.sourceCode,
    Prism.languages.tsx,
    'tsx'
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(metadata.sourceCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([metadata.sourceCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${demoId}.tsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPackage = async () => {
    // 使用JSZip打包完整项目
    const zip = await generateStandalonePackage(metadata)
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${demoId}-standalone.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-white">
              {isZh ? metadata.nameZh : metadata.name}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {isZh ? metadata.descriptionZh : metadata.description}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded">
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-4 border-b border-slate-700">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : (isZh ? '复制' : 'Copy')}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          >
            <Download className="w-4 h-4" />
            {isZh ? '下载源文件' : 'Download Source'}
          </button>

          <button
            onClick={handleDownloadPackage}
            className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-sm"
          >
            <Download className="w-4 h-4" />
            {isZh ? '下载完整包' : 'Download Package'}
          </button>

          {/* Phase 3: Sandbox buttons */}
          <div className="ml-auto">
            <span className="text-xs text-slate-500">
              {metadata.complexity === 'beginner' && '🟢 Beginner'}
              {metadata.complexity === 'intermediate' && '🟡 Intermediate'}
              {metadata.complexity === 'advanced' && '🔴 Advanced'}
            </span>
          </div>
        </div>

        {/* Code Display */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950">
          <pre className="text-sm">
            <code
              className="language-tsx"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>

        {/* Footer - Dependencies */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <p className="text-xs text-slate-400 mb-2">
            {isZh ? '依赖项:' : 'Dependencies:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(metadata.dependencies).map(([name, version]) => (
              <span
                key={name}
                className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300"
              >
                {name}@{version}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 3. 集成到DemosPage

```tsx
// src/pages/DemosPage.tsx
import { SourceCodeViewer } from '@/components/demos/source-code'

function DemosPage() {
  const [viewingSource, setViewingSource] = useState<string | null>(null)

  return (
    <div>
      {/* Demo display */}
      <DemoComponent {...} />

      {/* View Source button */}
      <button
        onClick={() => setViewingSource(demoId)}
        className="..."
      >
        </> {isZh ? '查看源码' : 'View Source'}
      </button>

      {/* Source Code Modal */}
      {viewingSource && (
        <SourceCodeViewer
          demoId={viewingSource}
          onClose={() => setViewingSource(null)}
        />
      )}
    </div>
  )
}
```

## 📊 实现优先级

### P0 - 核心功能 (必须实现)
- [ ] SourceCodeViewer组件
- [ ] Prism.js集成
- [ ] 复制代码功能
- [ ] 下载单文件功能
- [ ] 在DemosPage中集成
- [ ] 源码注册系统

### P1 - 重要功能 (第二阶段)
- [ ] 下载完整包功能
- [ ] 生成standalone项目
- [ ] README生成
- [ ] 依赖版本管理

### P2 - 增强功能 (可选)
- [ ] StackBlitz集成
- [ ] CodeSandbox集成
- [ ] 代码搜索
- [ ] 主题切换

## 🎓 教育价值

### 1. 学习路径
- **初级**: 阅读源码，理解实现
- **中级**: 下载并修改参数
- **高级**: 基于源码创建新demo

### 2. 代码注释增强

在导出源码前，可以添加更详细的注释：

```tsx
/**
 * Malus's Law Interactive Demo
 *
 * This demo visualizes the intensity variation of polarized light
 * passing through a rotating polarizer, following Malus's Law:
 * I = I₀ × cos²(θ)
 *
 * Key Concepts:
 * - Polarization angle control
 * - Intensity calculation
 * - Real-time visualization
 *
 * Technologies:
 * - React for component structure
 * - Framer Motion for animations
 * - SVG for visualization
 *
 * @see https://en.wikipedia.org/wiki/Polarizer#Malus's_law
 */
export function MalusLawDemo() {
  // State: polarizer angle (0-180 degrees)
  const [angle, setAngle] = useState(0)

  // Calculate output intensity using Malus's Law
  const intensity = Math.cos((angle * Math.PI) / 180) ** 2

  // ... rest of implementation
}
```

### 3. 学习资源链接

在README中添加：
```markdown
## Learning Resources
- [Malus's Law Wikipedia](https://en.wikipedia.org/wiki/Polarizer#Malus's_law)
- [Original Demo](https://polarcraft.app/demos/malus-law)
- [React Documentation](https://react.dev)
- [Framer Motion Guide](https://www.framer.com/motion/)
```

## 🔐 许可证考虑

### 开源许可证建议

**推荐**: MIT License

```markdown
MIT License

Copyright (c) 2026 PolarCraft Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

**在每个源文件顶部添加**:
```tsx
/**
 * Copyright (c) 2026 PolarCraft Team
 * Licensed under MIT License
 * https://github.com/polarcraft/demos
 */
```

## 📈 成功指标

### 使用统计
- 源码查看次数
- 下载次数（单文件 vs 完整包）
- 在线沙箱打开次数
- 用户反馈评分

### 教育影响
- 引用次数（学术论文）
- 二次开发项目数量
- 社区贡献（PR数量）

## 🚀 实施时间线

### Week 1: Phase 1 基础实现
- Day 1-2: SourceCodeViewer组件
- Day 3-4: 源码注册系统
- Day 5: 集成到DemosPage
- Day 6-7: 测试和修复

### Week 2: Phase 2 独立运行
- Day 1-3: 包生成器
- Day 4-5: README模板
- Day 6-7: 测试完整流程

### Week 3: Phase 3 在线编辑 (可选)
- Day 1-2: StackBlitz集成
- Day 3-4: CodeSandbox集成
- Day 5-7: 优化和文档

## 💡 用户体验考虑

### 1. 首次访问引导
```
┌────────────────────────────────┐
│ 🎉 New Feature!                │
│                                │
│ You can now view and download  │
│ source code for all demos!     │
│                                │
│ Click the "</>" button to get  │
│ started.                       │
│                                │
│ [Got it!]     [Learn More]     │
└────────────────────────────────┘
```

### 2. 下载后提示
```
✅ Download Complete!

Next steps:
1. Extract the zip file
2. Run: npm install
3. Run: npm run dev
4. Open http://localhost:5173

📖 See README.md for details
```

### 3. 难度警告（高级demo）
```
⚠️ Advanced Demo

This demo uses advanced concepts:
- Complex state management
- Custom hooks
- WebGL shaders

Recommended for developers with
React and TypeScript experience.

[Continue]  [Choose easier demo]
```

## 🎯 下一步行动

### 立即决策需要：

1. **是否需要Phase 3（在线编辑器）**？
   - 如果只是提供学习和下载，Phase 1+2足够
   - 如果希望用户能在线实验，需要Phase 3

2. **源码注释详细程度**？
   - 简洁版：保持现有注释
   - 教学版：添加详细解释性注释

3. **是否生成所有demo的standalone包**？
   - 全部生成：构建时间长，但用户体验好
   - 按需生成：首次下载时生成，需要服务端支持

4. **许可证选择确认**？
   - MIT（最宽松）
   - GPL（要求衍生作品开源）
   - CC BY（要求署名）

### 技术准备：

```bash
# 安装必要依赖
npm install prismjs @types/prismjs
npm install jszip

# 可选：在线编辑器
npm install @stackblitz/sdk lz-string
```

## ❓ 需要调用的Skill

基于此功能，可能有用的skill：

1. **markitdown** - 如果需要从PDF文档提取教学材料
2. 暂无其他直接相关的skill

不过这个功能主要是前端开发，不太需要特殊的skill支持。

---

**准备好开始实施了吗？请确认：**
1. 是否从Phase 1开始？
2. 是否需要调整优先级？
3. 是否有其他特殊需求？
