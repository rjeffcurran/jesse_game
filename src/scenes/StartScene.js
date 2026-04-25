import Phaser from 'phaser';
import { W, H } from '../constants.js';

const DIFFICULTIES = [
  { key: 'easy',   label: 'EASY',   color: '#5BDF6A', desc: 'Chill night out' },
  { key: 'medium', label: 'MEDIUM', color: '#F5C842', desc: 'Classic run home' },
  { key: 'hard',   label: 'HARD',   color: '#FF4444', desc: 'Last call chaos' },
];

export default class StartScene extends Phaser.Scene {
  constructor() { super({ key: 'StartScene' }); }

  init(data) {
    this.selectedDiff = (data && data.difficulty) || 'medium';
  }

  create() {
    // Sky
    this.add.rectangle(0, 0, W, H, 0x0f0f1e).setOrigin(0, 0);
    this.add.image(0, H - 400, 'luckyjoes').setOrigin(0, 0);
    this.add.rectangle(0, 0, W, H * 0.45, 0x0f0f22, 0.6).setOrigin(0, 0);

    // Title
    this.add.text(W / 2, 60, "LUCKY JOE'S\nESCAPE", {
      fontFamily: 'monospace',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#F5C842',
      stroke: '#1a1a1a',
      strokeThickness: 4,
      align: 'center',
      wordWrap: { width: W - 40 },
    }).setOrigin(0.5, 0);

    this.add.text(W / 2, 155, 'Help Jesse make it home.', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#CCBBAA',
      align: 'center',
    }).setOrigin(0.5, 0);

    // Difficulty label
    this.add.text(W / 2, 196, '— SELECT DIFFICULTY —', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#8899AA',
      align: 'center',
    }).setOrigin(0.5, 0);

    // Difficulty buttons
    this.btnObjects = {};
    const btnY = 222;
    const btnW = 160;
    const btnH = 48;
    const gap  = 14;
    const totalW = DIFFICULTIES.length * btnW + (DIFFICULTIES.length - 1) * gap;
    const startX = (W - totalW) / 2;

    DIFFICULTIES.forEach((d, i) => {
      const bx = startX + i * (btnW + gap);
      const bg = this.add.rectangle(bx + btnW / 2, btnY + btnH / 2, btnW, btnH, 0x1a1a2e)
        .setStrokeStyle(2, 0x445566)
        .setInteractive({ useHandCursor: true });

      const label = this.add.text(bx + btnW / 2, btnY + 10, d.label, {
        fontFamily: 'monospace',
        fontSize: '17px',
        fontStyle: 'bold',
        color: d.color,
      }).setOrigin(0.5, 0);

      const desc = this.add.text(bx + btnW / 2, btnY + 30, d.desc, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#889AA8',
      }).setOrigin(0.5, 0);

      this.btnObjects[d.key] = { bg, label, desc, color: d.color };

      bg.on('pointerdown', () => {
        this.selectedDiff = d.key;
        this.refreshButtons();
      });

      bg.on('pointerover', () => bg.setFillStyle(0x222244));
      bg.on('pointerout',  () => this.refreshButtons());
    });

    this.refreshButtons();

    // Controls hint
    this.add.text(W / 2, H - 88, 'TAP → Jump    Swipe Down → Slide\nTap Emma for water • Tap Nala for boost', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#8899AA',
      align: 'center',
    }).setOrigin(0.5, 0);

    // Start button
    const startBtn = this.add.text(W / 2, H - 46, '— TAP TO START —', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#F5C842',
      stroke: '#1a1a1a',
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: startBtn,
      alpha: { from: 1, to: 0.2 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    startBtn.on('pointerdown', () => this.startGame());

    // Also allow tapping outside buttons to start (original feel)
    this.input.on('pointerdown', (ptr) => {
      // Only if not hitting a difficulty button
      const hitBtn = DIFFICULTIES.some(d => {
        const i = DIFFICULTIES.indexOf(d);
        const bx = startX + i * (btnW + gap);
        return ptr.x >= bx && ptr.x <= bx + btnW && ptr.y >= btnY && ptr.y <= btnY + btnH;
      });
      if (!hitBtn) this.startGame();
    });
  }

  refreshButtons() {
    DIFFICULTIES.forEach(d => {
      const { bg } = this.btnObjects[d.key];
      if (d.key === this.selectedDiff) {
        bg.setFillStyle(0x223344).setStrokeStyle(3, Phaser.Display.Color.HexStringToColor(d.color).color);
      } else {
        bg.setFillStyle(0x1a1a2e).setStrokeStyle(2, 0x445566);
      }
    });
  }

  startGame() {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start('GameScene', { difficulty: this.selectedDiff });
    });
  }
}
