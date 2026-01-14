# AI Prompt: Birefringence Demo
# AI 提示词：双折射演示

Create an interactive Python demo for birefringence in calcite crystals with the following specifications:

## Physical Principle

Birefringent crystals (e.g., calcite) have two different refractive indices, causing incident light to split into:
- **Ordinary ray (o-ray)**: Follows Snell's law, polarized perpendicular to optic axis
- **Extraordinary ray (e-ray)**: Does not follow Snell's law, polarized parallel to optic axis

Refractive indices for calcite: n_o ≈ 1.658, n_e ≈ 1.486

## Requirements

### 1. Core Physics
- Snell's law for o-ray: n₁ sin(θ₁) = n_o sin(θ_o)
- e-ray refraction using extraordinary index n_e
- Calculate ray separation distance
- Polarization: o-ray at 0°, e-ray at 90°

### 2. Visualization (using matplotlib + 3D)
- Panel 1: 3D view of ray paths through crystal
  * Incident beam (white)
  * Crystal block (transparent gray)
  * o-ray (red) and e-ray (green)
  * Polarization arrows
- Panel 2: Top view (XY plane) showing ray separation
- Panel 3: Side view (XZ plane) showing refraction
- Panel 4: Refractive index ellipsoid visualization

### 3. Interactive Controls
- Slider: Incident angle (0-60°, step=1°)
- Slider: Crystal thickness (1-10 mm, step=0.5)
- Slider: Crystal rotation (optic axis orientation, 0-90°)
- Dropdown: Crystal type (Calcite, Quartz, others)
- Toggle: Show/hide polarization arrows
- Display: Ray separation distance (in mm)

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib, mpl_toolkits.mplot3d
- Figure size: 16×8 inches (4 panels)
- Dark theme: #0f172a background
- 3D rotation enabled (azimuth, elevation controls)
- MATLAB version compatible (use same algorithms)

### 5. Code Structure
```python
class BirefringenceDemo:
    def __init__(self):
        self.n_o = 1.658  # Ordinary index
        self.n_e = 1.486  # Extraordinary index

    def calculate_o_ray(self, incident_angle):
        # Snell's law for ordinary ray

    def calculate_e_ray(self, incident_angle, crystal_rotation):
        # Extraordinary ray calculation

    def calculate_separation(self, thickness):
        # Distance between o and e rays

    def plot_3d_rays(self, ax):
        # 3D visualization

    def update_all_views(self):
        # Update all 4 panels
```

### 6. Additional Features
- Show optic axis direction in crystal
- Display refractive index values
- Phase difference between o and e rays
- Walk-off angle calculation
- Polarization state visualization (arrows)
- Physics principle explanation card

### 7. Validation
- o-ray follows Snell's law
- e-ray and o-ray are orthogonally polarized
- Ray separation increases with crystal thickness
- Energy conservation: I_o + I_e = I_incident

## Expected Output
~450-500 lines of Python code with 3D visualization.

## Reference
Born & Wolf, Principles of Optics, Section 15.3
