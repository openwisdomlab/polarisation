function mueller_matrix()
% MUELLER_MATRIX Mueller Matrix Interactive Demonstration
% 缪勒矩阵交互式演示
%
% Physical Principle (物理原理):
%   S_out = M × S_in
%   where M is 4×4 real matrix, S is Stokes vector
%
% Features (功能):
%   - Mueller matrix representation for any polarization transformation
%   - Handles partial polarization and depolarization
%   - Lu-Chipman decomposition (M = M_Δ × M_R × M_D)
%   - Interactive visualization with 6 panels
%
% Requirements:
%   - MATLAB R2016b or later, or GNU Octave 4.0+
%   - No toolbox dependencies
%
% Author: PolarCraft Team
% Date: 2026-01-14
% License: MIT

    % Display startup info
    fprintf('======================================================================\n');
    fprintf('Mueller Matrix Interactive Demonstration\n');
    fprintf('缪勒矩阵交互式演示\n');
    fprintf('======================================================================\n');
    fprintf('\nPhysical Principle (物理原理):\n');
    fprintf('  S_out = M × S_in\n');
    fprintf('  where M is 4×4 real matrix\n');
    fprintf('\nFeatures (功能):\n');
    fprintf('  - 6 optical elements\n');
    fprintf('  - Real-time Mueller matrix visualization\n');
    fprintf('  - Poincaré sphere transformation\n');
    fprintf('  - Lu-Chipman analysis (D, P, Δ)\n');
    fprintf('\nControls (控制):\n');
    fprintf('  - Select element type\n');
    fprintf('  - Adjust parameters with sliders\n');
    fprintf('  - Choose input polarization state\n');
    fprintf('\nNote: Close the window to exit.\n');
    fprintf('======================================================================\n');

    % Dark theme colors
    bg_color = [0.059 0.09 0.157];  % #0f172a
    text_color = [1 1 1];
    primary_color = [0.133 0.827 0.933];  % #22d3ee cyan
    secondary_color = [0.957 0.447 0.714];  % #f472b6 pink
    input_color = [0.133 0.827 0.933];  % cyan
    output_color = [0.282 0.867 0.502];  % #4ade80 green

    % Initialize state
    state = struct();
    state.element_type = 'Linear Polarizer';
    state.angle = 0;
    state.retardance = 90;
    state.diattenuation = 0.5;
    state.depolarization = 0.5;
    state.input_stokes = [1; 1; 0; 0];  % Horizontal
    state.mueller = create_mueller_linear_polarizer(0);

    % Create figure
    fig = figure('Name', 'Mueller Matrix Demonstration', ...
                 'Position', [50, 50, 1600, 1000], ...
                 'Color', bg_color, ...
                 'NumberTitle', 'off');

    % Create axes
    ax_matrix = subplot(3, 3, 1, 'Parent', fig);
    ax_input = subplot(3, 3, 2, 'Parent', fig);
    ax_output = subplot(3, 3, 3, 'Parent', fig);
    ax_poincare = subplot(3, 3, 4:6, 'Parent', fig);
    ax_params = subplot(3, 3, 7:9, 'Parent', fig);

    % Style axes
    set(ax_matrix, 'Color', bg_color, 'XColor', text_color, 'YColor', text_color);
    set(ax_input, 'Color', bg_color, 'XColor', text_color, 'YColor', text_color);
    set(ax_output, 'Color', bg_color, 'XColor', text_color, 'YColor', text_color);
    set(ax_poincare, 'Color', bg_color, 'XColor', text_color, 'YColor', text_color, 'ZColor', text_color);
    set(ax_params, 'Color', bg_color, 'XColor', text_color, 'YColor', text_color, 'Visible', 'off');

    % Create UI controls
    controls = create_controls(fig, bg_color, text_color, primary_color);

    % Store state
    setappdata(fig, 'state', state);
    setappdata(fig, 'axes', struct('matrix', ax_matrix, 'input', ax_input, ...
                                     'output', ax_output, 'poincare', ax_poincare, ...
                                     'params', ax_params));
    setappdata(fig, 'colors', struct('text', text_color, 'primary', primary_color, ...
                                       'secondary', secondary_color, ...
                                       'input', input_color, 'output', output_color));

    % Initial update
    update_visualization(fig);
