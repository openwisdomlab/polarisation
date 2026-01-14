% 波片原理演示 (Waveplate Demonstration)
% ==========================================
%
% 演示四分之一波片(λ/4)和二分之一波片(λ/2)如何改变光的偏振态。
%
% 物理原理:
% ---------
% λ/4波片: 相位延迟 π/2 (90°)
%   - 45°线偏振 → 圆偏振
%   - 0°/90°线偏振 → 保持不变
%   - 其他角度 → 椭圆偏振
%
% λ/2波片: 相位延迟 π (180°)
%   - 输出角度 = 2 × 快轴角度 - 输入角度
%
% 兼容性:
% -------
% MATLAB R2016b+ 或 GNU Octave 4.0+
% 无需额外工具箱
%
% 使用方法:
% ---------
% 在MATLAB或Octave中运行: waveplate
%
% 作者: PolarCraft Team
% 日期: 2026-01-14
% 许可: MIT License

function waveplate()
    % 主函数

    fprintf('========================================\n');
    fprintf('波片原理演示 (Waveplate Demonstration)\n');
    fprintf('========================================\n\n');
    fprintf('物理原理:\n');
    fprintf('  λ/4波片: 相位延迟 π/2 (90°)\n');
    fprintf('  λ/2波片: 相位延迟 π (180°)\n\n');
    fprintf('交互说明:\n');
    fprintf('  - 使用滑块调整输入角度和快轴角度\n');
    fprintf('  - 使用按钮切换波片类型\n');
    fprintf('  - 观察输出偏振态的变化\n\n');

    % 创建图形窗口
    fig = figure('Name', 'Waveplate Demo', ...
                 'NumberTitle', 'off', ...
                 'Position', [100, 100, 1200, 700], ...
                 'Color', [0.06, 0.09, 0.16]);

    % 初始参数
    params = struct();
    params.waveplate_type = 'quarter';  % 'quarter' or 'half'
    params.input_angle = 45;  % 度
    params.fast_axis_angle = 0;  % 度

    % 创建UI控件
    controls = create_controls(fig, params);

    % 初始绘制
    update_plot(fig, params, controls);
end

function controls = create_controls(fig, params)
    % 创建UI控件

    controls = struct();

    % 波片类型按钮 (λ/4)
    controls.btn_quarter = uicontrol('Parent', fig, ...
        'Style', 'pushbutton', ...
        'String', 'λ/4 Quarter', ...
        'Units', 'normalized', ...
        'Position', [0.05, 0.90, 0.10, 0.05], ...
        'BackgroundColor', [0.65, 0.55, 0.98], ...
        'ForegroundColor', [1, 1, 1], ...
        'FontSize', 10, ...
        'FontWeight', 'bold', ...
        'Callback', {@on_quarter_clicked, fig, params});

    % 波片类型按钮 (λ/2)
    controls.btn_half = uicontrol('Parent', fig, ...
        'Style', 'pushbutton', ...
        'String', 'λ/2 Half', ...
        'Units', 'normalized', ...
        'Position', [0.16, 0.90, 0.10, 0.05], ...
        'BackgroundColor', [0.3, 0.3, 0.3], ...
        'ForegroundColor', [0.7, 0.7, 0.7], ...
        'FontSize', 10, ...
        'Callback', {@on_half_clicked, fig, params});

    % 输入角度滑块
    controls.slider_input = uicontrol('Parent', fig, ...
        'Style', 'slider', ...
        'Min', 0, 'Max', 180, 'Value', params.input_angle, ...
        'SliderStep', [5/180, 15/180], ...
        'Units', 'normalized', ...
        'Position', [0.05, 0.12, 0.25, 0.03], ...
        'Callback', {@on_input_changed, fig, params});

    controls.label_input = uicontrol('Parent', fig, ...
        'Style', 'text', ...
        'String', sprintf('Input Angle: %.0f°', params.input_angle), ...
        'Units', 'normalized', ...
        'Position', [0.05, 0.15, 0.25, 0.03], ...
        'BackgroundColor', [0.06, 0.09, 0.16], ...
        'ForegroundColor', [1, 1, 1], ...
        'FontSize', 10);

    % 快轴角度滑块
    controls.slider_fast_axis = uicontrol('Parent', fig, ...
        'Style', 'slider', ...
        'Min', 0, 'Max', 180, 'Value', params.fast_axis_angle, ...
        'SliderStep', [5/180, 15/180], ...
        'Units', 'normalized', ...
        'Position', [0.05, 0.07, 0.25, 0.03], ...
        'Callback', {@on_fast_axis_changed, fig, params});

    controls.label_fast_axis = uicontrol('Parent', fig, ...
        'Style', 'text', ...
        'String', sprintf('Fast Axis: %.0f°', params.fast_axis_angle), ...
        'Units', 'normalized', ...
        'Position', [0.05, 0.10, 0.25, 0.03], ...
        'BackgroundColor', [0.06, 0.09, 0.16], ...
        'ForegroundColor', [1, 1, 1], ...
        'FontSize', 10);

    % 重置按钮
    controls.btn_reset = uicontrol('Parent', fig, ...
        'Style', 'pushbutton', ...
        'String', 'Reset', ...
        'Units', 'normalized', ...
        'Position', [0.05, 0.02, 0.10, 0.04], ...
        'BackgroundColor', [0.2, 0.25, 0.33], ...
        'ForegroundColor', [1, 1, 1], ...
        'Callback', {@on_reset, fig, params});
