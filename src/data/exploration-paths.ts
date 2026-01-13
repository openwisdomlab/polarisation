/**
 * Exploration Paths - 渐进式探索路径数据
 *
 * 基于 Google Learn About 理念设计：
 * - 问题驱动：从好奇心问题开始
 * - 渐进深入：每次只呈现少量内容
 * - 探索路径：让用户选择自己的学习旅程
 */

// 探索节点类型
export type NodeType =
  | 'wonder'      // 惊奇时刻 - 历史发现的"哇"瞬间
  | 'story'       // 故事 - 科学家或发现的叙事
  | 'concept'     // 概念 - 核心原理解释
  | 'experiment'  // 实验 - 动手尝试
  | 'demo'        // 演示 - 链接到交互演示
  | 'question'    // 问题 - 引导思考
  | 'connection'  // 连接 - 概念之间的关系

// 探索节点
export interface ExplorationNode {
  id: string
  type: NodeType
  titleEn: string
  titleZh: string
  contentEn: string
  contentZh: string
  // 可选的富内容
  emoji?: string
  imageUrl?: string
  year?: number
  scientist?: { en: string; zh: string }
  // 链接到其他模块
  demoRoute?: string
  relatedEventYear?: number
  // 下一步探索
  nextNodes?: string[]
  // 探索提示问题
  promptEn?: string
  promptZh?: string
  // 深度标记 (1=入门, 2=进阶, 3=深入)
  depth?: 1 | 2 | 3
}

// 探索路径 - 一个主题的完整探索旅程
export interface ExplorationPath {
  id: string
  // 入口问题
  questionEn: string
  questionZh: string
  subtitleEn: string
  subtitleZh: string
  emoji: string
  color: string
  // 节点列表
  nodes: ExplorationNode[]
  // 入口节点ID
  entryNodeId: string
  // 关联的时间线事件年份
  relatedYears?: number[]
  // 难度标签
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  // 预计探索时间（分钟）
  estimatedMinutes: number
}