end


function controls = create_controls(fig, bg_color, text_color, primary_color)
    % Create UI controls on the right side

    control_x = 0.77;
    control_width = 0.20;

    % Element type selector
    element_types = {'Linear Polarizer', 'QWP', 'HWP', 'Rotator', 'Partial Polarizer', 'Depolarizer'};

    y_pos = 0.75;
    for i = 1:length(element_types)
        btn_y = y_pos + 0.15 - (i * 0.024);
        controls.(['element_' num2str(i)]) = uicontrol('Parent', fig, ...
            'Style', 'radiobutton', ...
            'String', element_types{i}, ...
            'Position', [control_x*fig.Position(3), btn_y*fig.Position(4), control_width*fig.Position(3), 20], ...
            'BackgroundColor', bg_color, ...
            'ForegroundColor', text_color, ...
            'Value', i==1, ...
            'Callback', @(src, evt) element_callback(fig, src, element_types));
    end

    % Angle slider
    controls.angle_slider = uicontrol('Parent', fig, 'Style', 'slider', ...
        'Min', 0, 'Max', 180, 'Value', 0, ...
        'Position', [control_x*fig.Position(3), 0.65*fig.Position(4), control_width*fig.Position(3), 20], ...
        'BackgroundColor', bg_color, ...
        'Callback', @(src, evt) slider_callback(fig));

    controls.angle_label = uicontrol('Parent', fig, 'Style', 'text', ...
        'String', 'Angle (°): 0', ...
        'Position', [control_x*fig.Position(3), 0.675*fig.Position(4), control_width*fig.Position(3), 20], ...
        'BackgroundColor', bg_color, 'ForegroundColor', text_color, ...
        'HorizontalAlignment', 'left');

    % Retardance slider
    controls.retardance_slider = uicontrol('Parent', fig, 'Style', 'slider', ...
        'Min', 0, 'Max', 360, 'Value', 90, ...
        'Position', [control_x*fig.Position(3), 0.60*fig.Position(4), control_width*fig.Position(3), 20], ...
        'BackgroundColor', bg_color, ...
        'Callback', @(src, evt) slider_callback(fig));

    controls.retardance_label = uicontrol('Parent', fig, 'Style', 'text', ...
        'String', 'Retardance (°): 90', ...
        'Position', [control_x*fig.Position(3), 0.625*fig.Position(4), control_width*fig.Position(3), 20], ...
        'BackgroundColor', bg_color, 'ForegroundColor', text_color, ...
        'HorizontalAlignment', 'left');

    % Diattenuation slider
    controls.diattenuation_slider = uicontrol('Parent', fig, 'Style', 'slider', ...
        'Min', 0, 'Max', 1, 'Value', 0.5, ...
        'Position', [control_x*fig.Position(3), 0.55*fig.Position(4), control_width*fig.Position(3), 20], ...
        'BackgroundColor', bg_color, ...
        'Callback', @(src, evt) slider_callback(fig));

    controls.diattenuation_label = uicontrol('Parent', fig, 'Style', 'text', ...
        'String', 'Diattenuation: 0.50', ...
        'Position', [control_x*fig.Position(3), 0.575*fig.Position(4), control_width*fig.Position(3), 20], ...
        'BackgroundColor', bg_color, 'ForegroundColor', text_color, ...
        'HorizontalAlignment', 'left');

    % Depolarization slider
    controls.depolarization_slider = uicontrol('Parent', fig, 'Style', 'slider', ...
        'Min', 0, 'Max', 1, 'Value', 0.5, ...
        'Position', [control_x*fig.Position(3), 0.50*fig.Position(4), control_width*fig.Position(3), 20], ...
        'BackgroundColor', bg_color, ...
        'Callback', @(src, evt) slider_callback(fig));

    controls.depolarization_label = uicontrol('Parent', fig, 'Style', 'text', ...
        'String', 'Depolarization: 0.50', ...
        'Position', [control_x*fig.Position(3), 0.525*fig.Position(4), control_width*fig.Position(3), 20], ...
        'BackgroundColor', bg_color, 'ForegroundColor', text_color, ...
        'HorizontalAlignment', 'left');

    % Input state presets
    input_states = {'Horizontal', 'Vertical', '+45°', '-45°', 'RCP', 'Unpolarized'};

    y_pos_input = 0.30;
    for i = 1:length(input_states)
        btn_y = y_pos_input + 0.15 - (i * 0.024);
        controls.(['input_' num2str(i)]) = uicontrol('Parent', fig, ...
            'Style', 'radiobutton', ...
            'String', input_states{i}, ...
            'Position', [control_x*fig.Position(3), btn_y*fig.Position(4), control_width*fig.Position(3), 20], ...
            'BackgroundColor', bg_color, ...
            'ForegroundColor', text_color, ...
            'Value', i==1, ...
            'Callback', @(src, evt) input_state_callback(fig, src, input_states));
    end

    % Reset button
    controls.reset_button = uicontrol('Parent', fig, 'Style', 'pushbutton', ...
        'String', 'Reset', ...
        'Position', [control_x*fig.Position(3), 0.20*fig.Position(4), control_width*fig.Position(3), 30], ...
        'BackgroundColor', bg_color, 'ForegroundColor', text_color, ...
        'Callback', @(src, evt) reset_callback(fig, controls));