end

function on_quarter_clicked(~, ~, fig, params)
    params.waveplate_type = 'quarter';
    update_button_colors(fig);
    update_plot(fig, params, []);
end

function on_half_clicked(~, ~, fig, params)
    params.waveplate_type = 'half';
    update_button_colors(fig);
    update_plot(fig, params, []);
end

function on_input_changed(src, ~, fig, params)
    params.input_angle = get(src, 'Value');
    controls = get(fig, 'UserData');
    set(controls.label_input, 'String', sprintf('Input Angle: %.0f°', params.input_angle));
    update_plot(fig, params, controls);
end

function on_fast_axis_changed(src, ~, fig, params)
    params.fast_axis_angle = get(src, 'Value');
    controls = get(fig, 'UserData');
    set(controls.label_fast_axis, 'String', sprintf('Fast Axis: %.0f°', params.fast_axis_angle));
    update_plot(fig, params, controls);
end

function on_reset(~, ~, fig, params)
    params.input_angle = 45;
    params.fast_axis_angle = 0;
    controls = get(fig, 'UserData');
    set(controls.slider_input, 'Value', 45);
    set(controls.slider_fast_axis, 'Value', 0);
    set(controls.label_input, 'String', 'Input Angle: 45°');
    set(controls.label_fast_axis, 'String', 'Fast Axis: 0°');
    update_plot(fig, params, controls);
end

function update_button_colors(fig)
    % 更新按钮颜色
    controls = get(fig, 'UserData');
    params_data = getappdata(fig, 'params');

    if strcmp(params_data.waveplate_type, 'quarter')
        set(controls.btn_quarter, 'BackgroundColor', [0.65, 0.55, 0.98], 'ForegroundColor', [1,1,1]);
        set(controls.btn_half, 'BackgroundColor', [0.3, 0.3, 0.3], 'ForegroundColor', [0.7,0.7,0.7]);
    else
        set(controls.btn_quarter, 'BackgroundColor', [0.3, 0.3, 0.3], 'ForegroundColor', [0.7,0.7,0.7]);
        set(controls.btn_half, 'BackgroundColor', [0.96, 0.45, 0.71], 'ForegroundColor', [1,1,1]);
    end
end

