import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BODIES, createPlanetTexture } from './planetsData.js';

// ============================================================================
// 1. Scene, Camera, Renderer & Controls
// ============================================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.02,
  3000
);
camera.position.set(0, 8, 36);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.maxDistance = 800;
controls.minDistance = 0.25;

// Smooth Camera Flight Target
const camFlight = {
  active: false,
  pos: new THREE.Vector3(),
  look: new THREE.Vector3(),
};

function flyCameraTo(posVec, lookVec) {
  camFlight.pos.copy(posVec);
  camFlight.look.copy(lookVec);
  camFlight.active = true;
}

window.addEventListener('pointerdown', (e) => {
  if (e.target === renderer.domElement) {
    camFlight.active = false;
  }
});

// ============================================================================
// 2. Lighting & Starfield Background
// ============================================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
dirLight.position.set(-40, 35, 50);
scene.add(dirLight);

function createStarfield() {
  const starGeo = new THREE.BufferGeometry();
  const count = 2800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    const r = 450 + Math.random() * 650;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i] = r * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = r * Math.cos(phi);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xe2e8f0,
    size: 1.3,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(starGeo, starMat));
}
createStarfield();

// Cache textures
const textureCache = {};
BODIES.forEach((b) => {
  textureCache[b.id] = createPlanetTexture(b.id);
});

