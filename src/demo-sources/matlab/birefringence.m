%% Birefringence (Double Refraction) Interactive Demonstration
%  双折射效应交互演示
%
%  PHYSICAL PRINCIPLE 物理原理:
%  ════════════════════════════════════════════════════════════════
%  Birefringent materials (e.g., calcite) split light into two rays:
%  双折射材料（如方解石）将光分成两束：
%
%      o-ray (ordinary):      I_o = I₀ × cos²(θ)  寻常光
%      e-ray (extraordinary): I_e = I₀ × sin²(θ)  非常光
%
%  Energy Conservation: I_o + I_e = I₀
%  能量守恒：I_o + I_e = I₀
%
%  MATLAB/OCTAVE COMPATIBILITY 兼容性:
%  ────────────────────────────────────
%  This script works in both MATLAB and GNU Octave (free alternative).
%  本脚本兼容MATLAB和GNU Octave（免费替代品）。
%
%  DEPENDENCIES 依赖:
%  ─────────────
%  - MATLAB R2016b or later, OR GNU Octave 4.0+
%  - No toolboxes required 无需额外工具箱
%
%  USAGE 使用方法:
%  ──────────────
%  Simply run this script:  birefringence
%  Drag the slider to change polarization angle.
%  直接运行此脚本：birefringence
%  拖动滑块改变偏振角度。

%% Clear workspace and prepare figure
clear; close all; clc;

% ============================================================================
% PHYSICAL CONSTANTS AND PARAMETERS
% 物理常数和参数
% ============================================================================

I0 = 100;               % Initial light intensity 初始光强
WAVELENGTH = 550;       % Light wavelength (nm) 光波长（纳米）
N_O = 1.658;            % Ordinary ray refractive index (calcite) 方解石寻常光折射率
N_E = 1.486;            % Extraordinary ray refractive index (calcite) 方解石非常光折射率
DELTA_N = N_O - N_E;    % Birefringence 双折射率差 (0.172)

% ============================================================================
% CREATE INTERACTIVE FIGURE
% 创建交互式图形
% ============================================================================

fig = figure('Name', 'Birefringence Interactive Demo 双折射交互演示', ...
             'NumberTitle', 'off', ...
             'Color', [0.04 0.04 0.06], ...
             'Position', [100, 100, 1400, 700]);

% Layout: [Main diagram | Intensity bar]
%         [Angle curve (full width)     ]
%         [Slider      (full width)     ]

% Main diagram axes (主图轴)
ax_main = subplot(2, 2, 1);
set(ax_main, 'Color', [0.06 0.08 0.10], 'XColor', 'w', 'YColor', 'w');
axis equal; axis([-6 10 -4 4]); axis off;
title('Birefringence in Calcite | 方解石双折射', ...
      'Color', 'w', 'FontSize', 14, 'FontWeight', 'bold');

% Intensity bar chart axes (强度柱状图轴)
ax_intensity = subplot(2, 2, 2);
set(ax_intensity, 'Color', [0.06 0.08 0.10], 'XColor', 'w', 'YColor', 'w');
title('Ray Intensities 光强对比', 'Color', 'w', 'FontSize', 12, 'FontWeight', 'bold');
xlabel('Intensity (arb. units)', 'Color', 'w', 'FontSize', 10);

% Intensity vs angle curve (强度-角度曲线)
ax_phase = subplot(2, 2, [3 4]);
set(ax_phase, 'Color', [0.06 0.08 0.10], 'XColor', 'w', 'YColor', 'w');
title('Malus''s Law in Birefringence 双折射中的马吕斯定律', ...
      'Color', 'w', 'FontSize', 12, 'FontWeight', 'bold');
xlabel('Polarization Angle θ (degrees)', 'Color', 'w', 'FontSize', 10);
ylabel('Intensity', 'Color', 'w', 'FontSize', 10);
grid on; grid minor;
set(ax_phase, 'GridColor', 'w', 'GridAlpha', 0.2, 'MinorGridAlpha', 0.1);
xlim([0 90]); ylim([0 I0*1.1]);
hold on;

%% Create interactive slider for polarization angle
%  创建偏振角度交互滑块

% Slider control (滑块控件)
slider_pos = [0.1 0.02 0.8 0.03];
slider = uicontrol('Style', 'slider', ...
                   'Min', 0, 'Max', 90, 'Value', 30, ...
                   'Units', 'normalized', ...
                   'Position', slider_pos, ...
                   'BackgroundColor', [0.2 0.3 0.4], ...
                   'Callback', @(src, event) update_plot(src, ax_main, ax_intensity, ax_phase));