function update_plot(fig, params, controls)
    % 更新所有图形

    % 保存参数
    setappdata(fig, 'params', params);
    if ~isempty(controls)
        set(fig, 'UserData', controls);
    else
        controls = get(fig, 'UserData');
    end

    % 物理计算
    input_rad = deg2rad(params.input_angle);
    fast_axis_rad = deg2rad(params.fast_axis_angle);

    % 输入Jones矢量
    input_jones = [cos(input_rad); sin(input_rad)];

    % 波片Jones矩阵
    if strcmp(params.waveplate_type, 'quarter')
        waveplate_matrix = jones_quarter_waveplate(fast_axis_rad);
        phase_shift = pi/2;
        waveplate_label = 'λ/4 波片';
        waveplate_color = [0.65, 0.55, 0.98];
    else
        waveplate_matrix = jones_half_waveplate(fast_axis_rad);
        phase_shift = pi;
        waveplate_label = 'λ/2 波片';
        waveplate_color = [0.96, 0.45, 0.71];
    end

    % 输出Jones矢量
    output_jones = waveplate_matrix * input_jones;

    % 分类偏振态
    [output_state, output_angle] = classify_polarization(output_jones);

    % 清除现有axes
    delete(findobj(fig, 'Type', 'axes'));

    % 创建主光路图 - 使用更大的区域
    ax_main = axes('Parent', fig, 'Position', [0.35, 0.35, 0.60, 0.55]);
    hold(ax_main, 'on');
    axis(ax_main, [0, 10, 0, 5]);
    axis(ax_main, 'off');
    set(ax_main, 'Color', [0.12, 0.16, 0.23]);

    % 绘制光路
    draw_optical_path(ax_main, params, waveplate_color, waveplate_label, ...
                     output_state, fast_axis_rad);

    % 创建相位延迟图
    ax_phase = axes('Parent', fig, 'Position', [0.35, 0.10, 0.60, 0.20]);
    draw_phase_diagram(ax_phase, phase_shift);

    % 绘制输入偏振态
    ax_input = axes('Parent', fig, 'Position', [0.05, 0.65, 0.20, 0.20]);
    draw_polarization_state(ax_input, input_jones, 'linear', params.input_angle, ...
                           [1, 0.67, 0]);
    title(ax_input, 'Input Polarization', 'Color', [1,1,1]);

    % 绘制输出偏振态
    ax_output = axes('Parent', fig, 'Position', [0.05, 0.40, 0.20, 0.20]);
    output_color = get_output_color(output_state);
    draw_polarization_state(ax_output, output_jones, output_state, output_angle, ...
                           output_color);
    title(ax_output, 'Output Polarization', 'Color', [1,1,1]);
end

function M = jones_quarter_waveplate(fast_axis_rad)
    % λ/4波片Jones矩阵
    % 快轴沿x的矩阵: [1, 0; 0, -i]
    M0 = [1, 0; 0, -1i];

    % 旋转矩阵
    c = cos(fast_axis_rad);
    s = sin(fast_axis_rad);
    R = [c, s; -s, c];
    R_inv = [c, -s; s, c];

    % 旋转后的矩阵
    M = R_inv * M0 * R;
end

function M = jones_half_waveplate(fast_axis_rad)
    % λ/2波片Jones矩阵
    % 快轴沿x的矩阵: [1, 0; 0, -1]
    M0 = [1, 0; 0, -1];

    % 旋转矩阵
    c = cos(fast_axis_rad);
    s = sin(fast_axis_rad);
    R = [c, s; -s, c];
    R_inv = [c, -s; s, c];

    % 旋转后的矩阵
    M = R_inv * M0 * R;
end

function [state_type, angle] = classify_polarization(jones_vector)
    % 判断偏振态类型

    Ex = jones_vector(1);
    Ey = jones_vector(2);

    % 归一化
    norm_val = sqrt(abs(Ex)^2 + abs(Ey)^2);
    if norm_val < 1e-10
        state_type = 'linear';
        angle = 0;
        return;
    end

    Ex = Ex / norm_val;
    Ey = Ey / norm_val;

    % 相位差
    phase_diff = angle(Ey) - angle(Ex);
    phase_diff = mod(phase_diff + pi, 2*pi) - pi;

    % 强度比
    I_ratio = abs(Ey) / (abs(Ex) + 1e-10);

    tolerance = 0.05;

    % 线偏振
    if abs(phase_diff) < tolerance || abs(abs(phase_diff) - pi) < tolerance
        angle_rad = atan2(real(Ey), real(Ex));
        angle = mod(rad2deg(angle_rad), 180);
        state_type = 'linear';
        return;
    end

    % 圆偏振
    if abs(I_ratio - 1) < tolerance
        if abs(abs(phase_diff) - pi/2) < tolerance
            if phase_diff > 0
                state_type = 'circular-r';
            else
                state_type = 'circular-l';
            end
            angle = 0;
            return;
        end
    end

    % 椭圆偏振
    state_type = 'elliptical';
    angle_rad = atan2(imag(Ex * conj(Ey)), real(Ex * conj(Ey))) / 2;
    angle = mod(rad2deg(angle_rad), 180);
end

