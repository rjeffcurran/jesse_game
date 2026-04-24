import Phaser from 'phaser';
import { W, H } from '../constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  create() {
    genJesse(this);
    genEmma(this);
    genNala(this);
    genJeff(this);
    genKarl(this);
    genObstacles(this);
    genBackground(this);
    genUI(this);
    this.scene.start('StartScene');
  }
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function tex(scene, key, w, h, fn) {
  const g = scene.add.graphics();
  fn(g, w, h);
  g.generateTexture(key, w, h);
  g.destroy();
}

// ─── JESSE ────────────────────────────────────────────────────────────────────

function genJesse(scene) {
  const frames = ['run0','run1','jump','slide','drunk0','drunk1','passed_out','boost'];
  frames.forEach(f => {
    const w = f === 'slide' ? 76 : f === 'passed_out' ? 100 : f === 'jump' ? 72 : 50;
    const h = f === 'slide' ? 46 : f === 'passed_out' ? 46 : 90;
    tex(scene, `jesse_${f}`, w, h, (g) => drawJesse(g, f, w, h));
  });
}

function drawJesse(g, frame, w, h) {
  const SKIN  = 0xFDBCB4;
  const HAIR  = 0xCBA96A;
  const SHIRT = 0xF0EEE2;
  const PANTS = 0x1C1C2A;
  const SHOE  = 0xF2F2F2;
  const DARK  = 0x2a2a2a;
  const cx = w / 2;

  if (frame === 'passed_out') {
    // Horizontal, face-down on ground
    g.fillStyle(PANTS);  g.fillRect(8, 18, 55, 18);      // body/pants horizontal
    g.fillStyle(SHIRT);  g.fillRect(28, 16, 35, 14);     // shirt torso
    g.fillStyle(SKIN);   g.fillCircle(80, 26, 12);       // head (right side)
    g.fillStyle(HAIR);   g.fillEllipse(84, 19, 20, 12);  // hair
    // Zzzs
    g.fillStyle(0xAAAAAA);
    g.fillCircle(72, 8, 3);
    g.fillCircle(80, 3, 4);
    g.fillCircle(90, -2, 5);
    g.fillStyle(SHOE);
    g.fillRect(8, 20, 14, 10);  // left shoe sticking out
    return;
  }

  if (frame === 'slide') {
    // Low crouching forward lean
    const bx = 4;
    g.fillStyle(SKIN);   g.fillCircle(bx + 14, 24, 11);   // head
    g.fillStyle(HAIR);   g.fillEllipse(bx + 14, 16, 20, 12);
    g.fillStyle(SHIRT);  g.fillRect(bx + 20, 16, 30, 18); // torso horizontal
    g.fillStyle(PANTS);  g.fillRect(bx + 48, 18, 22, 14); // legs bunched
    g.fillStyle(SHOE);   g.fillRect(bx + 60, 28, 14, 8);
    g.fillStyle(SKIN);   g.fillRect(bx + 24, 32, 16, 6);  // arm forward
    return;
  }

  const isJump   = frame === 'jump';
  const isDrunk  = frame.startsWith('drunk');
  const isBoost  = frame === 'boost';
  const leftFwd  = (frame === 'run0' || frame === 'drunk0' || frame === 'passed_out');

  // ── Head ──
  g.fillStyle(SKIN);
  g.fillCircle(cx, 15, 13);

  // ── Hair ──
  g.fillStyle(HAIR);
  g.fillEllipse(cx, 7, 24, 16);

  // ── Eyes ──
  g.fillStyle(DARK);
  if (isDrunk) {
    g.fillRect(cx - 7, 13, 5, 2);  // half-closed slits
    g.fillRect(cx + 2, 13, 5, 2);
    // X marks for woozy
    g.lineStyle(1.5, DARK, 1);
    g.lineBetween(cx - 8, 11, cx - 3, 16);
    g.lineBetween(cx - 3, 11, cx - 8, 16);
  } else {
    g.fillRect(cx - 7, 11, 5, 5);
    g.fillRect(cx + 2, 11, 5, 5);
    g.fillStyle(0xFFFFFF);
    g.fillRect(cx - 6, 11, 2, 3);
    g.fillRect(cx + 3, 11, 2, 3);
  }

  // ── Smile ──
  if (isJump || isBoost) {
    g.fillStyle(DARK);
    g.fillRect(cx - 5, 21, 10, 2);
    g.fillStyle(0xFFFFFF);
    g.fillRect(cx - 4, 21, 8, 2);
  }

  // ── Neck ──
  g.fillStyle(SKIN);
  g.fillRect(cx - 4, 26, 8, 5);

  // ── Shirt torso ──
  g.fillStyle(SHIRT);
  g.fillRect(cx - 12, 31, 24, 22);
  // waffle-knit texture lines
  g.lineStyle(0.6, 0xC0BEB0, 0.5);
  for (let ty = 33; ty < 52; ty += 5)  g.lineBetween(cx - 12, ty, cx + 12, ty);
  for (let tx = cx - 12; tx < cx + 12; tx += 5) g.lineBetween(tx, 31, tx, 53);

  // ── Arms ──
  const lABot = leftFwd  ? cx - 17 : cx - 7;
  const rABot = leftFwd  ? cx + 7  : cx + 17;
  g.fillStyle(SHIRT);
  if (isJump) {
    g.fillRect(cx - 30, 33, 18, 9);
    g.fillRect(cx + 12, 33, 18, 9);
    g.fillStyle(SKIN);
    g.fillCircle(cx - 26, 42, 5);
    g.fillCircle(cx + 26, 42, 5);
  } else {
    g.fillPoints([{x:cx-12,y:31},{x:cx-5,y:31},{x:lABot+7,y:50},{x:lABot,y:50}], true);
    g.fillPoints([{x:cx+5, y:31},{x:cx+12,y:31},{x:rABot+7,y:50},{x:rABot,y:50}], true);
    g.fillStyle(SKIN);
    g.fillCircle(lABot + 3.5, 52, 4);
    g.fillCircle(rABot + 3.5, 52, 4);
  }

  // ── Pants / Legs ──
  g.fillStyle(PANTS);
  const llBot = leftFwd ? cx - 15 : cx - 5;
  const rlBot = leftFwd ? cx + 5  : cx + 15;
  if (isJump) {
    g.fillPoints([{x:cx-11,y:53},{x:cx-1,y:53},{x:cx-16,y:83},{x:cx-26,y:83}], true);
    g.fillPoints([{x:cx+1, y:53},{x:cx+11,y:53},{x:cx+16,y:83},{x:cx+26,y:83}], true);
  } else {
    g.fillPoints([{x:cx-11,y:53},{x:cx-1,y:53},{x:llBot+10,y:84},{x:llBot,y:84}], true);
    g.fillPoints([{x:cx+1, y:53},{x:cx+11,y:53},{x:rlBot+10,y:84},{x:rlBot,y:84}], true);
  }

  // ── Shoes ──
  g.fillStyle(SHOE);
  if (isJump) {
    g.fillRect(cx - 28, 83, 16, 7);
    g.fillRect(cx + 12, 83, 16, 7);
  } else {
    g.fillRect(llBot - 2, 84, 16, 6);
    g.fillRect(rlBot - 2, 84, 16, 6);
  }

  // Boost: wind lines
  if (isBoost) {
    g.lineStyle(2, 0xADD8E6, 0.7);
    g.lineBetween(cx - 20, 40, cx - 35, 44);
    g.lineBetween(cx - 20, 50, cx - 38, 54);
    g.lineBetween(cx - 20, 60, cx - 32, 62);
  }
}

