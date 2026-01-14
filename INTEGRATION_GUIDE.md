# Source Code Viewer Integration Guide
# 源码查看器集成指南

## 🎯 Quick Integration for DemosPage

Add source code viewing functionality to the Demos page with these simple steps:

### Step 1: Add Imports

At the top of `src/pages/DemosPage.tsx`, add:

```typescript
// Add to imports section (around line 13)
import { FileCode } from 'lucide-react'  // Add FileCode icon

// Add after other component imports (around line 47)
import { SourceCodeViewer } from '@/components/demos/source-code'
import { hasDemoSource } from '@/data/demo-sources'
```

### Step 2: Add State for Source Code Viewer

In the main component function (around line 1757), add:

```typescript
// Add after activeDemo state
const [viewingSource, setViewingSource] = useState<string | null>(null)
```

### Step 3: Add "View Source" Button

Find the demo rendering area (around line 2724-2740). Add a toolbar before the demo:

```typescript
{/* Demo area */}
<div className={cn(
  'rounded-2xl border overflow-hidden',
  theme === 'dark'
    ? 'bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.1)]'
    : 'bg-gradient-to-br from-white to-gray-50 border-cyan-200 shadow-lg'
)}>
  {/* ADD THIS: Source Code Toolbar */}
  {activeDemo && hasDemoSource(activeDemo) && (
    <div className={cn(
      'flex items-center justify-between px-5 py-3 border-b',
      theme === 'dark'
        ? 'bg-slate-900/50 border-slate-700'
        : 'bg-gray-50 border-gray-200'
    )}>
      <div className="flex items-center gap-2 text-sm">
        <FileCode className="w-4 h-4 text-cyan-400" />
        <span className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>
          {t('demo.sourceAvailable') || '源码可用'}
        </span>
      </div>
      <button
        onClick={() => setViewingSource(activeDemo)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          'hover:scale-105 active:scale-95',
          theme === 'dark'
            ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
            : 'bg-cyan-500 hover:bg-cyan-600 text-white'
        )}
      >
        <FileCode className="w-4 h-4" />
        <span>{t('demo.viewSource') || '查看源码'}</span>
      </button>
    </div>
  )}

  {/* Existing demo content */}
  <div className="p-5 min-h-[550px]">
    <DemoErrorBoundary demoName={currentDemo?.titleKey ? t(currentDemo.titleKey) : undefined}>
      <Suspense fallback={<DemoLoading />}>
        {DemoComponent && <DemoComponent difficultyLevel={effectiveDifficultyLevel} />}
      </Suspense>
    </DemoErrorBoundary>
  </div>
</div>
```

### Step 4: Add Source Code Viewer Modal

At the end of the return statement, before the closing `</div>`, add:

```typescript
{/* Source Code Viewer Modal */}
{viewingSource && (
  <SourceCodeViewer
    demoId={viewingSource}
    initialLanguage="typescript"
    onClose={() => setViewingSource(null)}
  />
)}
```

### Step 5: Add Translations (Optional)

In `src/i18n/locales/en.json` and `zh.json`, add:

```json
{
  "demo": {
    "sourceAvailable": "Source code available in multiple languages",
    "viewSource": "View Source Code"
  }
}
```

Chinese version:
```json
{
  "demo": {
    "sourceAvailable": "提供多语言源码",
    "viewSource": "查看源码"
  }
}
```

## 🎨 Alternative: Floating Button Style

If you prefer a floating button style:

```typescript
{/* Floating Source Code Button */}
{activeDemo && hasDemoSource(activeDemo) && (
  <motion.button
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    onClick={() => setViewingSource(activeDemo)}
    className={cn(
      'fixed bottom-6 right-6 z-40',
      'flex items-center gap-2 px-4 py-3 rounded-full shadow-lg',
      'font-medium text-sm transition-all',
      'hover:scale-110 active:scale-95',
      theme === 'dark'
        ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/50'
        : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-300'
    )}
  >
    <FileCode className="w-4 h-4" />
    <span className="hidden sm:inline">
      {t('demo.viewSource') || '</> 源码'}
    </span>
  </motion.button>
)}
```

## 📚 Adding More Demos

To add source code for other demos, edit `src/data/demo-sources.ts`:

```typescript
// Import the source code
import BirefringenceDemoTsx from '@/components/demos/unit1/BirefringenceDemo.tsx?raw'
import BirefringenceDemoPython from '@/demo-sources/python/birefringence.py?raw'
import BirefringenceDemoMatlab from '@/demo-sources/matlab/birefringence.m?raw'

// Add to registry
export const DEMO_SOURCES_REGISTRY: Record<string, DemoSourceCode> = {
  'malus-law': MALUS_LAW_SOURCE,

  // Add new demo
  'birefringence': {
    id: 'birefringence',
    name: 'Birefringence',
    nameZh: '双折射',
    description: 'Demonstration of birefringent crystal behavior',
    descriptionZh: '双折射晶体行为演示',
    complexity: 'intermediate',
    concepts: ['Birefringence', 'Ordinary ray', 'Extraordinary ray'],
    conceptsZh: ['双折射', '寻常光', '非常光'],
    tags: ['birefringence', 'crystals', 'intermediate'],
    implementations: [
      {
        language: 'typescript',
        sourceCode: BirefringenceDemoTsx,
        dependencies: { /* ... */ },
      },
      {
        language: 'python',
        sourceCode: BirefringenceDemoPython,
        dependencies: { /* ... */ },
      },
      {
        language: 'matlab',
        sourceCode: BirefringenceDemoMatlab,
        dependencies: { /* ... */ },
      },
    ],
  },
}
```

## 🧪 Testing

1. **Navigate to demos page**: `/demos`
2. **Select a demo**: Choose "Malus's Law" or any demo with source code
3. **Click "View Source"**: Should open modal with language selector
4. **Switch languages**: Test Python, MATLAB, TypeScript tabs
5. **Copy code**: Test copy button
6. **Download**: Test both single file and package downloads
7. **Check package contents**: Unzip and verify README, LICENSE, dependencies

## 🔧 Troubleshooting

### Import Error: "?raw suffix not recognized"

Make sure you have the latest Vite configuration. Add to `vite.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  assetsInclude: ['**/*.py', '**/*.m', '**/*.jl', '**/*.R'],
})
```

### Prism.js languages not loading

Install additional language components:

```bash
npm install prismjs
```

Then import in `SourceCodeViewer.tsx`:

```typescript
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-matlab'
// ... etc
```

### Package download not working

Check browser console for errors. Common issues:
- JSZip not installed: `npm install jszip`
- Blob URL blocked by CSP: Check security headers

## 📊 Usage Analytics (Optional)

Track source code views:

```typescript
// In handleViewSource
const handleViewSource = (demoId: string, language: string) => {
  // Track analytics
  if (window.gtag) {
    window.gtag('event', 'view_source', {
      demo_id: demoId,
      language: language,
    })
  }

  setViewingSource(demoId)
}
```

## 🎯 Next Steps

1. ✅ Integrate into DemosPage (follow steps above)
2. 📝 Add Python/MATLAB implementations for more demos
3. 🎨 Customize styling to match your theme
4. 📊 Add usage analytics
5. 🌐 Add Julia and R implementations (optional)

---

**Questions?** Check `SOURCE_CODE_ACCESS_PLAN.md` for full architecture details.
