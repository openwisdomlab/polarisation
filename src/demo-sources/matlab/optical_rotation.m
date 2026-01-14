function optical_rotation()
% 旋光性演示 - 糖溶液旋光 (Optical Rotation - Sugar Solution)
% ==========================================================
%
% 演示手性分子（如糖）对线偏振光偏振方向的旋转。
%
% 物理原理:
% ---------
% 旋光公式：
%     α = [α]_λ^T × l × c
%
%     α: 旋光角度（度）
%     [α]_λ^T: 比旋光度（物质特性，度·mL/(g·dm)）
%     l: 样品长度（dm）
%     c: 浓度（g/mL）
%
% 常见物质比旋光度（589nm, 20°C）:
%     - 蔗糖（sucrose）: +66.5°
%     - 果糖（fructose）: -92.4°
%     - 葡萄糖（glucose）: +52.7°
%     - 乳糖（lactose）: +52.3°
%
% 应用：
%     - 糖含量测定（制糖工业）
%     - 药物手性分析
%     - 分子结构鉴定
%     - 浓度测量
%
% 兼容性: MATLAB R2016b+, GNU Octave 4.0+
% 依赖: 无需额外工具箱
% 运行: octave --no-gui optical_rotation.m 或在MATLAB中直接运行
%
% 作者: PolarCraft Team
% 日期: 2026-01-14

    fprintf('==========================================================\n');
    fprintf('旋光性演示 - 糖溶液旋光\n');
    fprintf('Optical Rotation - Sugar Solution\n');
    fprintf('==========================================================\n');
    fprintf('\n物理原理:\n');
    fprintf('  α = [α]λT × l × c\n');
    fprintf('  手性分子使偏振面旋转\n\n');

    % 物质数据
    substances = struct();
    substances(1).name = 'Sucrose (蔗糖)';
    substances(1).key = 'sucrose';
    substances(1).specific_rotation = 66.5;
    substances(1).color = [0.13, 0.83, 0.93];  % cyan

    substances(2).name = 'Fructose (果糖)';
    substances(2).key = 'fructose';
    substances(2).specific_rotation = -92.4;
    substances(2).color = [0.96, 0.45, 0.71];  % pink

    substances(3).name = 'Glucose (葡萄糖)';
    substances(3).key = 'glucose';
    substances(3).specific_rotation = 52.7;
    substances(3).color = [0.66, 0.55, 0.98];  % purple

    substances(4).name = 'Lactose (乳糖)';
    substances(4).key = 'lactose';
    substances(4).specific_rotation = 52.3;
    substances(4).color = [0.06, 0.73, 0.51];  % green

    % 参数
    params = struct();
    params.substances = substances;
    params.current_substance = 1;  % 蔗糖
    params.concentration = 0.1;    % g/mL
    params.length = 2.0;           % dm
    params.input_angle = 0;        % 输入偏振角度

    % 创建图形窗口
    fig = figure('Name', '旋光性演示 - Optical Rotation', ...
                 'Position', [100, 100, 1200, 700], ...
                 'Color', [0.06, 0.09, 0.16], ...
                 'NumberTitle', 'off');

    % 创建控件
    controls = create_controls(fig, params);

    % 初始绘图
    update_plot(fig, params, controls);
end

function controls = create_controls(fig, params)
    % 创建交互控件

    % 浓度滑块
    uicontrol('Parent', fig, 'Style', 'text', ...
              'String', 'Concentration (g/mL): 0.100', ...
              'Position', [50, 100, 300, 25], ...
              'BackgroundColor', [0.12, 0.16, 0.23], ...
              'ForegroundColor', [0.13, 0.83, 0.93], ...
              'FontSize', 10, 'FontWeight', 'bold', ...
              'HorizontalAlignment', 'left', ...
              'Tag', 'conc_label');

    uicontrol('Parent', fig, 'Style', 'slider', ...
              'Min', 0.01, 'Max', 0.5, 'Value', params.concentration, ...
              'Position', [50, 80, 300, 20], ...
              'BackgroundColor', [0.12, 0.16, 0.23], ...
              'Callback', {@on_slider_changed, fig, params, 'concentration'}, ...
              'Tag', 'conc_slider');

    % 长度滑块
    uicontrol('Parent', fig, 'Style', 'text', ...
              'String', 'Length (dm): 2.0', ...
              'Position', [50, 50, 300, 25], ...
              'BackgroundColor', [0.12, 0.16, 0.23], ...
              'ForegroundColor', [0.66, 0.55, 0.98], ...
              'FontSize', 10, 'FontWeight', 'bold', ...
              'HorizontalAlignment', 'left', ...
              'Tag', 'len_label');

    uicontrol('Parent', fig, 'Style', 'slider', ...
              'Min', 0.5, 'Max', 5.0, 'Value', params.length, ...
              'Position', [50, 30, 300, 20], ...
              'BackgroundColor', [0.12, 0.16, 0.23], ...
              'Callback', {@on_slider_changed, fig, params, 'length'}, ...
              'Tag', 'len_slider');

    % 物质选择按钮
    button_y = 620;
    for i = 1:length(params.substances)
        uicontrol('Parent', fig, 'Style', 'pushbutton', ...
                  'String', params.substances(i).name, ...
                  'Position', [800, button_y - (i-1)*40, 350, 30], ...
                  'BackgroundColor', params.substances(i).color * 0.3, ...
                  'ForegroundColor', [1, 1, 1], ...
                  'FontSize', 9, 'FontWeight', 'bold', ...
                  'Callback', {@on_substance_changed, fig, params, i}, ...
                  'Tag', sprintf('substance_btn_%d', i));
    end

    controls = struct();
