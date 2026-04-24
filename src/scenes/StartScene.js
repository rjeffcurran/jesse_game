import Phaser from 'phaser';
import { W, H } from '../constants.js';

export default class StartScene extends Phaser.Scene {
  constructor() { super({ key: 'StartScene' }); }

  create() {
    // Sky
    this.add.rectangle(0, 0, W, H, 0x0f0f1e).setOrigin(0, 0);

    // Lucky Joe's building illustration
    this.add.image(0, H - 400, 'luckyjoes').setOrigin(0, 0);

    // Stars / atmospheric overlay
    this.add.rectangle(0, 0, W, H * 0.45, 0x0f0f22, 0.6).setOrigin(0, 0);

    // Title
    const titleStyle = {
      fontFamily: 'monospace',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#F5C842',
      stroke: '#1a1a1a',
      strokeThickness: 4,
      align: 'center',
      wordWrap: { width: W - 40 },
    };
    this.add.text(W / 2, 80, "LUCKY JOE'S\nESCAPE", titleStyle).setOrigin(0.5, 0);

    // Tagline
    this.add.text(W / 2, 175, 'Help Jesse make it home.', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#CCBBAA',
      align: 'center',
    }).setOrigin(0.5, 0);

    // Controls hint
    const hintStyle = { fontFamily: 'monospace', fontSize: '13px', color: '#8899AA', align: 'center' };
    this.add.text(W / 2, H - 160, 'TAP → Jump    Swipe Down → Slide\nTap Emma for water • Tap Nala for boost', hintStyle).setOrigin(0.5, 0);

    // Tap to start prompt (flashing)
    const tapText = this.add.text(W / 2, H - 100, '— TAP TO START —', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#F5C842',
      stroke: '#1a1a1a',
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: tapText,
      alpha: { from: 1, to: 0.2 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    // Start on tap
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('GameScene'));
    });
  }
}
