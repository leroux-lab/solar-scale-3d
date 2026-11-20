import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BODIES, createPlanetMaps, createSaturnRingTexture } from './planetsData.js';

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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
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

// Automatically steps the camera back on vertical portrait mobile screens so planets fit above the bottom card
function getMobilePortraitBoost() {
  const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
  return aspect < 1.0 ? Math.min(2.1, 1.0 / Math.max(aspect, 0.45)) : 1.0;
}

let userHasInteracted = false;
window.addEventListener('pointerdown', (e) => {
  userHasInteracted = true;
  if (e.target === renderer.domElement) {
    camFlight.active = false;
  }
});

// ============================================================================
// 2. Lighting, Multi-Temperature Starfield & Procedural Asset Cache
// ============================================================================
const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.48);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.45);
dirLight.position.set(-40, 32, 48);
scene.add(dirLight);

const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
rimLight.position.set(35, -18, -40);
scene.add(rimLight);

function createStarfield() {
  const starGeo = new THREE.BufferGeometry();
  const count = 3200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color(0xe2e8f0),
    new THREE.Color(0xbae6fd),
    new THREE.Color(0xfef3c7),
    new THREE.Color(0xfecdd3),
  ];

  for (let i = 0; i < count; i++) {
    const r = 460 + Math.random() * 680;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = palette[i % palette.length];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const starMat = new THREE.PointsMaterial({
    size: 1.45,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
  });
  scene.add(new THREE.Points(starGeo, starMat));
}
createStarfield();

// Cache PBR texture maps
const mapsCache = {};
BODIES.forEach((b) => {
  mapsCache[b.id] = createPlanetMaps(b.id);
});
const saturnRingTex = createSaturnRingTexture();

