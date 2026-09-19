"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Hero3DNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.z = 320;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle nodes configuration
    const particleCount = 65;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    const bounds = 240;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * bounds * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * bounds * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * bounds;

      velocities.push({
        x: (Math.random() - 0.5) * 0.45,
        y: (Math.random() - 0.5) * 0.45,
        z: (Math.random() - 0.5) * 0.3,
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const pointColor = theme === "dark" ? 0x35e7c7 : 0x0d9488;
    const pMaterial = new THREE.PointsMaterial({
      color: pointColor,
      size: 4.5,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const pointCloud = new THREE.Points(geometry, pMaterial);
    scene.add(pointCloud);

    // Dynamic Connecting Lines
    const maxLineSegments = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );

    const lineColor = theme === "dark" ? 0x35e7c7 : 0x0ea5e9;
    const lineMaterial = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(lineMaterial);

    // Mouse tracking for subtle 3D parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetX = (e.clientX - windowHalfX) * 0.08;
      targetY = (e.clientY - windowHalfY) * 0.08;
    };

    window.addEventListener("pointermove", onPointerMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", onResize);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = -mouseY;
      camera.lookAt(scene.position);

      const pos = geometry.attributes.position.array as Float32Array;

      // Update particle positions with bounce
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        if (Math.abs(pos[i * 3]) > bounds) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > bounds * 0.75) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > bounds * 0.5) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Update dynamic connecting lines between close points
      let lineIndex = 0;
      const connectionDist = 95;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDist) {
            linePositions[lineIndex++] = pos[i * 3];
            linePositions[lineIndex++] = pos[i * 3 + 1];
            linePositions[lineIndex++] = pos[i * 3 + 2];

            linePositions[lineIndex++] = pos[j * 3];
            linePositions[lineIndex++] = pos[j * 3 + 1];
            linePositions[lineIndex++] = pos[j * 3 + 2];
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;

      // Slow orbit rotation
      scene.rotation.y += 0.0015;
      scene.rotation.x += 0.0006;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      lineGeometry.dispose();
      pMaterial.dispose();
      lineMaterial.material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
