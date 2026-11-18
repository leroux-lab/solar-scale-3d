# 🪐 Solar Scale 3D (`solar-scale-3d`)

🔗 **Live Web App:** [https://leroux-lab.github.io/solar-scale-3d/](https://leroux-lab.github.io/solar-scale-3d/)  
📦 **GitHub Repository:** [https://github.com/leroux-lab/solar-scale-3d](https://github.com/leroux-lab/solar-scale-3d)

An interactive **3D Solar System, Exoplanet & Hypergiant Star Scale Visualizer** built with **Three.js** and **Electron** that makes astronomical sizes and distances conceivable to the human mind.

## ✨ Three Interactive Perspective Modes
1. **Everyday Object Lineup ("If Earth Were a..."):**
   - Compare **Dwarf Planets** (*Ceres*, *Pluto*), **Solar System Planets** (*Mercury* through *Neptune* + *The Moon*), **Exoplanets** (*Kepler-22b*, *WASP-17b*), and **Stars** (*The Sun*, *Betelgeuse*, *UY Scuti*) at **true 1:1 relative diameter**.
   - Switch between human-scale metaphors: **If Earth were a Glass Marble (1.5 cm)**, a **Tennis Ball (6.7 cm)**, or a **Basketball (24 cm)**.
   - Includes the **Stellar Titan Stage**, showing how *Betelgeuse* (`763× Sun`) and *UY Scuti* (`1,706× Sun`) engulf the orbits of Earth, Mars, and Jupiter!
2. **Side-by-Side "Vs." Comparator & Volume Packer ("How Many Fit?"):**
   - Compare any two worlds or stars directly at true relative scale.
   - **📏 Stack Across Equator:** Line up miniature copies of the smaller body across the larger body's diameter.
   - **🫙 Pour Inside Volume:** Turn the larger world/star into translucent glass and pour miniature spheres inside to visualize volume ratios (e.g., *1,321 Earths inside Jupiter* or *446 Million Suns inside Betelgeuse*!).
3. **Speed & 100-Yard Football Field Distance Simulator (+ Kuiper Belt):**
   - Shrink the Solar System (`Sun` → `Neptune`) onto a **100-Yard Football Field** (with *Ceres* at `9.2 yds` and *Pluto* out at `131.4 yds` in the Kuiper Belt) and fly outward at relatable speeds (*Highway Car*, *747 Jet*, *Apollo Rocket*, or *Speed of Light*).

## 🚀 Run Locally
```bash
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.
