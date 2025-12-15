/**
 * Research Task Modal - Interactive task execution interface
 * 研究任务模态框 - 交互式任务执行界面
 *
 * Features:
 * - Left Panel: Task guide with steps, formulas, and background theory
 * - Right Panel: Dynamic workspace based on task category
 *   - Experiment: Data entry table + live chart
 *   - Simulation: Embedded demo/calculator
 *   - Literature: Markdown editor
 */

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useLabStore, DataPoint, FitResult } from '@/stores/labStore'
import { DataEntryTable } from './DataEntryTable'
import { DataChart, ResidualsChart } from './DataChart'
import { cosineFit, calculateExtinctionRatio } from './dataAnalysis'
import {
  X, ChevronRight, ChevronDown,
  BookOpen, FlaskConical, Calculator, FileText,
  Play, RotateCcw, CheckCircle2, AlertCircle,
  TrendingUp, Award, Lightbulb, Info
} from 'lucide-react'

// Task definitions with detailed content
interface TaskContent {
  id: string
  category: 'experiment' | 'simulation' | 'analysis' | 'literature'
  titleEn: string
  titleZh: string
  backgroundEn: string
  backgroundZh: string
  stepsEn: string[]
  stepsZh: string[]
  formulasEn?: string[]
  formulasZh?: string[]
  hintsEn?: string[]
  hintsZh?: string[]
  successCriteria?: {
    minDataPoints?: number
    minRSquared?: number
    requiredExtinctionRatio?: { min: number; max: number }
  }
}

// Task content database (expanded from RESEARCH_TASKS)
const TASK_CONTENT: Record<string, TaskContent> = {
  'polarizer-basics': {
    id: 'polarizer-basics',
    category: 'experiment',
    titleEn: 'Polarizer Characterization',
    titleZh: '偏振片特性测定',
    backgroundEn: `Malus's Law describes how the intensity of linearly polarized light changes when passing through a polarizer. Named after Étienne-Louis Malus who discovered polarization by reflection in 1808.

When polarized light passes through a polarizer, the transmitted intensity follows:
I = I₀ × cos²(θ - θ₀)

Where:
• I₀ = Initial intensity (maximum transmission)
• θ = Polarizer angle
• θ₀ = Light polarization angle`,
    backgroundZh: `马吕斯定律描述了线偏振光通过偏振片时强度的变化规律。该定律以1808年通过反射发现偏振现象的艾蒂安-路易·马吕斯命名。

当偏振光通过偏振片时，透射强度遵循：
I = I₀ × cos²(θ - θ₀)

其中：
• I₀ = 初始强度（最大透射）
• θ = 偏振片角度
• θ₀ = 入射光偏振角`,
    stepsEn: [
      'Set up a polarized light source and rotate the analyzer polarizer',
      'Measure transmitted intensity at different analyzer angles (0° to 180°)',
      'Record at least 10 data points with 15-20° intervals',
      'Fit the data to cos²(θ) function',
      'Calculate extinction ratio from fit parameters',
      'Analyze residuals to evaluate fit quality'
    ],
    stepsZh: [
      '设置偏振光源，旋转检偏器',
      '在不同检偏器角度测量透射强度（0°到180°）',
      '以15-20°间隔记录至少10个数据点',
      '将数据拟合到cos²(θ)函数',
      '从拟合参数计算消光比',
      '分析残差评估拟合质量'
    ],
    formulasEn: [
      "Malus's Law: I = I₀ × cos²(θ - θ₀)",
      'Extinction Ratio: ER = I_max / I_min',
      'R² (coefficient of determination) measures fit quality'
    ],
    formulasZh: [
      '马吕斯定律: I = I₀ × cos²(θ - θ₀)',
      '消光比: ER = I_max / I_min',
      'R² (决定系数) 衡量拟合质量'
    ],
    hintsEn: [
      'Maximum intensity occurs when polarizer and light are aligned',
      'Minimum should be near zero for a good polarizer',
      'High extinction ratio (>100) indicates high quality polarizer'
    ],
    hintsZh: [
      '当偏振片与入射光平行时强度最大',
      '好的偏振片最小值应接近零',
      '高消光比（>100）表示高质量偏振片'
    ],
    successCriteria: {
      minDataPoints: 5,
      minRSquared: 0.95,
    }
  },
  'brewster-angle': {
    id: 'brewster-angle',
    category: 'experiment',
    titleEn: "Brewster's Angle Measurement",
    titleZh: '布儒斯特角测量',
    backgroundEn: `Brewster's angle is the angle at which light with p-polarization is perfectly transmitted through a transparent interface with no reflection. At this angle, reflected and refracted rays are perpendicular.

tan(θ_B) = n₂/n₁

For air-glass interface (n₁ ≈ 1):
θ_B = arctan(n_glass)`,
    backgroundZh: `布儒斯特角是p偏振光完全透过透明界面而无反射的角度。在此角度，反射光和折射光相互垂直。

tan(θ_B) = n₂/n₁

对于空气-玻璃界面 (n₁ ≈ 1):
θ_B = arctan(n_玻璃)`,
    stepsEn: [
      'Direct unpolarized light at a glass surface',
      'Observe reflected light through a polarizer',
      'Rotate incident angle to find minimum reflection',
      'Measure Brewster angle and calculate refractive index'
    ],
    stepsZh: [
      '将非偏振光照射到玻璃表面',
      '通过偏振片观察反射光',
      '旋转入射角找到最小反射',
      '测量布儒斯特角并计算折射率'
    ],
    formulasEn: [
      "Brewster's angle: θ_B = arctan(n₂/n₁)",
      'Refractive index: n = tan(θ_B)'
    ],
    formulasZh: [
      '布儒斯特角: θ_B = arctan(n₂/n₁)',
      '折射率: n = tan(θ_B)'
    ],
    successCriteria: {
      minDataPoints: 3,
    }
  },
}

