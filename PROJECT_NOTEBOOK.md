# 📓 Project Engineering Notebook & Handoff: Solar Scale 3D (`solar-scale-3d`)

- **GitHub Profile:** [@leroux-lab](https://github.com/leroux-lab)
- **GitHub Repository:** [https://github.com/leroux-lab/solar-scale-3d](https://github.com/leroux-lab/solar-scale-3d)
- **Live Web & Mobile PWA URL:** [https://leroux-lab.github.io/solar-scale-3d/](https://leroux-lab.github.io/solar-scale-3d/)
- **Project Workspace:** `C:\Users\NJler\.gemini\antigravity\scratch\solar-scale-3d`
- **Master Portfolio Tracker:** [`MASTER_PORTFOLIO_NOTEBOOK.md`](file:///C:/Users/NJler/.gemini/antigravity/scratch/MASTER_PORTFOLIO_NOTEBOOK.md)

---

## Executive Status Summary: All 3 Cross-Platform Apps Completed

### 1. 🌐 Web Application (`Three.js` + `GitHub Pages`) — ✅ LIVE
- **Live URL:** [https://leroux-lab.github.io/solar-scale-3d/](https://leroux-lab.github.io/solar-scale-3d/)
- **Core Files:** `index.html`, `src/style.css`, `src/planetsData.js`, `src/main.js`, `.nojekyll`
- **Features Shipped:**
  - **Mode 1 — Everyday Object Scale ("If Earth Were a..."):** True 1:1 relative diameter lineup of Dwarf Planets (*Ceres*, *Pluto*), Solar System Worlds (*Mercury* through *Neptune* + *The Moon*), Exoplanets (*Kepler-22b*, *WASP-17b*), and Hypergiant Stars (*The Sun*, *Betelgeuse*, *UY Scuti*) with segmented *Glass Marble (1.5 cm)*, *Tennis Ball (6.7 cm)*, and *Basketball (24 cm)* metaphors, auto-switching *Stellar Titan Stage*, and an optional 3D **Everyday Scale Ruler** on the floor grid.
  - **Mode 2 — Size & Scale Comparison (World vs. World):** True 1:1 *Side*, *Concentric Overlay*, and *Volume Fit* (translucent Fresnel-glass shell + GPU-instanced `THREE.InstancedMesh` 3D hexagonal lattice packing + interactive **Fill Level** slider + 74% Kepler sphere-packing readout) with quick Swap (`⇄`), preset chips, architectural diameter callouts, and visual comparison bars for *Diameter*, *Surface Area*, *Volume*, *Mass*, and *Surface Gravity* (`g`).
  - **High-Res Procedural PBR Assets, Focus Mode & Quick-Start Tutorial:** `1024×512` paired Albedo/Bump/Roughness maps, rotating Earth cloud sphere, Fresnel atmospheric rim glow halos, radial UV-mapped Saturn rings with Cassini Division, multi-temperature starfield, `ACESFilmicToneMapping`, `H` / **Focus Mode** HUD toggle, and a skippable 4-step **Quick-Start Tutorial** at session start (replayable via `?`).
  - *(Note: Mode 3 Speed & 100-Yard Football Field was shelved from the active UI in the v2 redesign to keep the experience focused.)*

### 2. 💻 Windows Desktop Application (`Electron`) — ✅ BUILT & PACKAGED
- **Core Files:** `electron/main.cjs`, `electron/preload.cjs`, `scripts/package-win.cjs`, `Launch Desktop App.bat`
- **Outputs:**
  - **One-Click Local Launcher:** `Launch Desktop App.bat`
  - **Standalone Windows Executable:** `dist/SolarScale-win32-x64/SolarScale.exe`
  - **GitHub Release ZIP Archive:** `dist/SolarScale-Windows-x64.zip`
- **Features Shipped:**
  - Embedded localhost server in `electron/main.cjs` that automatically maps Three.js imports to local `/node_modules/three/` so the desktop app runs **100% offline**.
  - Custom native Windows menu bar (`Ctrl+S` Save 3D PNG, `Ctrl+E` Export Scale Report JSON, `Ctrl+1/2` switch modes, `F11` Fullscreen).
  - Secure IPC bridge (`electron/preload.cjs` exposing `window.desktopAPI`) connected to native Windows `dialog.showSaveDialog` file prompts.

### 3. 📱 Mobile Application (`PWA` & `Capacitor`) — ✅ LIVE & INSTALLABLE
- **Core Files:** `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon.svg`, `capacitor.config.json`, `scripts/prepare-mobile-www.cjs`
- **Features Shipped:**
  - **Offline Service Worker (`sw.js`, cache `solar-scale-3d-v8`):** Pre-caches app shell and caches Three.js modules for offline execution after installing to the iOS (**Safari -> Share -> Add to Home Screen**) or Android (**Chrome -> Install App**) Home Screen.
  - **Swipeable Pull-Down Control Sheet (`#panel-drag-handle`):** Touch drag-down/pull-up gesture and tap-to-minimize header (`▼ Pull Down to Hide` / `▲ Tap or Pull Up to Show`) so mobile users can slide the control panel down to a compact bottom peek bar.
  - **Portrait 3D Framing (`getMobilePortraitBoost()`):** Automatically steps the 3D camera back on vertical phone screens (`aspect < 1.0`) so planets and floating labels sit cleanly above the bottom control sheet.
  - **Capacitor Native Bundle (`www/`):** Built via `npm run mobile:prep` (`scripts/prepare-mobile-www.cjs`), bundling local offline Three.js inside `www/vendor/three/` for Android Studio (`.apk`) / Xcode (`.ipa`).

---

## 4. Core Domain Math & Scale Formulas

### A. Relative Diameter & Everyday Object Scale (Mode 1)
Using **Earth's diameter ($D_{\oplus} = 12,742\text{ km}$)** as our reference unit ($R_{\text{Earth}} = 1.0$):
$$\text{earthRatio} = \frac{D_{\text{body}}}{12,742\text{ km}}, \qquad d_{\text{metaphor}} = \text{earthRatio} \times d_{\text{ref}}$$
where $d_{\text{ref}} \in \{1.5\text{ cm (Marble)},\ 6.7\text{ cm (Tennis Ball)},\ 24.0\text{ cm (Basketball)}\}$.

### B. Size & Scale Comparison Ratios (Mode 2: World vs. World)
$$\text{Diameter Ratio} = \frac{D_{\text{large}}}{D_{\text{small}}}, \qquad \text{Surface Area Ratio} = \left(\frac{D_{\text{large}}}{D_{\text{small}}}\right)^2, \qquad W_{\text{world}} = 150\text{ lbs} \times g_{\text{world}}$$

---

## 5. Complete File & Module Map

| File | Platform Scope | Responsibility |
| :--- | :--- | :--- |
| `index.html` | Web, Desktop, Mobile | App shell, `<script type="importmap">`, PWA meta tags (`black` status bar), 2 Mode Tabs, Focus Mode toggle, Segmented Controls, Pull-Down Inspector Sheet, Bottom Planet Dock |
| `src/style.css` | Web, Desktop, Mobile | Hybrid modern glassmorphism HUD, segmented pills, comparison bars, Focus Mode, pull-down sheet animations, iOS/iPadOS safe-area insets |
| `src/planetsData.js` | Web, Desktop, Mobile | Scientific dataset for 16 worlds/stars (`diameterKm`, `massEarths`, `gravityG`, `atmosphereColor`) + `1024×512` procedural PBR texture generator (`createPlanetMaps`, `createSaturnRingTexture`) |
| `src/main.js` | Web, Desktop, Mobile | Three.js WebGL scene (`ACESFilmicToneMapping`, Fresnel atmospheric halos, rotating Earth clouds, radial scale grid), 2 interactive modes, Everyday Scale Ruler, Focus Mode (`H`), portrait camera boost, pull-down sheet drag handler, Electron IPC & export handlers, Service Worker registration |
| `electron/main.cjs` | Desktop (Electron) | Main process: embedded offline server, `BrowserWindow`, native menus, `ipcMain` Save dialogs |
| `electron/preload.cjs` | Desktop (Electron) | Secure `contextBridge` exposing `window.desktopAPI` to renderer |
| `Launch Desktop App.bat` | Desktop (Windows) | One-click desktop launcher (`cd /d "%~dp0"` + clears `ELECTRON_RUN_AS_NODE` + starts `electron.exe .`) |
| `scripts/package-win.cjs` | Desktop Build | Packages standalone `dist/SolarScale-win32-x64/SolarScale.exe` and `dist/SolarScale-Windows-x64.zip` |
| `manifest.json` & `sw.js` | Mobile (PWA) | Standalone home-screen manifest and offline Service Worker cache |
| `icon-192.png`, `icon-512.png`, `icon.svg` | Mobile (PWA) | Custom cosmic planet icons for iOS and Android home screens |
| `capacitor.config.json` & `scripts/prepare-mobile-www.cjs` | Mobile (Capacitor) | Native mobile config and offline `www/` bundler (`npm run mobile:prep`) |
| `solar_scale_lab.ipynb` | Data & Math Lab | Interactive Python Jupyter Notebook for testing planet math and custom everyday object scales |

---

## 6. Command Cheat Sheet

```powershell
# 1. Run Local Web Server (Python)
python -m http.server 8080

# 2. Launch Electron Desktop Window
npm start
# (or double-click "Launch Desktop App.bat")

# 3. Package Standalone Windows Desktop Executable (.exe) & Release ZIP
npm run dist

# 4. Prepare Offline Mobile Bundle (www/) for Capacitor
npm run mobile:prep
```

---

## 7. Architecture Decisions & Debugging Log

- **ADR-01 (Zero-Build Web + Offline Desktop):** `index.html` uses `<script type="importmap">` with CDN URLs so GitHub Pages works without a build step, while `electron/main.cjs` and `scripts/prepare-mobile-www.cjs` rewrite the importmap to local `three` modules so Desktop and Mobile builds work 100% offline.
- **ADR-02 (Procedural Canvas Textures):** All 16 planet/star textures are drawn procedurally via HTML5 `<canvas>` in `src/planetsData.js`, preventing broken external image links or CORS issues.
- **ADR-03 (Two-Tier Camera Normalization):** Separates Mode 1 into *Planetary Stage* ($1\text{ unit} = 1\text{ Earth radius}$) and *Stellar Titan Stage* ($0.05\text{ units} = 1\text{ Sun radius}$) to prevent WebGL floating-point clipping on hypergiant stars (*Betelgeuse* & *UY Scuti*).
- **Lesson 01 (Windows `.bat` Trailing Backslash Quote Escape):** In Windows `.bat` files, `%~dp0` ends with `\`, so `"%~dp0"` produces `\"` which escapes the closing quote in `electron.exe`. Always `cd /d "%~dp0"` first and pass `.` as the directory argument.
- **Lesson 02 (`ELECTRON_RUN_AS_NODE` in Electron IDEs):** Clear `set ELECTRON_RUN_AS_NODE=` before launching `electron.exe` from child terminals.
- **Lesson 03 (Mobile Gesture & Service Worker Timing):** Guard `navigator.vibrate(12)` behind a `userHasInteracted` flag set on `pointerdown`, and check `if (document.readyState === 'complete')` when registering `sw.js` inside deferred ES modules.
- **ADR-04 (v2 Redesign — Focused 2-Mode Studio + Procedural PBR):** Shelved Mode 3 (Football Field & Speed) and replaced "How Many Fit?" with **Size & Scale Comparison** (*Side-by-Side* & *Concentric Overlay* with Diameter, Surface Area, Mass, and Surface Gravity bars). Upgraded `src/planetsData.js` to deterministic `1024×512` paired Albedo/Bump/Roughness maps + Earth cloud layer + Fresnel atmospheric rim halos so all 3 platforms remain 100% offline-capable.
- **Lesson 04 (iOS/iPadOS Standalone PWA Top Blur & Safe Areas):** Use `<meta name="apple-mobile-web-app-status-bar-style" content="black" />` instead of `black-translucent` so iOS does not draw a blurred status-bar scrim over `.top-bar`, and apply `env(safe-area-inset-top/bottom/left/right)` plus `-webkit-backdrop-filter` to `.top-bar`, `.inspector-panel`, and `.planet-dock`.
- **Lesson 05 (Mobile Portrait Responsive Header & Unobstructed 3D Framing):** On narrow portrait screens (`≤ 820px` / `≤ 480px`), hide `.brand .subtitle`, keep `<h1>` single-line (`white-space: nowrap`), start the bottom control sheet minimized by default, and use a positive `yLookOffset` so floating 3D planet badges sit cleanly below `.mode-tabs`.
