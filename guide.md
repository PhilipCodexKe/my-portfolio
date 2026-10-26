# Retro 1980s CRT TV UI Implementation Guide

A comprehensive, step-by-step roadmap for building an authentic, interactive 1970s/1980s retro television interface in React and CSS.

---

## Architecture Overview

The television interface is built using a 3-tier layering model inside a responsive wrapper:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. OUTER CHASSIS & BEZEL (Cabinet, Dials, Speaker, Antennas) │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 2. CRT GLASS OVERLAYS (Scanlines, Vignette, Glare)  │   │
│   │   ┌───────────────────────────────────────────────┐ │   │
│   │   │ 3. SCREEN CONTENT (Test Pattern, Videos, OSD) │ │   │
│   │   └───────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Preparation & Assets

### Step 1.1: Retro Typography
To get the authentic retro character look, import vintage monospaced and pixel fonts from Google Fonts or local font files:
- **`VT323`** – Terminal / Phosphor monitor text.
- **`Press Start 2P`** – 8-bit chunky pixel numbers/text.
- **`Share Tech Mono`** or **`VCR OSD Mono`** – Classic VCR on-screen display font (green timestamps, `PLAY ▶`, volume levels).

### Step 1.2: Essential Retro Sounds (Optional / Interactive)
- Mechanical switch/dial "clunk" sound.
- Faint 60Hz cathode tube hum or static hiss (low volume).
- High-voltage power-on snap.

---

## Phase 2: Outer Chassis & TV Bezel (Step-by-Step)

### Step 2.1: The Rabbit-Ear Antennas
- Create the metallic telescopic antennas atop the television cabinet.
- **CSS Techniques:** Pseudo-elements (`::before` / `::after`) with linear gradients for brushed aluminum, tilted at opposing angles (`transform: rotate(-22deg)` and `rotate(18deg)`), anchored by cylindrical ball-mount hinges.

### Step 2.2: The Main Cabinet (Chassis)
- Recreate the retro beige/cream plastic or dark molded cabinet.
- **CSS Techniques:**
  - `border-radius: 20px - 28px` for subtle vintage rounded corners.
  - Multi-stop linear gradients to simulate ambient ceiling lighting on top of the cabinet.
  - Deep drop shadows (`box-shadow: 0 30px 60px rgba(0,0,0,0.5)`) to ground the television into the page.

### Step 2.3: The Front Faceplate & Screen Cutout
- The front face is divided into two sections using CSS Grid or Flexbox:
  1. **Left (approx 72% width):** Deep recessed screen bezel holding the CRT tube.
  2. **Right (approx 28% width):** The control panel.
- **The Screen Cutout:**
  - Inset shadows (`box-shadow: inset 0 6px 12px rgba(0,0,0,0.8), inset 0 -4px 8px rgba(255,255,255,0.15)`) create physical plastic depth where the glass meets the bezel.
  - Rounded corners (`border-radius: 18px`) that mimic the shape of curved CRT glass.

### Step 2.4: The Control Panel (Knobs, Dials & Grille)
- **VHF & UHF Channel Dials:**
  - Round rotary knobs with metallic or chrome center grips.
  - Channel indicator tick-marks (2–13 for VHF, 14–83 for UHF).
  - Rotatable state in React on click or drag.
- **Fine-Tuning / Volume Knobs:**
  - Smaller knobs with ribbed grip textures using CSS repeating-conic gradients.
- **Power Button / Toggle Switch:**
  - Tactile rocker or push button to trigger power ON/OFF states.
- **Speaker Grille:**
  - Vertical or horizontal acoustic ventilation slots using CSS repeating linear gradients or flex pill elements.

---

## Phase 3: The CRT Glass Effects Layer

All screen overlay layers sit over the content with `pointer-events: none` to ensure videos and buttons underneath remain fully clickable.