// ─── EMMA ─────────────────────────────────────────────────────────────────────

function genEmma(scene) {
  ['run0','run1','offer','accepted','ignored'].forEach(f => {
    tex(scene, `emma_${f}`, 48, 90, (g) => drawEmma(g, f));
  });
}

function drawEmma(g, frame) {
  const SKIN   = 0xC8855A;
  const HAIR   = 0x3D1C02;
  const JACKET = 0xB0CCE0;  // light blue acid-wash denim
  const PANTS  = 0x1C1C2A;
  const SHOE   = 0x1a1a1a;
  const DARK   = 0x1a1a1a;
  const RING   = 0xFFD700;
  const cx = 24;
  const leftFwd = (frame === 'run0' || frame === 'accepted');

  // ── Head ──
  g.fillStyle(SKIN);
  g.fillCircle(cx, 14, 12);

  // ── Long wavy hair ──
  g.fillStyle(HAIR);
  g.fillEllipse(cx, 7, 22, 15);       // top hair
  g.fillRect(cx - 13, 14, 8, 40);    // left hair flow
  g.fillRect(cx + 5, 14, 8, 36);     // right hair flow
  g.fillEllipse(cx - 9, 52, 10, 8);  // hair end curl left
  g.fillEllipse(cx + 9, 48, 10, 8);  // hair end curl right

  // ── Eyes ──
  g.fillStyle(DARK);
  g.fillRect(cx - 6, 11, 4, 4);
  g.fillRect(cx + 2, 11, 4, 4);

  // ── Ring sparkle ──
  g.fillStyle(RING);
  g.fillCircle(cx - 16, 52, 3);
  g.fillRect(cx - 18, 50, 2, 2);
  g.fillRect(cx - 14, 50, 2, 2);

  // ── Jacket (torso) ──
  g.fillStyle(JACKET);
  g.fillRect(cx - 12, 26, 24, 24);
  // Acid-wash denim detail lines
  g.lineStyle(0.8, 0xD0E8F5, 0.6);
  g.lineBetween(cx - 10, 28, cx - 4, 40);
  g.lineBetween(cx - 5, 27, cx + 2, 38);
  g.lineBetween(cx + 2, 29, cx + 8, 42);
  // Dark top under jacket (V-neck)
  g.fillStyle(0x1a1a2e);
  g.fillTriangle(cx - 4, 26, cx + 4, 26, cx, 35);

  // ── Arms ──
  const lABot = leftFwd ? cx - 16 : cx - 7;
  const rABot = leftFwd ? cx + 6  : cx + 15;
  g.fillStyle(JACKET);
  g.fillPoints([{x:cx-12,y:26},{x:cx-5,y:26},{x:lABot+7,y:46},{x:lABot,y:46}], true);
  g.fillPoints([{x:cx+5, y:26},{x:cx+12,y:26},{x:rABot+7,y:46},{x:rABot,y:46}], true);
  g.fillStyle(SKIN);
  g.fillCircle(lABot + 3.5, 48, 4);
  g.fillCircle(rABot + 3.5, 48, 4);

  // Water bottle (offer / run frames)
  if (frame === 'offer' || frame === 'run0' || frame === 'run1') {
    const bx = cx + 18;
    const by = 34;
    g.fillStyle(0x88CCFF);
    g.fillRect(bx, by, 9, 16);
    g.fillStyle(0xFFFFFF);
    g.fillRect(bx + 1, by + 2, 7, 6);
    g.fillStyle(0x66AADD);
    g.fillRect(bx + 2, by - 3, 5, 4); // cap
  }

  // Thumbs-up (accepted)
  if (frame === 'accepted') {
    g.fillStyle(SKIN);
    g.fillRect(cx + 20, 28, 8, 12);
    g.fillRect(cx + 18, 24, 6, 8);
  }

  // Shrug (ignored) - arms out
  if (frame === 'ignored') {
    g.fillStyle(JACKET);
    g.fillRect(cx - 26, 32, 14, 8);
    g.fillRect(cx + 12, 32, 14, 8);
  }

  // ── Pants / Legs ──
  g.fillStyle(PANTS);
  const llBot = leftFwd ? cx - 14 : cx - 5;
  const rlBot = leftFwd ? cx + 4  : cx + 13;
  g.fillPoints([{x:cx-10,y:50},{x:cx-1,y:50},{x:llBot+9,y:82},{x:llBot,y:82}], true);
  g.fillPoints([{x:cx+1, y:50},{x:cx+10,y:50},{x:rlBot+9,y:82},{x:rlBot,y:82}], true);

  // ── Shoes ──
  g.fillStyle(SHOE);
  g.fillRect(llBot - 1, 82, 14, 6);
  g.fillRect(rlBot - 1, 82, 14, 6);
}

// ─── NALA ─────────────────────────────────────────────────────────────────────

function genNala(scene) {
  ['trot0','trot1','boost','streak'].forEach(f => {
    const w = f === 'streak' ? 90 : 72;
    tex(scene, `nala_${f}`, w, 52, (g) => drawNala(g, f, w));
  });
}

