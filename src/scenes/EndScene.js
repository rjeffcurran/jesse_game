import Phaser from 'phaser';
import { W, H } from '../constants.js';

export default class EndScene extends Phaser.Scene {
  constructor() { super({ key: 'EndScene' }); }

  init(data) {
    this.win        = data.win        ?? false;
    this.emmaCount  = data.emmaCount  ?? 0;
    this.nalaCount  = data.nalaCount  ?? 0;
    this.difficulty = data.difficulty ?? 'medium';
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.add.rectangle(0, 0, W, H, 0x0f0f1e).setOrigin(0, 0);

    if (this.win) {
      this.buildWinScreen();
    } else {
      this.buildLoseScreen();
    }

    // Play Again button
    const btnY = H - 90;
    const btn  = this.add.rectangle(W / 2, btnY, 220, 52, 0xF5C842).setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });
    const btnTxt = this.add.text(W / 2, btnY, 'PLAY AGAIN', {
      fontFamily: 'monospace', fontSize: '20px', fontStyle: 'bold', color: '#1a1a1a',
    }).setOrigin(0.5, 0.5);

    btn.on('pointerover', () => btn.setFillStyle(0xFFD700));
    btn.on('pointerout',  () => btn.setFillStyle(0xF5C842));
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('StartScene', { difficulty: this.difficulty }));
    });

    this.tweens.add({
      targets: [btn, btnTxt], scaleX: 1.04, scaleY: 1.04,
      duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
  }

  buildWinScreen() {
    // Uncommon building
    this.add.image(0, H - 400, 'uncommon').setOrigin(0, 0);
    // night sky overlay
    this.add.rectangle(0, 0, W, H * 0.5, 0x0a0a18, 0.7).setOrigin(0, 0);

    // Jesse arrives home sprite
    this.add.sprite(W / 2 - 30, H - 144, 'jesse_boost').setOrigin(0.5, 1.0).setScale(1.4);

    // Bonus: Emma with pizza
    if (this.emmaCount >= 3) {
      const pizzaEmma = this.add.sprite(W / 2 + 60, H - 144, 'emma_accepted').setOrigin(0.5, 1.0).setScale(1.2);
      this.add.text(W / 2 + 50, H - 200, '🍕', { fontSize: '32px' }).setOrigin(0.5, 1);
    }

    // Bonus: Nala waiting
    if (this.nalaCount >= 2) {
      const nalaHome = this.add.sprite(W / 2 - 90, H - 144, 'nala_trot0').setOrigin(0.5, 1.0).setScale(1.1);
      this.tweens.add({
        targets: nalaHome, y: H - 156, duration: 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    }

    // Title
    this.add.text(W / 2, 55, '🏠 MADE IT HOME!', {
      fontFamily: 'monospace', fontSize: '28px', fontStyle: 'bold',
      color: '#F5C842', stroke: '#1a1a1a', strokeThickness: 4, align: 'center',
    }).setOrigin(0.5, 0);

    this.add.text(W / 2, 105, 'Jesse survived the night.', {
      fontFamily: 'monospace', fontSize: '15px', color: '#AADDAA', align: 'center',
    }).setOrigin(0.5, 0);

    // Stats
    const statLines = [
      `Emma's water: ${this.emmaCount}x`,
      `Nala boosts:  ${this.nalaCount}x`,
    ];
    if (this.emmaCount >= 3) statLines.push('Bonus: Emma brought pizza! 🍕');
    if (this.nalaCount >= 2) statLines.push('Bonus: Nala is home! 🐕');

    statLines.forEach((line, i) => {
      this.add.text(W / 2, 140 + i * 26, line, {
        fontFamily: 'monospace', fontSize: '14px', color: '#CCDDCC', align: 'center',
      }).setOrigin(0.5, 0);
    });
  }

  buildLoseScreen() {
    // Dark street background
    this.add.rectangle(0, 0, W, H, 0x0a0a14).setOrigin(0, 0);

    // Streetlamp glow
    this.add.rectangle(W / 2 - 80, 0, 6, H * 0.7, 0x4A4A5A).setOrigin(0.5, 0);
    this.add.circle(W / 2 - 80, H * 0.25, 50, 0xFFAA44, 0.15);

    // Jesse passed out sprite
    const passedOut = this.add.sprite(W / 2, H - 200, 'jesse_passed_out')
      .setOrigin(0.5, 1.0).setScale(2.0);

    // Zzz animation
    const zzz = this.add.text(W / 2 + 50, H - 260, 'z z z', {
      fontFamily: 'monospace', fontSize: '22px', color: '#8899AA', fontStyle: 'italic',
    }).setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: zzz, y: H - 310, alpha: { from: 1, to: 0 },
      duration: 1800, repeat: -1, ease: 'Sine.easeOut',
    });

    // Title
    this.add.text(W / 2, 60, '😴 PASSED OUT', {
      fontFamily: 'monospace', fontSize: '30px', fontStyle: 'bold',
      color: '#FF4444', stroke: '#1a1a1a', strokeThickness: 4, align: 'center',
    }).setOrigin(0.5, 0);

    this.add.text(W / 2, 112, 'Jeff and Karl win again.', {
      fontFamily: 'monospace', fontSize: '15px', color: '#AA8888', align: 'center',
    }).setOrigin(0.5, 0);

    this.add.text(W / 2, 148, 'Jesse didn\'t make it home.', {
      fontFamily: 'monospace', fontSize: '13px', color: '#887777', align: 'center',
    }).setOrigin(0.5, 0);

    // Tips
    const tips = [
      'Tip: Tap Emma for water to lower beer!',
      'Tip: Tap Nala to boost past Karl!',
      'Tip: Jump to clear Jeff, slide to duck!',
    ];
    const tip = tips[Phaser.Math.Between(0, tips.length - 1)];
    this.add.text(W / 2, H - 145, tip, {
      fontFamily: 'monospace', fontSize: '12px', color: '#667788', align: 'center',
      wordWrap: { width: W - 40 },
    }).setOrigin(0.5, 0);
  }
}
