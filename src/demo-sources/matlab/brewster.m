% 布儒斯特角演示 (Brewster's Angle Demonstration)
% ================================================
%
% 物理原理: θ_B = arctan(n₂/n₁)
% 在布儒斯特角: R_p = 0, 反射光为完全s偏振
%
% 兼容: MATLAB R2016b+ / GNU Octave 4.0+
% 运行: brewster

function brewster()
    fprintf('布儒斯特角演示\n');
    fprintf('θ_B = arctan(n₂/n₁)\n\n');
    
    fig = figure('Name', 'Brewster Angle', 'Position', [100,100,1000,600], 'Color', [0.06,0.09,0.16]);
    
    % 参数
    params.n1 = 1.0;
    params.n2 = 1.5;
    params.theta = 56.3;
    params.theta_brewster = rad2deg(atan(params.n2/params.n1));
    
    % 控件
    uicontrol('Style', 'text', 'String', sprintf('Incident Angle: %.1f°', params.theta), ...
              'Units', 'normalized', 'Position', [0.05, 0.15, 0.25, 0.03], ...
              'BackgroundColor', [0.06,0.09,0.16], 'ForegroundColor', [1,1,1], ...
              'Tag', 'label_theta');
    
    uicontrol('Style', 'slider', 'Min', 0, 'Max', 90, 'Value', params.theta, ...
              'Units', 'normalized', 'Position', [0.05, 0.12, 0.25, 0.03], ...
              'Callback', {@on_theta_changed, fig, params});
    
    uicontrol('Style', 'text', 'String', sprintf('n₂: %.1f', params.n2), ...
              'Units', 'normalized', 'Position', [0.05, 0.08, 0.25, 0.03], ...
              'BackgroundColor', [0.06,0.09,0.16], 'ForegroundColor', [1,1,1], ...
              'Tag', 'label_n2');
    
    uicontrol('Style', 'slider', 'Min', 1.0, 'Max', 2.5, 'Value', params.n2, ...
              'SliderStep', [0.1/1.5, 0.2/1.5], ...
              'Units', 'normalized', 'Position', [0.05, 0.05, 0.25, 0.03], ...
              'Callback', {@on_n2_changed, fig, params});
    
    setappdata(fig, 'params', params);
    update_plot(fig, params);
end

function on_theta_changed(src, ~, fig, params)
    params.theta = get(src, 'Value');
    label = findobj(fig, 'Tag', 'label_theta');
    set(label, 'String', sprintf('Incident Angle: %.1f°', params.theta));
    setappdata(fig, 'params', params);
    update_plot(fig, params);
end

function on_n2_changed(src, ~, fig, params)
    params.n2 = get(src, 'Value');
    params.theta_brewster = rad2deg(atan(params.n2/params.n1));
    label = findobj(fig, 'Tag', 'label_n2');
    set(label, 'String', sprintf('n₂: %.1f', params.n2));
    setappdata(fig, 'params', params);
    update_plot(fig, params);
end

function update_plot(fig, params)
    delete(findobj(fig, 'Type', 'axes'));
    
    % 主光路图
    ax1 = axes('Parent', fig, 'Position', [0.35, 0.40, 0.30, 0.50]);
    hold(ax1, 'on');
    axis(ax1, [-3, 3, -2, 3]);
    axis(ax1, 'equal', 'off');
    set(ax1, 'Color', [0.12, 0.16, 0.23]);
    
    % 界面
    plot(ax1, [-3, 3], [0, 0], '--', 'Color', [0.38, 0.65, 0.98], 'LineWidth', 2);
    text(ax1, 2, 0.2, 'Air', 'Color', [1,1,1]);
    text(ax1, 2, -0.3, sprintf('Glass (n=%.1f)', params.n2), 'Color', [1,1,1]);
    
    % 法线
    plot(ax1, [0, 0], [-2, 3], ':', 'Color', [0.58, 0.64, 0.69]);
    
    % 计算
    result = fresnel_calc(params.theta, params.n1, params.n2);
    theta1_rad = deg2rad(params.theta);
    theta2_rad = deg2rad(result.theta2);
    
    % 入射
    plot(ax1, [-2*sin(theta1_rad), 0], [2*cos(theta1_rad), 0], '-', 'Color', [0.98,0.75,0.21], 'LineWidth', 3);
    
    % 反射
    plot(ax1, [0, 2*sin(theta1_rad)], [0, 2*cos(theta1_rad)], '-', 'Color', [0.96,0.45,0.71], 'LineWidth', 2+result.Rs*2);
    
    % 折射
    if ~result.tir
        plot(ax1, [0, 2*sin(theta2_rad)], [0, -2*cos(theta2_rad)], '-', 'Color', [0.13,0.83,0.93], 'LineWidth', 3);
    end
    
    % 反射率曲线
    ax2 = axes('Parent', fig, 'Position', [0.35, 0.10, 0.60, 0.25]);
    angles = linspace(0, 90, 200);
    Rs_vals = zeros(size(angles));
    Rp_vals = zeros(size(angles));
    
    for i = 1:length(angles)
        res = fresnel_calc(angles(i), params.n1, params.n2);
        Rs_vals(i) = res.Rs;
        Rp_vals(i) = res.Rp;
    end
    
    plot(ax2, angles, Rs_vals, '-', 'Color', [0.96,0.45,0.71], 'LineWidth', 2.5);
    hold(ax2, 'on');
    plot(ax2, angles, Rp_vals, '-', 'Color', [0.13,0.83,0.93], 'LineWidth', 2.5);
    plot(ax2, params.theta, result.Rs, 'o', 'MarkerSize', 10, 'Color', [0.96,0.45,0.71], 'LineWidth', 2);
    plot(ax2, params.theta, result.Rp, 'o', 'MarkerSize', 10, 'Color', [0.13,0.83,0.93], 'LineWidth', 2);
    
    % 布儒斯特角标记
    plot(ax2, [params.theta_brewster, params.theta_brewster], [0, 1], '--', 'Color', [0.06,0.73,0.51], 'LineWidth', 2);
    text(ax2, params.theta_brewster+2, 0.9, sprintf('θ_B=%.1f°', params.theta_brewster), 'Color', [0.06,0.73,0.51]);
    
    set(ax2, 'Color', [0.12, 0.16, 0.23]);
    set(ax2, 'XColor', [1,1,1], 'YColor', [1,1,1]);
    xlabel(ax2, 'Incident Angle (°)', 'Color', [1,1,1]);
    ylabel(ax2, 'Reflectance', 'Color', [1,1,1]);
    xlim(ax2, [0, 90]);
    ylim(ax2, [0, 1]);
    legend(ax2, {'Rs (s-pol)', 'Rp (p-pol)'}, 'TextColor', [1,1,1], 'Color', [0.12,0.16,0.23], 'EdgeColor', [1,1,1]);
    grid(ax2, 'on');
end

function result = fresnel_calc(theta1, n1, n2)
    theta1_rad = deg2rad(theta1);
    sin_theta1 = sin(theta1_rad);
    cos_theta1 = cos(theta1_rad);
    sin_theta2 = (n1/n2) * sin_theta1;
    
    if sin_theta2 > 1
        result.Rs = 1;
        result.Rp = 1;
        result.theta2 = 90;
        result.tir = true;
        return;
    end
    
    cos_theta2 = sqrt(1 - sin_theta2^2);
    result.theta2 = rad2deg(asin(sin_theta2));
    
    rs = (n1*cos_theta1 - n2*cos_theta2) / (n1*cos_theta1 + n2*cos_theta2);
    rp = (n2*cos_theta1 - n1*cos_theta2) / (n2*cos_theta1 + n1*cos_theta2);
    
    result.Rs = rs^2;
    result.Rp = rp^2;
    result.tir = false;
end