function drawNala(g, frame, w) {
  const BODY    = 0xD4A857;
  const BELLY   = 0xE8C980;
  const MUZZLE  = 0x6B4226;
  const EYE     = 0x3A1C08;
  const COLLAR  = 0xDDA0DD;
  const LEASH   = 0x8B5CF6;
  const BOOTIE  = 0xFF80AB;
  const TONGUE  = 0xFF6B8A;
  const DARK    = 0x2a2a2a;

  if (frame === 'streak') {
    // Motion blur effect
    for (let i = 0; i < 5; i++) {
      g.fillStyle(BODY, 0.3 - i * 0.04);
      g.fillEllipse(w - 40 - i * 10, 28, 60, 32);
    }
    g.fillStyle(BODY, 0.9);
    g.fillEllipse(w - 35, 28, 60, 34);
    g.fillStyle(BODY);
    g.fillCircle(w - 15, 20, 14);
    return;
  }

  const legAnim = frame === 'trot0' || frame === 'boost';
  const bx = 8; // body start x

  // ── Body ──
  g.fillStyle(BODY);
  g.fillEllipse(bx + 30, 28, 56, 30);

  // ── Belly ──
  g.fillStyle(BELLY);
  g.fillEllipse(bx + 28, 32, 40, 16);

  // ── Head ──
  g.fillStyle(BODY);
  g.fillCircle(bx + 57, 18, 14);

  // ── Muzzle ──
  g.fillStyle(MUZZLE);
  g.fillEllipse(bx + 62, 22, 14, 10);

  // ── Nose ──
  g.fillStyle(DARK);
  g.fillEllipse(bx + 66, 18, 6, 4);

  // ── Tongue ──
  g.fillStyle(TONGUE);
  g.fillEllipse(bx + 64, 28, 8, 10);

  // ── Eye ──
  g.fillStyle(EYE);
  g.fillCircle(bx + 55, 14, 4);
  g.fillStyle(0xFFFFFF);
  g.fillCircle(bx + 54, 13, 1.5);

  // ── Ears (floppy) ──
  g.fillStyle(BODY);
  g.fillEllipse(bx + 50, 9, 10, 18);  // left ear
  g.fillEllipse(bx + 60, 8, 9, 14);   // right ear (visible)

  // ── Collar ──
  g.fillStyle(COLLAR);
  g.fillRect(bx + 47, 18, 16, 5);

  // ── Legs (4 legs) ──
  g.fillStyle(BODY);
  // Front legs
  const frontLegY = legAnim ? 38 : 36;
  g.fillRect(bx + 46, frontLegY, 8, 10);
  g.fillRect(bx + 38, frontLegY + 2, 8, 8);
  // Back legs
  g.fillRect(bx + 12, frontLegY, 8, 10);
  g.fillRect(bx + 4, frontLegY + 2, 8, 8);

  // ── Pink booties on back paws ──
  g.fillStyle(BOOTIE);
  g.fillRect(bx + 3, frontLegY + 8, 10, 5);
  g.fillRect(bx + 11, frontLegY + 8, 10, 5);

  // ── Tail ──
  g.fillStyle(BODY);
  g.fillEllipse(bx + 2, 24, 8, 22);

  // ── Leash ──
  g.lineStyle(2.5, LEASH, 1);
  g.lineBetween(bx + 50, 21, bx - 5, 30);
}

// ─── JEFF ─────────────────────────────────────────────────────────────────────

function genJeff(scene) {
  ['run0','run1','offer','avoided'].forEach(f => {
    const w = f === 'offer' ? 72 : 56;
    tex(scene, `jeff_${f}`, w, 96, (g) => drawJeff(g, f, w));
  });
}

function drawJeff(g, frame, w) {
  const SKIN  = 0xFDBCB4;
  const HAIR  = 0x3D2B1F;
  const DENIM = 0x5B7EC9;
  const DENIM_DARK = 0x4A6DB8;
  const BAND  = 0xFF7F00;
  const BEER  = 0xF5B800;
  const DARK  = 0x1a1a1a;
  const cx = w / 2;
  const leftFwd = frame === 'run0';

  // ── Big goofy grin head ──
  g.fillStyle(SKIN);
  g.fillCircle(cx, 15, 15);

  // ── Short dark hair ──
  g.fillStyle(HAIR);
  g.fillEllipse(cx, 5, 28, 16);
  g.fillRect(cx - 14, 5, 28, 8);

  // ── Eyes (wide open enthusiastic) ──
  g.fillStyle(DARK);
  g.fillCircle(cx - 7, 12, 4);
  g.fillCircle(cx + 7, 12, 4);
  g.fillStyle(0xFFFFFF);
  g.fillCircle(cx - 6, 11, 2);
  g.fillCircle(cx + 8, 11, 2);

  // ── Big dopey grin ──
  g.fillStyle(DARK);
  g.fillRect(cx - 8, 20, 16, 4);
  g.fillStyle(0xFFFFFF);
  g.fillRect(cx - 7, 20, 14, 3);

  // ── Neck (skin, stocky) ──
  g.fillStyle(SKIN);
  g.fillRect(cx - 6, 29, 12, 6);

  // ── Chest/shoulders skin (no shirt) ──
  g.fillStyle(SKIN);
  g.fillRect(cx - 18, 35, 36, 18);

  // ── Overall straps ──
  g.fillStyle(DENIM);
  g.fillRect(cx - 14, 32, 8, 30);  // left strap
  g.fillRect(cx + 6, 32, 8, 30);   // right strap

  // ── Overall bib ──
  g.fillStyle(DENIM);
  g.fillRect(cx - 14, 53, 28, 28); // bib/torso
  g.fillStyle(DENIM_DARK);
  g.fillRect(cx - 10, 56, 20, 4);  // bib pocket

  // ── Orange wristband ──
  g.fillStyle(BAND);
  g.fillRect(cx + 20, 56, 8, 6);

  // ── Beer cup ──
  if (frame === 'offer') {
    const bx = cx + 24;
    g.fillStyle(BEER);
    g.fillRect(bx, 30, 12, 20);
    g.fillStyle(0xFFFFFF, 0.6);
    g.fillRect(bx + 1, 28, 10, 6);  // foam
    g.lineStyle(1, DARK, 0.5);
    g.strokeRect(bx, 30, 12, 20);
  } else {
    const bx = cx + 16;
    const by = 38;
    g.fillStyle(BEER);
    g.fillRect(bx, by, 10, 16);
    g.fillStyle(0xFFFFFF, 0.7);
    g.fillRect(bx + 1, by - 2, 8, 5);
  }

  // ── Arms ──
  g.fillStyle(SKIN);
  if (frame === 'offer') {
    // Arms wide open
    g.fillRect(cx - 32, 35, 18, 10);
    g.fillRect(cx + 14, 35, 18, 10);
    g.fillCircle(cx - 27, 45, 6);
    g.fillCircle(cx + 27, 45, 6);
  } else {
    const lABot = leftFwd ? cx - 20 : cx - 10;
    const rABot = leftFwd ? cx + 8  : cx + 18;
    g.fillPoints([{x:cx-14,y:35},{x:cx-6,y:35},{x:lABot+8,y:56},{x:lABot,y:56}], true);
    g.fillPoints([{x:cx+6, y:35},{x:cx+14,y:35},{x:rABot+8,y:56},{x:rABot,y:56}], true);
    g.fillCircle(lABot + 4, 58, 5);
    g.fillCircle(rABot + 4, 58, 5);
  }

  // ── Pants/legs (overalls) ──
  g.fillStyle(DENIM);
  const llBot = leftFwd ? cx - 18 : cx - 8;
  const rlBot = leftFwd ? cx + 8  : cx + 18;
  g.fillPoints([{x:cx-13,y:81},{x:cx-2, y:81},{x:llBot+11,y:93},{x:llBot,y:93}], true);
  g.fillPoints([{x:cx+2, y:81},{x:cx+13,y:81},{x:rlBot+11,y:93},{x:rlBot,y:93}], true);

  // Boots / shoes
  g.fillStyle(DARK);
  g.fillRect(llBot - 1, 93, 14, 3);
  g.fillRect(rlBot - 1, 93, 14, 3);
}

