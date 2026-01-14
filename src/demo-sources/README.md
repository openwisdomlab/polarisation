# PolarCraft 物理演示源码库
# Physics Demonstration Source Code Repository

本目录包含PolarCraft偏振光教学平台的**多语言物理演示源码**，支持Python、MATLAB/Octave和TypeScript/React实现。

---

## 📁 目录结构 (Directory Structure)

```
src/demo-sources/
├── AI_CODEGEN_PROMPT.md    # 🤖 大模型代码生成系统提示词
├── README.md               # 本文件
├── python/                 # Python演示脚本
│   ├── malus_law.py
│   ├── birefringence.py
│   ├── fresnel.py
│   ├── waveplate.py
│   ├── brewster.py
│   ├── optical_rotation.py
│   └── rayleigh_scattering.py
└── matlab/                 # MATLAB/Octave脚本
    ├── malus_law.m
    ├── birefringence.m
    ├── fresnel.m
    ├── waveplate.m
    ├── brewster.m
    ├── optical_rotation.m
    └── rayleigh_scattering.m
```

---

## 🚀 快速开始 (Quick Start)

### Python演示
```bash
# 安装依赖
pip install numpy matplotlib

# 运行任意演示
cd src/demo-sources/python
python malus_law.py
python waveplate.py
python rayleigh_scattering.py
```

### MATLAB/Octave演示
```matlab
% 在MATLAB或Octave中运行
cd src/demo-sources/matlab
malus_law
waveplate
```

---

## 📚 演示列表 (Available Demos)

| 演示名称 | Python | MATLAB | 物理原理 | 难度 |
|---------|:------:|:------:|---------|:----:|
| **Malus's Law** (马吕斯定律) | ✅ | ✅ | I = I₀×cos²θ | 🌱 |
| **Birefringence** (双折射) | ✅ | ✅ | I_o = I₀×cos²θ, I_e = I₀×sin²θ | 🔬 |
| **Fresnel Equations** (菲涅尔方程) | ✅ | ✅ | R_s, R_p vs θ | 🔬 |
| **Waveplate** (波片) | ✅ | ✅ | λ/4, λ/2相位延迟 | 🔬 |
| **Brewster's Angle** (布儒斯特角) | ✅ | ✅ | θ_B = arctan(n₂/n₁) | 🔬 |
| **Optical Rotation** (旋光性) | ✅ | ✅ | α = [α]_λ^T × l × c | 🔬 |
| **Rayleigh Scattering** (瑞利散射) | ✅ | ✅ | I ∝ 1/λ⁴ | 🚀 |

**图例**：
- ✅ 已完成
- 🚧 开发中
- 🌱 基础级
- 🔬 应用级
- 🚀 研究级

---

## 🤖 使用AI生成新演示 (Generate New Demos with AI)

本项目提供了**完整的大模型系统提示词**（AI_CODEGEN_PROMPT.md），可用于ChatGPT、Claude、Gemini等主流大模型生成高质量物理演示代码。

### 使用方法：

#### 步骤1：复制系统提示词
打开 `AI_CODEGEN_PROMPT.md`，复制整个系统提示词部分。

#### 步骤2：发送给大模型
在对话开始时，粘贴系统提示词，然后描述需求：

**示例用户输入**：
```
[系统提示词内容]

请生成一个"法拉第效应"的Python演示代码，展示磁场对偏振光的旋转效应。
```

#### 步骤3：获取代码
AI将生成：
- 完整可运行的Python代码
- 物理公式详细注释
- 交互式可视化
- 运行说明

#### 步骤4：验证和集成
```bash
# 测试生成的代码
python faraday_effect.py

# 如果运行成功，添加到源码库
mv faraday_effect.py src/demo-sources/python/
```

### 支持的AI模型：
- ✅ **ChatGPT** (GPT-4, GPT-4 Turbo)
- ✅ **Claude** (Claude 3 Opus, Claude 3.5 Sonnet)
- ✅ **Gemini** (Gemini Pro, Gemini Ultra)
- ✅ **DeepSeek** (DeepSeek V3)
- ✅ **其他支持长上下文的大模型**

---

## 🎯 代码质量标准 (Code Quality Standards)

所有演示代码遵循以下标准：

### ✅ 独立运行性
- 下载即可运行，无需修改
- 依赖声明清晰（Python: numpy, matplotlib）
- 兼容免费工具（Octave）

### ✅ 物理准确性
- 核心公式带详细注释
- 单位使用国际标准（SI）
- 验证能量守恒/强度归一化

