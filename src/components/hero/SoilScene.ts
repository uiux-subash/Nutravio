/**
 * Procedural "living soil" scene — a floating clod of layered earth with a
 * mossy crown and embedded mineral crystals,
 * and a lime sprout (echoing the Nutravio mark) that grows with scroll.
 * Plain three.js, no external models or textures.
 */
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* ── tiny seeded RNG + 3D gradient noise ─────────────────────────── */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNoise(seed = 7) {
  const rand = mulberry(seed);
  const p = new Uint8Array(512);
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (h: number, x: number, y: number, z: number) => {
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };
  const noise = (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255,
      Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x),
      v = fade(y),
      w = fade(z);
    const A = p[X] + Y,
      AA = p[A] + Z,
      AB = p[A + 1] + Z,
      B = p[X + 1] + Y,
      BA = p[B] + Z,
      BB = p[B + 1] + Z;
    return lerp(
      lerp(
        lerp(grad(p[AA] & 15, x, y, z), grad(p[BA] & 15, x - 1, y, z), u),
        lerp(grad(p[AB] & 15, x, y - 1, z), grad(p[BB] & 15, x - 1, y - 1, z), u),
        v,
      ),
      lerp(
        lerp(grad(p[AA + 1] & 15, x, y, z - 1), grad(p[BA + 1] & 15, x - 1, y, z - 1), u),
        lerp(grad(p[AB + 1] & 15, x, y - 1, z - 1), grad(p[BB + 1] & 15, x - 1, y - 1, z - 1), u),
        v,
      ),
      w,
    );
  };
  const fbm = (x: number, y: number, z: number, oct = 4) => {
    let a = 0.5,
      f = 1,
      s = 0;
    for (let i = 0; i < oct; i++) {
      s += a * noise(x * f, y * f, z * f);
      f *= 2.03;
      a *= 0.5;
    }
    return s;
  };
  return { noise, fbm, rand };
}

/* ── palette ─────────────────────────────────────────────────────── */
const C = {
  bg: new THREE.Color("#0f1f10"),
  mossDark: new THREE.Color("#2c4a17"),
  moss: new THREE.Color("#5d8a2a"),
  mossLight: new THREE.Color("#9cc456"),
  soilDark: new THREE.Color("#2a1a0f"),
  soil: new THREE.Color("#5b3a22"),
  clay: new THREE.Color("#94673f"),
  sand: new THREE.Color("#c39a68"),
  lime: new THREE.Color("#c6f19d"),
};

/* ── geometry builders ───────────────────────────────────────────── */
function buildClod(opts: {
  radius: number;
  detail: number;
  seed: number;
  stretch: THREE.Vector3;
  mossy: boolean;
}) {
  const { noise, fbm } = makeNoise(opts.seed);
  const geo = mergeVertices(new THREE.IcosahedronGeometry(1, opts.detail));
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const top = 0.42;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = fbm(v.x * 1.4 + 3, v.y * 1.4, v.z * 1.4, 5);
    // horizontal strata ledges → layered-earth silhouette
    const strata = Math.sin(v.y * 19 + n * 4) * 0.035;
    // ridged underside for a torn, hanging-root look
    const under = v.y < -0.1 ? Math.abs(noise(v.x * 3.2, v.y * 2.2, v.z * 3.2)) * 0.22 * -v.y : 0;
    const r = 1 + n * 0.32 + strata + under;
    v.multiplyScalar(r);
    v.multiply(opts.stretch);
    // flatten the crown into a gently rolling plateau
    if (opts.mossy && v.y > top) v.y = top + (v.y - top) * 0.38 + noise(v.x * 4, 0, v.z * 4) * 0.03;
    v.multiplyScalar(opts.radius);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();

  // vertex colours: moss crown, banded clay sides, dark underside
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  const cols = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  const nv = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).divideScalar(opts.radius);
    nv.fromBufferAttribute(nor, i);
    const grain = noise(v.x * 9, v.y * 9, v.z * 9);
    const band = Math.sin(v.y * 22 + fbm(v.x * 2, v.y * 2, v.z * 2) * 5) * 0.5 + 0.5;
    c.copy(C.soil).lerp(C.clay, band * 0.75).lerp(C.sand, Math.max(0, band - 0.75) * 1.6);
    if (v.y < -0.05) c.lerp(C.soilDark, Math.min(1, -v.y * 1.25));
    if (opts.mossy) {
      const mossAmt = THREE.MathUtils.smoothstep(nv.y, 0.35, 0.78) * THREE.MathUtils.smoothstep(v.y, 0.0, 0.25);
      const mossTone = new THREE.Color().copy(C.mossDark).lerp(C.moss, grain * 0.5 + 0.5);
      c.lerp(mossTone, mossAmt);
      // stray moss creeping down the sides
      const creep = THREE.MathUtils.smoothstep(noise(v.x * 5, v.y * 5, v.z * 5), 0.25, 0.5) * (v.y > -0.25 ? 1 : 0);
      c.lerp(C.moss, creep * 0.55);
    }
    c.offsetHSL(0, 0, grain * 0.05);
    cols.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  return geo;
}

