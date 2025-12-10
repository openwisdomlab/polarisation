/**
 * Life Scene SVG Illustrations
 * 生活场景SVG插图 - 用于课程演示中的真实案例展示
 */
import { useTheme } from '@/contexts/ThemeContext'

// 通用样式
const useColors = () => {
  const { theme } = useTheme()
  return {
    bg: theme === 'dark' ? '#1e293b' : '#f1f5f9',
    primary: theme === 'dark' ? '#22d3ee' : '#0891b2',
    secondary: theme === 'dark' ? '#a78bfa' : '#7c3aed',
    accent: theme === 'dark' ? '#fbbf24' : '#f59e0b',
    text: theme === 'dark' ? '#e2e8f0' : '#334155',
    muted: theme === 'dark' ? '#64748b' : '#94a3b8',
  }
}

// 3D眼镜工作原理
export function ThreeGlassesIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      <defs>
        <linearGradient id="screen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* 3D屏幕 */}
      <rect x="20" y="40" width="120" height="80" rx="5" fill={colors.bg} stroke={colors.muted} strokeWidth="2" />
      <text x="80" y="25" textAnchor="middle" fill={colors.text} fontSize="12">3D Screen</text>
      {/* 左右图像 */}
      <circle cx="55" cy="70" r="15" fill="#ef4444" opacity="0.6" />
      <circle cx="105" cy="70" r="15" fill="#3b82f6" opacity="0.6" />
      <text x="55" y="100" textAnchor="middle" fill={colors.muted} fontSize="8">L</text>
      <text x="105" y="100" textAnchor="middle" fill={colors.muted} fontSize="8">R</text>
      {/* 偏振方向指示 */}
      <g transform="translate(55, 70)">
        <ellipse rx="12" ry="12" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M -8,-8 C -4,-4 4,4 8,8" stroke="#ef4444" strokeWidth="2" fill="none" />
      </g>
      <g transform="translate(105, 70)">
        <ellipse rx="12" ry="12" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d="M -8,8 C -4,4 4,-4 8,-8" stroke="#3b82f6" strokeWidth="2" fill="none" />
      </g>
      {/* 光线传播 */}
      <line x1="140" y1="60" x2="220" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
      <line x1="140" y1="100" x2="220" y2="80" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3" />
      {/* 3D眼镜 */}
      <g transform="translate(220, 50)">
        <rect x="0" y="0" width="150" height="60" rx="30" fill="none" stroke={colors.text} strokeWidth="2" />
        <ellipse cx="40" cy="30" rx="30" ry="25" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="2" />
        <ellipse cx="110" cy="30" rx="30" ry="25" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="2" />
        {/* 圆偏振符号 */}
        <path d="M 30,20 A 10,10 0 1,1 50,20" fill="none" stroke="#ef4444" strokeWidth="2" />
        <polygon points="50,20 46,16 46,24" fill="#ef4444" />
        <path d="M 100,40 A 10,10 0 1,0 120,40" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <polygon points="120,40 116,44 116,36" fill="#3b82f6" />
      </g>
      {/* 眼睛 */}
      <ellipse cx="260" cy="150" rx="15" ry="10" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
      <circle cx="260" cy="150" r="5" fill={colors.text} />
      <ellipse cx="330" cy="150" rx="15" ry="10" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
      <circle cx="330" cy="150" r="5" fill={colors.text} />
      <line x1="260" y1="110" x2="260" y2="140" stroke="#ef4444" strokeWidth="2" />
      <line x1="330" y1="110" x2="330" y2="140" stroke="#3b82f6" strokeWidth="2" />
      {/* 标签 */}
      <text x="260" y="175" textAnchor="middle" fill={colors.muted} fontSize="10">Left Eye</text>
      <text x="330" y="175" textAnchor="middle" fill={colors.muted} fontSize="10">Right Eye</text>
    </svg>
  )
}

