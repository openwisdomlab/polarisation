%% Fresnel Equations Interactive Demonstration
%  菲涅尔方程交互演示
%
%  PHYSICAL PRINCIPLE 物理原理:
%  ════════════════════════════════════════════════════════════════
%  Fresnel equations describe reflection and transmission at interfaces:
%  菲涅尔方程描述光在界面的反射和透射：
%
%  s-polarization (⊥ plane): s偏振（垂直入射面）
%      r_s = (n₁cosθ₁ - n₂cosθ₂) / (n₁cosθ₁ + n₂cosθ₂)
%      t_s = 2n₁cosθ₁ / (n₁cosθ₁ + n₂cosθ₂)
%
%  p-polarization (∥ plane): p偏振（平行入射面）
%      r_p = (n₂cosθ₁ - n₁cosθ₂) / (n₂cosθ₁ + n₁cosθ₂)
%      t_p = 2n₁cosθ₁ / (n₂cosθ₁ + n₁cosθ₂)
%
%  KEY PHENOMENA 关键现象:
%  ──────────────────────
%  - Brewster's Angle θ_B = atan(n₂/n₁): r_p = 0 (no p-reflection!)
%    布儒斯特角：p偏振光完全透射
%  - Total Internal Reflection: θ > θ_c = asin(n₂/n₁) when n₁ > n₂
%    全内反射：当n₁ > n₂且θ > θ_c时发生
%  - Energy Conservation: R + T = 1 (always!)
%    能量守恒：反射率 + 透射率 = 1
%
%  MATLAB/OCTAVE COMPATIBILITY 兼容性:
%  ────────────────────────────────────
%  Works in MATLAB R2016b+ and GNU Octave 4.0+
%  兼容MATLAB R2016b+和GNU Octave 4.0+
%
%  USAGE 使用方法:
%  ──────────────
%  Run: fresnel
%  Adjust sliders for angle and n₂.
%  运行: fresnel
%  调整滑块改变角度和n₂。

%% Clear and initialize
clear; close all; clc;

% ============================================================================
% PHYSICAL CONSTANTS
% 物理常数
% ============================================================================

N1 = 1.0;           % Air refractive index 空气折射率
N2_GLASS = 1.5;     % Glass 玻璃
N2_WATER = 1.333;   % Water 水
N2_DIAMOND = 2.417; % Diamond 钻石

% ============================================================================
% CREATE INTERACTIVE FIGURE
% 创建交互式图形
% ============================================================================

fig = figure('Name', 'Fresnel Equations Interactive Demo 菲涅尔方程交互演示', ...
             'NumberTitle', 'off', ...
             'Color', [0.04 0.04 0.06], ...
             'Position', [50, 50, 1500, 800]);

% Layout: [Ray diagram | Angle curves]
%         [Sliders (full width)      ]

% Ray diagram axes (光线图轴)
ax_diagram = subplot(2, 2, 1);
set(ax_diagram, 'Color', [0.06 0.08 0.10], 'XColor', 'w', 'YColor', 'w');
axis equal; axis([-3 3 -2 2]); axis off;
title('Interface and Rays 界面与光线', 'Color', 'w', 'FontSize', 14, 'FontWeight', 'bold');
hold on;

% Angle curves axes (角度曲线轴)
ax_curves = subplot(2, 2, 2);
set(ax_curves, 'Color', [0.06 0.08 0.10], 'XColor', 'w', 'YColor', 'w');
title('Fresnel Coefficients vs Angle 菲涅尔系数随角度变化', ...
      'Color', 'w', 'FontSize', 14, 'FontWeight', 'bold');
xlabel('Incident Angle θ₁ (degrees)', 'Color', 'w', 'FontSize', 11);
ylabel('Percentage (%)', 'Color', 'w', 'FontSize', 11);
grid on; grid minor;
set(gca, 'GridColor', 'w', 'GridAlpha', 0.2, 'MinorGridAlpha', 0.1);
xlim([0 90]); ylim([0 105]);
hold on;

%% Interactive controls
%  交互控件