function formatLargeNumber(num) {
  if (num >= 1e15) return `${(num / 1e15).toFixed(2)} Quadrillion`;
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)} Trillion`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)} Billion`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)} Million`;
  if (num >= 100) return Math.round(num).toLocaleString();
  if (num >= 1) return num.toFixed(2);
  return num.toFixed(4);
}

function createAtmosphereHalo(radius, colorHex, intensity = 0.65) {
  const geo = new THREE.SphereGeometry(radius * 1.065, 48, 32);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(colorHex) },
      intensity: { value: intensity },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float fresnel = pow(max(0.0, 0.72 - dot(-vNormal, vViewDir)), 3.0);
        gl_FragColor = vec4(glowColor, fresnel * intensity);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

function createRadialScaleGrid(maxRadius, ringCount = 6, colorHex = 0x1e3a8a) {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.42,
  });

  for (let i = 1; i <= ringCount; i++) {
    const r = (maxRadius / ringCount) * i;
    const pts = [];
    for (let a = 0; a <= 96; a++) {
      const ang = (a / 96) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(ang) * r, 0, Math.sin(ang) * r));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  }

  // Subtle crosshairs
  const axisPts = [
    new THREE.Vector3(-maxRadius, 0, 0),
    new THREE.Vector3(maxRadius, 0, 0),
    new THREE.Vector3(0, 0, -maxRadius),
    new THREE.Vector3(0, 0, maxRadius),
  ];
  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(axisPts), mat));
  return group;
}

function createBodyMesh(body, radius, isTranslucent = false) {
  const group = new THREE.Group();
  const geo = new THREE.SphereGeometry(radius, 64, 48);
  const maps = mapsCache[body.id];

  let mat;
  if (body.category === 'star') {
    mat = new THREE.MeshBasicMaterial({
      map: maps.map,
      transparent: isTranslucent,
      opacity: isTranslucent ? 0.35 : 1.0,
    });
  } else {
    mat = new THREE.MeshStandardMaterial({
      map: maps.map,
      bumpMap: maps.bumpMap,
      bumpScale: radius * 0.025,
      roughnessMap: maps.roughnessMap,
      roughness: 0.85,
      metalness: 0.06,
      transparent: isTranslucent,
      opacity: isTranslucent ? 0.35 : 1.0,
    });
  }

  const sphere = new THREE.Mesh(geo, mat);
  sphere.userData = { bodyId: body.id };
  group.add(sphere);

  let cloudSphere = null;
  if (maps.cloudMap && !isTranslucent) {
    const cloudGeo = new THREE.SphereGeometry(radius * 1.016, 48, 32);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: maps.cloudMap,
      transparent: true,
      opacity: 0.85,
      roughness: 0.9,
      depthWrite: false,
    });
    cloudSphere = new THREE.Mesh(cloudGeo, cloudMat);
    group.add(cloudSphere);
  }

  if (body.atmosphereColor && !isTranslucent) {
    const intensity = body.category === 'star' ? 0.85 : 0.62;
    group.add(createAtmosphereHalo(radius, body.atmosphereColor, intensity));
  }

  // Add radial UV-mapped rings for Saturn and Uranus
  if (body.id === 'saturn') {
    const innerR = radius * 1.32;
    const outerR = radius * 2.35;
    const ringGeo = new THREE.RingGeometry(innerR, outerR, 96);
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const t = (v3.length() - innerR) / (outerR - innerR);
      uv.setXY(i, t, 0.5);
    }
    ringGeo.rotateX(Math.PI / 2.2);
    const ringMat = new THREE.MeshStandardMaterial({
      map: saturnRingTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isTranslucent ? 0.25 : 0.9,
      roughness: 0.75,
      depthWrite: false,
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

  group.userData = { body, radius, sphere, cloudSphere };
  return group;
}

function createLabelSprite(text, subtext = '', color = '#38bdf8', scale = 4) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(10, 14, 26, 0.84)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(16, 16, 608, 128, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 38px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 320, subtext ? 72 : 94, 568);

  if (subtext) {
    ctx.fillStyle = color;
    ctx.font = '600 26px system-ui, sans-serif';
    ctx.fillText(subtext, 320, 118, 568);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scale * 1.15, scale * 1.15 * (160 / 640), 1);
  return sprite;
}

// ============================================================================
// 3. Mode Groups & Application State
// ============================================================================
const lineupGroup = new THREE.Group();
const compareGroup = new THREE.Group();

scene.add(lineupGroup);
scene.add(compareGroup);

const METAPHOR_EARTH_CM = {
  marble: 1.5,
  tennis: 6.7,
  basketball: 24.0,
};

const state = {
  mode: 'lineup', // 'lineup' | 'compare'
  lineupTier: 'planetary', // 'planetary' | 'stellar'
  metaphor: 'marble', // 'marble' | 'tennis' | 'basketball'
  selectedBodyId: 'earth',
  showSunInLineup: true,
  showScaleRuler: true,
  compareAId: 'earth',
  compareBId: 'jupiter',
  compareView: 'side', // 'side' | 'concentric' | 'volume'
  volumeFill: 100,
  hudHidden: false,
};

// ============================================================================
// 4. MODE 1: Everyday Object Scale (Planetary Stage & Stellar Titan Stage)
// ============================================================================
let lineupMeshes = {};
let sunLineupMesh = null;
let rulerGroup = null;

function buildScaleRuler() {
  if (rulerGroup) {
    lineupGroup.remove(rulerGroup);
    rulerGroup = null;
  }
  if (state.lineupTier !== 'planetary' || !state.showScaleRuler) return;

  rulerGroup = new THREE.Group();
  // 1 Earth diameter = 2.0 3D units = METAPHOR_EARTH_CM[state.metaphor] cm
  const earthDiamCm = METAPHOR_EARTH_CM[state.metaphor];
  const unitsPerCm = 2.0 / earthDiamCm;

  const tickMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45,
  });

  // Floor baseline at z = 6
  const startX = -26;
  const endX = 115;
  const y = -22.8;
  const z = 7;

  const baseLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(startX, y, z),
      new THREE.Vector3(endX, y, z),
    ]),
    tickMat
  );
  rulerGroup.add(baseLine);

  const markersCm =
    state.metaphor === 'marble'
      ? [10, 25, 50, 75]
      : state.metaphor === 'tennis'
      ? [50, 100, 200, 300]
      : [100, 300, 600, 1000];

  markersCm.forEach((cm) => {
    const x = startX + cm * unitsPerCm;
    if (x > endX) return;
    const tick = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, y, z - 1.5),
        new THREE.Vector3(x, y, z + 1.5),
      ]),
      tickMat
    );
    rulerGroup.add(tick);
    const labelText = cm >= 100 ? `${(cm / 100).toFixed(1)} m` : `${cm} cm`;
    const sprite = createLabelSprite(labelText, 'Scale Ruler', '#7dd3fc', 3.6);
    sprite.position.set(x, y + 1.8, z + 1.5);
    rulerGroup.add(sprite);
  });

  lineupGroup.add(rulerGroup);
}

function buildLineupScene() {
  lineupGroup.clear();
  lineupMeshes = {};
  sunLineupMesh = null;
  rulerGroup = null;

  document.getElementById('sun-toggle-row').style.display =
    state.lineupTier === 'planetary' ? 'block' : 'none';
  document.getElementById('ruler-toggle-row').style.display =
    state.lineupTier === 'planetary' ? 'block' : 'none';

  if (state.lineupTier === 'planetary') {
    const grid = new THREE.GridHelper(280, 70, 0x1e3a8a, 0x0b132b);
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
      const r = body.earthRatio;
      const gap = r < 1.2 ? 2.6 : r * 1.35 + 3.2;
      cursorX += r + gap * 0.5;

      const meshGroup = createBodyMesh(body, r);
      meshGroup.position.set(cursorX, 0, 0);
      lineupGroup.add(meshGroup);

      const ringGeo = new THREE.RingGeometry(Math.max(r * 1.15, 0.35), Math.max(r * 1.32, 0.5), 32);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: body.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
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

    const sunBody = BODIES.find((b) => b.id === 'sun');
    const sunR = sunBody.earthRatio;
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

    buildScaleRuler();
  } else {
    const scaleFactor = 0.05 / 109.3;
    const grid = new THREE.GridHelper(420, 70, 0x7c2d12, 0x1e1b4b);
    grid.position.y = -90;
    lineupGroup.add(grid);

    let cursorX = -65;
    const starOrder = ['sun', 'betelgeuse', 'uyscuti'];

    starOrder.forEach((id) => {
      const body = BODIES.find((b) => b.id === id);
      const trueR = body.earthRatio * scaleFactor;
      const visR = Math.max(trueR, 0.12);
      const gap = visR < 2 ? 14 : 26;
      cursorX += visR + gap * 0.5;

      const meshGroup = createBodyMesh(body, visR, id !== 'sun');
      meshGroup.position.set(cursorX, 0, 0);
      lineupGroup.add(meshGroup);

      if (id === 'sun') {
        const haloGeo = new THREE.RingGeometry(0.9, 1.25, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.set(cursorX, 0, 0);
        lineupGroup.add(halo);
      }

      if (id === 'betelgeuse' || id === 'uyscuti') {
        const earthOrbitR = 215 * 0.05;
        const earthOrbitGeo = new THREE.RingGeometry(earthOrbitR - 0.25, earthOrbitR + 0.25, 64);
        const earthOrbitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
        const earthRing = new THREE.Mesh(earthOrbitGeo, earthOrbitMat);
        earthRing.position.set(cursorX, 0, 0);
        lineupGroup.add(earthRing);

        const jupiterOrbitR = 1118 * 0.05;
        if (jupiterOrbitR < visR) {
          const jupGeo = new THREE.RingGeometry(jupiterOrbitR - 0.35, jupiterOrbitR + 0.35, 64);
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

function updateArenaButtons() {
  document.querySelectorAll('#arena-segmented .seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tier === state.lineupTier);
  });
}

function selectBodyInLineup(id, fly = true) {
  state.selectedBodyId = id;
  const body = BODIES.find((b) => b.id === id);
  if (!body) return;

  if (fly && userHasInteracted && navigator.vibrate) {
    try { navigator.vibrate(12); } catch {}
  }

  const needsStellarTier = id === 'betelgeuse' || id === 'uyscuti';
  if (needsStellarTier && state.lineupTier !== 'stellar') {
    state.lineupTier = 'stellar';
    updateArenaButtons();
    buildLineupScene();
  } else if (!needsStellarTier && id !== 'sun' && state.lineupTier !== 'planetary') {
    state.lineupTier = 'planetary';
    updateArenaButtons();
    buildLineupScene();
  }

  const areaRatio = body.earthRatio * body.earthRatio;
  document.getElementById('selected-planet-name').textContent = body.name;
  document.getElementById('selected-planet-object').textContent = body.metaphors[state.metaphor];
  document.getElementById('selected-planet-desc').textContent = body.desc;
  document.getElementById('stat-diameter').textContent = `${body.diameterKm.toLocaleString()} km`;
  document.getElementById('stat-ratio').textContent =
    body.earthRatio >= 1000
      ? `${body.earthRatio.toLocaleString()}× Earth (${Math.round(body.earthRatio / 109.3).toLocaleString()}× Sun)`
      : `${body.earthRatio}× Earth`;
  document.getElementById('stat-area').textContent = `${formatLargeNumber(areaRatio)}× Earth`;
  document.getElementById('stat-gravity').textContent = `${body.gravityG}g`;

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
    const boost = getMobilePortraitBoost();
    const isDesktop = window.innerWidth > 820;
    const dist = Math.max(target.r * (boost > 1.1 ? 4.3 : 3.65), boost > 1.1 ? 4.3 : 3.6) * boost;
    const xOffset = isDesktop ? target.r * 0.28 : 0;
    const yLookOffset = boost > 1.1 ? target.r * 0.65 : target.r * 0.14;
    flyCameraTo(
      new THREE.Vector3(target.x + xOffset - dist * 0.08, target.r * 0.55 + 0.6, dist),
      new THREE.Vector3(target.x + xOffset, yLookOffset, 0)
    );
  }
}

// ============================================================================
// 5. MODE 2: Size & Scale Comparison (Side-by-Side, Concentric & Volume Fit)
// ============================================================================
let compareMeshes = [];
let volumeInstancedMesh = null;
let volumeTotalCount = 0;

function generatePackedPositions(shellR, sphereR, maxCount = 1000) {
  const usableR = Math.max(shellR - sphereR * 1.05, 0);
  if (usableR < sphereR * 0.2) {
    return [new THREE.Vector3(0, 0, 0)];
  }

  const d = sphereR * 2.02; // slight spacing for visual clarity
  const dy = d * Math.sqrt(2 / 3);
  const dz = d * (Math.sqrt(3) / 2);
  const pts = [];

  const maxLayers = Math.ceil(usableR / dy);
  for (let ly = -maxLayers; ly <= maxLayers; ly++) {
    const y = ly * dy;
    if (Math.abs(y) > usableR) continue;
    const layerR = Math.sqrt(Math.max(0, usableR * usableR - y * y));
    const maxRows = Math.ceil(layerR / dz);
    const yOffsetX = Math.abs(ly) % 2 === 1 ? d * 0.5 : 0;
    const yOffsetZ = Math.abs(ly) % 2 === 1 ? dz / 3 : 0;

    for (let lz = -maxRows; lz <= maxRows; lz++) {
      const z = lz * dz + yOffsetZ;
      if (z * z + y * y > usableR * usableR) continue;
      const rowOffsetX = Math.abs(lz) % 2 === 1 ? d * 0.5 : 0;
      const maxCols = Math.ceil(layerR / d);

      for (let lx = -maxCols; lx <= maxCols; lx++) {
        const x = lx * d + rowOffsetX + yOffsetX;
        if (x * x + y * y + z * z <= usableR * usableR) {
          pts.push(new THREE.Vector3(x, y, z));
        }
      }
    }
  }

  // Sort bottom-to-top so the Fill Level slider pours cleanly from the bottom pole upward
  pts.sort((a, b) => a.y - b.y || (a.x * a.x + a.z * a.z) - (b.x * b.x + b.z * b.z));

  if (pts.length > maxCount) {
    // Evenly subsample across height so 0%->100% fill still spans the full sphere
    const step = pts.length / maxCount;
    const sampled = [];
    for (let i = 0; i < maxCount; i++) {
      sampled.push(pts[Math.floor(i * step)]);
    }
    return sampled;
  }
  return pts.length > 0 ? pts : [new THREE.Vector3(0, 0, 0)];
}

function updateVolumeFill() {
  const valEl = document.getElementById('volume-fill-val');
  if (valEl) valEl.textContent = `${state.volumeFill}%`;
  if (volumeInstancedMesh) {
    volumeInstancedMesh.count = Math.round((state.volumeFill / 100) * volumeTotalCount);
  }
}

function buildCompareScene() {
  compareGroup.clear();
  compareMeshes = [];
  volumeInstancedMesh = null;
  volumeTotalCount = 0;

  const bodyA = BODIES.find((b) => b.id === state.compareAId);
  const bodyB = BODIES.find((b) => b.id === state.compareBId);
  if (!bodyA || !bodyB) return;

  const [small, large] =
    bodyA.earthRatio <= bodyB.earthRatio ? [bodyA, bodyB] : [bodyB, bodyA];

  const largeVisualR = 7.5;
  const ratio = large.earthRatio / small.earthRatio;
  const smallVisualR = Math.max(largeVisualR / ratio, 0.08);
  const areaRatio = ratio * ratio;
  const volumeRatio = ratio * ratio * ratio;
  const packedEstimate = Math.max(1, Math.floor(volumeRatio * 0.74));
  const massRatio = large.massEarths / Math.max(small.massEarths, 1e-6);

  // Radial blueprint grid underneath
  const radialGrid = createRadialScaleGrid(22, 6, 0x1e3a8a);
  radialGrid.position.y = -largeVisualR - 1.4;
  compareGroup.add(radialGrid);

  if (state.compareView === 'side') {
    const gap = 3.2;
    const largeX = smallVisualR + gap * 0.5;
    const smallX = -(largeVisualR + gap * 0.5);

    const largeMesh = createBodyMesh(large, largeVisualR, false);
    largeMesh.position.set(largeX, 0, 0);
    compareGroup.add(largeMesh);
    compareMeshes.push(largeMesh);

    const smallMesh = createBodyMesh(small, smallVisualR, false);
    smallMesh.position.set(smallX, 0, 0);
    compareGroup.add(smallMesh);
    compareMeshes.push(smallMesh);

    // Architectural diameter callout line above the pair
    const callY = largeVisualR + 1.4;
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
    const callPts = [
      new THREE.Vector3(largeX - largeVisualR, callY, 0),
      new THREE.Vector3(largeX + largeVisualR, callY, 0),
    ];
    compareGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(callPts), lineMat));

    const largeLabel = createLabelSprite(large.name, `${large.diameterKm.toLocaleString()} km`, large.color, 6.0);
    largeLabel.position.set(largeX, largeVisualR + 2.8, 0);
    compareGroup.add(largeLabel);

    const smallLabel = createLabelSprite(
      small.name,
      `${small.diameterKm.toLocaleString()} km`,
      small.color,
      4.8
    );
    smallLabel.position.set(smallX, Math.max(smallVisualR, 1.0) + 2.1, 0);
    compareGroup.add(smallLabel);

    const ratioBadge = createLabelSprite(`${ratio.toFixed(2)}× Wider`, `${small.name} → ${large.name}`, '#38bdf8', 5.2);
    ratioBadge.position.set(0, -largeVisualR - 0.1, 3.5);
    compareGroup.add(ratioBadge);
  } else if (state.compareView === 'concentric') {
    // Concentric / Silhouette Overlay
    const largeMesh = createBodyMesh(large, largeVisualR, false);
    largeMesh.position.set(0, 0, 0);
    compareGroup.add(largeMesh);
    compareMeshes.push(largeMesh);

    const smallMesh = createBodyMesh(small, smallVisualR, false);
    smallMesh.position.set(0, 0, largeVisualR + smallVisualR + 0.35);
    compareGroup.add(smallMesh);
    compareMeshes.push(smallMesh);

    // Glowing concentric reference ring across the face of the larger world
    const ringGeo = new THREE.RingGeometry(
      Math.max(smallVisualR * 0.96, 0.12),
      Math.max(smallVisualR * 1.06, 0.22),
      64
    );
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const overlayRing = new THREE.Mesh(ringGeo, ringMat);
    overlayRing.position.set(0, 0, largeVisualR + 0.12);
    compareGroup.add(overlayRing);

    const centerLabel = createLabelSprite(
      `${small.name} inside ${large.name}`,
      `${ratio.toFixed(2)}× Diameter • ${formatLargeNumber(areaRatio)}× Area`,
      '#38bdf8',
      6.4
    );
    centerLabel.position.set(0, largeVisualR + 2.5, 0);
    compareGroup.add(centerLabel);
  } else {
    // Volume Fit ("How Many Fit Inside?") — Fresnel Glass Shell + GPU Instanced HCP Lattice
    const shellGroup = new THREE.Group();

    // Translucent glass shell
    const glassGeo = new THREE.SphereGeometry(largeVisualR, 64, 48);
    const glassMat = new THREE.MeshStandardMaterial({
      map: mapsCache[large.id].map,
      transparent: true,
      opacity: 0.16,
      roughness: 0.18,
      metalness: 0.1,
      depthWrite: false,
    });
    shellGroup.add(new THREE.Mesh(glassGeo, glassMat));

    // Glowing Fresnel atmosphere rim
    shellGroup.add(
      createAtmosphereHalo(largeVisualR, large.atmosphereColor || large.color, 0.88)
    );

    // Subtle equator & meridian wireframe arcs for glass architectural depth
    const arcMat = new THREE.LineBasicMaterial({
      color: large.color,
      transparent: true,
      opacity: 0.35,
    });
    const makeCircle = (axis) => {
      const pts = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        if (axis === 'eq') pts.push(new THREE.Vector3(Math.cos(a) * largeVisualR, 0, Math.sin(a) * largeVisualR));
        else pts.push(new THREE.Vector3(Math.cos(a) * largeVisualR, Math.sin(a) * largeVisualR, 0));
      }
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMat);
    };
    shellGroup.add(makeCircle('eq'));
    shellGroup.add(makeCircle('meridian'));

    // Packed miniature spheres inside the shell
    const packedSphereR = Math.max(smallVisualR, 0.26);
    const positions = generatePackedPositions(largeVisualR * 0.96, packedSphereR, 1000);
    volumeTotalCount = positions.length;

    const miniGeo = new THREE.SphereGeometry(packedSphereR, 20, 14);
    const miniMat =
      small.category === 'star'
        ? new THREE.MeshBasicMaterial({ map: mapsCache[small.id].map })
        : new THREE.MeshStandardMaterial({
            map: mapsCache[small.id].map,
            roughness: 0.55,
            metalness: 0.08,
          });

    volumeInstancedMesh = new THREE.InstancedMesh(miniGeo, miniMat, volumeTotalCount);
    const dummy = new THREE.Object3D();
    positions.forEach((pos, idx) => {
      dummy.position.copy(pos);
      dummy.rotation.set(0, (idx * 0.618) % (Math.PI * 2), 0);
      dummy.updateMatrix();
      volumeInstancedMesh.setMatrixAt(idx, dummy.matrix);
    });
    volumeInstancedMesh.instanceMatrix.needsUpdate = true;
    shellGroup.add(volumeInstancedMesh);

    compareGroup.add(shellGroup);
    compareMeshes.push(shellGroup);
    updateVolumeFill();

    const smallPlural = `${small.name.replace(/^The\s+/i, '').replace(/\s*\([^)]*\)/g, '')}s`;
    const largeShort = large.name.replace(/\s*\([^)]*\)/g, '');
    const isSampled = volumeRatio > 1000;
    const badgeSub = isSampled
      ? `~${formatLargeNumber(packedEstimate)} intact • ${volumeTotalCount.toLocaleString()}-sphere sample`
      : `~${formatLargeNumber(packedEstimate)} intact spheres (74% packing)`;
    const volLabel = createLabelSprite(
      `${formatLargeNumber(volumeRatio)} ${smallPlural} fit inside ${largeShort}`,
      badgeSub,
      '#38bdf8',
      7.4
    );
    volLabel.position.set(0, largeVisualR + 2.6, 0);
    compareGroup.add(volLabel);
  }

  // Show/hide Fill Level slider
  const fillCtrl = document.getElementById('volume-fill-control');
  if (fillCtrl) fillCtrl.classList.toggle('hidden', state.compareView !== 'volume');

  // Update Inspector Readout & Visual Comparison Bars
  document.getElementById('compare-headline').textContent = `${large.name} vs. ${small.name}`;
  if (state.compareView === 'volume') {
    document.getElementById('compare-diameter-text').textContent =
      volumeRatio < 1.05
        ? 'Nearly Identical Volume'
        : `${formatLargeNumber(volumeRatio)}× Volume (~${formatLargeNumber(packedEstimate)} intact)`;
  } else {
    document.getElementById('compare-diameter-text').textContent =
      ratio < 1.05 ? 'Nearly Identical Width' : `${formatLargeNumber(ratio)}× Wider`;
  }

  document.getElementById('cmp-diam-val').textContent = `${formatLargeNumber(ratio)}×`;
  document.getElementById('cmp-area-val').textContent = `${formatLargeNumber(areaRatio)}×`;
  document.getElementById('cmp-vol-val').textContent = `${formatLargeNumber(volumeRatio)}×`;
  document.getElementById('cmp-mass-val').textContent = `${formatLargeNumber(massRatio)}×`;

  // Log-scaled progress bars so both 1.8x and 1,000,000x differences read cleanly
  const logPct = (val) => `${Math.min(100, Math.max(12, (Math.log10(Math.max(val, 1)) / 6) * 100))}%`;
  document.getElementById('cmp-diam-bar').style.width = logPct(ratio);
  document.getElementById('cmp-area-bar').style.width = logPct(areaRatio);
  document.getElementById('cmp-vol-bar').style.width = logPct(volumeRatio);
  document.getElementById('cmp-mass-bar').style.width = logPct(massRatio);

  const weightOnB = Math.round(150 * bodyB.gravityG);
  document.getElementById('compare-gravity-text').textContent =
    `${bodyB.name} Surface Gravity: ${bodyB.gravityG}g — If you weigh 150 lbs on Earth, you'd weigh ${weightOnB.toLocaleString()} lbs on ${bodyB.name}.`;

  document.querySelectorAll('#compare-view-segmented .seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === state.compareView);
  });

  document.querySelectorAll('.dock-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.id === state.compareBId);
  });

  if (state.mode === 'compare') {
    const boost = getMobilePortraitBoost();
    const isDesktop = window.innerWidth > 820;
    const baseDist = state.compareView === 'side' ? 37 : 31;
    const xLook = isDesktop ? 3.4 : 0;
    const yLook = boost > 1.1 ? 1.5 : 1.0;
    flyCameraTo(new THREE.Vector3(xLook, 4.5, baseDist * boost), new THREE.Vector3(xLook, yLook, 0));
  }
}