// 偏光太阳镜钓鱼场景
export function PolarizedFishingIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* 背景天空 */}
      <rect x="0" y="0" width="400" height="100" fill="#87ceeb" />
      {/* 太阳 */}
      <circle cx="350" cy="40" r="25" fill="#fbbf24" />
      {/* 水面 */}
      <rect x="0" y="100" width="400" height="100" fill="#3b82f6" opacity="0.6" />
      {/* 水面反光 */}
      <g opacity="0.8">
        <line x1="50" y1="105" x2="100" y2="105" stroke="white" strokeWidth="2" />
        <line x1="150" y1="108" x2="200" y2="108" stroke="white" strokeWidth="2" />
        <line x1="250" y1="103" x2="320" y2="103" stroke="white" strokeWidth="2" />
      </g>
      {/* 左边：普通视角（有反光）*/}
      <g transform="translate(50, 0)">
        <text x="50" y="20" textAnchor="middle" fill={colors.text} fontSize="11">Without Polarizer</text>
        {/* 眼睛 */}
        <ellipse cx="50" cy="50" rx="20" ry="15" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        <circle cx="50" cy="50" r="7" fill={colors.text} />
        {/* 视线被反光阻挡 */}
        <line x1="50" y1="65" x2="50" y2="100" stroke={colors.muted} strokeWidth="2" strokeDasharray="5,3" />
        <text x="50" y="170" textAnchor="middle" fill="#ef4444" fontSize="10">Glare blocks view</text>
        {/* 鱼（被遮挡）*/}
        <path d="M 30,140 Q 50,130 70,140 Q 50,150 30,140" fill={colors.muted} opacity="0.3" />
      </g>
      {/* 右边：偏振眼镜视角（清晰）*/}
      <g transform="translate(250, 0)">
        <text x="50" y="20" textAnchor="middle" fill={colors.text} fontSize="11">With Polarizer</text>
        {/* 眼镜框 */}
        <rect x="20" y="35" width="60" height="30" rx="10" fill="none" stroke={colors.primary} strokeWidth="2" />
        {/* 偏振镜片 */}
        <rect x="25" y="40" width="50" height="20" rx="8" fill={colors.primary} opacity="0.3" />
        {/* 视线穿透水面 */}
        <line x1="50" y1="65" x2="50" y2="130" stroke={colors.primary} strokeWidth="2" />
        <text x="50" y="170" textAnchor="middle" fill={colors.primary} fontSize="10">Clear view</text>
        {/* 鱼（清晰可见）*/}
        <path d="M 30,140 Q 50,130 70,140 Q 50,150 30,140" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
        <circle cx="65" cy="138" r="2" fill="white" />
      </g>
      {/* 分隔线 */}
      <line x1="200" y1="10" x2="200" y2="190" stroke={colors.muted} strokeWidth="1" strokeDasharray="5,5" />
    </svg>
  )
}

// 手机屏幕与偏光太阳镜
export function PhonePolarizerIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* 手机 */}
      <g transform="translate(50, 30)">
        <rect x="0" y="0" width="80" height="140" rx="10" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        <rect x="5" y="15" width="70" height="110" fill="#3b82f6" />
        <circle cx="40" cy="135" r="5" fill={colors.muted} />
        <text x="40" y="10" textAnchor="middle" fill={colors.muted} fontSize="6">LCD</text>
      </g>
      {/* 偏振方向指示 - 手机发出的偏振光 */}
      <g transform="translate(130, 70)">
        <line x1="0" y1="0" x2="40" y2="0" stroke={colors.primary} strokeWidth="2" />
        <line x1="0" y1="-20" x2="0" y2="20" stroke={colors.primary} strokeWidth="2" />
        <text x="20" y="35" textAnchor="middle" fill={colors.muted} fontSize="9">Polarized</text>
      </g>
      {/* 正常观看 */}
      <g transform="translate(180, 20)">
        <text x="50" y="0" textAnchor="middle" fill={colors.text} fontSize="10">Normal View</text>
        <rect x="20" y="15" width="60" height="30" rx="10" fill="none" stroke={colors.text} strokeWidth="2" />
        <rect x="25" y="20" width="50" height="20" rx="8" fill={colors.muted} opacity="0.3" />
        <line x1="50" y1="45" x2="50" y2="70" stroke={colors.primary} strokeWidth="2" />
        <ellipse cx="50" cy="85" rx="15" ry="10" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        <circle cx="50" cy="85" r="5" fill={colors.text} />
        <text x="50" y="115" textAnchor="middle" fill={colors.primary} fontSize="9">Bright</text>
      </g>
      {/* 旋转90度观看 */}
      <g transform="translate(290, 20)">
        <text x="50" y="0" textAnchor="middle" fill={colors.text} fontSize="10">Rotated 90°</text>
        <rect x="20" y="15" width="60" height="30" rx="10" fill="none" stroke={colors.text} strokeWidth="2" />
        <rect x="25" y="20" width="50" height="20" rx="8" fill={colors.muted} opacity="0.3" />
        {/* 旋转的偏振方向 */}
        <line x1="30" y1="30" x2="70" y2="30" stroke={colors.secondary} strokeWidth="2" />
        {/* X 表示阻挡 */}
        <g transform="translate(50, 55)">
          <line x1="-10" y1="-10" x2="10" y2="10" stroke="#ef4444" strokeWidth="3" />
          <line x1="10" y1="-10" x2="-10" y2="10" stroke="#ef4444" strokeWidth="3" />
        </g>
        <ellipse cx="50" cy="85" rx="15" ry="10" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        <circle cx="50" cy="85" r="5" fill={colors.muted} />
        <text x="50" y="115" textAnchor="middle" fill="#ef4444" fontSize="9">Dark!</text>
      </g>
      {/* 底部说明 */}
      <text x="200" y="180" textAnchor="middle" fill={colors.muted} fontSize="10">
        LCD screens emit polarized light - sunglasses can block it when rotated
      </text>
    </svg>
  )
}

