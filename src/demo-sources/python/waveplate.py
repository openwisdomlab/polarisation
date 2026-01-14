#!/usr/bin/env python3
"""
波片原理演示 (Waveplate Demonstration)
====================================

演示四分之一波片(λ/4)和二分之一波片(λ/2)如何改变光的偏振态。

物理原理：
---------
1. **λ/4 波片** (Quarter-Wave Plate):
   - 相位延迟: Δφ = π/2 (90°)
   - 快轴与慢轴的相位差为90度
   - 应用：
     * 45°线偏振 → 圆偏振 (右旋RCP)
     * 135°线偏振 → 圆偏振 (左旋LCP)
     * 0°/90°线偏振 → 保持不变
     * 其他角度 → 椭圆偏振

2. **λ/2 波片** (Half-Wave Plate):
   - 相位延迟: Δφ = π (180°)
   - 快轴与慢轴的相位差为180度
   - 旋转公式: θ_out = 2θ_fast - θ_in
   - 应用：线偏振方向旋转，保持线偏振态

Jones矩阵表示：
-------------
λ/4波片（快轴沿x轴）:
    ⎡ 1   0  ⎤
    ⎣ 0  -i  ⎦

λ/2波片（快轴沿x轴）:
    ⎡ 1   0  ⎤
    ⎣ 0  -1  ⎦

旋转后的波片矩阵:
    R(-θ) · Waveplate · R(θ)

依赖库：
-------
pip install numpy matplotlib

使用方法：
---------
python waveplate.py

作者: PolarCraft Team
日期: 2026-01-14
许可: MIT License
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, RadioButtons, Button
from matplotlib.patches import Ellipse, FancyArrowPatch, Circle
from matplotlib.patches import Rectangle

# ============================================================================
# 物理常量
# ============================================================================
I0 = 1.0  # 初始光强


# ============================================================================
# Jones矩阵计算
# ============================================================================

def rotation_matrix(theta_rad):
    """
    旋转矩阵 R(θ)

    参数:
        theta_rad: 旋转角度（弧度）

    返回:
        2x2 旋转矩阵
    """
    c = np.cos(theta_rad)
    s = np.sin(theta_rad)
    return np.array([[c, s], [-s, c]])


def jones_linear_polarizer(theta_rad):
    """
    线偏振光的Jones矢量

    E = [cos(θ), sin(θ)]ᵀ
    """
    return np.array([np.cos(theta_rad), np.sin(theta_rad)], dtype=complex)


def jones_quarter_waveplate(fast_axis_rad):
    """
    λ/4 波片的Jones矩阵（快轴方向为fast_axis_rad）

    相位延迟 π/2:
        快轴方向分量: e^(iπ/4)
        慢轴方向分量: e^(-iπ/4)

    矩阵（快轴沿x）:
        ⎡ 1   0  ⎤
        ⎣ 0  -i  ⎦

    旋转后: R(-θ) · M · R(θ)
    """
    # 快轴沿x轴的波片矩阵
    M = np.array([[1, 0], [0, -1j]], dtype=complex)

    # 旋转到指定快轴方向
    R = rotation_matrix(fast_axis_rad)
    R_inv = rotation_matrix(-fast_axis_rad)

    return R_inv @ M @ R


def jones_half_waveplate(fast_axis_rad):
    """
    λ/2 波片的Jones矩阵（快轴方向为fast_axis_rad）

    相位延迟 π:
        快轴方向分量: e^(iπ/2) = i
        慢轴方向分量: e^(-iπ/2) = -i

    矩阵（快轴沿x）:
        ⎡ 1   0  ⎤
        ⎣ 0  -1  ⎦

    旋转后: R(-θ) · M · R(θ)
    """
    # 快轴沿x轴的波片矩阵
    M = np.array([[1, 0], [0, -1]], dtype=complex)

    # 旋转到指定快轴方向
    R = rotation_matrix(fast_axis_rad)
    R_inv = rotation_matrix(-fast_axis_rad)

    return R_inv @ M @ R


def apply_waveplate(input_jones, waveplate_matrix):
    """
    应用波片到输入Jones矢量

    output = M · input
    """
    return waveplate_matrix @ input_jones


def calculate_intensity(jones_vector):
    """
    计算Jones矢量的强度

    I = |E_x|² + |E_y|²
    """
    return np.abs(jones_vector[0])**2 + np.abs(jones_vector[1])**2


def classify_polarization_state(jones_vector, tolerance=0.05):
    """
    根据Jones矢量判断偏振态类型

    返回:
        ('linear', angle) - 线偏振，角度
        ('circular-r', 0) - 右旋圆偏振
        ('circular-l', 0) - 左旋圆偏振
        ('elliptical', angle) - 椭圆偏振，长轴角度
    """
    Ex = jones_vector[0]
    Ey = jones_vector[1]

    # 归一化
    norm = np.sqrt(np.abs(Ex)**2 + np.abs(Ey)**2)
    if norm < 1e-10:
        return ('linear', 0)

    Ex_n = Ex / norm
    Ey_n = Ey / norm

    # 相位差
    phase_diff = np.angle(Ey_n) - np.angle(Ex_n)
    phase_diff = (phase_diff + np.pi) % (2 * np.pi) - np.pi  # 归一化到[-π, π]

    # 强度比
    I_ratio = np.abs(Ey_n) / (np.abs(Ex_n) + 1e-10)

    # 判断偏振态
    # 线偏振: 相位差 ≈ 0 或 ≈ π
    if abs(phase_diff) < tolerance or abs(abs(phase_diff) - np.pi) < tolerance:
        angle_rad = np.arctan2(np.real(Ey_n), np.real(Ex_n))
        angle_deg = np.degrees(angle_rad) % 180
        return ('linear', angle_deg)

    # 圆偏振: |Ex| ≈ |Ey| 且 相位差 ≈ ±π/2
    if abs(I_ratio - 1) < tolerance:
        if abs(abs(phase_diff) - np.pi/2) < tolerance:
            if phase_diff > 0:
                return ('circular-r', 0)  # 右旋（从光源看顺时针）
            else:
                return ('circular-l', 0)  # 左旋（从光源看逆时针）

    # 否则为椭圆偏振
    angle_rad = np.arctan2(np.imag(Ex_n * np.conj(Ey_n)), np.real(Ex_n * np.conj(Ey_n))) / 2
    angle_deg = np.degrees(angle_rad) % 180
    return ('elliptical', angle_deg)


# ============================================================================
# 可视化
# ============================================================================

class WaveplateDemo:
    """波片演示交互界面"""

    def __init__(self):
        # 初始参数
        self.waveplate_type = 'quarter'  # 'quarter' or 'half'
        self.input_angle = 45  # 输入偏振角度（度）
        self.fast_axis_angle = 0  # 快轴角度（度）

        # 创建图形
        self.fig = plt.figure(figsize=(14, 9))
        self.fig.suptitle('波片原理演示 (Waveplate Demonstration)',
                         fontsize=16, fontweight='bold')

        # 设置深色背景
        self.fig.patch.set_facecolor('#0f172a')

        # 主面板：光路图
        self.ax_main = plt.subplot2grid((3, 3), (0, 0), colspan=2, rowspan=2)
        self.ax_main.set_facecolor('#1e293b')
        self.ax_main.set_xlim(0, 10)
        self.ax_main.set_ylim(0, 5)
        self.ax_main.axis('off')
        self.ax_main.set_aspect('equal')

        # 输入偏振态
        self.ax_input = plt.subplot2grid((3, 3), (0, 2))
        self.ax_input.set_facecolor('#1e293b')
        self.ax_input.set_xlim(-1.5, 1.5)
        self.ax_input.set_ylim(-1.5, 1.5)
        self.ax_input.set_aspect('equal')
        self.ax_input.set_title('Input Polarization', color='white', fontsize=10)
        self.ax_input.axis('off')

        # 输出偏振态
        self.ax_output = plt.subplot2grid((3, 3), (1, 2))
        self.ax_output.set_facecolor('#1e293b')
        self.ax_output.set_xlim(-1.5, 1.5)
        self.ax_output.set_ylim(-1.5, 1.5)
        self.ax_output.set_aspect('equal')
        self.ax_output.set_title('Output Polarization', color='white', fontsize=10)
        self.ax_output.axis('off')

        # 相位延迟图
        self.ax_phase = plt.subplot2grid((3, 3), (2, 0), colspan=3)
        self.ax_phase.set_facecolor('#1e293b')
        self.ax_phase.set_xlim(0, 10)
        self.ax_phase.set_ylim(-2, 2)
        self.ax_phase.set_title('Phase Retardation', color='white', fontsize=10)
        self.ax_phase.set_xlabel('Position', color='white')
        self.ax_phase.set_ylabel('Amplitude', color='white')
        self.ax_phase.tick_params(colors='white')
        self.ax_phase.spines['bottom'].set_color('white')
        self.ax_phase.spines['top'].set_color('white')
        self.ax_phase.spines['left'].set_color('white')
        self.ax_phase.spines['right'].set_color('white')

        # 创建控件
        self.create_controls()

        # 初始绘制
        self.update_plot()

        plt.tight_layout()
        plt.show()

    def create_controls(self):
        """创建交互控件"""
        # 波片类型选择（单选按钮）
        ax_radio = plt.axes([0.05, 0.75, 0.12, 0.15])
        ax_radio.set_facecolor('#1e293b')
        self.radio = RadioButtons(ax_radio, ('λ/4 Quarter', 'λ/2 Half'),
                                  active=0 if self.waveplate_type == 'quarter' else 1)
        self.radio.on_clicked(self.on_waveplate_type_changed)

        # 输入角度滑块
        ax_input_angle = plt.axes([0.25, 0.05, 0.5, 0.03])
        ax_input_angle.set_facecolor('#1e293b')
        self.slider_input = Slider(ax_input_angle, 'Input Angle (°)',
                                   0, 180, valinit=self.input_angle,
                                   valstep=5, color='#ffaa00')
        self.slider_input.on_changed(self.on_input_changed)

        # 快轴角度滑块
        ax_fast_axis = plt.axes([0.25, 0.10, 0.5, 0.03])
        ax_fast_axis.set_facecolor('#1e293b')
        self.slider_fast_axis = Slider(ax_fast_axis, 'Fast Axis (°)',
                                       0, 180, valinit=self.fast_axis_angle,
                                       valstep=5, color='#fbbf24')
        self.slider_fast_axis.on_changed(self.on_fast_axis_changed)

        # 重置按钮
        ax_reset = plt.axes([0.80, 0.05, 0.1, 0.04])
        self.btn_reset = Button(ax_reset, 'Reset', color='#334155', hovercolor='#475569')
        self.btn_reset.on_clicked(self.on_reset)

    def on_waveplate_type_changed(self, label):
        """波片类型改变回调"""
        self.waveplate_type = 'quarter' if label == 'λ/4 Quarter' else 'half'
        self.update_plot()

    def on_input_changed(self, val):
        """输入角度改变回调"""
        self.input_angle = val
        self.update_plot()

    def on_fast_axis_changed(self, val):
        """快轴角度改变回调"""
        self.fast_axis_angle = val
        self.update_plot()

    def on_reset(self, event):
        """重置按钮回调"""
        self.input_angle = 45
        self.fast_axis_angle = 0
        self.slider_input.set_val(45)
        self.slider_fast_axis.set_val(0)
        self.update_plot()

    def update_plot(self):
        """更新所有图形"""
        # 清除所有子图
        self.ax_main.clear()
        self.ax_input.clear()
        self.ax_output.clear()
        self.ax_phase.clear()

        # 重新设置
        self.ax_main.set_xlim(0, 10)
        self.ax_main.set_ylim(0, 5)
        self.ax_main.axis('off')
        self.ax_main.set_aspect('equal')
        self.ax_main.set_facecolor('#1e293b')

        self.ax_input.set_xlim(-1.5, 1.5)
        self.ax_input.set_ylim(-1.5, 1.5)
        self.ax_input.set_aspect('equal')
        self.ax_input.axis('off')
        self.ax_input.set_facecolor('#1e293b')
        self.ax_input.set_title('Input Polarization', color='white', fontsize=10)

        self.ax_output.set_xlim(-1.5, 1.5)
        self.ax_output.set_ylim(-1.5, 1.5)
        self.ax_output.set_aspect('equal')
        self.ax_output.axis('off')
        self.ax_output.set_facecolor('#1e293b')
        self.ax_output.set_title('Output Polarization', color='white', fontsize=10)

        self.ax_phase.set_xlim(0, 10)
        self.ax_phase.set_ylim(-2, 2)
        self.ax_phase.set_facecolor('#1e293b')
        self.ax_phase.set_title('Phase Retardation', color='white', fontsize=10)
        self.ax_phase.tick_params(colors='white')
        for spine in self.ax_phase.spines.values():
            spine.set_color('white')

        # ========== 物理计算 ==========
        input_rad = np.radians(self.input_angle)
        fast_axis_rad = np.radians(self.fast_axis_angle)

        # 输入Jones矢量
        input_jones = jones_linear_polarizer(input_rad)

        # 波片矩阵
        if self.waveplate_type == 'quarter':
            waveplate_matrix = jones_quarter_waveplate(fast_axis_rad)
        else:
            waveplate_matrix = jones_half_waveplate(fast_axis_rad)

        # 输出Jones矢量
        output_jones = apply_waveplate(input_jones, waveplate_matrix)

        # 偏振态分类
        input_state, input_state_angle = classify_polarization_state(input_jones)
        output_state, output_state_angle = classify_polarization_state(output_jones)

        # ========== 绘制光路图 ==========
        self.draw_optical_path(input_rad, fast_axis_rad, output_state)

        # ========== 绘制输入偏振态 ==========
        self.draw_polarization_state(self.ax_input, input_jones, input_state,
                                     input_state_angle, '#ffaa00')

        # ========== 绘制输出偏振态 ==========
        output_color = {
            'linear': '#44ff44',
            'circular-r': '#22d3ee',
            'circular-l': '#22d3ee',
            'elliptical': '#a78bfa'
        }.get(output_state, '#ffffff')

        self.draw_polarization_state(self.ax_output, output_jones, output_state,
                                     output_state_angle, output_color)

        # ========== 绘制相位延迟图 ==========
        self.draw_phase_diagram()

        # 刷新画布
        self.fig.canvas.draw_idle()

    def draw_optical_path(self, input_rad, fast_axis_rad, output_state):
        """绘制光路图"""
        # 光源
        source_x, source_y = 1, 2.5
        circle = Circle((source_x, source_y), 0.3, color='#fbbf24', alpha=0.8)
        self.ax_main.add_patch(circle)
        self.ax_main.text(source_x, source_y - 0.7, 'Light Source',
                         ha='center', va='top', color='#94a3b8', fontsize=8)

        # 输入光束
        self.ax_main.arrow(source_x + 0.3, source_y, 1.5, 0,
                          head_width=0.15, head_length=0.2,
                          fc='#ffaa00', ec='#ffaa00', alpha=0.7, linewidth=2)

        # 输入偏振方向指示
        input_x, input_y = 2.5, 2.5
        dx = 0.4 * np.cos(input_rad)
        dy = 0.4 * np.sin(input_rad)
        arrow = FancyArrowPatch((input_x - dx, input_y - dy), (input_x + dx, input_y + dy),
                               arrowstyle='<->', mutation_scale=15,
                               linewidth=2.5, color='#ffaa00')
        self.ax_main.add_patch(arrow)
        self.ax_main.text(input_x, input_y - 0.7, f'{self.input_angle:.0f}°',
                         ha='center', va='top', color='#ffaa00', fontsize=8)

        # 波片
        waveplate_x, waveplate_y = 5, 2.5
        waveplate_color = '#a78bfa' if self.waveplate_type == 'quarter' else '#f472b6'
        waveplate_label = 'λ/4' if self.waveplate_type == 'quarter' else 'λ/2'

        ellipse = Ellipse((waveplate_x, waveplate_y), 0.8, 1.8,
                         facecolor=waveplate_color, edgecolor=waveplate_color,
                         alpha=0.3, linewidth=2)
        self.ax_main.add_patch(ellipse)
        self.ax_main.text(waveplate_x, waveplate_y - 1.3, f'{waveplate_label} Waveplate',
                         ha='center', va='top', color=waveplate_color, fontsize=9,
                         fontweight='bold')

        # 快轴指示（黄色）
        fast_dx = 0.7 * np.cos(fast_axis_rad)
        fast_dy = 0.7 * np.sin(fast_axis_rad)
        fast_arrow = FancyArrowPatch((waveplate_x - fast_dx, waveplate_y - fast_dy),
                                    (waveplate_x + fast_dx, waveplate_y + fast_dy),
                                    arrowstyle='->', mutation_scale=15,
                                    linewidth=3, color='#fbbf24')
        self.ax_main.add_patch(fast_arrow)
        self.ax_main.text(waveplate_x - 1.0, waveplate_y + 1.2, 'Fast Axis',
                         ha='center', color='#fbbf24', fontsize=7)

        # 慢轴指示（蓝色，虚线）
        slow_rad = fast_axis_rad + np.pi / 2
        slow_dx = 0.6 * np.cos(slow_rad)
        slow_dy = 0.6 * np.sin(slow_rad)
        self.ax_main.plot([waveplate_x - slow_dx, waveplate_x + slow_dx],
                         [waveplate_y - slow_dy, waveplate_y + slow_dy],
                         '--', color='#60a5fa', linewidth=2)
        self.ax_main.text(waveplate_x + 1.0, waveplate_y + 1.2, 'Slow Axis',
                         ha='center', color='#60a5fa', fontsize=7)

        # 输出光束
        output_color = {
            'linear': '#44ff44',
            'circular-r': '#22d3ee',
            'circular-l': '#22d3ee',
            'elliptical': '#a78bfa'
        }.get(output_state, '#ffffff')

        self.ax_main.arrow(waveplate_x + 0.5, waveplate_y, 2.0, 0,
                          head_width=0.15, head_length=0.2,
                          fc=output_color, ec=output_color, alpha=0.7, linewidth=2)

        # 观察屏
        screen_x = 9
        screen = Rectangle((screen_x - 0.1, waveplate_y - 1), 0.2, 2,
                          facecolor='#1e293b', edgecolor='#94a3b8', linewidth=2)
        self.ax_main.add_patch(screen)

        # 屏幕光斑
        spot = Circle((screen_x, waveplate_y), 0.3, color=output_color, alpha=0.8)
        self.ax_main.add_patch(spot)
        self.ax_main.text(screen_x, waveplate_y - 1.3, 'Screen',
                         ha='center', va='top', color='#94a3b8', fontsize=8)

    def draw_polarization_state(self, ax, jones_vector, state_type, angle, color):
        """绘制偏振态指示"""
        if state_type == 'linear':
            # 线偏振 - 双向箭头
            angle_rad = np.radians(angle)
            dx = np.cos(angle_rad)
            dy = np.sin(angle_rad)
            arrow = FancyArrowPatch((-dx, -dy), (dx, dy),
                                   arrowstyle='<->', mutation_scale=20,
                                   linewidth=3, color=color)
            ax.add_patch(arrow)
            ax.text(0, -1.3, f'Linear\n{angle:.0f}°',
                   ha='center', va='top', color=color, fontsize=9)

        elif state_type in ['circular-r', 'circular-l']:
            # 圆偏振 - 圆圈 + 旋转箭头
            circle = Circle((0, 0), 1, fill=False, edgecolor=color, linewidth=2.5)
            ax.add_patch(circle)

            # 旋转方向指示
            if state_type == 'circular-r':
                # 右旋（顺时针）
                ax.annotate('', xy=(0.7, 0.7), xytext=(-0.7, 0.7),
                           arrowprops=dict(arrowstyle='->', color=color, lw=2,
                                         connectionstyle="arc3,rad=0.3"))
                ax.text(0, -1.3, 'Right\nCircular',
                       ha='center', va='top', color=color, fontsize=9)
            else:
                # 左旋（逆时针）
                ax.annotate('', xy=(-0.7, 0.7), xytext=(0.7, 0.7),
                           arrowprops=dict(arrowstyle='->', color=color, lw=2,
                                         connectionstyle="arc3,rad=-0.3"))
                ax.text(0, -1.3, 'Left\nCircular',
                       ha='center', va='top', color=color, fontsize=9)

        else:
            # 椭圆偏振
            # 计算椭圆参数
            Ex = jones_vector[0]
            Ey = jones_vector[1]
            a = np.abs(Ex)  # 长半轴
            b = np.abs(Ey)  # 短半轴

            # 确保a >= b
            if b > a:
                a, b = b, a
                angle = (angle + 90) % 180

            ellipse = Ellipse((0, 0), 2*a, 2*b, angle=angle,
                            fill=False, edgecolor=color, linewidth=2.5)
            ax.add_patch(ellipse)
            ax.text(0, -1.3, f'Elliptical\n{angle:.0f}°',
                   ha='center', va='top', color=color, fontsize=9)

    def draw_phase_diagram(self):
        """绘制相位延迟示意图"""
        x = np.linspace(0, 10, 500)
        wavelength = 2.0

        # 快轴分量（黄色）
        y_fast = np.sin(2 * np.pi * x / wavelength)
        self.ax_phase.plot(x, y_fast, color='#fbbf24', linewidth=2.5, label='Fast Axis')

        # 慢轴分量（蓝色，带相位延迟）
        if self.waveplate_type == 'quarter':
            phase_shift = np.pi / 2  # λ/4
            label_text = 'Slow Axis (Δφ = π/2)'
        else:
            phase_shift = np.pi  # λ/2
            label_text = 'Slow Axis (Δφ = π)'

        y_slow = np.sin(2 * np.pi * x / wavelength + phase_shift)
        self.ax_phase.plot(x, y_slow, color='#60a5fa', linewidth=2.5,
                          linestyle='--', label=label_text)

        self.ax_phase.legend(loc='upper right', facecolor='#1e293b',
                            edgecolor='white', labelcolor='white')
        self.ax_phase.axhline(0, color='#94a3b8', linewidth=0.5, linestyle=':')
        self.ax_phase.grid(True, alpha=0.2, color='white')


# ============================================================================
# 主程序
# ============================================================================

if __name__ == '__main__':
    print("=" * 70)
    print("波片原理演示 (Waveplate Demonstration)")
    print("=" * 70)
    print("\n物理原理:")
    print("  λ/4 波片: 相位延迟 π/2 (90°)")
    print("    - 45°线偏振 → 圆偏振")
    print("    - 0°/90°线偏振 → 保持不变")
    print("    - 其他角度 → 椭圆偏振")
    print("\n  λ/2 波片: 相位延迟 π (180°)")
    print("    - 输出角度 = 2 × 快轴角度 - 输入角度")
    print("    - 实现线偏振方向旋转")
    print("\n交互说明:")
    print("  - 使用单选按钮切换波片类型")
    print("  - 拖动滑块调整输入角度和快轴角度")
    print("  - 观察输出偏振态的变化")
    print("  - 点击Reset按钮恢复默认设置")
    print("\n")

    # 启动交互演示
    demo = WaveplateDemo()