function buildGrass(clod: THREE.BufferGeometry, count: number, seed: number) {
  const rand = mulberry(seed);
  const pos = clod.attributes.position as THREE.BufferAttribute;
  const nor = clod.attributes.normal as THREE.BufferAttribute;
  const candidates: number[] = [];
  for (let i = 0; i < pos.count; i++) if (nor.getY(i) > 0.55 && pos.getY(i) > 0.05) candidates.push(i);

  const blade = new THREE.ConeGeometry(0.008, 0.085, 3, 1, true);
  blade.translate(0, 0.0425, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.85, side: THREE.DoubleSide });
  const mesh = new THREE.InstancedMesh(blade, mat, count);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const n = new THREE.Vector3();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  const e = new THREE.Euler();
  const col = new THREE.Color();
  for (let k = 0; k < count; k++) {
    const i = candidates[Math.floor(rand() * candidates.length)];
    p.fromBufferAttribute(pos, i);
    // jitter between neighbouring vertices
    p.x += (rand() - 0.5) * 0.04;
    p.z += (rand() - 0.5) * 0.04;
    n.fromBufferAttribute(nor, i).lerp(up, 0.55).normalize();
    q.setFromUnitVectors(up, n);
    e.set((rand() - 0.5) * 0.7, rand() * Math.PI * 2, (rand() - 0.5) * 0.7);
    q.multiply(new THREE.Quaternion().setFromEuler(e));
    const h = 0.35 + rand() * rand() * 1.5;
    s.set(1, h, 1);
    m.compose(p, q, s);
    mesh.setMatrixAt(k, m);
    col.copy(C.mossDark).lerp(C.mossLight, rand() * 0.9);
    if (rand() > 0.93) col.copy(C.lime);
    mesh.setColorAt(k, col);
  }
  return mesh;
}

function buildMossClumps(clod: THREE.BufferGeometry, count: number, seed: number) {
  const rand = mulberry(seed);
  const pos = clod.attributes.position as THREE.BufferAttribute;
  const nor = clod.attributes.normal as THREE.BufferAttribute;
  const idx: number[] = [];
  for (let i = 0; i < pos.count; i++) if (nor.getY(i) > 0.3 && pos.getY(i) > -0.15) idx.push(i);
  const geo = new THREE.IcosahedronGeometry(0.022, 1);
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }), count);
  const m = new THREE.Matrix4();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  const col = new THREE.Color();
  for (let k = 0; k < count; k++) {
    const i = idx[Math.floor(rand() * idx.length)];
    p.fromBufferAttribute(pos, i);
    const sc = 0.5 + rand() * 1.3;
    s.set(sc, sc * 0.6, sc);
    m.compose(p, new THREE.Quaternion(), s);
    mesh.setMatrixAt(k, m);
    col.copy(C.mossDark).lerp(C.moss, rand());
    mesh.setColorAt(k, col);
  }
  return mesh;
}

