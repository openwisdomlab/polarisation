# AI Prompt: Brewster's Angle Demo
# AI 提示词：布儒斯特角演示

Create an interactive Python demo for Brewster's angle, where p-polarized light has zero reflectance:

## Physical Principle

Brewster's angle θ_B is the incident angle at which p-polarized (TM) light is completely transmitted with no reflection:

```
θ_B = arctan(n₂/n₁)
```

At Brewster's angle:
- Reflected and refracted rays are perpendicular (90° separation)
- R_p = 0 (no reflection of p-polarized light)
- R_s ≠ 0 (s-polarized light still reflects)
- Reflected light becomes fully s-polarized

## Requirements

### 1. Core Physics
- Calculate θ_B = arctan(n₂/n₁)
- Fresnel equations for R_p and R_s vs angle
- Verify θ_r + θ_t = 90° at Brewster's angle
- Degree of polarization in reflected light

### 2. Visualization (4 panels)
- Panel 1: Reflectance R_s and R_p vs angle (0-90°)
  * Highlight θ_B where R_p = 0
- Panel 2: Schematic ray diagram
  * Show incident, reflected, transmitted rays
  * Display 90° angle between reflected/transmitted
  * Polarization arrows (s: dots, p: arrows)
- Panel 3: Degree of Polarization (DOP) in reflected light
- Panel 4: Practical applications illustration

### 3. Interactive Controls
- Slider: n₁ (1.0-2.5, step=0.1) - incident medium
- Slider: n₂ (1.0-3.0, step=0.1) - transmitted medium
- Slider: Incident angle (0-90°, step=0.5°)
- Presets:
  * Air → Glass (1.0 → 1.5): θ_B = 56.3°
  * Air → Water (1.0 → 1.33): θ_B = 53.1°
  * Water → Glass (1.33 → 1.5): θ_B = 48.4°
- Toggle: Show Brewster angle indicator
- Display: θ_B value, current R_p and R_s

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib
- Figure size: 14×8 inches (2×2 grid)
- Dark theme with red (s) and blue (p) color coding
- Vertical line marking θ_B on reflectance plot

### 5. Code Structure
```python
class BrewsterAngleDemo:
    def __init__(self):
        self.n1 = 1.0
        self.n2 = 1.5

    def calculate_brewster_angle(self):
        # θ_B = arctan(n₂/n₁)

    def fresnel_rs_rp(self, theta_i):
        # R_s and R_p using Fresnel equations

    def degree_of_polarization(self, theta_i):
        # DOP = (R_s - R_p) / (R_s + R_p)

    def plot_reflectance(self, ax):
        # R vs angle with θ_B marked

    def plot_ray_diagram(self, ax):
        # Show geometry at θ_B

    def plot_dop(self, ax):
        # DOP vs angle
```

### 6. Additional Features
- Annotations for key angles
- Show perpendicular relationship at θ_B
- Polarization state of reflected light (fully s at θ_B)
- Applications:
  * Polarizing filters
  * Anti-glare coatings
  * Brewster windows in lasers
  * Polarized sunglasses principle
- Formula display panel
- Physics explanation card

### 7. Validation
- R_p(θ_B) = 0 exactly
- R_s(θ_B) > 0
- θ_reflected + θ_transmitted = 90° at θ_B
- DOP → 1 (100% polarized) at θ_B

## Expected Output
~260-300 lines of concise Python code.

## Reference
Hecht, Optics, Section 4.8
