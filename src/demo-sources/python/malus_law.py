"""
Malus's Law Interactive Demonstration
马吕斯定律交互演示

This script provides an interactive visualization of Malus's Law, which describes
how the intensity of polarized light changes when passing through a rotating polarizer.
本脚本提供马吕斯定律的交互式可视化，展示偏振光通过旋转偏振片时强度的变化规律。

Physical Principle 物理原理:
────────────────────────────────────────────────────────────────
When linearly polarized light passes through a polarizer (analyzer), the transmitted
intensity depends on the angle θ between the light's polarization direction and the
polarizer's transmission axis:

当线偏振光通过偏振片（检偏器）时，透射光强取决于光的偏振方向与偏振片透射轴之间的角度θ：

    I = I₀ × cos²(θ)

where:
- I₀: incident light intensity (入射光强)
- θ: angle between polarizations (偏振方向夹角)
- I: transmitted light intensity (透射光强)

Key Observations 关键观察:
- θ = 0°   (parallel):      100% transmission (平行：100%透射)
- θ = 45°  (diagonal):      50% transmission (对角：50%透射)
- θ = 90°  (perpendicular): 0% transmission (垂直：0%透射)

Educational Purpose 教学目的:
────────────────────────────────────────────────────────────────
1. Understand the mathematical relationship between angle and intensity
   理解角度与光强之间的数学关系

2. Visualize the cos² relationship graphically
   图形化展示cos²关系

3. Explore polarization as a wave property of light
   探索光的偏振波动性质

Prerequisites 前置知识:
────────────────────────────────────────────────────────────────
- Basic wave optics (基础波动光学)
- Trigonometry (cos, sin functions) (三角函数)
- Linear polarization concept (线偏振概念)

Author: PolarCraft Team
License: MIT License
Source: https://github.com/polarcraft/demos
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from matplotlib.patches import FancyBboxPatch, FancyArrow
import matplotlib.patches as mpatches

# ============================================================================
# CONSTANTS AND CONFIGURATION
# 常量与配置
# ============================================================================

# Physical constants
I0 = 100.0  # Initial intensity (arbitrary units) 初始光强（任意单位）
WAVELENGTH = 550  # Light wavelength in nm (green light) 光波长（绿光）

# Visualization settings
FIG_SIZE = (14, 8)  # Figure size in inches 图形尺寸
DPI = 100  # Dots per inch for display 显示分辨率
ANGLE_RESOLUTION = 360  # Number of points in angle sweep 角度扫描点数


# ============================================================================
# CORE PHYSICS FUNCTIONS
# 核心物理函数
# ============================================================================

def malus_law(theta_degrees, I_initial=I0):
    """
    Calculate transmitted intensity using Malus's Law.
    使用马吕斯定律计算透射光强。

    This is the fundamental equation governing polarized light transmission
    through a polarizing filter. The cos² relationship arises from the
    projection of the electric field vector onto the analyzer axis.

    这是控制偏振光通过偏振片的基本方程。cos²关系源于电场矢量在
    检偏器轴上的投影。

    Parameters 参数:
    ----------
    theta_degrees : float or ndarray
        Angle in degrees between incident polarization and analyzer axis
        入射偏振方向与检偏器轴之间的夹角（度）
        Range: [0, 180] degrees

    I_initial : float, optional
        Initial light intensity before the analyzer (default: I0)
        进入检偏器前的光强（默认：I0）

    Returns 返回:
    -------
    intensity : float or ndarray
        Transmitted light intensity after the analyzer
        通过检偏器后的透射光强
        Range: [0, I_initial]

    Mathematical Derivation 数学推导:
    --------------------------------
    1. Electric field component along analyzer axis:
       E_transmitted = E₀ × cos(θ)

    2. Intensity is proportional to E²:
       I = E² = (E₀ × cos(θ))² = E₀² × cos²(θ)

    3. Since I₀ ∝ E₀²:
       I = I₀ × cos²(θ)

    Examples 示例:
    --------
    >>> malus_law(0)      # Parallel polarizers 平行偏振片
    100.0

    >>> malus_law(90)     # Crossed polarizers 正交偏振片
    0.0

    >>> malus_law(45)     # 45-degree angle 45度夹角
    50.0

    >>> angles = np.array([0, 30, 60, 90])
    >>> malus_law(angles)
    array([100.  ,  75.  ,  25.  ,   0.  ])
    """
    # Convert degrees to radians for trigonometric calculation
    # 将角度转换为弧度进行三角计算
    theta_radians = np.radians(theta_degrees)

    # Apply Malus's Law: I = I₀ × cos²(θ)
    # 应用马吕斯定律
    intensity = I_initial * np.cos(theta_radians)**2

    return intensity


def calculate_polarization_efficiency(theta_degrees):
    """
    Calculate the polarization efficiency (transmission percentage).
    计算偏振效率（透射百分比）。

    This metric helps understand how effectively the polarizer transmits
    light at different angles, expressed as a percentage.

    Parameters 参数:
    ----------
    theta_degrees : float or ndarray
        Angle in degrees

    Returns 返回:
    -------
    efficiency : float or ndarray
        Transmission efficiency as percentage (0-100%)
        透射效率百分比
    """
    return (malus_law(theta_degrees) / I0) * 100


# ============================================================================
# VISUALIZATION FUNCTIONS
# 可视化函数
# ============================================================================

def create_polarizer_diagram(ax, angle_deg):
    """
    Draw a schematic diagram of the polarizer setup.
    绘制偏振片装置示意图。

    This creates a visual representation showing:
    - Incident polarized light (fixed horizontal)
    - Rotating analyzer (adjustable angle)
    - Transmitted light (intensity varies with angle)

    Parameters 参数:
    ----------
    ax : matplotlib.axes.Axes
        The axes object to draw on
        绘图坐标轴对象

    angle_deg : float
        Current analyzer angle in degrees
        当前检偏器角度
    """
    ax.clear()
    ax.set_xlim(-1, 6)
    ax.set_ylim(-2, 2)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Polarizer Configuration\n偏振片配置', fontsize=12, fontweight='bold')

    # Draw incident light (horizontal polarization)
    # 绘制入射光（水平偏振）
    arrow_props = dict(width=0.15, head_width=0.3, head_length=0.2,
                      fc='#ff6b6b', ec='#c92a2a', alpha=0.8)
    ax.add_patch(FancyArrow(0, 0, 1.5, 0, **arrow_props))
    ax.text(0.75, -0.6, 'Incident Light\n入射光\nI₀ = 100',
            ha='center', va='top', fontsize=9)

    # Draw polarizer (analyzer)
    # 绘制偏振片（检偏器）
    theta_rad = np.radians(angle_deg)
    polarizer_length = 1.5
    px1 = 3 - polarizer_length/2 * np.sin(theta_rad)
    py1 = -polarizer_length/2 * np.cos(theta_rad)
    px2 = 3 + polarizer_length/2 * np.sin(theta_rad)
    py2 = polarizer_length/2 * np.cos(theta_rad)

    ax.plot([px1, px2], [py1, py2], 'b-', linewidth=8, alpha=0.6)
    ax.text(3, -1.2, f'Analyzer\n检偏器\nθ = {angle_deg:.0f}°',
            ha='center', va='top', fontsize=9, color='blue')

    # Draw transmission axis indicator
    # 绘制透射轴指示
    axis_length = 0.8
    ax.arrow(3, 0, axis_length * np.cos(theta_rad),
             axis_length * np.sin(theta_rad),
             head_width=0.15, head_length=0.1, fc='blue',
             ec='blue', linestyle='--', alpha=0.5)

    # Draw transmitted light
    # 绘制透射光
    intensity = malus_law(angle_deg)
    if intensity > 1:  # Only show if significant transmission
        transmitted_alpha = intensity / I0  # Scale transparency
        arrow_props_out = dict(width=0.15 * transmitted_alpha,
                              head_width=0.3, head_length=0.2,
                              fc='#51cf66', ec='#2f9e44',
                              alpha=transmitted_alpha)
        ax.add_patch(FancyArrow(3.5, 0, 1.5, 0, **arrow_props_out))
        ax.text(4.25, -0.6, f'Transmitted\n透射光\nI = {intensity:.1f}',
                ha='center', va='top', fontsize=9, color='green')
    else:
        ax.text(4.25, 0, 'Blocked\n阻挡', ha='center', va='center',
                fontsize=10, color='red', style='italic')


def plot_intensity_curve(ax, current_angle):
    """
    Plot the Malus's Law intensity curve.
    绘制马吕斯定律光强曲线。

    Shows the theoretical cos² relationship and marks the current state.
    显示理论cos²关系并标记当前状态。
    """
    angles = np.linspace(0, 180, ANGLE_RESOLUTION)
    intensities = malus_law(angles)

    ax.clear()
    ax.plot(angles, intensities, 'b-', linewidth=2.5, label='Malus\'s Law: I = I₀cos²(θ)')
    ax.axhline(y=I0, color='gray', linestyle='--', alpha=0.5, linewidth=1)
    ax.axhline(y=I0/2, color='gray', linestyle='--', alpha=0.5, linewidth=1)
    ax.axhline(y=0, color='gray', linestyle='-', alpha=0.3, linewidth=1)

    # Mark current state
    # 标记当前状态
    current_intensity = malus_law(current_angle)
    ax.plot(current_angle, current_intensity, 'ro', markersize=12,
            label=f'Current: θ={current_angle:.0f}°, I={current_intensity:.1f}')
    ax.vlines(current_angle, 0, current_intensity, colors='red',
              linestyles='dashed', alpha=0.5)

    # Labels and formatting
    # 标签和格式
    ax.set_xlabel('Polarizer Angle θ (degrees)\n偏振片角度 θ（度）', fontsize=11)
    ax.set_ylabel('Transmitted Intensity I\n透射光强 I', fontsize=11)
    ax.set_title('Intensity vs. Angle\n光强-角度关系', fontsize=12, fontweight='bold')
    ax.set_xlim(0, 180)
    ax.set_ylim(-5, 110)
    ax.grid(True, alpha=0.3)
    ax.legend(loc='upper right', fontsize=9)

    # Add key angle markers
    # 添加关键角度标记
    key_angles = [0, 45, 90, 135, 180]
    for angle in key_angles:
        intensity = malus_law(angle)
        ax.plot(angle, intensity, 'ko', markersize=4, alpha=0.5)
        if angle in [0, 90, 180]:
            ax.annotate(f'{angle}°\n{intensity:.0f}',
                       xy=(angle, intensity),
                       xytext=(0, 10), textcoords='offset points',
                       ha='center', fontsize=8, alpha=0.7)


def plot_efficiency_bar(ax, current_angle):
    """
    Plot transmission efficiency as a horizontal bar.
    以水平条形图显示透射效率。
    """
    efficiency = calculate_polarization_efficiency(current_angle)

    ax.clear()
    ax.barh([0], [efficiency], height=0.5, color='#339af0',
            edgecolor='#1971c2', linewidth=2)
    ax.set_xlim(0, 100)
    ax.set_ylim(-0.5, 0.5)
    ax.set_xlabel('Transmission Efficiency (%)\n透射效率 (%)', fontsize=11)
    ax.set_title(f'Current Efficiency: {efficiency:.1f}%\n当前效率',
                 fontsize=12, fontweight='bold')
    ax.set_yticks([])
    ax.grid(axis='x', alpha=0.3)

    # Add percentage text
    # 添加百分比文本
    ax.text(efficiency/2, 0, f'{efficiency:.1f}%',
            ha='center', va='center', fontsize=14,
            fontweight='bold', color='white')


# ============================================================================
# INTERACTIVE WIDGET SETUP
# 交互式控件设置
# ============================================================================

def create_interactive_demo():
    """
    Create the main interactive demonstration with slider control.
    创建带滑动条控制的主交互演示。

    This function sets up a matplotlib figure with:
    - Polarizer configuration diagram
    - Intensity vs angle plot
    - Efficiency bar chart
    - Interactive angle slider
    """
    # Create figure and subplots
    # 创建图形和子图
    fig = plt.figure(figsize=FIG_SIZE, dpi=DPI)
    fig.suptitle('Malus\'s Law Interactive Demonstration\n马吕斯定律交互演示',
                 fontsize=16, fontweight='bold', y=0.98)

    # Define subplot layout
    # 定义子图布局
    gs = fig.add_gridspec(3, 2, height_ratios=[3, 3, 1], hspace=0.35, wspace=0.3)
    ax_diagram = fig.add_subplot(gs[0, 0])
    ax_curve = fig.add_subplot(gs[0, 1])
    ax_efficiency = fig.add_subplot(gs[1, :])
    ax_slider = fig.add_subplot(gs[2, :])

    # Initial angle
    # 初始角度
    initial_angle = 45.0

    # Draw initial state
    # 绘制初始状态
    create_polarizer_diagram(ax_diagram, initial_angle)
    plot_intensity_curve(ax_curve, initial_angle)
    plot_efficiency_bar(ax_efficiency, initial_angle)

    # Create slider for angle control
    # 创建角度控制滑动条
    ax_slider.clear()
    ax_slider.set_xlim(0, 180)
    ax_slider.set_ylim(0, 1)
    ax_slider.axis('off')

    slider_ax = plt.axes([0.15, 0.05, 0.7, 0.03])
    angle_slider = Slider(
        ax=slider_ax,
        label='Angle θ (degrees)\n角度 θ（度）',
        valmin=0,
        valmax=180,
        valinit=initial_angle,
        valstep=1,
        color='#339af0'
    )

    # Update function for slider
    # 滑动条更新函数
    def update(val):
        """Update all plots when slider value changes"""
        angle = angle_slider.val
        create_polarizer_diagram(ax_diagram, angle)
        plot_intensity_curve(ax_curve, angle)
        plot_efficiency_bar(ax_efficiency, angle)
        fig.canvas.draw_idle()

    angle_slider.on_changed(update)

    # Add instructions text
    # 添加说明文本
    fig.text(0.5, 0.01,
             'Move the slider to change the polarizer angle | 移动滑动条改变偏振片角度',
             ha='center', fontsize=10, style='italic', color='gray')

    plt.show()


# ============================================================================
# COMMAND-LINE INTERFACE (OPTIONAL)
# 命令行界面（可选）
# ============================================================================

def print_summary_table():
    """
    Print a summary table of key angles and their corresponding intensities.
    打印关键角度及对应光强的总结表格。

    Useful for quick reference without running the interactive demo.
    无需运行交互演示即可快速参考。
    """
    print("\n" + "="*70)
    print("MALUS'S LAW - KEY ANGLES SUMMARY")
    print("马吕斯定律 - 关键角度总结")
    print("="*70)
    print(f"{'Angle (°)':<15} {'Intensity':<15} {'Efficiency (%)':<20} {'Description'}")
    print(f"{'角度':<15} {'光强':<15} {'效率':<20} {'说明'}")
    print("-"*70)

    key_angles = [
        (0, "Parallel 平行"),
        (30, "30° offset"),
        (45, "Diagonal 对角"),
        (60, "60° offset"),
        (90, "Crossed 正交"),
        (120, "120° offset"),
        (135, "135° offset"),
        (150, "150° offset"),
        (180, "Parallel 平行"),
    ]

    for angle, desc in key_angles:
        intensity = malus_law(angle)
        efficiency = calculate_polarization_efficiency(angle)
        print(f"{angle:<15} {intensity:<15.2f} {efficiency:<20.1f} {desc}")

    print("="*70 + "\n")


# ============================================================================
# MAIN EXECUTION
# 主执行函数
# ============================================================================

if __name__ == "__main__":
    """
    Main entry point for the script.
    脚本主入口。

    Running this script will:
    1. Print a summary table of key angles
    2. Launch the interactive demonstration

    运行此脚本将：
    1. 打印关键角度总结表
    2. 启动交互演示
    """
    print("\n" + "🌊 "*35)
    print("  MALUS'S LAW INTERACTIVE DEMONSTRATION")
    print("  马吕斯定律交互演示")
    print("🌊 "*35)
    print("\nPhysical Principle: I = I₀ × cos²(θ)")
    print("物理原理: 透射光强 = 入射光强 × cos²(夹角)\n")

    # Print summary table
    # 打印总结表
    print_summary_table()

    # Launch interactive demo
    # 启动交互演示
    print("Launching interactive demonstration...")
    print("正在启动交互演示...")
    print("\nInstructions 使用说明:")
    print("- Use the slider to adjust the polarizer angle")
    print("  使用滑动条调整偏振片角度")
    print("- Observe how intensity changes following cos² relationship")
    print("  观察光强如何按照cos²关系变化")
    print("- Pay attention to key angles: 0°, 45°, 90°, 180°")
    print("  注意关键角度：0°, 45°, 90°, 180°\n")

    try:
        create_interactive_demo()
    except KeyboardInterrupt:
        print("\n\nDemo interrupted by user. 演示被用户中断。")
        print("Thank you for learning with PolarCraft! 感谢使用PolarCraft学习！")
