import * as THREE from 'three';

export type SceneTheme = 'dark' | 'light';
export type SceneAccent = 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber';

export interface BackgroundSceneController {
  setTheme: (theme: SceneTheme) => void;
  setAccent: (accent: SceneAccent | null) => void;
  setBoost: (active: boolean) => void;
  setPaused: (paused: boolean) => void;
  destroy: () => void;
}

const GRID_SEGMENTS_X = 48;
const GRID_SEGMENTS_Y = 30;
const GRID_WIDTH = 56;
const GRID_DEPTH = 34;
const MATRIX_POINTS = 140;

const THEME_PALETTES: Record<
  SceneTheme,
  {
    baseGrid: number;
    defaultAccent: number;
    fogColor: number;
    gridOpacity: number;
    accentOpacity: number;
    pointOpacity: number;
  }
> = {
  dark: {
    baseGrid: 0x30363d,
    defaultAccent: 0x58a6ff,
    fogColor: 0x0d1117,
    gridOpacity: 0.42,
    accentOpacity: 0.2,
    pointOpacity: 0.45,
  },
  light: {
    baseGrid: 0xd0d7de,
    defaultAccent: 0x0969da,
    fogColor: 0xf6f8fa,
    gridOpacity: 0.55,
    accentOpacity: 0.16,
    pointOpacity: 0.38,
  },
};

const ACCENT_COLORS: Record<SceneAccent, Record<SceneTheme, number>> = {
  cyan: { dark: 0x58a6ff, light: 0x0969da },
  violet: { dark: 0xa371f7, light: 0x8250df },
  emerald: { dark: 0x3fb950, light: 0x1a7f37 },
  rose: { dark: 0xf85149, light: 0xcf222e },
  amber: { dark: 0xd29922, light: 0x9a6700 },
};

function createNoopController(): BackgroundSceneController {
  return {
    setTheme: () => {},
    setAccent: () => {},
    setBoost: () => {},
    setPaused: () => {},
    destroy: () => {},
  };
}

/**
 * Arrière-plan 3D discret pour Workstation OS :
 * Topo-grille vectorielle en fil de fer + matrice de points techniques
 * réactive au curseur et aux accents des fenêtres, sans surcharger l'UI.
 */
