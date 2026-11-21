# 🪐 Solar Scale 3D (`solar-scale-3d`)

🔗 **Live Web & Mobile PWA:** [https://leroux-lab.github.io/solar-scale-3d/](https://leroux-lab.github.io/solar-scale-3d/)  
📦 **GitHub Repository:** [https://github.com/leroux-lab/solar-scale-3d](https://github.com/leroux-lab/solar-scale-3d)

An interactive **3D Solar System, Exoplanet & Hypergiant Star Scale Visualizer** built with **Three.js**, **Electron**, and **PWA/Capacitor** that makes astronomical sizes conceivable to the human mind.

## ✨ Two Interactive Perspective Modes
1. **True Scale Lineup & Planetary Facts:**
   - Compare **Dwarf Planets** (*Ceres*, *Pluto*), **Solar System Planets** (*Mercury* through *Neptune* + *The Moon*), **Exoplanets** (*Kepler-22b*, *WASP-17b*), and **Stars** (*The Sun*, *Betelgeuse*, *UY Scuti*) at **true 1:1 relative diameter**.
   - Explore curated **astronomical facts**, classification taglines, **Real Diameter**, **Relative to Earth**, **Surface Area**, and **Surface Gravity (`g`)** for every world.
   - Includes the **Stellar Titan Stage**, showing how *Betelgeuse* (`763× Sun`) and *UY Scuti* (`1,706× Sun`) engulf the orbits of Earth, Mars, and Jupiter.
2. **Size & Scale Comparison (World vs. World):**
   - Compare any two worlds or stars at true 1:1 relative diameter on a radial blueprint scale grid.
   - Switch between **↔️ Side** (with architectural diameter callout), **🎯 Overlay** (concentric reference ring), and **🫙 Volume** (translucent Fresnel-glass shell + GPU-instanced 3D hexagonal sphere packing with an interactive **Fill Level** slider).
   - Quick **Swap (`⇄`)**, preset chips, and visual comparison bars for **Diameter**, **Surface Area**, **Volume**, **Mass**, and **Surface Gravity (`g`)** with Earth weight equivalents.

## 🎨 Visual & Cross-Platform Features
- **High-Res Procedural PBR Assets:** `1024×512` paired Albedo, Bump, and Roughness maps, rotating Earth cloud layer, Fresnel atmospheric rim glow halos, radial UV-mapped Saturn rings with Cassini Division, multi-temperature starfield, and `ACESFilmicToneMapping`.
- **Focus / Cinematics Mode:** Press `H` or tap **👁️ Focus** to hide the HUD for unobstructed 3D viewing and clean PNG snapshots (`Ctrl+S`).
- **Interactive Quick-Start Tutorial:** Skippable 4-step walkthrough at session start (with live 3D mode previews, optional startup opt-out, and `?` replay button in the top bar).
- **Desktop & Mobile Ready:** Runs 100% offline as a packaged Windows Electron app (`SolarScale.exe`), an installable iOS/Android PWA (`sw.js`), or a Capacitor mobile bundle (`npm run mobile:prep`).

## 🚀 Run Locally
```bash
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.