// ============================================================================
// 6. Mode Switching, Focus Mode & UI Event Listeners
// ============================================================================
function setMode(newMode) {
  state.mode = newMode;

  document.querySelectorAll('.mode-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.mode === newMode);
  });

  document.getElementById('panel-lineup').classList.toggle('hidden', newMode !== 'lineup');
  document.getElementById('panel-compare').classList.toggle('hidden', newMode !== 'compare');

  lineupGroup.visible = newMode === 'lineup';
  compareGroup.visible = newMode === 'compare';

  if (newMode === 'lineup') {
    selectBodyInLineup(state.selectedBodyId, true);
  } else if (newMode === 'compare') {
    buildCompareScene();
  }
}

document.querySelectorAll('.mode-tab').forEach((tab) => {
  tab.addEventListener('click', () => setMode(tab.dataset.mode));
});

// Focus / Cinematics Mode (H key or Focus button)
const btnFocusHud = document.getElementById('btn-focus-hud');
const btnRestoreHud = document.getElementById('btn-restore-hud');

function setHudHidden(hidden) {
  state.hudHidden = hidden;
  document.body.classList.toggle('hud-hidden', hidden);
  btnRestoreHud?.classList.toggle('hidden', !hidden);
}

btnFocusHud?.addEventListener('click', () => setHudHidden(true));
btnRestoreHud?.addEventListener('click', () => setHudHidden(false));
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'h' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    setHudHidden(!state.hudHidden);
  }
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
    }
  });
  dockEl.appendChild(btn);

  selectA.add(new Option(`${b.name} (${b.earthRatio}× Earth)`, b.id, false, b.id === state.compareAId));
  selectB.add(new Option(`${b.name} (${b.earthRatio}× Earth)`, b.id, false, b.id === state.compareBId));
});