% Slider label (滑块标签)
slider_label = uicontrol('Style', 'text', ...
                        'String', sprintf('Polarization Angle θ = %d°', round(slider.Value)), ...
                        'Units', 'normalized', ...
                        'Position', [0.4 0.06 0.2 0.02], ...
                        'BackgroundColor', [0.04 0.04 0.06], ...
                        'ForegroundColor', [0.4 0.8 1], ...
                        'FontSize', 11, 'FontWeight', 'bold');

% Store slider label handle for updates (存储滑块标签句柄以便更新)
setappdata(fig, 'SliderLabel', slider_label);

% Initial plot
update_plot(slider, ax_main, ax_intensity, ax_phase);

% Add instructions (添加使用说明)
annotation('textbox', [0.1 0.96 0.8 0.03], ...
           'String', 'Drag slider to change polarization angle | 拖动滑块改变偏振角度', ...
           'HorizontalAlignment', 'center', ...
           'Color', [0.4 0.8 1], 'FontSize', 10, 'FontStyle', 'italic', ...
           'EdgeColor', 'none');


%% ============================================================================
%  MAIN UPDATE FUNCTION
%  主更新函数
%  ============================================================================
function update_plot(slider, ax_main, ax_intensity, ax_phase)
    %UPDATE_PLOT Refresh all plots when slider value changes
    %   更新所有绘图当滑块值改变时
    %
    %   This function is automatically called each time the user moves the slider.
    %   用户每次移动滑块时自动调用此函数。

    % Get current angle from slider
    theta = round(slider.Value);

    % Update slider label
    fig = ancestor(slider, 'figure');
    slider_label = getappdata(fig, 'SliderLabel');
    set(slider_label, 'String', sprintf('Polarization Angle θ = %d°', theta));

    % Physical constants (物理常数)
    I0 = 100;

    % ========================================================================
    % CALCULATE PHYSICS 计算物理量
    % ========================================================================
    %
    % Malus's Law Application 马吕斯定律应用:
    % ─────────────────────────────────────
    % When linearly polarized light enters birefringent crystal:
    % 当线偏振光进入双折射晶体时：
    %
    %   E⃗_incident = E₀[cos(θ)x̂ + sin(θ)ŷ]
    %
    % The crystal decomposes this into:
    % 晶体将其分解为：
    %   - o-ray: E⃗_o = E₀cos(θ)x̂  →  I_o = I₀cos²(θ)
    %   - e-ray: E⃗_e = E₀sin(θ)ŷ  →  I_e = I₀sin²(θ)

    theta_rad = deg2rad(theta);
    I_o = I0 * (cos(theta_rad))^2;  % Ordinary ray intensity 寻常光强度
    I_e = I0 * (sin(theta_rad))^2;  % Extraordinary ray intensity 非常光强度

    % Verify energy conservation (验证能量守恒)
    assert(abs(I_o + I_e - I0) < 1e-10, 'Energy not conserved!');

    % ========================================================================
    % UPDATE MAIN DIAGRAM 更新主图
    % ========================================================================
    axes(ax_main); cla; hold on;
    axis equal; axis([-6 10 -4 4]); axis off;

    % Light source (光源)
    viscircles([-5 0], 0.3, 'Color', 'y', 'LineWidth', 2);
    fill([-5.3 -4.7 -4.7 -5.3], [-0.3 -0.3 0.3 0.3], 'y', 'FaceAlpha', 0.5);
    text(-5, -1, 'Light Source', 'Color', 'y', ...
         'HorizontalAlignment', 'center', 'FontSize', 9);

    % Incident ray (入射光线)
    draw_arrow(ax_main, -4.5, 0, -1.5, 0, I0, [1 0.65 0], 2.5);

    % Show incident polarization angle (显示入射偏振角度)
    pol_len = 0.8;
    pol_x = pol_len * cos(theta_rad);
    pol_y = pol_len * sin(theta_rad);
    quiver(-3, 0, pol_x, pol_y, 0, 'Color', [1 0.65 0], ...
           'LineWidth', 2, 'MaxHeadSize', 1.5, 'AutoScale', 'off');
    text(-3, -1.2, sprintf('θ = %d°', theta), ...
         'Color', [1 0.65 0], 'HorizontalAlignment', 'center', 'FontSize', 10);

    % Calcite crystal (方解石晶体)
    draw_calcite_crystal(ax_main, 0, 0);

    % o-ray (寻常光) - red, horizontal
    if I_o > 0.5
        draw_arrow(ax_main, 1.5, 0.5, 5, 0.5, I_o, [1 0 0], 2);
        text(6.5, 0.5, sprintf('o-ray (0°)\nI = %.1f', I_o), ...
             'Color', 'r', 'HorizontalAlignment', 'center', ...
             'FontSize', 10, 'FontWeight', 'bold');
    end

    % e-ray (非常光) - green, offset
    if I_e > 0.5
        draw_arrow(ax_main, 1.5, -0.5, 5, -0.5, I_e, [0 1 0], 2);
        text(6.5, -0.5, sprintf('e-ray (90°)\nI = %.1f', I_e), ...
             'Color', 'g', 'HorizontalAlignment', 'center', ...
             'FontSize', 10, 'FontWeight', 'bold');
    end

    % Detection screen (探测屏)
    fill([7 7.2 7.2 7], [-2 -2 2 2], [0.5 0.5 0.5], ...
         'EdgeColor', 'w', 'LineWidth', 2);
    text(7.5, -2.5, 'Screen', 'Color', 'w', 'FontSize', 9);

    % ========================================================================
    % UPDATE INTENSITY BAR CHART 更新强度柱状图
    % ========================================================================
    axes(ax_intensity); cla; hold on;

    % Horizontal bar chart (水平柱状图)
    barh(2, I_o, 'FaceColor', 'r', 'EdgeColor', 'w', 'FaceAlpha', 0.7);
    barh(1, I_e, 'FaceColor', 'g', 'EdgeColor', 'w', 'FaceAlpha', 0.7);

    % Value labels (数值标签)
    text(I_o + 2, 2, sprintf('%.1f', I_o), ...
         'Color', 'r', 'FontSize', 10, 'FontWeight', 'bold');
    text(I_e + 2, 1, sprintf('%.1f', I_e), ...
         'Color', 'g', 'FontSize', 10, 'FontWeight', 'bold');

    set(gca, 'YTick', [1 2], 'YTickLabel', {'e-ray', 'o-ray'}, ...
        'XLim', [0 I0*1.1], 'Color', [0.06 0.08 0.10], ...
        'XColor', 'w', 'YColor', 'w');
    xlabel('Intensity (arb. units)', 'Color', 'w', 'FontSize', 10);
    title('Ray Intensities 光强对比', 'Color', 'w', 'FontSize', 12, 'FontWeight', 'bold');

    % ========================================================================
    % UPDATE INTENSITY CURVE 更新强度曲线
    % ========================================================================
    axes(ax_phase); cla; hold on;

    % Calculate curves (计算曲线)
    angles = 0:0.5:90;
    I_o_curve = I0 * (cosd(angles)).^2;
    I_e_curve = I0 * (sind(angles)).^2;

    % Plot curves (绘制曲线)
    plot(angles, I_o_curve, 'r-', 'LineWidth', 2.5, 'DisplayName', 'o-ray: I₀cos²θ');
    plot(angles, I_e_curve, 'g-', 'LineWidth', 2.5, 'DisplayName', 'e-ray: I₀sin²θ');
    plot(angles, I_o_curve + I_e_curve, 'w--', 'LineWidth', 1.5, ...
         'DisplayName', 'Sum (conservation)');

    % Mark current point (标记当前点)
    plot(theta, I_o, 'ro', 'MarkerSize', 12, 'MarkerFaceColor', 'r', ...
         'MarkerEdgeColor', 'w', 'LineWidth', 2);
    plot(theta, I_e, 'go', 'MarkerSize', 12, 'MarkerFaceColor', 'g', ...
         'MarkerEdgeColor', 'w', 'LineWidth', 2);

    % Vertical line at current angle (当前角度的垂直线)
    xline(theta, 'c:', 'LineWidth', 1.5, 'Alpha', 0.5);

    % Formatting
    set(gca, 'Color', [0.06 0.08 0.10], 'XColor', 'w', 'YColor', 'w');
    grid on; grid minor;
    set(gca, 'GridColor', 'w', 'GridAlpha', 0.2, 'MinorGridAlpha', 0.1);
    xlim([0 90]); ylim([0 I0*1.1]);
    xlabel('Polarization Angle θ (degrees)', 'Color', 'w', 'FontSize', 10);
    ylabel('Intensity', 'Color', 'w', 'FontSize', 10);
    title('Malus''s Law in Birefringence 双折射中的马吕斯定律', ...
          'Color', 'w', 'FontSize', 12, 'FontWeight', 'bold');
    legend('Location', 'northeast', 'TextColor', 'w', 'FontSize', 9, ...
           'Color', [0.1 0.1 0.15], 'EdgeColor', 'w');
