/**
 * Package Generator Utility
 * 包生成器工具
 *
 * Generates standalone project packages for different programming languages.
 * 为不同编程语言生成独立项目包。
 */

import JSZip from 'jszip'
import type { DemoSourceCode, SourceLanguage } from '@/types/source-code'
import {
  generatePythonPackage,
  generateMatlabPackage,
  generateTypescriptPackage,
  generateJuliaPackage,
  generateRPackage,
} from './package-templates'

/**
 * Generate a complete standalone package for a demo in specified language
 * 为指定语言的演示生成完整的独立包
 *
 * @param demoSource - Demo source code metadata
 * @param language - Target programming language
 * @returns Promise<Blob> - ZIP file blob
 */
export async function generatePackage(
  demoSource: DemoSourceCode,
  language: SourceLanguage
): Promise<Blob> {
  const zip = new JSZip()

  // Get language implementation
  const impl = demoSource.implementations.find(i => i.language === language)
  if (!impl) {
    throw new Error(`No ${language} implementation found for ${demoSource.id}`)
  }

  // Generate package files based on language
  switch (language) {
    case 'python':
      await generatePythonPackage(zip, demoSource, impl)
      break

    case 'matlab':
      await generateMatlabPackage(zip, demoSource, impl)
      break

    case 'typescript':
      await generateTypescriptPackage(zip, demoSource, impl)
      break

    case 'julia':
      await generateJuliaPackage(zip, demoSource, impl)
      break

    case 'r':
      await generateRPackage(zip, demoSource, impl)
      break

    default:
      throw new Error(`Unsupported language: ${language}`)
  }

  // Add common files
  await addCommonFiles(zip, demoSource, language)

  // Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' })
}

/**
 * Add common files to all packages (LICENSE, attribution, etc.)
 * 向所有包添加通用文件（许可证、署名等）
 */
async function addCommonFiles(
  zip: JSZip,
  demoSource: DemoSourceCode,
  language: SourceLanguage
): Promise<void> {
  // Add LICENSE file (MIT License for code, CC BY for docs)
  const licenseContent = `MIT License

Copyright (c) 2026 PolarCraft Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

Documentation is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0)
https://creativecommons.org/licenses/by/4.0/
`

  zip.file('LICENSE', licenseContent)

  // Add ATTRIBUTION file
  const attributionContent = `# Attribution 署名

This demo is part of PolarCraft - An Interactive Polarization Optics Learning Platform
本演示是 PolarCraft 的一部分 - 交互式偏振光学学习平台

## Original Demo 原始演示
- Demo: ${demoSource.name} (${demoSource.nameZh})
- Language: ${language}
- Complexity: ${demoSource.complexity}

## Source 来源
- Website: https://polarcraft.app
- GitHub: https://github.com/polarcraft/demos
- License: MIT License (Code) / CC BY 4.0 (Docs)

## Citation 引用

If you use this demo in your research or teaching, please cite:

如果您在研究或教学中使用此演示，请引用：

\`\`\`
PolarCraft Team (2026). ${demoSource.name}.
PolarCraft Interactive Demos. https://polarcraft.app/demos/${demoSource.id}
\`\`\`

## Acknowledgments 致谢

Created with ❤️ by the PolarCraft Team
由 PolarCraft 团队用心创作

Special thanks to all contributors and educators who provided feedback.
特别感谢所有提供反馈的贡献者和教育工作者。
`

  zip.file('ATTRIBUTION.md', attributionContent)

  // Add LEARNING_RESOURCES.md if resources exist
  if (demoSource.resources && demoSource.resources.length > 0) {
    const resourcesContent = `# Learning Resources 学习资源

## ${demoSource.name} (${demoSource.nameZh})

${demoSource.resources
  .map(
    resource => `
### ${resource.title} ${resource.titleZh ? `(${resource.titleZh})` : ''}

- Type: ${resource.type}
- URL: ${resource.url}
${resource.description ? `- Description: ${resource.description}` : ''}
${resource.descriptionZh ? `- 描述: ${resource.descriptionZh}` : ''}
`
  )
  .join('\n')}

## Related Demos 相关演示

${
  demoSource.relatedDemos && demoSource.relatedDemos.length > 0
    ? demoSource.relatedDemos.map(id => `- ${id}`).join('\n')
    : 'None'
}

## Key Concepts 关键概念

${demoSource.concepts.map((concept, idx) => `- ${concept} (${demoSource.conceptsZh[idx]})`).join('\n')}
`

    zip.file('LEARNING_RESOURCES.md', resourcesContent)
  }
}

/**
 * Sanitize filename for cross-platform compatibility
 * 清理文件名以确保跨平台兼容性
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
}