function formatLargeNumber(num) {
  if (num >= 1e15) return `${(num / 1e15).toFixed(2)} Quadrillion`;
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)} Trillion`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)} Billion`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)} Million`;
  if (num >= 100) return Math.round(num).toLocaleString();
  if (num >= 1) return num.toFixed(2);
  return num.toFixed(4);
}

function createBodyMesh(body, radius, isTranslucent = false) {
  const group = new THREE.Group();
  const geo = new THREE.SphereGeometry(radius, 48, 32);

  let mat;
  if (body.category === 'star') {
    mat = new THREE.MeshBasicMaterial({
      map: textureCache[body.id],
      transparent: isTranslucent,
      opacity: isTranslucent ? 0.35 : 1.0,
    });
  } else {
    mat = new THREE.MeshStandardMaterial({
      map: textureCache[body.id],
      roughness: 0.65,
      metalness: 0.08,
      transparent: isTranslucent,
      opacity: isTranslucent ? 0.35 : 1.0,
    });
  }

  const sphere = new THREE.Mesh(geo, mat);
  sphere.userData = { bodyId: body.id };
  group.add(sphere);

  // Add iconic rings for Saturn and Uranus
  if (body.id === 'saturn') {
    const ringGeo = new THREE.RingGeometry(radius * 1.35, radius * 2.3, 64);
    ringGeo.rotateX(Math.PI / 2.2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isTranslucent ? 0.25 : 0.72,
      roughness: 0.8,
    });
    group.add(new THREE.Mesh(ringGeo, ringMat));
  } else if (body.id === 'uranus') {
    const ringGeo = new THREE.RingGeometry(radius * 1.35, radius * 1.6, 64);
    ringGeo.rotateY(Math.PI / 6);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    group.add(new THREE.Mesh(ringGeo, ringMat));
  }

  group.userData = { body, radius, sphere };
  return group;
}

function createLabelSprite(text, subtext = '', color = '#38bdf8', scale = 4) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(11, 15, 29, 0.85)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(16, 16, 480, 128, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 256, subtext ? 72 : 94);

  if (subtext) {
    ctx.fillStyle = color;
    ctx.font = '600 28px system-ui, sans-serif';
    ctx.fillText(subtext, 256, 118);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scale, scale * (160 / 512), 1);
  return sprite;
}

// ============================================================================
// 3. Mode Groups & Application State
// ============================================================================
const lineupGroup = new THREE.Group();
const compareGroup = new THREE.Group();
const distanceGroup = new THREE.Group();

scene.add(lineupGroup);
scene.add(compareGroup);
scene.add(distanceGroup);

const state = {
  mode: 'lineup', // 'lineup' | 'compare' | 'distance'
  lineupTier: 'planetary', // 'planetary' | 'stellar'
  metaphor: 'marble', // 'marble' | 'tennis' | 'basketball'
  selectedBodyId: 'earth',
  showSunInLineup: true,
  compareAId: 'earth',
  compareBId: 'jupiter',
  compareSubMode: 'equator', // 'equator' | 'volume'
  speedMode: 'jet',
  journeyYards: 3.3,
  showStarEngulfInDist: true,
  autoFlying: false,
};

// ============================================================================
// 4. MODE 1: Everyday Object Lineup (Planetary Stage & Stellar Titan Stage)
// ============================================================================
let lineupMeshes = {};
let sunLineupMesh = null;

function buildLineupScene() {
  lineupGroup.clear();
  lineupMeshes = {};
  sunLineupMesh = null;

  document.getElementById('sun-toggle-row').style.display =
    state.lineupTier === 'planetary' ? 'block' : 'none';

  if (state.lineupTier === 'planetary') {
    // Floor reference grid
    const grid = new THREE.GridHelper(260, 80, 0x1e3a8a, 0x0f172a);
    grid.position.y = -23;
    lineupGroup.add(grid);

    let cursorX = -24;
    const order = [
      'ceres',
      'pluto',
      'moon',
      'mercury',
      'mars',
      'venus',
      'earth',
      'kepler22b',
      'neptune',
      'uranus',
      'saturn',
      'jupiter',
      'wasp17b',
    ];

    order.forEach((id) => {
      const body = BODIES.find((b) => b.id === id);
      const r = body.earthRatio; // True relative radius (Earth = 1.0)
      const gap = r < 1.2 ? 2.6 : r * 1.35 + 3.2;
      cursorX += r + gap * 0.5;

      const meshGroup = createBodyMesh(body, r);
      meshGroup.position.set(cursorX, 0, 0);
      lineupGroup.add(meshGroup);

      // Glowing pedestal ring under tiny dwarf/rocky planets so they are always easy to spot
      const ringGeo = new THREE.RingGeometry(Math.max(r * 1.15, 0.35), Math.max(r * 1.32, 0.5), 32);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: body.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(cursorX, -r - 0.3, 0);
      lineupGroup.add(ring);

      const labelScale = Math.max(3.2, Math.min(r * 1.1, 11.5));
      const label = createLabelSprite(
        body.name,
        `${body.earthRatio}× Earth`,
        body.color,
        labelScale
      );
      label.position.set(cursorX, r + labelScale * 0.25 + 0.8, 0);
      lineupGroup.add(label);

      lineupMeshes[id] = { group: meshGroup, x: cursorX, r: Math.max(r, 0.45), body };
      cursorX += r + gap * 0.5;
    });

    // Colossal Sun on the left
    const sunBody = BODIES.find((b) => b.id === 'sun');
    const sunR = sunBody.earthRatio; // 109.3
    sunLineupMesh = createBodyMesh(sunBody, sunR);
    const sunCenterX = -28 - sunR;
    sunLineupMesh.position.set(sunCenterX, 0, 0);
    sunLineupMesh.visible = state.showSunInLineup;
    lineupGroup.add(sunLineupMesh);

    const sunLabel = createLabelSprite('The Sun', '109.3× Earth Width!', '#f59e0b', 16);
    sunLabel.position.set(-36, 24, 0);
    sunLineupMesh.add(sunLabel);

    lineupMeshes['sun'] = {
      group: sunLineupMesh,
      x: -28,
      r: 28,
      body: sunBody,
    };
  } else {
    // STELLAR TITAN STAGE: Compare WASP-17b, The Sun, Betelgeuse (763x Sun), and UY Scuti (1,706x Sun)!
    // Normalize 1 Sun radius = 0.05 3D units so Betelgeuse = 38.1 units and UY Scuti = 85.3 units
    const scaleFactor = 0.05 / 109.3;
    const grid = new THREE.GridHelper(420, 70, 0x7c2d12, 0x1e1b4b);
    grid.position.y = -90;
    lineupGroup.add(grid);

    let cursorX = -65;
    const starOrder = ['sun', 'betelgeuse', 'uyscuti'];

    starOrder.forEach((id) => {
      const body = BODIES.find((b) => b.id === id);
      const trueR = body.earthRatio * scaleFactor;
      const visR = Math.max(trueR, 0.12); // Sun is a tiny 0.05-unit spark next to Betelgeuse (38.1) & UY Scuti (85.3)!
      const gap = visR < 2 ? 14 : 26;
      cursorX += visR + gap * 0.5;

      const meshGroup = createBodyMesh(body, visR, id !== 'sun');
      meshGroup.position.set(cursorX, 0, 0);
      lineupGroup.add(meshGroup);

      // Pointer halo around the tiny Sun so you can see where it sits next to Betelgeuse!
      if (id === 'sun') {
        const haloGeo = new THREE.RingGeometry(0.9, 1.25, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.set(cursorX, 0, 0);
        lineupGroup.add(halo);
      }

      // Inside Betelgeuse and UY Scuti, draw glowing rings showing Earth's Orbit (1 AU = 215 Sun radii) and Jupiter's Orbit (5.2 AU = 1,118 Sun radii)
      if (id === 'betelgeuse' || id === 'uyscuti') {
        const earthOrbitR = 215 * 0.05; // 10.75 units
        const earthOrbitGeo = new THREE.RingGeometry(earthOrbitR - 0.25, earthOrbitR + 0.25, 64);
        const earthOrbitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
        const earthRing = new THREE.Mesh(earthOrbitGeo, earthOrbitMat);
        earthRing.position.set(cursorX, 0, 0);
        lineupGroup.add(earthRing);

        const jupiterOrbitR = 1118 * 0.05; // 55.9 units (Inside UY Scuti!)
        if (jupiterOrbitR < visR) {
          const jupGeo = new THREE.RingGeometry(jupiterOrbitR - 0.35, jupOrbitR_plus(jupiterOrbitR), 64);
          const jupMat = new THREE.MeshBasicMaterial({ color: 0xfb923c, side: THREE.DoubleSide });
          const jupRing = new THREE.Mesh(jupGeo, jupMat);
          jupRing.position.set(cursorX, 0, 0);
          lineupGroup.add(jupRing);
        }
      }

      const sunRatio = (body.earthRatio / 109.3).toFixed(0);
      const labelScale = id === 'sun' ? 9 : id === 'betelgeuse' ? 24 : 34;
      const label = createLabelSprite(
        body.name,
        `${sunRatio}× Sun (${body.earthRatio.toLocaleString()}× Earth)`,
        body.color,
        labelScale
      );
      label.position.set(cursorX, visR + labelScale * 0.28 + 2.5, 0);
      lineupGroup.add(label);

      lineupMeshes[id] = { group: meshGroup, x: cursorX, r: Math.max(visR, 3.5), body };
      cursorX += visR + gap * 0.5;
    });
  }
}

function jupOrbitR_plus(r) {
  return r + 0.35;
}

function selectBodyInLineup(id, fly = true) {
  state.selectedBodyId = id;
  const body = BODIES.find((b) => b.id === id);
  if (!body) return;

  // Automatically switch between Planetary Stage and Stellar Titan Stage if clicking a hypergiant star vs planet
  const needsStellarTier = id === 'betelgeuse' || id === 'uyscuti';
  if (needsStellarTier && state.lineupTier !== 'stellar') {
    state.lineupTier = 'stellar';
    document.getElementById('lineup-tier-select').value = 'stellar';
    buildLineupScene();
  } else if (!needsStellarTier && id !== 'sun' && state.lineupTier !== 'planetary') {
    state.lineupTier = 'planetary';
    document.getElementById('lineup-tier-select').value = 'planetary';
    buildLineupScene();
  }

  // Update UI Inspector Card
  document.getElementById('selected-planet-name').textContent = body.name;
  document.getElementById('selected-planet-object').textContent = body.metaphors[state.metaphor];
  document.getElementById('selected-planet-desc').textContent = body.desc;
  document.getElementById('stat-diameter').textContent = `${body.diameterKm.toLocaleString()} km`;
  document.getElementById('stat-ratio').textContent =
    body.earthRatio >= 1000
      ? `${body.earthRatio.toLocaleString()}× Earth (${Math.round(body.earthRatio / 109.3).toLocaleString()}× Sun)`
      : `${body.earthRatio}× Earth`;
  document.getElementById('stat-volume').textContent = `${formatLargeNumber(body.volumeEarths)} Earths`;
  document.getElementById('stat-light').textContent = body.lightTime;

  document.querySelectorAll('.dock-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.id === id);
  });

  if (fly && state.mode === 'lineup' && lineupMeshes[id]) {
    if (id === 'sun' && state.lineupTier === 'planetary' && !state.showSunInLineup) {
      state.showSunInLineup = true;
      document.getElementById('toggle-sun-lineup').checked = true;
      if (sunLineupMesh) sunLineupMesh.visible = true;
    }
    const target = lineupMeshes[id];
    const dist = Math.max(target.r * 3.1, 3.2);
    flyCameraTo(
      new THREE.Vector3(target.x - dist * 0.12, target.r * 0.55 + 0.4, dist),
      new THREE.Vector3(target.x, 0, 0)
    );
  }
}

// ============================================================================
// 5. MODE 2: Side-by-Side "Vs." Comparator (Equator Stack & Volume Pour)
// ============================================================================
let volumeParticles = [];

function buildCompareScene() {
  compareGroup.clear();
  volumeParticles = [];

  const bodyA = BODIES.find((b) => b.id === state.compareAId);
  const bodyB = BODIES.find((b) => b.id === state.compareBId);

  const [small, large] =
    bodyA.earthRatio <= bodyB.earthRatio ? [bodyA, bodyB] : [bodyB, bodyA];

  const largeVisualR = 7.5;
  const ratio = large.earthRatio / small.earthRatio;
  const trueSmallVisualR = largeVisualR / ratio;
  const smallVisualR = Math.max(trueSmallVisualR, 0.08);

  const isVolumeMode = state.compareSubMode === 'volume';

  // Left: Smaller reference world
  const largeOffsetX = -1.5;
  const smallOffsetX = largeOffsetX - largeVisualR - Math.max(smallVisualR * 1.8, 3.4);
  const smallGroup = createBodyMesh(small, smallVisualR, false);
  smallGroup.position.set(smallOffsetX, 0, 0);
  compareGroup.add(smallGroup);

  // Add a target halo if the smaller world is tiny compared to a supergiant star
  if (trueSmallVisualR < 0.35) {
    const haloGeo = new THREE.RingGeometry(0.45, 0.62, 32);
    const haloMat = new THREE.MeshBasicMaterial({ color: small.color, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(smallOffsetX, 0, 0);
    compareGroup.add(halo);
  }

  const smallLabel = createLabelSprite(
    small.name,
    `1.0× (${small.diameterKm.toLocaleString()} km)`,
    small.color,
    4.6
  );
  smallLabel.position.set(smallOffsetX, Math.max(smallVisualR + 1.9, 2.5), 0);
  compareGroup.add(smallLabel);

  // Right: Larger target world
  const largeGroup = createBodyMesh(large, largeVisualR, isVolumeMode);
  largeGroup.position.set(largeOffsetX, 0, 0);
  compareGroup.add(largeGroup);

  const volRatio = large.volumeEarths / small.volumeEarths;
  const volFormatted = formatLargeNumber(volRatio);
  const ratioFormatted = ratio >= 100 ? Math.round(ratio).toLocaleString() : ratio.toFixed(1);

  const largeLabel = createLabelSprite(
    large.name,
    `${ratioFormatted}× wider • ${volFormatted}× volume`,
    large.color,
    6.8
  );
  largeLabel.position.set(largeOffsetX, largeVisualR + 3.0, 0);
  compareGroup.add(largeLabel);

  if (!isVolumeMode) {
    // STACK ACROSS EQUATOR
    const countAcross = Math.min(Math.max(Math.floor(ratio), 1), 120);
    const cloneR = largeVisualR / countAcross;
    const startX = largeOffsetX - largeVisualR + cloneR;
    const cloneGeo = new THREE.SphereGeometry(cloneR, 14, 10);
    const cloneMat = new THREE.MeshStandardMaterial({
      map: textureCache[small.id],
      emissive: new THREE.Color(small.color),
      emissiveIntensity: 0.4,
    });

    for (let i = 0; i < countAcross; i++) {
      const m = new THREE.Mesh(cloneGeo, cloneMat);
      m.position.set(startX + i * cloneR * 2, 0, largeVisualR + cloneR + 0.15);
      compareGroup.add(m);
    }
  } else {
    // POUR INSIDE VOLUME
    const visualCount = Math.min(Math.max(Math.round(volRatio), 1), 450);
    const cloneR = Math.max(
      Math.min((largeVisualR / Math.cbrt(visualCount)) * 0.48, smallVisualR),
      0.22
    );
    const cloneGeo = new THREE.SphereGeometry(cloneR, 14, 10);
    const cloneMat = new THREE.MeshStandardMaterial({
      map: textureCache[small.id],
      roughness: 0.4,
    });

    for (let i = 0; i < visualCount; i++) {
      const m = new THREE.Mesh(cloneGeo, cloneMat);
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const rMax = Math.max(largeVisualR - cloneR * 1.3, 0.1);
      const r = Math.cbrt(Math.random()) * rMax;
      m.position.set(
        largeOffsetX + r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      m.userData = { speed: 0.3 + Math.random() * 0.8 };
      compareGroup.add(m);
      volumeParticles.push(m);
    }
  }

  document.getElementById('compare-headline').textContent = `${large.name} vs. ${small.name}`;
  document.getElementById('compare-diameter-text').textContent = `${ratioFormatted} ${small.name}s fit across the equator`;
  document.getElementById('compare-volume-text').textContent = `By 3D volume, ${volFormatted} ${small.name}s fit inside ${large.name}! (${large.name} = ${large.metaphors[state.metaphor]} when Earth is a ${state.metaphor}).`;

  flyCameraTo(new THREE.Vector3(-1.5, 2.0, 27), new THREE.Vector3(-1.5, 0, 0));
}

// ============================================================================
// 6. MODE 3: 100-Yard Cosmic Football Field (+ Kuiper Belt & Hypergiant Shells)
// ============================================================================
let probeMesh = null;
let starEngulfGroup = null;

const SPEEDS = {
  car: { label: '🚗 Highway Car (70 mph)', kmPerHour: 112.65 },
  jet: { label: '✈️ 747 Passenger Jet (550 mph)', kmPerHour: 885.14 },
  rocket: { label: '🚀 Apollo Rocket (25,000 mph)', kmPerHour: 40233.6 },
  light: { label: '⚡ Beam of Light (186,282 mi/s)', kmPerHour: 1079252848.8 },
};

function formatTravelTime(millionKm, speedKey) {
  const totalKm = millionKm * 1e6;
  const kmPerHour = SPEEDS[speedKey].kmPerHour;
  const hours = totalKm / kmPerHour;

  if (hours < 1 / 60) return `${(hours * 3600).toFixed(1)} Seconds`;
  if (hours < 1) return `${(hours * 60).toFixed(1)} Minutes`;
  if (hours < 48) return `${hours.toFixed(1)} Hours`;
  const days = hours / 24;
  if (days < 365) return `${days.toFixed(1)} Days`;
  const years = days / 365.25;
  return `${years.toLocaleString(undefined, { maximumFractionDigits: 1 })} Years`;
}

function buildDistanceScene() {
  distanceGroup.clear();
  const scaleYard = 1.2;

  // Main 100-Yard Football Field (0 to 100 yds = Sun to Neptune)
  const fieldGeo = new THREE.PlaneGeometry(120, 24);
  fieldGeo.rotateX(-Math.PI / 2);
  const fieldMat = new THREE.MeshStandardMaterial({
    color: 0x064e3b,
    roughness: 0.9,
    transparent: true,
    opacity: 0.58,
  });
  const field = new THREE.Mesh(fieldGeo, fieldMat);
  field.position.set(60, -2.2, 0);
  distanceGroup.add(field);

  // Kuiper Belt Extension (100 to 135 yds for Pluto!)
  const kuiperGeo = new THREE.PlaneGeometry(42, 24);
  kuiperGeo.rotateX(-Math.PI / 2);
  const kuiperMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b,
    roughness: 0.9,
    transparent: true,
    opacity: 0.55,
  });
  const kuiperField = new THREE.Mesh(kuiperGeo, kuiperMat);
  kuiperField.position.set(141, -2.2, 0);
  distanceGroup.add(kuiperField);

  // Yard lines every 10 yards up to 130
  for (let yd = 0; yd <= 130; yd += 10) {
    const x = yd * scaleYard;
    const lineGeo = new THREE.BoxGeometry(0.18, 0.05, 24);
    const lineMat = new THREE.MeshBasicMaterial({
      color: yd <= 100 ? 0xa7f3d0 : 0x818cf8,
    });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(x, -2.15, 0);
    distanceGroup.add(line);

    const ydLabel = createLabelSprite(
      `${yd} yds`,
      yd === 100 ? 'Endzone' : yd > 100 ? 'Kuiper Belt' : '',
      yd <= 100 ? '#10b981' : '#818cf8',
      3.5
    );
    ydLabel.position.set(x, -1.2, 13.2);
    distanceGroup.add(ydLabel);
  }

  // Translucent Betelgeuse (11.8 yd radius) & UY Scuti (26.4 yd radius) engulfment shells centered at 0-yard Sun!
  starEngulfGroup = new THREE.Group();
  starEngulfGroup.visible = state.showStarEngulfInDist;
  distanceGroup.add(starEngulfGroup);

  const betelR = 11.8 * scaleYard;
  const betelDome = new THREE.Mesh(
    new THREE.SphereGeometry(betelR, 32, 24),
    new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.16,
      wireframe: false,
    })
  );
  starEngulfGroup.add(betelDome);
  const betelLbl = createLabelSprite('Betelgeuse Surface', 'Reaches 11.8 yds (Swallows Mars & Ceres!)', '#f97316', 5.5);
  betelLbl.position.set(betelR, 4.8, -6);
  starEngulfGroup.add(betelLbl);

  const uyR = 26.4 * scaleYard;
  const uyDome = new THREE.Mesh(
    new THREE.SphereGeometry(uyR, 32, 24),
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.12,
    })
  );
  starEngulfGroup.add(uyDome);
  const uyLbl = createLabelSprite('UY Scuti Surface', 'Reaches 26.4 yds (Swallows Jupiter!)', '#ef4444', 6.2);
  uyLbl.position.set(uyR, 6.2, -6);
  starEngulfGroup.add(uyLbl);

  // Place Solar System + Dwarf Planets (Ceres at 9.2 yds, Pluto at 131.4 yds)
  BODIES.filter(
    (b) => b.footballYards !== null && b.id !== 'moon' && b.id !== 'betelgeuse' && b.id !== 'uyscuti'
  ).forEach((body, idx) => {
    const x = body.footballYards * scaleYard;
    const visR = body.id === 'sun' ? 1.8 : Math.max(Math.log2(body.earthRatio + 1.5) * 0.45, 0.35);
    const mesh = createBodyMesh(body, visR);
    const zOffset = body.footballYards < 6 ? (idx % 2 === 0 ? -3.2 : 3.2) : 0;
    mesh.position.set(x, 0, zOffset);
    distanceGroup.add(mesh);

    const lbl = createLabelSprite(body.name, `${body.footballYards} yds`, body.color, 3.8);
    lbl.position.set(
      x,
      visR + 2.0 + (body.footballYards < 6 ? (idx % 3) * 1.3 : 0),
      zOffset
    );
    distanceGroup.add(lbl);
  });

  // Glowing Travel Probe Marker
  const probeGeo = new THREE.ConeGeometry(0.65, 2.0, 16);
  probeGeo.rotateZ(-Math.PI / 2);
  const probeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  probeMesh = new THREE.Mesh(probeGeo, probeMat);
  distanceGroup.add(probeMesh);

  updateJourneyPosition(state.journeyYards, true);
}

function updateJourneyPosition(yards, moveCam = false) {
  state.journeyYards = Math.max(0, Math.min(132, yards));
  const scaleYard = 1.2;
  const x = state.journeyYards * scaleYard;

  if (probeMesh) {
    probeMesh.position.set(x, 0, 0);
  }

  const fieldBodies = BODIES.filter(
    (b) => b.footballYards !== null && b.id !== 'moon' && b.id !== 'betelgeuse' && b.id !== 'uyscuti'
  );
  let nearest = fieldBodies[0];
  let minDiff = Infinity;
  fieldBodies.forEach((p) => {
    const d = Math.abs(p.footballYards - state.journeyYards);
    if (d < minDiff) {
      minDiff = d;
      nearest = p;
    }
  });

  const currentMillionKm = (state.journeyYards / 100) * 4495.0;
  const travelStr = formatTravelTime(currentMillionKm, state.speedMode);

  document.getElementById('journey-slider').value = state.journeyYards;
  document.getElementById('yard-readout').textContent = `${state.journeyYards.toFixed(1)} yds (${Math.round(currentMillionKm).toLocaleString()}M km)`;
  document.getElementById('dist-nearest-name').textContent = `Closest Marker: ${nearest.name} (${nearest.footballYards} yds)`;
  document.getElementById('dist-travel-time').textContent = `${SPEEDS[state.speedMode].label.split(' ')[0]} ${travelStr} from the Sun`;

  if (state.journeyYards > 100) {
    document.getElementById('dist-yard-analogy').textContent =
      `You have passed Neptune's 100-yard goal line into the Kuiper Belt! Pluto orbits out at 131.4 yards—31 yards into the stadium parking lot!`;
  } else if (state.journeyYards <= 26.4) {
    document.getElementById('dist-yard-analogy').textContent =
      `At ${state.journeyYards.toFixed(1)} yards, you are STILL INSIDE the red hypergiant star UY Scuti (26.4 yds) if it replaced our Sun at the goal line!`;
  } else {
    document.getElementById('dist-yard-analogy').textContent =
      `At ${state.journeyYards.toFixed(1)} yards (${Math.round(currentMillionKm).toLocaleString()} million km), even a beam of light takes ${formatTravelTime(currentMillionKm, 'light')} from the Sun!`;
  }

  if (moveCam && state.mode === 'distance') {
    flyCameraTo(new THREE.Vector3(x - 6, 8.5, 22), new THREE.Vector3(x + 4, 0, 0));
  }
}