end


%% ============================================================================
%  HELPER FUNCTIONS
%  辅助函数
%  ============================================================================

function draw_arrow(ax, x1, y1, x2, y2, intensity, color, width)
    %DRAW_ARROW Draw an arrow representing a light ray
    %   绘制代表光线的箭头
    %
    %   Visual encoding 视觉编码:
    %   - Thickness ∝ √intensity (perceptual scaling)
    %     厚度 ∝ √强度（感知缩放）
    %   - Alpha transparency shows intensity
    %     透明度显示强度

    axes(ax);

    % Calculate arrow properties (计算箭头属性)
    thickness = width * sqrt(intensity / 100);
    alpha = 0.4 + 0.5 * (intensity / 100);

    % Draw arrow (绘制箭头)
    annotation('arrow', ...
               [x1/16+0.375 x2/16+0.375], ...  % Normalize to figure coordinates
               [y1/8+0.5 y2/8+0.5], ...
               'Color', color, 'LineWidth', thickness, ...
               'HeadLength', 10, 'HeadWidth', 10);
end


function draw_calcite_crystal(ax, x_center, y_center)
    %DRAW_CALCITE_CRYSTAL Draw schematic of calcite crystal with optic axis
    %   绘制方解石晶体示意图及光轴
    %
    %   Visual elements 视觉元素:
    %   - Cyan translucent rectangle: crystal body 青色半透明矩形：晶体主体
    %   - Yellow dashed line: optic axis 黄色虚线：光轴

    axes(ax);

    % Crystal body (晶体主体)
    width = 2.5; height = 2.0;
    x_rect = [x_center - width/2, x_center + width/2, ...
              x_center + width/2, x_center - width/2];
    y_rect = [y_center - height/2, y_center - height/2, ...
              y_center + height/2, y_center + height/2];

    fill(x_rect, y_rect, 'c', 'FaceAlpha', 0.3, ...
         'EdgeColor', 'c', 'LineWidth', 2);

    % Optic axis (光轴) - diagonal dashed line
    axis_len = 1.5;
    angle_rad = pi/4;  % 45° diagonal
    dx = axis_len * cos(angle_rad);
    dy = axis_len * sin(angle_rad);

    plot([x_center - dx, x_center + dx], ...
         [y_center - dy, y_center + dy], ...
         'y--', 'LineWidth', 2);

    % Label
    text(x_center, y_center - height/2 - 0.5, ...
         sprintf('Calcite\nCrystal'), ...
         'Color', 'c', 'HorizontalAlignment', 'center', ...
         'FontSize', 10, 'FontWeight', 'bold');