% Slider for incident angle (入射角度滑块)
slider_angle = uicontrol('Style', 'slider', ...
                        'Min', 0, 'Max', 89, 'Value', 30, ...
                        'Units', 'normalized', ...
                        'Position', [0.1 0.42 0.35 0.03], ...
                        'BackgroundColor', [0.2 0.4 0.6], ...
                        'Callback', @(src, event) update_plot());

label_angle = uicontrol('Style', 'text', ...
                       'String', 'Incident Angle θ₁ = 30.0°', ...
                       'Units', 'normalized', ...
                       'Position', [0.1 0.45 0.35 0.02], ...
                       'BackgroundColor', [0.04 0.04 0.06], ...
                       'ForegroundColor', [0.4 0.8 1], ...
                       'FontSize', 11, 'FontWeight', 'bold');

% Slider for n2 (第二介质折射率滑块)
slider_n2 = uicontrol('Style', 'slider', ...
                     'Min', 1.0, 'Max', 2.5, 'Value', N2_GLASS, ...
                     'Units', 'normalized', ...
                     'Position', [0.55 0.42 0.35 0.03], ...
                     'BackgroundColor', [0.6 0.4 0.2], ...
                     'Callback', @(src, event) update_plot());

label_n2 = uicontrol('Style', 'text', ...
                    'String', sprintf('n₂ (Medium 2) = %.3f', N2_GLASS), ...
                    'Units', 'normalized', ...
                    'Position', [0.55 0.45 0.35 0.02], ...
                    'BackgroundColor', [0.04 0.04 0.06], ...
                    'ForegroundColor', [1 0.65 0.4], ...
                    'FontSize', 11, 'FontWeight', 'bold');

% Checkboxes for polarization (偏振切换复选框)
checkbox_s = uicontrol('Style', 'checkbox', ...
                      'String', 's-polarization (⊥)', ...
                      'Value', 1, ...
                      'Units', 'normalized', ...
                      'Position', [0.02 0.35 0.15 0.03], ...
                      'BackgroundColor', [0.04 0.04 0.06], ...
                      'ForegroundColor', 'w', ...
                      'FontSize', 10, ...
                      'Callback', @(src, event) update_plot());

checkbox_p = uicontrol('Style', 'checkbox', ...
                      'String', 'p-polarization (∥)', ...
                      'Value', 1, ...
                      'Units', 'normalized', ...
                      'Position', [0.02 0.30 0.15 0.03], ...
                      'BackgroundColor', [0.04 0.04 0.06], ...
                      'ForegroundColor', 'w', ...
                      'FontSize', 10, ...
                      'Callback', @(src, event) update_plot());

% Store handles in figure (存储句柄到figure)
setappdata(fig, 'Controls', struct( ...
    'slider_angle', slider_angle, 'label_angle', label_angle, ...
    'slider_n2', slider_n2, 'label_n2', label_n2, ...
    'checkbox_s', checkbox_s, 'checkbox_p', checkbox_p, ...
    'ax_diagram', ax_diagram, 'ax_curves', ax_curves));

% Initial plot
update_plot();

% Instructions
annotation('textbox', [0.1 0.97 0.8 0.02], ...
           'String', 'Adjust sliders | Toggle polarization | Observe Brewster angle (R_p=0) and total internal reflection', ...
           'HorizontalAlignment', 'center', ...
           'Color', [0.4 0.8 1], 'FontSize', 10, 'FontStyle', 'italic', ...
           'EdgeColor', 'none');


%% ============================================================================
%  MAIN UPDATE FUNCTION
%  主更新函数
%  ============================================================================