// ─── KARL ─────────────────────────────────────────────────────────────────────

function genKarl(scene) {
  ['jog0','jog1','offer','ditched'].forEach(f => {
    const w = f === 'offer' ? 66 : 50;
    tex(scene, `karl_${f}`, w, 88, (g) => drawKarl(g, f, w));
  });
}

function drawKarl(g, frame, w) {
  const SKIN   = 0xFDBCB4;
  const HAIR   = 0xB8965A;
  const SHIRT_R = 0xE8424B;
  const SHIRT_P = 0xF0789A;
  const SHORTS = 0x2a2a2a;
  const CHAIN  = 0xFFD700;
  const GLASS  = 0x64B5F6;
  const BAND_R = 0xE8424B;
  const BAND_B = 0x3B82F6;
  const BAND_Y = 0xF5B800;
  const BEER   = 0xF5B800;
  const DARK   = 0x1a1a1a;
  const cx = w / 2;
  const leftFwd = frame === 'jog0';

  // ── Head ──
  g.fillStyle(SKIN);
  g.fillCircle(cx, 14, 13);

  // ── Dirty blonde hair pulled back ──
  g.fillStyle(HAIR);
  g.fillEllipse(cx, 6, 24, 14);
  g.fillRect(cx - 12, 6, 24, 6);  // hair pulled back flat look

  // ── Tie-dye headband ──
  g.fillStyle(BAND_R); g.fillRect(cx - 13, 9, 8, 5);
  g.fillStyle(BAND_B); g.fillRect(cx - 5, 9, 8, 5);
  g.fillStyle(BAND_Y); g.fillRect(cx + 3, 9, 8, 5);
  // little edge on left
  g.fillStyle(BAND_R); g.fillRect(cx + 10, 10, 4, 4);

  // ── Blue mirrored aviator sunglasses ──
  g.fillStyle(GLASS);
  g.fillEllipse(cx - 6, 13, 11, 7);
  g.fillEllipse(cx + 6, 13, 11, 7);
  g.lineStyle(1.5, DARK, 1);
  g.lineBetween(cx - 1, 13, cx + 1, 13); // bridge
  g.lineBetween(cx - 12, 13, cx - 14, 15); // left stem
  g.lineBetween(cx + 12, 13, cx + 14, 15); // right stem

  // ── Scruff ──
  g.fillStyle(HAIR);
  g.fillRect(cx - 6, 21, 12, 2);

  // ── Neck ──
  g.fillStyle(SKIN);
  g.fillRect(cx - 4, 26, 8, 5);

  // ── Tie-dye shirt ──
  g.fillStyle(SHIRT_R);
  g.fillRect(cx - 11, 31, 22, 22);
  // Swirl blobs in pink
  g.fillStyle(SHIRT_P);
  g.fillCircle(cx - 4, 36, 6);
  g.fillCircle(cx + 5, 44, 5);
  g.fillCircle(cx - 2, 48, 4);

  // ── Gold chain ──
  g.lineStyle(2, CHAIN, 1);
  g.strokeCircle(cx, 35, 6);

  // ── Arms ──
  const lABot = leftFwd ? cx - 16 : cx - 7;
  const rABot = leftFwd ? cx + 6  : cx + 15;
  g.fillStyle(SHIRT_R);
  if (frame === 'offer') {
    // Right arm extended forward with beer
    g.fillRect(cx - 10, 31, 20, 8); // compact left arm
    g.fillPoints([{x:cx+5,y:31},{x:cx+11,y:31},{x:cx+32,y:48},{x:cx+26,y:48}], true); // extended right
    g.fillStyle(SKIN);
    g.fillCircle(cx + 33, 50, 4);
    // Beer
    g.fillStyle(BEER);
    g.fillRect(cx + 32, 38, 10, 16);
    g.fillStyle(0xFFFFFF, 0.7);
    g.fillRect(cx + 33, 36, 8, 5);
  } else {
    g.fillPoints([{x:cx-11,y:31},{x:cx-5,y:31},{x:lABot+6,y:48},{x:lABot,y:48}], true);
    g.fillPoints([{x:cx+5, y:31},{x:cx+11,y:31},{x:rABot+6,y:48},{x:rABot,y:48}], true);
    g.fillStyle(SKIN);
    g.fillCircle(lABot + 3, 50, 4);
    g.fillCircle(rABot + 3, 50, 4);
    // casual beer in right hand
    g.fillStyle(BEER);
    g.fillRect(rABot + 2, 44, 9, 13);
    g.fillStyle(0xFFFFFF, 0.6);
    g.fillRect(rABot + 3, 42, 7, 4);
  }

  // ── Shorts ──
  g.fillStyle(SHORTS);
  g.fillRect(cx - 12, 53, 24, 16);
  // pattern dots
  g.fillStyle(0x3a3a3a);
  g.fillCircle(cx - 5, 59, 2);
  g.fillCircle(cx + 5, 62, 2);

  // ── Legs ──
  g.fillStyle(SKIN);
  const llBot = leftFwd ? cx - 15 : cx - 5;
  const rlBot = leftFwd ? cx + 5  : cx + 15;
  g.fillPoints([{x:cx-11,y:69},{x:cx-2,y:69},{x:llBot+9,y:85},{x:llBot,y:85}], true);
  g.fillPoints([{x:cx+2, y:69},{x:cx+11,y:69},{x:rlBot+9,y:85},{x:rlBot,y:85}], true);

  // ── Shoes ──
  g.fillStyle(DARK);
  g.fillRect(llBot - 1, 85, 13, 3);
  g.fillRect(rlBot - 1, 85, 13, 3);

  // Watch
  g.fillStyle(0x888888);
  g.fillRect(cx - 18, 46, 6, 4);
}