end


%% ============================================================================
%  EDUCATIONAL NOTES
%  教学说明
%  ============================================================================
%
%  KEY PHYSICS CONCEPTS 关键物理概念:
%  ═══════════════════════════════════
%
%  1. BIREFRINGENCE 双折射:
%     ─────────────────────
%     Calcite has two different refractive indices:
%     方解石具有两个不同的折射率：
%       - n_o = 1.658 (ordinary ray) 寻常光
%       - n_e = 1.486 (extraordinary ray) 非常光
%       - Δn = 0.172 (birefringence) 双折射率差
%
%  2. INTENSITY SPLITTING 强度分配:
%     ────────────────────────────
%     Follows Malus's Law (same as polarizers):
%     遵循马吕斯定律（与偏振片相同）：
%       I_o = I₀ × cos²(θ)  [o-ray perpendicular to optic axis]
%       I_e = I₀ × sin²(θ)  [e-ray parallel to optic axis]
%
%  3. ENERGY CONSERVATION 能量守恒:
%     ──────────────────────────
%     Total energy is preserved:
%     总能量守恒：
%       I_o + I_e = I₀ × (cos²θ + sin²θ) = I₀
%     This is a fundamental principle in physics!
%     这是物理学的基本原理！
%
%  4. SPECIAL ANGLES 特殊角度:
%     ────────────────────
%     θ = 0°:  All o-ray (I_o=100%, I_e=0%)
%     θ = 45°: Equal split (I_o=I_e=50%)
%     θ = 90°: All e-ray (I_o=0%, I_e=100%)
%
%  APPLICATIONS 应用:
%  ════════════════
%  - Wave plates (quarter-wave λ/4, half-wave λ/2) 波片
%  - Optical isolators (prevent back-reflection) 光隔离器
%  - Stress analysis (photoelasticity) 应力分析
%  - LCD displays (liquid crystal birefringence) 液晶显示
%  - Polarization microscopy 偏振显微镜
%
%  FURTHER READING 进一步阅读:
%  ═══════════════════════
%  - Hecht, "Optics" Chapter 8: Polarization
%  - Born & Wolf, "Principles of Optics" Chapter 14
%  - Pedrotti et al., "Introduction to Optics" Chapter 15