function leafShape() {
  // Asymmetric leaf, like the two leaves in the Nutravio mark
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.12, 0.05, 0.3, 0.2, 0.36, 0.48);
  s.bezierCurveTo(0.2, 0.46, 0.04, 0.3, 0, 0);
  return s;
}

function buildSprout() {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: C.lime,
    emissive: new THREE.Color("#5f8f2c"),
    emissiveIntensity: 0.35,
    roughness: 0.45,
    side: THREE.DoubleSide,
  });
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.05, 0),
    new THREE.Vector3(0.02, 0.18, 0.01),
    new THREE.Vector3(-0.01, 0.38, 0),
    new THREE.Vector3(0, 0.55, 0),
  ]);
  const stem = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.018, 8), mat);
  group.add(stem);

  const lg = new THREE.ShapeGeometry(leafShape(), 24);
  // cup the leaf
  const lp = lg.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < lp.count; i++) {
    const x = lp.getX(i),
      y = lp.getY(i);
    lp.setZ(i, Math.pow(x - y * 0.4, 2) * 0.9 - y * 0.12);
  }
  lg.computeVertexNormals();
  const left = new THREE.Mesh(lg, mat);
  left.position.set(0, 0.5, 0);
  left.rotation.set(0.15, 0.4, 0.15);
  const right = new THREE.Mesh(lg, mat);
  right.position.set(0, 0.5, 0);
  right.scale.set(-1, 1, 1);
  right.rotation.set(0.15, -0.4, -0.15);
  group.add(left, right);
  return group;
}

function buildCrystalCluster(color: string, seed: number, n = 5) {
  const rand = mulberry(seed);
  const group = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.18,
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    flatShading: true,
  });
  const base = new THREE.CylinderGeometry(1, 1, 1, 6);
  const cap = new THREE.ConeGeometry(1, 0.6, 6);
  for (let i = 0; i < n; i++) {
    const g = new THREE.Group();
    const w = 0.035 + rand() * 0.04;
    const h = 0.12 + rand() * 0.22;
    const body = new THREE.Mesh(base, mat);
    body.scale.set(w, h, w);
    body.position.y = h / 2;
    const tip = new THREE.Mesh(cap, mat);
    tip.scale.set(w, w * 2.2, w);
    tip.position.y = h + w * 0.65;
    g.add(body, tip);
    g.rotation.set((rand() - 0.5) * 1.3, rand() * Math.PI, (rand() - 0.5) * 1.3);
    group.add(g);
  }
  return group;
}

/* ── scene ───────────────────────────────────────────────────────── */
export type SoilSceneHandle = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  dispose: () => void;
};