// 方解石双折射
export function CalciteIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* 背景纸张 */}
      <rect x="20" y="140" width="360" height="50" fill="white" stroke={colors.muted} strokeWidth="1" />
      <text x="120" y="170" textAnchor="middle" fill={colors.text} fontSize="14">CALCITE</text>
      {/* 方解石晶体 */}
      <g transform="translate(100, 40)">
        <path d="M 0,60 L 30,0 L 180,0 L 200,30 L 200,90 L 170,150 L 20,150 L 0,120 Z"
              fill={colors.primary} opacity="0.2" stroke={colors.primary} strokeWidth="2" />
        {/* 晶体内部的光轴 */}
        <line x1="100" y1="20" x2="100" y2="130" stroke={colors.accent} strokeWidth="1" strokeDasharray="5,3" />
        <text x="115" y="75" fill={colors.accent} fontSize="9">Optic Axis</text>
      </g>
      {/* 双像效果 */}
      <g transform="translate(100, 40)">
        {/* o光像 */}
        <text x="80" y="100" fill="#ef4444" fontSize="12" opacity="0.7">CALCITE</text>
        {/* e光像（偏移）*/}
        <text x="100" y="115" fill="#22c55e" fontSize="12" opacity="0.7">CALCITE</text>
      </g>
      {/* 图例 */}
      <g transform="translate(320, 50)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="#ef4444" strokeWidth="2" />
        <text x="15" y="4" fill={colors.muted} fontSize="9">o-ray</text>
        <g transform="translate(0, 20)">
          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#22c55e" strokeWidth="2" />
          <line x1="5" y1="-5" x2="-5" y2="5" stroke="#22c55e" strokeWidth="2" />
        </g>
        <text x="15" y="24" fill={colors.muted} fontSize="9">e-ray</text>
      </g>
      {/* 维京船剪影 */}
      <g transform="translate(320, 130)">
        <path d="M 0,40 Q 30,30 60,40 L 50,40 L 30,20 L 10,40 Z" fill={colors.muted} />
        <line x1="30" y1="5" x2="30" y2="40" stroke={colors.muted} strokeWidth="2" />
        <path d="M 30,10 L 50,25 L 30,30 Z" fill={colors.muted} />
        <text x="30" y="60" textAnchor="middle" fill={colors.muted} fontSize="8">Viking Sunstone</text>
      </g>
    </svg>
  )
}