// ============================================
// 探索路径1: 光是什么？
// ============================================
const PATH_WHAT_IS_LIGHT: ExplorationPath = {
  id: 'what-is-light',
  questionEn: 'What is light, really?',
  questionZh: '光究竟是什么？',
  subtitleEn: 'A 400-year mystery that changed physics',
  subtitleZh: '一个改变物理学的400年之谜',
  emoji: '💡',
  color: '#f59e0b',
  difficulty: 'beginner',
  estimatedMinutes: 8,
  entryNodeId: 'light-wonder-1',
  relatedYears: [1665, 1678, 1801, 1905],
  nodes: [
    {
      id: 'light-wonder-1',
      type: 'wonder',
      emoji: '🌈',
      titleEn: 'Newton\'s Rainbow Secret',
      titleZh: '牛顿的彩虹秘密',
      year: 1665,
      scientist: { en: 'Isaac Newton', zh: '艾萨克·牛顿' },
      contentEn: `In 1665, a young Isaac Newton was trapped at home during the plague. With nothing but a glass prism from a country fair, he made a discovery that would change our understanding of light forever.

He drilled a tiny hole in his window shutter, letting a beam of sunlight into his darkened room. When the light passed through the prism, it didn't just bend — it spread into a rainbow of colors.

But here's the amazing part: Newton proved that the prism wasn't *creating* these colors. They were already there, hidden inside the white light all along.`,
      contentZh: `1665年，年轻的牛顿因瘟疫被困在家中。他只有一块从集市买来的玻璃棱镜，却做出了一个改变我们对光的理解的发现。

他在窗板上钻了一个小孔，让一束阳光射入昏暗的房间。当光穿过棱镜时，它不只是弯曲了——它展开成了一道彩虹。

但最神奇的是：牛顿证明了棱镜并没有*创造*这些颜色。它们一直就藏在白光之中。`,
      promptEn: 'But wait — if light is made of colors, what *is* each color made of?',
      promptZh: '但是等等——如果光由颜色组成，那每种颜色又是由什么构成的呢？',
      nextNodes: ['light-question-1'],
      depth: 1
    },
    {
      id: 'light-question-1',
      type: 'question',
      emoji: '🤔',
      titleEn: 'The Great Debate',
      titleZh: '世纪大辩论',
      contentEn: `Newton believed light was made of tiny particles — like billions of tiny bullets shooting from the sun.

But another scientist, Christiaan Huygens, disagreed. He thought light was a wave, like ripples in a pond.

For over 100 years, scientists argued: Is light a particle or a wave?`,
      contentZh: `牛顿认为光是由微小的粒子组成的——就像数十亿个从太阳射出的小子弹。

但另一位科学家惠更斯不同意。他认为光是一种波，就像池塘中的涟漪。

100多年来，科学家们争论不休：光是粒子还是波？`,
      promptEn: 'How could we possibly find out? What experiment might settle this debate?',
      promptZh: '我们怎样才能找到答案？什么实验可以解决这场争论？',
      nextNodes: ['light-wonder-2'],
      depth: 1
    },
    {
      id: 'light-wonder-2',
      type: 'wonder',
      emoji: '🕳️',
      titleEn: 'Two Tiny Slits Changed Everything',
      titleZh: '两条小缝改变了一切',
      year: 1801,
      scientist: { en: 'Thomas Young', zh: '托马斯·杨' },
      contentEn: `In 1801, Thomas Young designed a beautifully simple experiment. He shone light through two tiny slits, side by side.

If light were particles, you'd expect two bright stripes on the wall — like bullets passing through two windows.

But that's not what happened. Instead, Young saw stripes of light and dark, alternating across the wall. The light was *interfering* with itself — something only waves can do!

Newton's particle theory seemed to be wrong. Light was a wave after all!`,
      contentZh: `1801年，托马斯·杨设计了一个简洁优美的实验。他让光穿过两条并排的小缝。

如果光是粒子，你会期望在墙上看到两条亮条纹——就像子弹穿过两扇窗户。

但结果不是这样。杨看到的是明暗相间的条纹，交替排列在墙上。光在与自己*干涉*——这只有波才能做到！

牛顿的粒子理论似乎是错的。光果然是波！`,
      promptEn: 'Case closed? Not quite. 100 years later, Einstein would turn everything upside down again...',
      promptZh: '案件结束了？还没有。100年后，爱因斯坦将再次颠覆一切...',
      demoRoute: '/demos/arago-fresnel',
      nextNodes: ['light-concept-1'],
      depth: 2
    },
    {
      id: 'light-concept-1',
      type: 'concept',
      emoji: '🌊',
      titleEn: 'Light as Waves',
      titleZh: '作为波的光',
      contentEn: `Young's experiment proved that light behaves like waves. But what kind of wave?

Unlike water waves or sound waves, light doesn't need a medium to travel through. It can cross the vacuum of space!

We now know that light is an *electromagnetic wave* — a ripple in electric and magnetic fields that travels at 300,000 km/s.`,
      contentZh: `杨的实验证明了光表现得像波。但是什么样的波？

与水波或声波不同，光不需要介质来传播。它可以穿越太空中的真空！

我们现在知道，光是一种*电磁波*——在电场和磁场中传播的涟漪，速度达30万公里/秒。`,
      demoRoute: '/demos/light-wave',
      nextNodes: ['light-wonder-3'],
      depth: 2
    },
    {
      id: 'light-wonder-3',
      type: 'wonder',
      emoji: '⚡',
      titleEn: 'Einstein\'s Twist',
      titleZh: '爱因斯坦的反转',
      year: 1905,
      scientist: { en: 'Albert Einstein', zh: '阿尔伯特·爱因斯坦' },
      contentEn: `Just when everyone thought the debate was settled, a young patent clerk named Albert Einstein noticed something strange.

When light hits metal, it can knock electrons loose — the "photoelectric effect." But the energy of these electrons depends on the *color* of the light, not its brightness!

Einstein realized this only made sense if light came in tiny packets of energy — "photons."

Light is BOTH a wave AND a particle. Welcome to quantum physics!`,
      contentZh: `就在大家以为争论已经解决时，一位年轻的专利局职员阿尔伯特·爱因斯坦注意到了一些奇怪的事情。

当光照射金属时，它可以击出电子——这就是"光电效应"。但这些电子的能量取决于光的*颜色*，而不是亮度！

爱因斯坦意识到，这只有在光以微小的能量包——"光子"的形式存在时才说得通。

光既是波又是粒子。欢迎来到量子物理！`,
      nextNodes: ['light-experiment-1'],
      depth: 3
    },
    {
      id: 'light-experiment-1',
      type: 'experiment',
      emoji: '🔬',
      titleEn: 'Try It: Make Your Own Rainbow',
      titleZh: '动手试试：制作你自己的彩虹',
      contentEn: `You can recreate Newton's discovery at home!

**Materials:**
- A glass of water
- A piece of white paper
- A sunny day

**Steps:**
1. Place the glass of water on a white paper, near a window with direct sunlight
2. Position the paper so that sunlight passes through the glass
3. Look for the rainbow spectrum on the paper!

**What to notice:** Can you see all seven colors? Which color bends the most?`,
      contentZh: `你可以在家重现牛顿的发现！

**材料：**
- 一杯水
- 一张白纸
- 一个晴天

**步骤：**
1. 把水杯放在白纸上，靠近有直射阳光的窗户
2. 调整纸的位置，让阳光穿过水杯
3. 在纸上寻找彩虹光谱！

**观察要点：** 你能看到全部七种颜色吗？哪种颜色弯曲得最多？`,
      nextNodes: [],
      depth: 1
    }
  ]
}