// ─── BACKGROUND ───────────────────────────────────────────────────────────────

// Landscape layer heights (must match GameScene background positioning)
const FAR_H  = 170;
const NEAR_H = 155;
const LAMP_H = 170;
const GND_H  = H - 335; // 65

function genBackground(scene) {
  // Sky — full canvas static image
  tex(scene, 'bg_sky', W, H, (g) => {
    const colors = [0x0a0a18, 0x0e0e20, 0x121228, 0x14142e];
    const ch = H / colors.length;
    colors.forEach((c, i) => { g.fillStyle(c); g.fillRect(0, i * ch, W, ch + 2); });
    // Stars (more for wider canvas)
    const rand = mulberry32(42);
    g.fillStyle(0xFFFFFF);
    for (let i = 0; i < 90; i++) {
      const sx = rand() * W;
      const sy = rand() * (H * 0.75);
      const sr = rand() * 1.5 + 0.5;
      g.fillCircle(sx, sy, sr);
    }
    // Moon upper-right
    g.fillStyle(0xFFF4CC);
    g.fillCircle(W - 80, 38, 22);
    g.fillStyle(0x0e0e20);
    g.fillCircle(W - 68, 32, 18);
  });

  // Far buildings — landscape height
  tex(scene, 'bg_far', 1200, FAR_H, (g) => drawFarBuildings(g, FAR_H));

  // Near storefronts — landscape height
  tex(scene, 'bg_near', 1400, NEAR_H, (g) => drawNearBuildings(g, NEAR_H));

  // Ground / sidewalk — landscape height
  tex(scene, 'bg_ground', 400, GND_H, (g) => drawSidewalk(g, GND_H));

  // Street lamps — landscape height
  tex(scene, 'bg_lamps', 280, LAMP_H, (g) => drawStreetlamp(g, 100, LAMP_H));
}

function drawFarBuildings(g, TH) {
  const buildings = [
    { x:0,    w:180, h:Math.round(TH*0.72), c:0x3A2838 },
    { x:190,  w:220, h:Math.round(TH*0.91), c:0x282840 },
    { x:420,  w:150, h:Math.round(TH*0.60), c:0x38241E },
    { x:580,  w:200, h:Math.round(TH*0.82), c:0x2A3828 },
    { x:790,  w:180, h:Math.round(TH*0.65), c:0x3A3020 },
    { x:980,  w:160, h:Math.round(TH*0.88), c:0x283040 },
    { x:1150, w:60,  h:Math.round(TH*0.60), c:0x382028 },
  ];
  buildings.forEach(b => {
    g.fillStyle(b.c);
    g.fillRect(b.x, TH - b.h, b.w - 4, b.h);
    g.fillStyle(0xF5C842, 0.6);
    const rowStep = Math.max(14, Math.round(TH * 0.1));
    for (let wy = TH - b.h + 8; wy < TH - 12; wy += rowStep) {
      for (let wx = b.x + 10; wx < b.x + b.w - 16; wx += 22) {
        if (Math.sin(wx * 0.3 + wy * 0.7) > 0) {
          g.fillRect(wx, wy, 9, Math.max(8, rowStep - 4));
        }
      }
    }
  });
}

function drawNearBuildings(g, h) {
  drawStorefront(g, 0,    160, h, 0xC4856A, 0x2a6622, true);
  drawStorefront(g, 165,  200, h, 0x3A3A4A, 0xFF4466, false);
  drawStorefront(g, 370,  180, h, 0xE8D5A8, 0x2a6622, true);
  drawStorefront(g, 555,  220, h, 0x8B3A2A, 0xFFAA22, false);
  drawStorefront(g, 780,  190, h, 0x2A4A38, 0xFF4466, true);
  drawStorefront(g, 975,  175, h, 0x444454, 0x88CCFF, false);
  drawStorefront(g, 1155, 200, h, 0xD4AA7A, 0xFFAA22, true);
  g.fillStyle(0x3A2838);
  g.fillRect(1360, 0, 40, h);
}

