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
    distFromSunMillionKm: 413.7,
    footballYards: 9.2,
    lightTime: '23.0 mins',
    metaphors: {
      marble: '🏖️ Coarse Grain of Sand (0.11 cm / 1.1 mm)',
      tennis: '🌱 Coriander Seed / BB (0.5 cm)',
      basketball: '🍒 Small Cherry (1.8 cm)',
    },
    desc: 'The largest object in the Asteroid Belt between Mars and Jupiter (at the 9.2-yard line). Over 2,400 Ceres spheres would fit inside a single Earth!',
  },
  {
    id: 'pluto',
    name: 'Pluto (Dwarf)',
    category: 'dwarf',
    color: '#fca5a5',
    diameterKm: 2376,
    earthRatio: 0.186,
    volumeEarths: 0.0064,
    distFromSunMillionKm: 5906.4,
    footballYards: 131.4,
    lightTime: '5 hrs 28 mins',
    metaphors: {
      marble: '🌾 Sesame Seed / Pinhead (0.28 cm)',
      tennis: '🫛 Small Chickpea (1.25 cm)',
      basketball: '⛳ Golf Ball (4.5 cm)',
    },
    desc: 'Famous for its heart-shaped nitrogen glacier (Tombaugh Regio). Pluto is smaller than Earth’s Moon (156 Plutos fit inside Earth) and orbits at the 131.4-yard line—31 yards out past the Neptune endzone!',
  },
  {
    id: 'moon',
    name: 'The Moon',
    category: 'solar',
    color: '#cbd5e1',
    diameterKm: 3474,
    earthRatio: 0.273,
    volumeEarths: 0.02,
    distFromSunMillionKm: 149.9,
    footballYards: 3.31,
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
    distFromSunMillionKm: 57.9,
    footballYards: 1.3,
    lightTime: '3.2 mins',
    metaphors: {
      marble: '🌶️ Black Peppercorn (0.57 cm)',
      tennis: '🫐 Large Blueberry (2.5 cm)',
      basketball: '⚾ Baseball (9.2 cm)',
    },
    desc: 'The smallest major planet—only slightly larger than Earth’s Moon. On a 100-yard football field, it sits just 1.3 yards from the Sun.',
  },
  {
    id: 'mars',
    name: 'Mars',
    category: 'solar',
    color: '#ef4444',
    diameterKm: 6779,
    earthRatio: 0.532,
    volumeEarths: 0.151,
    distFromSunMillionKm: 227.9,
    footballYards: 5.1,
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
    diameterKm: 12104,
    earthRatio: 0.95,
    volumeEarths: 0.857,
    distFromSunMillionKm: 108.2,
    footballYards: 2.4,
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
    diameterKm: 12742,
    earthRatio: 1.0,
    volumeEarths: 1.0,
    distFromSunMillionKm: 149.6,
    footballYards: 3.3,
    lightTime: '8.3 mins',
    metaphors: {
      marble: '🔮 Standard Glass Marble (1.5 cm)',
      tennis: '🎾 Standard Tennis Ball (6.7 cm)',
      basketball: '🏀 Regulation Basketball (24.0 cm)',
    },
    desc: 'Our home reference point (1.00×). On a 100-yard Solar System football field, Earth is huddled at the 3.3-yard line!',
  },
  {
    id: 'kepler22b',
    name: 'Kepler-22b (Exo)',
    category: 'exoplanet',
    color: '#14b8a6',
    diameterKm: 26758,
    earthRatio: 2.1,
    volumeEarths: 9.26,
    distFromSunMillionKm: null,
    footballYards: null,
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
    diameterKm: 49244,
    earthRatio: 3.86,
    volumeEarths: 58,
    distFromSunMillionKm: 4495.0,
    footballYards: 100.0,
    lightTime: '4 hrs 10 mins',
    metaphors: {
      marble: '🍋 Large Lemon / Plum (5.8 cm)',
      tennis: '⚽ Soccer Ball (25.9 cm)',
      basketball: '🎈 3-foot Weather Balloon (92.6 cm)',
    },
    desc: 'Marks the 100-yard goal line at 4.5 billion km from the Sun. Sunlight takes over 4 hours just to reach its supersonic blue clouds.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    category: 'solar',
    color: '#67e8f9',
    diameterKm: 50724,
    earthRatio: 3.98,
    volumeEarths: 63,
    distFromSunMillionKm: 2871.0,
    footballYards: 63.8,
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
    diameterKm: 116460,
    earthRatio: 9.14,
    volumeEarths: 764,
    distFromSunMillionKm: 1434.0,
    footballYards: 31.9,
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
    diameterKm: 139820,
    earthRatio: 10.97,
    volumeEarths: 1321,
    distFromSunMillionKm: 778.5,
    footballYards: 17.3,
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
    diameterKm: 278240,
    earthRatio: 21.84,
    volumeEarths: 10410,
    distFromSunMillionKm: null,
    footballYards: null,
    lightTime: '1,300 Light-Years away',
    metaphors: {
      marble: '🏖️ 13-inch Beach Ball (32.8 cm)',
      tennis: '🛋️ 4.8-foot Giant Loveseat Sphere (1.46 m)',
      basketball: '🏠 17.2-foot Two-Story House Sphere (5.24 m)',
    },
    desc: 'One of the largest known exoplanets! A bloated "Puffy Hot Jupiter" nearly TWICE the diameter of Jupiter (21.8 Earths wide), holding over 10,400 Earths in volume!',
  },
  {
    id: 'sun',
    name: 'The Sun',
    category: 'star',
    color: '#f59e0b',
    diameterKm: 1392700,
    earthRatio: 109.3,
    volumeEarths: 1300000,
    distFromSunMillionKm: 0,
    footballYards: 0,
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
    diameterKm: 1063000000,
    earthRatio: 83425,
    volumeEarths: 5.8e14,
    distFromSunMillionKm: 0,
    footballYards: 11.8, // Radius reaches 11.8 yards on our 100-yard field (past Mars, nearly to Jupiter!)
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
    diameterKm: 2376500000,
    earthRatio: 186500,
    volumeEarths: 6.48e15,
    distFromSunMillionKm: 0,
    footballYards: 26.4, // Radius reaches 26.4 yards (way past Jupiter, almost to Saturn!)
    lightTime: '2 hrs 12 mins across diameter',
    metaphors: {
      marble: '🌉 1.74-Mile Wide Sphere (2.8 km — wider than Golden Gate Bridge!)',
      tennis: '🏔️ 7.8-Mile Wide Sphere (12.5 km — 1.4× taller than Mt. Everest!)',
      basketball: '🌎 27.8-Mile Wide Asteroid-Sized Sphere (44.8 km across!)',
    },
    desc: 'Colossal Red Hypergiant (1,706× wider than our Sun!). Nearly 5 BILLION Suns (or 6.5 quadrillion Earths) fit inside! Placed at our Sun, it swallows Jupiter and reaches nearly to Saturn’s orbit!',
  },
];

