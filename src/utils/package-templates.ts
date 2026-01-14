/**
 * Package Templates for Different Languages
 * 不同语言的包模板
 *
 * Generates language-specific project files (README, dependencies, config, etc.)
 * 生成特定语言的项目文件（README、依赖、配置等）
 */

import JSZip from 'jszip'
import type { DemoSourceCode, LanguageImplementation } from '@/types/source-code'

// ============================================================================
// PYTHON PACKAGE GENERATOR
// Python 包生成器
// ============================================================================

export async function generatePythonPackage(
  zip: JSZip,
  demo: DemoSourceCode,
  impl: LanguageImplementation
): Promise<void> {
  // Main source file
  zip.file(`${demo.id}.py`, impl.sourceCode)

  // requirements.txt
  const requirementsTxt = Object.entries(impl.dependencies)
    .map(([pkg, version]) =>
      typeof version === 'string' && version.match(/^[\d\^~>=<]/)
        ? `${pkg}${version}`
        : `${pkg}>=${version}`
    )
    .join('\n')

  zip.file('requirements.txt', requirementsTxt)

  // README.md
  const readmeContent = `# ${demo.name} - Python Implementation
# ${demo.nameZh} - Python 实现

${demo.description}

${demo.descriptionZh}

## 📋 Requirements 环境要求

- Python 3.8 or later (Python 3.8 或更高版本)
- pip package manager (pip 包管理器)

## 🚀 Quick Start 快速开始

### 1. Create Virtual Environment (Optional but Recommended)
### 1. 创建虚拟环境（可选但推荐）

\`\`\`bash
# Create virtual environment
# 创建虚拟环境
python -m venv venv

# Activate (Linux/macOS)
# 激活（Linux/macOS）
source venv/bin/activate

# Activate (Windows)
# 激活（Windows）
venv\\Scripts\\activate
\`\`\`

### 2. Install Dependencies 安装依赖

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 3. Run the Demo 运行演示

\`\`\`bash
python ${demo.id}.py
\`\`\`

## 📦 Dependencies 依赖项

${Object.entries(impl.dependencies)
  .map(([pkg, version]) => `- \`${pkg}\`: ${version}`)
  .join('\n')}

## 🎓 Learning Objectives 学习目标

${demo.concepts.map((concept, idx) => `- ${concept} (${demo.conceptsZh[idx]})`).join('\n')}

## 🔧 Customization 自定义

You can modify the following parameters in the script:
您可以在脚本中修改以下参数：

- \`I0\`: Initial light intensity (初始光强)
- \`WAVELENGTH\`: Light wavelength in nm (光波长，纳米)
- \`FIG_SIZE\`: Figure size (图形尺寸)
- \`DPI\`: Display resolution (显示分辨率)

## 📚 Additional Resources 更多资源

See \`LEARNING_RESOURCES.md\` for links to tutorials and documentation.
查看 \`LEARNING_RESOURCES.md\` 获取教程和文档链接。

## 📄 License 许可证

- Code: MIT License (代码：MIT 许可证)
- Documentation: CC BY 4.0 (文档：CC BY 4.0)

See \`LICENSE\` and \`ATTRIBUTION.md\` for details.
详见 \`LICENSE\` 和 \`ATTRIBUTION.md\` 文件。

---

**Created by PolarCraft Team** | **由 PolarCraft 团队创建**

🌐 https://polarcraft.app
`

  zip.file('README.md', readmeContent)

  // .gitignore
  const gitignoreContent = `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
.venv

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
`

  zip.file('.gitignore', gitignoreContent)
}

// ============================================================================
// MATLAB PACKAGE GENERATOR
// MATLAB 包生成器
// ============================================================================