function drawStorefront(g, x, w, h, facadeColor, awningColor, hasAwning) {
  const s  = h / 280;  // scale factor relative to original 280px height
  const bx = x;

  g.fillStyle(facadeColor);
  g.fillRect(bx, 0, w - 4, h);

  // Brick lines
  g.lineStyle(0.5, 0, 0.15);
  for (let ly = Math.round(12*s); ly < h - Math.round(20*s); ly += Math.round(10*s)) {
    g.lineBetween(bx, ly, bx + w - 4, ly);
  }

  // Upper-floor windows
  const winW = Math.min(36, (w - 40) / 2 - 4);
  const winH = Math.round(30*s);
  const gap  = (w - 4 - 2 * winW - 20) / 3;
  [Math.round(16*s), Math.round(56*s)].forEach(wy => {
    if (wy + winH > h * 0.65) return;
    g.fillStyle(0xF5D68A, 0.8);
    g.fillRect(bx + gap, wy, winW, winH);
    g.fillRect(bx + gap * 2 + winW, wy, winW, winH);
    g.lineStyle(1.5, 0x1a1a1a, 0.7);
    g.strokeRect(bx + gap, wy, winW, winH);
    g.strokeRect(bx + gap * 2 + winW, wy, winW, winH);
  });

  // Ground-floor storefront windows
  const gfY = Math.round(100*s);
  const gfH = Math.min(Math.round(90*s), h - gfY - Math.round(10*s));
  if (gfY < h - 10 && gfH > 10) {
    g.fillStyle(0xF5EDD0, 0.5);
    g.fillRect(bx + 8, gfY, w / 2 - 14, gfH);
    g.fillRect(bx + w / 2 + 2, gfY, w / 2 - 14, gfH);
    g.lineStyle(2, 0x2a2a2a, 0.8);
    g.strokeRect(bx + 8, gfY, w / 2 - 14, gfH);
    g.strokeRect(bx + w / 2 + 2, gfY, w / 2 - 14, gfH);
  }

  // Door (only if room)
  const doorY = Math.round(175*s);
  if (doorY < h - 6) {
    g.fillStyle(0x1a1a1a);
    g.fillRect(bx + w / 2 - 9, doorY, 18, h - doorY);
  }

  // Sign band
  const signY = Math.round(88*s);
  if (signY < h) {
    g.fillStyle(0x1a1a1a);
    g.fillRect(bx + 12, signY, w - 28, Math.round(12*s));
    g.fillStyle(awningColor);
    g.fillRect(bx + 14, signY + 2, w - 32, Math.round(8*s));
    // neon accent
    g.fillStyle(awningColor, 0.9);
    g.fillRect(bx + w / 2 - 20, signY - 5, 40, 5);
  }

  // Awning
  if (hasAwning) {
    const ay = Math.round(98*s);
    if (ay < h) {
      const aw = w - 20;
      const ax = bx + 10;
      let sc = false;
      for (let sx = ax; sx < ax + aw; sx += 12) {
        g.fillStyle(sc ? awningColor : 0xF8F8F8);
        g.fillRect(sx, ay, Math.min(12, ax + aw - sx), 9);
        sc = !sc;
      }
      g.lineStyle(1, 0x1a1a1a, 0.3);
      g.strokeRect(ax, ay, aw, 9);
    }
  }
}

function drawSidewalk(g, totalH) {
  const sidewalkH = Math.round(totalH * 0.38);
  // Brick sidewalk
  g.fillStyle(0xC8A87A);
  g.fillRect(0, 0, 400, sidewalkH);
  g.fillStyle(0xB89060);
  const rowH = Math.max(6, Math.round(sidewalkH / 4));
  for (let row = 0; row < Math.ceil(sidewalkH / rowH); row++) {
    const offset = (row % 2) * 40;
    for (let bx = -offset; bx < 440; bx += 80) {
      g.fillRect(bx + 1, row * rowH + 1, 78, rowH - 2);
    }
  }
  // Road
  g.fillStyle(0x2A2A36);
  g.fillRect(0, sidewalkH, 400, totalH - sidewalkH);
  // Road markings
  const markY = sidewalkH + Math.round((totalH - sidewalkH) * 0.55);
  g.fillStyle(0xFFFFAA, 0.7);
  [0, 100, 200, 300].forEach(mx => g.fillRect(mx, markY, 50, 5));
}

function drawStreetlamp(g, x, totalH) {
  const poleH = totalH - 24;
  g.fillStyle(0xFFAA44, 0.12);
  g.fillCircle(x, 22, 50);
  g.fillStyle(0xFFAA44, 0.18);
  g.fillCircle(x, 22, 30);
  // Lamp head
  g.fillStyle(0x3A3A4A);
  g.fillRect(x - 12, 14, 24, 12);
  g.fillStyle(0xFFCC66);
  g.fillRect(x - 8, 17, 16, 6);
  // Pole
  g.fillStyle(0x4A4A5A);
  g.fillRect(x - 3, 26, 6, poleH - 26);
  // Base
  g.fillStyle(0x3A3A4A);
  g.fillRect(x - 7, poleH - 4, 14, 8);
}

// ─── UI ───────────────────────────────────────────────────────────────────────

function genUI(scene) {
  // Beer meter fill bar
  tex(scene, 'beer_fill', 10, 20, (g) => {
    g.fillStyle(0xF5B800);
    g.fillRect(0, 0, 10, 20);
  });
  tex(scene, 'beer_empty', 10, 20, (g) => {
    g.fillStyle(0x3A3A4A);
    g.fillRect(0, 0, 10, 20);
  });

  // Lucky Joe's building (for start screen)
  tex(scene, 'luckyjoes', 390, 400, (g) => drawLuckyJoes(g));

  // Uncommon building (for end screen)
  tex(scene, 'uncommon', 390, 400, (g) => drawUncommon(g));
}

function drawLuckyJoes(g) {
  // Mauve brick facade
  g.fillStyle(0xB8785A);
  g.fillRect(30, 40, 330, 360);
  // Brick texture
  g.lineStyle(0.8, 0x8A5840, 0.5);
  for (let y = 50; y < 400; y += 12) g.lineBetween(30, y, 360, y);
  for (let y = 50; y < 400; y += 24) {
    for (let x = 30; x < 360; x += 60) g.lineBetween(x + 30, y, x + 30, y + 12);
  }

  // Dark wood trim bar
  g.fillStyle(0x2A1A0A);
  g.fillRect(30, 160, 330, 8);

  // Two large windows with dark green lettering
  g.fillStyle(0x0A1A0A, 0.8);
  g.fillRect(50, 90, 120, 100);
  g.fillRect(220, 90, 120, 100);
  g.lineStyle(3, 0x1a1a1a, 1);
  g.strokeRect(50, 90, 120, 100);
  g.strokeRect(220, 90, 120, 100);

  // Amber glow inside windows
  g.fillStyle(0xF5C842, 0.3);
  g.fillRect(52, 92, 116, 96);
  g.fillRect(222, 92, 116, 96);

  // Green-and-white striped awning
  const awningW = 300;
  const awningX = 45;
  const stripeW = 15;
  let sc = false;
  for (let sx = awningX; sx < awningX + awningW; sx += stripeW) {
    g.fillStyle(sc ? 0x2A6622 : 0xF8F8F0);
    g.fillRect(sx, 168, Math.min(stripeW, awningX + awningW - sx), 20);
    sc = !sc;
  }
  g.lineStyle(2, 0x1a1a1a, 0.4);
  g.strokeRect(awningX, 168, awningW, 20);

  // Sign text band
  g.fillStyle(0x1a3a18);
  g.fillRect(50, 60, 290, 28);
  g.fillStyle(0xF5C842);
  g.fillRect(55, 63, 280, 22);

  // Shamrock
  g.fillStyle(0x2A8832);
  g.fillCircle(310, 74, 6);
  g.fillCircle(317, 68, 6);
  g.fillCircle(304, 68, 6);
  g.fillRect(310, 74, 2, 8);

  // Patio
  g.fillStyle(0x1a1208, 0.5);
  g.fillRect(30, 290, 330, 110);
  // Tables
  [80, 200, 310].forEach(tx => {
    g.fillStyle(0x1a1a1a);
    g.fillRect(tx - 16, 310, 32, 3);
    g.fillRect(tx - 2, 313, 4, 25);
    // Green umbrella
    g.fillStyle(0x2A8832);
    g.fillTriangle(tx - 20, 300, tx + 20, 300, tx, 313);
  });

  // American flag (simple)
  g.fillStyle(0xCC2222);
  g.fillRect(330, 42, 30, 18);
  g.fillStyle(0xFFFFFF);
  for (let fy = 42; fy < 60; fy += 4) {
    g.fillRect(330, fy, 30, 2);
  }
  g.fillStyle(0x002288);
  g.fillRect(330, 42, 12, 10);

  // Door
  g.fillStyle(0x1a0A04);
  g.fillRect(165, 200, 60, 90);
  g.fillStyle(0xF5C842);
  g.fillCircle(218, 248, 3);
}