// ============================================
// 探索路径2: 为什么天空是蓝色的？
// ============================================
const PATH_WHY_SKY_BLUE: ExplorationPath = {
  id: 'why-sky-blue',
  questionEn: 'Why is the sky blue?',
  questionZh: '为什么天空是蓝色的？',
  subtitleEn: 'The answer reveals how light dances with molecules',
  subtitleZh: '答案揭示了光如何与分子共舞',
  emoji: '🌤️',
  color: '#3b82f6',
  difficulty: 'beginner',
  estimatedMinutes: 6,
  entryNodeId: 'sky-wonder-1',
  relatedYears: [1871],
  nodes: [
    {
      id: 'sky-wonder-1',
      type: 'wonder',
      emoji: '🌅',
      titleEn: 'A Child\'s Question',
      titleZh: '一个孩子的问题',
      contentEn: `Every child has asked: "Why is the sky blue?" For thousands of years, no one could give a good answer.

The ancient Greeks thought the sky was a solid dome. Leonardo da Vinci guessed it had something to do with the air. But it wasn't until 1871 that a scientist named Lord Rayleigh finally solved the mystery.

The answer? Light is "scattered" by the tiny molecules in our atmosphere. And here's the key: blue light scatters *much more* than red light!`,
      contentZh: `每个孩子都问过："为什么天空是蓝色的？"几千年来，没有人能给出好的答案。

古希腊人认为天空是一个固体穹顶。达芬奇猜测它与空气有关。但直到1871年，一位名叫瑞利勋爵的科学家才最终解开了这个谜团。

答案是：光被大气中的微小分子"散射"了。关键是：蓝光散射得比红光*多得多*！`,
      promptEn: 'But why does blue scatter more? And what happens to the blue light at sunset?',
      promptZh: '但为什么蓝光散射得更多？日落时蓝光又去了哪里？',
      nextNodes: ['sky-concept-1'],
      depth: 1
    },
    {
      id: 'sky-concept-1',
      type: 'concept',
      emoji: '📊',
      titleEn: 'The Scattering Formula',
      titleZh: '散射公式',
      year: 1871,
      scientist: { en: 'Lord Rayleigh', zh: '瑞利勋爵' },
      contentEn: `Lord Rayleigh discovered that scattering follows a beautiful mathematical rule:

**Scattering ∝ 1/λ⁴**

This means shorter wavelengths (like blue) scatter MUCH more than longer wavelengths (like red).

Blue light (450nm) scatters about 5× more than red light (650nm)!

So when sunlight enters our atmosphere, the blue part bounces around and reaches your eyes from all directions — that's why the whole sky looks blue!`,
      contentZh: `瑞利勋爵发现散射遵循一个优美的数学规律：

**散射 ∝ 1/λ⁴**

这意味着波长短的光（如蓝光）散射得比波长长的光（如红光）多得多。

蓝光（450nm）散射是红光（650nm）的约5倍！

所以当阳光进入我们的大气层时，蓝色部分到处弹跳，从各个方向进入你的眼睛——这就是为什么整个天空看起来是蓝色的！`,
      demoRoute: '/demos/rayleigh',
      nextNodes: ['sky-wonder-2'],
      depth: 2
    },
    {
      id: 'sky-wonder-2',
      type: 'wonder',
      emoji: '🌇',
      titleEn: 'The Secret of Sunset',
      titleZh: '日落的秘密',
      contentEn: `Now you know why the sky is blue. But wait — at sunset, the sky turns orange and red! Why?

At sunset, sunlight has to travel through *much more* atmosphere to reach your eyes. All the blue light gets scattered away before it arrives!

What's left? The red and orange light that wasn't scattered — painting the sky in warm colors.

It's the same physics, just a longer journey for the light!`,
      contentZh: `现在你知道为什么天空是蓝色的了。但等等——日落时，天空变成橙色和红色！为什么？

日落时，阳光必须穿过*更多*的大气层才能到达你的眼睛。所有的蓝光在到达之前就被散射掉了！

剩下什么？没有被散射的红光和橙光——把天空染成温暖的颜色。

同样的物理原理，只是光的旅程更长了！`,
      nextNodes: ['sky-experiment-1'],
      depth: 1
    },
    {
      id: 'sky-experiment-1',
      type: 'experiment',
      emoji: '🔦',
      titleEn: 'Try It: Indoor Sunset',
      titleZh: '动手试试：室内日落',
      contentEn: `Create your own "sunset" at home!

**Materials:**
- A clear glass or jar filled with water
- A few drops of milk
- A flashlight
- A dark room

**Steps:**
1. Add 3-4 drops of milk to the water and stir
2. Shine the flashlight through the side of the glass
3. Look at the light from different angles!

**What to see:**
- From the side: The water looks bluish
- Through the glass: The light looks reddish-orange

You just recreated Rayleigh scattering in your kitchen!`,
      contentZh: `在家制造你自己的"日落"！

**材料：**
- 一个装满水的透明玻璃杯
- 几滴牛奶
- 一个手电筒
- 一个黑暗的房间

**步骤：**
1. 往水里加3-4滴牛奶并搅拌
2. 用手电筒从玻璃杯侧面照射
3. 从不同角度观察光！

**你会看到：**
- 从侧面看：水看起来偏蓝
- 透过玻璃看：光看起来偏红橙色

你刚刚在厨房重现了瑞利散射！`,
      nextNodes: [],
      depth: 1
    }
  ]
}

