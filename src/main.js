import Phaser from 'phaser';
import BootScene  from './scenes/BootScene.js';
import StartScene from './scenes/StartScene.js';
import GameScene  from './scenes/GameScene.js';
import EndScene   from './scenes/EndScene.js';
import { W, H }   from './constants.js';

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: '#0f0f1e',
  parent: document.body,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, StartScene, GameScene, EndScene],
  fps: { target: 60, forceSetTimeOut: false },
};

new Phaser.Game(config);
