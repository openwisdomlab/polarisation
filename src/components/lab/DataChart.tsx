/**
 * Data Chart - Real-time SVG plotting for experimental data
 * 数据图表 - 实时SVG绘图用于实验数据可视化
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { DataPoint, FitResult } from '@/stores/labStore'
import { generateModelCurve } from './dataAnalysis'

interface DataChartProps {
  data: DataPoint[]
  fitResult?: FitResult | null
  showTheoretical?: boolean
  xLabel?: string
  yLabel?: string
  title?: string
  height?: number
}

// Chart margins
const MARGIN = { top: 30, right: 20, bottom: 45, left: 55 }

export function DataChart({
  data,
  fitResult,
  showTheoretical = false,
  xLabel,
  yLabel,
  title,
  height = 300,
}: DataChartProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  // Default labels
  const xAxisLabel = xLabel || (isZh ? '偏振片角度 θ (°)' : 'Polarizer Angle θ (°)')
  const yAxisLabel = yLabel || (isZh ? '透射强度 I (%)' : 'Transmitted Intensity I (%)')
  const chartTitle = title || (isZh ? '马吕斯定律实验' : "Malus's Law Experiment")

  // Calculate chart dimensions
  const width = 500
  const innerWidth = width - MARGIN.left - MARGIN.right
  const innerHeight = height - MARGIN.top - MARGIN.bottom

  // Calculate scales
  const { xScale, yScale, xTicks, yTicks } = useMemo(() => {
    // X axis: 0 to 180 degrees
    const xMin = 0
    const xMax = 180

    // Y axis: 0 to 100 (or data max + 10%)
    const yMin = 0
    const dataMax = data.length > 0 ? Math.max(...data.map(d => d.intensity)) : 100
    const yMax = Math.max(100, Math.ceil(dataMax / 10) * 10 + 10)

    const xScale = (value: number) => ((value - xMin) / (xMax - xMin)) * innerWidth
    const yScale = (value: number) => innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight

    // Generate tick marks
    const xTicks = [0, 30, 60, 90, 120, 150, 180]
    const yTicks = Array.from({ length: 6 }, (_, i) => Math.round((yMax * i) / 5))

    return { xScale, yScale, xTicks, yTicks, yMax }
  }, [data, innerWidth, innerHeight])

  // Generate model curve if fit result exists
  const modelCurve = useMemo(() => {
    if (!fitResult) return null
    return generateModelCurve(fitResult, 0, 180, 100)
  }, [fitResult])

  // Generate theoretical curve (I = I₀ cos²θ)
  const theoreticalCurve = useMemo(() => {
    if (!showTheoretical) return null
    const points: { angle: number; intensity: number }[] = []
    for (let angle = 0; angle <= 180; angle += 2) {
      const theta = angle * Math.PI / 180
      const intensity = 100 * Math.cos(theta) ** 2
      points.push({ angle, intensity })
    }
    return points
  }, [showTheoretical])

  // Colors based on theme
  const colors = {
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    grid: theme === 'dark' ? '#334155' : '#e5e7eb',
    axis: theme === 'dark' ? '#64748b' : '#6b7280',
    text: theme === 'dark' ? '#94a3b8' : '#6b7280',
    title: theme === 'dark' ? '#e2e8f0' : '#1f2937',
    dataPoint: theme === 'dark' ? '#22d3ee' : '#0891b2', // cyan
    dataPointStroke: theme === 'dark' ? '#06b6d4' : '#0e7490',
    fitLine: theme === 'dark' ? '#f59e0b' : '#d97706', // amber
    theoretical: theme === 'dark' ? '#a78bfa' : '#8b5cf6', // purple
    residualPos: theme === 'dark' ? '#4ade80' : '#22c55e',
    residualNeg: theme === 'dark' ? '#f87171' : '#ef4444',
  }

  // Create path for curves
  const createPath = (points: { angle: number; intensity: number }[]) => {
    if (points.length === 0) return ''
    return points.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${xScale(p.angle)} ${yScale(p.intensity)}`
    ).join(' ')
  }

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden',
      theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'
    )}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minHeight: height }}
      >
        {/* Background */}
        <rect width={width} height={height} fill={colors.background} />

        {/* Chart area */}
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {/* Grid lines */}
          {/* Horizontal grid */}
          {yTicks.map(tick => (
            <line
              key={`h-${tick}`}
              x1={0}
              y1={yScale(tick)}
              x2={innerWidth}
              y2={yScale(tick)}
              stroke={colors.grid}
              strokeDasharray="4 4"
              opacity={0.5}
            />
          ))}
          {/* Vertical grid */}
          {xTicks.map(tick => (
            <line
              key={`v-${tick}`}
              x1={xScale(tick)}
              y1={0}
              x2={xScale(tick)}
              y2={innerHeight}
              stroke={colors.grid}
              strokeDasharray="4 4"
              opacity={0.5}
            />
          ))}

          {/* Axes */}
          <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke={colors.axis} strokeWidth={1.5} />
          <line x1={0} y1={0} x2={0} y2={innerHeight} stroke={colors.axis} strokeWidth={1.5} />

          {/* X axis ticks and labels */}
          {xTicks.map(tick => (
            <g key={`x-${tick}`} transform={`translate(${xScale(tick)}, ${innerHeight})`}>
              <line y1={0} y2={5} stroke={colors.axis} />
              <text
                y={18}
                textAnchor="middle"
                fill={colors.text}
                fontSize={11}
                fontFamily="system-ui, sans-serif"
              >
                {tick}°
              </text>
            </g>
          ))}

          {/* Y axis ticks and labels */}
          {yTicks.map(tick => (
            <g key={`y-${tick}`} transform={`translate(0, ${yScale(tick)})`}>
              <line x1={-5} x2={0} stroke={colors.axis} />
              <text
                x={-10}
                dy="0.35em"
                textAnchor="end"
                fill={colors.text}
                fontSize={11}
                fontFamily="system-ui, sans-serif"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Theoretical curve (if enabled) */}
          {theoreticalCurve && (
            <path
              d={createPath(theoreticalCurve)}
              fill="none"
              stroke={colors.theoretical}
              strokeWidth={2}
              strokeDasharray="8 4"
              opacity={0.6}
            />
          )}

          {/* Model fit curve */}
          {modelCurve && (
            <path
              d={createPath(modelCurve)}
              fill="none"
              stroke={colors.fitLine}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          )}

          {/* Residuals (if fit exists and data available) */}
          {fitResult && data.map((point, i) => {
            const residual = fitResult.residuals[i]
            if (residual === undefined) return null
            const modelY = fitResult.modelValues[i]
            return (
              <line
                key={`res-${point.id}`}
                x1={xScale(point.angle)}
                y1={yScale(point.intensity)}
                x2={xScale(point.angle)}
                y2={yScale(modelY)}
                stroke={residual >= 0 ? colors.residualPos : colors.residualNeg}
                strokeWidth={1.5}
                opacity={0.6}
              />
            )
          })}

          {/* Data points */}
          {data.map((point) => (
            <g key={point.id}>
              <circle
                cx={xScale(point.angle)}
                cy={yScale(point.intensity)}
                r={5}
                fill={colors.dataPoint}
                stroke={colors.dataPointStroke}
                strokeWidth={1.5}
              />
            </g>
          ))}

          {/* X axis label */}
          <text
            x={innerWidth / 2}
            y={innerHeight + 38}
            textAnchor="middle"
            fill={colors.text}
            fontSize={12}
            fontFamily="system-ui, sans-serif"
          >
            {xAxisLabel}
          </text>

          {/* Y axis label */}
          <text
            transform={`translate(-40, ${innerHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fill={colors.text}
            fontSize={12}
            fontFamily="system-ui, sans-serif"
          >
            {yAxisLabel}
          </text>
        </g>

        {/* Title */}
        <text
          x={width / 2}
          y={18}
          textAnchor="middle"
          fill={colors.title}
          fontSize={14}
          fontWeight="600"
          fontFamily="system-ui, sans-serif"
        >
          {chartTitle}
        </text>
      </svg>

      {/* Legend */}
      <div className={cn(
        'flex flex-wrap items-center gap-4 px-4 py-2 text-xs border-t',
        theme === 'dark' ? 'bg-slate-800/70 border-slate-700' : 'bg-gray-50 border-gray-100'
      )}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.dataPoint }} />
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {isZh ? '实验数据' : 'Measured Data'}
          </span>
        </div>

        {modelCurve && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5" style={{ backgroundColor: colors.fitLine }} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {isZh ? '拟合曲线' : 'Fitted Curve'}
              {fitResult && ` (R² = ${fitResult.rSquared.toFixed(3)})`}
            </span>
          </div>
        )}

        {theoreticalCurve && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-0.5"
              style={{ backgroundColor: colors.theoretical, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, currentColor 4px, currentColor 8px)' }}
            />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {isZh ? '理论曲线' : 'Theoretical'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Residuals Chart - Show fitting residuals
 */
interface ResidualsChartProps {
  data: DataPoint[]
  fitResult: FitResult
  height?: number
}

export function ResidualsChart({ data, fitResult, height = 120 }: ResidualsChartProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const width = 500
  const innerWidth = width - MARGIN.left - MARGIN.right
  const innerHeight = height - 30 - 25

  // Calculate scales
  const { xScale, yScale, maxResidual } = useMemo(() => {
    const maxAbs = Math.max(...fitResult.residuals.map(Math.abs), 1)
    const yMax = Math.ceil(maxAbs / 5) * 5 + 5

    const xScale = (value: number) => (value / 180) * innerWidth
    const yScale = (value: number) => innerHeight / 2 - (value / yMax) * (innerHeight / 2)

    return { xScale, yScale, maxResidual: yMax }
  }, [fitResult, innerWidth, innerHeight])

  const colors = {
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    zero: theme === 'dark' ? '#475569' : '#d1d5db',
    positive: theme === 'dark' ? '#4ade80' : '#22c55e',
    negative: theme === 'dark' ? '#f87171' : '#ef4444',
    text: theme === 'dark' ? '#94a3b8' : '#6b7280',
  }

  return (
    <div className={cn(
      'rounded-lg border overflow-hidden',
      theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'
    )}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <rect width={width} height={height} fill={colors.background} />

        <g transform={`translate(${MARGIN.left}, 20)`}>
          {/* Zero line */}
          <line
            x1={0}
            y1={innerHeight / 2}
            x2={innerWidth}
            y2={innerHeight / 2}
            stroke={colors.zero}
            strokeDasharray="4 4"
          />

          {/* Residual bars */}
          {data.map((point, i) => {
            const residual = fitResult.residuals[i]
            if (residual === undefined) return null
            return (
              <rect
                key={point.id}
                x={xScale(point.angle) - 4}
                y={residual >= 0 ? yScale(residual) : innerHeight / 2}
                width={8}
                height={Math.abs(yScale(residual) - innerHeight / 2)}
                fill={residual >= 0 ? colors.positive : colors.negative}
                opacity={0.8}
                rx={2}
              />
            )
          })}

          {/* Y axis labels */}
          <text x={-8} y={5} textAnchor="end" fill={colors.text} fontSize={9}>
            +{maxResidual}
          </text>
          <text x={-8} y={innerHeight / 2 + 3} textAnchor="end" fill={colors.text} fontSize={9}>
            0
          </text>
          <text x={-8} y={innerHeight - 2} textAnchor="end" fill={colors.text} fontSize={9}>
            -{maxResidual}
          </text>
        </g>

        {/* Title */}
        <text
          x={width / 2}
          y={12}
          textAnchor="middle"
          fill={colors.text}
          fontSize={11}
        >
          {isZh ? '残差分布 (数据 - 模型)' : 'Residuals (Data - Model)'}
        </text>
      </svg>
    </div>
  )
}