// ============================================
// 探索路径3: 偏振光的隐藏世界
// ============================================
const PATH_POLARIZATION: ExplorationPath = {
  id: 'hidden-polarization',
  questionEn: 'What secrets does polarized light reveal?',
  questionZh: '偏振光揭示了什么秘密？',
  subtitleEn: 'From Viking navigation to 3D movies',
  subtitleZh: '从维京人导航到3D电影',
  emoji: '🔮',
  color: '#06b6d4',
  difficulty: 'beginner',
  estimatedMinutes: 10,
  entryNodeId: 'polar-wonder-1',
  relatedYears: [1669, 1808, 1929],
  nodes: [
    {
      id: 'polar-wonder-1',
      type: 'wonder',
      emoji: '💎',
      titleEn: 'The Magic Crystal',
      titleZh: '神奇的晶体',
      year: 1669,
      scientist: { en: 'Erasmus Bartholin', zh: '伊拉斯谟·巴托林' },
      contentEn: `In 1669, a Danish scientist named Erasmus Bartholin was examining a crystal from Iceland — what we now call "calcite" or "Iceland spar."

He noticed something magical: when he looked at words through the crystal, he saw *two images* of every letter!

How could one crystal create two copies of reality? Bartholin had stumbled upon one of light's most hidden properties: *polarization*.

The crystal was splitting light into two beams, each vibrating in a different direction!`,
      contentZh: `1669年，丹麦科学家伊拉斯谟·巴托林正在研究一块来自冰岛的晶体——我们现在称之为"方解石"或"冰洲石"。

他注意到一些神奇的事情：当他透过晶体看文字时，他看到每个字母都有*两个像*！

一块晶体怎么能创造两个现实的副本？巴托林偶然发现了光最隐秘的属性之一：*偏振*。

这块晶体把光分成了两束，每束都在不同方向振动！`,
      promptEn: 'But what does "vibrating in different directions" even mean? And did this discovery have any practical use?',
      promptZh: '但"在不同方向振动"是什么意思？这个发现有什么实际用途吗？',
      demoRoute: '/demos/birefringence',
      nextNodes: ['polar-concept-1'],
      depth: 1
    },
    {
      id: 'polar-concept-1',
      type: 'concept',
      emoji: '↕️',
      titleEn: 'Light\'s Hidden Direction',
      titleZh: '光的隐藏方向',
      contentEn: `Light is a wave — but what kind of wave?

Unlike sound (which compresses back and forth), light waves vibrate *sideways*, perpendicular to their direction of travel. This is called a "transverse wave."

But here's the key: in ordinary light, these vibrations happen in ALL directions at once — up, down, left, right, and every angle in between.

*Polarized* light is special: it only vibrates in ONE direction. The calcite crystal separated light based on its polarization direction!`,
      contentZh: `光是一种波——但是什么样的波？

与声波（前后压缩）不同，光波*横向*振动，垂直于传播方向。这叫做"横波"。

但关键是：在普通光中，这些振动同时发生在所有方向——上、下、左、右，以及中间的每个角度。

*偏振*光很特殊：它只在一个方向振动。方解石晶体根据偏振方向分离了光！`,
      demoRoute: '/demos/polarization-intro',
      nextNodes: ['polar-wonder-2'],
      depth: 2
    },
    {
      id: 'polar-wonder-2',
      type: 'wonder',
      emoji: '🧭',
      titleEn: 'The Viking Sunstone',
      titleZh: '维京人的太阳石',
      contentEn: `Legend says that Viking sailors could navigate on cloudy days using a mysterious "sunstone." For centuries, this was dismissed as myth.

But modern scientists think the sunstone was *calcite* — the same crystal Bartholin studied!

How would it work? Even when the sun is hidden, the sky's light is partially polarized. By rotating a calcite crystal and watching how the two images change brightness, Vikings could locate the sun's position behind the clouds!

Ancient navigation using polarization physics — discovered 1,000 years before scientists understood it!`,
      contentZh: `传说维京水手可以在阴天使用一种神秘的"太阳石"导航。几个世纪以来，这被认为是神话。

但现代科学家认为太阳石就是*方解石*——巴托林研究的同一种晶体！

它如何工作？即使太阳被遮住，天空的光也是部分偏振的。通过旋转方解石晶体，观察两个像的亮度如何变化，维京人可以定位云层后面太阳的位置！

利用偏振物理学的古代导航——比科学家理解它早了1000年！`,
      nextNodes: ['polar-wonder-3'],
      depth: 2
    },
    {
      id: 'polar-wonder-3',
      type: 'wonder',
      emoji: '📖',
      titleEn: 'Malus and the Palace Window',
      titleZh: '马吕斯与宫殿的窗户',
      year: 1808,
      scientist: { en: 'Étienne-Louis Malus', zh: '艾蒂安-路易·马吕斯' },
      contentEn: `In 1808, French engineer Étienne-Louis Malus was looking through a calcite crystal at the sunset reflected in the windows of the Luxembourg Palace in Paris.

He noticed something strange: as he rotated the crystal, one of the two images would disappear and reappear!

Malus realized that light reflected from glass becomes *polarized*. He had discovered what we now call "Malus's Law" — the mathematical rule for how polarized light passes through polarizers.

A casual observation through a crystal became one of the foundations of optics!`,
      contentZh: `1808年，法国工程师艾蒂安-路易·马吕斯透过方解石晶体观看反射在巴黎卢森堡宫窗户上的日落。

他注意到一些奇怪的事情：当他旋转晶体时，两个像中的一个会消失又重新出现！

马吕斯意识到从玻璃反射的光变成了*偏振光*。他发现了我们现在所称的"马吕斯定律"——偏振光通过偏振片的数学规则。

透过晶体的一次偶然观察成为了光学的基础之一！`,
      demoRoute: '/demos/malus',
      nextNodes: ['polar-connection-1'],
      depth: 2
    },
    {
      id: 'polar-connection-1',
      type: 'connection',
      emoji: '🎬',
      titleEn: 'Polarization Today: 3D Movies',
      titleZh: '今日偏振：3D电影',
      contentEn: `How do 3D movies work? Polarization!

The cinema projects two images at once — one polarized vertically, one horizontally. Your 3D glasses have different polarizing filters for each eye.

Your left eye sees only the "left-eye image," your right eye sees only the "right-eye image." Your brain combines them to perceive depth!

From ancient crystals to modern entertainment — polarization is everywhere once you know how to look for it.

Want to explore more? Try looking at your phone or laptop screen through polarizing sunglasses...`,
      contentZh: `3D电影是如何工作的？偏振！

电影院同时投射两幅图像——一幅垂直偏振，一幅水平偏振。你的3D眼镜为每只眼睛配备了不同的偏振滤光片。

你的左眼只看到"左眼图像"，右眼只看到"右眼图像"。你的大脑将它们结合起来感知深度！

从古老的晶体到现代娱乐——一旦你知道如何寻找，偏振无处不在。

想探索更多吗？试着透过偏振太阳镜看你的手机或笔记本屏幕...`,
      demoRoute: '/demos/polarization-types',
      nextNodes: ['polar-experiment-1'],
      depth: 1
    },
    {
      id: 'polar-experiment-1',
      type: 'experiment',
      emoji: '🕶️',
      titleEn: 'Try It: Find Hidden Polarization',
      titleZh: '动手试试：发现隐藏的偏振',
      contentEn: `Polarization is all around you! Here's how to see it:

**What you need:**
- Polarizing sunglasses (most sunglasses are polarized)
- A laptop, phone, or LCD screen

**Try this:**
1. Look at your screen normally — it looks fine
2. Put on polarizing sunglasses — still fine
3. Now tilt your head 90° to the side while wearing the glasses

**What happens?** The screen goes dark (or shows strange colors)!

This is because LCD screens produce polarized light. When your polarized glasses are rotated 90°, they block the screen's polarization completely!`,
      contentZh: `偏振就在你身边！这是发现它的方法：

**你需要：**
- 偏振太阳镜（大多数太阳镜都是偏振的）
- 笔记本电脑、手机或LCD屏幕

**试试这个：**
1. 正常看屏幕——看起来正常
2. 戴上偏振太阳镜——仍然正常
3. 现在戴着眼镜把头侧向90°

**会发生什么？** 屏幕变暗了（或显示奇怪的颜色）！

这是因为LCD屏幕产生偏振光。当你的偏振眼镜旋转90°时，它们完全阻挡了屏幕的偏振！`,
      nextNodes: [],
      depth: 1
    }
  ]
}

