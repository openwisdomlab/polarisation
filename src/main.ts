/**
 * PolarCraft - 偏振光体素解谜游戏
 * 主入口文件
 */

import { World, TUTORIAL_LEVELS, LevelData } from './World';
import { Renderer } from './Renderer';
import { PlayerControls } from './PlayerControls';

// 教程提示配置
interface TutorialHint {
  text: string;
  keys?: string[];
  duration?: number;
}

const TUTORIAL_HINTS: Record<number, TutorialHint[]> = {
  0: [
    { text: '光源正在发射偏振光。观察光线是否到达感应器。', duration: 5000 },
    { text: '按 <key>R</key> 旋转光源改变偏振角度，使感应器激活。', keys: ['R'], duration: 8000 },
    { text: '按 <key>V</key> 切换偏振视角，可以看到光的偏振颜色。', keys: ['V'], duration: 6000 }
  ],
  1: [
    { text: '光需要通过偏振片。按 <key>R</key> 调整偏振片角度。', keys: ['R'], duration: 6000 },
    { text: '马吕斯定律：光强 = 原强度 × cos²(角度差)', duration: 8000 }
  ],
  2: [
    { text: '两个偏振片串联时，90°角度差会完全阻挡光线！', duration: 6000 },
    { text: '尝试找到让光通过的角度组合。', duration: 5000 }
  ],
  3: [
    { text: '波片可以旋转光的偏振方向而不损失强度。', duration: 6000 },
    { text: '按 <key>R</key> 改变波片的旋转量（45°或90°）', keys: ['R'], duration: 6000 }
  ],
  4: [
    { text: '方解石（双折射晶体）将光分裂成两束垂直偏振的光。', duration: 7000 },
    { text: '尝试激活两个不同偏振角度的感应器。', duration: 6000 }
  ]
};

/**
 * 游戏主类
 */
class Game {
  private world: World;
  private renderer: Renderer;
  private controls: PlayerControls;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private currentLevelIndex: number = 0;
  private currentLevel: LevelData | null = null;
  private tutorialHintIndex: number = 0;
  private hintTimeout: number | null = null;

