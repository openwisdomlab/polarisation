#!/usr/bin/env python3
"""
瑞利散射演示 - 为什么天空是蓝色？(Rayleigh Scattering - Why is the Sky Blue?)
============================================================================

演示瑞利散射如何产生蓝天和日落的颜色，以及散射光的偏振特性。

物理原理:
---------
瑞利散射强度公式:
    I(θ, λ) ∝ (1 + cos²θ) / λ⁴
    
    θ: 散射角度
    λ: 光波波长
    
关键结论:
    1. 散射强度 ∝ 1/λ⁴（短波长散射更强）
    2. 蓝光（450nm）散射强度 ≈ 红光（650nm）的 5.6倍
    3. 90°散射光为完全线偏振
    4. 日落时光程长，蓝光散射殆尽，红光穿透

应用:
    - 大气光学现象解释
    - 偏振天光导航
    - 天文观测时间选择
    - 摄影偏振滤镜使用

依赖: pip install numpy matplotlib
运行: python rayleigh_scattering.py

作者: PolarCraft Team
日期: 2026-01-14
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from matplotlib.patches import Circle, Wedge, FancyArrowPatch

def wavelength_to_rgb(wavelength):
    """波长转RGB颜色"""
    if wavelength < 380:
        wavelength = 380
    elif wavelength > 750:
        wavelength = 750
    
    if 380 <= wavelength < 440:
        R = -(wavelength - 440) / (440 - 380)
        G = 0.0
        B = 1.0
    elif 440 <= wavelength < 490:
        R = 0.0
        G = (wavelength - 440) / (490 - 440)
        B = 1.0
    elif 490 <= wavelength < 510:
        R = 0.0
        G = 1.0
        B = -(wavelength - 510) / (510 - 490)
    elif 510 <= wavelength < 580:
        R = (wavelength - 510) / (580 - 510)
        G = 1.0
        B = 0.0
    elif 580 <= wavelength < 645:
        R = 1.0
        G = -(wavelength - 645) / (645 - 580)
        B = 0.0
    elif 645 <= wavelength <= 750:
        R = 1.0
        G = 0.0
        B = 0.0
    
    # 亮度因子
    if 380 <= wavelength < 420:
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380)
    elif 420 <= wavelength < 700:
        factor = 1.0
    elif 700 <= wavelength <= 750:
        factor = 0.3 + 0.7 * (750 - wavelength) / (750 - 700)
    
    return (R * factor, G * factor, B * factor)

def rayleigh_intensity(wavelength, theta_deg):
    """计算瑞利散射强度"""
    theta_rad = np.radians(theta_deg)
    # I ∝ (1 + cos²θ) / λ⁴
    angular_factor = (1 + np.cos(theta_rad)**2)
    wavelength_factor = (450 / wavelength) ** 4  # 归一化到450nm
    return angular_factor * wavelength_factor

class RayleighScatteringDemo:
    def __init__(self):
        self.fig = plt.figure(figsize=(14, 9))
        self.fig.patch.set_facecolor('#0f172a')
        self.fig.suptitle('瑞利散射演示 - 为什么天空是蓝色？(Rayleigh Scattering)',
                         fontsize=16, fontweight='bold', color='white')
        
        # 参数
        self.sun_angle = 30  # 太阳高度角（0=地平线，90=天顶）
        self.view_angle = 90  # 观察角度
        
        # 创建子图
        self.ax_sky = plt.subplot2grid((3, 2), (0, 0), colspan=2, rowspan=2)
        self.ax_spectrum = plt.subplot2grid((3, 2), (2, 0))
        self.ax_polar = plt.subplot2grid((3, 2), (2, 1), projection='polar')
        
        self.create_controls()
        self.update_plot()
        plt.tight_layout()
        plt.show()
    
    def create_controls(self):
        """创建控件"""
        # 太阳高度角滑块
        ax_sun = plt.axes([0.15, 0.08, 0.35, 0.03])
        ax_sun.set_facecolor('#1e293b')
        self.slider_sun = Slider(ax_sun, 'Sun Elevation (°)', 0, 90,
                                valinit=self.sun_angle, color='#fbbf24')
        self.slider_sun.on_changed(self.on_param_changed)
        
        # 观察角度滑块
        ax_view = plt.axes([0.15, 0.04, 0.35, 0.03])
        ax_view.set_facecolor('#1e293b')
        self.slider_view = Slider(ax_view, 'View Angle (°)', 0, 180,
                                 valinit=self.view_angle, color='#22d3ee')
        self.slider_view.on_changed(self.on_param_changed)
    
    def on_param_changed(self, val):
        self.sun_angle = self.slider_sun.val
        self.view_angle = self.slider_view.val
        self.update_plot()
    
    def calculate_sky_color(self, sun_elevation):
        """根据太阳高度计算天空颜色"""
        # 简化模型：低太阳高度角时，蓝光散射损失，红光增加
        path_length_factor = 1.0 / (np.sin(np.radians(sun_elevation + 5)) + 0.1)
        
        wavelengths = np.array([450, 550, 650])  # B, G, R
        intensities = np.array([1.0, 0.6, 0.3])  # 初始强度
        
        # 瑞利散射衰减
        scattered = intensities * rayleigh_intensity(wavelengths, 90)
        transmitted = intensities * np.exp(-path_length_factor * scattered / 10)
        
        # 归一化
        sky_color = scattered / np.max(scattered)
        sun_color = transmitted / np.max(transmitted)
        
        return sky_color, sun_color
    
    def update_plot(self):
        """更新所有图"""
        self.ax_sky.clear()
        self.ax_spectrum.clear()
        self.ax_polar.clear()
        
        for ax in [self.ax_sky, self.ax_spectrum]:
            ax.set_facecolor('#1e293b')
        self.ax_polar.set_facecolor('#1e293b')
        
        # 绘制天空场景
        self.draw_sky_scene()
        
        # 绘制光谱散射强度
        self.draw_spectrum()
        
        # 绘制极坐标散射图
        self.draw_polar_pattern()
        
        self.fig.canvas.draw_idle()
    
    def draw_sky_scene(self):
        """绘制天空场景"""
        self.ax_sky.set_xlim(0, 10)
        self.ax_sky.set_ylim(0, 8)
        self.ax_sky.axis('off')
        
        # 天空颜色（渐变）
        sky_color, sun_color = self.calculate_sky_color(self.sun_angle)
        
        # 背景天空（简化为单色）
        sky_rgb = tuple(sky_color)
        self.ax_sky.add_patch(plt.Rectangle((0, 3), 10, 5,
                                           facecolor=sky_rgb, alpha=0.3))
        
        # 地面
        self.ax_sky.add_patch(plt.Rectangle((0, 0), 10, 3,
                                           facecolor='#2d5016', alpha=0.5))
        
        # 太阳
        sun_rad = np.radians(self.sun_angle)
        sun_x = 2 + 6 * np.cos(sun_rad + np.pi/2)
        sun_y = 3 + 5 * np.sin(sun_rad + np.pi/2)
        
        sun_rgb = tuple(sun_color)
        sun_circle = Circle((sun_x, sun_y), 0.4, color=sun_rgb, alpha=0.9)
        self.ax_sky.add_patch(sun_circle)
        
        # 太阳光线
        for i in range(8):
            angle = i * 45
            ang_rad = np.radians(angle)
            dx = 0.7 * np.cos(ang_rad)
            dy = 0.7 * np.sin(ang_rad)
            self.ax_sky.plot([sun_x, sun_x + dx], [sun_y, sun_y + dy],
                            color=sun_rgb, linewidth=2, alpha=0.7)
        
        # 观察者
        obs_x, obs_y = 5, 3
        obs_circle = Circle((obs_x, obs_y), 0.2, color='white', alpha=0.8)
        self.ax_sky.add_patch(obs_circle)
        self.ax_sky.text(obs_x, obs_y - 0.5, 'Observer', ha='center',
                        color='white', fontsize=9)
        
        # 散射光路
        scatter_x = obs_x + 2 * np.cos(np.radians(self.view_angle))
        scatter_y = obs_y + 2 * np.sin(np.radians(self.view_angle))
        
        arrow = FancyArrowPatch((scatter_x, scatter_y), (obs_x, obs_y),
                               arrowstyle='->', mutation_scale=20,
                               linewidth=2, color='#22d3ee', alpha=0.7)
        self.ax_sky.add_patch(arrow)
        
        # 散射角度标注
        scattering_angle = abs(self.view_angle - self.sun_angle)
        self.ax_sky.text(5, 7, f'Scattering Angle: {scattering_angle:.0f}°',
                        ha='center', color='#22d3ee', fontsize=11,
                        fontweight='bold')
        
        # 偏振信息
        polarization = 100 * np.sin(np.radians(scattering_angle))**2
        self.ax_sky.text(5, 6.5, f'Polarization: {polarization:.0f}%',
                        ha='center', color='#f472b6', fontsize=10)
    
    def draw_spectrum(self):
        """绘制光谱散射强度"""
        wavelengths = np.linspace(380, 750, 100)
        intensities = rayleigh_intensity(wavelengths, self.view_angle)
        
        # 绘制光谱条
        for i, wl in enumerate(wavelengths[:-1]):
            color = wavelength_to_rgb(wl)
            intensity = intensities[i]
            self.ax_spectrum.bar(wl, intensity, width=4, color=color, alpha=0.8)
        
        # 标注关键波长
        blue_wl = 450
        red_wl = 650
        blue_int = rayleigh_intensity(blue_wl, self.view_angle)
        red_int = rayleigh_intensity(red_wl, self.view_angle)
        ratio = blue_int / red_int
        
        self.ax_spectrum.plot(blue_wl, blue_int, 'o', color='blue', markersize=10)
        self.ax_spectrum.plot(red_wl, red_int, 'o', color='red', markersize=10)
        
        self.ax_spectrum.set_xlabel('Wavelength (nm)', color='white')
        self.ax_spectrum.set_ylabel('Scattering Intensity', color='white')
        self.ax_spectrum.set_title(f'Blue/Red Ratio: {ratio:.2f}×', color='white', fontsize=10)
        self.ax_spectrum.tick_params(colors='white')
        self.ax_spectrum.grid(True, alpha=0.2, color='white')
        for spine in self.ax_spectrum.spines.values():
            spine.set_color('white')
    
    def draw_polar_pattern(self):
        """绘制极坐标散射图案"""
        theta = np.linspace(0, 2*np.pi, 100)
        
        # 瑞利散射角度分布：I ∝ 1 + cos²θ
        r = 1 + np.cos(theta)**2
        
        self.ax_polar.plot(theta, r, color='#22d3ee', linewidth=2.5)
        self.ax_polar.fill(theta, r, color='#22d3ee', alpha=0.2)
        
        # 标注90°散射（最大偏振）
        self.ax_polar.plot([np.pi/2, np.pi/2], [0, 1 + np.cos(np.pi/2)**2],
                          'r--', linewidth=2)
        self.ax_polar.plot([3*np.pi/2, 3*np.pi/2], [0, 1 + np.cos(3*np.pi/2)**2],
                          'r--', linewidth=2)
        
        self.ax_polar.set_title('Scattering Pattern\n(1 + cos²θ)', color='white',
                               fontsize=10, pad=20)
        self.ax_polar.grid(True, alpha=0.3, color='white')
        self.ax_polar.tick_params(colors='white')

if __name__ == '__main__':
    print("="*60)
    print("瑞利散射演示 - 为什么天空是蓝色？")
    print("Rayleigh Scattering - Why is the Sky Blue?")
    print("="*60)
    print("\n物理原理:")
    print("  I(θ, λ) ∝ (1 + cos²θ) / λ⁴")
    print("  蓝光散射强度 ≈ 红光的 5.6倍\n")
    
    demo = RayleighScatteringDemo()
