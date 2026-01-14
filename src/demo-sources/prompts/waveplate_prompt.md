# AI Prompt: Waveplate Demo
# AI 提示词：波片演示

Create an interactive Python demo for waveplates (quarter-wave and half-wave plates) in polarization optics:

## Physical Principle

Waveplates introduce phase retardation δ between ordinary and extraordinary ray components:
- **Quarter-wave plate (QWP)**: δ = π/2 (90°) → Converts linear ↔ circular polarization
- **Half-wave plate (HWP)**: δ = π (180°) → Rotates linear polarization by 2θ

Jones matrix for waveplate:
```
J = [e^(iδ/2)    0        ]
    [0           e^(-iδ/2) ]
```
(in fast/slow axis basis)

## Requirements

### 1. Core Physics
- Phase retardation: δ = 2π(n_e - n_o)d/λ
- QWP: Linear (45°) → Circular (RCP/LCP)
- HWP: Linear (θ) → Linear (-θ relative to fast axis)
- Jones calculus for polarization transformation
- Poincaré sphere trajectory

### 2. Visualization (6 panels)
- Panel 1: Input polarization state (linear arrow)
- Panel 2: Waveplate schematic (fast/slow axes)
- Panel 3: Output polarization state (ellipse/circle/linear)
- Panel 4: Poincaré sphere showing transformation
- Panel 5: Phase vs position through waveplate
- Panel 6: Ellipse parameters (a, b, orientation, chirality)

### 3. Interactive Controls
- Slider: Waveplate type (retardation 0-360°, or presets QWP/HWP)
- Slider: Waveplate rotation angle (0-180°, step=1°)
- Slider: Input polarization angle (0-180°, step=1°)
- Slider: Wavelength λ (400-700 nm for chromatic effects)
- Radio buttons: Plate type (QWP λ/4 / HWP λ/2 / Custom)
- Toggle: Show Poincaré sphere
- Display: Output polarization type (linear/circular/elliptical)
- Display: Ellipse parameters

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
- Figure size: 16×10 inches
- Dark theme #0f172a
- Animate waveplate rotation if desired
- 3D Poincaré sphere with trajectory line

### 5. Code Structure
```python
class WaveplateDemo:
    def __init__(self):
        self.retardation = 90  # degrees (QWP default)

    def jones_waveplate(self, retardation_deg, rotation_deg):
        # Jones matrix with rotation

    def apply_waveplate(self, input_jones):
        # Transform input state

    def jones_to_polarization_type(self, jones):
        # Classify as linear/circular/elliptical

    def plot_polarization_state(self, ax, jones, title):
        # Draw polarization ellipse

    def plot_poincare_sphere(self, ax):
        # 3D sphere with states

    def calculate_ellipse_params(self, jones):
        # Major/minor axes, orientation, chirality
```

### 6. Additional Features
- Show fast and slow axes on waveplate diagram
- Animate electric field rotation
- Multiple wavelength comparison
- Achromatic waveplate option
- Physics principle card
- Special transformations:
  * Linear 0° + QWP(45°) → LCP
  * Linear 0° + HWP(22.5°) → Linear 45°
- Stokes parameter display

### 7. Validation
- QWP: Linear 45° → Circular (S₃ = ±1)
- HWP: Linear 0° → Linear 0° when aligned
- HWP: Linear 0° at 45° → Linear 90°
- Energy conservation: |output|² = |input|²

## Expected Output
~590-610 lines of Python with 3D visualization and Jones calculus.

## Reference
Goldstein, Polarized Light, Chapter 5
