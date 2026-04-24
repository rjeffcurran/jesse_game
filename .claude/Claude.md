# 🍺 LUCKY JOE'S ESCAPE — Game Design Document

## Concept Overview

**Genre:** Side-scrolling Mario-style runner/platformer  
**Platform:** Mobile-first (portrait orientation, touch controls)  
**Goal:** Help Jesse navigate from **Lucky Joe's bar** in Fort Collins, CO back to **Uncommon Apartments** without drinking too much beer.

---

## 🗺️ Setting

- **Start:** Lucky Joe's Sidewalk Saloon — a classic Old Town Fort Collins bar. Mauve/dusty-rose painted brick facade with a dark wood trim. Two large storefront windows with dark green hand-painted lettering reading "LUCKY JOE'S" and "SIDEWALK SALOON ☘" in gold and green. Green-and-white striped retractable awnings over the windows. An American flag mounted to the right side of the building. Warm amber glow spilling from inside. Patio seating out front with black wrought-iron café tables and chairs. Tall green market umbrellas on the patio. The level begins here with Jesse exiting through the front door onto the sidewalk.

- **End:** Uncommon Apartments — a modern 5-story mixed-use apartment building. Exterior is a bold patchwork of dark charcoal panels, red/rust brick sections, and light gray concrete. Large rectangular windows with black frames. A covered porte-cochère entrance with warm pendant lighting and a prominent black sign reading **"UNCOMMON"** in clean sans-serif lettering. Bike racks out front with a few bikes locked up. Mature trees lining the sidewalk to the left. This is the finish line — Jesse's front door.

- **Environment:** Fort Collins Old Town streets at night — wide brick sidewalks, vintage-style streetlamps, low-rise historic storefronts, flat Colorado sky. The route passes through recognizable Old Town character: colorful painted building facades, neon bar signs, crosswalks, and tree-lined blocks transitioning from the lively bar district toward the more modern residential edge of downtown.

---

## 🎮 Core Mechanics

