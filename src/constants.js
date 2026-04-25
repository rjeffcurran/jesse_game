export const W = 760;
export const H = 400;
export const GROUND_Y = 335;
export const JESSE_X = 140;
export const LEVEL_PIXELS = 18000;

export const GRAVITY = 1500;
export const JUMP_VEL = -700;

export const BOOST_MULT = 2.1;
export const BOOST_DURATION = 5000; // ms
export const NALA_CATCH_WINDOW = 2200; // ms

// Per-difficulty tuning: { beerStart, beerJeff, beerKarl, beerEmma,
//   baseScroll, maxScroll, jeffExtraSpeed,
//   jeffIntervalStart, jeffIntervalEnd,   ← ms (start of level → end)
//   karlIntervalStart, karlIntervalEnd,
//   emmaIntervalMin, emmaIntervalMax,
//   obstacleIntervalMin, obstacleIntervalMax }
export const DIFFICULTY = {
  easy: {
    beerStart: 25,
    beerJeff: 14, beerKarl: 10, beerEmma: 20,
    baseScroll: 180, maxScroll: 300,
    jeffExtraSpeed: 220,
    jeffIntervalStart: 9000,  jeffIntervalEnd: 4500,
    karlIntervalStart: 28000, karlIntervalEnd: 16000,
    emmaIntervalMin: 10000, emmaIntervalMax: 15000,
    obstacleIntervalMin: 4000, obstacleIntervalMax: 7000,
  },
  medium: {
    beerStart: 40,
    beerJeff: 20, beerKarl: 15, beerEmma: 15,
    baseScroll: 210, maxScroll: 390,
    jeffExtraSpeed: 280,
    jeffIntervalStart: 7000,  jeffIntervalEnd: 2800,
    karlIntervalStart: 22000, karlIntervalEnd: 10000,
    emmaIntervalMin: 14000, emmaIntervalMax: 20000,
    obstacleIntervalMin: 3000, obstacleIntervalMax: 6000,
  },
  hard: {
    beerStart: 55,
    beerJeff: 26, beerKarl: 20, beerEmma: 12,
    baseScroll: 250, maxScroll: 480,
    jeffExtraSpeed: 350,
    jeffIntervalStart: 5000,  jeffIntervalEnd: 1800,
    karlIntervalStart: 16000, karlIntervalEnd: 7000,
    emmaIntervalMin: 20000, emmaIntervalMax: 30000,
    obstacleIntervalMin: 2000, obstacleIntervalMax: 4500,
  },
};