end


function element_callback(fig, src, element_types)
    % Handle element type selection
    state = getappdata(fig, 'state');

    % Update radio buttons
    for i = 1:length(element_types)
        btn = findobj(fig, 'String', element_types{i});
        if ~isempty(btn)
            set(btn, 'Value', btn == src);
        end
    end

    state.element_type = get(src, 'String');
    setappdata(fig, 'state', state);
    update_visualization(fig);
end


function input_state_callback(fig, src, input_states)
    % Handle input state selection
    state = getappdata(fig, 'state');

    % Update radio buttons
    for i = 1:length(input_states)
        btn = findobj(fig, 'String', input_states{i});
        if ~isempty(btn)
            set(btn, 'Value', btn == src);
        end
    end

    % Set input Stokes vector
    state_name = get(src, 'String');
    switch state_name
        case 'Horizontal'
            state.input_stokes = [1; 1; 0; 0];
        case 'Vertical'
            state.input_stokes = [1; -1; 0; 0];
        case '+45°'
            state.input_stokes = [1; 0; 1; 0];
        case '-45°'
            state.input_stokes = [1; 0; -1; 0];
        case 'RCP'
            state.input_stokes = [1; 0; 0; -1];
        case 'Unpolarized'
            state.input_stokes = [1; 0; 0; 0];
    end

    setappdata(fig, 'state', state);
    update_visualization(fig);
end


function slider_callback(fig)
    % Handle slider updates
    update_visualization(fig);
end


function reset_callback(fig, controls)
    % Reset all controls to default values
    set(controls.angle_slider, 'Value', 0);
    set(controls.retardance_slider, 'Value', 90);
    set(controls.diattenuation_slider, 'Value', 0.5);
    set(controls.depolarization_slider, 'Value', 0.5);

    % Reset element type to first option
    element_types = {'Linear Polarizer', 'QWP', 'HWP', 'Rotator', 'Partial Polarizer', 'Depolarizer'};
    for i = 1:length(element_types)
        btn = findobj(fig, 'String', element_types{i});
        if ~isempty(btn)
            set(btn, 'Value', i==1);
        end
    end

    % Reset input state to Horizontal
    input_states = {'Horizontal', 'Vertical', '+45°', '-45°', 'RCP', 'Unpolarized'};
    for i = 1:length(input_states)
        btn = findobj(fig, 'String', input_states{i});
        if ~isempty(btn)
            set(btn, 'Value', i==1);
        end
    end

    state = getappdata(fig, 'state');
    state.element_type = 'Linear Polarizer';
    state.input_stokes = [1; 1; 0; 0];
    setappdata(fig, 'state', state);

    update_visualization(fig);
