# AI Prompt: Rayleigh Scattering Demo
# AI 提示词：瑞利散射演示

Create an interactive Python demo for Rayleigh scattering explaining sky polarization:

## Physical Principle

Rayleigh scattering occurs when light interacts with particles much smaller than wavelength (d << λ):

```
Intensity: I ∝ 1/λ⁴ (strong wavelength dependence → blue sky)
Scattering angle dependence: I(θ) ∝ (1 + cos²θ)
Degree of Polarization: DOP(θ) = sin²θ / (1 + cos²θ)
```

Maximum polarization (DOP = 1) occurs at 90° from the sun.

## Requirements

### 1. Core Physics
- Rayleigh formula: I_scattered ∝ (1/λ⁴) × (1 + cos²θ)
- Degree of polarization: DOP = sin²θ / (1 + cos²θ)
- Wavelength dependence (blue >> red scattering)
- Sky color calculation based on scattering
- Polarization pattern in sky

### 2. Visualization (6 panels)
- Panel 1: Sky dome with polarization pattern
  * Sun position indicator
  * Color-coded DOP (0 to 1)
  * Polarization arrows at various angles
- Panel 2: Scattering intensity vs angle (polar plot)
- Panel 3: DOP vs scattering angle (0-180°)
- Panel 4: Wavelength dependence (I vs λ)
- Panel 5: Sky color simulation (scattered spectrum)
- Panel 6: Schematic: sunlight, air molecules, observer

### 3. Interactive Controls
- Slider: Sun elevation angle (-90° to +90°, sunrise to sunset)
- Slider: Observation angle relative to sun (0-180°)
- Slider: Wavelength for single-color mode (400-700 nm)
- Toggle: Full spectrum / Single wavelength
- Toggle: Show polarization vectors
- Display: DOP at current observation angle
- Display: Scattering intensity relative to forward

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib
- Figure size: 18×10 inches (2 rows, 3 columns)
- Dark theme with sky gradient simulation
- Polar plots for angular distribution
- Color mapping for wavelength (spectral colormap)

### 5. Code Structure
```python
class RayleighScatteringDemo:
    def __init__(self):
        self.wavelength_range = np.linspace(400, 700, 100)

    def rayleigh_intensity(self, wavelength, scattering_angle):
        # I ∝ (1/λ⁴) × (1 + cos²θ)

    def degree_of_polarization(self, scattering_angle):
        # DOP = sin²θ / (1 + cos²θ)

    def calculate_sky_color(self, sun_angle, view_angle):
        # Integrate scattered spectrum

    def plot_sky_dome(self, ax):
        # 2D sky map with polarization

    def plot_polar_intensity(self, ax):
        # I(θ) in polar coordinates

    def plot_dop_vs_angle(self, ax):
        # DOP curve
```

### 6. Additional Features
- Show Neutral Points (Brewster, Babinet, Arago points)
- Sunset/sunrise color explanation (long path → more scattering)
- Compare Rayleigh vs Mie scattering
- Applications:
  * Sky polarization for navigation (animals)
  * Remote sensing
  * Atmospheric science
- Physics principle card with formulas
- Interactive sky color at different sun angles
- Wavelength color scale bar

### 7. Validation
- DOP(90°) = 1 (maximum polarization)
- DOP(0°) = DOP(180°) = 0 (forward/backward)
- Blue light scattered ~10× more than red
- Sky is polarized perpendicular to sun direction

## Expected Output
~290-340 lines of Python code with sky simulation.

## Reference
Born & Wolf, Principles of Optics, Section 13.5; Bohren & Huffman, Absorption and Scattering of Light by Small Particles