// ============================================================================
// 7. Wire Up UI Tabs, Selectors, Dock & 3D Raycasting
// ============================================================================
function setMode(newMode) {
  state.mode = newMode;
  state.autoFlying = false;

  document.querySelectorAll('.mode-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.mode === newMode);
  });

  document.getElementById('panel-lineup').classList.toggle('hidden', newMode !== 'lineup');
  document.getElementById('panel-compare').classList.toggle('hidden', newMode !== 'compare');
  document.getElementById('panel-distance').classList.toggle('hidden', newMode !== 'distance');

  lineupGroup.visible = newMode === 'lineup';
  compareGroup.visible = newMode === 'compare';
  distanceGroup.visible = newMode === 'distance';

  if (newMode === 'lineup') {
    selectBodyInLineup(state.selectedBodyId, true);
  } else if (newMode === 'compare') {
    buildCompareScene();
  } else if (newMode === 'distance') {
    updateJourneyPosition(state.journeyYards, true);
  }
}

document.querySelectorAll('.mode-tab').forEach((tab) => {
  tab.addEventListener('click', () => setMode(tab.dataset.mode));
});

// Build Bottom Planet Dock & Compare Selectors
const dockEl = document.getElementById('planet-dock');
const selectA = document.getElementById('compare-a');
const selectB = document.getElementById('compare-b');

