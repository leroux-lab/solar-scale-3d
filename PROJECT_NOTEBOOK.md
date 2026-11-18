# 📓 Project Engineering Notebook & Handoff: Solar Scale 3D (`solar-scale-3d`)

- **GitHub Profile:** [@leroux-lab](https://github.com/leroux-lab)
- **GitHub Repository:** [https://github.com/leroux-lab/solar-scale-3d](https://github.com/leroux-lab/solar-scale-3d)
- **Live Web & Mobile PWA URL:** [https://leroux-lab.github.io/solar-scale-3d/](https://leroux-lab.github.io/solar-scale-3d/)
- **Project Workspace:** `C:\Users\NJler\.gemini\antigravity\scratch\solar-scale-3d`

---

## Executive Status Summary: All 3 Cross-Platform Apps Completed

### 1. 🌐 Web Application (`Three.js` + `GitHub Pages`) — ✅ LIVE
- **Live URL:** [https://leroux-lab.github.io/solar-scale-3d/](https://leroux-lab.github.io/solar-scale-3d/)
- **Core Files:** `index.html`, `src/style.css`, `src/planetsData.js`, `src/main.js`, `.nojekyll`
- **Features Shipped:**
  - **Mode 1 — Everyday Object Scale ("If Earth Were a..."):** True 1:1 relative diameter lineup of Dwarf Planets (*Ceres*, *Pluto*), Solar System Worlds (*Mercury* through *Neptune* + *The Moon*), Exoplanets (*Kepler-22b*, *WASP-17b*), and Hypergiant Stars (*The Sun*, *Betelgeuse*, *UY Scuti*) with *Glass Marble (1.5 cm)*, *Tennis Ball (6.7 cm)*, and *Basketball (24 cm)* metaphors + auto-switching *Stellar Titan Stage*.
  - **Mode 2 — "How Many Fit?" Comparator:** Side-by-side true-scale comparator with *Stack Across Equator* and *Pour Inside Volume* (3D translucent sphere packing).
  - **Mode 3 — Speed & 100-Yard Football Field Distance Simulator:** Maps `Sun -> Neptune` onto a 100-yard football field (with *Ceres* at `9.2 yds`, *Pluto* at `131.4 yds` in the Kuiper Belt, and translucent *Betelgeuse* `11.8 yd` & *UY Scuti* `26.4 yd` star engulfment domes) and simulates travel at *Highway Car (70 mph)*, *747 Jet (550 mph)*, *Apollo Rocket (25,000 mph)*, and *Light Speed*.

### 2. 💻 Windows Desktop Application (`Electron`) — ✅ BUILT & PACKAGED
- **Core Files:** `electron/main.cjs`, `electron/preload.cjs`, `scripts/package-win.cjs`, `Launch Desktop App.bat`
- **Outputs:**
  - **One-Click Local Launcher:** `Launch Desktop App.bat`
  - **Standalone Windows Executable:** `dist/SolarScale-win32-x64/SolarScale.exe`
  - **GitHub Release ZIP Archive:** `dist/SolarScale-Windows-x64.zip`
- **Features Shipped:**
  - Embedded localhost server in `electron/main.cjs` that automatically maps Three.js imports to local `/node_modules/three/` so the desktop app runs **100% offline**.
  - Custom native Windows menu bar (`Ctrl+S` Save 3D PNG, `Ctrl+E` Export Scale Report JSON, `Ctrl+1/2/3` switch modes, `F11` Fullscreen).
  - Secure IPC bridge (`electron/preload.cjs` exposing `window.desktopAPI`) connected to native Windows `dialog.showSaveDialog` file prompts.

### 3. 📱 Mobile Application (`PWA` & `Capacitor`) — ✅ LIVE & INSTALLABLE
- **Core Files:** `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon.svg`, `capacitor.config.json`, `scripts/prepare-mobile-www.cjs`
- **Features Shipped:**
  - **Offline Service Worker (`sw.js`, cache `solar-scale-3d-v4`):** Pre-caches app shell and caches Three.js modules for offline execution after installing to the iOS (**Safari -> Share -> Add to Home Screen**) or Android (**Chrome -> Install App**) Home Screen.
  - **Swipeable Pull-Down Control Sheet (`#panel-drag-handle`):** Touch drag-down/pull-up gesture and tap-to-minimize header (`▼ Pull Down to Hide` / `▲ Tap or Pull Up to Show`) so mobile users can slide the control panel down to a compact bottom peek bar.
  - **Portrait 3D Framing (`getMobilePortraitBoost()`):** Automatically steps the 3D camera back on vertical phone screens (`aspect < 1.0`) so planets and floating labels sit cleanly above the bottom control sheet.
  - **Capacitor Native Bundle (`www/`):** Built via `npm run mobile:prep` (`scripts/prepare-mobile-www.cjs`), bundling local offline Three.js inside `www/vendor/three/` for Android Studio (`.apk`) / Xcode (`.ipa`).

---

## 4. Core Domain Math & Scale Formulas

### A. Relative Diameter & Everyday Object Scale (Mode 1)
Using **Earth's diameter ($D_{\oplus} = 12,742\text{ km}$)** as our reference unit ($R_{\text{Earth}} = 1.0$):
$$\text{earthRatio} = \frac{D_{\text{body}}}{12,742\text{ km}}, \qquad d_{\text{metaphor}} = \text{earthRatio} \times d_{\text{ref}}$$
where $d_{\text{ref}} \in \{1.5\text{ cm (Marble)},\ 6.7\text{ cm (Tennis Ball)},\ 24.0\text{ cm (Basketball)}\}$.

### B. 3D Volume Packing Ratio (Mode 2: "How Many Fit Inside?")
$$N_{\text{fit}} = \frac{V_{\text{large}}}{V_{\text{small}}} = \left(\frac{R_{\text{large}}}{R_{\text{small}}}\right)^3$$

### C. The 100-Yard Cosmic Football Field (Mode 3)
$$\text{Yards} = \left(\frac{\text{Distance in Million km}}{4,495.0}\right) \times 100$$

---

## 5. Complete File & Module Map

| File | Platform Scope | Responsibility |
| :--- | :--- | :--- |
| `index.html` | Web, Desktop, Mobile | App shell, `<script type="importmap">`, PWA meta tags, 3 Mode Tabs, Pull-Down Inspector Sheet, Bottom Planet Dock |
| `src/style.css` | Web, Desktop, Mobile | Responsive glassmorphism HUD, pull-down sheet animations (`.inspector-panel.minimized`), mobile media queries |
| `src/planetsData.js` | Web, Desktop, Mobile | Scientific dataset for 16 worlds/stars + procedural HTML5 Canvas texture generator (`createPlanetTexture`) |
| `src/main.js` | Web, Desktop, Mobile | Three.js WebGL scene, 3 interactive modes, portrait camera boost, pull-down sheet touch drag handler, Electron IPC & web export handlers, Service Worker registration |
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