// 日落湖面反射
export function SunsetLakeIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* 左边：中午 */}
      <g>
        {/* 天空 */}
        <rect x="0" y="0" width="200" height="100" fill="#87ceeb" />
        {/* 太阳 */}
        <circle cx="100" cy="30" r="20" fill="#fbbf24" />
        {/* 水面 */}
        <rect x="0" y="100" width="200" height="100" fill="#3b82f6" opacity="0.5" />
        {/* 可以看到水下的鱼 */}
        <path d="M 80,150 Q 100,140 120,150 Q 100,160 80,150" fill="#f97316" />
        <circle cx="115" cy="148" r="2" fill="white" />
        {/* 光线 */}
        <line x1="100" y1="50" x2="100" y2="100" stroke={colors.accent} strokeWidth="2" strokeDasharray="5,3" />
        <line x1="100" y1="100" x2="100" y2="140" stroke={colors.primary} strokeWidth="2" opacity="0.5" />
        {/* 标签 */}
        <text x="100" y="15" textAnchor="middle" fill={colors.text} fontSize="11">Noon</text>
        <text x="100" y="185" textAnchor="middle" fill={colors.primary} fontSize="9">2% reflection</text>
      </g>
      {/* 分隔线 */}
      <line x1="200" y1="0" x2="200" y2="200" stroke={colors.muted} strokeWidth="1" />
      {/* 右边：日落 */}
      <g transform="translate(200, 0)">
        {/* 天空渐变 */}
        <defs>
          <linearGradient id="sunset-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="100" fill="url(#sunset-sky)" />
        {/* 太阳 */}
        <circle cx="180" cy="80" r="25" fill="#ef4444" />
        {/* 水面 - 镜面反射 */}
        <rect x="0" y="100" width="200" height="100" fill="#1e3a5f" />
        {/* 强反射 */}
        <ellipse cx="160" cy="120" rx="30" ry="10" fill="#ef4444" opacity="0.6" />
        <line x1="140" y1="110" x2="180" y2="110" stroke="#fbbf24" strokeWidth="2" />
        <line x1="150" y1="115" x2="170" y2="115" stroke="#fbbf24" strokeWidth="1" />
        {/* 鱼被遮挡 */}
        <path d="M 80,150 Q 100,140 120,150 Q 100,160 80,150" fill={colors.muted} opacity="0.2" />
        {/* 标签 */}
        <text x="100" y="15" textAnchor="middle" fill={colors.text} fontSize="11">Sunset</text>
        <text x="100" y="185" textAnchor="middle" fill="#ef4444" fontSize="9">50%+ reflection</text>
      </g>
    </svg>
  )
}

// 橱窗摄影对比
export function WindowPhotographyIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* 左边：有反光 */}
      <g>
        {/* 窗户 */}
        <rect x="20" y="30" width="160" height="130" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        {/* 橱窗内容 */}
        <rect x="40" y="60" width="40" height="60" fill={colors.secondary} opacity="0.3" />
        <rect x="100" y="50" width="50" height="80" fill={colors.primary} opacity="0.3" />
        {/* 反光遮挡 */}
        <rect x="20" y="30" width="160" height="130" fill="white" opacity="0.5" />
        <line x1="30" y1="40" x2="80" y2="80" stroke="white" strokeWidth="3" />
        <line x1="100" y1="50" x2="160" y2="100" stroke="white" strokeWidth="3" />
        {/* 相机 */}
        <rect x="70" y="170" width="40" height="25" rx="5" fill={colors.text} />
        <circle cx="90" cy="182" r="8" fill={colors.muted} />
        <text x="100" y="15" textAnchor="middle" fill={colors.text} fontSize="10">Without Filter</text>
      </g>
      {/* 分隔线 */}
      <line x1="200" y1="0" x2="200" y2="200" stroke={colors.muted} strokeWidth="1" />
      {/* 右边：无反光 */}
      <g transform="translate(200, 0)">
        {/* 窗户 */}
        <rect x="20" y="30" width="160" height="130" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
        {/* 橱窗内容清晰可见 */}
        <rect x="40" y="60" width="40" height="60" fill={colors.secondary} stroke={colors.secondary} strokeWidth="1" />
        <rect x="100" y="50" width="50" height="80" fill={colors.primary} stroke={colors.primary} strokeWidth="1" />
        {/* 偏振滤镜相机 */}
        <rect x="70" y="170" width="40" height="25" rx="5" fill={colors.text} />
        <circle cx="90" cy="182" r="8" fill={colors.primary} />
        <circle cx="90" cy="182" r="10" fill="none" stroke={colors.primary} strokeWidth="2" />
        <text x="100" y="15" textAnchor="middle" fill={colors.text} fontSize="10">With Polarizer</text>
      </g>
      {/* 布儒斯特角示意 */}
      <text x="200" y="195" textAnchor="middle" fill={colors.muted} fontSize="9">
        Brewster angle reflection is 100% polarized
      </text>
    </svg>
  )
}

