"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const TRAIL = 24; // smear trail length
const SPARKS = 32; // particle sparks emitted on motion

/**
 * LiquidCursor — full-screen shader plane that paints a wet-paint smear
 * following the cursor, plus tiny ember-like sparks that drift outward and
 * fade. Trail + sparks are uploaded to the fragment shader each frame.
 *
 * Canvas is fixed, pointer-events: none, mix-blend-mode: screen so it tints
 * whatever is underneath rather than occluding clickable elements.
 */
export default function LiquidCursorScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 5], zoom: 1 }}
        gl={{ alpha: true, antialias: false, premultipliedAlpha: false }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: "none" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
      >
        <Plane />
      </Canvas>
    </div>
  );
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec3 uAccent;
  uniform float uTime;
  uniform vec2 uTrail[${TRAIL}];
  uniform float uTrailAge[${TRAIL}];
  uniform float uTrailActive[${TRAIL}];
  uniform vec2 uSpark[${SPARKS}];
  uniform float uSparkAge[${SPARKS}];
  uniform float uSparkActive[${SPARKS}];
  uniform float uSparkSize[${SPARKS}];

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * uResolution;

    // 1. Main smear — trail Gaussians
    float heat = 0.0;
    for (int i = 0; i < ${TRAIL}; i++) {
      if (uTrailActive[i] < 0.5) continue;
      vec2 d = p - uTrail[i];
      float r2 = dot(d, d);
      float age = uTrailAge[i];
      float radius = mix(42.0, 14.0, age);
      float falloff = exp(-r2 / (radius * radius));
      heat += falloff * (1.0 - age) * 0.55;
    }
    heat = clamp(heat, 0.0, 1.0);

    // 2. Sparks — small bright dots that pop and fade
    float sparkLight = 0.0;
    for (int i = 0; i < ${SPARKS}; i++) {
      if (uSparkActive[i] < 0.5) continue;
      vec2 d = p - uSpark[i];
      float r2 = dot(d, d);
      float age = uSparkAge[i];
      float size = uSparkSize[i];
      float radius = mix(size, size * 0.4, age);
      float falloff = exp(-r2 / (radius * radius));
      // sharp pop early, fast fade
      float life = pow(1.0 - age, 2.0);
      sparkLight += falloff * life * 1.2;
    }
    sparkLight = clamp(sparkLight, 0.0, 1.5);

    float grain = (hash(p * 0.6 + uTime * 0.4) - 0.5) * 0.04;
    vec3 col = uAccent * (heat + sparkLight + grain);

    float a = smoothstep(0.02, 0.25, heat + sparkLight * 0.6);
    gl_FragColor = vec4(col, a * 0.65);
  }
`;

function Plane() {
  const material = useRef<THREE.ShaderMaterial | null>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uAccent: { value: new THREE.Color("#e23614") },
      uTime: { value: 0 },
      uTrail: { value: Array.from({ length: TRAIL }, () => new THREE.Vector2(-9999, -9999)) },
      uTrailAge: { value: new Float32Array(TRAIL) },
      uTrailActive: { value: new Float32Array(TRAIL) },
      uSpark: { value: Array.from({ length: SPARKS }, () => new THREE.Vector2(-9999, -9999)) },
      uSparkAge: { value: new Float32Array(SPARKS) },
      uSparkActive: { value: new Float32Array(SPARKS) },
      uSparkSize: { value: new Float32Array(SPARKS) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height, uniforms.uResolution]);

  // Cursor + last position for velocity calc
  const pointer = useRef({
    x: -9999,
    y: -9999,
    px: -9999,
    py: -9999,
    lastEmit: 0,
    lastSpark: 0,
  });

  // Spark velocity store (drift after emission)
  const sparkVel = useRef(new Float32Array(SPARKS * 2));

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = e.clientX;
      pointer.current.y = window.innerHeight - e.clientY;
    }
    function onLeave() {
      pointer.current.x = -9999;
      pointer.current.y = -9999;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useFrame((_, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTime.value += delta;

    // --- TRAIL (smear) ---
    const trail: THREE.Vector2[] = u.uTrail.value;
    const ages: Float32Array = u.uTrailAge.value;
    const actives: Float32Array = u.uTrailActive.value;
    for (let i = 0; i < TRAIL; i++) {
      if (actives[i] > 0.5) {
        ages[i] = Math.min(1, ages[i] + delta * 2.6);
        if (ages[i] >= 1) actives[i] = 0;
      }
    }

    // --- SPARKS ---
    const sparks: THREE.Vector2[] = u.uSpark.value;
    const sAges: Float32Array = u.uSparkAge.value;
    const sActives: Float32Array = u.uSparkActive.value;
    const sSizes: Float32Array = u.uSparkSize.value;
    const vels = sparkVel.current;
    for (let i = 0; i < SPARKS; i++) {
      if (sActives[i] > 0.5) {
        sAges[i] = Math.min(1, sAges[i] + delta * 1.8);
        // drift outward
        sparks[i].x += vels[i * 2] * delta;
        sparks[i].y += vels[i * 2 + 1] * delta;
        // gravity-ish: very gentle drift down + slow vel decay
        vels[i * 2] *= 0.94;
        vels[i * 2 + 1] = vels[i * 2 + 1] * 0.94 - 6 * delta;
        if (sAges[i] >= 1) sActives[i] = 0;
      }
    }

    const now = performance.now();
    if (pointer.current.x > -9000) {
      // Emit smear point
      if (now - pointer.current.lastEmit > 16) {
        let slot = -1;
        let worst = -1;
        for (let i = 0; i < TRAIL; i++) {
          const score = actives[i] > 0.5 ? ages[i] : 2;
          if (score > worst) {
            worst = score;
            slot = i;
          }
        }
        if (slot >= 0) {
          trail[slot].set(pointer.current.x, pointer.current.y);
          ages[slot] = 0;
          actives[slot] = 1;
          pointer.current.lastEmit = now;
        }
      }

      // Emit sparks based on velocity (faster cursor → more sparks per tick)
      const vx = pointer.current.x - pointer.current.px;
      const vy = pointer.current.y - pointer.current.py;
      const speed = Math.hypot(vx, vy);
      if (now - pointer.current.lastSpark > 28 && speed > 4) {
        const count = Math.min(4, 1 + Math.floor(speed / 14));
        for (let n = 0; n < count; n++) {
          // find dead slot
          let slot = -1;
          let worst = -1;
          for (let i = 0; i < SPARKS; i++) {
            const score = sActives[i] > 0.5 ? sAges[i] : 2;
            if (score > worst) {
              worst = score;
              slot = i;
            }
          }
          if (slot < 0) break;
          // jitter spawn around cursor (perpendicular spread)
          const angle = Math.random() * Math.PI * 2;
          const offset = 4 + Math.random() * 18;
          sparks[slot].set(
            pointer.current.x + Math.cos(angle) * offset,
            pointer.current.y + Math.sin(angle) * offset,
          );
          sAges[slot] = 0;
          sActives[slot] = 1;
          // spark size 2..7px
          sSizes[slot] = 2 + Math.random() * 5;
          // velocity: blend cursor vector + random outward
          const inheritK = 0.18;
          const burst = 30 + Math.random() * 90;
          vels[slot * 2] = vx * inheritK + Math.cos(angle) * burst;
          vels[slot * 2 + 1] = vy * inheritK + Math.sin(angle) * burst;
        }
        pointer.current.lastSpark = now;
      }

      pointer.current.px = pointer.current.x;
      pointer.current.py = pointer.current.y;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
