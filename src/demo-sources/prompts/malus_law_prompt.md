# AI Prompt: Malus's Law Demo
# AI 提示词：马吕斯定律演示

Create an interactive Python demo for Malus's Law in polarization optics with the following specifications:

## Physical Principle

Malus's Law describes the intensity of polarized light after passing through a polarizer:

```
I = I₀ × cos²(θ)
```

where I₀ is incident intensity and θ is the angle between light polarization and polarizer axis.

## Requirements

### 1. Core Physics
- Implement Malus's Law formula: I = I₀ × cos²(θ)
- Visualize intensity vs angle relationship
- Show both linear and circular plots
- Real-time calculation as angle changes

### 2. Visualization (using matplotlib)
- Panel 1: Linear plot (Intensity vs Angle, 0-180°)
- Panel 2: Polar plot showing cos²θ pattern
- Panel 3: Schematic diagram showing:
  * Light source (unpolarized)
  * First polarizer (vertical)
  * Second polarizer (rotatable)
  * Transmitted light intensity
- Use arrows for polarization direction
- Color-code: incident (cyan), transmitted (yellow/dim based on intensity)

### 3. Interactive Controls
- Slider: Polarizer angle (0-180°, step=1°)
- Slider: Incident intensity I₀ (0-100, step=1)
- Display: Current transmitted intensity value
- Display: Relative intensity percentage
- Reset button

### 4. Technical Specs
- Language: Python 3.8+
- Libraries: numpy, matplotlib
- Figure size: 15×5 inches (3 panels side-by-side)
- Dark theme: background #0f172a, text white
- Update rate: Real-time with slider movement
- No external dependencies beyond numpy/matplotlib

### 5. Code Structure
```python
class MalusLawDemo:
    def __init__(self):
        # Initialize figure and axes

    def calculate_intensity(self, angle_deg):
        # I = I₀ × cos²(θ)

    def update_visualization(self):
        # Update all three panels

    def run(self):
        # Main event loop
```

### 6. Additional Features
- Annotations for key angles (0°, 45°, 90°)
- Show special cases:
  * 0°: Maximum transmission (I = I₀)
  * 45°: Half intensity (I = I₀/2)
  * 90°: Zero transmission (crossed polarizers)
- Physics info card with formula explanation
- Bilingual labels (English + Chinese)

### 7. Validation
- Verify I(0°) = I₀
- Verify I(90°) = 0
- Verify I(45°) = I₀/2
- Energy conservation: I ≤ I₀ always

## Expected Output
~400-500 lines of clean, documented Python code with interactive visualization.

## Reference
Hecht, Optics, 5th Edition, Section 8.4
