%% Malus's Law Interactive Demonstration
%  马吕斯定律交互演示
%
%  This MATLAB/Octave script provides an interactive visualization of Malus's Law,
%  demonstrating how polarized light intensity changes when passing through a
%  rotating polarizer.
%
%  本MATLAB/Octave脚本提供马吕斯定律的交互式可视化，展示偏振光通过
%  旋转偏振片时强度的变化规律。
%
%  PHYSICAL PRINCIPLE 物理原理:
%  ─────────────────────────────────────────────────────────────────────
%  When linearly polarized light passes through a polarizer (analyzer), the
%  transmitted intensity depends on the angle θ between the light's polarization
%  direction and the polarizer's transmission axis:
%
%  当线偏振光通过偏振片（检偏器）时，透射光强取决于光的偏振方向与
%  偏振片透射轴之间的角度θ：
%
%      I = I₀ × cos²(θ)
%
%  where:
%    I₀: incident light intensity (入射光强)
%    θ:  angle between polarizations (偏振方向夹角)
%    I:  transmitted light intensity (透射光强)
%
%  KEY OBSERVATIONS 关键观察:
%    θ = 0°   (parallel):      100% transmission (平行：100%透射)
%    θ = 45°  (diagonal):      50% transmission (对角：50%透射)
%    θ = 90°  (perpendicular): 0% transmission (垂直：0%透射)
%
%  EDUCATIONAL PURPOSE 教学目的:
%  ─────────────────────────────────────────────────────────────────────
%  1. Understand the mathematical relationship between angle and intensity
%     理解角度与光强之间的数学关系
%
%  2. Visualize the cos² relationship graphically
%     图形化展示cos²关系
%
%  3. Explore polarization as a wave property of light
%     探索光的偏振波动性质
%
%  COMPATIBILITY 兼容性:
%  ─────────────────────────────────────────────────────────────────────
%  - MATLAB R2016b or later
%  - GNU Octave 4.0 or later (open-source alternative)
%
%  USAGE 使用方法:
%  ─────────────────────────────────────────────────────────────────────
%  1. Run this script in MATLAB/Octave
%     在MATLAB/Octave中运行此脚本
%
%  2. Use the slider to adjust the polarizer angle
%     使用滑动条调整偏振片角度
%
%  3. Observe how intensity changes following cos² relationship
%     观察光强如何按照cos²关系变化
%
%  Author: PolarCraft Team
%  License: MIT License
%  Source: https://github.com/polarcraft/demos
%
%  Last Updated: 2026-01-14

%% ============================================================================
%  INITIALIZATION AND SETUP
%  初始化和设置
%  ============================================================================

% Clear workspace and command window
% 清空工作区和命令窗口
clear all;
close all;
clc;

% Display welcome message
% 显示欢迎信息
fprintf('\n');
fprintf('════════════════════════════════════════════════════════════════\n');
fprintf('  MALUS''S LAW INTERACTIVE DEMONSTRATION\n');
fprintf('  马吕斯定律交互演示\n');
fprintf('════════════════════════════════════════════════════════════════\n');
fprintf('\n');
fprintf('Physical Principle: I = I₀ × cos²(θ)\n');
fprintf('物理原理: 透射光强 = 入射光强 × cos²(夹角)\n\n');

%% ============================================================================
%  CONSTANTS AND PARAMETERS
%  常量和参数
%  ============================================================================

% Physical constants
% 物理常量
I0 = 100;              % Initial intensity (arbitrary units) 初始光强
WAVELENGTH = 550;      % Light wavelength in nm (green) 光波长（纳米）

% Simulation parameters
% 模拟参数
ANGLE_MIN = 0;         % Minimum angle (degrees) 最小角度
ANGLE_MAX = 180;       % Maximum angle (degrees) 最大角度
ANGLE_STEP = 1;        % Angle resolution (degrees) 角度分辨率
NUM_POINTS = 360;      % Number of points for smooth curves 平滑曲线点数

% Initial state
% 初始状态
initial_angle = 45;    % Starting polarizer angle (degrees) 起始角度

%% ============================================================================
%  CORE PHYSICS FUNCTION
%  核心物理函数
%  ============================================================================

