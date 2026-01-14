#!/usr/bin/env python3
"""
布儒斯特角演示 (Brewster's Angle Demonstration)
=============================================

演示布儒斯特角现象：当光以特定角度入射时，反射光为完全s偏振。

物理原理:
---------
布儒斯特角定义:
    tan(θ_B) = n₂/n₁
    θ_B = arctan(n₂/n₁)

在布儒斯特角入射时:
    - p偏振光反射率 R_p = 0 (无反射！)
    - s偏振光反射率 R_s ≠ 0
    - 反射光为完全s偏振
    - 反射光与折射光垂直 (θ_i + θ_t = 90°)

应用:
    - 偏振片制造
    - 激光器布儒斯特窗
    - 防眩光镜片
    - 摄影偏振滤镜

依赖: pip install numpy matplotlib
运行: python brewster.py

作者: PolarCraft Team
日期: 2026-01-14
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from matplotlib.patches import FancyArrowPatch, Wedge

def fresnel_coefficients(theta1_deg, n1, n2):
    """计算Fresnel反射系数"""
    theta1_rad = np.radians(theta1_deg)
    sin_theta1 = np.sin(theta1_rad)
    cos_theta1 = np.cos(theta1_rad)
    
    # Snell定律
    sin_theta2 = (n1 / n2) * sin_theta1
    
    # 全内反射检查
    if sin_theta2 > 1:
        return {'Rs': 1.0, 'Rp': 1.0, 'theta2': 90, 'tir': True}
    
    cos_theta2 = np.sqrt(1 - sin_theta2**2)
    theta2_deg = np.degrees(np.arcsin(sin_theta2))
    
    # Fresnel方程
    rs = (n1*cos_theta1 - n2*cos_theta2) / (n1*cos_theta1 + n2*cos_theta2)
    rp = (n2*cos_theta1 - n1*cos_theta2) / (n2*cos_theta1 + n1*cos_theta2)
    
    Rs = rs**2
    Rp = rp**2
    
    return {'Rs': Rs, 'Rp': Rp, 'theta2': theta2_deg, 'tir': False}

class BrewsterDemo:
    def __init__(self):
        self.fig = plt.figure(figsize=(14, 8))
        self.fig.patch.set_facecolor('#0f172a')
        self.fig.suptitle('布儒斯特角演示 (Brewster\'s Angle Demonstration)', 
                         fontsize=16, fontweight='bold', color='white')
        
        # 参数
        self.n1 = 1.0  # 空气
        self.n2 = 1.5  # 玻璃
        self.theta_deg = 56.3  # 初始角度
        
        # 布儒斯特角
        self.theta_brewster = np.degrees(np.arctan(self.n2/self.n1))
        
        # 创建子图
        self.ax_main = plt.subplot2grid((2, 2), (0, 0), rowspan=2)
        self.ax_curve = plt.subplot2grid((2, 2), (0, 1))
        self.ax_info = plt.subplot2grid((2, 2), (1, 1))
        
        self.create_controls()
        self.update_plot()
        plt.tight_layout()
        plt.show()
    
    def create_controls(self):
        """创建控件"""
        ax_theta = plt.axes([0.15, 0.05, 0.3, 0.03])
        ax_theta.set_facecolor('#1e293b')
        self.slider_theta = Slider(ax_theta, 'Angle (°)', 0, 90, 
                                   valinit=self.theta_deg, color='#22d3ee')
        self.slider_theta.on_changed(self.on_theta_changed)
        
        ax_n2 = plt.axes([0.15, 0.10, 0.3, 0.03])
        ax_n2.set_facecolor('#1e293b')
        self.slider_n2 = Slider(ax_n2, 'n₂ (glass)', 1.0, 2.5, 
                               valinit=self.n2, valstep=0.1, color='#a78bfa')
        self.slider_n2.on_changed(self.on_n2_changed)
    
    def on_theta_changed(self, val):
        self.theta_deg = val
        self.update_plot()
    
    def on_n2_changed(self, val):
        self.n2 = val
        self.theta_brewster = np.degrees(np.arctan(self.n2/self.n1))
        self.update_plot()
    
    def update_plot(self):
        """更新所有图"""
        self.ax_main.clear()
        self.ax_curve.clear()
        self.ax_info.clear()
        
        # 设置样式
        for ax in [self.ax_main, self.ax_curve, self.ax_info]:
            ax.set_facecolor('#1e293b')
        
        # 绘制光路
        self.draw_optical_path()
        
        # 绘制反射率曲线
        self.draw_reflectance_curve()
        
        # 信息面板
        self.draw_info_panel()
        
        self.fig.canvas.draw_idle()
    
    def draw_optical_path(self):
        """绘制光路图"""
        self.ax_main.set_xlim(-3, 3)
        self.ax_main.set_ylim(-2, 3)
        self.ax_main.set_aspect('equal')
        self.ax_main.axis('off')
        
        # 界面
        self.ax_main.axhline(0, color='#60a5fa', linewidth=3, linestyle='--')
        self.ax_main.text(2.5, 0.2, 'Air (n₁=1.0)', color='white', fontsize=10)
        self.ax_main.text(2.5, -0.3, f'Glass (n₂={self.n2:.1f})', color='white', fontsize=10)
        
        # 法线
        self.ax_main.plot([0, 0], [-2, 3], ':', color='#94a3b8', linewidth=1.5)
        
        # 计算物理
        result = fresnel_coefficients(self.theta_deg, self.n1, self.n2)
        
        theta1_rad = np.radians(self.theta_deg)
        theta2_rad = np.radians(result['theta2'])
        
        # 入射光
        x_inc = -2 * np.sin(theta1_rad)
        y_inc = 2 * np.cos(theta1_rad)
        arrow_inc = FancyArrowPatch((x_inc, y_inc), (0, 0),
                                   arrowstyle='->', mutation_scale=20,
                                   linewidth=3, color='#fbbf24')
        self.ax_main.add_patch(arrow_inc)
        self.ax_main.text(x_inc-0.3, y_inc+0.2, f'{self.theta_deg:.1f}°', 
                         color='#fbbf24', fontsize=9)
        
        # 反射光 (s偏振强)
        x_ref = 2 * np.sin(theta1_rad)
        y_ref = 2 * np.cos(theta1_rad)
        intensity_s = result['Rs']
        arrow_ref = FancyArrowPatch((0, 0), (x_ref, y_ref),
                                   arrowstyle='->', mutation_scale=20,
                                   linewidth=2+intensity_s*2, color='#f472b6',
                                   alpha=0.5+intensity_s*0.5)
        self.ax_main.add_patch(arrow_ref)
        self.ax_main.text(x_ref+0.3, y_ref, f'Rs={intensity_s:.3f}', 
                         color='#f472b6', fontsize=9)
        
        # 折射光
        if not result['tir']:
            x_refr = 2 * np.sin(theta2_rad)
            y_refr = -2 * np.cos(theta2_rad)
            arrow_refr = FancyArrowPatch((0, 0), (x_refr, y_refr),
                                        arrowstyle='->', mutation_scale=20,
                                        linewidth=3, color='#22d3ee')
            self.ax_main.add_patch(arrow_refr)
            self.ax_main.text(x_refr+0.3, y_refr, f'{result["theta2"]:.1f}°', 
                             color='#22d3ee', fontsize=9)
        
        # 布儒斯特角标记
        if abs(self.theta_deg - self.theta_brewster) < 2:
            wedge = Wedge((0, 0), 1.5, 90-self.theta_brewster, 90,
                         facecolor='#10b981', alpha=0.2)
            self.ax_main.add_patch(wedge)
            self.ax_main.text(0.3, 1.2, 'Brewster\nAngle!', 
                             color='#10b981', fontsize=11, fontweight='bold')
    
    def draw_reflectance_curve(self):
        """绘制反射率曲线"""
        angles = np.linspace(0, 90, 200)
        Rs_vals = []
        Rp_vals = []
        
        for angle in angles:
            res = fresnel_coefficients(angle, self.n1, self.n2)
            Rs_vals.append(res['Rs'])
            Rp_vals.append(res['Rp'])
        
        self.ax_curve.plot(angles, Rs_vals, '-', color='#f472b6', linewidth=2.5, label='Rs (s-pol)')
        self.ax_curve.plot(angles, Rp_vals, '-', color='#22d3ee', linewidth=2.5, label='Rp (p-pol)')
        
        # 当前角度标记
        result = fresnel_coefficients(self.theta_deg, self.n1, self.n2)
        self.ax_curve.plot(self.theta_deg, result['Rs'], 'o', color='#f472b6', markersize=10)
        self.ax_curve.plot(self.theta_deg, result['Rp'], 'o', color='#22d3ee', markersize=10)
        
        # 布儒斯特角标记
        self.ax_curve.axvline(self.theta_brewster, color='#10b981', linestyle='--', linewidth=2)
        self.ax_curve.text(self.theta_brewster+2, 0.9, f'θ_B={self.theta_brewster:.1f}°', 
                          color='#10b981', fontsize=9)
        
        self.ax_curve.set_xlabel('Incident Angle (°)', color='white')
        self.ax_curve.set_ylabel('Reflectance', color='white')
        self.ax_curve.set_xlim(0, 90)
        self.ax_curve.set_ylim(0, 1)
        self.ax_curve.legend(facecolor='#1e293b', edgecolor='white', labelcolor='white')
        self.ax_curve.grid(True, alpha=0.2, color='white')
        self.ax_curve.tick_params(colors='white')
        for spine in self.ax_curve.spines.values():
            spine.set_color('white')
    
    def draw_info_panel(self):
        """信息面板"""
        self.ax_info.axis('off')
        
        info_text = f"""
布儒斯特角公式:
  θ_B = arctan(n₂/n₁) = {self.theta_brewster:.2f}°

当前设置:
  入射角: {self.theta_deg:.1f}°
  折射率: n₁={self.n1:.1f}, n₂={self.n2:.1f}

结果:
  R_s = {fresnel_coefficients(self.theta_deg, self.n1, self.n2)['Rs']:.4f}
  R_p = {fresnel_coefficients(self.theta_deg, self.n1, self.n2)['Rp']:.4f}

特点:
  • 在布儒斯特角，R_p = 0
  • 反射光为完全s偏振
  • 反射光⊥折射光
  • 应用于偏振片、激光窗口
"""
        self.ax_info.text(0.1, 0.5, info_text, color='white', fontsize=9,
                         verticalalignment='center', family='monospace')

if __name__ == '__main__':
    print("="*60)
    print("布儒斯特角演示 (Brewster's Angle Demonstration)")
    print("="*60)
    print("\n物理原理:")
    print("  θ_B = arctan(n₂/n₁)")
    print("  在布儒斯特角：R_p = 0，反射光为完全s偏振\n")
    
    demo = BrewsterDemo()
