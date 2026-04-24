import Phaser from 'phaser';
import {
  W, H, GROUND_Y, JESSE_X, LEVEL_PIXELS,
  BEER_START, BEER_JEFF, BEER_KARL, BEER_EMMA,
  BASE_SCROLL, MAX_SCROLL,
  GRAVITY, JUMP_VEL,
  JEFF_EXTRA_SPEED,
  BOOST_MULT, BOOST_DURATION, NALA_CATCH_WINDOW,
  EMMA_WATER_TIMEOUT,
} from '../constants.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init() {
    this.beer        = BEER_START;
    this.scrolled    = 0;
    this.scrollSpeed = BASE_SCROLL;
    this.gameOver    = false;
    this.won         = false;
    this.isBoosted   = false;
    this.boostTimer  = 0;
    this.emmaCount   = 0;
    this.nalaCount   = 0;

    // Jesse physics
    this.jesseVY    = 0;
    this.isGrounded = true;
    this.isSliding  = false;
    this.slideTimer = 0;
    this.drunkWobble = 0;

    // Spawn timers (ms)
    this.jeffTimer  = 2500;
    this.karlTimer  = 8000;
    this.emmaTimer  = 6000;
    this.nalaTimer  = 20000;

    // Active entities
    this.jeffs     = [];
    this.karl      = null;
    this.emma      = null;
    this.nala      = null;
    this.obstacles = [];

    // Obstacle spawn timer and platform state
    this.obstacleTimer = Phaser.Math.Between(2500, 5000);
    this.onObstacle    = false;

    // Input tracking
    this.pointerDownY = 0;
    this.pointerDownTime = 0;

    // Animation frame counters
    this.runFrame   = 0;
    this.runFrameTimer = 0;
  }

  create() {
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // ── Background layers (landscape heights: FAR=170 NEAR=155 LAMP=170 GND=65) ─
    const FAR_H  = 170;
    const NEAR_H = 155;
    const LAMP_H = 170;
    const GND_H  = H - GROUND_Y;  // 65
    this.add.rectangle(0, 0, W, H, 0x0f0f1e).setOrigin(0, 0);
    this.bgSky  = this.add.image(0, 0, 'bg_sky').setOrigin(0, 0);
    this.bgFar  = this.add.tileSprite(0, 0,               W, FAR_H,  'bg_far').setOrigin(0, 0);
    this.bgNear = this.add.tileSprite(0, GROUND_Y - NEAR_H, W, NEAR_H, 'bg_near').setOrigin(0, 0);
    this.bgLamp = this.add.tileSprite(0, GROUND_Y - LAMP_H, W, LAMP_H, 'bg_lamps').setOrigin(0, 0);
    this.bgGnd  = this.add.tileSprite(0, GROUND_Y,         W, GND_H,  'bg_ground').setOrigin(0, 0);

    // ── Jesse sprite ──────────────────────────────────────────────────────────
    this.jesse = this.add.sprite(JESSE_X, GROUND_Y, 'jesse_run0').setOrigin(0.5, 1.0).setDepth(10);

    // ── HUD ───────────────────────────────────────────────────────────────────
    this.createHUD();

    // ── Input ─────────────────────────────────────────────────────────────────
    this.input.on('pointerdown', (p) => {
      if (this.gameOver || this.won) return;
      this.pointerDownY    = p.y;
      this.pointerDownTime = this.time.now;
      this.tryInteract(p);
    });
    this.input.on('pointerup', (p) => {
      if (this.gameOver || this.won) return;
      const dy   = p.y - this.pointerDownY;
      const dt   = this.time.now - this.pointerDownTime;
      const fast = dt < 350;
      if (dy > 60 && fast) {
        this.startSlide();
      } else if (Math.abs(dy) < 40 && fast) {
        this.tryJump();
      }
    });

    // Keyboard fallback (desktop testing)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyDown  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  createHUD() {
    // Dark header bar
    this.add.rectangle(0, 0, W, 70, 0x0A0A18, 0.85).setOrigin(0, 0);

    // Beer icon + label
    this.add.text(14, 8, '🍺', { fontSize: '18px' });
    this.add.text(40, 10, 'BEER', { fontFamily: 'monospace', fontSize: '12px', color: '#888899' });

    // Beer meter track
    this.add.rectangle(40, 28, 180, 18, 0x2A2A3A).setOrigin(0, 0.5);
    this.beerBar = this.add.rectangle(40, 28, 1, 18, 0xF5B800).setOrigin(0, 0.5);
    this.updateBeerBar();

    // Beer percent text
    this.beerPct = this.add.text(228, 19, `${Math.round(this.beer)}%`, {
      fontFamily: 'monospace', fontSize: '13px', color: '#F5C842', fontStyle: 'bold'
    });

    // Distance
    this.add.text(W - 14, 8, '🏠 Fort Collins', {
      fontFamily: 'monospace', fontSize: '11px', color: '#888899'
    }).setOrigin(1, 0);
    this.distText = this.add.text(W - 14, 26, '0.0 mi', {
      fontFamily: 'monospace', fontSize: '14px', color: '#AAD4AA', fontStyle: 'bold'
    }).setOrigin(1, 0);

  }

  updateBeerBar() {
    const maxW = 180;
    const pct  = Phaser.Math.Clamp(this.beer / 100, 0, 1);
    const barW = Math.max(1, pct * maxW);
    this.beerBar.width = barW;

    // Color shifts red as beer increases
    if (pct < 0.5)       this.beerBar.setFillStyle(0x44CC44);
    else if (pct < 0.75) this.beerBar.setFillStyle(0xF5B800);
    else                 this.beerBar.setFillStyle(0xFF3300);
  }

  // ── Game state ──────────────────────────────────────────────────────────────

  update(time, delta) {
    if (this.gameOver || this.won) return;
    const dt = delta / 1000;

    this.updateDifficulty();
    this.updateScroll(dt);
    this.updateObstacles(dt);   // move obstacles before Jesse so ground level is current
    this.updateJesse(dt, time);
    this.updateEntities(dt, time);
    this.checkCollisions();
    this.updateHUDValues(dt);
    this.checkEndConditions();
    this.updateSpawnTimers(dt, time);

    // Keyboard fallback
    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) this.tryJump();
    if (Phaser.Input.Keyboard.JustDown(this.keyDown))  this.startSlide();
  }

  updateDifficulty() {
    const progress = Phaser.Math.Clamp(this.scrolled / LEVEL_PIXELS, 0, 1);
    this.scrollSpeed = BASE_SCROLL + progress * (MAX_SCROLL - BASE_SCROLL);
  }

  updateScroll(dt) {
    const speed = this.isBoosted
      ? this.scrollSpeed * BOOST_MULT
      : this.scrollSpeed;

    this.scrolled += speed * dt;

    this.bgFar.tilePositionX  += speed * 0.18 * dt;
    this.bgNear.tilePositionX += speed * 0.55 * dt;
    this.bgLamp.tilePositionX += speed * 0.8  * dt;
    this.bgGnd.tilePositionX  += speed * dt;
  }

  // ── Jesse ──────────────────────────────────────────────────────────────────

  tryJump() {
    if (this.isGrounded && !this.isSliding) {
      this.jesseVY    = JUMP_VEL;
      this.isGrounded = false;
    }
  }

  startSlide() {
    if (!this.isGrounded) return;
    this.isSliding  = true;
    this.slideTimer = 700;
  }

  updateJesse(dt, time) {
    // Slide timer
    if (this.isSliding) {
      this.slideTimer -= dt * 1000;
      if (this.slideTimer <= 0) this.isSliding = false;
    }

    // Gravity — ground level may be elevated by an obstacle platform
    const groundLevel = this.getEffectiveGroundLevel();
    if (!this.isGrounded) {
      this.jesseVY += GRAVITY * dt;
      this.jesse.y += this.jesseVY * dt;
      if (this.jesse.y >= groundLevel) {
        this.jesse.y    = groundLevel;
        this.jesseVY    = 0;
        this.isGrounded = true;
      }
    } else {
      if (groundLevel > this.jesse.y + 2) {
        // Platform scrolled away — start falling
        this.isGrounded = false;
      } else {
        // Snap to current surface (handles normal ground and obstacle top)
        this.jesse.y = groundLevel;
      }
    }

    // Track whether Jesse is riding an obstacle (used to skip ground-level collisions)
    this.onObstacle = this.isGrounded && this.jesse.y < GROUND_Y - 5;

    // Drunk wobble visual (beer > 65%)
    if (this.beer > 65 && this.isGrounded) {
      this.drunkWobble += dt * 3;
      this.jesse.x = JESSE_X + Math.sin(this.drunkWobble) * 6;
    } else {
      this.jesse.x = JESSE_X;
    }

    // Run animation
    this.runFrameTimer += dt * 1000;
    const frameMs = this.isBoosted ? 90 : 160;
    if (this.runFrameTimer >= frameMs) {
      this.runFrame = 1 - this.runFrame;
      this.runFrameTimer = 0;
    }

    // Pick sprite frame
    this.updateJesseSprite();
  }

  updateJesseSprite() {
    if (this.isSliding) {
      this.jesse.setTexture('jesse_slide');
      this.jesse.setOrigin(0.5, 1.0);
      return;
    }
    if (this.isBoosted) {
      this.jesse.setTexture('jesse_boost');
      this.jesse.setOrigin(0.5, 1.0);
      return;
    }
    if (!this.isGrounded) {
      this.jesse.setTexture('jesse_jump');
      this.jesse.setOrigin(0.5, 1.0);
      return;
    }
    if (this.beer >= 65) {
      this.jesse.setTexture(`jesse_drunk${this.runFrame}`);
      this.jesse.setOrigin(0.5, 1.0);
      return;
    }
    this.jesse.setTexture(`jesse_run${this.runFrame}`);
    this.jesse.setOrigin(0.5, 1.0);
  }

  // ── Entity updates ─────────────────────────────────────────────────────────

  updateEntities(dt, time) {
    this.updateJeffs(dt);
    this.updateKarl(dt);
    this.updateEmma(dt);
    this.updateNala(dt);

    // Boost timer
    if (this.isBoosted) {
      this.boostTimer -= dt * 1000;
      if (this.boostTimer <= 0) {
        this.isBoosted = false;
        // Nala exits
        if (this.nala) {
          this.nala.phase = 'exit';
        }
      }
    }
  }

  updateJeffs(dt) {
    const speed = this.isBoosted ? this.scrollSpeed * BOOST_MULT : this.scrollSpeed;
    this.jeffs = this.jeffs.filter(j => {
      j.x -= (speed + JEFF_EXTRA_SPEED) * dt;
      j.sprite.x = j.x;

      // Animate Jeff
      j.animTimer += dt * 1000;
      if (j.animTimer >= 180) {
        j.frame = 1 - j.frame;
        j.animTimer = 0;
        j.sprite.setTexture(`jeff_run${j.frame}`);
      }

      if (j.x < -80) {
        j.sprite.destroy();
        return false;
      }
      return true;
    });
  }

  updateKarl(dt) {
    if (!this.karl) return;
    const k = this.karl;
    const speed = this.isBoosted ? this.scrollSpeed * BOOST_MULT : this.scrollSpeed;

    k.animTimer += dt * 1000;
    if (k.animTimer >= 200) {
      k.frame = 1 - k.frame;
      k.animTimer = 0;
    }

    k.x -= (speed + JEFF_EXTRA_SPEED) * dt;
    k.sprite.x = k.x;
    k.sprite.setTexture(k.hit ? 'karl_ditched' : `karl_jog${k.frame}`);

    if (k.x < -80) {
      k.sprite.destroy();
      this.karl = null;
    }
  }

  updateEmma(dt) {
    if (!this.emma) return;
    const e = this.emma;

    e.animTimer += dt * 1000;
    if (e.animTimer >= 200) {
      e.frame = 1 - e.frame;
      e.animTimer = 0;
    }

    const speed = this.isBoosted ? this.scrollSpeed * BOOST_MULT : this.scrollSpeed;

    if (e.phase === 'approach') {
      e.x -= (speed + 120) * dt;
      if (e.x <= JESSE_X + 65) {
        e.phase = 'offer';
        e.timer = 0;
        e.sprite.setTexture('emma_offer');
      }
    } else if (e.phase === 'offer') {
      e.x = JESSE_X + 65;
      e.timer += dt * 1000;
      if (e.timer >= EMMA_WATER_TIMEOUT) {
        e.phase = 'exit';
        e.sprite.setTexture('emma_ignored');
        const shrug = this.add.text(e.x, GROUND_Y - 100, '😞', { fontSize: '24px' })
          .setOrigin(0.5, 1);
        this.tweens.add({ targets: shrug, y: GROUND_Y - 150, alpha: 0, duration: 800,
          onComplete: () => shrug.destroy() });
      }
    } else if (e.phase === 'exit') {
      e.x -= (speed + 80) * dt;
      if (e.x < -60) {
        e.sprite.destroy();
        this.emma = null;
      }
    }

    if (this.emma) {
      e.sprite.x = e.x;
      if (e.phase === 'approach') e.sprite.setTexture(`emma_run${e.frame}`);
    }
  }

  updateNala(dt) {
    if (!this.nala) return;
    const n = this.nala;

    n.animTimer += dt * 1000;
    if (n.animTimer >= 120) {
      n.frame = 1 - n.frame;
      n.animTimer = 0;
    }

    const speed = this.isBoosted ? this.scrollSpeed * BOOST_MULT : this.scrollSpeed;

    if (n.phase === 'streak') {
      n.x -= (speed + 500) * dt;
      n.sprite.setTexture('nala_streak');
      if (n.x <= JESSE_X + 90) {
        n.phase = 'catchable';
        n.timer = 0;
        n.sprite.setTexture('nala_trot0');
        // Pulse effect to show catchable
        this.tweens.add({
          targets: n.sprite, scaleX: 1.15, scaleY: 1.15,
          duration: 200, yoyo: true, repeat: 2
        });
      }
    } else if (n.phase === 'catchable') {
      n.x -= (speed + 60) * dt;
      n.sprite.setTexture(`nala_trot${n.frame}`);
      n.timer += dt * 1000;
      if (n.timer >= NALA_CATCH_WINDOW) {
        // Missed
        n.phase = 'exit';
        n.sprite.setTexture('nala_trot0');
      }
    } else if (n.phase === 'boost') {
      // Nala pulls Jesse; lock Nala just ahead of Jesse
      n.x = JESSE_X - 55;
      n.sprite.setTexture(`nala_boost`);
    } else if (n.phase === 'exit') {
      n.x -= (speed + 200) * dt;
      if (n.x < -90) {
        n.sprite.destroy();
        this.nala = null;
      }
    }

    if (this.nala) {
      n.sprite.x = n.x;
    }
  }

  // ── Collisions ─────────────────────────────────────────────────────────────

  checkCollisions() {
    const jBox = this.getJesseBox();

    // When Jesse is on an obstacle platform all ground-level characters pass below
    if (this.onObstacle) return;

    // Jeff: jump over or slide under
    this.jeffs.forEach(j => {
      if (j.hit) return;
      const jfBox = { x: j.x - 20, y: GROUND_Y - 88, w: 40, h: 88 };
      if (!this.isSliding && overlaps(jBox, jfBox)) {
        if (this.isGrounded || this.jesse.y > GROUND_Y - 50) {
          j.hit = true;
          j.sprite.setTexture('jeff_offer');
          this.beer = Math.min(100, this.beer + BEER_JEFF);
          this.showBeerHit(j.x, '+' + BEER_JEFF + '%', '#FF4400');
          this.cameras.main.shake(250, 0.01);
        }
      }
    });

    // Karl: jump over or slide under
    if (this.karl && !this.karl.hit) {
      const kBox = { x: this.karl.x - 20, y: GROUND_Y - 82, w: 40, h: 82 };
      if (!this.isSliding && overlaps(jBox, kBox)) {
        if (this.isGrounded || this.jesse.y > GROUND_Y - 50) {
          this.karl.hit = true;
          this.beer = Math.min(100, this.beer + BEER_KARL);
          this.showBeerHit(this.karl.x, '+' + BEER_KARL + '% 🍺', '#F5B800');
          this.cameras.main.shake(250, 0.01);
        }
      }
    }
  }

  getJesseBox() {
    if (this.isSliding) {
      return { x: JESSE_X - 30, y: GROUND_Y - 34, w: 60, h: 34 };
    }
    return { x: JESSE_X - 14, y: this.jesse.y - 78, w: 28, h: 78 };
  }

  showBeerHit(x, text, color) {
    const t = this.add.text(x, GROUND_Y - 60, text, {
      fontFamily: 'monospace', fontSize: '18px', color, fontStyle: 'bold',
      stroke: '#1a1a1a', strokeThickness: 2,
    }).setOrigin(0.5, 1);
    this.tweens.add({ targets: t, y: GROUND_Y - 130, alpha: 0, duration: 900,
      onComplete: () => t.destroy() });
  }

  // ── Tap interaction ─────────────────────────────────────────────────────────

  tryInteract(pointer) {
    // Check Nala tap
    if (this.nala && this.nala.phase === 'catchable') {
      const nd = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.nala.x, GROUND_Y - 30);
      if (nd < 70) {
        this.catchNala();
        return;
      }
    }
    // Check Emma tap
    if (this.emma && this.emma.phase === 'offer') {
      const ed = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.emma.x, GROUND_Y - 50);
      if (ed < 60) {
        this.acceptEmmaWater();
        return;
      }
    }
  }

  catchNala() {
    this.nala.phase = 'boost';
    this.nalaCount++;
    this.isBoosted  = true;
    this.boostTimer = BOOST_DURATION;

    this.showBeerHit(JESSE_X, '🐕 BOOST!', '#A855F7');
    this.cameras.main.shake(150, 0.005);

    // Tint screen purple briefly
    const overlay = this.add.rectangle(0, 0, W, H, 0x8B5CF6, 0.2).setOrigin(0, 0);
    this.tweens.add({ targets: overlay, alpha: 0, duration: 600, onComplete: () => overlay.destroy() });
  }

  acceptEmmaWater() {
    this.emma.phase = 'exit';
    this.emma.sprite.setTexture('emma_accepted');
    this.emmaCount++;
    this.beer = Math.max(0, this.beer - BEER_EMMA);
    this.showBeerHit(JESSE_X, '-' + BEER_EMMA + '% 💧', '#44AAFF');

    // Flash blue hydration
    const overlay = this.add.rectangle(0, 0, W, H, 0x0088CC, 0.18).setOrigin(0, 0);
    this.tweens.add({ targets: overlay, alpha: 0, duration: 500, onComplete: () => overlay.destroy() });
  }

  // ── Spawn timers ───────────────────────────────────────────────────────────

  updateSpawnTimers(dt) {
    if (this.gameOver || this.won) return;
    const progress = Phaser.Math.Clamp(this.scrolled / LEVEL_PIXELS, 0, 1);
    const dtMs     = dt * 1000;

    // Jeff: interval 7s → 2.8s as progress increases
    const jeffInterval = 7000 - progress * 4200;
    this.jeffTimer -= dtMs;
    if (this.jeffTimer <= 0) {
      this.spawnJeff();
      this.jeffTimer = jeffInterval + Phaser.Math.Between(-400, 400);
    }

    // Karl: interval 22s → 10s; only if no active Karl
    const karlInterval = 22000 - progress * 12000;
    this.karlTimer -= dtMs;
    if (this.karlTimer <= 0) {
      if (!this.karl) this.spawnKarl();
      this.karlTimer = karlInterval + Phaser.Math.Between(-1000, 1000);
    }

    // Emma: interval 16s → 14s
    this.emmaTimer -= dtMs;
    if (this.emmaTimer <= 0) {
      if (!this.emma) this.spawnEmma();
      this.emmaTimer = Phaser.Math.Between(14000, 20000);
    }

    // Nala: interval fixed ~38s, sparingly
    this.nalaTimer -= dtMs;
    if (this.nalaTimer <= 0) {
      if (!this.nala) this.spawnNala();
      this.nalaTimer = Phaser.Math.Between(32000, 46000);
    }

    // Obstacles: police cars, food carts, dumpsters
    this.obstacleTimer -= dtMs;
    if (this.obstacleTimer <= 0) {
      this.spawnObstacle();
      this.obstacleTimer = Phaser.Math.Between(3000, 6000);
    }
  }

  spawnJeff() {
    const sprite = this.add.sprite(W + 60, GROUND_Y, 'jeff_run0').setOrigin(0.5, 1.0).setDepth(8);
    this.jeffs.push({ sprite, x: W + 60, frame: 0, animTimer: 0, hit: false });
  }

  spawnKarl() {
    const startX = W + 60;
    const sprite = this.add.sprite(startX, GROUND_Y, 'karl_jog0').setOrigin(0.5, 1.0).setDepth(8);
    this.karl = { sprite, x: startX, hit: false, frame: 0, animTimer: 0 };
  }

  spawnEmma() {
    const startX = W + 50;
    const sprite = this.add.sprite(startX, GROUND_Y, 'emma_run0').setOrigin(0.5, 1.0).setDepth(8);
    this.emma = { sprite, x: startX, phase: 'approach', timer: 0, frame: 0, animTimer: 0 };
  }

  spawnNala() {
    const startX = W + 60;
    const sprite = this.add.sprite(startX, GROUND_Y, 'nala_streak').setOrigin(0.5, 1.0).setDepth(8);
    this.nala = { sprite, x: startX, phase: 'streak', timer: 0, frame: 0, animTimer: 0 };
  }

  spawnObstacle() {
    // Weighted pool: ground obstacles more frequent, elevated platforms less so
    const pool = [
      { type: 'police_car',   w: 110, h: 55  },
      { type: 'police_car',   w: 110, h: 55  },  // double-weight
      { type: 'food_cart',    w: 70,  h: 72  },
      { type: 'food_cart',    w: 70,  h: 72  },
      { type: 'dumpster',     w: 85,  h: 68  },
      { type: 'scaffold',     w: 120, h: 100 },  // tier 1 — one jump from ground
      { type: 'scaffold',     w: 120, h: 100 },
      { type: 'fire_escape',  w: 90,  h: 170 },  // tier 2 — jump from scaffold
    ];
    const t = Phaser.Utils.Array.GetRandom(pool);
    const startX = W + t.w / 2 + 20;
    const sprite = this.add.sprite(startX, GROUND_Y, `obstacle_${t.type}`)
      .setOrigin(0.5, 1.0).setDepth(5);
    this.obstacles.push({ sprite, x: startX, w: t.w, h: t.h, type: t.type });
  }

  // ── Obstacle platform helpers ──────────────────────────────────────────────

  updateObstacles(dt) {
    const speed = this.isBoosted ? this.scrollSpeed * BOOST_MULT : this.scrollSpeed;
    this.obstacles = this.obstacles.filter(obs => {
      obs.x -= speed * dt;
      obs.sprite.x = obs.x;
      if (obs.x + obs.w / 2 < -20) {
        obs.sprite.destroy();
        return false;
      }
      return true;
    });
  }

  getEffectiveGroundLevel() {
    for (const obs of this.obstacles) {
      const obsLeft  = obs.x - obs.w / 2;
      const obsRight = obs.x + obs.w / 2;
      const obsTop   = GROUND_Y - obs.h;
      if (JESSE_X >= obsLeft - 4 && JESSE_X <= obsRight + 4) {
        if (this.jesse.y <= obsTop + 8) {
          // Only snap to this platform when falling (jesseVY >= 0) or already standing on it.
          // When rising (jesseVY < 0) Jesse passes through so he can jump up to higher levels.
          if (this.jesseVY >= 0 || this.isGrounded) {
            return obsTop;
          }
        }
      }
    }
    return GROUND_Y;
  }

  // ── HUD updates ────────────────────────────────────────────────────────────

  updateHUDValues(dt) {
    this.beer = Phaser.Math.Clamp(this.beer, 0, 100);
    this.updateBeerBar();
    this.beerPct.setText(`${Math.round(this.beer)}%`);

    const miles = (this.scrolled / LEVEL_PIXELS * 0.4).toFixed(2);
    this.distText.setText(`${miles} mi`);
  }

  // ── End conditions ─────────────────────────────────────────────────────────

  checkEndConditions() {
    if (this.beer >= 100) {
      this.triggerGameOver();
    } else if (this.scrolled >= LEVEL_PIXELS) {
      this.triggerWin();
    }
  }

  triggerGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.jesse.setTexture('jesse_passed_out');
    this.jesse.setOrigin(0.5, 1.0);
    this.cameras.main.shake(400, 0.02);
    this.time.delayedCall(1200, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('EndScene', { win: false, emmaCount: this.emmaCount, nalaCount: this.nalaCount });
      });
    });
  }

  triggerWin() {
    if (this.won) return;
    this.won = true;
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.time.delayedCall(600, () => {
      this.scene.start('EndScene', { win: true, emmaCount: this.emmaCount, nalaCount: this.nalaCount });
    });
  }
}

// ── AABB overlap ──────────────────────────────────────────────────────────────

function overlaps(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}
