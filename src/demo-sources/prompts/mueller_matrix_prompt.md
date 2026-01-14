# AI Prompt: Mueller Matrix Demo
# AI 提示词：Mueller矩阵演示

Create a comprehensive interactive Python demo for Mueller matrix calculus, the most general polarization formalism:

## Physical Principle

Mueller matrices are 4×4 real matrices that transform Stokes vectors:

```
S_out = M × S_in
```

Unlike Jones matrices, Mueller matrices can handle:
- Partially polarized light
- Depolarization effects
- Incoherent superposition

Key Mueller matrices:
- Linear polarizer: M₀₀ = 1/2, M₀₁ = M₁₀ = 1/2 cos(2θ), ...
- Retarder (retardation δ): Mixes S₁, S₂, S₃ components
- Depolarizer: Reduces DOP

Lu-Chipman decomposition:
```
M = M_Δ × M_R × M_D
```
- M_Δ: Depolarization
- M_R: Retardance (phase)
- M_D: Diattenuation (amplitude)

## Requirements

### 1. Core Physics
Implement 6+ optical elements as Mueller matrices:
1. Linear Polarizer (angle θ)
2. Quarter-Wave Plate (QWP)
3. Half-Wave Plate (HWP)
4. Optical Rotator (angle φ)
5. Partial Polarizer (diattenuation D)
6. Depolarizer (depolarization factor Δ)

Additional calculations:
- Matrix rotation: M'(θ) = R(θ) M R(-θ)
- Matrix cascade: M_total = M_n @ M_(n-1) @ ... @ M_1
- Lu-Chipman decomposition
- Calculate characteristic parameters:
  * Diattenuation: D = √(M₀₁² + M₀₂² + M₀₃²) / M₀₀
  * Polarizance: P = √(M₁₀² + M₂₀² + M₃₀²) / M₀₀
  * Depolarization index: Δ = 1 - √(Tr(M^T M) - M₀₀²) / (√3 M₀₀)

### 2. Visualization (6 panels)
- Panel 1: Mueller matrix heatmap (4×4, normalized)
- Panel 2: Input Stokes vector (bar chart)
- Panel 3: Output Stokes vector (bar chart)
- Panel 4: Poincaré sphere transformation (3D)
- Panel 5: Parameters table (D, P, Δ, det, trace)
- Panel 6: DOP comparison (input vs output)

### 3. Interactive Controls
- Dropdown: Element type (6 types)
- Slider: Element angle/rotation (0-180°, step=1°)
- Slider: Retardation (0-360° for custom retarder)
- Slider: Diattenuation D (0-1 for partial polarizer)
- Slider: Depolarization Δ (0-1 for depolarizer)
- Input state presets (6 polarization states)
- Buttons: Add element to cascade, Clear
- Toggle: Show normalized matrix (M₀₀ = 1)
- Display: All matrix elements with 3 decimal places
- Display: D, P, Δ values

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
- Figure size: 18×12 inches (2 rows, 3 columns)
- Dark theme #0f172a
- Heatmap colormap: RdBu_r (red-blue diverging)
- 3D Poincaré sphere showing transformation
- Matrix element precision: 3 decimal places

### 5. Code Structure
```python
class MuellerMatrix:
    def __init__(self, matrix=None):
        if matrix is None:
            self.M = np.eye(4)  # Identity
        else:
            self.M = np.array(matrix, dtype=float)

    @classmethod
    def linear_polarizer(cls, angle_deg):
        # Mueller matrix for linear polarizer
        theta = np.radians(angle_deg)
        M = 0.5 * np.array([
            [1,      np.cos(2*theta), np.sin(2*theta), 0],
            [np.cos(2*theta), np.cos(2*theta)**2, ..., 0],
            # ... complete matrix
        ])
        return cls(M)

    @classmethod
    def quarter_wave_plate(cls, angle_deg):
        # QWP Mueller matrix

    @classmethod
    def depolarizer(cls, depolarization_factor):
        # Δ: 0 (no depolarization) to 1 (complete)

    def rotate(self, angle_deg):
        # M'(θ) = R(θ) M R(-θ)

    def diattenuation(self):
        # D = √(M₀₁² + M₀₂² + M₀₃²) / M₀₀

    def polarizance(self):
        # P = √(M₁₀² + M₂₀² + M₃₀²) / M₀₀

    def depolarization_index(self):
        # Δ = 1 - √(Tr(M^T M) - M₀₀²) / (√3 M₀₀)

    def apply(self, stokes_vector):
        # S_out = M × S_in
        return self.M @ stokes_vector.S

    def __matmul__(self, other):
        # Matrix multiplication (cascade)

class MuellerMatrixDemo:
    def __init__(self):
        self.elements = []
        self.input_stokes = StokesVector(1, 1, 0, 0)

    def calculate_cascade(self):
        # M_total = M_n @ ... @ M_1

    def plot_matrix_heatmap(self, ax):
        # 4×4 heatmap with annotations

    def plot_stokes_bar(self, ax, stokes, title):
        # Bar chart for Stokes parameters

    def plot_poincare(self, ax):
        # 3D transformation on sphere
```

### 6. Additional Features
- Preset configurations:
  * Malus's Law (two polarizers)
  * Linear to circular (polarizer + QWP)
  * Depolarization example
- Show Lu-Chipman decomposition M = M_Δ × M_R × M_D
- Physics formula card for each element
- Comparison with Jones matrices (for fully polarized)
- Experimental realizability: 16 measurements needed
- Applications:
  * Polarimetric imaging
  * Material characterization
  * Biomedical diagnostics
- Save/Load configurations
- Export matrix as CSV/LaTeX

### 7. Validation Tests
- Identity: M = I(4×4) → no change
- Polarizer transmission: H polarizer on H light → S₁ = S₀
- Cascade: Two parallel polarizers → light passes
- Cascade: Two crossed polarizers → S = [0, 0, 0, 0]
- QWP: Linear 45° → Circular (S₃ = ±S₀)
- HWP: Linear H → Linear V
- Rotator: Rotates S₁, S₂ (preserves S₃)
- Diattenuation: Perfect polarizer D = 1, rotator D = 0
- Depolarization: Δ > 0 reduces output DOP
- Malus's Law: I_out = I₀ cos²θ

## Expected Output
~840-880 lines of comprehensive Python code with 4×4 matrix visualization.

## Reference
- Goldstein, Polarized Light, Chapter 4
- Lu, S.-Y., & Chipman, R.A. (1996). "Interpretation of Mueller matrices based on polar decomposition"
- Chipman, R.A., et al. (2018). Polarized Light and Optical Systems
