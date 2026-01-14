#!/usr/bin/env python3
"""
旋光性演示 - 糖溶液旋光 (Optical Rotation - Sugar Solution)
==========================================================

演示手性分子（如糖）对线偏振光偏振方向的旋转。

物理原理:
---------
旋光公式：
    α = [α]_λ^T × l × c
    
    α: 旋光角度（度）
    [α]_λ^T: 比旋光度（物质特性，度·mL/(g·dm)）
    l: 样品长度（dm）
    c: 浓度（g/mL）

常见物质比旋光度（589nm, 20°C）:
    - 蔗糖（sucrose）: +66.5°
    - 果糖（fructose）: -92.4°
    - 葡萄糖（glucose）: +52.7°
    - 乳糖（lactose）: +52.3°

应用：
    - 糖含量测定（制糖工业）
    - 药物手性分析
    - 分子结构鉴定
    - 浓度测量

依赖: pip install numpy matplotlib
运行: python optical_rotation.py

作者: PolarCraft Team
日期: 2026-01-14
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, RadioButtons
from matplotlib.patches import FancyArrowPatch, Rectangle, Circle

# 物质比旋光度数据 (589nm, 20°C)
SUBSTANCES = {
    'sucrose': {'name': 'Sucrose (蔗糖)', 'specific_rotation': 66.5, 'color': '#22d3ee'},
    'fructose': {'name': 'Fructose (果糖)', 'specific_rotation': -92.4, 'color': '#f472b6'},
    'glucose': {'name': 'Glucose (葡萄糖)', 'specific_rotation': 52.7, 'color': '#a78bfa'},
    'lactose': {'name': 'Lactose (乳糖)', 'specific_rotation': 52.3, 'color': '#10b981'},
}

class OpticalRotationDemo:
    def __init__(self):
        self.fig = plt.figure(figsize=(14, 8))
        self.fig.patch.set_facecolor('#0f172a')
        self.fig.suptitle('旋光性演示 - 糖溶液旋光 (Optical Rotation - Sugar Solution)',
                         fontsize=16, fontweight='bold', color='white')
        
        # 参数
        self.substance = 'sucrose'
        self.concentration = 0.1  # g/mL
        self.length = 2.0  # dm
        self.input_angle = 0  # 输入偏振角度
        
        # 创建子图
        self.ax_main = plt.subplot2grid((2, 2), (0, 0), colspan=2)
        self.ax_curve = plt.subplot2grid((2, 2), (1, 0))
        self.ax_info = plt.subplot2grid((2, 2), (1, 1))
        
        self.create_controls()
        self.update_plot()
        plt.tight_layout()
        plt.show()
    
    def create_controls(self):
        """创建控件"""
        # 浓度滑块
        ax_conc = plt.axes([0.15, 0.12, 0.3, 0.03])
        ax_conc.set_facecolor('#1e293b')
        self.slider_conc = Slider(ax_conc, 'Concentration (g/mL)', 0.01, 0.5,
                                  valinit=self.concentration, color='#22d3ee')
        self.slider_conc.on_changed(self.on_param_changed)
        
        # 长度滑块
        ax_len = plt.axes([0.15, 0.08, 0.3, 0.03])
        ax_len.set_facecolor('#1e293b')
        self.slider_len = Slider(ax_len, 'Length (dm)', 0.5, 5.0,
                                valinit=self.length, color='#a78bfa')
        self.slider_len.on_changed(self.on_param_changed)
        
        # 物质选择
        ax_radio = plt.axes([0.70, 0.05, 0.25, 0.15])
        ax_radio.set_facecolor('#1e293b')
        labels = [v['name'] for v in SUBSTANCES.values()]
        self.radio = RadioButtons(ax_radio, labels, active=0)
        self.radio.on_clicked(self.on_substance_changed)
    
    def on_param_changed(self, val):
        self.concentration = self.slider_conc.val
        self.length = self.slider_len.val
        self.update_plot()
    
    def on_substance_changed(self, label):
        for key, val in SUBSTANCES.items():
            if val['name'] == label:
                self.substance = key
                break
        self.update_plot()
    
    def calculate_rotation(self):
        """计算旋光角度"""
        specific_rot = SUBSTANCES[self.substance]['specific_rotation']
        alpha = specific_rot * self.length * self.concentration
        return alpha
    
    def update_plot(self):
        """更新所有图"""
        self.ax_main.clear()
        self.ax_curve.clear()
        self.ax_info.clear()
        
        for ax in [self.ax_main, self.ax_curve, self.ax_info]:
            ax.set_facecolor('#1e293b')
        
        # 计算旋光角
        rotation_angle = self.calculate_rotation()
        output_angle = (self.input_angle + rotation_angle) % 180
        
        # 绘制光路
        self.draw_optical_path(rotation_angle, output_angle)
        
        # 绘制旋光角度曲线
        self.draw_rotation_curve()
        
        # 信息面板
        self.draw_info_panel(rotation_angle)
        
        self.fig.canvas.draw_idle()
    
    def draw_optical_path(self, rotation_angle, output_angle):
        """绘制光路图"""
        self.ax_main.set_xlim(-1, 11)
        self.ax_main.set_ylim(-2, 3)
        self.ax_main.axis('off')
        
        # 光源
        circle = Circle((0.5, 0.5), 0.3, color='#fbbf24', alpha=0.8)
        self.ax_main.add_patch(circle)
        self.ax_main.text(0.5, -0.3, 'Light\nSource', ha='center',
                         color='#94a3b8', fontsize=8)
        
        # 偏振片（产生线偏振光）
        rect = Rectangle((1.5, -0.5), 0.3, 2, facecolor='#60a5fa',
                        edgecolor='#60a5fa', alpha=0.3, linewidth=2)
        self.ax_main.add_patch(rect)
        self.ax_main.text(1.65, -1.0, 'Polarizer', ha='center',
                         color='#60a5fa', fontsize=9)
        
        # 输入偏振方向
        x1, y1 = 2.5, 0.5
        self.draw_polarization(x1, y1, self.input_angle, '#ffaa00', 'Input')
        
        # 糖溶液样品管
        tube_x = 5
        tube_w = 3 * self.length / 5  # 长度可视化
        rect_tube = Rectangle((tube_x - tube_w/2, -1), tube_w, 3,
                              facecolor=SUBSTANCES[self.substance]['color'],
                              edgecolor='white', alpha=0.2, linewidth=2)
        self.ax_main.add_patch(rect_tube)
        self.ax_main.text(tube_x, -1.5, f'{SUBSTANCES[self.substance]["name"]}',
                         ha='center', color=SUBSTANCES[self.substance]['color'],
                         fontsize=10, fontweight='bold')
        self.ax_main.text(tube_x, 1.8, f'c={self.concentration:.2f} g/mL\nl={self.length:.1f} dm',
                         ha='center', color='white', fontsize=8)
        
        # 光束通过
        self.ax_main.plot([2, tube_x - tube_w/2], [0.5, 0.5], '-',
                         color='#ffaa00', linewidth=3, alpha=0.7)
        self.ax_main.plot([tube_x + tube_w/2, 9], [0.5, 0.5], '-',
                         color='#44ff44', linewidth=3, alpha=0.7)
        
        # 输出偏振方向
        x2, y2 = 9.5, 0.5
        self.draw_polarization(x2, y2, output_angle, '#44ff44', 'Output')
        
        # 旋转角度标注
        if abs(rotation_angle) > 1:
            arrow_style = '->' if rotation_angle > 0 else '<-'
            self.ax_main.annotate('', xy=(tube_x + 0.5, 0.5), xytext=(tube_x - 0.5, 0.5),
                                 arrowprops=dict(arrowstyle=arrow_style,
                                               connectionstyle='arc3,rad=0.3',
                                               color='#10b981', lw=2))
            self.ax_main.text(tube_x, 1.3, f'α = {rotation_angle:+.1f}°',
                             ha='center', color='#10b981', fontsize=11,
                             fontweight='bold')
    
    def draw_polarization(self, x, y, angle, color, label):
        """绘制偏振方向指示"""
        angle_rad = np.radians(angle)
        dx = 0.5 * np.cos(angle_rad)
        dy = 0.5 * np.sin(angle_rad)
        
        arrow = FancyArrowPatch((x - dx, y - dy), (x + dx, y + dy),
                               arrowstyle='<->', mutation_scale=20,
                               linewidth=3, color=color)
        self.ax_main.add_patch(arrow)
        self.ax_main.text(x, y - 0.9, f'{label}\n{angle:.0f}°',
                         ha='center', color=color, fontsize=9)
    
    def draw_rotation_curve(self):
        """绘制旋光角度-浓度曲线"""
        concentrations = np.linspace(0, 0.5, 100)
        specific_rot = SUBSTANCES[self.substance]['specific_rotation']
        rotations = specific_rot * self.length * concentrations
        
        self.ax_curve.plot(concentrations, rotations, '-',
                          color=SUBSTANCES[self.substance]['color'], linewidth=2.5)
        
        # 当前点
        current_rot = self.calculate_rotation()
        self.ax_curve.plot(self.concentration, current_rot, 'o',
                          markersize=12, color='#fbbf24')
        
        self.ax_curve.set_xlabel('Concentration (g/mL)', color='white')
        self.ax_curve.set_ylabel('Rotation Angle α (°)', color='white')
        self.ax_curve.set_title('Rotation vs Concentration', color='white', fontsize=10)
        self.ax_curve.grid(True, alpha=0.2, color='white')
        self.ax_curve.tick_params(colors='white')
        for spine in self.ax_curve.spines.values():
            spine.set_color('white')
        
        # 零线
        self.ax_curve.axhline(0, color='#94a3b8', linestyle='--', linewidth=1)
    
    def draw_info_panel(self, rotation_angle):
        """信息面板"""
        self.ax_info.axis('off')
        
        specific_rot = SUBSTANCES[self.substance]['specific_rotation']
        sign = '+' if specific_rot > 0 else '-'
        chirality = '右旋 (D)' if specific_rot > 0 else '左旋 (L)'
        
        info_text = f"""
旋光公式:
  α = [α]λT × l × c

当前物质: {SUBSTANCES[self.substance]['name']}
  比旋光度: {sign}{abs(specific_rot):.1f}°
  手性: {chirality}

实验参数:
  浓度 c = {self.concentration:.3f} g/mL
  长度 l = {self.length:.1f} dm

计算结果:
  旋光角 α = {rotation_angle:+.2f}°
  输出偏振 = {(self.input_angle + rotation_angle) % 180:.1f}°

应用:
  • 糖浓度测定
  • 手性药物分析
  • 分子结构鉴定
"""
        self.ax_info.text(0.1, 0.5, info_text, color='white', fontsize=9,
                         verticalalignment='center', family='monospace')

if __name__ == '__main__':
    print("="*60)
    print("旋光性演示 - 糖溶液旋光")
    print("Optical Rotation - Sugar Solution")
    print("="*60)
    print("\n物理原理:")
    print("  α = [α]λT × l × c")
    print("  手性分子使偏振面旋转\n")
    
    demo = OpticalRotationDemo()
