import * as THREE from 'three';

/**
 * Celestial bodies: Solar System Planets, Dwarf Planets (Ceres, Pluto),
 * Exoplanets (Kepler-22b, WASP-17b), and Hypergiant Stars (Betelgeuse, UY Scuti).
 * Base 3D unit: 1.0 = Earth radius (Diameter = 12,742 km)
 */
export const BODIES = [
  {
    id: 'ceres',
    name: 'Ceres (Dwarf)',
    category: 'dwarf',
    color: '#a1a1aa',
    diameterKm: 939,
    earthRatio: 0.074,
    volumeEarths: 0.0004,
    massEarths: 0.00016,
    gravityG: 0.029,
    distFromSunMillionKm: 413.7,
    lightTime: '23.0 mins',
    tagline: '🪨 Asteroid Belt Dwarf Planet',
    desc: 'The largest object in the Asteroid Belt between Mars and Jupiter, accounting for nearly a third of the belt’s total mass.',
    facts: [
      '✨ Bright mysterious spots inside Occator Crater are domes of sodium carbonate salts left by cryo-volcanic brine.',
      '💧 Contains more fresh water (locked in a subsurface ice mantle) than all the fresh water on Earth.',
      '⚖️ Over 2,400 Ceres spheres would fit inside the volume of a single Earth.',
    ],
  },
  {
    id: 'pluto',
    name: 'Pluto (Dwarf)',
    category: 'dwarf',
    color: '#fca5a5',
    atmosphereColor: '#93c5fd',
    diameterKm: 2376,
    earthRatio: 0.186,
    volumeEarths: 0.0064,
    massEarths: 0.0022,
    gravityG: 0.063,
    distFromSunMillionKm: 5906.4,
    lightTime: '5 hrs 28 mins',
    tagline: '❄️ Kuiper Belt Ice Dwarf',
    desc: 'Famous for its heart-shaped nitrogen glacier (Tombaugh Regio). Pluto is narrower than the United States and smaller than Earth’s Moon.',
    facts: [
      '🏔️ Floating mountain ranges made of solid water-ice rise 3,500 meters above frozen nitrogen plains.',
      '🔄 Locks in a binary dance with its giant moon Charon—both always show the same face to each other.',
      '⏳ One Plutonian year takes 248 Earth years; it hasn’t completed a full orbit since its discovery in 1930.',
    ],
  },
  {
    id: 'moon',
    name: 'The Moon',
    category: 'solar',
    color: '#cbd5e1',
    diameterKm: 3474,
    earthRatio: 0.273,
    volumeEarths: 0.02,
    massEarths: 0.0123,
    gravityG: 0.165,
    distFromSunMillionKm: 149.9,
    lightTime: '1.3 sec from Earth',
    tagline: '🌕 Earth’s Natural Satellite',
    desc: 'Roughly 1/4 the width of Earth. It takes 50 Moons to match Earth’s volume—yet its gravity drives our ocean tides and stabilizes Earth’s tilt.',
    facts: [
      '🪐 Every planet in the Solar System could fit end-to-end inside the 384,400 km average gap between Earth and the Moon.',
      '👣 With no wind or liquid water erosion, Apollo astronaut footprints can last for millions of years.',
      '📏 Drifts away from Earth by about 3.8 cm per year due to tidal momentum transfer.',
    ],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    category: 'solar',
    color: '#94a3b8',
    diameterKm: 4879,
    earthRatio: 0.383,
    volumeEarths: 0.056,
    massEarths: 0.055,
    gravityG: 0.38,
    distFromSunMillionKm: 57.9,
    lightTime: '3.2 mins',
    tagline: '☄️ Iron-Core Inner World',
    desc: 'The smallest major planet—only slightly larger than Earth’s Moon, but packed with an enormous metallic core that gives it Mars-like gravity (0.38g).',
    facts: [
      '🌡️ Experiences the most extreme temperature swings in the Solar System: 430°C (800°F) by day to -180°C (-290°F) at night.',
      '🧲 Its metallic core makes up ~85% of the planet’s radius, generating a global magnetic field.',
      '☀️ One solar day on Mercury (sunrise to sunrise) lasts 176 Earth days—twice as long as its 88-day year!',
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    category: 'solar',
    color: '#ef4444',
    atmosphereColor: '#fb923c',
    diameterKm: 6779,
    earthRatio: 0.532,
    volumeEarths: 0.151,
    massEarths: 0.107,
    gravityG: 0.38,
    distFromSunMillionKm: 227.9,
    lightTime: '12.7 mins',
    tagline: '🔴 The Red Terrestrial Planet',
    desc: 'Barely half Earth’s width and only 15% of Earth’s volume, yet home to the tallest volcano and longest canyon in the Solar System.',
    facts: [
      '🌋 Olympus Mons towers 21.9 km high—nearly three times the elevation of Mount Everest.',
      '🏜️ Valles Marineris stretches over 4,000 km long and 7 km deep—wide enough to span the entire United States.',
      '🌅 Iron-oxide dust suspended in its thin CO₂ atmosphere makes Martian skies butterscotch by day and blue at sunset.',
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    category: 'solar',
    color: '#eab308',
    atmosphereColor: '#fde047',
    diameterKm: 12104,
    earthRatio: 0.95,
    volumeEarths: 0.857,
    massEarths: 0.815,
    gravityG: 0.9,
    distFromSunMillionKm: 108.2,
    lightTime: '6.0 mins',
    tagline: '💛 Super-Greenhouse Terrestrial Twin',
    desc: 'Often called Earth’s twin because its diameter is 95% identical to Earth, though wrapped in a crushing sulfuric acid cloud deck.',
    facts: [
      '🔥 Hottest planetary surface in the Solar System at 475°C (900°F)—hot enough to melt lead, even hotter than Mercury.',
      '🔄 Rotates backwards (retrograde) so slowly that a sidereal day on Venus (243 Earth days) is longer than its year (225 days).',
      '🎈 Surface atmospheric pressure is 92× Earth’s—equivalent to being 900 meters underwater.',
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    category: 'solar',
    color: '#38bdf8',
    atmosphereColor: '#38bdf8',
    diameterKm: 12742,
    earthRatio: 1.0,
    volumeEarths: 1.0,
    massEarths: 1.0,
    gravityG: 1.0,
    distFromSunMillionKm: 149.6,
    lightTime: '8.3 mins',
    tagline: '🌍 Reference Ocean & Biosphere World',
    desc: 'Our home reference point (1.00×). Liquid oceans cover 71% of its surface under a dynamic nitrogen-oxygen atmosphere.',
    facts: [
      '🧲 A churning liquid-iron outer core generates the magnetosphere that shields surface life from solar wind radiation.',
      '🪨 The densest planet in the Solar System (5.51 g/cm³) and the only world known to have active plate tectonics.',
      '🌊 Although oceans reach 11 km deep, all of Earth’s water rolled into a sphere would only be 1,385 km wide.',
    ],
  },
  {
    id: 'kepler22b',
    name: 'Kepler-22b (Exo)',
    category: 'exoplanet',
    color: '#14b8a6',
    atmosphereColor: '#2dd4bf',
    diameterKm: 26758,
    earthRatio: 2.1,
    volumeEarths: 9.26,
    massEarths: 9.1,
    gravityG: 2.06,
    distFromSunMillionKm: null,
    lightTime: '635 Light-Years away',
    tagline: '🌊 Habitable-Zone Super-Earth Exoplanet',
    desc: 'A famous "Super-Earth" / "Sub-Neptune" exoplanet orbiting in the habitable zone of a Sun-like star 635 light-years away.',
    facts: [
      '🔭 First planet confirmed by NASA’s Kepler Space Telescope inside the liquid-water habitable zone of a Sun-like star.',
      '🗓️ Completes an orbit around its host star Kepler-22 in 290 days—remarkably close to an Earth year.',
      '🌐 At 2.1× Earth’s diameter, it bridges the mysterious gap between rocky terrestrial worlds and ice giants.',
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    category: 'solar',
    color: '#3b82f6',
    atmosphereColor: '#60a5fa',
    diameterKm: 49244,
    earthRatio: 3.86,
    volumeEarths: 58,
    massEarths: 17.15,
    gravityG: 1.14,
    distFromSunMillionKm: 4495.0,
    lightTime: '4 hrs 10 mins',
    tagline: '🔵 Supersonic Outer Ice Giant',
    desc: 'The outermost major planet at 4.5 billion km from the Sun. Sunlight takes over 4 hours to reach its deep azure methane clouds.',
    facts: [
      '💨 Drives the fastest sustained winds in the Solar System, screaming across the equator at over 2,100 km/h (1,300 mph).',
      '🧮 The first planet discovered via mathematical prediction (1846) before it was ever knowingly seen through a telescope.',
      '🧊 Its giant moon Triton orbits backwards and erupts nitrogen-ice geysers 8 km high.',
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    category: 'solar',
    color: '#67e8f9',
    atmosphereColor: '#a5f3fc',
    diameterKm: 50724,
    earthRatio: 3.98,
    volumeEarths: 63,
    massEarths: 14.54,
    gravityG: 0.89,
    distFromSunMillionKm: 2871.0,
    lightTime: '2 hrs 40 mins',
    tagline: '🧊 Sideways-Tilted Ice Giant',
    desc: 'An ice giant nearly 4 times wider than Earth (63 Earths fit inside), composed of water, methane, and ammonia ices above a rocky core.',
    facts: [
      '📐 Tipped completely on its side at a 97.8° axial tilt—rolling around the Sun with extreme 42-year-long polar summers and winters.',
      '🥶 Holds the coldest planetary atmosphere record in the Solar System at -224°C (-371°F).',
      '⚖️ Despite being 14.5× more massive than Earth, its low density leaves surface gravity slightly weaker than Earth’s (0.89g).',
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    category: 'solar',
    color: '#fde047',
    atmosphereColor: '#fef08a',
    diameterKm: 116460,
    earthRatio: 9.14,
    volumeEarths: 764,
    massEarths: 95.16,
    gravityG: 1.06,
    distFromSunMillionKm: 1434.0,
    lightTime: '1 hr 19 mins',
    tagline: '🪐 Ringed Gas Giant',
    desc: '764 Earths fit inside Saturn, and its brilliant icy rings span 282,000 km—wide enough to line up 22 Earths from edge to edge.',
    facts: [
      '💍 While Saturn’s main rings span nearly 300,000 km across, they are razor-thin—averaging only 10 meters thick!',
      '🛁 Has the lowest density of any planet (0.687 g/cm³)—about 30% less dense than liquid water.',
      '⬡ A persistent six-sided hexagonal jet stream wider than two Earths swirls continuously around Saturn’s north pole.',
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    category: 'solar',
    color: '#fb923c',
    atmosphereColor: '#fdba74',
    diameterKm: 139820,
    earthRatio: 10.97,
    volumeEarths: 1321,
    massEarths: 317.8,
    gravityG: 2.53,
    distFromSunMillionKm: 778.5,
    lightTime: '43.2 mins',
    tagline: '🟠 King of the Gas Giants',
    desc: 'More than twice as massive as all other Solar System planets combined (318× Earth mass), holding 1,321 Earths by volume.',
    facts: [
      '🌪️ The Great Red Spot is a high-pressure anticyclone that has raged for over 300 years and is wider than the entire Earth.',
      '⚡ Spins faster than any other planet, completing a full rotation in under 10 hours and bulging visibly at the equator.',
      '🛰️ Commands a miniature solar system of 95+ moons, including Ganymede—a moon larger than the planet Mercury.',
    ],
  },
  {
    id: 'wasp17b',
    name: 'WASP-17b (Exo)',
    category: 'exoplanet',
    color: '#c084fc',
    atmosphereColor: '#e879f9',
    diameterKm: 278240,
    earthRatio: 21.84,
    volumeEarths: 10410,
    massEarths: 154.5,
    gravityG: 0.32,
    distFromSunMillionKm: null,
    lightTime: '1,300 Light-Years away',
    tagline: '🟣 Ultra-Puffy Hot-Jupiter Exoplanet',
    desc: 'One of the largest known exoplanets! Nearly twice the diameter of Jupiter (21.8 Earths wide), holding over 10,400 Earths in volume.',
    facts: [
      '🎈 Despite having 7.8× Jupiter’s volume, it has less than half Jupiter’s mass—giving it a foam-like average density.',
      '🔄 First exoplanet ever discovered in a retrograde orbit, revolving backwards against the spin of its host star.',
      '☀️ Skims so close to its star that it completes a full year in just 3.7 Earth days at temperatures over 1,500°C.',
    ],
  },
  {
    id: 'sun',
    name: 'The Sun',
    category: 'star',
    color: '#f59e0b',
    atmosphereColor: '#fbbf24',
    diameterKm: 1392700,
    earthRatio: 109.3,
    volumeEarths: 1300000,
    massEarths: 333000,
    gravityG: 27.9,
    distFromSunMillionKm: 0,
    lightTime: '0 sec (Origin)',
    tagline: '☀️ G2V Main-Sequence Yellow Dwarf Star',
    desc: 'Contains 99.86% of all mass in the Solar System. Over 109 Earths fit side-by-side across its face, and 1.3 million Earths fit inside.',
    facts: [
      '⚛️ Fuses 600 million tons of hydrogen into helium every second inside its 15-million-°C core.',
      '🏋️ Surface gravity is 27.9g—a 150-lb person on Earth would weigh over 4,180 lbs at the solar photosphere.',
      '🌟 Though colossal next to planets, the Sun is a compact dwarf compared to evolved red supergiants like Betelgeuse.',
    ],
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse (Star)',
    category: 'star',
    color: '#f97316',
    atmosphereColor: '#fb923c',
    diameterKm: 1063000000,
    earthRatio: 83425,
    volumeEarths: 5.8e14,
    massEarths: 5.5e6,
    gravityG: 0.0003,
    distFromSunMillionKm: 0,
    lightTime: '59.1 mins across diameter',
    tagline: '🔥 Red Supergiant in Orion (α Orionis)',
    desc: 'Roughly 763× wider than our Sun! Over 444 million Suns (or 580 trillion Earths) fit inside its boiling convective envelope.',
    facts: [
      '🪐 Placed at the center of our Solar System, its surface would engulf Mercury, Venus, Earth, Mars, and the Asteroid Belt.',
      '🫧 Giant convection cells as wide as Earth’s entire orbit bubble up to its surface, causing dramatic brightness dimming.',
      '💥 Near the end of its stellar life—expected to explode as a brilliant Type II supernova within the next 100,000 years.',
    ],
  },
  {
    id: 'uyscuti',
    name: 'UY Scuti (Star)',
    category: 'star',
    color: '#ef4444',
    atmosphereColor: '#f87171',
    diameterKm: 2376500000,
    earthRatio: 186500,
    volumeEarths: 6.48e15,
    massEarths: 2.8e6,
    gravityG: 0.00005,
    distFromSunMillionKm: 0,
    lightTime: '2 hrs 12 mins across diameter',
    tagline: '🌟 Extreme Red Hypergiant Star',
    desc: 'One of the largest known stars—1,706× wider than our Sun (~2.38 billion km across), holding nearly 5 billion Suns by volume!',
    facts: [
      '🪐 Placed at our Sun, its outer photosphere would swallow Jupiter’s orbit and reach nearly to Saturn.',
      '⚡ A beam of light traveling at 300,000 km/s takes over 7 hours just to circle UY Scuti’s equator once (vs. 14.5 seconds for the Sun).',
      '🌫️ Its outer atmosphere is an ultra-diffuse vacuum millions of times less dense than air at sea level.',
    ],
  },
];

// Deterministic PRNG so procedural textures look consistent across sessions
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawCraters(ctx, bumpCtx, w, h, count, rng, minR, maxR) {
  for (let i = 0; i < count; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const r = minR + rng() * (maxR - minR);
    // Rim highlight
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.22)';
    ctx.lineWidth = Math.max(1, r * 0.18);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();

    // Dark crater floor
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.82, 0, Math.PI * 2);
    ctx.fill();

    if (bumpCtx) {
      bumpCtx.strokeStyle = 'rgba(235, 235, 235, 0.75)';
      bumpCtx.lineWidth = Math.max(1.2, r * 0.22);
      bumpCtx.beginPath();
      bumpCtx.arc(x, y, r, 0, Math.PI * 2);
      bumpCtx.stroke();

      bumpCtx.fillStyle = 'rgba(40, 40, 40, 0.7)';
      bumpCtx.beginPath();
      bumpCtx.arc(x, y, r * 0.8, 0, Math.PI * 2);
      bumpCtx.fill();
    }
  }
}

function drawGasBands(ctx, w, h, palette, rng, turbulence = 6) {
  const bh = h / palette.length;
  palette.forEach((c, i) => {
    const grad = ctx.createLinearGradient(0, i * bh, 0, (i + 1) * bh);
    grad.addColorStop(0, c);
    grad.addColorStop(1, palette[(i + 1) % palette.length]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, i * bh, w, bh + 2);
  });

  // Wavy zonal jet-stream streaks
  for (let i = 0; i < 65; i++) {
    const y = rng() * h;
    const amp = (rng() - 0.5) * turbulence;
    ctx.strokeStyle = rng() > 0.5 ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)';
    ctx.lineWidth = 1.5 + rng() * 5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(w * 0.33, y + amp, w * 0.66, y - amp, w, y);
    ctx.stroke();
  }
}

/**
 * Generates paired high-res (1024x512) procedural PBR CanvasTextures:
 * - map (albedo), bumpMap, roughnessMap, and cloudMap (for Earth).
 */
export function createPlanetMaps(id) {
  const w = 1024;
  const h = 512;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bumpCtx = bumpCanvas.getContext('2d');
  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, w, h);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = w;
  roughCanvas.height = h;
  const roughCtx = roughCanvas.getContext('2d');
  roughCtx.fillStyle = '#b0b0b0';
  roughCtx.fillRect(0, 0, w, h);

  let cloudMap = null;
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  const rng = mulberry32(seed || 1337);

  if (id === 'sun') {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#fff7ed');
    grad.addColorStop(0.25, '#fbbf24');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.75, '#ea580c');
    grad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 650; i++) {
      ctx.fillStyle = i % 3 === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(180,50,0,0.22)';
      ctx.beginPath();
      ctx.arc(rng() * w, rng() * h, rng() * 20 + 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'betelgeuse' || id === 'uyscuti') {
    const isUY = id === 'uyscuti';
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, isUY ? '#fecaca' : '#ffedd5');
    grad.addColorStop(0.3, isUY ? '#ef4444' : '#f97316');
    grad.addColorStop(0.65, isUY ? '#991b1b' : '#c2410c');
    grad.addColorStop(1, isUY ? '#dc2626' : '#ea580c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 280; i++) {
      ctx.fillStyle =
        i % 3 === 0
          ? 'rgba(254, 240, 138, 0.30)'
          : i % 3 === 1
          ? 'rgba(127, 29, 29, 0.38)'
          : 'rgba(251, 146, 60, 0.26)';
      ctx.beginPath();
      ctx.arc(rng() * w, rng() * h, rng() * 52 + 12, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'earth') {
    // Deep ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#0c4a6e');
    oceanGrad.addColorStop(0.5, '#0369a1');
    oceanGrad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // Smooth low roughness on oceans for specular sun glint
    roughCtx.fillStyle = '#383838';
    roughCtx.fillRect(0, 0, w, h);

    // Continents with coastal shelf & highland texture
    const blobs = [
      [215, 175, 92, 68, 0.25],
      [285, 305, 62, 88, -0.15],
      [510, 155, 108, 60, 0.2],
      [545, 270, 74, 84, 0.1],
      [735, 185, 130, 78, -0.1],
      [830, 345, 58, 42, 0.35],
    ];
    blobs.forEach(([x, y, rx, ry, rot]) => {
      // Coastal shelf
      ctx.fillStyle = 'rgba(14, 165, 233, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x, y, rx * 1.12, ry * 1.12, rot, 0, Math.PI * 2);
      ctx.fill();

      // Landmass
      const landGrad = ctx.createRadialGradient(x, y, rx * 0.1, x, y, rx);
      landGrad.addColorStop(0, '#166534');
      landGrad.addColorStop(0.7, '#15803d');
      landGrad.addColorStop(1, '#ca8a04');
      ctx.fillStyle = landGrad;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();

      // Matte roughness + raised elevation on continents
      roughCtx.fillStyle = '#d4d4d4';
      roughCtx.beginPath();
      roughCtx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      roughCtx.fill();

      bumpCtx.fillStyle = '#b8b8b8';
      bumpCtx.beginPath();
      bumpCtx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      bumpCtx.fill();
    });

    // Polar ice caps
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, 30);
    ctx.fillRect(0, h - 30, w, 30);

    // Separate translucent cloud layer
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = w;
    cloudCanvas.height = h;
    const cCtx = cloudCanvas.getContext('2d');
    for (let i = 0; i < 110; i++) {
      const cx = rng() * w;
      const cy = 28 + rng() * (h - 56);
      const crx = 24 + rng() * 90;
      const cry = 5 + rng() * 16;
      cCtx.fillStyle = `rgba(255, 255, 255, ${0.14 + rng() * 0.28})`;
      cCtx.beginPath();
      cCtx.ellipse(cx, cy, crx, cry, (rng() - 0.5) * 0.3, 0, Math.PI * 2);
      cCtx.fill();
    }
    cloudMap = new THREE.CanvasTexture(cloudCanvas);
    cloudMap.colorSpace = THREE.SRGBColorSpace;
  } else if (id === 'jupiter') {
    drawGasBands(
      ctx,
      w,
      h,
      ['#d97706', '#fed7aa', '#b45309', '#f59e0b', '#fde68a', '#9a3412', '#fb923c', '#fed7aa'],
      rng,
      10
    );
    // Great Red Spot
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(580, 330, 56, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4;
    ctx.stroke();
    roughCtx.fillStyle = '#999999';
    roughCtx.fillRect(0, 0, w, h);
  } else if (id === 'saturn') {
    drawGasBands(
      ctx,
      w,
      h,
      ['#fef08a', '#eab308', '#fde047', '#ca8a04', '#fef9c3', '#d97706'],
      rng,
      6
    );
    roughCtx.fillStyle = '#999999';
    roughCtx.fillRect(0, 0, w, h);
  } else if (id === 'mars') {
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(124,45,18,0.35)' : 'rgba(251,146,60,0.28)';
      ctx.beginPath();
      ctx.arc(rng() * w, rng() * h, rng() * 48 + 8, 0, Math.PI * 2);
      ctx.fill();
    }
    drawCraters(ctx, bumpCtx, w, h, 85, rng, 4, 22);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, 18);
    ctx.fillRect(0, h - 18, w, 18);
    roughCtx.fillStyle = '#dcdcdc';
    roughCtx.fillRect(0, 0, w, h);
  } else if (id === 'mercury' || id === 'moon') {
    ctx.fillStyle = id === 'moon' ? '#94a3b8' : '#64748b';
    ctx.fillRect(0, 0, w, h);
    // Dark lunar maria patches
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.25)';
      ctx.beginPath();
      ctx.ellipse(rng() * w, rng() * h, 35 + rng() * 75, 25 + rng() * 55, rng() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    drawCraters(ctx, bumpCtx, w, h, 240, rng, 3, 28);
    roughCtx.fillStyle = '#e5e5e5';
    roughCtx.fillRect(0, 0, w, h);
  } else if (id === 'pluto') {
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#57534e';
    ctx.fillRect(0, 260, w, 130);
    drawCraters(ctx, bumpCtx, w, h, 70, rng, 3, 18);
    // Tombaugh Regio heart
    ctx.fillStyle = '#fef2f2';
    ctx.beginPath();
    ctx.ellipse(490, 264, 72, 88, -0.25, 0, Math.PI * 2);
    ctx.ellipse(570, 268, 68, 80, 0.25, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'ceres') {
    ctx.fillStyle = '#52525b';
    ctx.fillRect(0, 0, w, h);
    drawCraters(ctx, bumpCtx, w, h, 210, rng, 4, 24);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(520, 236, 11, 0, Math.PI * 2);
    ctx.arc(544, 240, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'venus') {
    drawGasBands(ctx, w, h, ['#fde047', '#eab308', '#d97706', '#facc15', '#fef08a'], rng, 12);
  } else if (id === 'uranus') {
    drawGasBands(ctx, w, h, ['#a5f3fc', '#67e8f9', '#22d3ee', '#0891b2', '#67e8f9'], rng, 4);
  } else if (id === 'neptune') {
    drawGasBands(ctx, w, h, ['#1d4ed8', '#2563eb', '#1e40af', '#3b82f6', '#1e3a8a'], rng, 8);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    ctx.beginPath();
    ctx.ellipse(440, 290, 44, 24, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'kepler22b') {
    drawGasBands(ctx, w, h, ['#ecfeff', '#0d9488', '#0f766e', '#14b8a6', '#ecfeff'], rng, 9);
    roughCtx.fillStyle = '#505050';
    roughCtx.fillRect(0, 0, w, h);
  } else if (id === 'wasp17b') {
    drawGasBands(
      ctx,
      w,
      h,
      ['#581c87', '#9333ea', '#c084fc', '#7e22ce', '#f472b6', '#6b21a8', '#a855f7'],
      rng,
      14
    );
    ctx.fillStyle = 'rgba(253, 224, 71, 0.30)';
    for (let i = 0; i < 45; i++) {
      ctx.fillRect(rng() * w, rng() * h, 140, 5);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);

  return { map, bumpMap, roughnessMap, cloudMap };
}

export function createPlanetTexture(id) {
  return createPlanetMaps(id).map;
}

/**
 * Generates a high-resolution radial ring texture for Saturn (with Cassini Division).
 */
export function createSaturnRingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  const stops = [
    [0.0, 'rgba(253, 224, 71, 0.0)'],
    [0.08, 'rgba(217, 180, 120, 0.35)'],
    [0.25, 'rgba(253, 230, 138, 0.85)'],
    [0.48, 'rgba(254, 240, 138, 0.92)'],
    [0.54, 'rgba(20, 20, 30, 0.08)'], // Cassini Division
    [0.62, 'rgba(234, 179, 8, 0.78)'],
    [0.85, 'rgba(253, 224, 71, 0.55)'],
    [0.95, 'rgba(253, 224, 71, 0.15)'],
    [1.0, 'rgba(253, 224, 71, 0.0)'],
  ];
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  stops.forEach(([pos, color]) => grad.addColorStop(pos, color));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 32);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
