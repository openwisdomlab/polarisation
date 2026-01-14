function rayleigh_scattering()
% 瑞利散射演示 - 为什么天空是蓝色？(Rayleigh Scattering - Why is the Sky Blue?)
% ============================================================================
%
% 演示瑞利散射如何产生蓝天和日落的颜色，以及散射光的偏振特性。
%
% 物理原理:
% ---------
% 瑞利散射强度公式:
%     I(θ, λ) ∝ (1 + cos²θ) / λ⁴
%
%     θ: 散射角度
%     λ: 光波波长
%
% 关键结论:
%     1. 散射强度 ∝ 1/λ⁴（短波长散射更强）
%     2. 蓝光（450nm）散射强度 ≈ 红光（650nm）的 5.6倍
%     3. 90°散射光为完全线偏振
%     4. 日落时光程长，蓝光散射殆尽，红光穿透
%
% 应用:
%     - 大气光学现象解释
%     - 偏振天光导航
%     - 天文观测时间选择
%     - 摄影偏振滤镜使用
%
% 兼容性: MATLAB R2016b+, GNU Octave 4.0+
% 依赖: 无需额外工具箱
% 运行: octave --no-gui rayleigh_scattering.m 或在MATLAB中直接运行
%
% 作者: PolarCraft Team
% 日期: 2026-01-14

    fprintf('==========================================================\n');
    fprintf('瑞利散射演示 - 为什么天空是蓝色？\n');
    fprintf('Rayleigh Scattering - Why is the Sky Blue?\n');
    fprintf('==========================================================\n');
    fprintf('\n物理原理:\n');
    fprintf('  I(θ, λ) ∝ (1 + cos²θ) / λ⁴\n');
    fprintf('  蓝光散射强度 ≈ 红光的 5.6倍\n\n');

    % 参数
    params = struct();
    params.sun_angle = 30;   % 太阳高度角（0=地平线，90=天顶）
    params.view_angle = 90;  % 观察角度

    % 创建图形窗口
    fig = figure('Name', '瑞利散射演示 - Rayleigh Scattering', ...
                 'Position', [100, 100, 1200, 800], ...
                 'Color', [0.06, 0.09, 0.16], ...
                 'NumberTitle', 'off');

    % 创建控件
    controls = create_controls(fig, params);

    % 初始绘图
    update_plot(fig, params, controls);
end

function controls = create_controls(fig, params)
    % 创建交互控件

    % 太阳高度角滑块
    uicontrol('Parent', fig, 'Style', 'text', ...
              'String', sprintf('Sun Elevation (°): %.0f', params.sun_angle), ...
              'Position', [50, 100, 350, 25], ...
              'BackgroundColor', [0.12, 0.16, 0.23], ...
              'ForegroundColor', [0.98, 0.75, 0.14], ...
              'FontSize', 10, 'FontWeight', 'bold', ...
              'HorizontalAlignment', 'left', ...
              'Tag', 'sun_label');

    uicontrol('Parent', fig, 'Style', 'slider', ...
              'Min', 0, 'Max', 90, 'Value', params.sun_angle, ...
              'Position', [50, 80, 350, 20], ...
              'BackgroundColor', [0.12, 0.16, 0.23], ...
              'Callback', {@on_slider_changed, fig, params, 'sun'}, ...
              'Tag', 'sun_slider');

    % 观察角度滑块
    uicontrol('Parent', fig, 'Style', 'text', ...
              'String', sprintf('View Angle (°): %.0f', params.view_angle), ...
              'Position', [50, 50, 350, 25], ...
              'BackgroundColor', [0.12, 0.16, 0.23], ...
              'ForegroundColor', [0.13, 0.83, 0.93], ...
              'FontSize', 10, 'FontWeight', 'bold', ...
              'HorizontalAlignment', 'left', ...
              'Tag', 'view_label');

    uicontrol('Parent', fig, 'Style', 'slider', ...
              'Min', 0, 'Max', 180, 'Value', params.view_angle, ...
              'Position', [50, 30, 350, 20], ...
              'BackgroundColor', [0.12, 0.16, 0.23], ...
              'Callback', {@on_slider_changed, fig, params, 'view'}, ...
              'Tag', 'view_slider');

    controls = struct();
end

function on_slider_changed(src, ~, fig, params, slider_type)
    % 滑块回调
    value = get(src, 'Value');

    if strcmp(slider_type, 'sun')
        params.sun_angle = value;
        label = findobj(fig, 'Tag', 'sun_label');
        set(label, 'String', sprintf('Sun Elevation (°): %.0f', value));
    elseif strcmp(slider_type, 'view')
        params.view_angle = value;
        label = findobj(fig, 'Tag', 'view_label');
        set(label, 'String', sprintf('View Angle (°): %.0f', value));
    end

    update_plot(fig, params, []);