BODIES.forEach((b) => {
  const btn = document.createElement('button');
  btn.className = `dock-item ${b.id === state.selectedBodyId ? 'active' : ''}`;
  btn.dataset.id = b.id;
  btn.innerHTML = `<span class="dock-dot" style="background:${b.color}"></span>${b.name}`;
  btn.addEventListener('click', () => {
    if (state.mode === 'lineup') {
      selectBodyInLineup(b.id, true);
    } else if (state.mode === 'compare') {
      state.compareBId = b.id;
      selectB.value = b.id;
      buildCompareScene();
    } else if (state.mode === 'distance') {
      state.autoFlying = false;
      if (b.footballYards !== null) {
        updateJourneyPosition(b.footballYards, true);
      }
    }
  });
  dockEl.appendChild(btn);

  selectA.add(new Option(`${b.name} (${b.earthRatio}× Earth)`, b.id, false, b.id === state.compareAId));
  selectB.add(new Option(`${b.name} (${b.earthRatio}× Earth)`, b.id, false, b.id === state.compareBId));
});

// Mode 1 listeners
document.getElementById('lineup-tier-select').addEventListener('change', (e) => {
  state.lineupTier = e.target.value;
  buildLineupScene();
  if (state.lineupTier === 'stellar' && state.selectedBodyId !== 'betelgeuse' && state.selectedBodyId !== 'uyscuti') {
    selectBodyInLineup('uyscuti', true);
  } else if (state.lineupTier === 'planetary' && (state.selectedBodyId === 'betelgeuse' || state.selectedBodyId === 'uyscuti')) {
    selectBodyInLineup('jupiter', true);
  } else {
    selectBodyInLineup(state.selectedBodyId, true);
  }
});