end


function update_visualization(fig)
    % Update all visualizations

    state = getappdata(fig, 'state');
    axes_handles = getappdata(fig, 'axes');
    colors = getappdata(fig, 'colors');

    % Get slider values
    angle_slider = findobj(fig, 'Style', 'slider', 'Min', 0, 'Max', 180);
    retardance_slider = findobj(fig, 'Style', 'slider', 'Min', 0, 'Max', 360);
    diattenuation_slider = findobj(fig, 'Style', 'slider', 'Min', 0, 'Max', 1);
    depolarization_slider = findall(fig, 'Style', 'slider', 'Max', 1);
    depolarization_slider = depolarization_slider(end);  % Get the last one

    state.angle = get(angle_slider, 'Value');
    state.retardance = get(retardance_slider, 'Value');
    state.diattenuation = get(diattenuation_slider, 'Value');
    state.depolarization = get(depolarization_slider, 'Value');

    % Update labels
    angle_label = findobj(fig, 'Style', 'text', 'String', sprintf('Angle (°): %d', round(state.angle)));
    if isempty(angle_label)
        angle_label = findall(fig, 'Style', 'text');
        angle_label = angle_label(contains(get(angle_label, 'String'), 'Angle'));
    end
    set(angle_label, 'String', sprintf('Angle (°): %d', round(state.angle)));

    retardance_label = findall(fig, 'Style', 'text');
    retardance_label = retardance_label(contains(get(retardance_label, 'String'), 'Retardance'));
    if ~isempty(retardance_label)
        set(retardance_label, 'String', sprintf('Retardance (°): %d', round(state.retardance)));
    end

    diattenuation_label = findall(fig, 'Style', 'text');
    diattenuation_label = diattenuation_label(contains(get(diattenuation_label, 'String'), 'Diattenuation'));
    if ~isempty(diattenuation_label)
        set(diattenuation_label, 'String', sprintf('Diattenuation: %.2f', state.diattenuation));
    end

    depolarization_label = findall(fig, 'Style', 'text');
    depolarization_label = depolarization_label(contains(get(depolarization_label, 'String'), 'Depolarization'));
    if ~isempty(depolarization_label)
        set(depolarization_label, 'String', sprintf('Depolarization: %.2f', state.depolarization));
    end

    % Create Mueller matrix based on element type
    switch state.element_type
        case 'Linear Polarizer'
            state.mueller = create_mueller_linear_polarizer(state.angle);
        case 'QWP'
            state.mueller = create_mueller_qwp(state.angle);
        case 'HWP'
            state.mueller = create_mueller_hwp(state.angle);
        case 'Rotator'
            state.mueller = create_mueller_rotator(state.angle);
        case 'Partial Polarizer'
            state.mueller = create_mueller_partial_polarizer(state.diattenuation, state.angle);
        case 'Depolarizer'
            state.mueller = create_mueller_depolarizer(state.depolarization);
        otherwise
            state.mueller = eye(4);
    end

    % Calculate output
    state.output_stokes = state.mueller * state.input_stokes;

    % Update plots
    plot_mueller_matrix(axes_handles.matrix, state.mueller, colors);
    plot_stokes_vectors(axes_handles.input, axes_handles.output, ...
                        state.input_stokes, state.output_stokes, colors);
    plot_poincare_transformation(axes_handles.poincare, ...
                                  state.input_stokes, state.output_stokes, colors);
    display_parameters(axes_handles.params, state, colors);

    setappdata(fig, 'state', state);
    drawnow;
end


% ==================== Mueller Matrix Creation Functions ====================