### ✅ 教育友好
- 中英文双语注释
- 物理背景和应用场景
- 适合初学者理解

### ✅ 交互可视化
- 实时参数调整（滑块）
- 多角度可视化（多子图）
- 深色主题统一风格

---

## 📖 使用示例 (Usage Examples)

### 示例1：马吕斯定律演示
```python
# malus_law.py

# 物理原理:
# I = I₀ × cos²(θ)
# 当两个偏振片正交（θ=90°）时，透射光强为0

# 可调参数:
# - 第二个偏振片角度：0-180°
# - 入射光强：0-100 W/m²

# 可视化:
# - 光路图：光源→偏振片1→偏振片2→传感器
# - 曲线图：透射光强 vs 角度（cos²曲线）
# - 信息面板：当前参数和计算结果
```

### 示例2：瑞利散射演示
```python
# rayleigh_scattering.py

# 物理原理:
# I(θ, λ) ∝ (1 + cos²θ) / λ⁴
# 短波长（蓝光）散射强度 >> 长波长（红光）

# 可调参数:
# - 太阳高度角：0-90°（模拟日出到正午）
# - 观察角度：0-180°

# 可视化:
# - 天空场景：太阳位置、天空颜色、观察者
# - 光谱图：散射强度 vs 波长（1/λ⁴关系）
# - 极坐标图：散射角度分布（1 + cos²θ）
```

---

## 🔧 故障排除 (Troubleshooting)

### Python常见问题：

**Q1: ModuleNotFoundError: No module named 'numpy'**
```bash
pip install numpy matplotlib
```

**Q2: matplotlib无法显示中文**
```python
# 在代码开头添加：
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False
```

**Q3: 图形窗口无法显示**
```bash
# macOS
brew install python-tk

# Ubuntu
sudo apt-get install python3-tk
```

### MATLAB/Octave常见问题：

**Q1: Octave警告"缺少uicontrol"**
```matlab
% 确保安装了control包
pkg install -forge control
pkg load control
```

**Q2: 图形显示异常**
```matlab
% 使用Qt后端
graphics_toolkit qt
```

---

## 🌟 贡献指南 (Contributing)

欢迎提交新的物理演示！请遵循以下步骤：

### 1. 使用AI生成代码
参考 `AI_CODEGEN_PROMPT.md`，使用大模型生成高质量代码。

### 2. 本地测试
```bash
# Python
python your_demo.py

# MATLAB/Octave
octave --no-gui --eval "your_demo"
```

### 3. 代码审查清单
- [ ] 独立运行（无外部依赖）
- [ ] 物理公式正确且有注释
- [ ] 中英文双语注释
- [ ] 深色主题样式
- [ ] 至少2个交互参数
- [ ] 包含应用场景说明

### 4. 提交Pull Request
```bash
git add src/demo-sources/python/your_demo.py
git commit -m "feat: add your_demo demonstration"
git push origin your-branch
```

---

## 📊 代码统计 (Code Statistics)

| 语言 | 文件数 | 总行数 | 平均行数/文件 |
|-----|:------:|:------:|:-------------:|
| Python | 7 | ~4000 | ~570 |
| MATLAB | 7 | ~2800 | ~400 |
| **总计** | **14** | **~6800** | **~485** |

**特点**：
- 详细注释占比：~40%
- 物理公式注释：每文件10-20个关键公式
- 交互控件：每文件2-5个滑块/按钮

---

## 🔗 相关资源 (Related Resources)

### 在线演示
- 访问 `/demos` 页面查看Web版交互演示
- 点击**"查看源码"**按钮下载源代码

### 物理学习资源
- [HyperPhysics - 光学](http://hyperphysics.phy-astr.gsu.edu/hbase/phyopt/polarcon.html)
- [RP Photonics Encyclopedia](https://www.rp-photonics.com/)
- 《光学》赵凯华 - 经典中文教材

### AI代码生成
- ChatGPT: https://chat.openai.com
- Claude: https://claude.ai
- Gemini: https://gemini.google.com

---

## 📝 许可证 (License)

MIT License - 自由使用、修改和分发

```
Copyright (c) 2026 PolarCraft Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📧 联系方式 (Contact)

- **GitHub Issues**: 报告问题或建议
- **Email**: polarcraft@example.com
- **Website**: https://polarcraft.example.com

---

**最后更新**: 2026-01-14
**版本**: v1.0
**维护**: PolarCraft Team

🌟 **Happy Coding & Learning Physics!** 🌟