end

function intensity = rayleigh_intensity(wavelength, theta_deg)
    % 计算瑞利散射强度
    % I ∝ (1 + cos²θ) / λ⁴
    theta_rad = deg2rad(theta_deg);
    angular_factor = (1 + cos(theta_rad).^2);
    wavelength_factor = (450 ./ wavelength) .^ 4;  % 归一化到450nm
    intensity = angular_factor .* wavelength_factor;
end

function rgb = wavelength_to_rgb(wavelength)
    % 波长转RGB颜色
    wavelength = max(380, min(750, wavelength));

    if wavelength >= 380 && wavelength < 440
        R = -(wavelength - 440) / (440 - 380);
        G = 0.0;
        B = 1.0;
    elseif wavelength >= 440 && wavelength < 490
        R = 0.0;
        G = (wavelength - 440) / (490 - 440);
        B = 1.0;
    elseif wavelength >= 490 && wavelength < 510
        R = 0.0;
        G = 1.0;
        B = -(wavelength - 510) / (510 - 490);
    elseif wavelength >= 510 && wavelength < 580
        R = (wavelength - 510) / (580 - 510);
        G = 1.0;
        B = 0.0;
    elseif wavelength >= 580 && wavelength < 645
        R = 1.0;
        G = -(wavelength - 645) / (645 - 580);
        B = 0.0;
    else  % 645 <= wavelength <= 750
        R = 1.0;
        G = 0.0;
        B = 0.0;
    end

    % 亮度因子
    if wavelength >= 380 && wavelength < 420
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    elseif wavelength >= 420 && wavelength < 700
        factor = 1.0;
    else  % 700 <= wavelength <= 750
        factor = 0.3 + 0.7 * (750 - wavelength) / (750 - 700);
    end

    rgb = [R * factor, G * factor, B * factor];
end

function [sky_color, sun_color] = calculate_sky_color(sun_elevation)
    % 根据太阳高度计算天空颜色
    path_length_factor = 1.0 / (sin(deg2rad(sun_elevation + 5)) + 0.1);

    wavelengths = [450, 550, 650];  % B, G, R
    intensities = [1.0, 0.6, 0.3];  % 初始强度

    % 瑞利散射衰减
    scattered = intensities .* rayleigh_intensity(wavelengths, 90);
    transmitted = intensities .* exp(-path_length_factor * scattered / 10);

    % 归一化
    sky_color = scattered / max(scattered);
    sun_color = transmitted / max(transmitted);
end

function update_plot(fig, params, ~)
    % 更新所有图形

    % 清除旧图形
    delete(findall(fig, 'Type', 'axes'));

    % 创建天空场景
    ax_sky = axes('Parent', fig, 'Position', [0.05, 0.35, 0.6, 0.55], ...
                  'Color', [0.12, 0.16, 0.23], 'XColor', 'none', 'YColor', 'none');
    hold(ax_sky, 'on');
    xlim(ax_sky, [0, 10]);
    ylim(ax_sky, [0, 8]);
    axis(ax_sky, 'equal');

    draw_sky_scene(ax_sky, params);

    % 创建光谱图
    ax_spectrum = axes('Parent', fig, 'Position', [0.7, 0.55, 0.25, 0.3], ...
                       'Color', [0.12, 0.16, 0.23], ...
                       'XColor', [1, 1, 1], 'YColor', [1, 1, 1]);
    hold(ax_spectrum, 'on');

    draw_spectrum(ax_spectrum, params);

    % 创建极坐标散射图
    ax_polar = axes('Parent', fig, 'Position', [0.7, 0.15, 0.25, 0.35]);
    hold(ax_polar, 'on');

    draw_polar_pattern(ax_polar);
end