function M = create_mueller_linear_polarizer(angle_deg)
    theta = deg2rad(angle_deg);
    cos2t = cos(2 * theta);
    sin2t = sin(2 * theta);

    M = 0.5 * [1,     cos2t,           sin2t,           0;
               cos2t, cos2t^2,          sin2t*cos2t,     0;
               sin2t, sin2t*cos2t,      sin2t^2,         0;
               0,     0,                0,               0];
end


function M = create_mueller_qwp(angle_deg)
    theta = deg2rad(angle_deg);
    cos2t = cos(2 * theta);
    sin2t = sin(2 * theta);
    cos4t = cos(4 * theta);
    sin4t = sin(4 * theta);

    M_base = [1, 0,      0,       0;
              0, cos4t,  sin4t,   0;
              0, sin4t,  -cos4t,  0;
              0, 0,      0,       1];

    R = rotation_matrix(angle_deg);
    M = R * M_base * R';
end


function M = create_mueller_hwp(angle_deg)
    theta = deg2rad(angle_deg);
    cos4t = cos(4 * theta);
    sin4t = sin(4 * theta);

    M_base = [1, 0,      0,       0;
              0, cos4t,  sin4t,   0;
              0, sin4t,  -cos4t,  0;
              0, 0,      0,       -1];

    R = rotation_matrix(angle_deg);
    M = R * M_base * R';
end


function M = create_mueller_rotator(angle_deg)
    theta = deg2rad(angle_deg);
    cos2t = cos(2 * theta);
    sin2t = sin(2 * theta);

    M = [1, 0,       0,       0;
         0, cos2t,   sin2t,   0;
         0, -sin2t,  cos2t,   0;
         0, 0,       0,       1];
end


function M = create_mueller_partial_polarizer(diattenuation, angle_deg)
    D = diattenuation;
    theta = deg2rad(angle_deg);
    cos2t = cos(2 * theta);
    sin2t = sin(2 * theta);

    T_para = 1.0;
    T_perp = 1.0 - D;

    M00 = (T_para + T_perp) / 2;
    M01 = (T_para - T_perp) / 2 * cos2t;
    M02 = (T_para - T_perp) / 2 * sin2t;

    M = [M00, M01, M02, 0;
         M01, M00*cos2t^2 + T_perp*sin2t^2, (M00-T_perp)*sin2t*cos2t, 0;
         M02, (M00-T_perp)*sin2t*cos2t, M00*sin2t^2 + T_perp*cos2t^2, 0;
         0, 0, 0, sqrt(T_para * T_perp)];
end


function M = create_mueller_depolarizer(depolarization)
    reduction = 1 - depolarization;
    M = diag([1.0, reduction, reduction, reduction]);
end


function R = rotation_matrix(angle_deg)
    theta = deg2rad(angle_deg);
    cos2t = cos(2 * theta);
    sin2t = sin(2 * theta);

    R = [1, 0,       0,       0;
         0, cos2t,   sin2t,   0;
         0, -sin2t,  cos2t,   0;
         0, 0,       0,       1];
end


% ==================== Plotting Functions ====================

function plot_mueller_matrix(ax, M, colors)
    cla(ax);

    % Normalize by M(1,1)
    M_norm = M / max(M(1,1), 1e-10);

    % Plot heatmap
    imagesc(ax, M_norm);
    colormap(ax, 'jet');
    caxis(ax, [-1, 1]);
    colorbar(ax);

    % Add text values
    for i = 1:4
        for j = 1:4
            value = M_norm(i, j);
            if abs(value) > 0.5
                color = 'white';
            else
                color = 'black';
            end
            text(ax, j, i, sprintf('%.2f', value), ...
                'HorizontalAlignment', 'center', ...
                'Color', color, 'FontWeight', 'bold', 'FontSize', 10);
        end
    end

    set(ax, 'XTick', 1:4, 'YTick', 1:4);
    set(ax, 'XTickLabel', {'S_0', 'S_1', 'S_2', 'S_3'});
    set(ax, 'YTickLabel', {'S_0', 'S_1', 'S_2', 'S_3'});
    title(ax, 'Mueller Matrix M', 'Color', colors.text, 'FontSize', 12);
    grid(ax, 'on');