function update_plot()
    %UPDATE_PLOT Refresh all plots when controls change
    %   更新所有绘图当控件改变时

    fig = gcbf;
    controls = getappdata(fig, 'Controls');

    % Get current values
    theta1 = controls.slider_angle.Value;
    n2 = controls.slider_n2.Value;
    show_s = controls.checkbox_s.Value;
    show_p = controls.checkbox_p.Value;

    % Update labels
    set(controls.label_angle, 'String', sprintf('Incident Angle θ₁ = %.1f°', theta1));
    set(controls.label_n2, 'String', sprintf('n₂ (Medium 2) = %.3f', n2));

    % ========================================================================
    % CALCULATE FRESNEL COEFFICIENTS
    % 计算菲涅尔系数
    % ========================================================================

    n1 = 1.0;  % Air
    fresnel = calculate_fresnel(theta1, n1, n2);

    % ========================================================================
    % UPDATE RAY DIAGRAM
    % 更新光线图
    % ========================================================================

    axes(controls.ax_diagram); cla; hold on;
    axis equal; axis([-3 3 -2 2]); axis off;

    % Draw interface (绘制界面)
    plot([-3 3], [0 0], 'w-', 'LineWidth', 3);

    % Shade regions (阴影区域)
    fill([-3 3 3 -3], [0 0 2 2], 'c', 'FaceAlpha', 0.1, 'EdgeColor', 'none');
    fill([-3 3 3 -3], [0 0 -2 -2], [1 0.65 0], 'FaceAlpha', 0.1, 'EdgeColor', 'none');

    % Medium labels
    text(-2.5, 1.5, sprintf('Medium 1\nn₁ = %.3f', n1), ...
         'Color', 'c', 'FontSize', 11, 'FontWeight', 'bold', ...
         'BackgroundColor', 'k');
    text(-2.5, -1.5, sprintf('Medium 2\nn₂ = %.3f', n2), ...
         'Color', [1 0.65 0], 'FontSize', 11, 'FontWeight', 'bold', ...
         'BackgroundColor', 'k');

    % Ray length
    ray_len = 1.5;
    theta1_rad = deg2rad(theta1);

    % Incident ray (入射光线)
    inc_x = -ray_len * sin(theta1_rad);
    inc_y = ray_len * cos(theta1_rad);
    draw_arrow([inc_x, inc_y], [0, 0], 'y', 2.5);
    text(inc_x - 0.3, inc_y, sprintf('Incident\nθ₁=%.1f°', theta1), ...
         'Color', 'y', 'FontSize', 9, 'HorizontalAlignment', 'right');

    % Reflected rays (反射光线)
    ref_x = ray_len * sin(theta1_rad);
    ref_y = ray_len * cos(theta1_rad);

    if show_s && fresnel.Rs > 0.01
        draw_arrow([0, 0], [ref_x, ref_y], 'r', 2 + 3*sqrt(fresnel.Rs));
        text(ref_x + 0.3, ref_y, sprintf('s-pol\nR=%.1f%%', fresnel.Rs*100), ...
             'Color', 'r', 'FontSize', 9);
    end

    if show_p && fresnel.Rp > 0.01
        draw_arrow([0, 0], [ref_x*0.9, ref_y*0.9], 'm', 2 + 3*sqrt(fresnel.Rp));
        text(ref_x*0.9 + 0.5, ref_y*0.9 + 0.3, sprintf('p-pol\nR=%.1f%%', fresnel.Rp*100), ...
             'Color', 'm', 'FontSize', 9);
    end

    % Refracted ray or total internal reflection (折射光线或全内反射)
    if ~fresnel.tir
        theta2_rad = deg2rad(fresnel.theta2);
        refr_x = ray_len * sin(theta2_rad);
        refr_y = -ray_len * cos(theta2_rad);

        if show_s
            draw_arrow([0, 0], [refr_x, refr_y], 'g', 2 + 3*sqrt(fresnel.Ts));
            text(refr_x + 0.3, refr_y - 0.2, sprintf('s-pol\nT=%.1f%%', fresnel.Ts*100), ...
                 'Color', 'g', 'FontSize', 9);
        end

        if show_p
            draw_arrow([0, 0], [refr_x*0.9, refr_y*0.9], 'c', 2 + 3*sqrt(fresnel.Tp));
            text(refr_x*0.9 + 0.5, refr_y*0.9 - 0.3, sprintf('p-pol\nT=%.1f%%', fresnel.Tp*100), ...
                 'Color', 'c', 'FontSize', 9);
        end

        text(0.5, -1, sprintf('Refracted\nθ₂=%.1f°', fresnel.theta2), ...
             'Color', 'g', 'FontSize', 9);
    else
        text(0, -1, 'Total Internal Reflection!', ...
             'Color', 'r', 'FontSize', 12, 'FontWeight', 'bold', ...
             'HorizontalAlignment', 'center', 'BackgroundColor', 'y');
    end

    % Normal line (法线)
    plot([0 0], [-2 2], 'w--', 'LineWidth', 1, 'Color', [1 1 1 0.4]);

    % ========================================================================
    % UPDATE ANGLE CURVES
    % 更新角度曲线
    % ========================================================================

    axes(controls.ax_curves); cla; hold on;

    % Calculate curves for all angles (计算所有角度的曲线)
    angles = linspace(0, 89.5, 200);
    Rs_curve = zeros(size(angles));
    Rp_curve = zeros(size(angles));
    Ts_curve = zeros(size(angles));
    Tp_curve = zeros(size(angles));

    for i = 1:length(angles)
        f = calculate_fresnel(angles(i), n1, n2);
        Rs_curve(i) = f.Rs * 100;
        Rp_curve(i) = f.Rp * 100;
        Ts_curve(i) = f.Ts * 100;
        Tp_curve(i) = f.Tp * 100;
    end

    % Plot curves
    if show_s
        plot(angles, Rs_curve, 'r-', 'LineWidth', 2.5, 'DisplayName', 'Reflectance R_s');
        plot(angles, Ts_curve, 'g-', 'LineWidth', 2.5, 'DisplayName', 'Transmittance T_s');
    end

    if show_p
        plot(angles, Rp_curve, 'm--', 'LineWidth', 2.5, 'DisplayName', 'Reflectance R_p');
        plot(angles, Tp_curve, 'c--', 'LineWidth', 2.5, 'DisplayName', 'Transmittance T_p');
    end

    % Mark current angle
    if show_s
        plot(theta1, fresnel.Rs*100, 'ro', 'MarkerSize', 10, ...
             'MarkerFaceColor', 'r', 'MarkerEdgeColor', 'w', 'LineWidth', 2);
        plot(theta1, fresnel.Ts*100, 'go', 'MarkerSize', 10, ...
             'MarkerFaceColor', 'g', 'MarkerEdgeColor', 'w', 'LineWidth', 2);
    end

    if show_p
        plot(theta1, fresnel.Rp*100, 'mo', 'MarkerSize', 10, ...
             'MarkerFaceColor', 'm', 'MarkerEdgeColor', 'w', 'LineWidth', 2);
        plot(theta1, fresnel.Tp*100, 'co', 'MarkerSize', 10, ...
             'MarkerFaceColor', 'c', 'MarkerEdgeColor', 'w', 'LineWidth', 2);
    end

    % Mark Brewster's angle (标记布儒斯特角)
    theta_b = atand(n2 / n1);
    xline(theta_b, ':', 'Color', [1 0.65 0], 'LineWidth', 2, ...
          'Label', sprintf('Brewster θ_B=%.1f°', theta_b), ...
          'LabelHorizontalAlignment', 'left', 'FontSize', 9);

    % Mark critical angle if exists (标记临界角)
    if n1 > n2
        theta_c = asind(n2 / n1);
        xline(theta_c, ':', 'Color', 'r', 'LineWidth', 2, ...
              'Label', sprintf('Critical θ_c=%.1f°', theta_c), ...
              'LabelHorizontalAlignment', 'left', 'FontSize', 9);
    end

    % Formatting
    set(gca, 'Color', [0.06 0.08 0.10], 'XColor', 'w', 'YColor', 'w');
    grid on; grid minor;
    set(gca, 'GridColor', 'w', 'GridAlpha', 0.2, 'MinorGridAlpha', 0.1);
    xlim([0 90]); ylim([0 105]);
    xlabel('Incident Angle θ₁ (degrees)', 'Color', 'w', 'FontSize', 11);
    ylabel('Percentage (%)', 'Color', 'w', 'FontSize', 11);
    title('Fresnel Coefficients vs Angle 菲涅尔系数随角度变化', ...
          'Color', 'w', 'FontSize', 14, 'FontWeight', 'bold');
    legend('Location', 'northwest', 'TextColor', 'w', 'FontSize', 9, ...
           'Color', [0.1 0.1 0.15], 'EdgeColor', 'w');