function draw_optical_path(ax, params, waveplate_color, waveplate_label, ...
                          output_state, fast_axis_rad)
    % 绘制光路图

    % 光源
    rectangle(ax, 'Position', [0.5, 2, 0.6, 1], 'Curvature', 1, ...
             'FaceColor', [0.98, 0.75, 0.21], 'EdgeColor', 'none');
    text(ax, 0.8, 1.5, 'Source', 'Color', [0.58, 0.64, 0.69], ...
        'HorizontalAlignment', 'center', 'FontSize', 8);

    % 输入光束
    plot(ax, [1.3, 3], [2.5, 2.5], '-', 'Color', [1, 0.67, 0], 'LineWidth', 3);

    % 输入偏振指示
    draw_arrow(ax, 2.2, 2.5, deg2rad(params.input_angle), 0.4, [1, 0.67, 0]);

    % 波片
    rectangle(ax, 'Position', [4.6, 1.5, 0.8, 2], 'Curvature', 0.5, ...
             'FaceColor', [waveplate_color, 0.3], 'EdgeColor', waveplate_color, ...
             'LineWidth', 2);
    text(ax, 5, 1.0, waveplate_label, 'Color', waveplate_color, ...
        'HorizontalAlignment', 'center', 'FontSize', 9, 'FontWeight', 'bold');

    % 快轴（黄色）
    draw_arrow(ax, 5, 2.5, fast_axis_rad, 0.7, [0.98, 0.75, 0.21]);
    text(ax, 4.3, 3.7, 'Fast', 'Color', [0.98, 0.75, 0.21], 'FontSize', 7);

    % 慢轴（蓝色虚线）
    slow_rad = fast_axis_rad + pi/2;
    dx = 0.6 * cos(slow_rad);
    dy = 0.6 * sin(slow_rad);
    plot(ax, [5-dx, 5+dx], [2.5-dy, 2.5+dy], '--', ...
        'Color', [0.38, 0.65, 0.98], 'LineWidth', 2);
    text(ax, 5.7, 3.7, 'Slow', 'Color', [0.38, 0.65, 0.98], 'FontSize', 7);

    % 输出光束
    output_color = get_output_color(output_state);
    plot(ax, [5.8, 8.5], [2.5, 2.5], '-', 'Color', output_color, 'LineWidth', 3);

    % 观察屏
    rectangle(ax, 'Position', [8.7, 1.5, 0.2, 2], ...
             'FaceColor', [0.12, 0.16, 0.23], 'EdgeColor', [0.58, 0.64, 0.69], ...
             'LineWidth', 2);
    rectangle(ax, 'Position', [8.5, 2.2, 0.6, 0.6], 'Curvature', 1, ...
             'FaceColor', output_color, 'EdgeColor', 'none');
    text(ax, 9, 1.0, 'Screen', 'Color', [0.58, 0.64, 0.69], ...
        'HorizontalAlignment', 'center', 'FontSize', 8);
end

function draw_arrow(ax, x, y, angle_rad, length, color)
    % 绘制双向箭头
    dx = length * cos(angle_rad);
    dy = length * sin(angle_rad);

    % 主线
    plot(ax, [x-dx, x+dx], [y-dy, y+dy], '-', 'Color', color, 'LineWidth', 2.5);

    % 箭头
    arrow_len = 0.15;
    arrow_angle = pi/6;

    % 右箭头
    ax1 = angle_rad + pi - arrow_angle;
    ax2 = angle_rad + pi + arrow_angle;
    plot(ax, [x+dx, x+dx+arrow_len*cos(ax1)], ...
             [y+dy, y+dy+arrow_len*sin(ax1)], '-', 'Color', color, 'LineWidth', 2);
    plot(ax, [x+dx, x+dx+arrow_len*cos(ax2)], ...
             [y+dy, y+dy+arrow_len*sin(ax2)], '-', 'Color', color, 'LineWidth', 2);
end