export function createSoilScene(canvas: HTMLCanvasElement, onReady?: () => void): SoilSceneHandle {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.35, 7.2);

  // light
  scene.add(new THREE.HemisphereLight("#e9f5d6", "#1a120a", 0.9));
  const key = new THREE.DirectionalLight("#fff1dc", 2.4);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#c6f19d", 2.2);
  rim.position.set(-4, 1.5, -3);
  scene.add(rim);
  const under = new THREE.PointLight("#99eeff", 3, 6, 2);
  under.position.set(0.4, -1.6, 1.2);
  scene.add(under);

  // hero clod
  const world = new THREE.Group();
  scene.add(world);
  const clodGroup = new THREE.Group();
  world.add(clodGroup);

  const clodGeo = buildClod({ radius: 1, detail: 56, seed: 11, stretch: new THREE.Vector3(1.22, 1.0, 1.05), mossy: true });
  const clodMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0 });
  const clod = new THREE.Mesh(clodGeo, clodMat);
  clodGroup.add(clod);
  clodGroup.add(buildMossClumps(clodGeo, 1600, 4));
  clodGroup.add(buildGrass(clodGeo, 6500, 9));

  // sprout from the crown
  const sprout = buildSprout();
  const crownY = (() => {
    const p = clodGeo.attributes.position as THREE.BufferAttribute;
    let best = -9;
    for (let i = 0; i < p.count; i++) if (Math.abs(p.getX(i)) < 0.12 && Math.abs(p.getZ(i)) < 0.12) best = Math.max(best, p.getY(i));
    return best;
  })();
  sprout.position.set(0, crownY - 0.02, 0);
  clodGroup.add(sprout);

  // mineral crystal clusters embedded in the strata
  const clusters: { g: THREE.Group; dir: THREE.Vector3 }[] = [];
  (
    [
      ["#d5eebc", new THREE.Vector3(1, -0.1, 0.35), 21],
      ["#99eeff", new THREE.Vector3(-0.85, -0.25, 0.6), 22],
      ["#e02f99", new THREE.Vector3(0.25, -0.45, 1), 23],
      ["#c6f19d", new THREE.Vector3(-0.4, -0.2, -1), 24],
    ] as const
  ).forEach(([col, dir, seed]) => {
    const g = buildCrystalCluster(col, seed, 6);
    const d = dir.clone().normalize();
    // find surface along dir by raycast
    const ray = new THREE.Raycaster(d.clone().multiplyScalar(4), d.clone().negate());
    const hit = ray.intersectObject(clod)[0];
    if (hit) {
      g.position.copy(hit.point).addScaledVector(d, -0.03);
      g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
    }
    clodGroup.add(g);
    clusters.push({ g, dir: d });
  });



  /* state */
  let progress = 0,
    smoothP = 0;
  const pointer = new THREE.Vector2(),
    smoothPointer = new THREE.Vector2();
  let w = 0,
    h = 0,
    isMobile = false;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    isMobile = w < 768;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);

  const clock = new THREE.Clock();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const seg = (p: number, a: number, b: number) => THREE.MathUtils.clamp((p - a) / (b - a), 0, 1);

  let raf = 0;
  let first = true;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible && !first) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    smoothP += (progress - smoothP) * Math.min(1, dt * 6);
    smoothPointer.lerp(pointer, Math.min(1, dt * 3));
    const p = smoothP;

    // choreography
    const intro = ease(Math.min(1, t / 2.2));
    const pA = ease(seg(p, 0, 0.45)); // centre + grow
    const pB = ease(seg(p, 0.45, 1)); // push in / scatter
    const baseX = 0;
    const baseScale = isMobile ? 0.44 : 0.76;

    clodGroup.position.x = THREE.MathUtils.lerp(baseX, 0, pA);
    clodGroup.position.y = THREE.MathUtils.lerp(isMobile ? 0.58 : 0.08, -0.4, pA) + pB * 0.55 + Math.sin(t * 0.8) * 0.04 + (1 - intro) * -0.6;
    const s = (baseScale + pA * (isMobile ? 0.15 : 0.12) - pB * 0.12) * (0.75 + intro * 0.25);
    clodGroup.scale.setScalar(s);
    clodGroup.rotation.y = (reduce ? 0 : t * 0.07) + p * 2.6 + smoothPointer.x * 0.25 - 0.5;
    clodGroup.rotation.x = 0.18 + p * 0.35 + smoothPointer.y * 0.12;
    clodGroup.rotation.z = Math.sin(t * 0.5) * 0.02;

    sprout.scale.setScalar(0.4 + ease(seg(p, 0.05, 0.6)) * 0.45 + Math.sin(t * 1.6) * 0.01);
    sprout.rotation.z = Math.sin(t * 1.1) * 0.04;

    clusters.forEach(({ g }, i) => {
      const glow = 0.18 + pA * 0.4 + Math.sin(t * 2 + i) * 0.05;
      g.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) (mesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = glow;
      });
    });




    camera.position.z = THREE.MathUtils.lerp(7.2, 6.8, pB);
    camera.position.y = 0.35 - pB * 0.2;
    camera.position.x = smoothPointer.x * 0.15;
    camera.lookAt(0, 0, 0);

    under.intensity = 2 + pA * 3;

    renderer.render(scene, camera);
    if (first) {
      first = false;
      onReady?.();
    }
  };
  tick();

  return {
    setProgress: (p) => (progress = p),
    setPointer: (x, y) => pointer.set(x, y),
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
    },
  };
}
