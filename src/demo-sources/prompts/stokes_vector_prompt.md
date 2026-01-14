# AI Prompt: Stokes Vector Demo
# AI 提示词：Stokes向量演示

Create an interactive Python demo for Stokes vector representation of polarization states:

## Physical Principle

Stokes parameters are four real numbers describing any polarization state (including partial):

```
S = [S₀, S₁, S₂, S₃]^T
```

where:
- S₀ = I_total = I_H + I_V (total intensity)
- S₁ = I_H - I_V (horizontal vs vertical preference)
- S₂ = I_+45 - I_-45 (diagonal preference)
- S₃ = I_RCP - I_LCP (circular handedness)

```
Degree of Polarization: DOP = √(S₁² + S₂² + S₃²) / S₀
```

- DOP = 0: Unpolarized
- 0 < DOP < 1: Partially polarized
- DOP = 1: Fully polarized

## Requirements

### 1. Core Physics
- Calculate Stokes vector from intensity measurements
- Calculate DOP, ellipse parameters
- Map to Poincaré sphere: (S₁, S₂, S₃) on sphere of radius S₀
- Decompose into polarized + unpolarized components
- Convert from/to Jones vector
- Mueller matrix transformations: S_out = M × S_in

### 2. Visualization (6 panels)
- Panel 1: Stokes parameters bar chart (S₀, S₁, S₂, S₃)
- Panel 2: Polarization ellipse with parameters
- Panel 3: Poincaré sphere (3D) with current state marked
- Panel 4: DOP indicator (circular gauge)
- Panel 5: Decomposition: Polarized + Unpolarized
- Panel 6: Intensity measurements (I_H, I_V, I_+45, I_-45, I_R, I_L)

### 3. Interactive Controls
- Slider: S₀ (total intensity, 0-100)
- Slider: S₁ (-100 to +100, H/V preference)
- Slider: S₂ (-100 to +100, diagonal)
- Slider: S₃ (-100 to +100, circular)
- Constraint: S₁² + S₂² + S₃² ≤ S₀² (physical realizability)
- Presets:
  * Horizontal linear (S = [1, 1, 0, 0])
  * Vertical linear (S = [1, -1, 0, 0])
  * +45° linear (S = [1, 0, 1, 0])
  * RCP (S = [1, 0, 0, 1])
  * LCP (S = [1, 0, 0, -1])
  * Unpolarized (S = [1, 0, 0, 0])
- Display: DOP, ellipse orientation, ellipticity, chirality
- Toggle: Normalized (S₀ = 1) vs absolute values

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
- Figure size: 18×12 inches (2 rows, 3 columns)
- Dark theme #0f172a
- 3D Poincaré sphere with rotation
- Color-code: Positive (green), Negative (red), Zero (gray)
- Real-time constraint checking (physical realizability)

### 5. Code Structure
```python
class StokesVector:
    def __init__(self, S0, S1, S2, S3):
        self.S = np.array([S0, S1, S2, S3])
        self.validate()  # Check S₁² + S₂² + S₃² ≤ S₀²

    def degree_of_polarization(self):
        return np.sqrt(self.S[1]**2 + self.S[2]**2 + self.S[3]**2) / self.S[0]

    def ellipse_parameters(self):
        # Orientation: ψ = 0.5 * arctan(S₂/S₁)
        # Ellipticity: χ = 0.5 * arcsin(S₃/√(S₁²+S₂²+S₃²))

    def to_jones(self):
        # Convert to Jones vector (if DOP = 1)

    def decompose(self):
        # Polarized + unpolarized components

    @classmethod
    def from_jones(cls, jones_vector):
        # Jones → Stokes conversion

class StokesVectorDemo:
    def __init__(self):
        self.stokes = StokesVector(1, 0, 0, 0)

    def plot_stokes_bar(self, ax):
        # Bar chart for S₀, S₁, S₂, S₃

    def plot_poincare_sphere(self, ax):
        # 3D sphere with state

    def plot_polarization_ellipse(self, ax):
        # Ellipse visualization

    def plot_dop_gauge(self, ax):
        # Circular DOP indicator
```

### 6. Additional Features
- Show intensity measurements needed for Stokes determination
- Polarimeter simulation (6 measurements)
- Physics formula card with definitions
- Poincaré sphere regions:
  * Equator: Linear polarization
  * North pole: RCP
  * South pole: LCP
  * Interior: Partially polarized
- Trajectory animation (optional)
- Comparison with Jones representation
- Malus's Law verification using Stokes

### 7. Validation Tests
- Physical realizability: S₁² + S₂² + S₃² ≤ S₀²
- DOP ∈ [0, 1]
- Horizontal linear: S = [1, 1, 0, 0], DOP = 1
- Unpolarized: S = [1, 0, 0, 0], DOP = 0
- RCP: S = [1, 0, 0, 1], circular
- Orthogonal states: antipodal on Poincaré sphere
- Jones-Stokes consistency for fully polarized light

## Expected Output
~840-880 lines of Python code with 3D Poincaré sphere.

## Reference
- Goldstein, Polarized Light, Chapter 3
- Stokes, G.G. (1852). "On the Composition and Resolution of Streams of Polarized Light"
