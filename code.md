types.ts

export interface GitHubLanguage {
  name: string;
  bytes: number;
  percent: number;
}

export interface GitHubCommit {
  repo: string;
  sha: string;
  message: string;
  date: string | null;
  url: string | null;
}

export interface GitHubStats {
  username: string;
  name: string | null;
  avatar_url: string | null;
  public_repositories: number;
  public_activity_proxy: number;
  top_languages: GitHubLanguage[];
  recent_commits: GitHubCommit[];
  cached_at: string;
  source: string;
  partial: boolean;
  stale: boolean;
  error_message: string | null;
}

HeroNetwork.tsx

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; radius: number; drift: number; phase: number };

export default function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const particles: Particle[] = Array.from({ length: 72 }, (_, index) => ({
      x: (index * 137) % 1000,
      y: (index * 83) % 700,
      radius: index % 7 === 0 ? 2.5 : 1.1,
      drift: 0.08 + (index % 4) * 0.018,
      phase: index * 0.8,
    }));

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.forEach((particle, index) => {
        particle.x = (index * 157) % Math.max(width, 1);
        particle.y = (index * 97) % Math.max(height, 1);
      });
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);
      const visible = particles.map((particle, index) => ({
        ...particle,
        x: (particle.x + Math.sin(frame * particle.drift + particle.phase) * 24 + width) % width,
        y: (particle.y + Math.cos(frame * particle.drift * 0.7 + particle.phase) * 18 + height) % height,
        index,
      }));
      for (let index = 0; index < visible.length; index += 1) {
        for (let next = index + 1; next < visible.length; next += 1) {
          const a = visible[index];
          const b = visible[next];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > 190) continue;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = `rgba(53, 231, 199, ${0.12 * (1 - distance / 190)})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
      visible.forEach((particle, index) => {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = index % 13 === 0 ? "rgba(255,166,69,.85)" : "rgba(53,231,199,.7)";
        context.fill();
      });
      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <div className="hero-network" aria-hidden="true" data-testid="hero-network-visual"><canvas ref={canvasRef} /></div>;
}

SkillsConstellation.tsx
import { useEffect, useMemo, useRef, useState } from "react";

export type SkillCategory = "backend" | "ai" | "data" | "frontend" | "infra";
type SkillNode = { id: string; category: SkillCategory; level: number; x: number; y: number; anchorX: number; anchorY: number };

const skills: Array<{ id: string; category: SkillCategory; level: number }> = [
  { id: "Node.js", category: "backend", level: 9 }, { id: "TypeScript", category: "backend", level: 9 },
  { id: "Express", category: "backend", level: 8 }, { id: "REST APIs", category: "backend", level: 9 },
  { id: "RabbitMQ", category: "backend", level: 6 }, { id: "Kafka", category: "backend", level: 6 },
  { id: "LangGraph", category: "ai", level: 8 }, { id: "LangChain", category: "ai", level: 8 },
  { id: "RAG", category: "ai", level: 8 }, { id: "MCP", category: "ai", level: 6 }, { id: "LLM APIs", category: "ai", level: 8 },
  { id: "PostgreSQL", category: "data", level: 8 }, { id: "MongoDB", category: "data", level: 8 },
  { id: "Redis", category: "data", level: 7 }, { id: "Mongoose", category: "data", level: 7 }, { id: "Prisma", category: "data", level: 7 },
  { id: "React", category: "frontend", level: 8 }, { id: "Next.js", category: "frontend", level: 7 },
  { id: "Tailwind", category: "frontend", level: 8 }, { id: "TanStack Query", category: "frontend", level: 6 },
  { id: "Docker", category: "infra", level: 7 }, { id: "AWS", category: "infra", level: 6 },
  { id: "CI/CD", category: "infra", level: 7 }, { id: "Grafana", category: "infra", level: 6 }, { id: "Prometheus", category: "infra", level: 6 },
];

const colors: Record<SkillCategory, string> = { backend: "#35e7c7", ai: "#ffa645", data: "#6aa8ff", frontend: "#ff7fb0", infra: "#b59bff" };
const width = 920;
const height = 520;

interface SkillsConstellationProps { filter: SkillCategory | "all"; onFilterChange: (filter: SkillCategory | "all") => void }

export default function SkillsConstellation({ filter, onFilterChange }: SkillsConstellationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const initial = useMemo<SkillNode[]>(() => skills.map((skill, index) => {
    const angle = (index / skills.length) * Math.PI * 2;
    const radius = 110 + (index % 4) * 32;
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius;
    return { ...skill, x, y, anchorX: x, anchorY: y };
  }), []);
  const [nodes, setNodes] = useState<SkillNode[]>(initial);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame += 1;
      setNodes((current) => current.map((node, index) => dragging === node.id ? node : ({
        ...node,
        x: node.anchorX + Math.sin(frame * 0.012 + index) * 4,
        y: node.anchorY + Math.cos(frame * 0.009 + index * 0.7) * 4,
      })));
      const timer = window.setTimeout(() => window.requestAnimationFrame(animate), 42);
      return timer;
    };
    const timer = animate();
    return () => window.clearTimeout(timer);
  }, [dragging]);

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svgRef.current) return;
    const bounds = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * width;
    const y = ((event.clientY - bounds.top) / bounds.height) * height;
    setNodes((current) => current.map((node) => node.id === dragging ? { ...node, x, y, anchorX: x, anchorY: y } : node));
  };

  return <div className="skills-module" data-testid="skills-constellation-module">
    <div className="skill-filters" role="group" aria-label="Filter skills" data-testid="skill-filters">
      {(["all", "backend", "ai", "data", "frontend", "infra"] as const).map((category) => <button key={category} type="button" className={`filter-chip ${filter === category ? "active" : ""}`} onClick={() => onFilterChange(category)} data-testid={`skill-filter-${category}-button`}>{category === "all" ? "All systems" : category === "ai" ? "AI / Agents" : category}</button>)}
    </div>
    <div className="skills-canvas-wrap">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Interactive draggable skills constellation" onPointerMove={onPointerMove} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)} data-testid="skills-constellation-svg">
        <defs><radialGradient id="skillGlow"><stop offset="0" stopColor="#35e7c7" stopOpacity=".18" /><stop offset="1" stopColor="#35e7c7" stopOpacity="0" /></radialGradient></defs>
        <circle cx={width / 2} cy={height / 2} r="160" fill="url(#skillGlow)" />
        {nodes.map((node) => {
          const visible = filter === "all" || filter === node.category;
          return <g key={node.id} className={`skill-node ${visible ? "visible" : "muted"}`} transform={`translate(${node.x},${node.y})`} onPointerDown={(event) => { event.stopPropagation(); setDragging(node.id); }} tabIndex={visible ? 0 : -1} role="button" aria-label={`${node.id}, ${node.category}, proficiency ${node.level} out of 10`} data-testid={`skill-node-${node.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
            <line x1={width / 2 - node.x} y1={height / 2 - node.y} x2="0" y2="0" stroke={colors[node.category]} strokeOpacity={visible ? 0.24 : 0.05} strokeWidth="1" />
            <circle r={4 + node.level * 1.05} fill={colors[node.category]} fillOpacity={visible ? 0.86 : 0.12} />
            <circle r={7 + node.level * 1.05} fill="none" stroke={colors[node.category]} strokeOpacity={visible ? 0.24 : 0.04} />
            <text y={24 + node.level * 0.3} textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="IBM Plex Mono, monospace">{node.id}</text>
          </g>;
        })}
        <circle cx={width / 2} cy={height / 2} r="7" fill="#e9eef4" /><circle cx={width / 2} cy={height / 2} r="14" fill="none" stroke="#ffa645" strokeOpacity=".5" /><text x={width / 2} y={height / 2 + 30} textAnchor="middle" fill="#8592a3" fontSize="10" fontFamily="IBM Plex Mono, monospace">SYSTEM CORE</text>
      </svg>
      <div className="skills-legend" aria-label="Skill category legend" data-testid="skills-legend">{(Object.keys(colors) as SkillCategory[]).map((category) => <span key={category} data-testid={`skill-legend-${category}`}><i style={{ background: colors[category] }} />{category}</span>)}</div>
      <p className="drag-note" data-testid="skills-drag-instruction">drag nodes · physics settles on release</p>
    </div>
  </div>;
}