function draw_polarization_state(ax, jones_vector, state_type, angle_val, color)
    % 绘制偏振态

    hold(ax, 'on');
    axis(ax, [-1.5, 1.5, -1.5, 1.5]);
    axis(ax, 'equal', 'off');
    set(ax, 'Color', [0.12, 0.16, 0.23]);

    if strcmp(state_type, 'linear')
        % 线偏振 - 双向箭头
        angle_rad = deg2rad(angle_val);
        dx = cos(angle_rad);
        dy = sin(angle_rad);
        plot(ax, [-dx, dx], [-dy, dy], '-', 'Color', color, 'LineWidth', 3);

        % 箭头
        arrow_len = 0.2;
        arrow_angle = pi/6;
        ax1 = angle_rad + pi - arrow_angle;
        ax2 = angle_rad + pi + arrow_angle;
        plot(ax, [dx, dx+arrow_len*cos(ax1)], [dy, dy+arrow_len*sin(ax1)], ...
             '-', 'Color', color, 'LineWidth', 2);
        plot(ax, [dx, dx+arrow_len*cos(ax2)], [dy, dy+arrow_len*sin(ax2)], ...
             '-', 'Color', color, 'LineWidth', 2);

        text(ax, 0, -1.3, sprintf('Linear\n%.0f°', angle_val), ...
            'Color', color, 'HorizontalAlignment', 'center', 'FontSize', 9);

    elseif strcmp(state_type, 'circular-r') || strcmp(state_type, 'circular-l')
        % 圆偏振
        theta = linspace(0, 2*pi, 100);
        plot(ax, cos(theta), sin(theta), '-', 'Color', color, 'LineWidth', 2.5);

        % 旋转箭头
        if strcmp(state_type, 'circular-r')
            text(ax, 0, 0, '↻', 'Color', color, 'FontSize', 40, ...
                'HorizontalAlignment', 'center');
            text(ax, 0, -1.3, 'Right\nCircular', 'Color', color, ...
                'HorizontalAlignment', 'center', 'FontSize', 9);
        else
            text(ax, 0, 0, '↺', 'Color', color, 'FontSize', 40, ...
                'HorizontalAlignment', 'center');
            text(ax, 0, -1.3, 'Left\nCircular', 'Color', color, ...
                'HorizontalAlignment', 'center', 'FontSize', 9);
        end

    else
        % 椭圆偏振
        Ex = abs(jones_vector(1));
        Ey = abs(jones_vector(2));

        a = max(Ex, Ey);
        b = min(Ex, Ey);

        % 椭圆
        theta = linspace(0, 2*pi, 100);
        xe = a * cos(theta);
        ye = b * sin(theta);

        % 旋转
        angle_rad = deg2rad(angle_val);
        c = cos(angle_rad);
        s = sin(angle_rad);
        xr = xe * c - ye * s;
        yr = xe * s + ye * c;

        plot(ax, xr, yr, '-', 'Color', color, 'LineWidth', 2.5);

        text(ax, 0, -1.3, sprintf('Elliptical\n%.0f°', angle_val), ...
            'Color', color, 'HorizontalAlignment', 'center', 'FontSize', 9);
    end
end

function draw_phase_diagram(ax, phase_shift)
    % 绘制相位延迟图

    x = linspace(0, 10, 500);
    wavelength = 2.0;

    % 快轴
    y_fast = sin(2 * pi * x / wavelength);
    plot(ax, x, y_fast, '-', 'Color', [0.98, 0.75, 0.21], 'LineWidth', 2.5);
    hold(ax, 'on');

    % 慢轴
    y_slow = sin(2 * pi * x / wavelength + phase_shift);
    plot(ax, x, y_slow, '--', 'Color', [0.38, 0.65, 0.98], 'LineWidth', 2.5);

    % 设置
    set(ax, 'Color', [0.12, 0.16, 0.23]);
    set(ax, 'XColor', [1, 1, 1], 'YColor', [1, 1, 1]);
    grid(ax, 'on');
    xlim(ax, [0, 10]);
    ylim(ax, [-2, 2]);

    if abs(phase_shift - pi/2) < 0.01
        phase_text = 'Δφ = π/2 (λ/4)';
    else
        phase_text = 'Δφ = π (λ/2)';
    end

    legend(ax, {'Fast Axis', ['Slow Axis ', phase_text]}, ...
          'TextColor', [1, 1, 1], 'Color', [0.12, 0.16, 0.23], ...
          'EdgeColor', [1, 1, 1], 'Location', 'northeast');
end

function color = get_output_color(state_type)
    % 获取输出颜色

    if strcmp(state_type, 'linear')
        color = [0.27, 1, 0.27];  % 绿色
    elseif strcmp(state_type, 'circular-r') || strcmp(state_type, 'circular-l')
        color = [0.13, 0.83, 0.93];  % 青色
    else
        color = [0.65, 0.55, 0.98];  % 紫色
    end
end