// Default content for tasks not in database
function getDefaultContent(taskId: string): TaskContent {
  return {
    id: taskId,
    category: 'experiment',
    titleEn: 'Research Task',
    titleZh: '研究任务',
    backgroundEn: 'This task is under development. More content coming soon.',
    backgroundZh: '此任务正在开发中，更多内容即将推出。',
    stepsEn: ['Follow the experimental procedure', 'Record your observations', 'Analyze the results'],
    stepsZh: ['按照实验步骤进行', '记录观察结果', '分析实验结果'],
  }
}

export function ResearchTaskModal() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Lab store
  const {
    activeTaskId,
    isModalOpen,
    closeTask,
    taskProgress,
    saveTaskData,
    saveTaskFitResult,
    submitTask,
  } = useLabStore()

  // Local state
  const [currentStep, setCurrentStep] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get task content
  const content = useMemo(() => {
    if (!activeTaskId) return null
    return TASK_CONTENT[activeTaskId] || getDefaultContent(activeTaskId)
  }, [activeTaskId])

  // Get current task progress
  const progress = activeTaskId ? taskProgress[activeTaskId] : undefined

  // Current data
  const data = progress?.data || []
  const fitResult = progress?.fitResult || null

  // Handle data change
  const handleDataChange = useCallback((newData: DataPoint[]) => {
    if (!activeTaskId) return
    saveTaskData(activeTaskId, newData)
  }, [activeTaskId, saveTaskData])

  // Auto-fit when data changes
  useEffect(() => {
    if (data.length >= 3) {
      const result = cosineFit(data)
      if (result && activeTaskId) {
        saveTaskFitResult(activeTaskId, result)
      }
    }
  }, [data, activeTaskId, saveTaskFitResult])

  // Check if task meets success criteria
  const validation = useMemo(() => {
    if (!content?.successCriteria) return { valid: true, messages: [] }

    const messages: { type: 'success' | 'warning' | 'error'; text: string }[] = []
    const criteria = content.successCriteria

    // Check data points
    if (criteria.minDataPoints) {
      if (data.length >= criteria.minDataPoints) {
        messages.push({
          type: 'success',
          text: isZh
            ? `✓ 数据点: ${data.length}/${criteria.minDataPoints}`
            : `✓ Data points: ${data.length}/${criteria.minDataPoints}`
        })
      } else {
        messages.push({
          type: 'error',
          text: isZh
            ? `✗ 需要至少 ${criteria.minDataPoints} 个数据点 (当前: ${data.length})`
            : `✗ Need at least ${criteria.minDataPoints} data points (current: ${data.length})`
        })
      }
    }

    // Check R²
    if (criteria.minRSquared && fitResult) {
      if (fitResult.rSquared >= criteria.minRSquared) {
        messages.push({
          type: 'success',
          text: isZh
            ? `✓ R² = ${fitResult.rSquared.toFixed(3)} (≥ ${criteria.minRSquared})`
            : `✓ R² = ${fitResult.rSquared.toFixed(3)} (≥ ${criteria.minRSquared})`
        })
      } else {
        messages.push({
          type: 'warning',
          text: isZh
            ? `⚠ R² = ${fitResult.rSquared.toFixed(3)} (建议 ≥ ${criteria.minRSquared})`
            : `⚠ R² = ${fitResult.rSquared.toFixed(3)} (recommended ≥ ${criteria.minRSquared})`
        })
      }
    }

    const valid = messages.every(m => m.type !== 'error')
    return { valid, messages }
  }, [content, data, fitResult, isZh])

  // Handle task submission
  const handleSubmit = useCallback(() => {
    if (!activeTaskId || !validation.valid) return

    setIsSubmitting(true)
    // Simulate submission delay
    setTimeout(() => {
      submitTask(activeTaskId)
      setIsSubmitting(false)
    }, 1000)
  }, [activeTaskId, validation.valid, submitTask])

  if (!isModalOpen || !content) return null

  // Category icon
  const CategoryIcon = {
    experiment: FlaskConical,
    simulation: Calculator,
    analysis: TrendingUp,
    literature: FileText,
  }[content.category]

  // Steps
  const steps = isZh ? content.stepsZh : content.stepsEn
  const formulas = isZh ? content.formulasZh : content.formulasEn
  const hints = isZh ? content.hintsZh : content.hintsEn
  const background = isZh ? content.backgroundZh : content.backgroundEn
  const title = isZh ? content.titleZh : content.titleEn

  // Extinction ratio
  const extinctionRatio = fitResult ? calculateExtinctionRatio(fitResult) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeTask}
      />

      {/* Modal */}
      <div className={cn(
        'relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden flex',
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      )}>
        {/* Close button */}
        <button
          onClick={closeTask}
          className={cn(
            'absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors',
            theme === 'dark'
              ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Panel - Guide */}
        <div className={cn(
          'w-[380px] flex-shrink-0 overflow-y-auto border-r',
          theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
        )}>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className={cn(
                'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-3',
                theme === 'dark' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              )}>
                <CategoryIcon className="w-4 h-4" />
                <span>
                  {content.category === 'experiment' && (isZh ? '实验' : 'Experiment')}
                  {content.category === 'simulation' && (isZh ? '仿真' : 'Simulation')}
                  {content.category === 'analysis' && (isZh ? '分析' : 'Analysis')}
                  {content.category === 'literature' && (isZh ? '文献' : 'Literature')}
                </span>
              </div>
              <h2 className={cn(
                'text-xl font-bold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {title}
              </h2>
            </div>

            {/* Background */}
            <div>
              <h3 className={cn(
                'flex items-center gap-2 font-semibold mb-2',
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              )}>
                <BookOpen className="w-4 h-4" />
                {isZh ? '背景知识' : 'Background'}
              </h3>
              <div className={cn(
                'text-sm whitespace-pre-line',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {background}
              </div>
            </div>

            {/* Formulas */}
            {formulas && formulas.length > 0 && (
              <div>
                <h3 className={cn(
                  'flex items-center gap-2 font-semibold mb-2',
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                )}>
                  <Calculator className="w-4 h-4" />
                  {isZh ? '关键公式' : 'Key Formulas'}
                </h3>
                <div className={cn(
                  'space-y-2 p-3 rounded-lg font-mono text-sm',
                  theme === 'dark' ? 'bg-slate-900/50' : 'bg-white border border-gray-200'
                )}>
                  {formulas.map((formula, i) => (
                    <div key={i} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}>
                      {formula}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            <div>
              <h3 className={cn(
                'flex items-center gap-2 font-semibold mb-3',
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              )}>
                <FlaskConical className="w-4 h-4" />
                {isZh ? '实验步骤' : 'Procedure'}
              </h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      'flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                      currentStep === index
                        ? theme === 'dark'
                          ? 'bg-yellow-500/10 border border-yellow-500/30'
                          : 'bg-yellow-50 border border-yellow-200'
                        : theme === 'dark'
                          ? 'hover:bg-slate-700/50'
                          : 'hover:bg-gray-100'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium',
                      currentStep > index
                        ? 'bg-green-500 text-white'
                        : currentStep === index
                          ? theme === 'dark'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-yellow-400 text-black'
                          : theme === 'dark'
                            ? 'bg-slate-600 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                    )}>
                      {currentStep > index ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            {hints && hints.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={cn(
                    'flex items-center gap-2 font-semibold w-full',
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  )}
                >
                  <Lightbulb className="w-4 h-4" />
                  {isZh ? '提示' : 'Hints'}
                  {showHints ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
                {showHints && (
                  <div className={cn(
                    'mt-2 p-3 rounded-lg text-sm space-y-2',
                    theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
                  )}>
                    {hints.map((hint, i) => (
                      <div key={i} className={cn(
                        'flex items-start gap-2',
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                      )}>
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Workspace */}
        <div className="flex-1 overflow-y-auto p-6">
          {content.category === 'experiment' && (
            <ExperimentWorkspace
              data={data}
              fitResult={fitResult}
              onDataChange={handleDataChange}
              validation={validation}
              extinctionRatio={extinctionRatio}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSubmitted={progress?.status === 'submitted' || progress?.status === 'published'}
            />
          )}

          {content.category === 'simulation' && (
            <SimulationWorkspace taskId={content.id} />
          )}

          {content.category === 'literature' && (
            <LiteratureWorkspace taskId={content.id} />
          )}

          {content.category === 'analysis' && (
            <AnalysisWorkspace taskId={content.id} />
          )}
        </div>
      </div>
    </div>
  )
}

// Experiment Workspace Component
interface ExperimentWorkspaceProps {
  data: DataPoint[]
  fitResult: FitResult | null
  onDataChange: (data: DataPoint[]) => void
  validation: { valid: boolean; messages: { type: 'success' | 'warning' | 'error'; text: string }[] }
  extinctionRatio: number | null
  onSubmit: () => void
  isSubmitting: boolean
  isSubmitted: boolean
}

function ExperimentWorkspace({
  data,
  fitResult,
  onDataChange,
  validation,
  extinctionRatio,
  onSubmit,
  isSubmitting,
  isSubmitted,
}: ExperimentWorkspaceProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="space-y-6">
      {/* Chart */}
      <DataChart
        data={data}
        fitResult={fitResult}
        showTheoretical={false}
      />

      {/* Residuals (if fit exists) */}
      {fitResult && data.length >= 3 && (
        <ResidualsChart data={data} fitResult={fitResult} />
      )}

      {/* Fit Results */}
      {fitResult && (
        <div className={cn(
          'grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl',
          theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
        )}>
          <div className="text-center">
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              I₀ ({isZh ? '最大强度' : 'Max Intensity'})
            </div>
            <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {((fitResult.params.amplitude || 0) + (fitResult.params.offset || 0)).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              θ₀ ({isZh ? '相位' : 'Phase'})
            </div>
            <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {(fitResult.params.phase || 0).toFixed(1)}°
            </div>
          </div>
          <div className="text-center">
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              R² ({isZh ? '拟合度' : 'Fit Quality'})
            </div>
            <div className={cn(
              'text-lg font-semibold tabular-nums',
              fitResult.rSquared >= 0.95
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                : fitResult.rSquared >= 0.9
                  ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  : theme === 'dark' ? 'text-red-400' : 'text-red-600'
            )}>
              {fitResult.rSquared.toFixed(4)}
            </div>
          </div>
          <div className="text-center">
            <div className={cn('text-xs mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {isZh ? '消光比' : 'Extinction Ratio'}
            </div>
            <div className={cn('text-lg font-semibold tabular-nums', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {extinctionRatio !== null
                ? extinctionRatio === Infinity ? '∞' : extinctionRatio.toFixed(1)
                : '—'}
            </div>
          </div>
        </div>
      )}

      {/* Data Entry */}
      <div>
        <h3 className={cn(
          'font-semibold mb-3',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? '实验数据录入' : 'Data Entry'}
        </h3>
        <DataEntryTable
          data={data}
          onChange={onDataChange}
        />
      </div>

      {/* Validation & Submit */}
      <div className={cn(
        'p-4 rounded-xl border',
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}>
        <h4 className={cn(
          'font-semibold mb-3 flex items-center gap-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          <CheckCircle2 className="w-4 h-4" />
          {isZh ? '完成检查' : 'Completion Check'}
        </h4>

        <div className="space-y-2 mb-4">
          {validation.messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'text-sm flex items-center gap-2',
                msg.type === 'success' && (theme === 'dark' ? 'text-green-400' : 'text-green-600'),
                msg.type === 'warning' && (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'),
                msg.type === 'error' && (theme === 'dark' ? 'text-red-400' : 'text-red-600')
              )}
            >
              {msg.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {msg.text}
            </div>
          ))}
        </div>

        {isSubmitted ? (
          <div className={cn(
            'flex items-center gap-2 text-green-500',
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          )}>
            <Award className="w-5 h-5" />
            <span className="font-medium">
              {isZh ? '任务已提交！' : 'Task Submitted!'}
            </span>
          </div>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!validation.valid || isSubmitting}
            className={cn(
              'w-full py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
              validation.valid && !isSubmitting
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                {isZh ? '提交中...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {isZh ? '提交任务' : 'Submit Task'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Placeholder workspaces for other task types
function SimulationWorkspace({ taskId }: { taskId: string }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'h-64 flex flex-col items-center justify-center rounded-xl border',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
    )}>
      <Calculator className={cn('w-12 h-12 mb-4', theme === 'dark' ? 'text-purple-400' : 'text-purple-500')} />
      <p className={cn('text-center', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {isZh ? '仿真模块即将推出' : 'Simulation module coming soon'}
      </p>
      <p className={cn('text-sm mt-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
        Task: {taskId}
      </p>
    </div>
  )
}

function LiteratureWorkspace({ taskId }: { taskId: string }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'h-64 flex flex-col items-center justify-center rounded-xl border',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
    )}>
      <FileText className={cn('w-12 h-12 mb-4', theme === 'dark' ? 'text-blue-400' : 'text-blue-500')} />
      <p className={cn('text-center', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {isZh ? '文献综述编辑器即将推出' : 'Literature review editor coming soon'}
      </p>
      <p className={cn('text-sm mt-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
        Task: {taskId}
      </p>
    </div>
  )
}

function AnalysisWorkspace({ taskId }: { taskId: string }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className={cn(
      'h-64 flex flex-col items-center justify-center rounded-xl border',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
    )}>
      <TrendingUp className={cn('w-12 h-12 mb-4', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500')} />
      <p className={cn('text-center', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
        {isZh ? '数据分析工作台即将推出' : 'Data analysis workspace coming soon'}
      </p>
      <p className={cn('text-sm mt-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
        Task: {taskId}
      </p>
    </div>
  )
}
