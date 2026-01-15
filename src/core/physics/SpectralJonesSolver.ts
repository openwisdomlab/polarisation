/**
 * SpectralJonesSolver - 光谱琼斯矩阵求解器
 *
 * Implements wavelength-dependent Jones calculus for chromatic polarization.
 * Solves the scientific flaw where phase retardation δ = 2πdΔn/λ must vary
 * with wavelength to produce physically accurate interference colors.
 *
 * Key Physics:
 * - Phase retardation δ(λ) = 2π × d × Δn / λ
 * - Different wavelengths experience different retardations
 * - This wavelength-dependent phase creates interference colors
 *
 * Reference: Michel-Lévy interference color chart
 */

import {
  type JonesMatrix,
  applyJonesMatrix,
  jonesIntensity,
  polarizerMatrix,
  retarderMatrix,
  multiplyJonesMatrices,
  STANDARD_JONES_VECTORS,
} from '../JonesCalculus'

// ============================================
// Spectral Constants
// ============================================

/**
 * Representative wavelengths for RGB calculation (in nanometers)
 * These are chosen to match typical display primaries and
 * human cone sensitivities
 */
export const SPECTRAL_WAVELENGTHS = {
  RED: 650,    // Long wavelength (L-cone peak ~565nm, red phosphor ~610-650nm)
  GREEN: 550,  // Medium wavelength (M-cone peak ~540nm)
  BLUE: 450,   // Short wavelength (S-cone peak ~440nm)
} as const

/**
 * Extended wavelength sampling for higher accuracy spectral integration
 * Covers visible spectrum from 380nm to 780nm
 */
export const VISIBLE_SPECTRUM = {
  MIN: 380,
  MAX: 780,
  STEP: 5, // nm per sample
} as const

/**
 * Common birefringent material properties
 * Birefringence Δn values at 550nm (sodium D-line)
 */
export const MATERIAL_BIREFRINGENCE = {
  SCOTCH_TAPE: 0.009,      // Cellulose acetate tape
  CELLOPHANE: 0.006,       // Cellophane film
  MICA: 0.04,              // Muscovite mica
  QUARTZ: 0.009,           // Crystalline quartz
  CALCITE: 0.172,          // Calcite (Iceland spar)
  PLASTIC_RULER: 0.005,    // Stressed polystyrene
  STRETCHED_FILM: 0.003,   // Stretched polyethylene
} as const

/**
 * Typical single-layer thicknesses (in micrometers)
 */
export const MATERIAL_THICKNESS = {
  SCOTCH_TAPE: 50,         // ~50 μm per layer
  CELLOPHANE: 25,          // ~25 μm per layer
  MICA_THIN: 10,           // Thin mica sheet
  PLASTIC_WRAP: 12,        // Kitchen plastic wrap
} as const

// ============================================
// Spectral Jones Solver Class
// ============================================

/**
 * Input parameters for spectral Jones calculation
 */
export interface SpectralJonesParams {
  /** Sample thickness in micrometers (μm) */
  thickness: number
  /** Birefringence Δn (dimensionless, typically 0.001-0.2) */
  birefringence: number
  /** Polarizer (first polarizer) transmission axis angle in degrees */
  polarizerAngle: number
  /** Analyzer (second polarizer) transmission axis angle in degrees */
  analyzerAngle: number
  /** Fast axis angle of the birefringent sample in degrees (default: 45°) */
  fastAxisAngle?: number
}

/**
 * RGB color result from spectral calculation
 */
export interface RGBColor {
  r: number  // 0-255
  g: number  // 0-255
  b: number  // 0-255
  /** CSS rgb() string */
  rgb: string
  /** CSS hex color string */
  hex: string
  /** Normalized intensity (0-1) */
  intensity: number
}

/**
 * Detailed spectral analysis result
 */
export interface SpectralAnalysis {
  /** Final RGB color */
  color: RGBColor
  /** Transmission for each RGB channel (0-1) */
  transmission: {
    red: number
    green: number
    blue: number
  }
  /** Phase retardation at each wavelength (in radians) */
  phaseRetardation: {
    red: number
    green: number
    blue: number
  }
  /** Optical path difference in nm */
  opticalPathDifference: number
  /** Retardation order (number of wavelengths at 550nm) */
  retardationOrder: number
}

