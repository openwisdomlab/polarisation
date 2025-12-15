/**
 * PhaseVisualizerSVG - 相位可视化组件
 * Shows a sinusoidal waveform along a beam path to visualize phase
 * Can display both E-field oscillation and phase accumulation
 */

import type { LightBeamSegment } from './types'

export interface PhaseVisualizerSVGProps {
  beam: LightBeamSegment
  showWaveform?: boolean
  showPhaseMarkers?: boolean
  wavelength?: number // Visual wavelength in SVG units
  isAnimating?: boolean
  waveformColor?: string
  phaseColor?: string
}

/**
 * Generates a sinusoidal wave path along a beam
 */
function generateWavePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  polarizationAngle: number
): string {
  const dx = endX - startX
  const dy = endY - startY
  const length = Math.sqrt(dx * dx + dy * dy)

  if (length < 1) return ''

  // Direction unit vector
  const ux = dx / length
  const uy = dy / length

  // Perpendicular unit vector (for oscillation direction based on polarization)
  // Rotate perpendicular by polarization angle relative to beam direction
  const polRad = (polarizationAngle * Math.PI) / 180
  const beamAngle = Math.atan2(dy, dx)
  const oscillationAngle = beamAngle + Math.PI / 2 + polRad
  const px = Math.cos(oscillationAngle)
  const py = Math.sin(oscillationAngle)

  const points: string[] = []
  const steps = Math.max(20, Math.floor(length / 2))
  const phaseOffset = (phase * Math.PI) / 180

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const pos = t * length
    // Sinusoidal oscillation
    const waveValue = Math.sin((2 * Math.PI * pos) / wavelength + phaseOffset)
    const offset = waveValue * amplitude

    const x = startX + ux * pos + px * offset
    const y = startY + uy * pos + py * offset

    points.push(i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ')
}

export function PhaseVisualizerSVG({
  beam,
  showWaveform = true,
  showPhaseMarkers = true,
  wavelength = 10,
  isAnimating = true,
  waveformColor,
  phaseColor = '#22d3ee',
}: PhaseVisualizerSVGProps) {
  const { startX, startY, endX, endY, intensity, polarization, phase = 0 } = beam

  const amplitude = Math.max(0.5, (intensity / 100) * 3)
  const opacity = Math.max(0.3, intensity / 100)

  // Default waveform color based on polarization
  const defaultWaveColor = (() => {
    const normalizedAngle = ((polarization % 180) + 180) % 180
    if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'
    if (normalizedAngle < 67.5) return '#ffaa00'
    if (normalizedAngle < 112.5) return '#44ff44'
    return '#4444ff'
  })()

  const color = waveformColor || defaultWaveColor

  // Calculate beam length and direction for phase markers
  const dx = endX - startX
  const dy = endY - startY
  const length = Math.sqrt(dx * dx + dy * dy)
  const ux = length > 0 ? dx / length : 1
  const uy = length > 0 ? dy / length : 0

  return (
    <g opacity={opacity}>
      {/* Waveform visualization */}
      {showWaveform && (
        <g>
          {/* Main waveform */}
          <path
            d={generateWavePath(startX, startY, endX, endY, amplitude, wavelength, phase, polarization)}
            fill="none"
            stroke={color}
            strokeWidth="0.6"
            strokeLinecap="round"
          >
            {isAnimating && (
              <animate
                attributeName="stroke-dashoffset"
                values={`${wavelength * 2};0`}
                dur="1s"
                repeatCount="indefinite"
              />
            )}
          </path>
          {/* Second waveform for circular/elliptical (perpendicular) */}
          {beam.jonesVector && (
            <path
              d={generateWavePath(startX, startY, endX, endY, amplitude, wavelength, phase + 90, polarization + 90)}
              fill="none"
              stroke={color}
              strokeWidth="0.4"
              strokeLinecap="round"
              opacity="0.5"
            >
              {isAnimating && (
                <animate
                  attributeName="stroke-dashoffset"
                  values={`${wavelength * 2};0`}
                  dur="1s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          )}
        </g>
      )}

      {/* Phase markers along beam */}
      {showPhaseMarkers && length > wavelength * 2 && (
        <g>
          {Array.from({ length: Math.floor(length / wavelength) }).map((_, i) => {
            const pos = (i + 1) * wavelength
            const markerX = startX + ux * pos
            const markerY = startY + uy * pos
            const phaseAtPoint = ((phase + (i + 1) * 360) % 360)

            return (
              <g key={i} transform={`translate(${markerX}, ${markerY})`}>
                {/* Phase marker circle */}
                <circle
                  r="1"
                  fill={phaseColor}
                  opacity="0.6"
                >
                  {isAnimating && (
                    <animate
                      attributeName="r"
                      values="0.8;1.2;0.8"
                      dur="2s"
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                {/* Phase value label (only show every other) */}
                {i % 2 === 0 && (
                  <text
                    y="-2"
                    textAnchor="middle"
                    fill={phaseColor}
                    fontSize="1.2"
                    opacity="0.8"
                  >
                    {Math.round(phaseAtPoint)}°
                  </text>
                )}
              </g>
            )
          })}
        </g>
      )}
    </g>
  )
}

/**
 * Enhanced light beam with phase visualization
 */
export interface EnhancedLightBeamSVGProps {
  beam: LightBeamSegment
  showPolarization?: boolean
  showPhase?: boolean
  showWaveform?: boolean
  isAnimating?: boolean
  glowFilterId?: string
  flowGradientId?: string
}

export function EnhancedLightBeamSVG({
  beam,
  showPolarization = true,
  showPhase = false,
  showWaveform = false,
  isAnimating = true,
  glowFilterId = 'glow',
  flowGradientId = 'beamFlow',
}: EnhancedLightBeamSVGProps) {
  // Default color function
  const getColor = (angle: number) => {
    const normalizedAngle = ((angle % 180) + 180) % 180
    if (normalizedAngle < 22.5 || normalizedAngle >= 157.5) return '#ff4444'
    if (normalizedAngle < 67.5) return '#ffaa00'
    if (normalizedAngle < 112.5) return '#44ff44'
    return '#4444ff'
  }

  const opacity = Math.max(0.2, beam.intensity / 100)
  const strokeWidth = Math.max(0.5, (beam.intensity / 100) * 2)
  const color = showPolarization ? getColor(beam.polarization) : '#ffffaa'

  return (
    <g>
      {/* Base beam line */}
      <line
        x1={beam.startX}
        y1={beam.startY}
        x2={beam.endX}
        y2={beam.endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={showWaveform || showPhase ? opacity * 0.3 : opacity}
        filter={`url(#${glowFilterId})`}
        strokeLinecap="round"
      />

      {/* Glow effect */}
      {!showWaveform && !showPhase && (
        <line
          x1={beam.startX}
          y1={beam.startY}
          x2={beam.endX}
          y2={beam.endY}
          stroke={color}
          strokeWidth={strokeWidth * 3}
          strokeOpacity={opacity * 0.3}
          strokeLinecap="round"
        />
      )}

      {/* Flow animation */}
      {isAnimating && beam.intensity > 10 && !showWaveform && (
        <line
          x1={beam.startX}
          y1={beam.startY}
          x2={beam.endX}
          y2={beam.endY}
          stroke={`url(#${flowGradientId})`}
          strokeWidth={strokeWidth * 0.5}
          strokeOpacity={0.5}
          strokeLinecap="round"
        />
      )}

      {/* Phase visualization overlay */}
      {(showPhase || showWaveform) && (
        <PhaseVisualizerSVG
          beam={beam}
          showWaveform={showWaveform}
          showPhaseMarkers={showPhase}
          isAnimating={isAnimating}
        />
      )}
    </g>
  )
}
