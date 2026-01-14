# AI Prompt: Jones Matrix Demo
# AI 提示词：Jones矩阵演示

Create a comprehensive interactive Python demo for Jones matrix calculus in polarization optics:

## Physical Principle

Jones calculus uses complex 2×2 matrices to describe polarization transformations for fully polarized light:

```
E_out = J × E_in
```

where E = [E_x, E_y]^T is the Jones vector and J is the Jones matrix.

Common Jones matrices:
- Linear polarizer (θ): [cos²θ, cosθsinθ; cosθsinθ, sin²θ]
- QWP: [1, 0; 0, i] (fast axis along x)
- HWP: [1, 0; 0, -1]
- Rotator (φ): [cos(φ), sin(φ); -sin(φ), cos(φ)]

## Requirements

### 1. Core Physics
Implement 6+ optical elements as Jones matrices:
1. Linear Polarizer (angle θ)
2. Quarter-Wave Plate (QWP, retardation 90°)
3. Half-Wave Plate (HWP, retardation 180°)
4. Optical Rotator (rotation angle φ)
5. Mirror (reflection)
6. Phase Shifter

Additional calculations:
- Matrix rotation: J'(θ) = R(-θ) J R(θ)
- Matrix cascade: J_total = J_n @ J_(n-1) @ ... @ J_1
- Eigenvalue analysis for eigenpolarizations
- Conversion to Stokes parameters

### 2. Visualization (6 panels)
- Panel 1: Jones matrix display (2×2 heatmap, complex values)
- Panel 2: Input polarization state (ellipse)
- Panel 3: Output polarization state (ellipse)
- Panel 4: Poincaré sphere transformation (3D)
- Panel 5: Cascade chain diagram (multiple elements)
- Panel 6: Eigenvalue/eigenvector display

### 3. Interactive Controls
- Dropdown: Element type (6 types)
- Slider: Element angle/rotation (0-180°, step=1°)
- Slider: Input polarization angle (0-180°)
- Slider: Input ellipticity (-45° to +45°)
- Buttons: Add element to cascade, Remove, Clear all
- Toggle: Show real/imaginary parts separately
- Display: Matrix elements (formatted complex numbers)
- Display: Output state parameters (orientation, ellipticity, chirality)

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
- Complex number support (numpy complex128)
- Figure size: 18×12 inches (2 rows, 3 columns)
- Dark theme #0f172a
- 3D Poincaré sphere with interactive rotation
- Matrix displayed with real and imaginary color-coding

### 5. Code Structure
```python
class JonesVector:
    def __init__(self, Ex, Ey):
        self.E = np.array([Ex, Ey], dtype=complex)

    def intensity(self):
        return np.sum(np.abs(self.E)**2)

    def to_stokes(self):
        # Convert to Stokes vector

class JonesMatrix:
    def __init__(self, matrix):
        self.J = np.array(matrix, dtype=complex)

    @classmethod
    def linear_polarizer(cls, angle_deg):
        # Polarizer matrix

    @classmethod
    def quarter_wave_plate(cls, angle_deg):
        # QWP matrix with rotation

    def rotate(self, angle_deg):
        # Rotate optical element

    def __matmul__(self, other):
        # Matrix multiplication or apply to vector

    def eigenanalysis(self):
        # Eigenvalues and eigenvectors

class JonesMatrixDemo:
    def __init__(self):
        self.elements = []  # Cascade chain

    def add_element(self, element_type, angle):
        # Add to cascade

    def calculate_cascade(self):
        # J_total = J_n @ ... @ J_1

    def update_all_visualizations(self):
        # Update all 6 panels
```

### 6. Additional Features
- Preset configurations:
  * Malus's Law: Polarizer → Polarizer (crossed)
  * Linear to circular: Linear + QWP(45°)
  * Polarization rotation: HWP at angle
- Save/Load cascade configurations
- Export Jones matrix as LaTeX or NumPy
- Show intermediate states in cascade
- Formula display for each element
- Physics principles card
- Polarization ellipse parameters (a, b, ψ, χ)
- Stokes parameter comparison

### 7. Validation Tests
- Identity: I(2×2) gives no change
- Polarizer: Reduces intensity by cos²θ
- QWP: Linear 45° → Circular (|E_x| = |E_y|, phase diff 90°)
- HWP: Flips polarization across fast axis
- Cascade: (J₂ @ J₁) × E = J₂ × (J₁ × E)
- Energy conservation: |E_out|² ≤ |E_in|²
- Orthogonality: Eigenpolarizations perpendicular

## Expected Output
~1,200-1,300 lines of comprehensive Python code with complex visualization.

## Reference
- Goldstein, Polarized Light, Chapter 2
- Jones, R.C. (1941). "A New Calculus for the Treatment of Optical Systems"