/**
 * Calculate phase retardation δ for a given wavelength
 *
 * δ(λ) = 2π × d × Δn / λ
 *
 * where:
 *   d = thickness in nm (input is μm, so multiply by 1000)
 *   Δn = birefringence (dimensionless)
 *   λ = wavelength in nm
 *
 * @param thicknessUm - Sample thickness in micrometers
 * @param birefringence - Birefringence Δn
 * @param wavelengthNm - Light wavelength in nanometers
 * @returns Phase retardation in radians
 */
export function calculatePhaseRetardation(
  thicknessUm: number,
  birefringence: number,
  wavelengthNm: number
): number {
  // Convert μm to nm: 1 μm = 1000 nm
  const thicknessNm = thicknessUm * 1000
  // δ = 2π × d × Δn / λ
  return (2 * Math.PI * thicknessNm * birefringence) / wavelengthNm
}

/**
 * Convert phase retardation (radians) to degrees for display
 */
export function retardationToDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Calculate optical path difference (OPD) in nanometers
 *
 * OPD = d × Δn (where d is in nm)
 */
export function calculateOPD(thicknessUm: number, birefringence: number): number {
  return thicknessUm * 1000 * birefringence
}

/**
 * Build the Jones matrix for a birefringent retarder at a specific wavelength
 *
 * The retarder matrix depends on:
 * 1. Fast axis orientation θ
 * 2. Phase retardation δ (which depends on wavelength)
 *
 * @param fastAxisDeg - Fast axis angle in degrees
 * @param thicknessUm - Sample thickness in micrometers
 * @param birefringence - Birefringence Δn
 * @param wavelengthNm - Light wavelength in nanometers
 */
export function buildRetarderMatrixForWavelength(
  fastAxisDeg: number,
  thicknessUm: number,
  birefringence: number,
  wavelengthNm: number
): JonesMatrix {
  // Calculate wavelength-dependent phase retardation
  const deltaRad = calculatePhaseRetardation(thicknessUm, birefringence, wavelengthNm)
  // Convert to degrees for retarderMatrix function
  const deltaDeg = retardationToDegrees(deltaRad)
  // Build retarder matrix
  return retarderMatrix(fastAxisDeg, deltaDeg)
}

/**
 * Calculate transmitted intensity for a single wavelength through the
 * Polarizer → Birefringent Sample → Analyzer optical train
 *
 * This uses proper Jones calculus:
 * J_out = M_analyzer × M_retarder(λ) × M_polarizer × J_input
 *
 * For unpolarized input light, we use linearly polarized light at the
 * polarizer angle (since light after first polarizer is linearly polarized).
 *
 * @param params - Spectral Jones parameters
 * @param wavelengthNm - Wavelength in nanometers
 * @returns Transmitted intensity (0-1)
 */
export function calculateTransmissionAtWavelength(
  params: SpectralJonesParams,
  wavelengthNm: number
): number {
  const {
    thickness,
    birefringence,
    polarizerAngle,
    analyzerAngle,
    fastAxisAngle = 45,
  } = params

  // Step 1: Create initial Jones vector (unpolarized → linearly polarized by first polarizer)
  // After passing through the polarizer, light is linearly polarized at polarizerAngle
  const inputJones = STANDARD_JONES_VECTORS.horizontal()

  // Step 2: Build Jones matrices for each element
  const M_polarizer = polarizerMatrix(polarizerAngle)
  const M_retarder = buildRetarderMatrixForWavelength(
    fastAxisAngle,
    thickness,
    birefringence,
    wavelengthNm
  )
  const M_analyzer = polarizerMatrix(analyzerAngle)

  // Step 3: Combine matrices: M_total = M_analyzer × M_retarder × M_polarizer
  // Note: Matrix multiplication is right-to-left (light propagates left-to-right)
  const M_temp = multiplyJonesMatrices(M_retarder, M_polarizer)
  const M_total = multiplyJonesMatrices(M_analyzer, M_temp)

  // Step 4: Apply combined matrix to input
  const outputJones = applyJonesMatrix(M_total, inputJones)

  // Step 5: Calculate output intensity
  // Normalize by input intensity to get transmission (0-1)
  const outputIntensity = jonesIntensity(outputJones)
  const inputIntensity = jonesIntensity(inputJones)

  return inputIntensity > 0 ? outputIntensity / inputIntensity : 0
}

