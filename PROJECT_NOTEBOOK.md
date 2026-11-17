# 📓 Project Engineering Notebook: Cosmic Scale Studio 3D (`solar-scale-3d`)

- **GitHub Profile:** [@leroux-lab](https://github.com/leroux-lab)
- **Repository:** [https://github.com/leroux-lab/solar-scale-3d](https://github.com/leroux-lab/solar-scale-3d)
- **Live GitHub Pages App:** [https://leroux-lab.github.io/solar-scale-3d/](https://leroux-lab.github.io/solar-scale-3d/)

> **How to Use This Notebook Most Efficiently:**
> A great software engineering notebook is your **"External Brain"** and **Single Source of Truth**. Whenever you pause work or switch platforms (Web → Desktop → Mobile), you can read this document in 2 minutes and immediately know **how the math works**, **why the code is structured this way**, **which commands to run**, and **what step comes next**.

---

## 1. The 7 Essential Elements of a High-Efficiency Project Notebook

1. **Project North Star & Architecture Map:** How your code flows from a single codebase into Web, Desktop, and Mobile builds.
2. **Core Domain Math & Mental Models:** The exact formulas and coordinate rules so you never have to re-derive math in your head.
3. **File & Module Blueprint:** A map of every file and what it owns (separation of concerns).
4. **Architecture Decision Records (ADRs):** Brief notes on *why* you chose a specific approach (e.g., procedural textures vs. external `.jpg` files).
5. **Cross-Platform Roadmap & Living Checklist:** Track what is done (`[x]`) and what is next (`[ ]`) across Web, Desktop, and Mobile.
6. **Command & Workflow Cheat Sheet:** Copy-pasteable terminal commands for dev servers, packaging, and Git deployment.
7. **Debugging & Lessons Learned Log:** Solutions to tricky bugs so you never solve the same problem twice.

---

## 2. Core Domain Math & Scale Formulas

### A. Relative Diameter & Everyday Object Scale (Mode 1)
We use **Earth's diameter (12,742 km)** as our base unit (`earthRatio = 1.0`):
- `earthRatio = diameterKm / 12742`
- `metaphorSizeCm = earthRatio * referenceEarthCm` (Glass Marble = `1.5 cm`, Tennis Ball = `6.7 cm`, Basketball = `24.0 cm`)

### B. 3D Volume Packing Ratio (Mode 2: "How Many Fit Inside?")
Because sphere volume scales with the **cube of radius** (`V = 4/3 * pi * r^3`):
- `volumeRatio = (large.earthRatio / small.earthRatio) ** 3`

### C. The 100-Yard Cosmic Football Field (Mode 3)
Maps the distance from **The Sun (0 km)** to **Neptune (4,495 Million km)** onto `100 yards`:
- `footballYards = (distFromSunMillionKm / 4495.0) * 100`
- Pluto (`5,906.4 Million km`) sits at **131.4 yards** (31.4 yards past the endzone!).

---

## 3. Stage-by-Stage Build & Release Checklist

### Stage 1: Core 3D Web Application & GitHub Publishing
- [x] Responsive 3D canvas + HUD overlay (`index.html`, `src/style.css`)
- [x] Mode 1 (Everyday Object Scale), Mode 2 ("How Many Fit?" Comparator), Mode 3 (100-Yard Football Field)
- [x] Dwarf Planets (*Ceres*, *Pluto*), Exoplanets (*Kepler-22b*, *WASP-17b*), Hypergiant Stars (*Betelgeuse*, *UY Scuti*)
- [x] Published to GitHub & GitHub Pages

### Stage 2: Desktop Application (Electron) — *COMPLETED*
- [x] Install Node.js LTS & Electron dependencies
- [x] Create `electron/main.cjs` & `electron/preload.cjs`
- [x] Add Native Desktop Features (Save 3D Screenshot PNG to Disk & Export Scale Report JSON)
- [x] Build Windows `.exe` package (`dist/CosmicScaleStudio3D-win32-x64/CosmicScaleStudio3D.exe`) & distributable ZIP (`dist/CosmicScaleStudio3D-Windows-x64.zip`) via `scripts/package-win.cjs`

### Stage 3: Mobile Application (PWA & Capacitor) — *COMPLETED*
- [x] Generate `192x192`, `512x512`, and SVG mobile app icons in `icons/` and link in `manifest.json`
- [x] Add Service Worker (`sw.js`) & offline caching for iOS / Android Home Screen installation
- [x] Add mobile collapsible `🎛️ Controls` button (`#btn-toggle-panel`) & haptic feedback
- [x] Add Capacitor config (`capacitor.config.json`) and offline `www/` bundler (`scripts/prepare-mobile-www.cjs`)