end

function on_slider_changed(src, ~, fig, params, param_name)
    % 滑块回调
    value = get(src, 'Value');

    if strcmp(param_name, 'concentration')
        params.concentration = value;
        label = findobj(fig, 'Tag', 'conc_label');
        set(label, 'String', sprintf('Concentration (g/mL): %.3f', value));
    elseif strcmp(param_name, 'length')
        params.length = value;
        label = findobj(fig, 'Tag', 'len_label');
        set(label, 'String', sprintf('Length (dm): %.1f', value));
    end

    update_plot(fig, params, []);
end

function on_substance_changed(~, ~, fig, params, index)
    % 物质选择回调
    params.current_substance = index;
    update_plot(fig, params, []);
end

function update_plot(fig, params, ~)
    % 更新所有图形

    % 计算旋光角
    substance = params.substances(params.current_substance);
    rotation_angle = substance.specific_rotation * params.length * params.concentration;
    output_angle = mod(params.input_angle + rotation_angle, 180);

    % 清除旧图形
    delete(findall(fig, 'Type', 'axes'));

    % 创建主图（光路）
    ax_main = axes('Parent', fig, 'Position', [0.05, 0.35, 0.6, 0.5], ...
                   'Color', [0.12, 0.16, 0.23], 'XColor', 'none', 'YColor', 'none');
    hold(ax_main, 'on');
    xlim(ax_main, [-1, 11]);
    ylim(ax_main, [-2, 3]);
    axis(ax_main, 'equal');

    draw_optical_path(ax_main, params, substance, rotation_angle, output_angle);

    % 创建曲线图（旋光角-浓度）
    ax_curve = axes('Parent', fig, 'Position', [0.7, 0.55, 0.25, 0.3], ...
                    'Color', [0.12, 0.16, 0.23], ...
                    'XColor', [1, 1, 1], 'YColor', [1, 1, 1]);
    hold(ax_curve, 'on');

    draw_rotation_curve(ax_curve, params, substance, rotation_angle);

    % 创建信息面板
    ax_info = axes('Parent', fig, 'Position', [0.7, 0.15, 0.25, 0.35], ...
                   'Color', [0.12, 0.16, 0.23], 'XColor', 'none', 'YColor', 'none');

    draw_info_panel(ax_info, params, substance, rotation_angle, output_angle);
end

function draw_optical_path(ax, params, substance, rotation_angle, output_angle)
    % 绘制光路图

    % 光源
    rectangle('Position', [0.2, 0.2, 0.6, 0.6], ...
              'Curvature', [1, 1], 'FaceColor', [0.98, 0.75, 0.14], ...
              'EdgeColor', 'none', 'Parent', ax);
    text(0.5, -0.3, 'Light', 'HorizontalAlignment', 'center', ...
         'Color', [0.58, 0.64, 0.72], 'FontSize', 8, 'Parent', ax);
    text(0.5, -0.6, 'Source', 'HorizontalAlignment', 'center', ...
         'Color', [0.58, 0.64, 0.72], 'FontSize', 8, 'Parent', ax);

    % 偏振片
    rectangle('Position', [1.5, -0.5, 0.3, 2], ...
              'FaceColor', [0.38, 0.65, 0.98]*0.3, ...
              'EdgeColor', [0.38, 0.65, 0.98], 'LineWidth', 2, 'Parent', ax);
    text(1.65, -1.0, 'Polarizer', 'HorizontalAlignment', 'center', ...
         'Color', [0.38, 0.65, 0.98], 'FontSize', 9, 'Parent', ax);

    % 输入偏振方向
    draw_polarization(ax, 2.5, 0.5, params.input_angle, [1, 0.67, 0], 'Input', 0);

    % 糖溶液样品管
    tube_x = 5;
    tube_w = 3 * params.length / 5;
    rectangle('Position', [tube_x - tube_w/2, -1, tube_w, 3], ...
              'FaceColor', [substance.color, 0.2], ...
              'EdgeColor', [1, 1, 1], 'LineWidth', 2, 'Parent', ax);
    text(tube_x, -1.5, substance.name, 'HorizontalAlignment', 'center', ...
         'Color', substance.color, 'FontSize', 10, 'FontWeight', 'bold', 'Parent', ax);
    text(tube_x, 1.8, sprintf('c=%.2f g/mL\nl=%.1f dm', params.concentration, params.length), ...
         'HorizontalAlignment', 'center', 'Color', [1, 1, 1], 'FontSize', 8, 'Parent', ax);

    % 光束
    plot([2, tube_x - tube_w/2], [0.5, 0.5], '-', ...
         'Color', [1, 0.67, 0], 'LineWidth', 3, 'Parent', ax);
    plot([tube_x + tube_w/2, 9], [0.5, 0.5], '-', ...
         'Color', [0.27, 1, 0.27], 'LineWidth', 3, 'Parent', ax);

    % 输出偏振方向
    draw_polarization(ax, 9.5, 0.5, output_angle, [0.27, 1, 0.27], 'Output', output_angle);

    % 旋转角度标注
    if abs(rotation_angle) > 1
        text(tube_x, 1.3, sprintf('α = %+.1f°', rotation_angle), ...
             'HorizontalAlignment', 'center', 'Color', [0.06, 0.73, 0.51], ...
             'FontSize', 11, 'FontWeight', 'bold', 'Parent', ax);
    end