/**
 * Solve for RGB color using representative wavelengths
 *
 * This is the fast method that samples at R=650nm, G=550nm, B=450nm
 * and directly maps transmission to color channels.
 *
 * @param params - Spectral Jones parameters
 * @returns RGB color result
 */
export function solveRGB(params: SpectralJonesParams): RGBColor {
  // Calculate transmission at each representative wavelength
  const tRed = calculateTransmissionAtWavelength(params, SPECTRAL_WAVELENGTHS.RED)
  const tGreen = calculateTransmissionAtWavelength(params, SPECTRAL_WAVELENGTHS.GREEN)
  const tBlue = calculateTransmissionAtWavelength(params, SPECTRAL_WAVELENGTHS.BLUE)

  // Convert transmission (0-1) to RGB values (0-255)
  const r = Math.round(Math.min(255, Math.max(0, tRed * 255)))
  const g = Math.round(Math.min(255, Math.max(0, tGreen * 255)))
  const b = Math.round(Math.min(255, Math.max(0, tBlue * 255)))

  // Calculate overall intensity
  const intensity = (tRed + tGreen + tBlue) / 3

  return {
    r,
    g,
    b,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
    intensity,
  }
}

/**
 * Perform full spectral analysis with detailed results
 *
 * @param params - Spectral Jones parameters
 * @returns Detailed spectral analysis
 */
export function analyzeSpectrum(params: SpectralJonesParams): SpectralAnalysis {
  const { thickness, birefringence } = params

  // Calculate transmission at each RGB wavelength
  const tRed = calculateTransmissionAtWavelength(params, SPECTRAL_WAVELENGTHS.RED)
  const tGreen = calculateTransmissionAtWavelength(params, SPECTRAL_WAVELENGTHS.GREEN)
  const tBlue = calculateTransmissionAtWavelength(params, SPECTRAL_WAVELENGTHS.BLUE)

  // Calculate phase retardation at each wavelength
  const phaseRed = calculatePhaseRetardation(thickness, birefringence, SPECTRAL_WAVELENGTHS.RED)
  const phaseGreen = calculatePhaseRetardation(thickness, birefringence, SPECTRAL_WAVELENGTHS.GREEN)
  const phaseBlue = calculatePhaseRetardation(thickness, birefringence, SPECTRAL_WAVELENGTHS.BLUE)

  // Calculate OPD and retardation order
  const opd = calculateOPD(thickness, birefringence)
  const retardationOrder = opd / 550 // Number of wavelengths at green light

  // Get RGB color
  const color = solveRGB(params)

  return {
    color,
    transmission: {
      red: tRed,
      green: tGreen,
      blue: tBlue,
    },
    phaseRetardation: {
      red: phaseRed,
      green: phaseGreen,
      blue: phaseBlue,
    },
    opticalPathDifference: opd,
    retardationOrder,
  }
}

// ============================================
// High-Precision Spectral Integration
// ============================================

/**
 * CIE 1931 color matching functions (simplified approximation)
 * Returns [x, y, z] tristimulus weights for a given wavelength
 */
function cie1931ColorMatch(wavelengthNm: number): [number, number, number] {
  // Simplified Gaussian approximation of CIE 1931 color matching functions
  const lambda = wavelengthNm

  // X-bar: peaks at ~600nm (red-ish)
  const x = 1.056 * gaussianPeak(lambda, 599.8, 37.9)
    + 0.362 * gaussianPeak(lambda, 442.0, 16.0)
    - 0.065 * gaussianPeak(lambda, 501.1, 20.4)

  // Y-bar: peaks at ~555nm (green, luminosity)
  const y = 0.821 * gaussianPeak(lambda, 568.8, 46.9)
    + 0.286 * gaussianPeak(lambda, 530.9, 31.0)

  // Z-bar: peaks at ~450nm (blue)
  const z = 1.217 * gaussianPeak(lambda, 437.0, 11.8)
    + 0.681 * gaussianPeak(lambda, 459.0, 26.0)

  return [Math.max(0, x), Math.max(0, y), Math.max(0, z)]
}

