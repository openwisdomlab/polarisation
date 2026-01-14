"""
Fresnel Equations Interactive Demonstration
菲涅尔方程交互演示

Physical Principle 物理原理:
────────────────────────────────────────────────────────────────
The Fresnel equations describe reflection and transmission at optical interfaces.
菲涅尔方程描述光在光学界面的反射和透射。

For s-polarization (⊥ to plane of incidence) s偏振（垂直于入射面）:
    r_s = (n₁cosθ₁ - n₂cosθ₂) / (n₁cosθ₁ + n₂cosθ₂)
    t_s = 2n₁cosθ₁ / (n₁cosθ₁ + n₂cosθ₂)

For p-polarization (∥ to plane of incidence) p偏振（平行于入射面）:
    r_p = (n₂cosθ₁ - n₁cosθ₂) / (n₂cosθ₁ + n₁cosθ₂)
    t_p = 2n₁cosθ₁ / (n₂cosθ₁ + n₁cosθ₂)

where:
    n₁, n₂: refractive indices 折射率
    θ₁: incident angle 入射角
    θ₂: refraction angle (from Snell's law) 折射角（斯涅尔定律）
    r: reflection coefficient 反射系数
    t: transmission coefficient 透射系数

Brewster's Angle 布儒斯特角:
    θ_B = arctan(n₂/n₁)
    At this angle, r_p = 0 (no p-polarized reflection!)
    在此角度，p偏振光完全透射（无反射）！

Total Internal Reflection 全内反射:
    When n₁ > n₂ and θ₁ > θ_c = arcsin(n₂/n₁)
    当 n₁ > n₂ 且 θ₁ > θ_c 时发生

Educational Value 教学价值:
    - Understand polarization-dependent reflection
      理解偏振相关的反射
    - Learn interface optics and Snell's law
      学习界面光学和斯涅尔定律
    - Discover Brewster's angle applications (anti-reflection)
      发现布儒斯特角应用（抗反射）

Dependencies 依赖项:
    numpy>=1.24.0    : Numerical computations
    matplotlib>=3.7.0: Interactive visualization
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, CheckButtons
from matplotlib.patches import FancyArrowPatch, Rectangle, Wedge
import matplotlib.patches as mpatches

# ============================================================================
# PHYSICAL CONSTANTS AND PARAMETERS
# 物理常数和参数
# ============================================================================

# Default refractive indices (默认折射率)
N1_AIR = 1.0            # Air 空气
N2_GLASS = 1.5          # Glass 玻璃
N2_WATER = 1.333        # Water 水
N2_DIAMOND = 2.417      # Diamond 钻石

# Visualization parameters
FIG_SIZE = (15, 9)
DPI = 100


# ============================================================================
# CORE PHYSICS FUNCTIONS
# 核心物理函数
# ============================================================================

def snells_law(theta1_deg, n1, n2):
    """
    Apply Snell's law to calculate refraction angle.
    应用斯涅尔定律计算折射角。

    Physical Basis 物理基础:
    ─────────────────────
    Snell's Law (斯涅尔定律):
        n₁ sin(θ₁) = n₂ sin(θ₂)

    This describes how light bends when crossing an interface between
    two media with different refractive indices.
    描述光在两种不同折射率介质界面弯曲的规律。

    Derivation from Wave Theory 波动理论推导:
    ────────────────────────────────────
    From Huygens' principle, wavefronts must be continuous at boundary.
    由惠更斯原理，波前在边界处必须连续。

    Phase matching condition (相位匹配条件):
        k₁ sin(θ₁) = k₂ sin(θ₂)
    where k = 2πn/λ is wave vector (波矢)

    This gives: n₁ sin(θ₁) = n₂ sin(θ₂)

    Parameters 参数:
        theta1_deg (float): Incident angle in degrees 入射角（度）
        n1 (float): Refractive index of first medium 第一介质折射率
        n2 (float): Refractive index of second medium 第二介质折射率

    Returns 返回:
        float: Refraction angle in degrees, or None if total internal reflection
               折射角（度），如果全内反射则返回None
    """
    theta1_rad = np.radians(theta1_deg)
    sin_theta2 = (n1 / n2) * np.sin(theta1_rad)

    # Check for total internal reflection (检查全内反射)
    if sin_theta2 > 1.0:
        return None  # Total internal reflection occurs

    theta2_rad = np.arcsin(sin_theta2)
    return np.degrees(theta2_rad)


def fresnel_coefficients(theta1_deg, n1, n2):
    """
    Calculate Fresnel reflection and transmission coefficients.
    计算菲涅尔反射和透射系数。

    Physical Interpretation 物理解释:
    ────────────────────────────────
    The Fresnel equations arise from Maxwell's equations with boundary conditions:
    菲涅尔方程源于麦克斯韦方程组加边界条件：

    1. Tangential E⃗ and H⃗ fields must be continuous
       切向电场和磁场必须连续
    2. Normal D⃗ and B⃗ fields must be continuous
       法向电位移和磁感应强度必须连续

    This leads to different behavior for s and p polarizations!
    这导致s偏振和p偏振的不同行为！

    Amplitude Coefficients 振幅系数:
    ────────────────────────────
    r_s, r_p: Amplitude reflection coefficients (can be negative!)
              振幅反射系数（可为负值！）
    t_s, t_p: Amplitude transmission coefficients
              振幅透射系数

    Intensity Coefficients 强度系数:
    ──────────────────────────────
    R_s = |r_s|²: Reflectance for s-polarization
                  s偏振反射率
    T_s = (n₂cosθ₂)/(n₁cosθ₁) × |t_s|²: Transmittance for s-polarization
                                        s偏振透射率

    Energy Conservation 能量守恒:
    ───────────────────────────
    R + T = 1  (always satisfied!)
    反射率 + 透射率 = 1（恒成立！）

    Parameters 参数:
        theta1_deg (float): Incident angle in degrees
        n1 (float): First medium refractive index
        n2 (float): Second medium refractive index

    Returns 返回:
        dict: {
            'rs': s-polarization reflection coefficient
            'rp': p-polarization reflection coefficient
            'ts': s-polarization transmission coefficient
            'tp': p-polarization transmission coefficient
            'theta2': refraction angle in degrees
            'Rs': s-polarization reflectance (intensity)
            'Rp': p-polarization reflectance (intensity)
            'Ts': s-polarization transmittance (intensity)
            'Tp': p-polarization transmittance (intensity)
            'tir': True if total internal reflection occurs
        }
    """
    theta1_rad = np.radians(theta1_deg)
    cos_theta1 = np.cos(theta1_rad)
    sin_theta1 = np.sin(theta1_rad)

    # Apply Snell's law
    sin_theta2 = (n1 / n2) * sin_theta1

    # Check for total internal reflection
    if sin_theta2 > 1.0:
        return {
            'rs': 1.0, 'rp': 1.0,
            'ts': 0.0, 'tp': 0.0,
            'theta2': 90.0,
            'Rs': 1.0, 'Rp': 1.0,
            'Ts': 0.0, 'Tp': 0.0,
            'tir': True
        }

    cos_theta2 = np.sqrt(1 - sin_theta2**2)
    theta2_deg = np.degrees(np.arcsin(sin_theta2))

    # ========================================================================
    # Fresnel Equations 菲涅尔方程
    # ========================================================================

    # s-polarization (electric field ⊥ to plane of incidence)
    # s偏振（电场垂直于入射面）
    rs = (n1 * cos_theta1 - n2 * cos_theta2) / (n1 * cos_theta1 + n2 * cos_theta2)
    ts = (2 * n1 * cos_theta1) / (n1 * cos_theta1 + n2 * cos_theta2)

    # p-polarization (electric field ∥ to plane of incidence)
    # p偏振（电场平行于入射面）
    rp = (n2 * cos_theta1 - n1 * cos_theta2) / (n2 * cos_theta1 + n1 * cos_theta2)
    tp = (2 * n1 * cos_theta1) / (n2 * cos_theta1 + n1 * cos_theta2)

    # ========================================================================
    # Intensity Reflectance and Transmittance 强度反射率和透射率
    # ========================================================================

    Rs = rs**2  # Reflectance = |r|²
    Rp = rp**2

    # Transmittance includes angle factor (能量通量守恒需要角度因子)
    # T = (n₂cosθ₂)/(n₁cosθ₁) × |t|²
    angle_factor = (n2 * cos_theta2) / (n1 * cos_theta1)
    Ts = angle_factor * ts**2
    Tp = angle_factor * tp**2

    # Verify energy conservation (验证能量守恒)
    assert np.isclose(Rs + Ts, 1.0, atol=1e-6), f"Energy not conserved for s: R={Rs}, T={Ts}"
    assert np.isclose(Rp + Tp, 1.0, atol=1e-6), f"Energy not conserved for p: R={Rp}, T={Tp}"

    return {
        'rs': rs, 'rp': rp,
        'ts': ts, 'tp': tp,
        'theta2': theta2_deg,
        'Rs': Rs, 'Rp': Rp,
        'Ts': Ts, 'Tp': Tp,
        'tir': False
    }


def brewster_angle(n1, n2):
    """
    Calculate Brewster's angle (polarizing angle).
    计算布儒斯特角（偏振角）。

    Physical Significance 物理意义:
    ──────────────────────────────
    At Brewster's angle, p-polarized light is NOT reflected at all!
    在布儒斯特角，p偏振光完全不反射！

    This occurs when reflected and refracted rays are perpendicular:
    当反射光和折射光垂直时发生：
        θ₁ + θ₂ = 90°

    From Snell's law: n₁sin(θ_B) = n₂sin(90° - θ_B) = n₂cos(θ_B)
    由斯涅尔定律：
        tan(θ_B) = n₂/n₁

    Applications 应用:
    ────────────────
    - Polarizing sunglasses (reduce glare from water/roads)
      偏振太阳镜（减少水面/路面眩光）
    - Laser windows (minimize reflection loss at Brewster angle)
      激光窗口（在布儒斯特角最小化反射损失）
    - Polarized photography
      偏振摄影

    Parameters 参数:
        n1 (float): First medium refractive index
        n2 (float): Second medium refractive index

    Returns 返回:
        float: Brewster's angle in degrees
    """
    theta_b_rad = np.arctan(n2 / n1)
    return np.degrees(theta_b_rad)


def critical_angle(n1, n2):
    """
    Calculate critical angle for total internal reflection.
    计算全内反射临界角。

    Only exists when n1 > n2 (e.g., glass → air)
    仅当 n1 > n2 时存在（如玻璃→空气）

    At critical angle θ_c:
    在临界角θ_c时：
        sin(θ_c) = n₂/n₁
        θ₂ = 90° (refracted ray grazes surface)
        折射光沿界面传播

    Above critical angle (θ > θ_c): Total internal reflection
    超过临界角：全内反射
    """
    if n1 <= n2:
        return None  # No total internal reflection possible

    sin_theta_c = n2 / n1
    theta_c_rad = np.arcsin(sin_theta_c)
    return np.degrees(theta_c_rad)


# ============================================================================
# VISUALIZATION FUNCTIONS
# 可视化函数
# ============================================================================

def draw_interface_and_rays(ax, theta1, n1, n2, show_s, show_p):
    """
    Draw optical interface with incident, reflected, and refracted rays.
    绘制光学界面及入射、反射、折射光线。
    """
    ax.clear()
    ax.set_xlim(-3, 3)
    ax.set_ylim(-2, 2)
    ax.set_aspect('equal')
    ax.axis('off')

    # Calculate Fresnel coefficients
    fresnel = fresnel_coefficients(theta1, n1, n2)

    # Draw interface (horizontal line at y=0)
    ax.plot([-3, 3], [0, 0], 'w-', linewidth=3, label='Interface')

    # Medium labels
    ax.text(-2.5, 1.5, f'Medium 1\nn₁ = {n1:.3f}', fontsize=11,
            color='cyan', bbox=dict(boxstyle='round', facecolor='black', alpha=0.7))
    ax.text(-2.5, -1.5, f'Medium 2\nn₂ = {n2:.3f}', fontsize=11,
            color='orange', bbox=dict(boxstyle='round', facecolor='black', alpha=0.7))

    # Shade regions
    ax.fill_between([-3, 3], 0, 2, alpha=0.1, color='cyan')
    ax.fill_between([-3, 3], -2, 0, alpha=0.1, color='orange')

    # Ray parameters
    ray_length = 1.5
    theta1_rad = np.radians(theta1)

    # Incident ray (入射光线)
    inc_x = -ray_length * np.sin(theta1_rad)
    inc_y = ray_length * np.cos(theta1_rad)
    ax.arrow(inc_x, inc_y, -inc_x, -inc_y,
             head_width=0.15, head_length=0.15, fc='yellow', ec='yellow',
             linewidth=2.5, alpha=0.9, length_includes_head=True)
    ax.text(inc_x - 0.3, inc_y, f'Incident\nθ₁={theta1:.1f}°',
            fontsize=9, color='yellow', ha='right')

    # Reflected ray (反射光线)
    ref_x = ray_length * np.sin(theta1_rad)
    ref_y = ray_length * np.cos(theta1_rad)

    # Show reflected rays based on polarization selection
    if show_s and fresnel['Rs'] > 0.01:
        arrow_s = ax.arrow(0, 0, ref_x, ref_y,
                          head_width=0.15, head_length=0.15,
                          fc='red', ec='red', linewidth=2 + 3*np.sqrt(fresnel['Rs']),
                          alpha=0.5 + 0.4*fresnel['Rs'], length_includes_head=True)
        ax.text(ref_x + 0.3, ref_y, f's-pol\nR={fresnel["Rs"]*100:.1f}%',
                fontsize=9, color='red', ha='left')

    if show_p and fresnel['Rp'] > 0.01:
        # Offset p-ray slightly for visibility
        arrow_p = ax.arrow(0, 0, ref_x*0.9, ref_y*0.9,
                          head_width=0.15, head_length=0.15,
                          fc='magenta', ec='magenta', linewidth=2 + 3*np.sqrt(fresnel['Rp']),
                          alpha=0.5 + 0.4*fresnel['Rp'], length_includes_head=True)
        ax.text(ref_x*0.9 + 0.5, ref_y*0.9 + 0.3, f'p-pol\nR={fresnel["Rp"]*100:.1f}%',
                fontsize=9, color='magenta', ha='left')

    # Refracted ray (折射光线) or total internal reflection
    if not fresnel['tir']:
        theta2_rad = np.radians(fresnel['theta2'])
        refr_x = ray_length * np.sin(theta2_rad)
        refr_y = -ray_length * np.cos(theta2_rad)

        if show_s:
            ax.arrow(0, 0, refr_x, refr_y,
                    head_width=0.15, head_length=0.15,
                    fc='lime', ec='lime', linewidth=2 + 3*np.sqrt(fresnel['Ts']),
                    alpha=0.5 + 0.4*fresnel['Ts'], length_includes_head=True)
            ax.text(refr_x + 0.3, refr_y - 0.2, f's-pol\nT={fresnel["Ts"]*100:.1f}%',
                    fontsize=9, color='lime', ha='left')

        if show_p:
            ax.arrow(0, 0, refr_x*0.9, refr_y*0.9,
                    head_width=0.15, head_length=0.15,
                    fc='cyan', ec='cyan', linewidth=2 + 3*np.sqrt(fresnel['Tp']),
                    alpha=0.5 + 0.4*fresnel['Tp'], length_includes_head=True)
            ax.text(refr_x*0.9 + 0.5, refr_y*0.9 - 0.3, f'p-pol\nT={fresnel["Tp"]*100:.1f}%',
                    fontsize=9, color='cyan', ha='left')

        ax.text(0.5, -1, f'Refracted\nθ₂={fresnel["theta2"]:.1f}°',
                fontsize=9, color='lime', ha='left')
    else:
        # Total internal reflection
        ax.text(0, -1, 'Total Internal\nReflection!',
                fontsize=12, color='red', weight='bold',
                ha='center', bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.3))

    # Normal line (法线)
    ax.plot([0, 0], [-2, 2], 'w--', linewidth=1, alpha=0.4, label='Normal')

    # Angle arcs
    arc_radius = 0.5
    arc1 = Wedge((0, 0), arc_radius, 90-theta1, 90, facecolor='yellow', alpha=0.3, edgecolor='yellow')
    ax.add_patch(arc1)


def update_plot(val):
    """Update all plots when slider changes."""
    theta1 = slider_angle.val
    n2 = slider_n2.val

    # Get polarization checkboxes state
    show_s = check_polarization.get_status()[0]
    show_p = check_polarization.get_status()[1]

    # Update interface diagram
    draw_interface_and_rays(ax_diagram, theta1, N1_AIR, n2, show_s, show_p)

    # Update angle sweep curves
    ax_curves.clear()

    angles = np.linspace(0, 89.5, 200)
    Rs_curve = []
    Rp_curve = []
    Ts_curve = []
    Tp_curve = []

    for angle in angles:
        fresnel = fresnel_coefficients(angle, N1_AIR, n2)
        Rs_curve.append(fresnel['Rs'] * 100)
        Rp_curve.append(fresnel['Rp'] * 100)
        Ts_curve.append(fresnel['Ts'] * 100)
        Tp_curve.append(fresnel['Tp'] * 100)

    if show_s:
        ax_curves.plot(angles, Rs_curve, 'r-', linewidth=2.5, label='Reflectance R_s')
        ax_curves.plot(angles, Ts_curve, 'g-', linewidth=2.5, label='Transmittance T_s')

    if show_p:
        ax_curves.plot(angles, Rp_curve, 'm--', linewidth=2.5, label='Reflectance R_p')
        ax_curves.plot(angles, Tp_curve, 'c--', linewidth=2.5, label='Transmittance T_p')

    # Mark current angle
    fresnel_current = fresnel_coefficients(theta1, N1_AIR, n2)
    if show_s:
        ax_curves.plot(theta1, fresnel_current['Rs']*100, 'ro', markersize=10,
                      markeredgecolor='white', markeredgewidth=2)
        ax_curves.plot(theta1, fresnel_current['Ts']*100, 'go', markersize=10,
                      markeredgecolor='white', markeredgewidth=2)
    if show_p:
        ax_curves.plot(theta1, fresnel_current['Rp']*100, 'mo', markersize=10,
                      markeredgecolor='white', markeredgewidth=2)
        ax_curves.plot(theta1, fresnel_current['Tp']*100, 'co', markersize=10,
                      markeredgecolor='white', markeredgewidth=2)

    # Mark Brewster's angle
    theta_b = brewster_angle(N1_AIR, n2)
    ax_curves.axvline(theta_b, color='orange', linestyle=':', linewidth=2, alpha=0.7,
                     label=f'Brewster θ_B={theta_b:.1f}°')

    # Mark critical angle if exists
    theta_c = critical_angle(N1_AIR, n2)
    if theta_c is not None:
        ax_curves.axvline(theta_c, color='red', linestyle=':', linewidth=2, alpha=0.7,
                         label=f'Critical θ_c={theta_c:.1f}°')

    ax_curves.set_xlabel('Incident Angle θ₁ (degrees)', fontsize=11, color='white')
    ax_curves.set_ylabel('Percentage (%)', fontsize=11, color='white')
    ax_curves.set_title('Fresnel Coefficients vs Incident Angle\n菲涅尔系数随入射角变化',
                       fontsize=12, weight='bold', color='white')
    ax_curves.set_xlim(0, 90)
    ax_curves.set_ylim(0, 105)
    ax_curves.legend(loc='upper left', fontsize=9, framealpha=0.8)
    ax_curves.grid(True, alpha=0.2, color='white')
    ax_curves.tick_params(colors='white')

    fig.canvas.draw_idle()


# ============================================================================
# MAIN INTERACTIVE INTERFACE
# 主交互界面
# ============================================================================

fig = plt.figure(figsize=FIG_SIZE, facecolor='#0a0a0f')
fig.suptitle('Interactive Fresnel Equations Demonstration | 菲涅尔方程交互演示',
             fontsize=16, weight='bold', color='white', y=0.97)

# Layout
ax_diagram = plt.subplot2grid((4, 2), (0, 0), rowspan=3, colspan=1, facecolor='#0f1419')
ax_curves = plt.subplot2grid((4, 2), (0, 1), rowspan=3, colspan=1, facecolor='#0f1419')

# Sliders
ax_slider_angle = plt.subplot2grid((4, 2), (3, 0), facecolor='#1a1a2e')
ax_slider_n2 = plt.subplot2grid((4, 2), (3, 1), facecolor='#1a1a2e')

slider_angle = Slider(ax_slider_angle, 'Incident Angle θ₁',
                     0, 89, valinit=30, valstep=0.5, color='cyan', track_color='#334155')
slider_n2 = Slider(ax_slider_n2, 'n₂ (Medium 2)',
                  1.0, 2.5, valinit=N2_GLASS, valstep=0.01, color='orange', track_color='#334155')

slider_angle.label.set_color('white')
slider_angle.valtext.set_color('cyan')
slider_n2.label.set_color('white')
slider_n2.valtext.set_color('orange')

# Polarization checkboxes
ax_check = plt.axes([0.02, 0.4, 0.12, 0.15], facecolor='#1a1a2e')
check_polarization = CheckButtons(ax_check, ['s-polarization', 'p-polarization'],
                                 [True, True])
for label in check_polarization.labels:
    label.set_color('white')

# Connect events
slider_angle.on_changed(update_plot)
slider_n2.on_changed(update_plot)
check_polarization.on_clicked(lambda label: update_plot(None))

# Initial plot
update_plot(None)

# Instructions
fig.text(0.5, 0.01,
        'Adjust incident angle and n₂ | Toggle s/p polarization | Observe Brewster angle (R_p=0)',
        ha='center', fontsize=10, color='cyan', style='italic')

plt.tight_layout(rect=[0, 0.02, 1, 0.95])
plt.show()