function draw_sky_scene(ax, params)
    % 绘制天空场景

    % 天空颜色
    [sky_color, sun_color] = calculate_sky_color(params.sun_angle);

    % 背景天空
    rectangle('Position', [0, 3, 10, 5], ...
              'FaceColor', [sky_color, 0.3], ...
              'EdgeColor', 'none', 'Parent', ax);

    % 地面
    rectangle('Position', [0, 0, 10, 3], ...
              'FaceColor', [0.18, 0.31, 0.09], ...
              'EdgeColor', 'none', 'Parent', ax);

    % 太阳
    sun_rad = deg2rad(params.sun_angle);
    sun_x = 2 + 6 * cos(sun_rad + pi/2);
    sun_y = 3 + 5 * sin(sun_rad + pi/2);

    rectangle('Position', [sun_x - 0.4, sun_y - 0.4, 0.8, 0.8], ...
              'Curvature', [1, 1], 'FaceColor', sun_color, ...
              'EdgeColor', 'none', 'Parent', ax);

    % 太阳光线
    for i = 1:8
        angle = (i - 1) * 45;
        ang_rad = deg2rad(angle);
        dx = 0.7 * cos(ang_rad);
        dy = 0.7 * sin(ang_rad);
        plot([sun_x, sun_x + dx], [sun_y, sun_y + dy], '-', ...
             'Color', sun_color, 'LineWidth', 2, 'Parent', ax);
    end

    % 观察者
    obs_x = 5;
    obs_y = 3;
    rectangle('Position', [obs_x - 0.2, obs_y - 0.2, 0.4, 0.4], ...
              'Curvature', [1, 1], 'FaceColor', [1, 1, 1], ...
              'EdgeColor', 'none', 'Parent', ax);
    text(obs_x, obs_y - 0.5, 'Observer', 'HorizontalAlignment', 'center', ...
         'Color', [1, 1, 1], 'FontSize', 9, 'Parent', ax);

    % 散射光路
    scatter_x = obs_x + 2 * cos(deg2rad(params.view_angle));
    scatter_y = obs_y + 2 * sin(deg2rad(params.view_angle));

    % 箭头（使用线条模拟）
    plot([scatter_x, obs_x], [scatter_y, obs_y], '->', ...
         'Color', [0.13, 0.83, 0.93], 'LineWidth', 2, 'Parent', ax);

    % 散射角度标注
    scattering_angle = abs(params.view_angle - params.sun_angle);
    text(5, 7, sprintf('Scattering Angle: %.0f°', scattering_angle), ...
         'HorizontalAlignment', 'center', 'Color', [0.13, 0.83, 0.93], ...
         'FontSize', 11, 'FontWeight', 'bold', 'Parent', ax);

    % 偏振信息
    polarization = 100 * sin(deg2rad(scattering_angle))^2;
    text(5, 6.5, sprintf('Polarization: %.0f%%', polarization), ...
         'HorizontalAlignment', 'center', 'Color', [0.96, 0.45, 0.71], ...
         'FontSize', 10, 'Parent', ax);
end

function draw_spectrum(ax, params)
    % 绘制光谱散射强度

    wavelengths = linspace(380, 750, 100);
    intensities = rayleigh_intensity(wavelengths, params.view_angle);

    % 绘制光谱条
    for i = 1:(length(wavelengths) - 1)
        wl = wavelengths(i);
        color = wavelength_to_rgb(wl);
        intensity = intensities(i);
        bar(ax, wl, intensity, 4, 'FaceColor', color, ...
            'EdgeColor', 'none', 'FaceAlpha', 0.8);
    end

    % 标注关键波长
    blue_wl = 450;
    red_wl = 650;
    blue_int = rayleigh_intensity(blue_wl, params.view_angle);
    red_int = rayleigh_intensity(red_wl, params.view_angle);
    ratio = blue_int / red_int;

    plot(ax, blue_wl, blue_int, 'o', 'MarkerSize', 10, ...
         'MarkerFaceColor', 'blue', 'MarkerEdgeColor', 'blue');
    plot(ax, red_wl, red_int, 'o', 'MarkerSize', 10, ...
         'MarkerFaceColor', 'red', 'MarkerEdgeColor', 'red');

    xlabel(ax, 'Wavelength (nm)', 'Color', [1, 1, 1]);
    ylabel(ax, 'Scattering Intensity', 'Color', [1, 1, 1]);
    title(ax, sprintf('Blue/Red Ratio: %.2f×', ratio), ...
          'Color', [1, 1, 1], 'FontSize', 10);
    grid(ax, 'on');
    set(ax, 'GridColor', [1, 1, 1], 'GridAlpha', 0.2);
end

function draw_polar_pattern(ax)
    % 绘制极坐标散射图案

    theta = linspace(0, 2*pi, 100);
    r = 1 + cos(theta).^2;  % Rayleigh散射角度分布

    % 转换为极坐标
    polarplot(ax, theta, r, 'Color', [0.13, 0.83, 0.93], 'LineWidth', 2.5);
    hold(ax, 'on');

    % 标注90°散射
    polarplot(ax, [pi/2, pi/2], [0, 1 + cos(pi/2)^2], 'r--', 'LineWidth', 2);
    polarplot(ax, [3*pi/2, 3*pi/2], [0, 1 + cos(3*pi/2)^2], 'r--', 'LineWidth', 2);

    title(ax, 'Scattering Pattern (1 + cos²θ)', ...
          'Color', [1, 1, 1], 'FontSize', 10);
    set(ax, 'Color', [0.12, 0.16, 0.23]);
    ax.ThetaColor = [1, 1, 1];
    ax.RColor = [1, 1, 1];
    grid(ax, 'on');
    set(ax, 'GridColor', [1, 1, 1], 'GridAlpha', 0.3);
end