function gaussianPeak(x: number, mean: number, sigma: number): number {
  return Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2))
}

/**
 * Convert CIE XYZ to sRGB with proper gamma correction
 */
function xyzToSrgb(X: number, Y: number, Z: number): [number, number, number] {
  // CIE XYZ to linear sRGB matrix (D65 illuminant)
  let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z
  let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z
  let b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z

  // Apply sRGB gamma correction
  r = srgbGamma(r)
  g = srgbGamma(g)
  b = srgbGamma(b)

  return [r, g, b]
}

function srgbGamma(linear: number): number {
  if (linear <= 0.0031308) {
    return 12.92 * linear
  }
  return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055
}

/**
 * High-precision spectral integration using CIE color matching
 *
 * Integrates over the visible spectrum using proper colorimetry.
 * More accurate than the 3-wavelength RGB method but slower.
 *
 * @param params - Spectral Jones parameters
 * @returns RGB color result
 */
export function solveRGBHighPrecision(params: SpectralJonesParams): RGBColor {
  let X = 0, Y = 0, Z = 0
  let totalWeight = 0

  // Integrate over visible spectrum
  for (let lambda = VISIBLE_SPECTRUM.MIN; lambda <= VISIBLE_SPECTRUM.MAX; lambda += VISIBLE_SPECTRUM.STEP) {
    // Get transmission at this wavelength
    const transmission = calculateTransmissionAtWavelength(params, lambda)

    // Get CIE color matching function values
    const [xBar, yBar, zBar] = cie1931ColorMatch(lambda)

    // Accumulate weighted tristimulus values
    // Assuming equal-energy white light source
    X += transmission * xBar
    Y += transmission * yBar
    Z += transmission * zBar
    totalWeight += yBar // Use Y (luminosity) for normalization
  }

  // Normalize
  if (totalWeight > 0) {
    const scale = 1 / totalWeight
    X *= scale
    Y *= scale
    Z *= scale
  }

  // Convert to sRGB
  let [r, g, b] = xyzToSrgb(X, Y, Z)

  // Clamp and scale to 0-255
  r = Math.min(1, Math.max(0, r))
  g = Math.min(1, Math.max(0, g))
  b = Math.min(1, Math.max(0, b))

  const rInt = Math.round(r * 255)
  const gInt = Math.round(g * 255)
  const bInt = Math.round(b * 255)

  return {
    r: rInt,
    g: gInt,
    b: bInt,
    rgb: `rgb(${rInt}, ${gInt}, ${bInt})`,
    hex: `#${rInt.toString(16).padStart(2, '0')}${gInt.toString(16).padStart(2, '0')}${bInt.toString(16).padStart(2, '0')}`,
    intensity: Y,
  }
}

// ============================================
// Virtual Tape Experiment Utilities
// ============================================

/**
 * Calculate interference color for stacked tape layers
 *
 * Scientific validation:
 * - 1 layer (~50μm): Low order, grey/white
 * - 2 layers (~100μm): First order, yellow-orange
 * - 3 layers (~150μm): First-second order, red-violet
 * - 4 layers (~200μm): Second order, blue-green
 * - 5+ layers: Higher order colors, more pastels
 *
 * @param layers - Number of tape layers (integer)
 * @param singleLayerThickness - Thickness per layer in μm (default: 50)
 * @param birefringence - Tape birefringence (default: 0.009)
 * @param polarizerAngle - Polarizer angle in degrees (default: 0)
 * @param analyzerAngle - Analyzer angle in degrees (default: 90 for crossed)
 * @param highPrecision - Use high-precision spectral integration
 */