function drawUncommon(g) {
  // Modern 5-story building: charcoal panels, red brick, gray concrete
  // Main facade (charcoal)
  g.fillStyle(0x2A2A32);
  g.fillRect(20, 20, 350, 380);

  // Red/rust brick sections
  g.fillStyle(0x8B3A2A);
  g.fillRect(20, 20, 120, 200);
  g.fillRect(250, 120, 120, 280);

  // Light gray concrete accents
  g.fillStyle(0x8A8A94);
  g.fillRect(145, 20, 100, 380);

  // Large rectangular windows (black frames)
  const floors = [30, 100, 170, 240, 310];
  floors.forEach(fy => {
    [30, 160, 270].forEach(fx => {
      g.fillStyle(0x1A2A3A, 0.9);
      g.fillRect(fx, fy, 55, 55);
      g.lineStyle(2, 0x1a1a1a, 1);
      g.strokeRect(fx, fy, 55, 55);
      // slight light inside some windows
      if ((fx + fy) % 3 === 0) {
        g.fillStyle(0xF5D68A, 0.25);
        g.fillRect(fx + 2, fy + 2, 51, 51);
      }
    });
  });

  // Porte-cochère entrance
  g.fillStyle(0x222228);
  g.fillRect(120, 310, 150, 90);
  g.fillStyle(0x3A3A44);
  g.fillRect(122, 285, 146, 28); // roof cover

  // Warm pendant lighting
  g.fillStyle(0xFFBB44, 0.5);
  g.fillCircle(155, 300, 10);
  g.fillCircle(195, 300, 10);
  g.fillStyle(0xFFBB44, 0.2);
  g.fillCircle(155, 310, 20);
  g.fillCircle(195, 310, 20);

  // UNCOMMON sign
  g.fillStyle(0x1a1a1a);
  g.fillRect(128, 340, 134, 24);
  g.fillStyle(0xF0F0F0);
  g.fillRect(130, 342, 130, 20);

  // Bike rack
  g.lineStyle(3, 0x666666, 1);
  g.lineBetween(52, 360, 52, 390);
  g.lineBetween(68, 360, 68, 390);
  g.lineBetween(52, 370, 68, 370);
  // Bike
  g.fillStyle(0x3355AA);
  g.strokeCircle(46, 388, 8);
  g.strokeCircle(62, 388, 8);
  g.lineBetween(46, 388, 56, 378);
  g.lineBetween(56, 378, 62, 388);

  // Trees
  g.fillStyle(0x1A4A1A);
  g.fillCircle(360, 290, 25);
  g.fillCircle(375, 270, 20);
  g.fillStyle(0x3A3A30);
  g.fillRect(357, 315, 6, 50);
  g.fillRect(372, 290, 6, 75);
}

// ─── OBSTACLES ────────────────────────────────────────────────────────────────

function genObstacles(scene) {
  tex(scene, 'obstacle_police_car',   110, 55,  (g) => drawPoliceCar(g));
  tex(scene, 'obstacle_food_cart',     70, 72,  (g) => drawFoodCart(g));
  tex(scene, 'obstacle_dumpster',      85, 68,  (g) => drawDumpster(g));
  tex(scene, 'obstacle_scaffold',     120, 100, (g) => drawScaffold(g, 120, 100));
  tex(scene, 'obstacle_fire_escape',   90, 170, (g) => drawFireEscape(g, 90, 170));
}

function drawPoliceCar(g) {
  // Body
  g.fillStyle(0x2244AA);
  g.fillRect(6, 16, 98, 30);
  // Cabin roof
  g.fillStyle(0x1A3A99);
  g.fillRect(22, 4, 66, 16);
  // Windshield & rear window
  g.fillStyle(0xBBCCEE, 0.85);
  g.fillRect(26, 5, 26, 14);
  g.fillRect(60, 5, 26, 14);
  // Window frames
  g.lineStyle(1.5, 0x0A1A44, 0.9);
  g.strokeRect(26, 5, 26, 14);
  g.strokeRect(60, 5, 26, 14);
  // Light bar
  g.fillStyle(0x222233);
  g.fillRect(32, 1, 46, 5);
  g.fillStyle(0xFF3333);
  g.fillRect(34, 2, 20, 3);
  g.fillStyle(0x2266FF);
  g.fillRect(56, 2, 20, 3);
  // Door seam
  g.lineStyle(1.5, 0x0A1A44, 0.5);
  g.lineBetween(55, 16, 55, 46);
  // POLICE stripe
  g.fillStyle(0xFFFFFF, 0.9);
  g.fillRect(8, 26, 94, 7);
  g.fillStyle(0x002288);
  g.fillRect(8, 27, 94, 3);
  // Wheels
  g.fillStyle(0x111111);
  g.fillCircle(24, 50, 10);
  g.fillCircle(86, 50, 10);
  g.fillStyle(0x888888);
  g.fillCircle(24, 50, 5);
  g.fillCircle(86, 50, 5);
  // Door handle
  g.fillStyle(0xCCCC88);
  g.fillRect(38, 33, 8, 3);
  g.fillRect(70, 33, 8, 3);
}