function I = malus_law(theta_deg, I_initial)
    % MALUS_LAW Calculate transmitted intensity using Malus's Law
    %   使用马吕斯定律计算透射光强
    %
    %   This is the fundamental equation governing polarized light transmission
    %   through a polarizing filter. The cos² relationship arises from the
    %   projection of the electric field vector onto the analyzer axis.
    %
    %   这是控制偏振光通过偏振片的基本方程。cos²关系源于电场矢量在
    %   检偏器轴上的投影。
    %
    %   INPUTS 输入:
    %     theta_deg  - Angle in degrees between incident polarization
    %                  and analyzer axis (入射偏振与检偏器轴夹角)
    %     I_initial  - Initial light intensity (入射光强)
    %
    %   OUTPUT 输出:
    %     I          - Transmitted light intensity (透射光强)
    %
    %   MATHEMATICAL DERIVATION 数学推导:
    %   ───────────────────────────────────────────────────────────
    %   1. Electric field component along analyzer axis:
    %      E_transmitted = E₀ × cos(θ)
    %
    %   2. Intensity is proportional to E²:
    %      I = E² = (E₀ × cos(θ))² = E₀² × cos²(θ)
    %
    %   3. Since I₀ ∝ E₀²:
    %      I = I₀ × cos²(θ)
    %
    %   EXAMPLES 示例:
    %     malus_law(0, 100)    % Returns 100 (parallel) 平行
    %     malus_law(90, 100)   % Returns 0 (crossed) 正交
    %     malus_law(45, 100)   % Returns 50 (diagonal) 对角

    % Convert degrees to radians for trigonometric calculation
    % 将角度转换为弧度进行三角计算
    theta_rad = deg2rad(theta_deg);

    % Apply Malus's Law: I = I₀ × cos²(θ)
    % 应用马吕斯定律
    I = I_initial .* (cos(theta_rad).^2);
end

%% ============================================================================
%  VISUALIZATION SETUP
%  可视化设置
%  ============================================================================

% Create main figure
% 创建主图形窗口
fig = figure('Name', 'Malus''s Law Interactive Demo 马吕斯定律交互演示', ...
             'NumberTitle', 'off', ...
             'Position', [100, 100, 1200, 700], ...
             'Color', 'white');

% Create subplots
% 创建子图
subplot(2, 2, 1);
ax_diagram = gca;

subplot(2, 2, 2);
ax_curve = gca;

subplot(2, 2, [3, 4]);
ax_efficiency = gca;

%% ============================================================================
%  PLOTTING FUNCTIONS
%  绘图函数
%  ============================================================================

function plot_polarizer_diagram(ax, angle_deg, I0)
    % PLOT_POLARIZER_DIAGRAM Draw schematic diagram of polarizer setup
    %   绘制偏振片装置示意图
    %
    %   This creates a visual representation showing:
    %   - Incident polarized light (fixed horizontal)
    %   - Rotating analyzer (adjustable angle)
    %   - Transmitted light (intensity varies with angle)

    axes(ax);
    cla(ax);
    hold on;
    axis equal;
    axis([-1, 6, -2, 2]);
    axis off;

    % Title
    % 标题
    title('Polarizer Configuration 偏振片配置', ...
          'FontSize', 12, 'FontWeight', 'bold');

    % Draw incident light arrow (horizontal polarization)
    % 绘制入射光箭头（水平偏振）
    quiver(0, 0, 1.5, 0, 0, 'LineWidth', 3, 'Color', [1, 0.42, 0.42], ...
           'MaxHeadSize', 0.5);
    text(0.75, -0.6, 'Incident Light 入射光', ...
         'HorizontalAlignment', 'center', 'FontSize', 9);
    text(0.75, -0.9, sprintf('I₀ = %.0f', I0), ...
         'HorizontalAlignment', 'center', 'FontSize', 8);

    % Draw polarizer (analyzer)
    % 绘制偏振片（检偏器）
    theta_rad = deg2rad(angle_deg);
    polarizer_length = 1.5;
    px1 = 3 - polarizer_length/2 * sin(theta_rad);
    py1 = -polarizer_length/2 * cos(theta_rad);
    px2 = 3 + polarizer_length/2 * sin(theta_rad);
    py2 = polarizer_length/2 * cos(theta_rad);

    plot([px1, px2], [py1, py2], 'b-', 'LineWidth', 8);
    text(3, -1.2, sprintf('Analyzer 检偏器\nθ = %.0f°', angle_deg), ...
         'HorizontalAlignment', 'center', 'FontSize', 9, 'Color', 'blue');

    % Draw transmission axis
    % 绘制透射轴
    axis_length = 0.8;
    quiver(3, 0, axis_length * cos(theta_rad), axis_length * sin(theta_rad), ...
           0, 'LineWidth', 1.5, 'Color', 'blue', 'LineStyle', '--', ...
           'MaxHeadSize', 0.3);

    % Draw transmitted light
    % 绘制透射光
    I_transmitted = malus_law(angle_deg, I0);
    if I_transmitted > 1
        alpha_val = I_transmitted / I0;
        quiver(3.5, 0, 1.5 * alpha_val, 0, 0, ...
               'LineWidth', 2 * alpha_val, ...
               'Color', [0.32, 0.81, 0.40], ...
               'MaxHeadSize', 0.5);
        text(4.25, -0.6, sprintf('Transmitted 透射光\nI = %.1f', I_transmitted), ...
             'HorizontalAlignment', 'center', 'FontSize', 9, ...
             'Color', [0.18, 0.62, 0.27]);
    else
        text(4.25, 0, 'Blocked 阻挡', ...
             'HorizontalAlignment', 'center', 'FontSize', 10, ...
             'Color', 'red', 'FontStyle', 'italic');
    end

    hold off;