export async function generateMatlabPackage(
  zip: JSZip,
  demo: DemoSourceCode,
  impl: LanguageImplementation
): Promise<void> {
  // Main source file
  zip.file(`${demo.id}.m`, impl.sourceCode)

  // README.md
  const readmeContent = `# ${demo.name} - MATLAB/Octave Implementation
# ${demo.nameZh} - MATLAB/Octave 实现

${demo.description}

${demo.descriptionZh}

## 📋 Requirements 环境要求

### MATLAB
- MATLAB R2016b or later
- No additional toolboxes required (无需额外工具箱)

### GNU Octave (Free Alternative 免费替代)
- GNU Octave 4.0 or later
- Download: https://octave.org

## 🚀 Quick Start 快速开始

### In MATLAB (在 MATLAB 中):

1. Open MATLAB
2. Navigate to the folder containing \`${demo.id}.m\`
   导航到包含 \`${demo.id}.m\` 的文件夹
3. Run the script: 运行脚本:
   \`\`\`matlab
   ${demo.id}
   \`\`\`

### In GNU Octave (在 GNU Octave 中):

1. Open Octave
2. Navigate to the script folder 导航到脚本文件夹
3. Run: 运行:
   \`\`\`octave
   ${demo.id}
   \`\`\`

## 🎓 Learning Objectives 学习目标

${demo.concepts.map((concept, idx) => `- ${concept} (${demo.conceptsZh[idx]})`).join('\n')}

## 🔧 Customization 自定义

You can modify the constants at the beginning of the script:
您可以在脚本开头修改常量：

- \`I0\`: Initial light intensity (初始光强)
- \`WAVELENGTH\`: Light wavelength in nm (光波长)
- \`ANGLE_MIN\`, \`ANGLE_MAX\`: Angle range (角度范围)
- \`NUM_POINTS\`: Curve resolution (曲线分辨率)

## 💡 Features 特性

- Interactive slider control 交互式滑动条控制
- Real-time visualization 实时可视化
- Multiple synchronized plots 多个同步图表
- Educational annotations 教学注释

## 📚 Additional Resources 更多资源

See \`LEARNING_RESOURCES.md\` for tutorials and references.
查看 \`LEARNING_RESOURCES.md\` 获取教程和参考资料。

## 📄 License 许可证

- Code: MIT License (代码：MIT 许可证)
- Documentation: CC BY 4.0 (文档：CC BY 4.0)

See \`LICENSE\` and \`ATTRIBUTION.md\` for details.
详见 \`LICENSE\` 和 \`ATTRIBUTION.md\` 文件。

---

**Created by PolarCraft Team** | **由 PolarCraft 团队创建**

🌐 https://polarcraft.app
`

  zip.file('README.md', readmeContent)

  // .gitignore
  const gitignoreContent = `# MATLAB
*.asv
*.m~
*.autosave

# Octave
octave-workspace

# IDEs
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
`

  zip.file('.gitignore', gitignoreContent)
}

// ============================================================================
// TYPESCRIPT/REACT PACKAGE GENERATOR
// TypeScript/React 包生成器
// ============================================================================

export async function generateTypescriptPackage(
  zip: JSZip,
  demo: DemoSourceCode,
  impl: LanguageImplementation
): Promise<void> {
  // Source files
  zip.file(`src/${demo.id}.tsx`, impl.sourceCode)

  // package.json
  const packageJson = {
    name: `@polarcraft/demo-${demo.id}`,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    },
    dependencies: impl.dependencies,
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      '@vitejs/plugin-react': '^4.3.0',
      typescript: '^5.6.0',
      vite: '^6.0.0',
      tailwindcss: '^4.0.0',
    },
  }

  zip.file('package.json', JSON.stringify(packageJson, null, 2))

  // index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${demo.name} - PolarCraft Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`

  zip.file('index.html', indexHtml)

  // src/main.tsx
  const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import { ${demo.id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Demo } from './${demo.id}'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ${demo.name}
      </h1>
      <${demo.id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Demo />
    </div>
  </React.StrictMode>,
)
`

  zip.file('src/main.tsx', mainTsx)

  // README and configs similar to Python
  // ... (add README, tsconfig, vite.config, etc.)
}

// ============================================================================
// JULIA PACKAGE GENERATOR (Placeholder)
// Julia 包生成器（占位符）
// ============================================================================

export async function generateJuliaPackage(
  zip: JSZip,
  demo: DemoSourceCode,
  impl: LanguageImplementation
): Promise<void> {
  zip.file(`${demo.id}.jl`, impl.sourceCode)
  zip.file(
    'README.md',
    `# ${demo.name} - Julia Implementation

Coming soon! Julia implementation is under development.
即将推出！Julia 实现正在开发中。
`
  )
}

// ============================================================================
// R PACKAGE GENERATOR (Placeholder)
// R 包生成器（占位符）
// ============================================================================

export async function generateRPackage(
  zip: JSZip,
  demo: DemoSourceCode,
  impl: LanguageImplementation
): Promise<void> {
  zip.file(`${demo.id}.R`, impl.sourceCode)
  zip.file(
    'README.md',
    `# ${demo.name} - R Implementation

Coming soon! R implementation is under development.
即将推出！R 实现正在开发中。
`
  )
}