function drawFoodCart(g) {
  // Cart body
  g.fillStyle(0xCC3311);
  g.fillRect(5, 14, 60, 48);
  // Awning
  g.fillStyle(0xEE4422);
  g.fillRect(0, 8, 70, 10);
  // Awning stripes
  g.fillStyle(0xFFFFFF, 0.5);
  for (let i = 0; i < 6; i++) {
    g.fillRect(i * 12, 8, 6, 10);
  }
  g.lineStyle(1, 0x881100, 0.5);
  g.strokeRect(0, 8, 70, 10);
  // Service window
  g.fillStyle(0xFFEECC, 0.75);
  g.fillRect(12, 20, 46, 28);
  g.lineStyle(2, 0x880000, 0.8);
  g.strokeRect(12, 20, 46, 28);
  // Window divider
  g.lineStyle(1.5, 0x880000, 0.5);
  g.lineBetween(35, 20, 35, 48);
  // Wheels
  g.fillStyle(0x333333);
  g.fillCircle(16, 66, 7);
  g.fillCircle(54, 66, 7);
  g.fillStyle(0x777777);
  g.fillCircle(16, 66, 3);
  g.fillCircle(54, 66, 3);
  // Axle
  g.lineStyle(3, 0x444444, 1);
  g.lineBetween(16, 66, 54, 66);
  // Handle
  g.lineStyle(4, 0x441100, 1);
  g.lineBetween(62, 20, 68, 20);
  g.lineBetween(62, 44, 68, 44);
  g.lineBetween(68, 20, 68, 44);
  // Menu sign on top
  g.fillStyle(0xFFDD88, 0.9);
  g.fillRect(18, 3, 34, 6);
  g.lineStyle(1, 0x881100, 0.6);
  g.strokeRect(18, 3, 34, 6);
}

function drawScaffold(g, w, h) {
  const plankH  = 18;
  const poleClr = 0x888899;
  const woodClr = 0xAA8844;
  const brace   = 0x666677;

  // Two vertical steel poles
  g.fillStyle(poleClr);
  g.fillRect(14, 0, 7, h - plankH);
  g.fillRect(w - 21, 0, 7, h - plankH);

  // Horizontal cross-braces
  g.fillStyle(brace);
  g.fillRect(14, Math.round(h * 0.3), w - 28, 4);
  g.fillRect(14, Math.round(h * 0.6), w - 28, 4);

  // Diagonal brace
  g.lineStyle(2.5, brace, 0.6);
  g.lineBetween(21, 0, w - 21, h * 0.6);

  // Wooden plank platform at top
  g.fillStyle(woodClr);
  g.fillRect(4, h - plankH, w - 8, plankH);
  // Wood grain lines
  g.lineStyle(1, 0x886633, 0.35);
  for (let pl = 10; pl < w - 8; pl += 18) {
    g.lineBetween(pl, h - plankH + 2, pl + 10, h - 3);
  }
  // Top edge highlight
  g.fillStyle(0xCCAA66, 0.9);
  g.fillRect(4, h - plankH, w - 8, 3);
  // Bottom shadow
  g.fillStyle(0x553311, 0.5);
  g.fillRect(4, h - 4, w - 8, 4);
}

function drawFireEscape(g, w, h) {
  const platH   = 20;
  const railClr = 0x556677;
  const dark    = 0x334455;
  const grate   = 0x667788;

  // Vertical ladder rails (centered)
  const lx = Math.round(w / 2) - 9;
  const rx = Math.round(w / 2) + 2;
  g.fillStyle(dark);
  g.fillRect(lx, 0, 5, h - platH);
  g.fillRect(rx, 0, 5, h - platH);

  // Ladder rungs
  g.fillStyle(railClr);
  for (let ry = 12; ry < h - platH; ry += 14) {
    g.fillRect(lx, ry, 16, 4);
  }

  // Platform base
  g.fillStyle(grate);
  g.fillRect(4, h - platH, w - 8, platH);
  // Grating slots
  g.fillStyle(dark, 0.45);
  for (let gx = 6; gx < w - 6; gx += 7) {
    g.fillRect(gx, h - platH + 4, 4, platH - 8);
  }
  // Platform top edge (the surface Jesse lands on)
  g.fillStyle(railClr);
  g.fillRect(4, h - platH, w - 8, 4);
  // Side railings
  g.fillStyle(dark);
  g.fillRect(4, h - platH, 4, platH);
  g.fillRect(w - 8, h - platH, 4, platH);
  // Support brackets
  g.fillStyle(dark);
  g.fillRect(6,  h - platH - 8, 8, 10);
  g.fillRect(w - 14, h - platH - 8, 8, 10);
}

function drawDumpster(g) {
  // Main body
  g.fillStyle(0x227733);
  g.fillRect(4, 12, 77, 48);
  // Lid (slightly lighter)
  g.fillStyle(0x1A6628);
  g.fillRect(4, 6, 77, 10);
  // Lid highlight edge
  g.lineStyle(2, 0x44AA55, 0.7);
  g.lineBetween(4, 6, 81, 6);
  // Vertical ribs
  g.fillStyle(0x1A5522);
  g.fillRect(26, 12, 5, 48);
  g.fillRect(54, 12, 5, 48);
  // Horizontal brace
  g.fillStyle(0x1A5522);
  g.fillRect(4, 36, 77, 4);
  // Wheels
  g.fillStyle(0x222222);
  g.fillRect(8,  58, 18, 10);
  g.fillRect(59, 58, 18, 10);
  g.fillStyle(0x555555);
  g.fillRect(10, 60, 14, 6);
  g.fillRect(61, 60, 14, 6);
  // Grab handle bar
  g.fillStyle(0x333333);
  g.fillRect(28, 4, 29, 4);
  // Graffiti (colorful splashes)
  g.fillStyle(0xFF44AA, 0.65);
  g.fillRect(10, 20, 10, 14);
  g.fillStyle(0xFFFF00, 0.55);
  g.fillRect(35, 25, 12, 10);
  g.fillStyle(0x44CCFF, 0.55);
  g.fillRect(60, 18, 9, 16);
  // Outline
  g.lineStyle(2, 0x0A2A10, 0.4);
  g.strokeRect(4, 12, 77, 48);
}

// ─── Seeded RNG (for consistent star placement) ──────────────────────────────

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