CommandPallete.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Clipboard, FileText, Github, Terminal, Zap } from "lucide-react";

export interface PaletteAction { id: string; label: string; hint: string; icon: typeof Terminal; action: () => void }
interface CommandPaletteProps { open: boolean; onClose: () => void; onAction: (id: string) => void }

export default function CommandPalette({ open, onClose, onAction }: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const actions = useMemo<PaletteAction[]>(() => [
    { id: "projects", label: "jump to projects", hint: "section", icon: ArrowUpRight, action: () => onAction("projects") },
    { id: "skills", label: "inspect the stack", hint: "section", icon: Zap, action: () => onAction("skills") },
    { id: "contact", label: "open contact terminal", hint: "section", icon: Terminal, action: () => onAction("contact") },
    { id: "resume", label: "open resume", hint: "/resume.pdf", icon: FileText, action: () => onAction("resume") },
    { id: "copy-email", label: "copy email", hint: "clipboard", icon: Clipboard, action: () => onAction("copy-email") },
    { id: "github", label: "view GitHub", hint: "mohitlamba65", icon: Github, action: () => onAction("github") },
  ], [onAction]);
  const filtered = actions.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => { if (open) { setQuery(""); window.requestAnimationFrame(() => inputRef.current?.focus()); } }, [open]);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && open) onClose(); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [onClose, open]);

  return <AnimatePresence>{open && <motion.div className="palette-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose} data-testid="command-palette-overlay"><motion.div className="command-palette" initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Command palette" data-testid="command-palette-dialog"><div className="palette-topline"><span><Terminal size={14} /> mohit@systems:~$</span><kbd>ESC</kbd></div><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && filtered[0]) filtered[0].action(); }} placeholder="type a command..." aria-label="Search commands" data-testid="command-palette-input" /><div className="palette-list" data-testid="command-palette-results">{filtered.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" className="palette-item" onClick={item.action} data-testid={`command-${item.id}-button`}><Icon size={16} /><span>{item.label}</span><small>{item.hint}</small></button>; })}{filtered.length === 0 && <p className="palette-empty" data-testid="command-palette-empty">no matching command</p>}</div><div className="palette-footer"><span>↑↓ navigate · enter run</span><span>⌘ K</span></div></motion.div></motion.div>}</AnimatePresence>;
}

index.html

<html lang="en" class="dark">
    <meta name="description" content="Mohit Lamba builds backend systems, AI agents, and data pipelines that hold up in production." />
    <title>Mohit Lamba — Backend & AI Systems Engineer</title>