// 应力光弹性
export function PhotoelasticityIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* 偏振片1 */}
      <rect x="20" y="70" width="60" height="60" fill={colors.primary} opacity="0.3" stroke={colors.primary} strokeWidth="2" />
      <text x="50" y="65" textAnchor="middle" fill={colors.muted} fontSize="9">Polarizer</text>
      {/* 光源 */}
      <circle cx="10" cy="100" r="5" fill={colors.accent} />
      <line x1="15" y1="100" x2="20" y2="100" stroke={colors.accent} strokeWidth="2" />
      {/* 塑料模型 */}
      <g transform="translate(100, 50)">
        <path d="M 0,50 L 50,0 L 150,0 L 200,50 L 200,100 L 150,100 L 100,70 L 50,100 L 0,100 Z"
              fill="none" stroke={colors.text} strokeWidth="2" />
        {/* 应力彩色条纹 */}
        <path d="M 20,80 Q 50,60 80,80" fill="none" stroke="#ef4444" strokeWidth="3" />
        <path d="M 25,75 Q 55,55 85,75" fill="none" stroke="#f97316" strokeWidth="3" />
        <path d="M 30,70 Q 60,50 90,70" fill="none" stroke="#fbbf24" strokeWidth="3" />
        <path d="M 35,65 Q 65,45 95,65" fill="none" stroke="#22c55e" strokeWidth="3" />
        <path d="M 40,60 Q 70,40 100,60" fill="none" stroke="#3b82f6" strokeWidth="3" />
        <path d="M 120,30 Q 150,50 120,70" fill="none" stroke="#8b5cf6" strokeWidth="3" />
        <path d="M 130,25 Q 160,45 130,65" fill="none" stroke="#ec4899" strokeWidth="3" />
        {/* 应力箭头 */}
        <polygon points="0,50 -15,40 -15,60" fill="#ef4444" />
        <polygon points="200,50 215,40 215,60" fill="#ef4444" />
      </g>
      {/* 偏振片2 */}
      <rect x="320" y="70" width="60" height="60" fill={colors.secondary} opacity="0.3" stroke={colors.secondary} strokeWidth="2" />
      <text x="350" y="65" textAnchor="middle" fill={colors.muted} fontSize="9">Analyzer</text>
      {/* 观察者 */}
      <ellipse cx="395" cy="100" rx="10" ry="8" fill={colors.bg} stroke={colors.text} strokeWidth="2" />
      {/* 标签 */}
      <text x="200" y="180" textAnchor="middle" fill={colors.text} fontSize="10">
        Stress patterns reveal force distribution
      </text>
    </svg>
  )
}

// 天空散射（蓝天和日落）
export function SkyScatteringIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* 大气层示意 */}
      <defs>
        <linearGradient id="atmos-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#87ceeb" />
        </linearGradient>
      </defs>
      {/* 左边：蓝天原理 */}
      <g>
        <rect x="0" y="0" width="200" height="200" fill="url(#atmos-grad)" />
        {/* 太阳 */}
        <circle cx="100" cy="30" r="20" fill="#fbbf24" />
        {/* 白光 */}
        <line x1="100" y1="50" x2="100" y2="100" stroke="white" strokeWidth="3" />
        {/* 散射的蓝光 */}
        <line x1="100" y1="100" x2="60" y2="140" stroke="#3b82f6" strokeWidth="2" />
        <line x1="100" y1="100" x2="140" y2="140" stroke="#3b82f6" strokeWidth="2" />
        <line x1="100" y1="100" x2="50" y2="100" stroke="#3b82f6" strokeWidth="2" />
        <line x1="100" y1="100" x2="150" y2="100" stroke="#3b82f6" strokeWidth="2" />
        {/* 观察者 */}
        <ellipse cx="70" cy="180" rx="8" ry="6" fill={colors.bg} stroke={colors.text} strokeWidth="1" />
        {/* 看到的蓝天 */}
        <path d="M 60,160 Q 70,150 80,160" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <text x="100" y="195" textAnchor="middle" fill="white" fontSize="10">Blue sky (Rayleigh)</text>
      </g>
      {/* 分隔线 */}
      <line x1="200" y1="0" x2="200" y2="200" stroke="white" strokeWidth="1" opacity="0.5" />
      {/* 右边：日落原理 */}
      <g transform="translate(200, 0)">
        <defs>
          <linearGradient id="sunset-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="200" fill="url(#sunset-grad)" />
        {/* 太阳在地平线 */}
        <circle cx="180" cy="150" r="25" fill="#ef4444" />
        {/* 长路径光线 */}
        <line x1="10" y1="150" x2="155" y2="150" stroke="#ef4444" strokeWidth="3" opacity="0.8" />
        {/* 散射掉的蓝光 */}
        <line x1="50" y1="150" x2="30" y2="120" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        <line x1="80" y1="150" x2="60" y2="110" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        <line x1="110" y1="150" x2="90" y2="100" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        {/* 观察者 */}
        <ellipse cx="20" cy="160" rx="8" ry="6" fill={colors.bg} stroke="white" strokeWidth="1" />
        {/* 看到的红色 */}
        <path d="M 10,140 L 20,155" stroke="#ef4444" strokeWidth="2" />
        <text x="100" y="195" textAnchor="middle" fill="white" fontSize="10">Sunset (long path)</text>
      </g>
      {/* 公式 */}
      <text x="200" y="15" textAnchor="middle" fill="white" fontSize="11">I ∝ 1/λ⁴</text>
    </svg>
  )
}

