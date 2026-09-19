"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Skill, SkillCategory } from "@/types/portfolio";

interface Skills3DSphereProps {
  skills: Skill[];
  filter: SkillCategory | "all";
  onFilterChange: (category: SkillCategory | "all") => void;
}

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  backend: "#35e7c7", // cyan
  ai: "#ffa645",      // amber
  data: "#35e7c7",
  frontend: "#4E5A6A",
  infra: "#FF5D5D",   // red-live
};

export default function Skills3DSphere({
  skills,
  filter,
}: Skills3DSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<{
    skill: Skill;
    x: number;
    y: number;
  } | null>(null);

  const filterRef = useRef(filter);
  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

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
      color: 0x35e7c7, // cyan
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Outer orbital rings
    const ringGeo = new THREE.RingGeometry(110, 111, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.05,
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
      const y = 1 - (i / (skills.length - 1 || 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const nodeSize = 3.5 + (skill.level / 10) * 2.5;
      const nodeGeo = new THREE.SphereGeometry(nodeSize, 16, 16);
      const nodeColor = new THREE.Color(CATEGORY_COLORS[skill.category] || "#35e7c7");
      const nodeMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.9,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x * radius, y * radius, z * radius);
      nodeMesh.userData = { skill };

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
        rotationVelocity = { x: deltaY * 0.001, y: deltaX * 0.001 };
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const onResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        orbitGroup.rotation.y += rotationVelocity.y;
        orbitGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.95;
        rotationVelocity.y = rotationVelocity.y * 0.95 + 0.0015;
      }

      coreMesh.rotation.y += 0.01;
      coreMesh.rotation.x += 0.005;

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
  }, [skills]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Control Room Styled Tooltip */}
      {hoveredSkill && (
        <div
          className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-4 px-4 py-3 bg-[var(--bg-panel-2)] border border-[var(--cyan)] shadow-[0_0_15px_rgba(53,231,199,0.2)] font-mono transition-all duration-75"
          style={{ left: hoveredSkill.x, top: hoveredSkill.y }}
        >
          <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 mb-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[hoveredSkill.skill.category] || "#35e7c7" }}
            />
            <span className="text-sm font-bold text-[var(--text)] tracking-wider">
              {hoveredSkill.skill.name.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 text-[10px] text-[var(--text-faint)] uppercase">
            <span>CAT: {hoveredSkill.skill.category}</span>
            <span className="text-[var(--cyan)]">PWR: {hoveredSkill.skill.level}/10</span>
          </div>
        </div>
      )}
    </div>
  );
}
