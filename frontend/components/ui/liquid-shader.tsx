"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface InteractiveNebulaShaderProps {
  hasActiveReminders?: boolean;
  hasUpcomingReminders?: boolean;
  disableCenterDimming?: boolean;
  /** Resolution scale (0.25-1.0). Lower = better performance. Default: 0.5 */
  resolutionScale?: number;
  /** Target FPS (30 or 60). Default: 30 */
  targetFps?: number;
  className?: string;
}

/**
 * Full-screen nebula shader background (performance optimized).
 * Props drive three GLSL uniforms.
 */
export function InteractiveNebulaShader({
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  disableCenterDimming = false,
  resolutionScale = 0.5,
  targetFps = 30,
  className = "",
}: InteractiveNebulaShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Sync props into uniforms
  useEffect(() => {
    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.hasActiveReminders.value = hasActiveReminders;
      mat.uniforms.hasUpcomingReminders.value = hasUpcomingReminders;
      mat.uniforms.disableCenterDimming.value = disableCenterDimming;
    }
  }, [hasActiveReminders, hasUpcomingReminders, disableCenterDimming]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Performance: cap pixel ratio and use resolution scale
    const maxPixelRatio = Math.min(window.devicePixelRatio, 1.5);
    const effectiveScale = Math.max(0.25, Math.min(1, resolutionScale));

    // Renderer with performance settings
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Disable for performance
      alpha: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(maxPixelRatio * effectiveScale);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Optimized fragment shader - reduced iterations and simplified math
    const fragmentShader = `
      precision lowp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      varying vec2 vUv;

      #define t iTime

      mat2 rot(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
      }

      float map(vec3 p) {
        p.xz *= rot(t * 0.3);
        p.xy *= rot(t * 0.2);
        vec3 q = p * 2.0 + t;
        return length(p + vec3(sin(t * 0.5))) * log(length(p) + 1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void main() {
        vec2 uv = vUv * iResolution / min(iResolution.x, iResolution.y) - vec2(0.9, 0.5);
        uv.x += 0.4;

        vec3 col = vec3(0.0);
        float d = 2.5;

        // Reduced to 4 iterations for performance
        for (int i = 0; i < 4; i++) {
          vec3 p = vec3(0.0, 0.0, 5.0) + normalize(vec3(uv, -1.0)) * d;
          float rz = map(p);
          float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          vec3 base = hasActiveReminders
            ? vec3(0.05, 0.2, 0.5) + vec3(4.0, 2.0, 5.0) * f
            : hasUpcomingReminders
              ? vec3(0.05, 0.3, 0.1) + vec3(2.0, 5.0, 1.0) * f
              : vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;

          col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
          d += min(rz, 1.0);
        }

        // Center dimming
        if (!disableCenterDimming) {
          vec2 center = iResolution * 0.5;
          float dist = distance(vUv * iResolution, center);
          float radius = min(iResolution.x, iResolution.y) * 0.5;
          float dim = smoothstep(radius * 0.3, radius * 0.5, dist);
          col = mix(col * 0.3, col, dim);
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      hasActiveReminders: { value: hasActiveReminders },
      hasUpcomingReminders: { value: hasUpcomingReminders },
      disableCenterDimming: { value: disableCenterDimming },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    materialRef.current = material;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(
        w * maxPixelRatio * effectiveScale,
        h * maxPixelRatio * effectiveScale
      );
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Frame-limited animation loop
    const frameInterval = 1000 / targetFps;
    let lastFrameTime = 0;
    let animationId: number;

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);

      const delta = currentTime - lastFrameTime;
      if (delta < frameInterval) return;

      lastFrameTime = currentTime - (delta % frameInterval);
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      container.removeChild(renderer.domElement);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, [hasActiveReminders, hasUpcomingReminders, disableCenterDimming, resolutionScale, targetFps]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 bg-background ${className}`}
      style={{ imageRendering: "auto" }}
      aria-label="Interactive nebula background"
    />
  );
}
