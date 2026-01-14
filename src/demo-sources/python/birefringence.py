"""
Birefringence (Double Refraction) Interactive Demonstration
双折射效应交互演示

Physical Principle 物理原理:
────────────────────────────────────────────────────────────────
Birefringent materials (like calcite crystals) split light into two rays:
双折射材料（如方解石晶体）将光分成两束：

    1. o-ray (ordinary ray): I_o = I₀ × cos²(θ)
       寻常光：偏振方向垂直于主截面

    2. e-ray (extraordinary ray): I_e = I₀ × sin²(θ)
       非常光：偏振方向在主截面内

where θ is the angle between incident polarization and the optic axis.
其中θ是入射偏振方向与光轴的夹角。

Energy Conservation 能量守恒:
    I_o + I_e = I₀ × (cos²θ + sin²θ) = I₀

Key Concepts 关键概念:
    - Anisotropic materials have different refractive indices in different directions
      各向异性材料在不同方向具有不同的折射率
    - The optic axis is a special direction with unique optical properties
      光轴是具有独特光学性质的特殊方向
    - Polarization is preserved after splitting (o-ray ⊥ e-ray)
      分裂后偏振方向保持（o光⊥e光）

Educational Value 教学价值:
    - Demonstrates Malus's Law in action (intensity ∝ cos²θ)
      展示马吕斯定律的实际应用
    - Illustrates material anisotropy effects
      说明材料各向异性效应
    - Foundation for understanding wave plates and optical isolators
      理解波片和光隔离器的基础

Dependencies 依赖项:
    numpy>=1.24.0    : Numerical computations
    matplotlib>=3.7.0: Interactive visualization
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from matplotlib.patches import Circle, Rectangle, FancyArrow, Wedge
from matplotlib.collections import LineCollection
import matplotlib.patches as mpatches

# ============================================================================
# PHYSICAL CONSTANTS AND PARAMETERS
# 物理常数和参数
# ============================================================================

I0 = 100.0              # Initial light intensity (arbitrary units) 初始光强（任意单位）
WAVELENGTH = 550        # Light wavelength in nm (green light) 光波长（纳米）
N_O = 1.658             # Ordinary ray refractive index for calcite 方解石寻常光折射率
N_E = 1.486             # Extraordinary ray refractive index for calcite 方解石非常光折射率
DELTA_N = N_O - N_E     # Birefringence (双折射率差) = 0.172

# Visualization parameters 可视化参数
FIG_SIZE = (14, 8)      # Figure size in inches
DPI = 100               # Display resolution


# ============================================================================
# CORE PHYSICS FUNCTIONS
# 核心物理函数
# ============================================================================

def calculate_birefringence_intensities(theta_degrees, I_initial=I0):
    """
    Calculate o-ray and e-ray intensities based on input polarization angle.
    根据输入偏振角度计算o光和e光强度。

    Physical Basis 物理基础:
    ─────────────────────────
    When linearly polarized light enters a birefringent crystal:
    当线偏振光进入双折射晶体时：

    1. The electric field vector E⃗ is decomposed into two components:
       电场矢量E⃗被分解为两个分量：
       - E_o ⊥ to the principal section (vertical to optic axis projection)
         E_o垂直于主截面（垂直于光轴投影）
       - E_e ∥ to the principal section (in optic axis plane)
         E_e平行于主截面（在光轴平面内）

    2. Component magnitudes 分量大小:
       E_o = E₀ × cos(θ)  →  I_o = I₀ × cos²(θ)  (Malus's Law)
       E_e = E₀ × sin(θ)  →  I_e = I₀ × sin²(θ)  (Complementary)

    3. Both components propagate with different velocities:
       两个分量以不同速度传播：
       - v_o = c/n_o  (slower in calcite: n_o = 1.658)
       - v_e = c/n_e  (faster in calcite: n_e = 1.486)

    This velocity difference causes spatial separation of the two rays.
    这种速度差异导致两束光的空间分离。

    Parameters 参数:
        theta_degrees (float): Angle between input polarization and optic axis (0-90°)
                              输入偏振与光轴的夹角（0-90°）
        I_initial (float): Initial light intensity 初始光强

    Returns 返回:
        tuple: (I_o, I_e, theta_radians)
            I_o: Ordinary ray intensity 寻常光强度
            I_e: Extraordinary ray intensity 非常光强度
            theta_radians: Angle in radians for plotting 弧度角（用于绘图）

    Examples 示例:
        >>> I_o, I_e, _ = calculate_birefringence_intensities(0)
        >>> print(f"At 0°: I_o={I_o:.1f}, I_e={I_e:.1f}")
        At 0°: I_o=100.0, I_e=0.0

        >>> I_o, I_e, _ = calculate_birefringence_intensities(45)
        >>> print(f"At 45°: I_o={I_o:.1f}, I_e={I_e:.1f}, Sum={I_o+I_e:.1f}")
        At 45°: I_o=50.0, I_e=50.0, Sum=100.0  # Energy conserved!
    """
    theta_radians = np.radians(theta_degrees)

    # Malus's Law for intensity (intensity ∝ E², E ∝ cos(θ))
    # 马吕斯定律（强度 ∝ E²，E ∝ cos(θ)）
    I_o = I_initial * np.cos(theta_radians)**2  # Ordinary ray (o光)
    I_e = I_initial * np.sin(theta_radians)**2  # Extraordinary ray (e光)

    # Verify energy conservation (should always be True)
    # 验证能量守恒（应始终为True）
    assert np.isclose(I_o + I_e, I_initial, atol=1e-10), "Energy not conserved!"

    return I_o, I_e, theta_radians


def calculate_phase_retardation(crystal_thickness_mm, wavelength_nm=WAVELENGTH):
    """
    Calculate phase retardation between o-ray and e-ray after passing through crystal.
    计算通过晶体后o光和e光之间的相位延迟。

    Physics Explanation 物理解释:
    ───────────────────────────────
    Due to different refractive indices, o-ray and e-ray accumulate a phase difference:
    由于折射率不同，o光和e光积累相位差：

        Δφ = (2π/λ) × Δn × d

    where:
        λ: wavelength of light 光波长
        Δn = n_o - n_e: birefringence 双折射率差
        d: crystal thickness 晶体厚度

    This phase difference determines:
    这个相位差决定：
        - Emerging polarization state (linear → elliptical/circular)
          出射偏振态（线偏振→椭圆/圆偏振）
        - Interference colors in crossed polarizers
          正交偏振片间的干涉颜色

    Wave Plate Classification 波片分类:
        - Quarter-wave plate (1/4波片): Δφ = π/2 (90°)
        - Half-wave plate (1/2波片): Δφ = π (180°)
        - Full-wave plate (全波片): Δφ = 2π (360°)

    Parameters 参数:
        crystal_thickness_mm (float): Thickness of birefringent crystal in millimeters
                                      双折射晶体厚度（毫米）
        wavelength_nm (float): Wavelength of light in nanometers
                              光波长（纳米）

    Returns 返回:
        float: Phase retardation in degrees (相位延迟，度)
    """
    # Convert units 单位转换
    thickness_m = crystal_thickness_mm * 1e-3  # mm → m
    wavelength_m = wavelength_nm * 1e-9        # nm → m

    # Phase difference calculation 相位差计算
    # Δφ = (2π/λ) × Δn × d
    phase_rad = (2 * np.pi / wavelength_m) * DELTA_N * thickness_m
    phase_deg = np.degrees(phase_rad)

    return phase_deg % 360  # Wrap to 0-360° range


# ============================================================================
# VISUALIZATION FUNCTIONS
# 可视化函数
# ============================================================================

def draw_calcite_crystal(ax, x_center=0, y_center=0, angle_deg=0):
    """
    Draw a schematic representation of a calcite crystal with optic axis.
    绘制方解石晶体示意图及光轴。

    Visual Elements 视觉元素:
        - Blue translucent rectangle: crystal body 蓝色半透明矩形：晶体主体
        - Yellow dashed line: optic axis (special direction) 黄色虚线：光轴（特殊方向）
        - Rotation angle: shows crystal orientation 旋转角度：显示晶体方向
    """
    # Crystal body (方解石晶体主体)
    width, height = 2.5, 2.0
    crystal = Rectangle(
        (x_center - width/2, y_center - height/2),
        width, height,
        angle=angle_deg,
        facecolor='cyan',
        alpha=0.3,
        edgecolor='cyan',
        linewidth=2,
        label='Calcite Crystal'
    )
    ax.add_patch(crystal)

    # Optic axis (光轴) - rotated diagonal line
    axis_length = 1.5
    angle_rad = np.radians(angle_deg + 45)  # 45° diagonal + rotation
    dx = axis_length * np.cos(angle_rad)
    dy = axis_length * np.sin(angle_rad)

    ax.plot(
        [x_center - dx, x_center + dx],
        [y_center - dy, y_center + dy],
        'y--', linewidth=2, alpha=0.8, label='Optic Axis'
    )

    # Label
    ax.text(x_center, y_center - height/2 - 0.5,
            'Calcite\nCrystal',
            ha='center', va='top', fontsize=10, color='cyan', weight='bold')


def draw_light_ray(ax, x_start, y_start, x_end, y_end, intensity, color, label):
    """
    Draw a light ray with intensity-dependent thickness and glow effect.
    绘制光线，厚度和发光效果取决于强度。

    Visual Encoding 视觉编码:
        - Line thickness ∝ √intensity (Weber's law: perceived brightness)
          线条粗细 ∝ √强度（韦伯定律：感知亮度）
        - Alpha transparency shows intensity
          透明度显示强度
        - Arrow head indicates propagation direction
          箭头显示传播方向
    """
    if intensity < 0.01:  # Skip very weak rays
        return

    # Thickness proportional to square root of intensity (perceptual scaling)
    # 厚度与强度的平方根成正比（感知缩放）
    thickness = 2 + 3 * np.sqrt(intensity / I0)

    # Draw arrow with varying alpha
    arrow = FancyArrow(
        x_start, y_start,
        x_end - x_start, y_end - y_start,
        width=thickness * 0.3,
        head_width=thickness * 0.8,
        head_length=0.3,
        color=color,
        alpha=0.4 + 0.5 * (intensity / I0),
        label=label
    )
    ax.add_patch(arrow)


def update_plot(theta):
    """
    Update all plot elements when slider changes.
    滑块变化时更新所有绘图元素。

    This function is called every time the user moves the polarization angle slider.
    用户每次移动偏振角度滑块时都会调用此函数。
    """
    # Clear previous frame
    ax_main.clear()
    ax_intensity.clear()
    ax_phase.clear()

    # ========================================================================
    # Calculate physics 计算物理量
    # ========================================================================
    I_o, I_e, theta_rad = calculate_birefringence_intensities(theta)
    phase_retardation = calculate_phase_retardation(1.0)  # 1mm thick crystal

    # ========================================================================
    # Main diagram: Light ray splitting 主图：光线分裂
    # ========================================================================
    ax_main.set_xlim(-6, 10)
    ax_main.set_ylim(-4, 4)
    ax_main.set_aspect('equal')
    ax_main.set_title(
        'Birefringence in Calcite Crystal\n双折射效应演示',
        fontsize=14, weight='bold', color='white'
    )
    ax_main.axis('off')

    # Light source (光源)
    source_circle = Circle((-5, 0), 0.3, color='yellow', zorder=10)
    ax_main.add_patch(source_circle)
    ax_main.text(-5, -1, 'Light\nSource', ha='center', fontsize=9, color='yellow')

    # Incident ray (入射光线)
    draw_light_ray(ax_main, -4.5, 0, -1.5, 0, I0, 'orange', 'Incident')

    # Show incident polarization angle (显示入射偏振角度)
    pol_length = 0.8
    pol_x = -3 + pol_length * np.cos(theta_rad)
    pol_y = 0 + pol_length * np.sin(theta_rad)
    ax_main.arrow(-3, 0, pol_x + 3, pol_y, head_width=0.15, head_length=0.15,
                  fc='orange', ec='orange', linewidth=2, alpha=0.8)
    ax_main.text(-3, -1.2, f'Polarization\nθ = {theta:.0f}°',
                 ha='center', fontsize=9, color='orange')

    # Calcite crystal (方解石晶体)
    draw_calcite_crystal(ax_main, x_center=0, y_center=0, angle_deg=0)

    # o-ray (ordinary ray) - travels straight, polarization ⊥ to optic axis
    # o光（寻常光）- 直线传播，偏振方向垂直于光轴
    draw_light_ray(ax_main, 1.5, 0.5, 5, 0.5, I_o, 'red', 'o-ray')
    ax_main.text(6.5, 0.5, f'o-ray (0°)\nI = {I_o:.1f}',
                 ha='center', fontsize=10, color='red', weight='bold')

    # e-ray (extraordinary ray) - deviates, polarization ∥ to optic axis
    # e光（非常光）- 偏离，偏振方向平行于光轴
    draw_light_ray(ax_main, 1.5, -0.5, 5, -0.5, I_e, 'lime', 'e-ray')
    ax_main.text(6.5, -0.5, f'e-ray (90°)\nI = {I_e:.1f}',
                 ha='center', fontsize=10, color='lime', weight='bold')

    # Detection screen (探测屏)
    screen = Rectangle((7, -2), 0.2, 4, facecolor='gray', edgecolor='white', linewidth=2)
    ax_main.add_patch(screen)
    ax_main.text(7.5, -2.5, 'Screen', fontsize=9, color='white')

    # ========================================================================
    # Intensity bar chart 强度柱状图
    # ========================================================================
    bars = ax_intensity.barh(['o-ray', 'e-ray'], [I_o, I_e],
                             color=['red', 'lime'], alpha=0.7, edgecolor='white')
    ax_intensity.set_xlim(0, I0 * 1.1)
    ax_intensity.set_xlabel('Intensity (arb. units)', fontsize=10, color='white')
    ax_intensity.set_title('Ray Intensities 光强对比', fontsize=11, weight='bold', color='white')
    ax_intensity.tick_params(colors='white')

    # Add value labels on bars
    ax_intensity.text(I_o + 2, 0, f'{I_o:.1f}', va='center', fontsize=10, color='red', weight='bold')
    ax_intensity.text(I_e + 2, 1, f'{I_e:.1f}', va='center', fontsize=10, color='lime', weight='bold')

    # ========================================================================
    # Intensity vs angle curve 强度-角度曲线
    # ========================================================================
    angles = np.linspace(0, 90, 100)
    I_o_curve = I0 * np.cos(np.radians(angles))**2
    I_e_curve = I0 * np.sin(np.radians(angles))**2

    ax_phase.plot(angles, I_o_curve, 'r-', linewidth=2, label='o-ray: I₀cos²θ')
    ax_phase.plot(angles, I_e_curve, 'g-', linewidth=2, label='e-ray: I₀sin²θ')
    ax_phase.plot(angles, I_o_curve + I_e_curve, 'w--', linewidth=1.5,
                  alpha=0.6, label='Sum (conservation)')

    # Mark current angle
    ax_phase.plot(theta, I_o, 'ro', markersize=10, markeredgecolor='white', markeredgewidth=2)
    ax_phase.plot(theta, I_e, 'go', markersize=10, markeredgecolor='white', markeredgewidth=2)
    ax_phase.axvline(theta, color='cyan', linestyle=':', alpha=0.5)

    ax_phase.set_xlabel('Polarization Angle θ (degrees)', fontsize=10, color='white')
    ax_phase.set_ylabel('Intensity', fontsize=10, color='white')
    ax_phase.set_title('Malus\'s Law in Birefringence\n双折射中的马吕斯定律', fontsize=11, weight='bold', color='white')
    ax_phase.set_xlim(0, 90)
    ax_phase.set_ylim(0, I0 * 1.1)
    ax_phase.legend(loc='upper right', fontsize=9, framealpha=0.8)
    ax_phase.grid(True, alpha=0.2, color='white')
    ax_phase.tick_params(colors='white')

    fig.canvas.draw_idle()


# ============================================================================
# MAIN INTERACTIVE INTERFACE
# 主交互界面
# ============================================================================

# Create figure with dark background (创建深色背景图形)
fig = plt.figure(figsize=FIG_SIZE, facecolor='#0a0a0f')
fig.suptitle(
    'Interactive Birefringence Demonstration | 双折射效应交互演示',
    fontsize=16, weight='bold', color='white', y=0.98
)

# Layout: main diagram + intensity bar + angle curve
# 布局：主图 + 强度柱状图 + 角度曲线
ax_main = plt.subplot2grid((3, 2), (0, 0), rowspan=2, colspan=1, facecolor='#0f1419')
ax_intensity = plt.subplot2grid((3, 2), (0, 1), facecolor='#0f1419')
ax_phase = plt.subplot2grid((3, 2), (1, 1), facecolor='#0f1419')

# Slider for polarization angle (偏振角度滑块)
ax_slider = plt.subplot2grid((3, 2), (2, 0), colspan=2, facecolor='#1a1a2e')
slider = Slider(
    ax_slider,
    'Input Polarization Angle θ (入射偏振角度)',
    0, 90,
    valinit=30,
    valstep=1,
    color='cyan',
    track_color='#334155'
)
slider.label.set_color('white')
slider.valtext.set_color('cyan')

# Connect slider to update function (连接滑块到更新函数)
slider.on_changed(update_plot)

# Initial plot
update_plot(slider.val)

# Add instructions (添加使用说明)
fig.text(
    0.5, 0.02,
    'Drag the slider to change input polarization angle | 拖动滑块改变入射偏振角度\n'
    'Observe how light splits into o-ray (0°) and e-ray (90°) | 观察光如何分裂为o光(0°)和e光(90°)',
    ha='center', fontsize=10, color='cyan', style='italic'
)

plt.tight_layout(rect=[0, 0.04, 1, 0.96])
plt.show()


# ============================================================================
# LEARNING EXERCISES
# 学习练习
# ============================================================================
"""
Try these experiments 尝试这些实验:

1. Energy Conservation Verification 能量守恒验证:
   - Move the slider to different angles
   - Observe that o-ray + e-ray intensities always sum to 100%
   - This demonstrates the principle of energy conservation

2. Special Angles 特殊角度:
   - θ = 0°: All light becomes o-ray (I_o = 100%, I_e = 0%)
   - θ = 45°: Equal split (I_o = I_e = 50%)
   - θ = 90°: All light becomes e-ray (I_o = 0%, I_e = 100%)

3. Malus's Law Observation 马吕斯定律观察:
   - Check the curve plot: I_o follows cos²θ curve
   - I_e follows sin²θ curve (complementary)
   - This is the same Malus's Law used in polarizer analysis!

4. Wave Plate Design 波片设计:
   - A quarter-wave plate creates 90° phase difference
   - For λ=550nm, required thickness ≈ 0.0008 mm
   - Try calculating: d = λ/(4×Δn)

Further Reading 进一步阅读:
    - Hecht, "Optics" Chapter 8: Polarization
    - Born & Wolf, "Principles of Optics" Chapter 14
    - Applications: LCD displays, optical isolators, stress analysis
"""