/**
 * Generates procedural high-resolution CanvasTextures for each planet, dwarf planet, exoplanet, and star.
 */
export function createPlanetTexture(id) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (id === 'sun') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#fff7ed');
    grad.addColorStop(0.25, '#fbbf24');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.75, '#ea580c');
    grad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 350; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(180,50,0,0.22)';
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 14 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'betelgeuse' || id === 'uyscuti') {
    const isUY = id === 'uyscuti';
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, isUY ? '#fecaca' : '#ffedd5');
    grad.addColorStop(0.3, isUY ? '#ef4444' : '#f97316');
    grad.addColorStop(0.65, isUY ? '#991b1b' : '#c2410c');
    grad.addColorStop(1, isUY ? '#dc2626' : '#ea580c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    // Giant boiling convection cells characteristic of red supergiants/hypergiants
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle =
        i % 3 === 0
          ? 'rgba(254, 240, 138, 0.28)'
          : i % 3 === 1
          ? 'rgba(127, 29, 29, 0.35)'
          : 'rgba(251, 146, 60, 0.25)';
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 34 + 8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'pluto') {
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(0, 0, 512, 256);
    // Dark equatorial band (Cthulhu Macula)
    ctx.fillStyle = '#57534e';
    ctx.fillRect(0, 130, 512, 65);
    // Iconic bright Heart-shaped Nitrogen Glacier (Tombaugh Regio)
    ctx.fillStyle = '#fef2f2';
    ctx.beginPath();
    ctx.ellipse(245, 132, 36, 44, -0.25, 0, Math.PI * 2);
    ctx.ellipse(285, 134, 34, 40, 0.25, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'ceres') {
    ctx.fillStyle = '#52525b';
    ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(24,24,27,0.45)' : 'rgba(161,161,170,0.25)';
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 16 + 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // Famous Occator Crater bright salt spots
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(260, 118, 6, 0, Math.PI * 2);
    ctx.arc(272, 120, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'kepler22b') {
    // Deep ocean super-Earth with turquoise bands & white cyclones
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#ecfeff');
    grad.addColorStop(0.2, '#0d9488');
    grad.addColorStop(0.5, '#0f766e');
    grad.addColorStop(0.8, '#0d9488');
    grad.addColorStop(1, '#ecfeff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    for (let i = 0; i < 55; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 220 + 18, Math.random() * 90 + 25, 5);
    }
  } else if (id === 'wasp17b') {
    // Glowing purple/magenta ultra-hot puffy exoplanet
    const bands = ['#581c87', '#9333ea', '#c084fc', '#7e22ce', '#f472b6', '#6b21a8', '#a855f7'];
    const bh = 256 / bands.length;
    bands.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, i * bh, 512, bh + 2);
    });
    // Glowing hot-spot streaks
    ctx.fillStyle = 'rgba(253, 224, 71, 0.32)';
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 256, 80, 4);
    }
  } else if (id === 'earth') {
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#15803d';
    const blobs = [
      [110, 90, 48, 35], [145, 155, 32, 45], [260, 80, 55, 32],
      [275, 135, 38, 42], [365, 95, 65, 40], [415, 175, 30, 22]
    ];
    blobs.forEach(([x, y, rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 16);
    ctx.fillRect(0, 240, 512, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    for (let i = 0; i < 45; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 220 + 18, Math.random() * 75 + 20, 4);
    }
  } else if (id === 'jupiter') {
    const bands = ['#d97706', '#fed7aa', '#b45309', '#f59e0b', '#fde68a', '#9a3412', '#fb923c', '#fed7aa'];
    const bh = 256 / bands.length;
    bands.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, i * bh, 512, bh + 2);
    });
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(290, 165, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (id === 'saturn') {
    const bands = ['#fef08a', '#eab308', '#fde047', '#ca8a04', '#fef9c3', '#d97706'];
    const bh = 256 / bands.length;
    bands.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, i * bh, 512, bh + 2);
    });
  } else if (id === 'mars') {
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(124,45,18,0.4)' : 'rgba(251,146,60,0.3)';
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 26 + 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 10);
    ctx.fillRect(0, 246, 512, 10);
  } else if (id === 'mercury' || id === 'moon') {
    ctx.fillStyle = id === 'moon' ? '#94a3b8' : '#64748b';
    ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 140; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(30,41,59,0.4)' : 'rgba(226,232,240,0.25)';
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 14 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'venus') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#fde047');
    grad.addColorStop(0.5, '#d97706');
    grad.addColorStop(1, '#facc15');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
  } else if (id === 'uranus') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#a5f3fc');
    grad.addColorStop(0.5, '#22d3ee');
    grad.addColorStop(1, '#0891b2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
  } else if (id === 'neptune') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#1d4ed8');
    grad.addColorStop(0.5, '#2563eb');
    grad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for (let i = 0; i < 25; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 256, 65, 3);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