end

function plot_intensity_curve(ax, current_angle, I0)
    % PLOT_INTENSITY_CURVE Plot the Malus's Law intensity curve
    %   绘制马吕斯定律光强曲线

    axes(ax);
    cla(ax);
    hold on;

    % Generate curve data
    % 生成曲线数据
    angles = linspace(0, 180, 360);
    intensities = malus_law(angles, I0);

    % Plot main curve
    % 绘制主曲线
    plot(angles, intensities, 'b-', 'LineWidth', 2.5);

    % Add reference lines
    % 添加参考线
    yline(I0, '--', 'Color', [0.5, 0.5, 0.5], 'LineWidth', 1);
    yline(I0/2, '--', 'Color', [0.5, 0.5, 0.5], 'LineWidth', 1);
    yline(0, '-', 'Color', [0.5, 0.5, 0.5], 'LineWidth', 0.5);

    % Mark current state
    % 标记当前状态
    current_I = malus_law(current_angle, I0);
    plot(current_angle, current_I, 'ro', 'MarkerSize', 12, ...
         'MarkerFaceColor', 'red');
    plot([current_angle, current_angle], [0, current_I], 'r--', ...
         'LineWidth', 1.5);

    % Labels and formatting
    % 标签和格式
    xlabel('Polarizer Angle θ (degrees) 偏振片角度 θ（度）', 'FontSize', 11);
    ylabel('Transmitted Intensity I 透射光强 I', 'FontSize', 11);
    title('Intensity vs. Angle 光强-角度关系', 'FontSize', 12, 'FontWeight', 'bold');
    xlim([0, 180]);
    ylim([-5, 110]);
    grid on;
    legend({sprintf('Malus''s Law: I = I₀cos²(θ)'), ...
            sprintf('Current: θ=%.0f°, I=%.1f', current_angle, current_I)}, ...
           'Location', 'northeast', 'FontSize', 9);

    % Mark key angles
    % 标记关键角度
    key_angles = [0, 45, 90, 135, 180];
    for i = 1:length(key_angles)
        angle = key_angles(i);
        intensity = malus_law(angle, I0);
        plot(angle, intensity, 'ko', 'MarkerSize', 4);
        if ismember(angle, [0, 90, 180])
            text(angle, intensity + 8, sprintf('%.0f°\n%.0f', angle, intensity), ...
                 'HorizontalAlignment', 'center', 'FontSize', 8);
        end
    end

    hold off;
end