end


%% ============================================================================
%  HELPER FUNCTIONS
%  辅助函数
%  ============================================================================

function fresnel = calculate_fresnel(theta1, n1, n2)
    %CALCULATE_FRESNEL Compute Fresnel coefficients
    %   计算菲涅尔系数
    %
    %   Implements Fresnel equations for s and p polarizations.
    %   实现s偏振和p偏振的菲涅尔方程。

    theta1_rad = deg2rad(theta1);
    cos_theta1 = cos(theta1_rad);
    sin_theta1 = sin(theta1_rad);

    % Snell's law (斯涅尔定律)
    sin_theta2 = (n1 / n2) * sin_theta1;

    % Check for total internal reflection (检查全内反射)
    if sin_theta2 > 1.0
        fresnel = struct('rs', 1, 'rp', 1, 'ts', 0, 'tp', 0, ...
                        'theta2', 90, 'Rs', 1, 'Rp', 1, ...
                        'Ts', 0, 'Tp', 0, 'tir', true);
        return;
    end

    cos_theta2 = sqrt(1 - sin_theta2^2);
    theta2 = asind(sin_theta2);

    % Fresnel equations (菲涅尔方程)
    rs = (n1*cos_theta1 - n2*cos_theta2) / (n1*cos_theta1 + n2*cos_theta2);
    ts = (2*n1*cos_theta1) / (n1*cos_theta1 + n2*cos_theta2);

    rp = (n2*cos_theta1 - n1*cos_theta2) / (n2*cos_theta1 + n1*cos_theta2);
    tp = (2*n1*cos_theta1) / (n2*cos_theta1 + n1*cos_theta2);

    % Intensity coefficients (强度系数)
    Rs = rs^2;
    Rp = rp^2;

    angle_factor = (n2 * cos_theta2) / (n1 * cos_theta1);
    Ts = angle_factor * ts^2;
    Tp = angle_factor * tp^2;

    fresnel = struct('rs', rs, 'rp', rp, 'ts', ts, 'tp', tp, ...
                    'theta2', theta2, 'Rs', Rs, 'Rp', Rp, ...
                    'Ts', Ts, 'Tp', Tp, 'tir', false);