### Step 3.1: Spherical Curvature & Corner Vignette
Old tubes are curved outward; light falls off at the corners.
- **CSS Technique:**
  ```css
  box-shadow: 
    inset 0 0 80px rgba(0, 0, 0, 0.85),
    inset 0 0 20px rgba(0, 0, 0, 0.95);
  ```

### Step 3.2: Horizontal Scanlines
Simulate the electron gun raster lines.
- **CSS Technique:**
  ```css
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0px,
    rgba(255, 255, 255, 0) 2px,
    rgba(0, 0, 0, 0.28) 2px,
    rgba(0, 0, 0, 0.28) 4px
  );
  ```

### Step 3.3: RGB Phosphor Sub-pixel Matrix (Aperture Grille)
Simulates the tiny red, green, and blue phosphor stripes on the glass surface.
- **CSS Technique:**
  - Repeating micro linear-gradient horizontally with 1px stripes of translucent red, green, and blue.

### Step 3.4: Ambient Glass Reflection / Glare
Curved glass catches room light.
- **CSS Technique:**
  - Diagonal specular gradient (`linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)`).

### Step 3.5: CRT Flicker & Jitter Animation
- Keyframe animation subtly altering brightness between `0.98` and `1.02` at high frequency (60Hz emulation) to give life to the screen.

---

## Phase 4: Screen Content & Display Modes

Now that the TV and screen glass look authentic, what lives inside the screen:

### Step 4.1: Mode 1 – The Philips PM5544 Test Pattern
- The iconic color bar & calibration circle pattern shown during station off-air / loading periods.
- Implemented via a clean SVG or vector asset that scales crisply inside the screen container.
- Includes editable station callsign text (e.g. your name or "PHILIP-TV").

### Step 4.2: Mode 2 – Static Snow (Tuning Noise)
- Displayed when switching between channels or when the TV is set to an empty channel.
- Generated via dynamic HTML5 2D canvas pixel noise or an optimized lightweight looping noise animation.

### Step 4.3: Mode 3 – Video Showcase (Your Portfolio Reels)
- Embedded HTML5 `<video>` elements or YouTube/Vimeo embeds.
- Videos automatically inherit the scanlines, glass curvature, and phosphor vignette from Phase 3.

### Step 4.4: Mode 4 – Retro OSD (On-Screen Display) Text
- Authentic green or cyan OSD overlay:
  - `CH 03`
  - `PLAY ▶ 0:02:45`
  - `TRACKING: AUTO`
- Styled with chromatic aberration (`text-shadow: -1.5px 0 red, 1.5px 0 cyan, 0 0 4px #00ff66;`).

---

## Phase 5: Interactive Behaviors & Animations

### Step 5.1: Power ON / Power OFF Collapse Animation
- **Turn On:** Screen expands from a single blinding horizontal line, then flashes to full display with slight overscan.
- **Turn Off:** Screen collapses vertically into a sharp white horizontal line, then into a single glowing dot in the center of the phosphor tube, then fades out.

### Step 5.2: Channel Switching State
- Clicking the channel knob:
  1. Plays a mechanical click.
  2. Blasts 0.2s of white static and frequency pop.
  3. Loads the next project/video with OSD channel indicator ("CH 04", "CH 05").

### Step 5.3: Responsiveness
- Ensure the TV scales down gracefully on tablets and mobile screens while maintaining aspect ratio (e.g., using `aspect-ratio: 4 / 3` for the screen and fluid container sizing).

---

## Execution Checklist

- [ ] **Step 1:** Download/import retro Google Fonts (`VT323`, `Press Start 2P`).
- [ ] **Step 2:** Construct the TV Cabinet component (Body, Bezel, Knobs, Antenna).
- [ ] **Step 3:** Apply CRT glass shader overlays (Scanlines, Vignette, Glare).
- [ ] **Step 4:** Integrate test pattern & static canvas.
- [ ] **Step 5:** Connect interactive channels to your video editing portfolio clips.
- [ ] **Step 6:** Polish CRT turn-on/off animations and tactile audio.