document.getElementById('metaphor-select').addEventListener('change', (e) => {
  state.metaphor = e.target.value;
  selectBodyInLineup(state.selectedBodyId, false);
});

document.getElementById('toggle-sun-lineup').addEventListener('change', (e) => {
  state.showSunInLineup = e.target.checked;
  if (sunLineupMesh) sunLineupMesh.visible = state.showSunInLineup;
});

// Mode 2 listeners
selectA.addEventListener('change', (e) => {
  state.compareAId = e.target.value;
  buildCompareScene();
});
selectB.addEventListener('change', (e) => {
  state.compareBId = e.target.value;
  buildCompareScene();
});

document.querySelectorAll('.chip-btn').forEach((chip) => {
  chip.addEventListener('click', () => {
    state.compareAId = chip.dataset.a;
    state.compareBId = chip.dataset.b;
    selectA.value = state.compareAId;
    selectB.value = state.compareBId;
    buildCompareScene();
  });
});

document.getElementById('btn-stack-equator').addEventListener('click', () => {
  state.compareSubMode = 'equator';
  buildCompareScene();
});
document.getElementById('btn-fill-volume').addEventListener('click', () => {
  state.compareSubMode = 'volume';
  buildCompareScene();
});

// Mode 3 listeners
document.getElementById('toggle-star-engulf').addEventListener('change', (e) => {
  state.showStarEngulfInDist = e.target.checked;
  if (starEngulfGroup) starEngulfGroup.visible = state.showStarEngulfInDist;
});
document.getElementById('speed-select').addEventListener('change', (e) => {
  state.speedMode = e.target.value;
  updateJourneyPosition(state.journeyYards, false);
});
document.getElementById('journey-slider').addEventListener('input', (e) => {
  state.autoFlying = false;
  updateJourneyPosition(parseFloat(e.target.value), true);
});
document.getElementById('btn-play-journey').addEventListener('click', () => {
  if (state.journeyYards >= 131) state.journeyYards = 0;
  state.autoFlying = !state.autoFlying;
  document.getElementById('btn-play-journey').textContent = state.autoFlying
    ? '⏸ Pause Flight'
    : '▶ Auto-Fly Outward';
});
document.getElementById('btn-reset-journey').addEventListener('click', () => {
  state.autoFlying = false;
  document.getElementById('btn-play-journey').textContent = '▶ Auto-Fly Outward';
  updateJourneyPosition(0, true);
});