### Beer Meter
- Jesse has a **Beer Meter** (0–100%) displayed at the top of the screen
- Starts at a moderate level (~40%) since he's leaving the bar
- If it hits **100% → Jesse passes out** = GAME OVER
- Decreases when Jesse drinks water (Emma's item)
- Increases when Jeff or Karl catch him and hand him a beer

### Speed & Movement
- Jesse auto-runs to the right
- Player swipes/taps to **jump** over obstacles
- Player can **slide** under low obstacles
- **Speed boosts** available via Nala's leash event

---

## 👤 Characters

---

### 🦸 JESSE — Main Character (Player)

Tall, athletic build. Short sandy-blonde hair, clean cut. Big warm smile. Wearing a **white textured knit polo shirt**, **black slim pants**, and **white sneakers**.

**Sprite Details:**
- Hair: Short, light blonde/sandy, slightly swept
- Skin: Fair
- Shirt: White with a subtle diamond/waffle knit texture pattern
- Pants: Black, slim fit
- Shoes: White low-top sneakers
- Expression: Determined grin while running; woozy/eyes-half-closed when beer meter is high

**Animation States:**
- `run` — normal running stride
- `jump` — arms out, big grin
- `duck/slide` — crouching low
- `drunk_run` — zigzag wobble, slightly hunched
- `passed_out` — falls flat on face, little "Zzz" bubbles (Game Over)
- `boosted` — leaning forward, being pulled by Nala's leash, big smile

**Controls (Mobile):**
- Tap anywhere → Jump
- Swipe down → Slide
- Tap Nala when she appears → Grab leash for speed boost

---

### 👩 EMMA — Jesse's Wife (Helper)

Athletic build, dark long wavy/curly hair (brunette). Bright smile, warm olive complexion. Wearing an **acid-wash denim jacket** over a dark top, **black slim pants**. Visible **engagement/wedding ring** on left hand.

**Sprite Details:**
- Hair: Long, dark brown, wavy — flows behind her when running
- Skin: Warm olive tone
- Jacket: Light blue acid-wash denim, slightly oversized
- Top underneath: Dark (black or navy)
- Pants: Black slim fit
- Ring: Sparkle detail on left hand
- Expression: Caring, encouraging smile; slightly exasperated when Jesse ignores her

**Role:** Helpful NPC — appears periodically running alongside Jesse

**Behavior:**
- Appears every ~15–20 seconds, running parallel to Jesse
- Holds out a **water bottle** 
- Player must **tap Emma** to accept the water
- Accepting water: Beer Meter **-15%**, Jesse briefly flashes blue/hydrated
- If ignored: Emma shrugs and disappears after ~3 seconds
- Frequency: Moderate — appears often enough to be useful but requires attention

**Animation States:**
- `approach` — jogs in from background
- `offer` — holds water bottle out, smiling
- `accepted` — gives a thumbs up, waves goodbye
- `ignored` — shrugs, disappointed expression, exits

---

### 🐕 NALA — The Dog (Speed Boost Power-Up)

Medium-sized dog, **fawn/tan colored**, stocky muscular build (Boxer/Mastiff mix type). Wears a **light pink/lavender collar** with a **purple leash**. Soulful brown eyes, slightly wrinkled expressive face. Wears **pink booties on her back paws**.

**Sprite Details:**
- Coat: Short, smooth, warm fawn/tan — lighter on belly
- Build: Stocky, muscular, medium-large
- Face: Wrinkled brow, dark muzzle mask, soulful dark eyes
- Collar: Light pink/lavender with small studs or pattern
- Leash: Purple, trails behind her
- Special detail: **Pink booties on back paws** — bounces as she runs (fan favorite detail)
- Expression: Tongue out, ears perked, excited

**Role:** Rare power-up NPC — appears sparingly (every 35–45 seconds)

**Behavior:**
- Nala dashes across the screen fast — **harder to catch than Emma**
- Appears as a blur first, then slows to a "catchable" window of only ~2 seconds
- Player must **tap Nala** during her brief window
- If caught: Jesse grabs the leash — enters **BOOST MODE** for 5 seconds
  - Jesse is pulled forward at 2x speed
  - Jeff and Karl cannot keep up during boost
  - Visual: Jesse leaning forward, Nala pulling, leash taut, wind lines
- If missed: Nala disappears off screen with a little bark SFX
- Nala is worth waiting for — always appears before a dense obstacle/enemy cluster

**Animation States:**
- `streak` — fast blur dash across screen
- `trot` — brief catchable slow-trot window (tongue out)
- `boost_pull` — full sprint, leash taut, pulling Jesse
- `exit` — bounds off screen, tail wagging

---

## 🍺 ANTAGONISTS

---

### 😈 JEFF — Beer Pusher #1

Tall, broad-shouldered, athletic build with a big goofy grin — the guy who is always having the most fun in the room. Short dark brown hair, clean cut. Wearing **blue denim overalls with no shirt underneath** — just the straps over bare shoulders. Orange wristband on one wrist. Always holding a beer (cup or can). Tanned skin, cheerful open expression — he genuinely thinks he's being a great friend by bringing Jesse another drink.

**Sprite Details:**
- Hair: Short, dark brown, slightly wavy on top
- Skin: Tanned, warm tone
- Outfit: Blue denim overalls, no shirt, bib front with brass buttons
- Wristband: Orange on right wrist
- Item: Always holding a sloshing beer cup or tall can
- Expression: Big dopey enthusiastic grin — zero awareness that he's the villain

**Role:** Primary obstacle — runs at Jesse offering beers

**Behavior:**
- Appears from **in front of** Jesse (coming toward him)
- Holds out a beer with arms wide open like a greeting
- Jesse must **jump over** or **duck under** Jeff
- If contact is made: Beer Meter **+20%**
- Moves at medium speed — more of a lumbering charge than a sprint

**Animation States:**
- `run` — bounding toward Jesse, overalls flopping, beer held high
- `offer` — arms wide open, big grin, thrusting beer forward
- `caught` — gives Jesse a bear hug, sloshes beer everywhere
- `avoided` — stumbles past confused, shrugs and cracks another beer

---

### 😈 KARL — Beer Pusher #2

Tall, lean build with a relaxed festival-bro energy. Medium-length dirty blonde hair pulled back with a **tie-dye headband** (red, blue, yellow). Mirrored blue aviator sunglasses. Light scruff/stubble. Wearing a **red and pink tie-dye t-shirt**, **dark patterned shorts**, a **gold chain necklace**, and a **watch**. Tanned skin. Smug, too-cool-for-school expression — the guy who always has a beer ready and thinks he's doing you a favor by handing it to you.

**Sprite Details:**
- Hair: Medium length, dirty blonde, pulled back under headband
- Headband: Tie-dye — red, blue, yellow
- Sunglasses: Blue mirrored aviators
- Shirt: Red/pink tie-dye tee
- Shorts: Dark with subtle pattern
- Accessories: Gold chain necklace, watch on wrist
- Expression: Sly grin, overly confident — always holding a beer out like it's the obvious move

**Role:** Secondary obstacle — sneakier than Jeff

**Behavior:**
- Appears from **behind** Jesse, catching up
- Tries to hand Jesse a beer from behind
- Player must **speed up** (double-tap) or **Nala boost** to escape
- If caught: Beer Meter **+15%**
- Slightly faster than Jeff

**Animation States:**
- `jog` — casual loping run, one hand holding a beer out
- `offer` — extends beer toward Jesse with a knowing smirk
- `caught` — does a little celebratory fist pump when Jesse drinks
- `ditched` — slows down, shrugs coolly, falls off screen

---

## 🎯 Win / Lose Conditions

| Condition | Result |
|---|---|
| Jesse reaches Uncommon Apartments with Beer Meter < 100% | **WIN** 🏠🎉 |
| Beer Meter reaches 100% | **LOSE** 😴 Jesse passes out |
| Emma's water accepted 3+ times | Bonus ending: Emma waiting at the door with pizza |
| Nala caught 2+ times | Bonus: Nala is waiting at home too |

---

## 📱 Mobile UI Layout (Portrait)

```
┌─────────────────────────┐
│ 🍺 Beer Meter ████░░░░  │  ← top bar
│ 🏠 Distance: 0.4 mi     │
├─────────────────────────┤
│                         │
│   [GAME SCREEN]         │
│   Scrolling Fort Collins│
│   streetscape           │
│                         │
│   Jesse running ──►     │
│                         │
└─────────────────────────┘
  TAP = Jump | SWIPE ↓ = Duck
```

---

## 🎨 Visual Style

- **Art style:** Chunky pixel art or flat cartoon sprites (Mario-influenced)
- **Color palette:** Warm Fort Collins night — amber streetlights, dark navy sky, brick building tones (mauve, rust red, charcoal, warm cream)
- **Background layers:** Parallax scrolling Old Town Fort Collins streetscape — historic low-rise brick storefronts, vintage lamp posts, painted wooden signage, green awnings, neon bar signs, wide sidewalks. NO river or bridge elements. Pure Old Town character throughout.
- **UI font:** Bold, fun — slightly retro arcade feel
- **Music:** Upbeat chiptune with a Colorado/Western twang

---

## 📸 Character Reference Status

- ✅ Jesse, Emma, Nala — defined above
- ✅ **Karl** — defined above
- ✅ **Jeff** — defined above

---

*Document version 1.3 — All characters defined: Jesse, Emma, Nala, Jeff, Karl. Locations: Lucky Joe's & Uncommon Apartments. Game design complete — ready for development.*