export function createBackgroundScene(
  canvas: HTMLCanvasElement,
  initialTheme: SceneTheme
): BackgroundSceneController {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    canvas.style.display = 'none';
    return createNoopController();
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();

  const width = window.innerWidth;
  const height = Math.max(window.innerHeight, 1);
  const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
  camera.position.set(0, 7.2, 17.5);
  camera.lookAt(0, -1.2, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);

  let currentTheme: SceneTheme = initialTheme;
  let activeAccent: SceneAccent | null = null;
  let isBoosted = false;
  let isExplicitlyPaused = false;
  let isTabHidden = document.hidden;
  let isPrinting = false;
  let rafId: number | null = null;
  let isDestroyed = false;

  const fog = new THREE.FogExp2(THEME_PALETTES[currentTheme].fogColor, 0.036);
  scene.fog = fog;

  const activeAccentColor = new THREE.Color(THEME_PALETTES[currentTheme].defaultAccent);
  const targetAccentColor = new THREE.Color(THEME_PALETTES[currentTheme].defaultAccent);
  const baseGridColor = new THREE.Color(THEME_PALETTES[currentTheme].baseGrid);

  // 1. Grille topographique vectorielle 3D
  const planeGeo = new THREE.PlaneGeometry(
    GRID_WIDTH,
    GRID_DEPTH,
    GRID_SEGMENTS_X,
    GRID_SEGMENTS_Y
  );
  planeGeo.rotateX(-Math.PI / 2);

  const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
  const baseCoords = new Float32Array(posAttr.count * 2);
  for (let i = 0; i < posAttr.count; i++) {
    baseCoords[i * 2] = posAttr.getX(i);
    baseCoords[i * 2 + 1] = posAttr.getZ(i);
  }

  const baseWireMat = new THREE.MeshBasicMaterial({
    color: baseGridColor,
    wireframe: true,
    transparent: true,
    opacity: THEME_PALETTES[currentTheme].gridOpacity,
  });
  const baseGridMesh = new THREE.Mesh(planeGeo, baseWireMat);
  baseGridMesh.position.y = -2.8;
  scene.add(baseGridMesh);

  // Surcouche accentuée très subtile sur la même géométrie (offset minime)
  const accentWireMat = new THREE.MeshBasicMaterial({
    color: activeAccentColor,
    wireframe: true,
    transparent: true,
    opacity: THEME_PALETTES[currentTheme].accentOpacity,
  });
  const accentGridMesh = new THREE.Mesh(planeGeo, accentWireMat);
  accentGridMesh.position.y = -2.78;
  scene.add(accentGridMesh);

  // 2. Matrice de points techniques flottants
  const pointsPositions = new Float32Array(MATRIX_POINTS * 3);
  const pointBaseY = new Float32Array(MATRIX_POINTS);
  const pointPhases = new Float32Array(MATRIX_POINTS);

  for (let i = 0; i < MATRIX_POINTS; i++) {
    const px = (Math.random() - 0.5) * 42;
    const py = -1.5 + Math.random() * 11;
    const pz = -14 + Math.random() * 20;
    pointsPositions[i * 3] = px;
    pointsPositions[i * 3 + 1] = py;
    pointsPositions[i * 3 + 2] = pz;
    pointBaseY[i] = py;
    pointPhases[i] = Math.random() * Math.PI * 2;
  }

  const pointsGeo = new THREE.BufferGeometry();
  const pointsPosAttr = new THREE.BufferAttribute(pointsPositions, 3);
  pointsPosAttr.setUsage(THREE.DynamicDrawUsage);
  pointsGeo.setAttribute('position', pointsPosAttr);

  const pointsMat = new THREE.PointsMaterial({
    color: activeAccentColor,
    size: 0.085,
    transparent: true,
    opacity: THEME_PALETTES[currentTheme].pointOpacity,
    depthWrite: false,
  });
  const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
  scene.add(pointsMesh);

  // Entrées utilisateur lissées
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let elapsed = 0;
  let speedFactor = 1;
  let lastTime = performance.now();

  function refreshTargets(): void {
    const palette = THEME_PALETTES[currentTheme];
    const hex = activeAccent
      ? ACCENT_COLORS[activeAccent][currentTheme]
      : palette.defaultAccent;

    targetAccentColor.setHex(hex);
    baseGridColor.setHex(palette.baseGrid);
    baseWireMat.color.copy(baseGridColor);
    fog.color.setHex(palette.fogColor);

    baseWireMat.opacity = palette.gridOpacity;
    accentWireMat.opacity = isBoosted ? palette.accentOpacity * 1.65 : palette.accentOpacity;
    pointsMat.opacity = isBoosted ? palette.pointOpacity * 1.25 : palette.pointOpacity;
  }

  function stepSimulation(dt: number): void {
    const targetSpeed = isBoosted ? 1.75 : 1.0;
    speedFactor += (targetSpeed - speedFactor) * Math.min(1, dt * 4);

    const motionScale = prefersReducedMotion ? 0.1 : speedFactor;
    elapsed += dt * motionScale;

    activeAccentColor.lerp(targetAccentColor, Math.min(1, dt * 5));
    accentWireMat.color.copy(activeAccentColor);
    pointsMat.color.copy(activeAccentColor);

    const inputLerp = Math.min(1, dt * 4.5);
    pointerX += (pointerTargetX - pointerX) * inputLerp;
    pointerY += (pointerTargetY - pointerY) * inputLerp;

    // Ondulation topographique discrète + légère perturbation au curseur
    const cursorWorldX = pointerX * 16;
    const cursorWorldZ = -pointerY * 10;

    for (let i = 0; i < posAttr.count; i++) {
      const x = baseCoords[i * 2];
      const z = baseCoords[i * 2 + 1];

      const wave =
        Math.sin(x * 0.22 + elapsed * 0.55) * 0.55 +
        Math.cos(z * 0.26 - elapsed * 0.42) * 0.45;

      const dx = x - cursorWorldX;
      const dz = z - cursorWorldZ;
      const distSq = dx * dx + dz * dz;
      const ripple = Math.exp(-distSq * 0.025) * 1.05;

      posAttr.setY(i, wave + ripple);
    }
    posAttr.needsUpdate = true;

    // Dérive verticale subtile des points techniques
    for (let i = 0; i < MATRIX_POINTS; i++) {
      pointsPositions[i * 3 + 1] =
        pointBaseY[i] + Math.sin(elapsed * 0.65 + pointPhases[i]) * 0.22;
    }
    pointsPosAttr.needsUpdate = true;

    camera.position.x = pointerX * 1.35;
    camera.position.y = 7.2 + pointerY * 0.65;
    camera.lookAt(pointerX * 0.35, -1.2, 0);
  }

  function renderLoop(now: number): void {
    if (isDestroyed || isExplicitlyPaused || isTabHidden || isPrinting) {
      rafId = null;
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    stepSimulation(dt);
    renderer.render(scene, camera);

    rafId = window.requestAnimationFrame(renderLoop);
  }

  function syncRunningState(): void {
    const shouldPause = isDestroyed || isExplicitlyPaused || isTabHidden || isPrinting;
    canvas.style.visibility = isExplicitlyPaused || isPrinting ? 'hidden' : 'visible';

    if (shouldPause) {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      return;
    }

    if (rafId === null) {
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(renderLoop);
    }
  }

  function onPointerMove(event: PointerEvent): void {
    const w = Math.max(window.innerWidth, 1);
    const h = Math.max(window.innerHeight, 1);
    pointerTargetX = (event.clientX / w) * 2 - 1;
    pointerTargetY = -((event.clientY / h) * 2 - 1);
  }

  function onResize(): void {
    if (isDestroyed) return;
    const nextW = window.innerWidth;
    const nextH = Math.max(window.innerHeight, 1);
    camera.aspect = nextW / nextH;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(nextW, nextH, false);
    if (!isExplicitlyPaused && !isPrinting) {
      renderer.render(scene, camera);
    }
  }

  function onVisibilityChange(): void {
    isTabHidden = document.hidden;
    syncRunningState();
  }

  function onBeforePrint(): void {
    isPrinting = true;
    syncRunningState();
  }

  function onAfterPrint(): void {
    isPrinting = false;
    syncRunningState();
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('beforeprint', onBeforePrint);
  window.addEventListener('afterprint', onAfterPrint);

  stepSimulation(0.016);
  renderer.render(scene, camera);
  syncRunningState();

  return {
    setTheme(theme: SceneTheme) {
      currentTheme = theme;
      refreshTargets();
    },
    setAccent(accent: SceneAccent | null) {
      activeAccent = accent;
      refreshTargets();
    },
    setBoost(active: boolean) {
      isBoosted = active;
      refreshTargets();
    },
    setPaused(paused: boolean) {
      isExplicitlyPaused = paused;
      syncRunningState();
    },
    destroy() {
      if (isDestroyed) return;
      isDestroyed = true;

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);

      planeGeo.dispose();
      baseWireMat.dispose();
      accentWireMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      renderer.dispose();
    },
  };
}