// 3D Click/Tap Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downPos = { x: 0, y: 0 };

window.addEventListener('pointerdown', (e) => {
  downPos = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointerup', (e) => {
  if (e.target !== renderer.domElement) return;
  if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 8) return;

  if (state.mode === 'lineup') {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(lineupGroup.children, true);
    const hitBody = hits.find((h) => h.object.userData && h.object.userData.bodyId);
    if (hitBody) {
      selectBodyInLineup(hitBody.object.userData.bodyId, true);
    }
  }
});

// Build all scenes initially
buildLineupScene();
buildCompareScene();
buildDistanceScene();
setMode('lineup');

// ============================================================================
// Desktop (Electron IPC) & Web Export Handlers
// ============================================================================
const desktopStatusEl = document.getElementById('desktop-status');

function showStatus(msg) {
  if (!desktopStatusEl) return;
  desktopStatusEl.textContent = msg;
  setTimeout(() => {
    if (desktopStatusEl.textContent === msg) desktopStatusEl.textContent = '';
  }, 4000);
}

async function handleSaveScreenshot() {
  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL('image/png');
  const defaultName = `cosmic-scale-${state.mode}-${state.selectedBodyId}.png`;

  if (window.desktopAPI && window.desktopAPI.isDesktop) {
    const res = await window.desktopAPI.saveScreenshot(dataUrl, defaultName);
    if (res && res.saved) {
      showStatus(`Saved PNG to disk!`);
    }
  } else {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = defaultName;
    a.click();
    showStatus('Downloaded 3D Snapshot PNG!');
  }
}