end


function plot_stokes_vectors(ax_in, ax_out, S_in, S_out, colors)
    % Input
    cla(ax_in);
    hold(ax_in, 'on');

    bar_colors_in = repmat(colors.input, 4, 1);
    bar_colors_in(S_in < 0, :) = repmat([0.937 0.267 0.267], sum(S_in < 0), 1);  % red

    bar(ax_in, S_in, 'FaceColor', 'flat', 'CData', bar_colors_in, ...
        'EdgeColor', colors.text, 'LineWidth', 1.5);

    plot(ax_in, [0, 5], [0, 0], 'Color', colors.text, 'LineWidth', 1);
    ylim(ax_in, [-1.2, 1.2]);
    set(ax_in, 'XTickLabel', {'S_0', 'S_1', 'S_2', 'S_3'});
    ylabel(ax_in, 'Value', 'Color', colors.text);

    dop_in = sqrt(S_in(2)^2 + S_in(3)^2 + S_in(4)^2) / max(S_in(1), 1e-10);
    title(ax_in, sprintf('Input (DOP=%.3f)', dop_in), 'Color', colors.text, 'FontSize', 11);
    grid(ax_in, 'on');
    hold(ax_in, 'off');

    % Output
    cla(ax_out);
    hold(ax_out, 'on');

    bar_colors_out = repmat(colors.output, 4, 1);
    bar_colors_out(S_out < 0, :) = repmat([0.937 0.267 0.267], sum(S_out < 0), 1);

    bar(ax_out, S_out, 'FaceColor', 'flat', 'CData', bar_colors_out, ...
        'EdgeColor', colors.text, 'LineWidth', 1.5);

    plot(ax_out, [0, 5], [0, 0], 'Color', colors.text, 'LineWidth', 1);
    ylim(ax_out, [-1.2, 1.2]);
    set(ax_out, 'XTickLabel', {'S_0', 'S_1', 'S_2', 'S_3'});
    ylabel(ax_out, 'Value', 'Color', colors.text);

    dop_out = sqrt(S_out(2)^2 + S_out(3)^2 + S_out(4)^2) / max(S_out(1), 1e-10);
    title(ax_out, sprintf('Output (DOP=%.3f)', dop_out), 'Color', colors.text, 'FontSize', 11);
    grid(ax_out, 'on');
    hold(ax_out, 'off');
end


