# AI Prompt: Optical Rotation Demo
# AI 提示词：旋光性演示

Create an interactive Python demo for optical rotation (optical activity) in chiral materials:

## Physical Principle

Chiral molecules rotate the plane of polarized light as it propagates:

```
θ = α × L × C
```

where:
- θ = rotation angle (degrees)
- α = specific rotation (deg·mL/g·dm)
- L = path length (dm)
- C = concentration (g/mL)

Common values:
- Glucose (D-): α ≈ +52.7° (dextrorotatory at 589 nm)
- Fructose (D-): α ≈ -92.4° (levorotatory at 589 nm)

## Requirements

### 1. Core Physics
- Rotation formula: θ = αLC
- Wavelength dependence (optical rotatory dispersion)
- Circular birefringence: n_L ≠ n_R
- Decompose linear into LCP + RCP
- Different phase velocities cause rotation

### 2. Visualization (5 panels)
- Panel 1: Polarization rotation animation
  * Input linear polarization (vertical)
  * Progressive rotation through sample
  * Output rotated polarization
- Panel 2: Top view showing rotation vs distance
- Panel 3: Rotation angle vs concentration (linear)
- Panel 4: Rotation vs wavelength (ORD curve)
- Panel 5: Circular birefringence explanation diagram

### 3. Interactive Controls
- Slider: Concentration (0-1 g/mL, step=0.01)
- Slider: Path length (0-10 dm, step=0.5)
- Slider: Wavelength (400-700 nm, step=10)
- Dropdown: Material type (Glucose, Fructose, Quartz, Turpentine)
- Toggle: Show LCP/RCP decomposition
- Display: Total rotation angle
- Display: Specific rotation α for selected material

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib
- Figure size: 16×9 inches (5 panels)
- Dark theme #0f172a
- Animate rotation (optional playback)
- Color-code: LCP (blue), RCP (red)

### 5. Code Structure
```python
class OpticalRotationDemo:
    def __init__(self):
        self.materials = {
            'glucose': {'alpha': 52.7, 'name': 'D-Glucose'},
            'fructose': {'alpha': -92.4, 'name': 'D-Fructose'},
            # ... more materials
        }

    def calculate_rotation(self, alpha, length, concentration):
        # θ = α × L × C

    def wavelength_dependence(self, wavelength):
        # ORD: α(λ) ≈ A / (λ² - λ₀²)

    def decompose_to_circular(self, linear_angle):
        # Linear = (LCP + RCP) / 2

    def plot_rotation_animation(self, ax):
        # Show progressive rotation

    def plot_rotation_vs_concentration(self, ax):
        # Linear relationship
```

### 6. Additional Features
- Show molecular chirality (L/D isomers)
- Practical applications:
  * Sugar concentration measurement (polarimetry)
  * Pharmaceutical quality control
  * Chiral molecule detection
- Comparison table for different materials
- ORD (Optical Rotatory Dispersion) curve
- Formula explanation panel
- Enantiomer comparison (D vs L)

### 7. Validation
- Linear relationship: θ ∝ C (at fixed L, λ)
- Opposite rotation for enantiomers
- θ(glucose, 1g/mL, 1dm, 589nm) = 52.7°
- Rotation increases with path length

## Expected Output
~270-320 lines of Python code with animation.

## Reference
Goldstein, Polarized Light, Chapter 8