export function calculateTapeColor(
  layers: number,
  singleLayerThickness: number = MATERIAL_THICKNESS.SCOTCH_TAPE,
  birefringence: number = MATERIAL_BIREFRINGENCE.SCOTCH_TAPE,
  polarizerAngle: number = 0,
  analyzerAngle: number = 90,
  highPrecision: boolean = false
): RGBColor {
  const totalThickness = layers * singleLayerThickness

  const params: SpectralJonesParams = {
    thickness: totalThickness,
    birefringence,
    polarizerAngle,
    analyzerAngle,
    fastAxisAngle: 45, // Typical for stretched tape
  }

  return highPrecision ? solveRGBHighPrecision(params) : solveRGB(params)
}

/**
 * Generate Michel-Lévy color chart data points
 *
 * The Michel-Lévy chart maps optical path difference (OPD) to interference colors.
 * This generates colors for a range of OPD values.
 *
 * @param maxOPD - Maximum OPD in nm (default: 2750nm = 5th order)
 * @param samples - Number of samples (default: 100)
 * @param polarizerAngle - Polarizer angle
 * @param analyzerAngle - Analyzer angle
 */
export function generateMichelLevyChart(
  maxOPD: number = 2750,
  samples: number = 100,
  polarizerAngle: number = 0,
  analyzerAngle: number = 90
): Array<{ opd: number; color: RGBColor; order: number }> {
  const results: Array<{ opd: number; color: RGBColor; order: number }> = []

  // Use fixed birefringence, vary thickness to achieve different OPD values
  const birefringence = 0.01 // Arbitrary reference

  for (let i = 0; i <= samples; i++) {
    const opd = (i / samples) * maxOPD
    // OPD = thickness × birefringence, so thickness = OPD / birefringence
    // thickness in nm, we need μm: thickness_um = opd / birefringence / 1000
    const thickness = opd / birefringence / 1000

    const params: SpectralJonesParams = {
      thickness,
      birefringence,
      polarizerAngle,
      analyzerAngle,
      fastAxisAngle: 45,
    }

    const color = solveRGB(params)
    const order = opd / 550 // Approximate retardation order

    results.push({ opd, color, order })
  }

  return results
}

/**
 * SpectralJonesSolver class - Object-oriented interface
 *
 * Provides a convenient class-based API for spectral calculations.
 */
export class SpectralJonesSolver {
  private params: SpectralJonesParams

  constructor(params: SpectralJonesParams) {
    this.params = { ...params, fastAxisAngle: params.fastAxisAngle ?? 45 }
  }

  /** Update solver parameters */
  setParams(params: Partial<SpectralJonesParams>): void {
    this.params = { ...this.params, ...params }
  }

  /** Get current parameters */
  getParams(): SpectralJonesParams {
    return { ...this.params }
  }

  /** Calculate RGB color (fast method) */
  solveRGB(): RGBColor {
    return solveRGB(this.params)
  }

  /** Calculate RGB color (high precision) */
  solveRGBHighPrecision(): RGBColor {
    return solveRGBHighPrecision(this.params)
  }

  /** Get full spectral analysis */
  analyze(): SpectralAnalysis {
    return analyzeSpectrum(this.params)
  }

  /** Get transmission at specific wavelength */
  getTransmission(wavelengthNm: number): number {
    return calculateTransmissionAtWavelength(this.params, wavelengthNm)
  }

  /** Get phase retardation at specific wavelength */
  getPhaseRetardation(wavelengthNm: number): number {
    return calculatePhaseRetardation(
      this.params.thickness,
      this.params.birefringence,
      wavelengthNm
    )
  }

  /** Get optical path difference */
  getOPD(): number {
    return calculateOPD(this.params.thickness, this.params.birefringence)
  }

  /** Get retardation order (at 550nm) */
  getRetardationOrder(): number {
    return this.getOPD() / 550
  }

  /** Generate transmission spectrum data */
  getTransmissionSpectrum(
    minWavelength: number = 400,
    maxWavelength: number = 700,
    step: number = 5
  ): Array<{ wavelength: number; transmission: number }> {
    const spectrum: Array<{ wavelength: number; transmission: number }> = []

    for (let lambda = minWavelength; lambda <= maxWavelength; lambda += step) {
      spectrum.push({
        wavelength: lambda,
        transmission: this.getTransmission(lambda),
      })
    }

    return spectrum
  }
}

// Default export for convenience
export default SpectralJonesSolver
