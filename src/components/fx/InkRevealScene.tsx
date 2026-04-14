"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InkRevealProps } from "./InkReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InkRevealScene(props: InkRevealProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5], zoom: 1 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      frameloop="demand"
      style={{ position: "absolute", inset: 0 }}
    >
      <Plane {...props} />
    </Canvas>
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
  uniform sampler2D uImage;
  uniform float uProgress;
  uniform float uAspect;
  uniform float uImageAspect;
  uniform vec3 uAccent;

  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float wrapAspect = uAspect;
    float imgAspect = uImageAspect;
    vec2 imgUv = uv;
    if (wrapAspect > imgAspect) {
      float s = imgAspect / wrapAspect;
      imgUv.y = (uv.y - 0.5) * s + 0.5;
    } else {
      float s = wrapAspect / imgAspect;
      imgUv.x = (uv.x - 0.5) * s + 0.5;
    }
    vec4 img = texture2D(uImage, imgUv);

    vec2 np = vec2(uv.x * 3.0, uv.y * 4.0);
    float n = fbm(np) * 0.5 + 0.5;
    float bias = uv.y;
    float mask = (n * 0.55) + (bias * 0.45);
    float prog = uProgress * 1.15;
    float edge = smoothstep(prog - 0.18, prog + 0.05, mask);
    float alpha = 1.0 - edge;

    float edgeBand = 1.0 - smoothstep(0.0, 0.06, abs(mask - prog));
    vec3 glow = uAccent * edgeBand * 0.55;

    vec3 col = mix(vec3(0.02), img.rgb + glow, alpha);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ src, width, height, accent = "#e23614" }: InkRevealProps) {
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const { size, invalidate, gl } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Imperative texture load — no suspense, no nav-time hangs.
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;
    loader.load(
      src,
      (t) => {
        if (cancelled) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        setTexture(t);
      },
      undefined,
      // On error: just fail silently — CSS fallback already shows the image.
      () => undefined,
    );
    return () => {
      cancelled = true;
    };
  }, [src]);

  const uniforms = useMemo(
    () => ({
      uImage: { value: null as THREE.Texture | null },
      uProgress: { value: 0 },
      uAspect: { value: size.width / Math.max(1, size.height) },
      uImageAspect: { value: width / height },
      uAccent: { value: new THREE.Color(accent) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!texture) return;
    uniforms.uImage.value = texture;
    invalidate();
  }, [texture, uniforms.uImage, invalidate]);

  useEffect(() => {
    uniforms.uAspect.value = size.width / Math.max(1, size.height);
    invalidate();
  }, [size.width, size.height, uniforms.uAspect, invalidate]);

  useEffect(() => {
    // ScrollTrigger needs a DOM element to observe. Walk up from the canvas
    // to the nearest container div (the InkReveal wrap).
    const canvas = gl.domElement;
    const wrap = canvas.parentElement ?? canvas;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 92%",
      end: "top 25%",
      scrub: true,
      onUpdate: (self) => {
        uniforms.uProgress.value = self.progress;
        invalidate();
      },
    });
    // Kick first draw
    invalidate();
    return () => st.kill();
  }, [gl.domElement, uniforms.uProgress, invalidate]);

  if (!texture) return null; // CSS fallback covers the gap until the texture arrives

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