  constructor() {
    // 获取画布
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    // 创建世界
    this.world = new World(32);

    // 创建渲染器
    this.renderer = new Renderer(canvas, this.world);

    // 创建玩家控制
    this.controls = new PlayerControls(
      this.renderer.getCamera(),
      this.world,
      this.renderer
    );

    // 设置初始位置
    this.controls.setPosition(5, 3, 10);

    // 初始化UI
    this.initUI();

    // 监听世界事件（用于目标追踪）
    this.world.addListener(this.onWorldEvent.bind(this));

    // 加载第一个教程关卡
    this.loadTutorialLevel(0);

    // 显示初始控制提示
    this.showControlBanner();

    // 隐藏加载界面
    setTimeout(() => {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) {
        loadingEl.style.opacity = '0';
        loadingEl.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          loadingEl.style.display = 'none';
        }, 500);
      }
    }, 1000);
  }

  /**
   * 世界事件处理
   */
  private onWorldEvent(type: string, _data: unknown): void {
    if (type === 'sensorChanged' || type === 'lightUpdated') {
      this.updateGoalDisplay();
    }
  }

  /**
   * 显示控制提示横幅
   */
  private showControlBanner(): void {
    const banner = document.getElementById('control-banner');
    if (banner) {
      banner.classList.add('visible');

      // 点击或按键隐藏
      const hideBanner = () => {
        banner.classList.remove('visible');
        document.removeEventListener('click', hideBanner);
        document.removeEventListener('keydown', hideBanner);
      };

      setTimeout(() => {
        document.addEventListener('click', hideBanner);
        document.addEventListener('keydown', hideBanner);
      }, 100);
    }
  }

  /**
   * 初始化UI
   */
  private initUI(): void {
    // 方块选择器点击事件
    const slots = document.querySelectorAll('.block-slot');
    slots.forEach((slot, index) => {
      slot.addEventListener('click', () => {
        // 模拟数字键按下
        const event = new KeyboardEvent('keydown', { key: String(index + 1) });
        document.dispatchEvent(event);
      });
    });

    // 帮助面板关闭按钮
    const closeBtn = document.querySelector('#help-panel .close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const panel = document.getElementById('help-panel');
        if (panel) {
          panel.classList.remove('visible');
        }
      });
    }

    // 添加关卡选择按钮
    this.createLevelSelector();
  }

  /**
   * 创建关卡选择器
   */
  private createLevelSelector(): void {
    const infoBar = document.getElementById('info-bar');
    if (!infoBar) return;

    const levelSelect = document.createElement('div');
    levelSelect.style.marginTop = '10px';
    levelSelect.innerHTML = `
      <span style="color: #64c8ff; font-size: 12px;">关卡: </span>
      ${TUTORIAL_LEVELS.map((_level, i) => `
        <button class="level-btn" data-level="${i}" style="
          background: rgba(100, 200, 255, 0.2);
          border: 1px solid rgba(100, 200, 255, 0.3);
          color: #fff;
          padding: 4px 8px;
          margin: 2px;
          cursor: pointer;
          font-size: 11px;
          border-radius: 4px;
        ">${i + 1}</button>
      `).join('')}
      <button class="level-btn" data-level="-1" style="
        background: rgba(255, 100, 100, 0.2);
        border: 1px solid rgba(255, 100, 100, 0.3);
        color: #fff;
        padding: 4px 8px;
        margin: 2px;
        cursor: pointer;
        font-size: 11px;
        border-radius: 4px;
      ">沙盒</button>
    `;

    infoBar.appendChild(levelSelect);

    // 添加点击事件
    levelSelect.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const levelIndex = parseInt((e.target as HTMLElement).dataset.level || '0');
        if (levelIndex === -1) {
          this.currentLevel = null;
          this.currentLevelIndex = -1;
          this.world.clear();
          this.updateLevelInfo('沙盒模式', '自由建造和实验！按 C 切换视角，按 H 查看帮助');

          // 隐藏目标和提示
          const goalContainer = document.getElementById('level-goal');
          if (goalContainer) goalContainer.style.display = 'none';

          const hintEl = document.getElementById('tutorial-hint');
          if (hintEl) hintEl.classList.remove('visible');

          if (this.hintTimeout) {
            clearTimeout(this.hintTimeout);
            this.hintTimeout = null;
          }
        } else {
          this.loadTutorialLevel(levelIndex);
        }
      });
    });
  }

  /**
   * 加载教程关卡
   */
  private loadTutorialLevel(index: number): void {
    if (index >= 0 && index < TUTORIAL_LEVELS.length) {
      const level = TUTORIAL_LEVELS[index];
      this.currentLevelIndex = index;
      this.currentLevel = level;
      this.tutorialHintIndex = 0;

      this.world.loadLevel(level);
      this.updateLevelInfo(level.name, level.description);
      this.controls.setPosition(5, 3, 10);

      // 更新目标显示
      this.updateGoalDisplay();

      // 开始显示教程提示
      this.startTutorialHints(index);
    }
  }

  /**
   * 更新目标显示
   */
  private updateGoalDisplay(): void {
    const goalList = document.getElementById('goal-list');
    const goalContainer = document.getElementById('level-goal');
    if (!goalList || !goalContainer) return;

    if (!this.currentLevel?.goal) {
      goalContainer.style.display = 'none';
      return;
    }

    goalContainer.style.display = 'block';
    const sensorPositions = this.currentLevel.goal.sensorPositions || [];

    let html = '';
    let allCompleted = true;

    for (const pos of sensorPositions) {
      const block = this.world.getBlock(pos.x, pos.y, pos.z);
      const isActivated = block?.activated === true;
      if (!isActivated) allCompleted = false;

      html += `
        <div class="goal-item ${isActivated ? 'completed' : ''}">
          <span class="status-icon">${isActivated ? '✓' : ''}</span>
          <span>感应器 (${pos.x}, ${pos.y}, ${pos.z})</span>
        </div>
      `;
    }

    goalList.innerHTML = html;

    // 如果所有目标完成，显示成功提示
    if (allCompleted && sensorPositions.length > 0) {
      this.showLevelComplete();
    }
  }

  /**
   * 显示关卡完成
   */
  private showLevelComplete(): void {
    const hintEl = document.getElementById('tutorial-hint');
    if (hintEl) {
      const hintText = hintEl.querySelector('.hint-text');
      if (hintText) {
        hintText.innerHTML = `🎉 关卡完成！${this.currentLevelIndex < TUTORIAL_LEVELS.length - 1 ? '点击下一关继续' : '恭喜通关！'}`;
      }
      hintEl.classList.add('visible');

      // 清除之前的提示超时
      if (this.hintTimeout) {
        clearTimeout(this.hintTimeout);
        this.hintTimeout = null;
      }
    }
  }

  /**
   * 开始教程提示
   */
  private startTutorialHints(levelIndex: number): void {
    // 清除之前的提示
    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
    }

    const hints = TUTORIAL_HINTS[levelIndex];
    if (!hints || hints.length === 0) return;

    this.tutorialHintIndex = 0;
    this.showNextHint(hints);
  }

  /**
   * 显示下一个提示
   */
  private showNextHint(hints: TutorialHint[]): void {
    if (this.tutorialHintIndex >= hints.length) return;

    const hint = hints[this.tutorialHintIndex];
    const hintEl = document.getElementById('tutorial-hint');
    if (hintEl) {
      const hintText = hintEl.querySelector('.hint-text');
      if (hintText) {
        // 替换 <key> 标签为样式化的按键显示
        let text = hint.text.replace(/<key>([^<]+)<\/key>/g,
          '<span class="hint-key">$1</span>');
        hintText.innerHTML = text;
      }
      hintEl.classList.add('visible');

      // 设置下一个提示的定时器
      const duration = hint.duration || 5000;
      this.hintTimeout = window.setTimeout(() => {
        this.tutorialHintIndex++;
        if (this.tutorialHintIndex < hints.length) {
          this.showNextHint(hints);
        } else {
          // 所有提示显示完毕，隐藏提示框
          hintEl.classList.remove('visible');
        }
      }, duration);
    }
  }

  /**
   * 更新关卡信息显示
   */
  private updateLevelInfo(name: string, description: string): void {
    const infoBar = document.getElementById('info-bar');
    if (infoBar) {
      const h2 = infoBar.querySelector('h2');
      const p = infoBar.querySelector('p');
      if (h2) h2.textContent = `⟡ ${name}`;
      if (p) {
        p.innerHTML = `${description}<br><br>
        <span style="color: #666;">WASD 移动 | 空格 跳跃 | 左键 放置 | 右键 删除 | R 旋转 | V 偏振视角 | H 帮助</span>`;
      }
    }
  }

  /**
   * 开始游戏循环
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  /**
   * 游戏循环
   */
  private gameLoop(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 更新
    this.update(deltaTime);

    // 渲染
    this.render();

    // 下一帧
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * 更新游戏状态
   */
  private update(deltaTime: number): void {
    this.controls.update(deltaTime);
  }

  /**
   * 渲染
   */
  private render(): void {
    this.renderer.render();
  }

  /**
   * 停止游戏
   */
  stop(): void {
    this.isRunning = false;
  }
}

// 全局帮助切换函数（用于HTML中的onclick）
(window as unknown as { toggleHelp: () => void }).toggleHelp = function() {
  const panel = document.getElementById('help-panel');
  if (panel) {
    panel.classList.toggle('visible');
  }
};

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.start();

  // 调试用
  (window as unknown as { game: Game }).game = game;
});