// Mode 1 listeners (Segmented Controls + Checkboxes)
document.querySelectorAll('#arena-segmented .seg-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.lineupTier = btn.dataset.tier;
    updateArenaButtons();
    buildLineupScene();
    if (state.lineupTier === 'stellar' && state.selectedBodyId !== 'betelgeuse' && state.selectedBodyId !== 'uyscuti') {
      selectBodyInLineup('uyscuti', true);
    } else if (state.lineupTier === 'planetary' && (state.selectedBodyId === 'betelgeuse' || state.selectedBodyId === 'uyscuti')) {
      selectBodyInLineup('jupiter', true);
    } else {
      selectBodyInLineup(state.selectedBodyId, true);
    }
  });
});

document.querySelectorAll('#metaphor-segmented .seg-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.metaphor = btn.dataset.metaphor;
    document.querySelectorAll('#metaphor-segmented .seg-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.metaphor === state.metaphor);
    });
    buildScaleRuler();
    selectBodyInLineup(state.selectedBodyId, false);
  });
});

document.getElementById('toggle-sun-lineup').addEventListener('change', (e) => {
  state.showSunInLineup = e.target.checked;
  if (sunLineupMesh) sunLineupMesh.visible = state.showSunInLineup;
});

document.getElementById('toggle-scale-ruler').addEventListener('change', (e) => {
  state.showScaleRuler = e.target.checked;
  buildScaleRuler();
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

document.getElementById('btn-swap-worlds').addEventListener('click', () => {
  const prevA = state.compareAId;
  state.compareAId = state.compareBId;
  state.compareBId = prevA;
  selectA.value = state.compareAId;
  selectB.value = state.compareBId;
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

document.querySelectorAll('#compare-view-segmented .seg-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.compareView = btn.dataset.view;
    buildCompareScene();
  });
});

document.getElementById('volume-fill-slider')?.addEventListener('input', (e) => {
  state.volumeFill = parseInt(e.target.value, 10);
  updateVolumeFill();
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

// Build scenes initially
buildLineupScene();
buildCompareScene();
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
  const defaultName = `solar-scale-${state.mode}-${state.selectedBodyId}.png`;

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
    app: 'Solar Scale 3D',
    timestamp: new Date().toISOString(),
    activeMode: state.mode,
    referenceMetaphor: state.metaphor,
    selectedBody: selected,
    comparison: {
      worldA: state.compareAId,
      worldB: state.compareBId,
      view: state.compareView,
    },
  };
  const defaultName = `solar-scale-report-${state.selectedBodyId}.json`;

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

// ============================================================================
// Stage 3: Mobile Controls Pull-Down Sheet, PWA Install & Offline Service Worker
// ============================================================================
const inspectorPanel = document.getElementById('inspector-panel');
const btnTogglePanel = document.getElementById('btn-toggle-panel');
const panelDragHandle = document.getElementById('panel-drag-handle');
const sheetChevron = document.getElementById('sheet-chevron');

function setPanelMinimized(minimized) {
  if (!inspectorPanel) return;
  inspectorPanel.classList.remove('collapsed');
  inspectorPanel.classList.toggle('minimized', minimized);
  inspectorPanel.style.transform = '';
  if (sheetChevron) {
    sheetChevron.textContent = minimized ? '▲ Tap or Pull Up to Show' : '▼ Pull Down to Hide';
  }
  if (btnTogglePanel) {
    btnTogglePanel.textContent = minimized ? '🎛️ Controls' : '🎛️ Hide';
  }
}

btnTogglePanel?.addEventListener('click', () => {
  const isMin = inspectorPanel.classList.contains('minimized');
  setPanelMinimized(!isMin);
});

// Start with bottom control sheet minimized on narrow mobile portrait screens so 3D worlds are unobstructed
if (window.innerWidth <= 820 && window.innerHeight > window.innerWidth) {
  setPanelMinimized(true);
}

let sheetDrag = {
  active: false,
  startY: 0,
  currentDeltaY: 0,
  pointerId: null,
};

panelDragHandle?.addEventListener('pointerdown', (e) => {
  sheetDrag.active = true;
  sheetDrag.startY = e.clientY;
  sheetDrag.currentDeltaY = 0;
  sheetDrag.pointerId = e.pointerId;
  inspectorPanel.style.transition = 'none';
  panelDragHandle.setPointerCapture?.(e.pointerId);
});

panelDragHandle?.addEventListener('pointermove', (e) => {
  if (!sheetDrag.active || e.pointerId !== sheetDrag.pointerId) return;
  const dy = e.clientY - sheetDrag.startY;
  sheetDrag.currentDeltaY = dy;
  const isMin = inspectorPanel.classList.contains('minimized');

  if (!isMin && dy > 0) {
    inspectorPanel.style.transform = `translateY(${Math.min(dy, 320)}px)`;
  } else if (isMin && dy < 0) {
    inspectorPanel.style.transform = `translateY(${Math.max(dy, -120)}px)`;
  }
});

function finishSheetDrag() {
  if (!sheetDrag.active) return;
  sheetDrag.active = false;
  inspectorPanel.style.transition = '';

  const dy = sheetDrag.currentDeltaY;
  const isMin = inspectorPanel.classList.contains('minimized');

  if (Math.abs(dy) < 10) {
    setPanelMinimized(!isMin);
  } else if (!isMin && dy > 32) {
    setPanelMinimized(true);
  } else if (isMin && dy < -25) {
    setPanelMinimized(false);
  } else {
    setPanelMinimized(isMin);
  }
}

panelDragHandle?.addEventListener('pointerup', finishSheetDrag);
panelDragHandle?.addEventListener('pointercancel', finishSheetDrag);

let deferredInstallPrompt = null;
const btnInstallPwa = document.getElementById('btn-install-pwa');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  btnInstallPwa?.classList.remove('hidden');
});

