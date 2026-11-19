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
    metaphors: {
      marble: '🏖️ Coarse Grain of Sand (0.11 cm / 1.1 mm)',
      tennis: '🌱 Coriander Seed / BB (0.5 cm)',
      basketball: '🍒 Small Cherry (1.8 cm)',
    },
    desc: 'The largest object in the Asteroid Belt between Mars and Jupiter. Over 2,400 Ceres spheres would fit inside a single Earth!',
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
    metaphors: {
      marble: '🌾 Sesame Seed / Pinhead (0.28 cm)',
      tennis: '🫛 Small Chickpea (1.25 cm)',
      basketball: '⛳ Golf Ball (4.5 cm)',
    },
    desc: 'Famous for its heart-shaped nitrogen glacier (Tombaugh Regio). Pluto is smaller than Earth’s Moon (156 Plutos fit inside Earth).',
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
    metaphors: {
      marble: '🌱 Mustard Seed / BB Pellet (0.41 cm)',
      tennis: '🍒 Small Cherry / Grape (1.8 cm)',
      basketball: '🎾 Tennis Ball (6.5 cm)',
    },
    desc: 'Roughly 1/4 the width of Earth. It takes 50 Moons to match Earth’s volume—yet every planet in the Solar System could fit end-to-end in the gap between Earth and the Moon!',
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
    metaphors: {
      marble: '🌶️ Black Peppercorn (0.57 cm)',
      tennis: '🫐 Large Blueberry (2.5 cm)',
      basketball: '⚾ Baseball (9.2 cm)',
    },
    desc: 'The smallest major planet—only slightly larger than Earth’s Moon, with an iron-rich core that gives it Mars-like surface gravity (0.38g).',
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
    metaphors: {
      marble: '🟢 Green Garden Pea (0.8 cm)',
      tennis: '🏓 Ping-Pong Ball (3.6 cm)',
      basketball: '🍈 Cantaloupe Melon (12.8 cm)',
    },
    desc: 'Many people imagine Mars is nearly as big as Earth, but it is barely half Earth’s width and only 15% of Earth’s volume!',
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
    metaphors: {
      marble: '🔮 Slightly Smaller Marble (1.4 cm)',
      tennis: '🎾 Almost a Tennis Ball (6.4 cm)',
      basketball: '⚽ Soccer Ball (22.8 cm)',
    },
    desc: 'Often called Earth’s twin because its size is 95% identical to Earth, though wrapped in a crushing sulfuric acid greenhouse atmosphere.',
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
    metaphors: {
      marble: '🔮 Standard Glass Marble (1.5 cm)',
      tennis: '🎾 Standard Tennis Ball (6.7 cm)',
      basketball: '🏀 Regulation Basketball (24.0 cm)',
    },
    desc: 'Our home reference point (1.00×). Liquid oceans cover 71% of its surface under a thin, protective nitrogen-oxygen atmosphere.',
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
    metaphors: {
      marble: '🌰 Whole Walnut / Bouncy Ball (3.15 cm)',
      tennis: '🍊 Large Grapefruit (14.1 cm)',
      basketball: '🏖️ 20-inch Beach Ball (50.4 cm)',
    },
    desc: 'A famous "Super-Earth" / "Ocean World" exoplanet orbiting in the habitable zone of a Sun-like star 635 light-years away. Twice Earth’s width, holding over 9 Earths in volume!',
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
    metaphors: {
      marble: '🍋 Large Lemon / Plum (5.8 cm)',
      tennis: '⚽ Soccer Ball (25.9 cm)',
      basketball: '🎈 3-foot Weather Balloon (92.6 cm)',
    },
    desc: 'An ice giant 4.5 billion km from the Sun. Sunlight takes over 4 hours just to reach its supersonic blue methane clouds.',
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
    metaphors: {
      marble: '🍑 Peach / Baseball (6.0 cm)',
      tennis: '🏀 Basketball (26.7 cm)',
      basketball: '🛞 3.1-foot Monster Truck Tire (95.5 cm)',
    },
    desc: 'An ice giant nearly 4 times wider than Earth (63 Earths fit inside). It orbits tipped completely on its side at a 98° tilt.',
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
    metaphors: {
      marble: '🍊 Big Navel Orange + Dinner-Plate Rings (13.7 cm)',
      tennis: '🪑 2-foot Beanbag Chair (61.2 cm)',
      basketball: '🚗 7.2-foot SUV-tall Sphere (2.19 m)',
    },
    desc: '764 Earths fit inside Saturn, and its icy rings span 282,000 km—wide enough to line up 22 Earths from edge to edge!',
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
    metaphors: {
      marble: '🍊 Large Grapefruit (16.5 cm)',
      tennis: '🏖️ 2.4-foot Exercise Ball (73.5 cm)',
      basketball: '🚐 8.6-foot Minivan-tall Sphere (2.63 m)',
    },
    desc: 'More than twice as massive as all other Solar System planets combined! Its Great Red Spot storm alone is wider than the entire Earth.',
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
    metaphors: {
      marble: '🏖️ 13-inch Beach Ball (32.8 cm)',
      tennis: '🛋️ 4.8-foot Giant Loveseat Sphere (1.46 m)',
      basketball: '🏠 17.2-foot Two-Story House Sphere (5.24 m)',
    },
    desc: 'One of the largest known exoplanets! A bloated "Puffy Hot Jupiter" nearly TWICE the diameter of Jupiter (21.8 Earths wide) with ultra-low density.',
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
    metaphors: {
      marble: '🏖️ 5.4-foot Giant Beach Ball (164 cm)',
      tennis: '🏠 24-foot Two-Story House Sphere (7.3 m)',
      basketball: '🏢 86-foot 8-Story Building Sphere (26.2 m)',
    },
    desc: 'Our G-type star. Over 109 Earths fit side-by-side across its face, and 1.3 million Earths fit inside—yet it is a tiny dwarf compared to Betelgeuse and UY Scuti!',
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
    metaphors: {
      marble: '🏙️ 0.78-Mile Wide Sphere (1.25 km — 3× Empire State Bldg!)',
      tennis: '🏔️ 3.5-Mile Wide Mountain Sphere (5.6 km — taller than Mt. Blanc!)',
      basketball: '🌆 12.4-Mile Wide Mega-City Sphere (20.0 km — spans Manhattan!)',
    },
    desc: 'Red Supergiant in Orion (763× wider than our Sun!). Over 444 MILLION Suns (or 580 trillion Earths) fit inside! Placed at our Sun, its surface swallows Mercury, Venus, Earth, Mars, and Ceres!',
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
    metaphors: {
      marble: '🌉 1.74-Mile Wide Sphere (2.8 km — wider than Golden Gate Bridge!)',
      tennis: '🏔️ 7.8-Mile Wide Sphere (12.5 km — 1.4× taller than Mt. Everest!)',
      basketball: '🌎 27.8-Mile Wide Asteroid-Sized Sphere (44.8 km across!)',
    },
    desc: 'Colossal Red Hypergiant (1,706× wider than our Sun!). Nearly 5 BILLION Suns (or 6.5 quadrillion Earths) fit inside! Placed at our Sun, it swallows Jupiter and reaches nearly to Saturn’s orbit!',
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