end


function draw_arrow(start_pos, end_pos, color, width)
    %DRAW_ARROW Draw an arrow for light ray
    %   绘制代表光线的箭头

    dx = end_pos(1) - start_pos(1);
    dy = end_pos(2) - start_pos(2);

    quiver(start_pos(1), start_pos(2), dx, dy, 0, ...
           'Color', color, 'LineWidth', width, ...
           'MaxHeadSize', 0.3, 'AutoScale', 'off');
end


%% ============================================================================
%  EDUCATIONAL NOTES
%  教学说明
%  ============================================================================
%
%  KEY CONCEPTS 关键概念:
%  ═══════════════════
%
%  1. BREWSTER'S ANGLE 布儒斯特角:
%     θ_B = atan(n₂/n₁)
%     At this angle: R_p = 0 (perfect transmission for p-polarization!)
%     在此角度：p偏振光完全透射！
%
%     Application: Polarizing sunglasses reduce glare from water/roads
%     应用：偏振太阳镜减少水面/路面眩光
%
%  2. TOTAL INTERNAL REFLECTION 全内反射:
%     Occurs when n₁ > n₂ and θ₁ > θ_c = asin(n₂/n₁)
%     当 n₁ > n₂ 且 θ₁ > θ_c 时发生
%
%     Application: Optical fibers, prisms, diamonds
%     应用：光纤、棱镜、钻石
%
%  3. ENERGY CONSERVATION 能量守恒:
%     R + T = 1 (always verified in Fresnel equations!)
%     反射率 + 透射率 = 1（菲涅尔方程恒满足！）
%
%  FURTHER READING 进一步阅读:
%  ═══════════════════════
%  - Hecht, "Optics" Chapter 4: Reflection and Transmission
%  - Born & Wolf, "Principles of Optics" Chapter 1.5
