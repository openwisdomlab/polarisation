/**
 * VectorScopeSVG - 矢量示波器/偏振椭圆可视化组件
 * Shows the polarization state as an ellipse (Poincaré representation)
 * Displays: polarization ellipse, handedness, intensity, and phase info
 */

import type { JonesVector, PolarizationInfo } from '@/core/physics'
import { analyzePolarization } from '@/core/physics'

export interface VectorScopeSVGProps {
  /** Jones vector to visualize */
  jonesVector?: JonesVector
  /** Alternative: provide analyzed polarization info directly */
  polarizationInfo?: PolarizationInfo
  /** Fallback: scalar polarization angle (for legacy compatibility) */
  polarizationAngle?: number
  /** Light intensity (0-100) */
  intensity?: number
  /** Accumulated phase in degrees */
  phase?: number
  /** Position for tooltip placement */
  x: number
  y: number
  /** Size of the scope */
  size?: number
  /** Whether to show detailed labels */
  showLabels?: boolean
  /** Whether to animate the ellipse */
  isAnimating?: boolean
  /** Dark mode */
  isDark?: boolean
}

/**
 * Generates ellipse path from polarization parameters
 */
function generateEllipsePath(
  azimuth: number, // degrees
  ellipticity: number, // -45 to +45 degrees
  size: number
): string {
  const azimuthRad = (azimuth * Math.PI) / 180
  const ellipticityRad = (ellipticity * Math.PI) / 180

  // Semi-axes from ellipticity
  const tanEllipticity = Math.tan(ellipticityRad)
  const a = size * 0.8 // Semi-major axis
  const b = Math.abs(a * tanEllipticity) // Semi-minor axis

  // Generate ellipse points rotated by azimuth
  const points: string[] = []
  const steps = 36

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    // Parametric ellipse
    const ex = a * Math.cos(t)
    const ey = b * Math.sin(t)
    // Rotate by azimuth
    const x = ex * Math.cos(azimuthRad) - ey * Math.sin(azimuthRad)
    const y = ex * Math.sin(azimuthRad) + ey * Math.cos(azimuthRad)
    points.push(i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  points.push('Z')

  return points.join(' ')
}

/**
 * Get color based on polarization type and handedness
 */
function getPolarizationColor(type: string, handedness?: 'right' | 'left' | 'none'): string {
  const h = handedness === 'none' ? undefined : handedness
  switch (type) {
    case 'linear':
      return '#22d3ee' // Cyan
    case 'circular':
      return h === 'right' ? '#f97316' : '#3b82f6' // Orange/Blue
    case 'elliptical':
      return h === 'right' ? '#f59e0b' : '#6366f1' // Amber/Indigo
    default:
      return '#94a3b8'
  }
}

export function VectorScopeSVG({
  jonesVector,
  polarizationInfo: providedInfo,
  polarizationAngle,
  intensity = 100,
  phase = 0,
  x,
  y,
  size = 30,
  showLabels = true,
  isAnimating = true,
  isDark = true,
}: VectorScopeSVGProps) {
  // Analyze polarization from Jones vector or use provided info
  const analysisResult = jonesVector ? analyzePolarization(jonesVector) : null

  // Use provided PolarizationInfo or fall back to analysis result
  // Note: PolarizationInfo uses 'angle', while analyzePolarization returns 'orientation'
  const azimuth = providedInfo?.angle ?? analysisResult?.orientation ?? polarizationAngle ?? 0
  const ellipticity = providedInfo?.ellipticity ?? analysisResult?.ellipticity ?? 0
  const polType = providedInfo?.type ?? analysisResult?.type ?? 'linear'
  const handedness = providedInfo?.handedness ?? analysisResult?.handedness ?? 'none'

  const color = getPolarizationColor(polType, handedness)
  const bgColor = isDark ? '#1e293b' : '#f1f5f9'
  const borderColor = isDark ? '#334155' : '#cbd5e1'
  const textColor = isDark ? '#e2e8f0' : '#1e293b'

  const halfSize = size / 2
  const ellipseSize = halfSize * 0.7

  return (
    <g transform={`translate(${x}, ${y})`} style={{ pointerEvents: 'none' }}>
      {/* Background panel */}
      <rect
        x={-halfSize - 5}
        y={-halfSize - 15}
        width={size + 10}
        height={size + (showLabels ? 35 : 20)}
        rx="3"
        fill={bgColor}
        stroke={borderColor}
        strokeWidth="0.5"
        opacity="0.95"
      />

      {/* Title */}
      <text
        y={-halfSize - 5}
        textAnchor="middle"
        fill={textColor}
        fontSize="3"
        fontWeight="bold"
      >
        Vector Scope
      </text>

      {/* Coordinate system */}
      <g opacity="0.3">
        {/* Horizontal axis */}
        <line x1={-halfSize} y1="0" x2={halfSize} y2="0" stroke={textColor} strokeWidth="0.3" />
        {/* Vertical axis */}
        <line x1="0" y1={-halfSize + 5} x2="0" y2={halfSize - 5} stroke={textColor} strokeWidth="0.3" />
        {/* Circle outline */}
        <circle r={ellipseSize + 2} fill="none" stroke={textColor} strokeWidth="0.3" strokeDasharray="1,1" />
      </g>

      {/* Polarization ellipse */}
      <g>
        <path
          d={generateEllipsePath(azimuth, ellipticity, ellipseSize)}
          fill={color}
          fillOpacity={0.2 * (intensity / 100)}
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity={intensity / 100}
        >
          {isAnimating && polType !== 'linear' && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={handedness === 'right' ? '0' : '360'}
              to={handedness === 'right' ? '360' : '0'}
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Azimuth indicator line */}
        <line
          x1="0"
          y1="0"
          x2={ellipseSize * Math.cos((azimuth * Math.PI) / 180)}
          y2={ellipseSize * Math.sin((azimuth * Math.PI) / 180)}
          stroke={color}
          strokeWidth="0.6"
          markerEnd="url(#arrowhead)"
        />
      </g>

      {/* Handedness indicator */}
      {handedness !== 'none' && (
        <g transform={`translate(${halfSize - 5}, ${-halfSize + 10})`}>
          <text
            textAnchor="middle"
            fill={color}
            fontSize="4"
          >
            {handedness === 'right' ? '↻' : '↺'}
          </text>
        </g>
      )}

      {/* Labels */}
      {showLabels && (
        <g>
          {/* Type label */}
          <text
            y={halfSize + 3}
            textAnchor="middle"
            fill={color}
            fontSize="2.5"
            fontWeight="bold"
          >
            {polType.charAt(0).toUpperCase() + polType.slice(1)}
            {handedness !== 'none' && ` (${handedness === 'right' ? 'RCP' : 'LCP'})`}
          </text>

          {/* Parameters */}
          <text
            y={halfSize + 8}
            textAnchor="middle"
            fill={textColor}
            fontSize="2"
          >
            θ={Math.round(azimuth)}° ε={Math.round(ellipticity)}°
          </text>

          {/* Intensity and phase */}
          <text
            y={halfSize + 12}
            textAnchor="middle"
            fill={textColor}
            fontSize="2"
            opacity="0.8"
          >
            I={Math.round(intensity)}% φ={Math.round(phase % 360)}°
          </text>
        </g>
      )}
    </g>
  )
}

/**
 * SVG definitions for vector scope
 */
export function VectorScopeDefs() {
  return (
    <>
      <marker
        id="arrowhead"
        markerWidth="4"
        markerHeight="4"
        refX="3"
        refY="2"
        orient="auto"
      >
        <path d="M 0 0 L 4 2 L 0 4 Z" fill="#22d3ee" />
      </marker>
    </>
  )
}

/**
 * Compact inline polarization indicator
 * Shows a small ellipse icon next to beam endpoints
 */
export interface PolarizationIndicatorProps {
  jonesVector?: JonesVector
  polarizationAngle?: number
  x: number
  y: number
  size?: number
}

export function PolarizationIndicator({
  jonesVector,
  polarizationAngle,
  x,
  y,
  size = 6,
}: PolarizationIndicatorProps) {
  const polInfo = jonesVector ? analyzePolarization(jonesVector) : null
  const azimuth = polInfo?.orientation ?? polarizationAngle ?? 0
  const ellipticity = polInfo?.ellipticity ?? 0
  const polType = polInfo?.type ?? 'linear'
  const handedness = polInfo?.handedness ?? 'none'

  const color = getPolarizationColor(polType, handedness)

  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={generateEllipsePath(azimuth, ellipticity, size / 2)}
        fill={color}
        fillOpacity={0.3}
        stroke={color}
        strokeWidth="0.5"
      />
    </g>
  )
}
