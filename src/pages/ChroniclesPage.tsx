/**
 * Chronicles Page - History of Light and Polarization
 * 光的编年史 - 双线叙事：广义光学 + 偏振光
 *
 * REDESIGNED: Center timeline with optics on left, polarization on right
 * NEW: Interactive optical knowledge graph
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Tabs, Badge } from '@/components/shared'
import {
  Home, Clock, User, Lightbulb, BookOpen, X, MapPin, Calendar,
  Star, ChevronLeft, ChevronRight,
  Sun, Sparkles, Network, Filter, ZoomIn, ZoomOut, Maximize2
} from 'lucide-react'

// Timeline events data - 双轨历史数据
interface TimelineEvent {
  year: number
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  scientistEn?: string
  scientistZh?: string
  category: 'discovery' | 'theory' | 'experiment' | 'application'
  importance: 1 | 2 | 3 // 1 = major milestone, 2 = significant, 3 = notable
  // 双轨分类: 'optics' = 广义光学, 'polarization' = 偏振光专属
  track: 'optics' | 'polarization'
  details?: {
    en: string[]
    zh: string[]
  }
  // 生动的故事叙述
  story?: {
    en: string
    zh: string
  }
  // 科学家生平
  scientistBio?: {
    birthYear?: number
    deathYear?: number
    nationality?: string
    portraitEmoji?: string
    bioEn?: string
    bioZh?: string
  }
  // 历史场景
  scene?: {
    location?: string
    season?: string
    mood?: string
  }
  // 参考文献 (用于事实核查)
  references?: {
    title: string
    url?: string
  }[]
  // 故事真实性标注
  historicalNote?: {
    en: string
    zh: string
  }
  // For knowledge graph connections
  relatedConcepts?: string[]
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  // ===== 广义光学轨道 (General Optics Track) =====
  {
    year: 1621,
    titleEn: 'Snell\'s Law of Refraction',
    titleZh: '斯涅尔折射定律',
    descriptionEn: 'Willebrord Snell discovers the mathematical law governing light refraction at interfaces.',
    descriptionZh: '威理博·斯涅尔发现了光在界面折射时遵循的数学定律。',
    scientistEn: 'Willebrord Snell',
    scientistZh: '威理博·斯涅尔',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: ['n₁ sin θ₁ = n₂ sin θ₂', 'Fundamental law relating incident and refracted angles', 'Foundation for understanding lenses and optical instruments'],
      zh: ['n₁ sin θ₁ = n₂ sin θ₂', '建立入射角与折射角关系的基本定律', '理解透镜和光学仪器的基础']
    },
    scientistBio: {
      birthYear: 1580, deathYear: 1626, nationality: 'Dutch', portraitEmoji: '📏',
      bioEn: 'Willebrord Snellius was a Dutch astronomer and mathematician.',
      bioZh: '威理博·斯涅尔是荷兰天文学家和数学家。'
    },
    relatedConcepts: ['refraction', 'geometric-optics', 'lenses']
  },
  {
    year: 1665,
    titleEn: 'Newton\'s Prism Experiment',
    titleZh: '牛顿三棱镜实验',
    descriptionEn: 'Isaac Newton uses a prism to demonstrate that white light is composed of a spectrum of colors.',
    descriptionZh: '牛顿使用三棱镜证明白光由光谱中的各种颜色组成。',
    scientistEn: 'Isaac Newton',
    scientistZh: '艾萨克·牛顿',
    category: 'experiment',
    importance: 1,
    track: 'optics',
    details: {
      en: ['Performed during plague lockdown at Cambridge', 'Showed white light splits into spectrum', 'Proved colors are inherent properties of light'],
      zh: ['在瘟疫封锁期间于剑桥进行', '展示白光分解为光谱', '证明颜色是光的固有属性']
    },
    story: {
      en: `In 1665, the Great Plague forced Cambridge University to close. A young Isaac Newton, just 23, retreated to his family's farm. There, he purchased a glass prism at a country fair. When the white beam passed through the prism, it spread into a rainbow — a spectrum of colors. This insight became the foundation of spectroscopy.`,
      zh: `1665年，大瘟疫迫使剑桥大学关闭。年仅23岁的牛顿回到家乡。他在集市上买了一块玻璃棱镜。当白光穿过棱镜时，它展开成一道彩虹——从红到紫的光谱。这一洞见成为光谱学的基础。`
    },
    scientistBio: {
      birthYear: 1643, deathYear: 1727, nationality: 'English', portraitEmoji: '🍎',
      bioEn: 'Sir Isaac Newton made seminal contributions to optics, calculus, and mechanics.',
      bioZh: '艾萨克·牛顿爵士对光学、微积分和力学做出了开创性贡献。'
    },
    relatedConcepts: ['dispersion', 'spectrum', 'color-theory']
  },
  {
    year: 1669,
    titleEn: 'Discovery of Double Refraction',
    titleZh: '双折射现象的发现',
    descriptionEn: 'Erasmus Bartholin discovers that calcite crystals produce double images, the first observation of birefringence.',
    descriptionZh: '巴托林发现方解石晶体能产生双像，这是人类首次观察到双折射现象。',
    scientistEn: 'Erasmus Bartholin',
    scientistZh: '伊拉斯谟·巴托林',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: ['Objects viewed through Iceland spar appeared double', 'Called the phenomenon "strange refraction"', 'Later explained by polarization theory'],
      zh: ['通过冰洲石观看物体会出现双像', '称这一现象为"奇异折射"', '后来被偏振理论所解释']
    },
    story: {
      en: `In 1669, in Copenhagen, Professor Erasmus Bartholin placed a crystal of Iceland spar on a paper marked with a single dot. He saw two dots! As he rotated the crystal, one image stayed still while the other danced around it. He had stumbled upon birefringence.`,
      zh: `1669年，哥本哈根的巴托林教授将一块冰洲石放在画有单点的纸上。他看到了两个点！当他转动晶体时，一个像保持不动，另一个却绕着它旋转。他偶然发现了双折射现象。`
    },
    scientistBio: {
      birthYear: 1625, deathYear: 1698, nationality: 'Danish', portraitEmoji: '👨‍🔬',
      bioEn: 'Erasmus Bartholin was a Danish physician, mathematician, and physicist.',
      bioZh: '伊拉斯谟·巴托林是丹麦医生、数学家和物理学家。'
    },
    relatedConcepts: ['birefringence', 'calcite', 'crystal-optics']
  },
  {
    year: 1676,
    titleEn: 'First Measurement of Light Speed',
    titleZh: '首次测量光速',
    descriptionEn: 'Ole Rømer calculates the speed of light by observing the moons of Jupiter.',
    descriptionZh: '奥勒·罗默通过观测木星卫星计算出光速，证明光以有限速度传播。',
    scientistEn: 'Ole Rømer',
    scientistZh: '奥勒·罗默',
    category: 'discovery',
    importance: 1,
    track: 'optics',
    details: {
      en: ['Observed delays in eclipses of Jupiter\'s moon Io', 'Calculated light speed as ~220,000 km/s', 'First proof that light doesn\'t travel instantaneously'],
      zh: ['观测到木卫一被木星遮挡时间的延迟', '计算出光速约为220,000公里/秒', '首次证明光不是瞬时传播']
    },
    scientistBio: {
      birthYear: 1644, deathYear: 1710, nationality: 'Danish', portraitEmoji: '🪐',
      bioEn: 'Ole Rømer was a Danish astronomer who made the first quantitative measurements of the speed of light.',
      bioZh: '奥勒·罗默是丹麦天文学家，首次对光速进行了定量测量。'
    },
    relatedConcepts: ['speed-of-light', 'astronomy', 'measurement']
  },
  {
    year: 1690,
    titleEn: 'Huygens\' Wave Theory',
    titleZh: '惠更斯的波动理论',
    descriptionEn: 'Christiaan Huygens proposes the wave theory of light and attempts to explain double refraction.',
    descriptionZh: '惠更斯提出光的波动理论，并尝试解释双折射现象。',
    scientistEn: 'Christiaan Huygens',
    scientistZh: '克里斯蒂安·惠更斯',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: ['Published "Treatise on Light"', 'Introduced Huygens\' principle (wavelet construction)', 'Explained ordinary and extraordinary rays using different wave velocities'],
      zh: ['出版《光论》', '提出惠更斯原理（波动构造法）', '用不同的波速解释了寻常光和非常光']
    },
    story: {
      en: `In 1690, Huygens imagined each point on a wavefront as a tiny source of new wavelets, spreading outward like ripples on a pond. This "Huygens' Principle" elegantly explained reflection and refraction. Inside crystals, he proposed two types of waves traveling at different speeds.`,
      zh: `1690年，惠更斯想象波前的每一个点都是一个微小的波源，向四周散开，就像池塘里的涟漪。这个"惠更斯原理"优雅地解释了反射和折射。在晶体内部，他提出存在两种以不同速度传播的波。`
    },
    scientistBio: {
      birthYear: 1629, deathYear: 1695, nationality: 'Dutch', portraitEmoji: '🔭',
      bioEn: 'Christiaan Huygens was a Dutch polymath who made groundbreaking contributions to optics and astronomy.',
      bioZh: '克里斯蒂安·惠更斯是荷兰博学家，在光学和天文学领域做出了开创性贡献。'
    },
    relatedConcepts: ['wave-theory', 'huygens-principle', 'diffraction']
  },
  {
    year: 1801,
    titleEn: 'Young\'s Double-Slit Experiment',
    titleZh: '杨氏双缝实验',
    descriptionEn: 'Thomas Young demonstrates light interference, providing strong evidence for the wave theory of light.',
    descriptionZh: '托马斯·杨演示了光的干涉现象，为光的波动理论提供了有力证据。',
    scientistEn: 'Thomas Young',
    scientistZh: '托马斯·杨',
    category: 'experiment',
    importance: 1,
    track: 'optics',
    details: {
      en: ['Light through two slits creates interference pattern', 'Bright and dark bands prove wave-like behavior', 'Foundation for quantum mechanics (later)'],
      zh: ['光通过两条狭缝后产生干涉图案', '明暗条纹证明了光的波动性', '量子力学的基础（后来）']
    },
    story: {
      en: `In 1801, Thomas Young let sunlight pass through two closely spaced slits. On the screen behind, instead of two bright lines, he saw alternating bright and dark bands — interference! "Light behaves as a wave," Young concluded.`,
      zh: `1801年，托马斯·杨让阳光通过两条紧密相邻的狭缝。在后面的屏幕上，他看到的不是两条亮线，而是一系列明暗交替条纹——干涉！"光像波一样传播，"杨得出结论。`
    },
    scientistBio: {
      birthYear: 1773, deathYear: 1829, nationality: 'English', portraitEmoji: '🌊',
      bioEn: 'Thomas Young was an English polymath who helped decipher the Rosetta Stone and proposed trichromatic color vision.',
      bioZh: '托马斯·杨是英国博学家，帮助解读了罗塞塔石碑，并提出了三色视觉理论。'
    },
    relatedConcepts: ['interference', 'wave-theory', 'double-slit']
  },
  {
    year: 1808,
    titleEn: 'Discovery of Polarization by Reflection',
    titleZh: '反射偏振的发现',
    descriptionEn: 'Étienne-Louis Malus discovers that light reflected from glass becomes polarized.',
    descriptionZh: '马吕斯在观察卢森堡宫时，发现玻璃反射的光会发生偏振。',
    scientistEn: 'Étienne-Louis Malus',
    scientistZh: '艾蒂安-路易·马吕斯',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: ['Looking at sunset through calcite crystal', 'Double image intensity changed as crystal rotated', 'Coined the term "polarization"'],
      zh: ['通过方解石晶体观看夕阳的反射', '旋转晶体时双像的强度会变化', '创造了"偏振"一词']
    },
    story: {
      en: `It was a golden autumn evening in Paris, 1808. Malus held a calcite crystal up to the reflected sunlight from the Luxembourg Palace windows. As he rotated the crystal, one image faded while the other grew brighter! He had discovered polarization by reflection.`,
      zh: `1808年，巴黎的一个金色秋日傍晚。马吕斯手持方解石晶体对着卢森堡宫窗户反射的阳光观看。当他转动晶体时，一个像变淡，另一个却变亮！他发现了反射偏振。`
    },
    scientistBio: {
      birthYear: 1775, deathYear: 1812, nationality: 'French', portraitEmoji: '🎖️',
      bioEn: 'Étienne-Louis Malus was a French military engineer and physicist who participated in Napoleon\'s Egyptian campaign.',
      bioZh: '艾蒂安-路易·马吕斯是法国军事工程师和物理学家，参加过拿破仑的埃及远征。'
    },
    relatedConcepts: ['polarization', 'reflection', 'malus-law']
  },
  {
    year: 1809,
    titleEn: 'Malus\'s Law',
    titleZh: '马吕斯定律',
    descriptionEn: 'Malus formulates the law describing how polarized light intensity varies with analyzer angle: I = I₀cos²θ.',
    descriptionZh: '马吕斯提出描述偏振光强度随检偏器角度变化的定律：I = I₀cos²θ。',
    scientistEn: 'Étienne-Louis Malus',
    scientistZh: '艾蒂安-路易·马吕斯',
    category: 'theory',
    importance: 1,
    track: 'polarization',
    details: {
      en: ['Intensity follows cosine-squared relationship', 'At θ = 90°, no light passes (crossed polarizers)', 'Fundamental to all polarization applications'],
      zh: ['透射光强度遵循余弦平方关系', '当 θ = 90° 时，没有光通过', '所有偏振应用的基础']
    },
    scientistBio: {
      birthYear: 1775, deathYear: 1812, nationality: 'French', portraitEmoji: '🎖️',
      bioEn: 'Malus died at just 37 from tuberculosis but his elegant equation became immortal.',
      bioZh: '马吕斯年仅37岁便因肺结核去世，但他优雅的方程式变得不朽。'
    },
    relatedConcepts: ['malus-law', 'polarizer', 'intensity']
  },
  {
    year: 1811,
    titleEn: 'Brewster\'s Angle',
    titleZh: '布儒斯特角',
    descriptionEn: 'David Brewster discovers the angle at which reflected light is completely polarized.',
    descriptionZh: '布儒斯特发现反射光完全偏振时的特定角度。',
    scientistEn: 'David Brewster',
    scientistZh: '大卫·布儒斯特',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: ['At Brewster\'s angle, reflected light is 100% polarized', 'tan(θB) = n₂/n₁', 'Used in polarizing windows and laser optics'],
      zh: ['在布儒斯特角下，反射光100%偏振', 'tan(θB) = n₂/n₁', '用于偏振窗和激光光学']
    },
    scientistBio: {
      birthYear: 1781, deathYear: 1868, nationality: 'Scottish', portraitEmoji: '🔬',
      bioEn: 'Sir David Brewster invented the kaleidoscope and pioneered photography.',
      bioZh: '大卫·布儒斯特爵士发明了万花筒，并开创了摄影技术。'
    },
    relatedConcepts: ['brewster-angle', 'reflection', 'polarization']
  },
  {
    year: 1815,
    titleEn: 'Fresnel\'s Wave Theory',
    titleZh: '菲涅尔的波动理论',
    descriptionEn: 'Augustin-Jean Fresnel develops a comprehensive wave theory explaining diffraction and polarization.',
    descriptionZh: '菲涅尔发展出完整的波动理论，解释了衍射和偏振现象。',
    scientistEn: 'Augustin-Jean Fresnel',
    scientistZh: '奥古斯丁-让·菲涅尔',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: ['Light waves are transverse (perpendicular to propagation)', 'Fresnel equations for reflection and transmission', 'Invented Fresnel lens for lighthouses'],
      zh: ['光波是横波（垂直于传播方向）', '菲涅尔反射和透射方程', '发明了用于灯塔的菲涅尔透镜']
    },
    story: {
      en: `In 1815, Fresnel proposed that light waves were transverse — vibrating perpendicular to their direction of travel. When physicist Poisson mockingly predicted a bright spot in the center of a circular shadow, Arago performed the experiment — and found it. The "Poisson spot" vindicated wave theory.`,
      zh: `1815年，菲涅尔提出光波是横波——振动垂直于传播方向。当物理学家泊松嘲讽地预测圆形阴影中心应有一个亮点时，阿拉戈做了实验——真的出现了。"泊松亮斑"证明了波动理论。`
    },
    scientistBio: {
      birthYear: 1788, deathYear: 1827, nationality: 'French', portraitEmoji: '🌊',
      bioEn: 'Augustin-Jean Fresnel was a French civil engineer who fundamentally advanced wave theory despite suffering from tuberculosis.',
      bioZh: '奥古斯丁-让·菲涅尔是法国土木工程师，尽管饱受肺结核困扰，仍从根本上推进了波动理论。'
    },
    relatedConcepts: ['wave-theory', 'fresnel-equations', 'diffraction', 'transverse-wave']
  },
  {
    year: 1828,
    titleEn: 'Nicol Prism',
    titleZh: '尼科尔棱镜',
    descriptionEn: 'William Nicol invents the first practical polarizing prism using calcite.',
    descriptionZh: '尼科尔发明了第一个实用的偏振棱镜，使用方解石制成。',
    scientistEn: 'William Nicol',
    scientistZh: '威廉·尼科尔',
    category: 'experiment',
    importance: 2,
    track: 'polarization',
    details: {
      en: ['Two calcite prisms cemented with Canada balsam', 'Ordinary ray is totally internally reflected', 'Widely used in microscopy'],
      zh: ['两个用加拿大树脂胶合的方解石棱镜', '寻常光全反射被吸收', '广泛用于显微镜']
    },
    scientistBio: {
      birthYear: 1770, deathYear: 1851, nationality: 'Scottish', portraitEmoji: '💎',
      bioEn: 'William Nicol never patented his invention, giving it freely to science.',
      bioZh: '威廉·尼科尔从未为他的发明申请专利，将它无偿献给了科学。'
    },
    relatedConcepts: ['nicol-prism', 'polarizer', 'calcite', 'total-internal-reflection']
  },
  {
    year: 1852,
    titleEn: 'Stokes Parameters',
    titleZh: '斯托克斯参数',
    descriptionEn: 'George Gabriel Stokes introduces a mathematical framework to describe polarization states.',
    descriptionZh: '斯托克斯引入描述偏振态的数学框架。',
    scientistEn: 'George Gabriel Stokes',
    scientistZh: '乔治·加布里埃尔·斯托克斯',
    category: 'theory',
    importance: 2,
    track: 'polarization',
    details: {
      en: ['Four parameters (S₀, S₁, S₂, S₃) describe any polarization state', 'Can represent partially polarized and unpolarized light', 'Foundation for modern polarimetry'],
      zh: ['四个参数（S₀, S₁, S₂, S₃）完整描述任何偏振态', '可以表示部分偏振和非偏振光', '现代偏振测量学的基础']
    },
    scientistBio: {
      birthYear: 1819, deathYear: 1903, nationality: 'Irish-British', portraitEmoji: '📐',
      bioEn: 'Sir George Gabriel Stokes served as Lucasian Professor at Cambridge for over 50 years and as President of the Royal Society.',
      bioZh: '乔治·加布里埃尔·斯托克斯爵士在剑桥担任卢卡斯教授超过50年，并曾担任皇家学会主席。'
    },
    relatedConcepts: ['stokes-parameters', 'polarimetry', 'mueller-matrix']
  },
  {
    year: 1865,
    titleEn: 'Maxwell\'s Electromagnetic Theory',
    titleZh: '麦克斯韦电磁理论',
    descriptionEn: 'James Clerk Maxwell unifies electricity, magnetism, and optics, showing light is an electromagnetic wave.',
    descriptionZh: '麦克斯韦统一了电、磁和光学，证明光是电磁波。',
    scientistEn: 'James Clerk Maxwell',
    scientistZh: '詹姆斯·克拉克·麦克斯韦',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: ['Four equations describe all electromagnetic phenomena', 'Electromagnetic waves travel at the speed of light', 'Foundation for radio, TV, wireless communication'],
      zh: ['四个方程描述所有电磁现象', '电磁波以光速传播', '无线电、电视、无线通信的基础']
    },
    story: {
      en: `In 1865, Maxwell derived that electromagnetic disturbances travel as waves at about 310,000 km/s — suspiciously close to the speed of light. "Light consists in the transverse undulations of the same medium which is the cause of electric and magnetic phenomena." Light itself was an electromagnetic wave!`,
      zh: `1865年，麦克斯韦推导出电磁扰动以约310,000公里/秒的速度以波的形式传播——与光速惊人地接近。"光由同一介质的横向波动组成，而这种介质正是电磁现象的原因。"光本身就是电磁波！`
    },
    scientistBio: {
      birthYear: 1831, deathYear: 1879, nationality: 'Scottish', portraitEmoji: '⚡',
      bioEn: 'James Clerk Maxwell formulated classical electromagnetic theory. Einstein called his work "the most profound since Newton."',
      bioZh: '詹姆斯·克拉克·麦克斯韦建立了经典电磁理论。爱因斯坦称他的工作是"自牛顿以来最深刻的"。'
    },
    relatedConcepts: ['maxwell-equations', 'electromagnetic-wave', 'light-as-wave']
  },
  {
    year: 1929,
    titleEn: 'Polaroid Filter',
    titleZh: '宝丽来偏振片',
    descriptionEn: 'Edwin Land invents the first synthetic sheet polarizer, revolutionizing polarization applications.',
    descriptionZh: '埃德温·兰德发明了第一种合成薄片偏振器，彻底改变了偏振应用。',
    scientistEn: 'Edwin Land',
    scientistZh: '埃德温·兰德',
    category: 'application',
    importance: 1,
    track: 'polarization',
    details: {
      en: ['Aligned microscopic crystals in a plastic sheet', 'Made polarizers cheap and widely available', 'Enabled polarized sunglasses, 3D movies'],
      zh: ['在塑料片中排列微小晶体', '使偏振器变得便宜且广泛可用', '使偏振太阳镜、3D电影成为可能']
    },
    story: {
      en: `In 1926, a 17-year-old Edwin Land was bothered by headlight glare in Times Square. He dropped out of Harvard to solve this problem. By suspending needle-like crystals in liquid and drawing them through narrow slots, he created the first sheet polarizer. "Polaroid" was born in 1929.`,
      zh: `1926年，17岁的埃德温·兰德在时代广场被汽车前灯眩光所困扰。他从哈佛退学来解决这个问题。通过将针状晶体悬浮在液体中并拉过狭窄的缝隙，他创造了第一种薄片偏振器。1929年，"宝丽来"诞生。`
    },
    scientistBio: {
      birthYear: 1909, deathYear: 1991, nationality: 'American', portraitEmoji: '📸',
      bioEn: 'Edwin Land held 535 US patents, second only to Edison. He also invented instant photography.',
      bioZh: '埃德温·兰德持有535项美国专利，仅次于爱迪生。他还发明了即时摄影。'
    },
    relatedConcepts: ['sheet-polarizer', 'dichroic', 'applications']
  },
  {
    year: 1971,
    titleEn: 'LCD Technology',
    titleZh: 'LCD技术',
    descriptionEn: 'First practical liquid crystal display using polarization principles is demonstrated.',
    descriptionZh: '首个使用偏振原理的实用液晶显示器被展示。',
    category: 'application',
    importance: 2,
    track: 'polarization',
    details: {
      en: ['Two crossed polarizers with liquid crystals between', 'Electric field controls polarization rotation', 'Now ubiquitous in screens worldwide'],
      zh: ['两个正交偏振器，中间夹有液晶', '电场控制偏振旋转', '现在广泛用于全世界的屏幕']
    },
    scientistBio: {
      portraitEmoji: '📺',
      bioEn: 'LCD technology was developed by multiple researchers including George Heilmeier and James Fergason.',
      bioZh: 'LCD技术由多位研究人员共同开发，包括乔治·海尔迈尔和詹姆斯·弗格森。'
    },
    relatedConcepts: ['lcd', 'liquid-crystal', 'display-technology']
  },
  {
    year: 2012,
    titleEn: 'Mantis Shrimp Polarization Vision',
    titleZh: '螳螂虾偏振视觉',
    descriptionEn: 'Researchers discover mantis shrimp can detect circular polarization — unique in the animal kingdom.',
    descriptionZh: '研究人员发现螳螂虾能够探测圆偏振光——这是其他任何动物都没有的独特能力。',
    scientistEn: 'Justin Marshall et al.',
    scientistZh: '贾斯汀·马歇尔等',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: ['Mantis shrimp have 16 types of photoreceptors', 'Can see both linear and circular polarization', 'Inspires development of compact polarization cameras'],
      zh: ['螳螂虾有16种光感受器', '能看到线偏振和圆偏振光', '启发了紧凑型偏振相机的开发']
    },
    scientistBio: {
      portraitEmoji: '🦐',
      bioEn: 'Justin Marshall is an Australian marine neuroscientist at the University of Queensland.',
      bioZh: '贾斯汀·马歇尔是昆士兰大学的澳大利亚海洋神经科学家。'
    },
    relatedConcepts: ['bio-optics', 'circular-polarization', 'vision']
  },
  {
    year: 2018,
    titleEn: 'Polarimetric Medical Imaging',
    titleZh: '偏振医学成像',
    descriptionEn: 'Mueller matrix polarimetry enables non-invasive cancer detection by analyzing tissue birefringence changes.',
    descriptionZh: '穆勒矩阵偏振测量通过分析组织双折射变化，实现无创癌症检测。',
    category: 'application',
    importance: 2,
    track: 'polarization',
    details: {
      en: ['Cancerous tissue has different polarization properties', 'Non-invasive, label-free imaging', 'Showing promise for surgical guidance'],
      zh: ['癌变组织有不同的偏振特性', '无创、无标记成像', '在手术引导方面显示出前景']
    },
    scientistBio: {
      portraitEmoji: '🏥',
      bioEn: 'Mueller matrix polarimetry for medical imaging has been advanced by research groups worldwide.',
      bioZh: '医学成像的穆勒矩阵偏振测量技术由世界各地的研究团队推动发展。'
    },
    relatedConcepts: ['mueller-matrix', 'medical-imaging', 'polarimetry']
  },
  {
    year: 2021,
    titleEn: 'Metasurface Polarization Control',
    titleZh: '超表面偏振调控',
    descriptionEn: 'Programmable metasurfaces achieve dynamic, pixel-level control of light polarization.',
    descriptionZh: '可编程超表面实现对光偏振的动态像素级控制。',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: ['Sub-wavelength nanostructures manipulate light', 'Dynamic polarization state switching', 'Opens path to holographic displays and LiDAR'],
      zh: ['亚波长纳米结构操控光', '动态偏振态切换', '为全息显示和LiDAR开辟道路']
    },
    scientistBio: {
      portraitEmoji: '🔬',
      bioEn: 'Metasurface research is led by groups at Caltech, Harvard, and universities worldwide.',
      bioZh: '超表面研究由加州理工学院、哈佛大学以及世界各地大学的团队领导。'
    },
    relatedConcepts: ['metasurface', 'nanophotonics', 'dynamic-control']
  },
  {
    year: 2023,
    titleEn: 'Quantum Polarimetry',
    titleZh: '量子偏振测量',
    descriptionEn: 'Quantum-enhanced polarimetric measurements surpass classical sensitivity limits.',
    descriptionZh: '量子增强偏振测量超越经典灵敏度极限。',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: ['Entangled photons enable sub-shot-noise measurements', 'Applications in pharmaceutical and biosensing', 'Bridges quantum optics with practical polarimetry'],
      zh: ['纠缠光子实现亚散粒噪声测量', '在药品和生物传感中的应用', '将量子光学与实用偏振测量连接']
    },
    scientistBio: {
      portraitEmoji: '⚛️',
      bioEn: 'Quantum polarimetry research is conducted at leading quantum optics centers worldwide.',
      bioZh: '量子偏振测量研究在全球领先的量子光学中心进行。'
    },
    relatedConcepts: ['quantum-optics', 'entanglement', 'precision-measurement']
  },
]

// Knowledge graph data - 光学知识图谱数据
interface KnowledgeNode {
  id: string
  labelEn: string
  labelZh: string
  category: 'fundamental' | 'phenomenon' | 'device' | 'application' | 'theory'
  descriptionEn: string
  descriptionZh: string
  x?: number
  y?: number
}

interface KnowledgeLink {
  source: string
  target: string
  relationEn: string
  relationZh: string
  strength: number // 1-3, affects line thickness
}

const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // Fundamental concepts
  { id: 'light-wave', labelEn: 'Light Wave', labelZh: '光波', category: 'fundamental', descriptionEn: 'Electromagnetic radiation visible to human eye', descriptionZh: '人眼可见的电磁辐射' },
  { id: 'polarization', labelEn: 'Polarization', labelZh: '偏振', category: 'fundamental', descriptionEn: 'Orientation of light wave oscillation', descriptionZh: '光波振动的方向性' },
  { id: 'refraction', labelEn: 'Refraction', labelZh: '折射', category: 'phenomenon', descriptionEn: 'Bending of light at interface', descriptionZh: '光在界面处的弯曲' },
  { id: 'reflection', labelEn: 'Reflection', labelZh: '反射', category: 'phenomenon', descriptionEn: 'Light bouncing off surface', descriptionZh: '光从表面反弹' },
  { id: 'interference', labelEn: 'Interference', labelZh: '干涉', category: 'phenomenon', descriptionEn: 'Superposition of waves', descriptionZh: '波的叠加' },
  { id: 'diffraction', labelEn: 'Diffraction', labelZh: '衍射', category: 'phenomenon', descriptionEn: 'Bending around obstacles', descriptionZh: '绕过障碍物弯曲' },
  { id: 'birefringence', labelEn: 'Birefringence', labelZh: '双折射', category: 'phenomenon', descriptionEn: 'Double refraction in crystals', descriptionZh: '晶体中的双重折射' },
  // Theories
  { id: 'wave-theory', labelEn: 'Wave Theory', labelZh: '波动理论', category: 'theory', descriptionEn: 'Light as electromagnetic wave', descriptionZh: '光作为电磁波' },
  { id: 'maxwell-equations', labelEn: 'Maxwell Equations', labelZh: '麦克斯韦方程', category: 'theory', descriptionEn: 'Four equations unifying EM', descriptionZh: '统一电磁现象的四个方程' },
  { id: 'malus-law', labelEn: 'Malus\'s Law', labelZh: '马吕斯定律', category: 'theory', descriptionEn: 'I = I₀cos²θ', descriptionZh: 'I = I₀cos²θ' },
  { id: 'brewster-law', labelEn: 'Brewster\'s Law', labelZh: '布儒斯特定律', category: 'theory', descriptionEn: 'tan(θB) = n₂/n₁', descriptionZh: 'tan(θB) = n₂/n₁' },
  { id: 'stokes-params', labelEn: 'Stokes Parameters', labelZh: '斯托克斯参数', category: 'theory', descriptionEn: 'S₀, S₁, S₂, S₃', descriptionZh: 'S₀, S₁, S₂, S₃' },
  { id: 'mueller-matrix', labelEn: 'Mueller Matrix', labelZh: '穆勒矩阵', category: 'theory', descriptionEn: '4×4 polarization transfer', descriptionZh: '4×4偏振传递矩阵' },
  // Devices
  { id: 'polarizer', labelEn: 'Polarizer', labelZh: '偏振片', category: 'device', descriptionEn: 'Filters light by polarization', descriptionZh: '按偏振方向过滤光' },
  { id: 'waveplate', labelEn: 'Wave Plate', labelZh: '波片', category: 'device', descriptionEn: 'Retards polarization components', descriptionZh: '延迟偏振分量' },
  { id: 'calcite', labelEn: 'Calcite Crystal', labelZh: '方解石', category: 'device', descriptionEn: 'Birefringent natural crystal', descriptionZh: '双折射天然晶体' },
  { id: 'pbs', labelEn: 'Beam Splitter', labelZh: '分束器', category: 'device', descriptionEn: 'Splits beam by polarization', descriptionZh: '按偏振分离光束' },
  { id: 'lcd-panel', labelEn: 'LCD Panel', labelZh: 'LCD面板', category: 'device', descriptionEn: 'Liquid crystal display', descriptionZh: '液晶显示器' },
  { id: 'metasurface', labelEn: 'Metasurface', labelZh: '超表面', category: 'device', descriptionEn: 'Nanostructured optical surface', descriptionZh: '纳米结构光学表面' },
  // Applications
  { id: 'sunglasses', labelEn: 'Polarized Sunglasses', labelZh: '偏振太阳镜', category: 'application', descriptionEn: 'Glare reduction eyewear', descriptionZh: '减少眩光的眼镜' },
  { id: '3d-cinema', labelEn: '3D Cinema', labelZh: '3D电影', category: 'application', descriptionEn: 'Stereoscopic display', descriptionZh: '立体显示' },
  { id: 'medical-imaging', labelEn: 'Medical Imaging', labelZh: '医学成像', category: 'application', descriptionEn: 'Cancer detection, tissue analysis', descriptionZh: '癌症检测、组织分析' },
  { id: 'remote-sensing', labelEn: 'Remote Sensing', labelZh: '遥感', category: 'application', descriptionEn: 'Earth observation, astronomy', descriptionZh: '地球观测、天文学' },
  { id: 'optical-comm', labelEn: 'Optical Communication', labelZh: '光通信', category: 'application', descriptionEn: 'Fiber optics, free-space', descriptionZh: '光纤、自由空间' },
]

const KNOWLEDGE_LINKS: KnowledgeLink[] = [
  // Light wave connections
  { source: 'light-wave', target: 'polarization', relationEn: 'has property', relationZh: '具有属性', strength: 3 },
  { source: 'light-wave', target: 'wave-theory', relationEn: 'described by', relationZh: '由...描述', strength: 3 },
  { source: 'light-wave', target: 'refraction', relationEn: 'exhibits', relationZh: '表现出', strength: 2 },
  { source: 'light-wave', target: 'reflection', relationEn: 'exhibits', relationZh: '表现出', strength: 2 },
  { source: 'light-wave', target: 'interference', relationEn: 'exhibits', relationZh: '表现出', strength: 2 },
  { source: 'light-wave', target: 'diffraction', relationEn: 'exhibits', relationZh: '表现出', strength: 2 },
  // Polarization connections
  { source: 'polarization', target: 'malus-law', relationEn: 'governed by', relationZh: '遵循', strength: 3 },
  { source: 'polarization', target: 'stokes-params', relationEn: 'measured by', relationZh: '用...测量', strength: 3 },
  { source: 'polarization', target: 'birefringence', relationEn: 'related to', relationZh: '相关于', strength: 2 },
  { source: 'polarization', target: 'polarizer', relationEn: 'filtered by', relationZh: '由...过滤', strength: 3 },
  // Device connections
  { source: 'polarizer', target: 'malus-law', relationEn: 'follows', relationZh: '遵循', strength: 3 },
  { source: 'polarizer', target: 'sunglasses', relationEn: 'used in', relationZh: '用于', strength: 2 },
  { source: 'polarizer', target: 'lcd-panel', relationEn: 'component of', relationZh: '是...的组件', strength: 3 },
  { source: 'waveplate', target: 'birefringence', relationEn: 'utilizes', relationZh: '利用', strength: 3 },
  { source: 'calcite', target: 'birefringence', relationEn: 'exhibits', relationZh: '表现出', strength: 3 },
  { source: 'pbs', target: 'polarization', relationEn: 'separates by', relationZh: '按...分离', strength: 3 },
  // Theory connections
  { source: 'wave-theory', target: 'maxwell-equations', relationEn: 'formalized by', relationZh: '由...形式化', strength: 3 },
  { source: 'maxwell-equations', target: 'light-wave', relationEn: 'describes', relationZh: '描述', strength: 3 },
  { source: 'stokes-params', target: 'mueller-matrix', relationEn: 'extended by', relationZh: '扩展为', strength: 3 },
  { source: 'mueller-matrix', target: 'medical-imaging', relationEn: 'enables', relationZh: '使能', strength: 2 },
  // Application connections
  { source: 'lcd-panel', target: '3d-cinema', relationEn: 'enables', relationZh: '使能', strength: 2 },
  { source: 'brewster-law', target: 'reflection', relationEn: 'explains', relationZh: '解释', strength: 3 },
  { source: 'reflection', target: 'polarization', relationEn: 'induces', relationZh: '产生', strength: 2 },
  { source: 'metasurface', target: 'polarization', relationEn: 'controls', relationZh: '控制', strength: 3 },
  { source: 'stokes-params', target: 'remote-sensing', relationEn: 'used in', relationZh: '用于', strength: 2 },
  { source: 'optical-comm', target: 'polarization', relationEn: 'utilizes', relationZh: '利用', strength: 2 },
]

const CATEGORY_LABELS = {
  discovery: { en: 'Discovery', zh: '发现', color: 'blue' as const },
  theory: { en: 'Theory', zh: '理论', color: 'purple' as const },
  experiment: { en: 'Experiment', zh: '实验', color: 'green' as const },
  application: { en: 'Application', zh: '应用', color: 'orange' as const },
}

const NODE_CATEGORY_COLORS = {
  fundamental: { bg: '#3b82f6', border: '#1d4ed8' },
  phenomenon: { bg: '#8b5cf6', border: '#6d28d9' },
  device: { bg: '#10b981', border: '#047857' },
  application: { bg: '#f59e0b', border: '#d97706' },
  theory: { bg: '#ef4444', border: '#dc2626' },
}

// Story Modal Component
interface StoryModalProps {
  event: TimelineEvent
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
  hasNext: boolean
  hasPrev: boolean
}

function StoryModal({ event, onClose, onNext, onPrev, hasNext, hasPrev }: StoryModalProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const category = CATEGORY_LABELS[event.category]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext()
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev, hasNext, hasPrev])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={cn('absolute inset-0', theme === 'dark' ? 'bg-black/90' : 'bg-black/80')} onClick={onClose} />
      <div className={cn(
        'relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl',
        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
      )}>
        {/* Header */}
        <div className={cn(
          'sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-md',
          theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold font-mono text-amber-500">{event.year}</span>
              <Badge color={category.color}>{isZh ? category.zh : category.en}</Badge>
              {event.importance === 1 && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
            </div>
            <button onClick={onClose} className={cn('p-2 rounded-full transition-colors', theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600')}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {event.scene && (
            <div className={cn('flex items-center gap-4 mt-2 text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
              {event.scene.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.scene.location}</span>}
              {event.scene.season && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.scene.season}</span>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <h2 className={cn('text-2xl font-bold mb-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? event.titleZh : event.titleEn}
          </h2>
          {event.scientistEn && (
            <p className={cn('text-base mb-6 flex items-center gap-2', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
              {event.scientistBio?.portraitEmoji && <span className="text-2xl">{event.scientistBio.portraitEmoji}</span>}
              <User className="w-4 h-4" />
              {isZh ? event.scientistZh : event.scientistEn}
              {event.scientistBio?.birthYear && event.scientistBio?.deathYear && (
                <span className={cn('text-sm', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                  ({event.scientistBio.birthYear} - {event.scientistBio.deathYear})
                </span>
              )}
            </p>
          )}
          {event.story && (
            <div className={cn('text-base leading-relaxed whitespace-pre-line font-serif mb-8', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              {isZh ? event.story.zh : event.story.en}
            </div>
          )}
          {event.scientistBio?.bioEn && (
            <div className={cn('rounded-xl p-4 mb-6 border', theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-amber-50 border-amber-200')}>
              <h4 className={cn('text-sm font-semibold mb-2 flex items-center gap-2', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                <User className="w-4 h-4" />{isZh ? '科学家简介' : 'About the Scientist'}
              </h4>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? event.scientistBio.bioZh : event.scientistBio.bioEn}
              </p>
            </div>
          )}
          {event.details && (
            <div className={cn('rounded-xl p-4 border', theme === 'dark' ? 'bg-cyan-900/20 border-cyan-800/50' : 'bg-cyan-50 border-cyan-200')}>
              <h4 className={cn('text-sm font-semibold mb-3 flex items-center gap-2', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                <Lightbulb className="w-4 h-4" />{isZh ? '关键事实' : 'Key Facts'}
              </h4>
              <ul className={cn('text-sm space-y-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {(isZh ? event.details.zh : event.details.en).map((detail, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-cyan-500 mt-1">•</span>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={cn('sticky bottom-0 px-6 py-4 border-t backdrop-blur-md flex items-center justify-between', theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200')}>
          <button onClick={onPrev} disabled={!hasPrev} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg transition-colors', hasPrev ? (theme === 'dark' ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100') : 'opacity-30 cursor-not-allowed text-gray-500')}>
            <ChevronLeft className="w-4 h-4" />{isZh ? '上一个' : 'Previous'}
          </button>
          <span className={cn('text-sm', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>{isZh ? '按 ← → 键导航' : 'Press ← → to navigate'}</span>
          <button onClick={onNext} disabled={!hasNext} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg transition-colors', hasNext ? (theme === 'dark' ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100') : 'opacity-30 cursor-not-allowed text-gray-500')}>
            {isZh ? '下一个' : 'Next'}<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Center Timeline Event Component - NEW DESIGN
interface CenterTimelineEventProps {
  event: TimelineEvent
  side: 'left' | 'right'
  onReadStory: () => void
}

function CenterTimelineEvent({ event, side, onReadStory }: CenterTimelineEventProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const category = CATEGORY_LABELS[event.category]
  const isOptics = event.track === 'optics'

  return (
    <div className={cn(
      'relative flex items-center',
      side === 'left' ? 'justify-end pr-8' : 'justify-start pl-8'
    )}>
      {/* Card */}
      <div
        onClick={onReadStory}
        className={cn(
          'w-full max-w-md p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg',
          theme === 'dark'
            ? isOptics
              ? 'bg-amber-900/20 border-amber-700/50 hover:border-amber-500/70'
              : 'bg-cyan-900/20 border-cyan-700/50 hover:border-cyan-500/70'
            : isOptics
              ? 'bg-amber-50 border-amber-200 hover:border-amber-400'
              : 'bg-cyan-50 border-cyan-200 hover:border-cyan-400'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
            isOptics
              ? theme === 'dark' ? 'bg-amber-500/30 text-amber-300' : 'bg-amber-200 text-amber-800'
              : theme === 'dark' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-cyan-200 text-cyan-800'
          )}>
            {isOptics ? <Sun className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            {isOptics ? (isZh ? '光学' : 'Optics') : (isZh ? '偏振' : 'Polarization')}
          </span>
          <Badge color={category.color} size="sm">{isZh ? category.zh : category.en}</Badge>
          {event.importance === 1 && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
        </div>

        {/* Title */}
        <h3 className={cn('font-semibold text-lg mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {isZh ? event.titleZh : event.titleEn}
        </h3>

        {/* Scientist */}
        {event.scientistEn && (
          <p className={cn('text-sm mb-2 flex items-center gap-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {event.scientistBio?.portraitEmoji && <span className="mr-1">{event.scientistBio.portraitEmoji}</span>}
            <User className="w-3 h-3" />
            {isZh ? event.scientistZh : event.scientistEn}
          </p>
        )}

        {/* Description */}
        <p className={cn('text-sm line-clamp-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
          {isZh ? event.descriptionZh : event.descriptionEn}
        </p>

        {/* Read More */}
        {event.story && (
          <div className={cn('mt-3 text-xs font-medium flex items-center gap-1', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')}>
            <BookOpen className="w-3 h-3" />
            {isZh ? '阅读故事' : 'Read Story'}
          </div>
        )}
      </div>
    </div>
  )
}

// Interactive Knowledge Graph Component - NEW
interface KnowledgeGraphProps {
  nodes: KnowledgeNode[]
  links: KnowledgeLink[]
}

function KnowledgeGraph({ nodes, links }: KnowledgeGraphProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  // Calculate node positions using force-directed layout simulation
  const nodePositions = useMemo(() => {
    const width = 900
    const height = 600
    const positions: Record<string, { x: number; y: number }> = {}

    // Simple circular layout with category grouping
    const categoryGroups: Record<string, KnowledgeNode[]> = {}
    nodes.forEach(node => {
      if (!categoryGroups[node.category]) categoryGroups[node.category] = []
      categoryGroups[node.category].push(node)
    })

    const categories = Object.keys(categoryGroups)
    const categoryAngles: Record<string, number> = {}
    categories.forEach((cat, i) => {
      categoryAngles[cat] = (2 * Math.PI * i) / categories.length - Math.PI / 2
    })

    nodes.forEach((node) => {
      const catNodes = categoryGroups[node.category]
      const indexInCat = catNodes.indexOf(node)
      const catAngle = categoryAngles[node.category]
      const radius = 200 + (indexInCat % 3) * 60
      const angleOffset = (indexInCat * 0.4) - (catNodes.length * 0.2)

      positions[node.id] = {
        x: width / 2 + radius * Math.cos(catAngle + angleOffset),
        y: height / 2 + radius * Math.sin(catAngle + angleOffset)
      }
    })

    return positions
  }, [nodes])

  // Get connected nodes for highlighting
  const getConnectedNodes = useCallback((nodeId: string) => {
    const connected = new Set<string>()
    links.forEach(link => {
      if (link.source === nodeId) connected.add(link.target)
      if (link.target === nodeId) connected.add(link.source)
    })
    return connected
  }, [links])

  const connectedNodes = hoveredNode ? getConnectedNodes(hoveredNode) : new Set<string>()

  // Mouse handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }

  const handleMouseUp = () => setIsDragging(false)

  // Filter nodes based on category
  const filteredNodes = filterCategory
    ? nodes.filter(n => n.category === filterCategory)
    : nodes

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
  const filteredLinks = links.filter(l =>
    filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target)
  )

  return (
    <div className="relative h-[600px] overflow-hidden rounded-xl border" ref={containerRef}>
      {/* Controls */}
      <div className={cn(
        'absolute top-4 left-4 z-10 flex flex-col gap-2',
      )}>
        <div className={cn(
          'flex items-center gap-1 p-1 rounded-lg border',
          theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
        )}>
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className={cn('p-2 rounded-md', theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100')}>
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className={cn('p-2 rounded-md', theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100')}>
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }} className={cn('p-2 rounded-md', theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100')}>
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter */}
        <div className={cn(
          'p-2 rounded-lg border',
          theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
        )}>
          <div className={cn('text-xs font-medium mb-2 flex items-center gap-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            <Filter className="w-3 h-3" />{isZh ? '筛选' : 'Filter'}
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setFilterCategory(null)}
              className={cn(
                'text-xs px-2 py-1 rounded text-left',
                !filterCategory ? 'bg-indigo-500 text-white' : (theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100')
              )}
            >
              {isZh ? '全部' : 'All'}
            </button>
            {['fundamental', 'phenomenon', 'theory', 'device', 'application'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  'text-xs px-2 py-1 rounded text-left flex items-center gap-2',
                  filterCategory === cat ? 'bg-indigo-500 text-white' : (theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100')
                )}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: NODE_CATEGORY_COLORS[cat as keyof typeof NODE_CATEGORY_COLORS].bg }} />
                {isZh ?
                  { fundamental: '基础', phenomenon: '现象', theory: '理论', device: '器件', application: '应用' }[cat] :
                  cat.charAt(0).toUpperCase() + cat.slice(1)
                }
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className={cn(
          'absolute top-4 right-4 z-10 w-64 p-4 rounded-xl border shadow-lg',
          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        )}>
          <button onClick={() => setSelectedNode(null)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-700/50">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: NODE_CATEGORY_COLORS[selectedNode.category].bg }} />
            <h4 className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? selectedNode.labelZh : selectedNode.labelEn}
            </h4>
          </div>
          <p className={cn('text-sm mb-3', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            {isZh ? selectedNode.descriptionZh : selectedNode.descriptionEn}
          </p>
          <div className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
            {isZh ? '类别：' : 'Category: '}
            {isZh ?
              { fundamental: '基础概念', phenomenon: '物理现象', theory: '理论定律', device: '光学器件', application: '实际应用' }[selectedNode.category] :
              selectedNode.category
            }
          </div>
          {/* Related links */}
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className={cn('text-xs font-medium mb-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {isZh ? '相关连接' : 'Connections'}
            </div>
            {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).slice(0, 5).map((link, i) => {
              const otherId = link.source === selectedNode.id ? link.target : link.source
              const otherNode = nodes.find(n => n.id === otherId)
              return otherNode ? (
                <div key={i} className={cn('text-xs flex items-center gap-2 py-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  <span>→</span>
                  <span>{isZh ? otherNode.labelZh : otherNode.labelEn}</span>
                  <span className={cn('text-xs', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')}>
                    ({isZh ? link.relationZh : link.relationEn})
                  </span>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* SVG Graph */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={theme === 'dark' ? '#475569' : '#94a3b8'} />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Links */}
          {filteredLinks.map((link, i) => {
            const sourcePos = nodePositions[link.source]
            const targetPos = nodePositions[link.target]
            if (!sourcePos || !targetPos) return null

            const isHighlighted = hoveredNode === link.source || hoveredNode === link.target
            const isConnected = hoveredNode && (link.source === hoveredNode || link.target === hoveredNode)

            return (
              <line
                key={i}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={isConnected ? (theme === 'dark' ? '#60a5fa' : '#3b82f6') : (theme === 'dark' ? '#334155' : '#cbd5e1')}
                strokeWidth={link.strength * (isHighlighted ? 2 : 1)}
                opacity={hoveredNode && !isConnected ? 0.2 : 0.6}
                markerEnd="url(#arrowhead)"
              />
            )
          })}

          {/* Nodes */}
          {filteredNodes.map(node => {
            const pos = nodePositions[node.id]
            if (!pos) return null

            const isHovered = hoveredNode === node.id
            const isConnected = connectedNodes.has(node.id)
            const isSelected = selectedNode?.id === node.id
            const colors = NODE_CATEGORY_COLORS[node.category]

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer"
                opacity={hoveredNode && !isHovered && !isConnected ? 0.3 : 1}
              >
                {/* Glow effect on hover */}
                {(isHovered || isSelected) && (
                  <circle
                    r={32}
                    fill={colors.bg}
                    opacity={0.3}
                    className="animate-pulse"
                  />
                )}

                {/* Node circle */}
                <circle
                  r={isHovered ? 26 : 22}
                  fill={colors.bg}
                  stroke={isSelected ? '#fff' : colors.border}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* Node label */}
                <text
                  y={36}
                  textAnchor="middle"
                  className={cn('text-xs font-medium', theme === 'dark' ? 'fill-gray-300' : 'fill-gray-700')}
                  style={{ fontSize: '10px' }}
                >
                  {isZh ? node.labelZh : node.labelEn}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className={cn(
        'absolute bottom-4 left-4 p-3 rounded-lg border',
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
      )}>
        <div className={cn('text-xs font-medium mb-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
          {isZh ? '图例' : 'Legend'}
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(NODE_CATEGORY_COLORS).map(([cat, colors]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.bg }} />
              <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ?
                  { fundamental: '基础', phenomenon: '现象', theory: '理论', device: '器件', application: '应用' }[cat] :
                  cat.charAt(0).toUpperCase() + cat.slice(1)
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Page Tabs
const PAGE_TABS = [
  { id: 'timeline', labelEn: 'Timeline', labelZh: '时间线', icon: <Clock className="w-4 h-4" /> },
  { id: 'graph', labelEn: 'Knowledge Graph', labelZh: '知识图谱', icon: <Network className="w-4 h-4" /> },
]

export function ChroniclesPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [activeTab, setActiveTab] = useState<'timeline' | 'graph'>('timeline')
  const [storyEvent, setStoryEvent] = useState<TimelineEvent | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  // Get sorted events by year
  const sortedEvents = useMemo(() => {
    let events = [...TIMELINE_EVENTS].sort((a, b) => a.year - b.year)
    if (categoryFilter) {
      events = events.filter(e => e.category === categoryFilter)
    }
    return events
  }, [categoryFilter])

  // Get unique years for the center timeline
  const uniqueYears = useMemo(() => {
    const years = new Set(sortedEvents.map(e => e.year))
    return Array.from(years).sort((a, b) => a - b)
  }, [sortedEvents])

  // Story navigation
  const storyIndex = storyEvent ? sortedEvents.findIndex(e => e.year === storyEvent.year && e.titleEn === storyEvent.titleEn) : -1
  const hasPrevStory = storyIndex > 0
  const hasNextStory = storyIndex >= 0 && storyIndex < sortedEvents.length - 1
  const goToPrevStory = () => storyIndex > 0 && setStoryEvent(sortedEvents[storyIndex - 1])
  const goToNextStory = () => storyIndex < sortedEvents.length - 1 && setStoryEvent(sortedEvents[storyIndex + 1])

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#f0f9ff] to-[#f0fdf4]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className={cn('p-2 rounded-lg transition-colors', theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500')}>
                <Home className="w-5 h-5" />
              </Link>
              <div>
                <h1 className={cn('text-xl font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {isZh ? '光的编年史' : 'Chronicles of Light'}
                </h1>
                <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  {isZh ? '双线叙事：广义光学 × 偏振光学' : 'Dual Narrative: General Optics × Polarization'}
                </p>
              </div>
            </div>
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs
          tabs={PAGE_TABS.map(tab => ({ ...tab, label: isZh ? tab.labelZh : tab.labelEn }))}
          activeTab={activeTab}
          onChange={(id: string) => setActiveTab(id as 'timeline' | 'graph')}
          className="mb-8"
        />

        {activeTab === 'timeline' ? (
          <>
            {/* Category Filter */}
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                {isZh ? '筛选：' : 'Filter:'}
              </span>
              <button
                onClick={() => setCategoryFilter(null)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  !categoryFilter
                    ? 'bg-indigo-500 text-white'
                    : theme === 'dark' ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    categoryFilter === key
                      ? 'bg-indigo-500 text-white'
                      : theme === 'dark' ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {isZh ? value.zh : value.en}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className={cn(
              'flex items-center justify-center gap-8 mb-8 p-4 rounded-xl border',
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'
            )}>
              <div className="flex items-center gap-2">
                <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                  {isZh ? '广义光学' : 'General Optics'}
                </span>
                <span className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>← {isZh ? '左侧' : 'Left'}</span>
              </div>
              <div className={cn('w-px h-6', theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300')} />
              <div className="flex items-center gap-2">
                <span className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>{isZh ? '右侧' : 'Right'} →</span>
                <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                <span className={cn('text-sm font-medium', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                  {isZh ? '偏振光学' : 'Polarization Optics'}
                </span>
              </div>
            </div>

            {/* CENTER TIMELINE - NEW DESIGN */}
            <div className="relative">
              {/* Center vertical line */}
              <div className={cn(
                'absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full',
                theme === 'dark'
                  ? 'bg-gradient-to-b from-amber-500/50 via-indigo-500/50 to-cyan-500/50'
                  : 'bg-gradient-to-b from-amber-300 via-indigo-300 to-cyan-300'
              )} />

              {/* Events */}
              <div className="relative space-y-4">
                {uniqueYears.map(year => {
                  const yearEvents = sortedEvents.filter(e => e.year === year)
                  const opticsEvents = yearEvents.filter(e => e.track === 'optics')
                  const polarizationEvents = yearEvents.filter(e => e.track === 'polarization')

                  return (
                    <div key={year} className="relative">
                      {/* Year marker on center line */}
                      <div className="absolute left-1/2 -translate-x-1/2 z-10">
                        <div className={cn(
                          'px-4 py-2 rounded-full font-mono font-bold text-lg shadow-lg',
                          theme === 'dark'
                            ? 'bg-slate-800 text-amber-400 border border-amber-500/50'
                            : 'bg-white text-amber-600 border border-amber-300'
                        )}>
                          {year}
                        </div>
                      </div>

                      {/* Events container */}
                      <div className="grid grid-cols-2 gap-4 pt-14">
                        {/* Left side - Optics */}
                        <div className="space-y-4">
                          {opticsEvents.map((event, i) => (
                            <CenterTimelineEvent
                              key={`${event.year}-${event.titleEn}-${i}`}
                              event={event}
                              side="left"
                              onReadStory={() => setStoryEvent(event)}
                            />
                          ))}
                        </div>

                        {/* Right side - Polarization */}
                        <div className="space-y-4">
                          {polarizationEvents.map((event, i) => (
                            <CenterTimelineEvent
                              key={`${event.year}-${event.titleEn}-${i}`}
                              event={event}
                              side="right"
                              onReadStory={() => setStoryEvent(event)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Timeline end marker */}
              <div className="flex justify-center pt-8">
                <div className={cn(
                  'px-6 py-3 rounded-full',
                  theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                )}>
                  {isZh ? '探索仍在继续...' : 'The exploration continues...'}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Knowledge Graph Tab */
          <div>
            <div className={cn(
              'mb-6 p-4 rounded-xl border',
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-blue-50 border-blue-200'
            )}>
              <h3 className={cn('font-semibold mb-2 flex items-center gap-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                <Network className="w-5 h-5" />
                {isZh ? '光学知识图谱' : 'Optical Knowledge Graph'}
              </h3>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh
                  ? '探索光学概念之间的相互联系。点击节点查看详情，悬停高亮相关连接。使用左侧筛选器聚焦特定类别。'
                  : 'Explore the interconnections between optical concepts. Click nodes for details, hover to highlight connections. Use the filter to focus on specific categories.'
                }
              </p>
            </div>
            <KnowledgeGraph nodes={KNOWLEDGE_NODES} links={KNOWLEDGE_LINKS} />
          </div>
        )}
      </main>

      {/* Story Modal */}
      {storyEvent && (
        <StoryModal
          event={storyEvent}
          onClose={() => setStoryEvent(null)}
          onNext={goToNextStory}
          onPrev={goToPrevStory}
          hasNext={hasNextStory}
          hasPrev={hasPrevStory}
        />
      )}
    </div>
  )
}
