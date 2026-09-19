"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Skill, SkillCategory } from "@/types/portfolio";
import { useTheme } from "@/components/theme/ThemeProvider";

interface Skills3DSphereProps {
  skills: Skill[];
  filter: SkillCategory | "all";
  onFilterChange: (category: SkillCategory | "all") => void;
}

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  backend: "#35e7c7",
  ai: "#ffa645",
  data: "#38bdf8",
  frontend: "#f43f5e",
  infra: "#a855f7",
};

export default function Skills3DSphere({
  skills,
  filter,
  onFilterChange,
}: Skills3DSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [hoveredSkill, setHoveredSkill] = useState<{
    skill: Skill;
    x: number;
    y: number;
  } | null>(null);

  // Keep a ref to the filter so the 3D animation loop updates without recreating the scene
  const filterRef = useRef(filter);
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = Math.min(Math.max(container.clientHeight, 480), 620);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 290;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Center Core sphere
    const coreGeometry = new THREE.SphereGeometry(12, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: theme === "dark" ? 0x35e7c7 : 0x0d9488,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Outer orbital rings
    const ringGeo = new THREE.RingGeometry(110, 111, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: theme === "dark" ? 0xffffff : 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.5;
    scene.add(ringMesh);

    // Group for rotating nodes
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Distribute skills along Fibonacci Sphere
    const nodeMeshes: THREE.Mesh[] = [];
    const radius = 105;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    skills.forEach((skill, i) => {
      const y = 1 - (i / (skills.length - 1 || 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Sphere mesh for each skill
      const nodeSize = 3.5 + (skill.level / 10) * 2.5;
      const nodeGeo = new THREE.SphereGeometry(nodeSize, 16, 16);
      const nodeColor = new THREE.Color(CATEGORY_COLORS[skill.category] || "#ffffff");
      const nodeMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.9,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x * radius, y * radius, z * radius);
      nodeMesh.userData = { skill };

      // Line connecting to system core
      const lineMat = new THREE.LineBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.15,
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * radius, y * radius, z * radius),
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      orbitGroup.add(line);

      orbitGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    });

    // Drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.002, y: 0.003 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / height) * 2 + 1;

      // Raycaster for hover tooltip
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const skill = hit.object.userData.skill as Skill;
        setHoveredSkill({
          skill,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        container.style.cursor = "pointer";
      } else {
        setHoveredSkill(null);
        container.style.cursor = isDragging ? "grabbing" : "grab";
      }

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        orbitGroup.rotation.y += deltaX * 0.006;
        orbitGroup.rotation.x += deltaY * 0.006;

        rotationVelocity = {
          x: deltaY * 0.001,
          y: deltaX * 0.001,
        };

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Resize
    const onResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener("resize", onResize);

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Inertia & slow rotation when not dragging
      if (!isDragging) {
        orbitGroup.rotation.y += rotationVelocity.y;
        orbitGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.95;
        rotationVelocity.y = rotationVelocity.y * 0.95 + 0.0015;
      }

      coreMesh.rotation.y += 0.01;
      coreMesh.rotation.x += 0.005;

      // Filter opacity handling
      const currentFilter = filterRef.current;
      nodeMeshes.forEach((mesh) => {
        const skill = mesh.userData.skill as Skill;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const matches = currentFilter === "all" || skill.category === currentFilter;
        mat.opacity = matches ? 0.95 : 0.1;
        mesh.scale.setScalar(matches ? 1 : 0.6);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [skills, theme]);

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 shadow-xl overflow-hidden">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400">
            3D Skills Constellation
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Skill filters">
          {(["all", "backend", "ai", "data", "frontend", "infra"] as const).map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? "bg-teal-500 text-white dark:bg-teal-400 dark:text-slate-950 font-semibold shadow-md shadow-teal-500/20"
                    : "bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10"
                }`}
              >
                {cat === "all" ? "All Systems" : cat === "ai" ? "AI / Agents" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-[460px] cursor-grab active:cursor-grabbing relative flex items-center justify-center"
      >
        {/* Tooltip Overlay */}
        {hoveredSkill && (
          <div
            className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-lg bg-slate-900/95 dark:bg-black/90 border border-teal-500/40 text-white shadow-2xl backdrop-blur-md transition-all duration-75"
            style={{ left: hoveredSkill.x, top: hoveredSkill.y }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    CATEGORY_COLORS[hoveredSkill.skill.category] || "#35e7c7",
                }}
              />
              <span className="text-sm font-semibold tracking-tight">
                {hoveredSkill.skill.name}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 mt-1 text-[11px] font-mono text-slate-400">
              <span className="uppercase">{hoveredSkill.skill.category}</span>
              <span className="text-teal-400 font-bold">
                Level {hoveredSkill.skill.level}/10
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Instructions & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          {(Object.keys(CATEGORY_COLORS) as SkillCategory[]).map((cat) => (
            <span key={cat} className="inline-flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span className="capitalize">{cat}</span>
            </span>
          ))}
        </div>
        <div className="text-[11px] italic">
          Drag to rotate orbit · hover node to inspect
        </div>
      </div>
    </div>
  );
}