// 白云与蓝天对比（米氏散射）
export function CloudsVsSkyIllustration() {
  const colors = useColors()
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* 蓝天背景 */}
      <rect x="0" y="0" width="400" height="200" fill="#87ceeb" />
      {/* 白云 */}
      <g>
        <ellipse cx="100" cy="60" rx="50" ry="30" fill="white" />
        <ellipse cx="70" cy="70" rx="35" ry="25" fill="white" />
        <ellipse cx="130" cy="70" rx="35" ry="25" fill="white" />
        <ellipse cx="100" cy="80" rx="45" ry="20" fill="white" />
      </g>
      <g transform="translate(200, 30)">
        <ellipse cx="100" cy="40" rx="60" ry="35" fill="white" />
        <ellipse cx="60" cy="50" rx="40" ry="28" fill="white" />
        <ellipse cx="140" cy="50" rx="40" ry="28" fill="white" />
      </g>
      {/* 分子与水滴对比 */}
      <g transform="translate(50, 130)">
        {/* 空气分子（小） */}
        <circle cx="0" cy="0" r="2" fill={colors.primary} />
        <circle cx="15" cy="5" r="2" fill={colors.primary} />
        <circle cx="8" cy="-8" r="2" fill={colors.primary} />
        <text x="8" y="25" textAnchor="middle" fill={colors.text} fontSize="9">Air molecules</text>
        <text x="8" y="38" textAnchor="middle" fill={colors.text} fontSize="8">(~0.3nm)</text>
        <text x="8" y="55" textAnchor="middle" fill="#3b82f6" fontSize="9">→ Blue scatter</text>
      </g>
      <g transform="translate(180, 130)">
        {/* 水滴（大） */}
        <circle cx="15" cy="0" r="12" fill="white" stroke={colors.muted} strokeWidth="1" />
        <text x="15" y="30" textAnchor="middle" fill={colors.text} fontSize="9">Water droplets</text>
        <text x="15" y="43" textAnchor="middle" fill={colors.text} fontSize="8">(~10μm)</text>
        <text x="15" y="60" textAnchor="middle" fill="white" fontSize="9">→ White scatter</text>
      </g>
      {/* 散射方向对比 */}
      <g transform="translate(300, 130)">
        <text x="30" y="0" textAnchor="middle" fill={colors.text} fontSize="9">Mie: All colors</text>
        <text x="30" y="15" textAnchor="middle" fill={colors.text} fontSize="9">= White</text>
        {/* 多色箭头 */}
        <line x1="10" y1="30" x2="50" y2="30" stroke="#ef4444" strokeWidth="2" />
        <line x1="10" y1="35" x2="50" y2="35" stroke="#22c55e" strokeWidth="2" />
        <line x1="10" y1="40" x2="50" y2="40" stroke="#3b82f6" strokeWidth="2" />
      </g>
    </svg>
  )
}

// 导出所有插图映射
export const LIFE_SCENE_ILLUSTRATIONS: Record<string, React.ComponentType> = {
  'polarization-state': ThreeGlassesIllustration,
  'polarization-intro': PolarizedFishingIllustration,
  'malus': PhonePolarizerIllustration,
  'birefringence': CalciteIllustration,
  'waveplate': ThreeGlassesIllustration,
  'fresnel': SunsetLakeIllustration,
  'brewster': WindowPhotographyIllustration,
  'anisotropy': PhotoelasticityIllustration,
  'chromatic': PhotoelasticityIllustration,
  'rayleigh': SkyScatteringIllustration,
  'mie-scattering': CloudsVsSkyIllustration,
}