function plot_poincare_transformation(ax, S_in, S_out, colors)
    cla(ax);
    hold(ax, 'on');

    % Draw unit sphere
    [x_sphere, y_sphere, z_sphere] = sphere(50);
    surf(ax, x_sphere, y_sphere, z_sphere, 'FaceColor', 'white', ...
         'FaceAlpha', 0.1, 'EdgeColor', 'none');

    % Draw axes
    axis_length = 1.3;
    plot3(ax, [0, axis_length], [0, 0], [0, 0], 'Color', [0.937 0.267 0.267], 'LineWidth', 2);
    plot3(ax, [0, 0], [0, axis_length], [0, 0], 'Color', colors.input, 'LineWidth', 2);
    plot3(ax, [0, 0], [0, 0], [0, axis_length], 'Color', colors.output, 'LineWidth', 2);

    % Calculate Poincaré coordinates
    dop_in = sqrt(S_in(2)^2 + S_in(3)^2 + S_in(4)^2) / max(S_in(1), 1e-10);
    dop_out = sqrt(S_out(2)^2 + S_out(3)^2 + S_out(4)^2) / max(S_out(1), 1e-10);

    s1_in = S_in(2) / max(S_in(1), 1e-10);
    s2_in = S_in(3) / max(S_in(1), 1e-10);
    s3_in = S_in(4) / max(S_in(1), 1e-10);

    s1_out = S_out(2) / max(S_out(1), 1e-10);
    s2_out = S_out(3) / max(S_out(1), 1e-10);
    s3_out = S_out(4) / max(S_out(1), 1e-10);

    point_in = [s1_in; s2_in; s3_in] * dop_in;
    point_out = [s1_out; s2_out; s3_out] * dop_out;

    % Plot points
    scatter3(ax, point_in(1), point_in(2), point_in(3), 200, ...
             'MarkerFaceColor', colors.input, 'MarkerEdgeColor', colors.text, 'LineWidth', 2);
    scatter3(ax, point_out(1), point_out(2), point_out(3), 200, ...
             'MarkerFaceColor', colors.output, 'MarkerEdgeColor', colors.text, 'LineWidth', 2);

    % Draw arrow
    if dop_in > 0.01 && dop_out > 0.01
        quiver3(ax, point_in(1), point_in(2), point_in(3), ...
                point_out(1)-point_in(1), point_out(2)-point_in(2), point_out(3)-point_in(3), ...
                0, 'Color', colors.secondary, 'LineWidth', 2.5, 'MaxHeadSize', 0.5);
    end

    % Labels
    text(ax, axis_length+0.1, 0, 0, 'H/V', 'Color', [0.937 0.267 0.267], 'FontSize', 10);
    text(ax, 0, axis_length+0.1, 0, '±45°', 'Color', colors.input, 'FontSize', 10);
    text(ax, 0, 0, axis_length+0.1, 'R/L', 'Color', colors.output, 'FontSize', 10);

    xlabel(ax, 'S_1', 'Color', colors.text);
    ylabel(ax, 'S_2', 'Color', colors.text);
    zlabel(ax, 'S_3', 'Color', colors.text);
    title(ax, 'Poincaré Sphere Transformation', 'Color', colors.text, 'FontSize', 12);

    xlim(ax, [-1.3, 1.3]);
    ylim(ax, [-1.3, 1.3]);
    zlim(ax, [-1.3, 1.3]);
    view(ax, 45, 30);
    grid(ax, 'on');
    axis(ax, 'equal');
    hold(ax, 'off');
end


function display_parameters(ax, state, colors)
    cla(ax);

    % Calculate parameters
    M = state.mueller;
    D = sqrt(M(1,2)^2 + M(1,3)^2 + M(1,4)^2) / max(M(1,1), 1e-10);
    P = sqrt(M(2,1)^2 + M(3,1)^2 + M(4,1)^2) / max(M(1,1), 1e-10);

    trace_MTM = trace(M' * M);
    Delta = 1 - sqrt(max(0, trace_MTM - M(1,1)^2)) / (sqrt(3) * M(1,1));
    Delta = max(0, min(1, Delta));

    det_M = det(M);
    trace_M = trace(M);

    dop_in = sqrt(state.input_stokes(2)^2 + state.input_stokes(3)^2 + state.input_stokes(4)^2) / ...
             max(state.input_stokes(1), 1e-10);
    dop_out = sqrt(state.output_stokes(2)^2 + state.output_stokes(3)^2 + state.output_stokes(4)^2) / ...
              max(state.output_stokes(1), 1e-10);

    % Create parameter text
    params_text = sprintf(['Element Type: %s\n' ...
                          'Angle: %.1f°\n\n' ...
                          'Diattenuation D: %.4f\n' ...
                          'Polarizance P: %.4f\n' ...
                          'Depolarization Δ: %.4f\n\n' ...
                          'M₀₀ = %.4f\n' ...
                          'Determinant = %.4f\n' ...
                          'Trace = %.4f\n\n' ...
                          'Input DOP: %.4f\n' ...
                          'Output DOP: %.4f'], ...
                          state.element_type, state.angle, ...
                          D, P, Delta, M(1,1), det_M, trace_M, dop_in, dop_out);

    text(ax, 0.05, 0.95, params_text, 'Units', 'normalized', ...
         'VerticalAlignment', 'top', 'FontSize', 11, 'FontName', 'FixedWidth', ...
         'Color', colors.text, 'BackgroundColor', [0.059 0.09 0.157]);

    title(ax, 'Parameters', 'Color', colors.text, 'FontSize', 12);
end