end

function draw_polarization(ax, x, y, angle, color, label, value)
    % 绘制偏振方向指示
    angle_rad = deg2rad(angle);
    dx = 0.5 * cos(angle_rad);
    dy = 0.5 * sin(angle_rad);

    % 双向箭头
    plot([x - dx, x + dx], [y - dy, y + dy], '-', ...
         'Color', color, 'LineWidth', 3, 'Parent', ax);
    plot(x - dx, y - dy, '<', 'MarkerSize', 8, ...
         'MarkerFaceColor', color, 'MarkerEdgeColor', color, 'Parent', ax);
    plot(x + dx, y + dy, '>', 'MarkerSize', 8, ...
         'MarkerFaceColor', color, 'MarkerEdgeColor', color, 'Parent', ax);

    text(x, y - 0.9, sprintf('%s\n%.0f°', label, value), ...
         'HorizontalAlignment', 'center', 'Color', color, ...
         'FontSize', 9, 'Parent', ax);
end

function draw_rotation_curve(ax, params, substance, rotation_angle)
    % 绘制旋光角度-浓度曲线

    concentrations = linspace(0, 0.5, 100);
    rotations = substance.specific_rotation * params.length * concentrations;

    plot(ax, concentrations, rotations, '-', ...
         'Color', substance.color, 'LineWidth', 2.5);

    % 当前点
    plot(ax, params.concentration, rotation_angle, 'o', ...
         'MarkerSize', 12, 'MarkerFaceColor', [0.98, 0.75, 0.14], ...
         'MarkerEdgeColor', [0.98, 0.75, 0.14]);

    xlabel(ax, 'Concentration (g/mL)', 'Color', [1, 1, 1]);
    ylabel(ax, 'Rotation Angle α (°)', 'Color', [1, 1, 1]);
    title(ax, 'Rotation vs Concentration', 'Color', [1, 1, 1], 'FontSize', 10);
    grid(ax, 'on');
    set(ax, 'GridColor', [1, 1, 1], 'GridAlpha', 0.2);

    % 零线
    hold(ax, 'on');
    yline(ax, 0, '--', 'Color', [0.58, 0.64, 0.72], 'LineWidth', 1);
end

function draw_info_panel(ax, params, substance, rotation_angle, output_angle)
    % 信息面板

    specific_rot = substance.specific_rotation;
    if specific_rot > 0
        sign_str = '+';
        chirality = '右旋 (D)';
    else
        sign_str = '-';
        chirality = '左旋 (L)';
    end

    info_text = sprintf([...
        '旋光公式:\n', ...
        '  α = [α]λT × l × c\n\n', ...
        '当前物质: %s\n', ...
        '  比旋光度: %s%.1f°\n', ...
        '  手性: %s\n\n', ...
        '实验参数:\n', ...
        '  浓度 c = %.3f g/mL\n', ...
        '  长度 l = %.1f dm\n\n', ...
        '计算结果:\n', ...
        '  旋光角 α = %+.2f°\n', ...
        '  输出偏振 = %.1f°\n\n', ...
        '应用:\n', ...
        '  • 糖浓度测定\n', ...
        '  • 手性药物分析\n', ...
        '  • 分子结构鉴定'], ...
        substance.name, sign_str, abs(specific_rot), chirality, ...
        params.concentration, params.length, ...
        rotation_angle, output_angle);

    text(0.1, 0.5, info_text, 'Color', [1, 1, 1], 'FontSize', 9, ...
         'VerticalAlignment', 'middle', 'FontName', 'FixedWidth', 'Parent', ax);
end