function plot_efficiency_bar(ax, current_angle, I0)
    % PLOT_EFFICIENCY_BAR Plot transmission efficiency as a bar
    %   以条形图显示透射效率

    axes(ax);
    cla(ax);
    hold on;

    % Calculate efficiency
    % 计算效率
    efficiency = (malus_law(current_angle, I0) / I0) * 100;

    % Draw horizontal bar
    % 绘制水平条形图
    barh(1, efficiency, 'FaceColor', [0.2, 0.6, 0.94], ...
         'EdgeColor', [0.1, 0.39, 0.76], 'LineWidth', 2);

    % Formatting
    % 格式设置
    xlim([0, 100]);
    ylim([0.5, 1.5]);
    xlabel('Transmission Efficiency (%) 透射效率 (%)', 'FontSize', 11);
    title(sprintf('Current Efficiency: %.1f%% 当前效率', efficiency), ...
          'FontSize', 12, 'FontWeight', 'bold');
    set(gca, 'YTick', []);
    grid on;

    % Add percentage text
    % 添加百分比文本
    text(efficiency/2, 1, sprintf('%.1f%%', efficiency), ...
         'HorizontalAlignment', 'center', 'FontSize', 14, ...
         'FontWeight', 'bold', 'Color', 'white');

    hold off;
end

%% ============================================================================
%  INTERACTIVE SLIDER SETUP
%  交互式滑动条设置
%  ============================================================================

% Create slider
% 创建滑动条
slider_handle = uicontrol('Style', 'slider', ...
                         'Min', ANGLE_MIN, ...
                         'Max', ANGLE_MAX, ...
                         'Value', initial_angle, ...
                         'Position', [150, 20, 900, 30], ...
                         'Callback', @slider_callback);

% Create slider label
% 创建滑动条标签
uicontrol('Style', 'text', ...
          'String', 'Angle θ (degrees) 角度 θ（度）:', ...
          'Position', [50, 15, 90, 40], ...
          'BackgroundColor', 'white', ...
          'FontSize', 10);

% Slider callback function
% 滑动条回调函数
function slider_callback(source, ~)
    % Update plots when slider value changes
    % 滑动条值改变时更新图形
    angle = round(get(source, 'Value'));
    plot_polarizer_diagram(ax_diagram, angle, I0);
    plot_intensity_curve(ax_curve, angle, I0);
    plot_efficiency_bar(ax_efficiency, angle, I0);
    drawnow;
end

%% ============================================================================
%  INITIAL PLOT
%  初始绘图
%  ============================================================================

% Draw initial state
% 绘制初始状态
plot_polarizer_diagram(ax_diagram, initial_angle, I0);
plot_intensity_curve(ax_curve, initial_angle, I0);
plot_efficiency_bar(ax_efficiency, initial_angle, I0);

%% ============================================================================
%  INSTRUCTIONS AND SUMMARY TABLE
%  使用说明和总结表
%  ============================================================================

% Print instructions to command window
% 在命令窗口打印使用说明
fprintf('INSTRUCTIONS 使用说明:\n');
fprintf('──────────────────────────────────────────────────────────────\n');
fprintf('• Move the slider to adjust the polarizer angle\n');
fprintf('  移动滑动条调整偏振片角度\n\n');
fprintf('• Observe how intensity changes following cos² relationship\n');
fprintf('  观察光强如何按照cos²关系变化\n\n');
fprintf('• Pay attention to key angles: 0°, 45°, 90°, 180°\n');
fprintf('  注意关键角度：0°, 45°, 90°, 180°\n');
fprintf('──────────────────────────────────────────────────────────────\n\n');

% Print summary table
% 打印总结表
fprintf('KEY ANGLES SUMMARY 关键角度总结:\n');
fprintf('══════════════════════════════════════════════════════════════\n');
fprintf('  Angle    Intensity    Efficiency    Description\n');
fprintf('  角度     光强         效率          说明\n');
fprintf('──────────────────────────────────────────────────────────────\n');

key_angles = [0, 30, 45, 60, 90, 120, 135, 150, 180];
descriptions = {'Parallel 平行', '30° offset', 'Diagonal 对角', '60° offset', ...
                'Crossed 正交', '120° offset', '135° offset', '150° offset', ...
                'Parallel 平行'};

for i = 1:length(key_angles)
    angle = key_angles(i);
    intensity = malus_law(angle, I0);
    efficiency = (intensity / I0) * 100;
    fprintf('  %3d°     %6.2f       %5.1f%%       %s\n', ...
            angle, intensity, efficiency, descriptions{i});
end

fprintf('══════════════════════════════════════════════════════════════\n\n');
fprintf('Demo ready! Move the slider to explore. 演示已就绪！移动滑动条探索。\n\n');

%% END OF SCRIPT
