# AI Prompt: Fresnel Equations Demo
# AI 提示词：菲涅尔方程演示

Create an interactive Python demo for Fresnel equations describing reflection and transmission at interfaces:

## Physical Principle

Fresnel equations describe amplitude reflection (r) and transmission (t) coefficients for light at an interface between two media:

**For s-polarization (TE)**:
```
r_s = (n₁cosθᵢ - n₂cosθₜ) / (n₁cosθᵢ + n₂cosθₜ)
t_s = 2n₁cosθᵢ / (n₁cosθᵢ + n₂cosθₜ)
```

**For p-polarization (TM)**:
```
r_p = (n₂cosθᵢ - n₁cosθₜ) / (n₂cosθᵢ + n₁cosθₜ)
t_p = 2n₁cosθᵢ / (n₂cosθᵢ + n₁cosθₜ)
```

Reflectance R = |r|², Transmittance T = (n₂cosθₜ)/(n₁cosθᵢ) × |t|²

## Requirements

### 1. Core Physics
- Implement all 4 Fresnel coefficients (r_s, r_p, t_s, t_p)
- Calculate reflectance R and transmittance T
- Apply Snell's law: n₁sinθᵢ = n₂sinθₜ
- Handle total internal reflection (θᵢ > θ_c)
- Identify Brewster's angle where R_p = 0

### 2. Visualization (6 panels)
- Panel 1: Reflectance R_s vs angle (0-90°)
- Panel 2: Reflectance R_p vs angle (0-90°)
- Panel 3: Transmittance T_s vs angle
- Panel 4: Transmittance T_p vs angle
- Panel 5: Schematic diagram (incident, reflected, transmitted rays)
- Panel 6: Phase shift diagram

### 3. Interactive Controls
- Slider: n₁ (1.0-3.0, step=0.1) - first medium index
- Slider: n₂ (1.0-3.0, step=0.1) - second medium index
- Slider: Incident angle θᵢ (0-90°, step=1°)
- Radio buttons: Polarization (s/p/unpolarized)
- Presets: Air→Glass, Glass→Air, Water→Glass
- Display: Critical angle, Brewster's angle
- Display: Current R and T values

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib
- Figure size: 18×10 inches (2 rows, 3 columns)
- Dark theme with cyan/magenta for TE/TM
- Mark special angles (Brewster, critical) on plots

### 5. Code Structure
```python
class FresnelDemo:
    def __init__(self):
        self.n1 = 1.0  # First medium
        self.n2 = 1.5  # Second medium

    def fresnel_coefficients(self, theta_i, polarization):
        # Calculate r_s, r_p, t_s, t_p

    def calculate_brewster_angle(self):
        # θ_B = arctan(n₂/n₁)

    def calculate_critical_angle(self):
        # θ_c = arcsin(n₂/n₁) if n₁ > n₂

    def plot_reflectance(self, ax):
        # R vs angle

    def plot_transmittance(self, ax):
        # T vs angle

    def plot_schematic(self, ax):
        # Ray diagram
```

### 6. Additional Features
- Highlight Brewster's angle (R_p = 0)
- Show total internal reflection region
- Phase shift at interface (0 or π)
- Energy conservation check: R + T = 1
- Special case indicators
- Formula display with current values

### 7. Validation
- R + T = 1 (energy conservation)
- R_p(θ_B) = 0 (Brewster's angle)
- R = 1 for θ > θ_c (total internal reflection)
- Normal incidence: R = ((n₁-n₂)/(n₁+n₂))²

## Expected Output
~520-570 lines of Python code with comprehensive visualization.

## Reference
Hecht, Optics, Section 4.7; Born & Wolf, Section 1.5