btnInstallPwa?.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    btnInstallPwa.classList.add('hidden');
  } else {
    showStatus('On iOS/Android: Tap Share / Menu → "Add to Home Screen"!');
  }
});

if ('serviceWorker' in navigator && !window.desktopAPI?.isDesktop) {
  const registerSw = () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Service worker registration skipped:', err);
    });
  };
  if (document.readyState === 'complete') {
    registerSw();
  } else {
    window.addEventListener('load', registerSw);
  }
}

if (window.desktopAPI && window.desktopAPI.onMenuAction) {
  window.desktopAPI.onMenuAction((action) => {
    if (action === 'save-png') handleSaveScreenshot();
    else if (action === 'export-json') handleExportJson();
    else if (action === 'mode-lineup') setMode('lineup');
    else if (action === 'mode-compare') setMode('compare');
  });
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================================
// 7. Interactive Quick-Start Tutorial (Skippable at Session Start)
// ============================================================================
const TUTORIAL_SESSION_KEY = 'solarScale3d_tutorialSeenSession';
const TUTORIAL_DISMISS_KEY = 'solarScale3d_tutorialDontShow';

const TUTORIAL_STEPS = [
  {
    badge: 'WELCOME • STEP 1 OF 4',
    icon: '🪐',
    title: 'Welcome to Solar Scale 3D',
    desc: 'Explore dwarf planets, Solar System worlds, exoplanets, and hypergiant stars at true 1:1 relative scale—or skip straight into the 3D scene.',
    tips: [
      '🖱️ Drag anywhere to orbit around worlds; scroll or pinch to zoom.',
      '🎯 Tap any planet in the 3D scene or bottom dock to fly smoothly to it.',
      '❓ Replay this guide anytime from the "?" button in the top bar.',
    ],
    nextLabel: 'Start Quick Tour →',
    onEnter: () => {
      setMode('lineup');
      selectBodyInLineup('earth', true);
    },
  },
  {
    badge: 'MODE 1 • STEP 2 OF 4',
    icon: '🔮',
    title: 'Everyday Object Scale',
    desc: 'Make astronomical diameters intuitive by shrinking Earth down to a Glass Marble (1.5 cm), Tennis Ball (6.7 cm), or Basketball (24 cm).',
    tips: [
      '🪐 Switch between Planetary Stage and 🌟 Stellar Titans (Betelgeuse & UY Scuti).',
      '📏 Toggle the Everyday Scale Ruler on the floor grid for physical perspective.',
      '☀️ Toggle the Sun’s giant glowing edge right next to the planets.',
    ],
    nextLabel: 'Next: Comparisons →',
    onEnter: () => {
      setMode('lineup');
      state.lineupTier = 'planetary';
      updateArenaButtons();
      buildLineupScene();
      selectBodyInLineup('earth', true);
    },
  },
  {
    badge: 'MODE 2 • STEP 3 OF 4',
    icon: '🫙',
    title: 'Size, Overlay & Volume Fit',
    desc: 'Compare any two worlds head-to-head in Mode 2. Switch between Side-by-Side, Concentric Overlay, and 3D Volume Fit packing.',
    tips: [
      '🫙 Volume Fit packs miniature worlds inside a translucent glass shell with a live Fill Level slider.',
      '⇄ Tap Swap or use quick presets (Earth vs Mars, Sun vs Betelgeuse).',
      '⚖️ Compare Diameter, Surface Area, Volume, Mass, and Surface Gravity (g).',
    ],
    nextLabel: 'Next: Pro Controls →',
    onEnter: () => {
      state.compareAId = 'earth';
      state.compareBId = 'jupiter';
      state.compareView = 'volume';
      state.volumeFill = 100;
      const fillSlider = document.getElementById('volume-fill-slider');
      if (fillSlider) fillSlider.value = '100';
      selectA.value = 'earth';
      selectB.value = 'jupiter';
      setMode('compare');
    },
  },
  {
    badge: 'TIPS • STEP 4 OF 4',
    icon: '✨',
    title: 'Focus Mode & Snapshots',
    desc: 'Enjoy unobstructed 3D views on desktop, iPad, or iPhone and save high-resolution snapshots or scale data reports.',
    tips: [
      '👁️ Tap Focus (or press H) to hide the HUD for cinematic 3D viewing.',
      '📸 Use Save 3D PNG (Ctrl+S) or Export JSON (Ctrl+E) in the controls panel.',
      '📱 On mobile, swipe the Controls handle down or up to tuck the panel away.',
    ],
    nextLabel: 'Start Exploring 🚀',
    onEnter: () => {
      setMode('lineup');
      selectBodyInLineup('earth', true);
    },
  },
];

const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialBadge = document.getElementById('tutorial-step-badge');
const tutorialIcon = document.getElementById('tutorial-icon');
const tutorialTitle = document.getElementById('tutorial-title');
const tutorialDesc = document.getElementById('tutorial-desc');
const tutorialTips = document.getElementById('tutorial-tips');
const tutorialDots = document.getElementById('tutorial-dots');
const btnTutorialPrev = document.getElementById('btn-tutorial-prev');
const btnTutorialSkipTop = document.getElementById('btn-tutorial-skip');
const btnTutorialSkipBtn = document.getElementById('btn-tutorial-skip-btn');
const btnTutorialNext = document.getElementById('btn-tutorial-next');
const tutorialDontShow = document.getElementById('tutorial-dont-show');
const btnOpenTutorial = document.getElementById('btn-open-tutorial');

let tutorialStepIndex = 0;

function renderTutorialStep(index, triggerScene = true) {
  tutorialStepIndex = Math.max(0, Math.min(index, TUTORIAL_STEPS.length - 1));
  const step = TUTORIAL_STEPS[tutorialStepIndex];

  tutorialBadge.textContent = step.badge;
  tutorialIcon.textContent = step.icon;
  tutorialTitle.textContent = step.title;
  tutorialDesc.textContent = step.desc;
  tutorialTips.innerHTML = step.tips.map((t) => `<li>${t}</li>`).join('');

  tutorialDots.innerHTML = TUTORIAL_STEPS.map(
    (_, i) => `<span class="tutorial-dot ${i === tutorialStepIndex ? 'active' : ''}"></span>`
  ).join('');

  btnTutorialPrev.classList.toggle('hidden', tutorialStepIndex === 0);
  btnTutorialSkipBtn.classList.toggle('hidden', tutorialStepIndex > 0);
  btnTutorialNext.textContent = step.nextLabel;

  if (triggerScene && typeof step.onEnter === 'function') {
    step.onEnter();
  }
}

function openTutorial(startIndex = 0) {
  if (!tutorialOverlay) return;
  try {
    tutorialDontShow.checked = localStorage.getItem(TUTORIAL_DISMISS_KEY) === '1';
  } catch {}
  tutorialOverlay.classList.remove('hidden');
  renderTutorialStep(startIndex, false);
}

function closeTutorial(returnToLineup = false) {
  if (!tutorialOverlay) return;
  tutorialOverlay.classList.add('hidden');
  try {
    sessionStorage.setItem(TUTORIAL_SESSION_KEY, '1');
    if (tutorialDontShow?.checked) {
      localStorage.setItem(TUTORIAL_DISMISS_KEY, '1');
    } else {
      localStorage.removeItem(TUTORIAL_DISMISS_KEY);
    }
  } catch {}
  if (returnToLineup) {
    setMode('lineup');
    selectBodyInLineup('earth', true);
  }
}

btnOpenTutorial?.addEventListener('click', () => openTutorial(0));
btnTutorialSkipTop?.addEventListener('click', () => closeTutorial(false));
btnTutorialSkipBtn?.addEventListener('click', () => closeTutorial(false));
btnTutorialPrev?.addEventListener('click', () => renderTutorialStep(tutorialStepIndex - 1, true));
btnTutorialNext?.addEventListener('click', () => {
  if (tutorialStepIndex >= TUTORIAL_STEPS.length - 1) {
    closeTutorial(true);
  } else {
    renderTutorialStep(tutorialStepIndex + 1, true);
  }
});

// Clicking outside the modal card also skips cleanly
tutorialOverlay?.addEventListener('click', (e) => {
  if (e.target === tutorialOverlay) closeTutorial(false);
});

window.addEventListener('keydown', (e) => {
  if (!tutorialOverlay || tutorialOverlay.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeTutorial(false);
  else if (e.key === 'ArrowRight') {
    if (tutorialStepIndex < TUTORIAL_STEPS.length - 1) renderTutorialStep(tutorialStepIndex + 1, true);
  } else if (e.key === 'ArrowLeft') {
    if (tutorialStepIndex > 0) renderTutorialStep(tutorialStepIndex - 1, true);
  }
});

// Show tutorial automatically at the start of a new session unless opted out
(() => {
  let seenThisSession = false;
  let dontShowAgain = false;
  try {
    seenThisSession = sessionStorage.getItem(TUTORIAL_SESSION_KEY) === '1';
    dontShowAgain = localStorage.getItem(TUTORIAL_DISMISS_KEY) === '1';
  } catch {}
  if (!seenThisSession && !dontShowAgain) {
    openTutorial(0);
  }
})();

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
        group.rotation.y += dt * 0.22;
      }
      if (group.userData.cloudSphere) {
        group.userData.cloudSphere.rotation.y += dt * 0.08;
      }
    });
  } else if (state.mode === 'compare') {
    compareMeshes.forEach((group) => {
      group.rotation.y += dt * 0.2;
      if (group.userData.cloudSphere) {
        group.userData.cloudSphere.rotation.y += dt * 0.08;
      }
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