// ============================================
// 探索路径4: 光学史上的惊奇时刻
// ============================================
const PATH_WONDER_MOMENTS: ExplorationPath = {
  id: 'wonder-moments',
  questionEn: 'What were the "wow" moments in optics history?',
  questionZh: '光学史上有哪些"哇"时刻？',
  subtitleEn: 'Discoveries that changed how we see the world',
  subtitleZh: '改变我们看世界方式的发现',
  emoji: '✨',
  color: '#8b5cf6',
  difficulty: 'intermediate',
  estimatedMinutes: 12,
  entryNodeId: 'wow-intro',
  relatedYears: [1665, 1669, 1801, 1808, 1845, 1905],
  nodes: [
    {
      id: 'wow-intro',
      type: 'story',
      emoji: '🗺️',
      titleEn: 'A Timeline of Wonders',
      titleZh: '惊奇时刻的时间线',
      contentEn: `The history of optics is full of moments where a single observation changed everything.

Some happened by accident. Some came after years of careful work. All of them expanded the boundaries of human knowledge.

Let's journey through time and witness these moments of discovery. You'll see how each one built upon the last, like pieces of a grand puzzle being assembled over centuries.

Choose a century to begin your exploration:`,
      contentZh: `光学的历史充满了单次观察改变一切的时刻。

有些是偶然发生的。有些是经过多年仔细研究后才得出的。所有这些都扩展了人类知识的边界。

让我们穿越时间，见证这些发现的时刻。你会看到每一个发现如何建立在前一个之上，就像一幅宏大拼图的碎片在几个世纪中被拼凑起来。

选择一个世纪开始你的探索：`,
      nextNodes: ['wow-17th', 'wow-19th', 'wow-20th'],
      depth: 1
    },
    {
      id: 'wow-17th',
      type: 'story',
      emoji: '⚗️',
      titleEn: 'The 17th Century: The Birth of Modern Optics',
      titleZh: '17世纪：现代光学的诞生',
      contentEn: `The 1600s were a golden age for optics. The telescope and microscope were invented, revealing worlds both vast and tiny.

**1621 — Snell's Law**
Willebrord Snell discovers the mathematical law of refraction. Light bends predictably!

**1665 — Newton's Prism**
Newton proves white light contains all colors. The spectrum is born.

**1669 — The Double Image**
Bartholin discovers birefringence in Iceland spar. Light has a hidden property: polarization.

**1678 — The Wave Theory**
Huygens proposes that light is a wave, not a particle. The great debate begins.`,
      contentZh: `17世纪是光学的黄金时代。望远镜和显微镜被发明出来，揭示了宏大和微小的世界。

**1621年 — 斯涅尔定律**
威理博·斯涅尔发现了折射的数学定律。光可以预测地弯曲！

**1665年 — 牛顿的棱镜**
牛顿证明白光包含所有颜色。光谱诞生了。

**1669年 — 双像**
巴托林在冰洲石中发现了双折射。光有一个隐藏的属性：偏振。

**1678年 — 波动理论**
惠更斯提出光是波而不是粒子。伟大的辩论开始了。`,
      nextNodes: ['wow-19th'],
      depth: 2
    },
    {
      id: 'wow-19th',
      type: 'story',
      emoji: '🔬',
      titleEn: 'The 19th Century: The Wave Triumphs',
      titleZh: '19世纪：波动理论的胜利',
      contentEn: `The 1800s resolved the particle-wave debate (or so it seemed) and unlocked the secrets of polarization.

**1801 — Young's Double Slit**
Thomas Young proves light is a wave with his famous interference experiment.

**1808 — Malus's Discovery**
Looking at a palace window, Malus discovers that reflected light is polarized. He formulates his famous law.

**1845 — Faraday Rotation**
Faraday shows that magnetism can rotate the polarization of light. Light and electromagnetism are connected!

**1871 — Blue Sky Explained**
Lord Rayleigh explains why the sky is blue: light scatters from air molecules.`,
      contentZh: `19世纪解决了粒子-波动的争论（至少看起来是这样），并揭开了偏振的秘密。

**1801年 — 杨氏双缝实验**
托马斯·杨用他著名的干涉实验证明光是波。

**1808年 — 马吕斯的发现**
看着宫殿的窗户，马吕斯发现反射光是偏振的。他提出了著名的定律。

**1845年 — 法拉第旋转**
法拉第表明磁性可以旋转光的偏振。光和电磁是相连的！

**1871年 — 蓝天之谜解开**
瑞利勋爵解释了为什么天空是蓝色的：光从空气分子散射。`,
      nextNodes: ['wow-20th'],
      depth: 2
    },
    {
      id: 'wow-20th',
      type: 'story',
      emoji: '⚛️',
      titleEn: 'The 20th Century: Quantum Revolution',
      titleZh: '20世纪：量子革命',
      contentEn: `The 1900s turned physics upside down. Light is both wave AND particle!

**1905 — Einstein's Photons**
Einstein explains the photoelectric effect. Light comes in quantum packets called "photons." Nobel Prize!

**1929 — Polaroid Film**
Edwin Land invents practical polarizing film. Polarization becomes accessible to everyone.

**1960 — The Laser**
Theodore Maiman creates the first laser. Perfectly coherent, polarized light becomes a tool.

**Today — Quantum Optics**
Scientists use single photons for quantum computing and quantum communication. The journey continues...`,
      contentZh: `20世纪颠覆了物理学。光既是波又是粒子！

**1905年 — 爱因斯坦的光子**
爱因斯坦解释了光电效应。光以称为"光子"的量子包形式存在。诺贝尔奖！

**1929年 — 宝丽来薄膜**
埃德温·兰德发明了实用的偏振薄膜。偏振变得人人可用。

**1960年 — 激光**
西奥多·梅曼创造了第一台激光器。完美相干的偏振光成为了工具。

**今天 — 量子光学**
科学家使用单光子进行量子计算和量子通信。旅程仍在继续...`,
      nextNodes: [],
      depth: 2
    }
  ]
}

// ============================================
// 导出所有探索路径
// ============================================
export const EXPLORATION_PATHS: ExplorationPath[] = [
  PATH_WHAT_IS_LIGHT,
  PATH_WHY_SKY_BLUE,
  PATH_POLARIZATION,
  PATH_WONDER_MOMENTS
]

// 辅助函数：根据ID获取路径
export function getPathById(pathId: string): ExplorationPath | undefined {
  return EXPLORATION_PATHS.find(p => p.id === pathId)
}

// 辅助函数：根据ID获取节点
export function getNodeById(pathId: string, nodeId: string): ExplorationNode | undefined {
  const path = getPathById(pathId)
  return path?.nodes.find(n => n.id === nodeId)
}

// 辅助函数：获取入门级路径
export function getBeginnerPaths(): ExplorationPath[] {
  return EXPLORATION_PATHS.filter(p => p.difficulty === 'beginner')
}