async function handleExportJson() {
  const selected = BODIES.find((b) => b.id === state.selectedBodyId);
  const reportObj = {
    app: 'Cosmic Scale Studio 3D',
    timestamp: new Date().toISOString(),
    activeMode: state.mode,
    referenceMetaphor: state.metaphor,
    selectedBody: selected,
    comparison: {
      smallerWorld: state.compareAId,
      targetWorld: state.compareBId,
      subMode: state.compareSubMode,
    },
    footballFieldJourney: {
      currentYards: state.journeyYards,
      vehicleSpeed: state.speedMode,
    },
  };
  const defaultName = `cosmic-scale-report-${state.selectedBodyId}.json`;

  if (window.desktopAPI && window.desktopAPI.isDesktop) {
    const res = await window.desktopAPI.exportScaleReport(reportObj, defaultName);
    if (res && res.saved) {
      showStatus(`Saved JSON Report to disk!`);
    }
  } else {
    const blob = new Blob([JSON.stringify(reportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultName;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Downloaded Scale Report JSON!');
  }
}

document.getElementById('btn-save-png')?.addEventListener('click', handleSaveScreenshot);
document.getElementById('btn-export-json')?.addEventListener('click', handleExportJson);

if (window.desktopAPI && window.desktopAPI.onMenuAction) {
  window.desktopAPI.onMenuAction((action) => {
    if (action === 'save-png') handleSaveScreenshot();
    else if (action === 'export-json') handleExportJson();
    else if (action === 'mode-lineup') setMode('lineup');
    else if (action === 'mode-compare') setMode('compare');
    else if (action === 'mode-distance') setMode('distance');
  });
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================================
// 8. Main Animation Loop
// ============================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  if (camFlight.active) {
    camera.position.lerp(camFlight.pos, Math.min(dt * 4.5, 0.25));
    controls.target.lerp(camFlight.look, Math.min(dt * 4.5, 0.25));
    if (camera.position.distanceTo(camFlight.pos) < 0.08) {
      camFlight.active = false;
    }
  }

  if (state.mode === 'lineup') {
    Object.values(lineupMeshes).forEach(({ group, body }) => {
      if (body.id !== 'sun') {
        group.rotation.y += dt * 0.25;
      }
    });
  } else if (state.mode === 'compare') {
    volumeParticles.forEach((p) => {
      p.rotation.y += dt * p.userData.speed;
    });
  } else if (state.mode === 'distance' && state.autoFlying) {
    const nextYards = state.journeyYards + dt * 7.5;
    if (nextYards >= 131.4) {
      updateJourneyPosition(131.4, true);
      state.autoFlying = false;
      document.getElementById('btn-play-journey').textContent = '▶ Auto-Fly Outward';
    } else {
      updateJourneyPosition(nextYards, true);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
