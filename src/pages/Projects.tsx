import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  ExternalLink,
  GitBranch,
  Star,
  Circle,
  Filter,
  Folder,
  Database,
  Layout,
} from "lucide-react";
import "./Projects.css";

// --- Data ---
const projects = [
  {
    id: "PKG-01",
    title: "Neural_Visualizer",
    desc: "Real-time backpropagation visualization engine using WebGL.",
    tech: ["TypeScript", "WebGL", "Math"],
    stars: 124,
    forks: 32,
    status: "online",
    category: "AI",
  },
  {
    id: "PKG-02",
    title: "Crypto_Arb_Bot",
    desc: "High-frequency arbitrage trading bot for decentralized exchanges.",
    tech: ["Python", "Solidity", "Docker"],
    stars: 89,
    forks: 12,
    status: "offline",
    category: "Backend",
  },
  {
    id: "PKG-03",
    title: "System_Portfolio",
    desc: "The React-based TUI operating system you are currently browsing.",
    tech: ["React", "Framer Motion", "Vite"],
    stars: 256,
    forks: 45,
    status: "online",
    category: "Frontend",
  },
  {
    id: "PKG-04",
    title: "Rust_FS_Driver",
    desc: "In-memory virtual file system driver written for learning low-level systems.",
    tech: ["Rust", "Systems"],
    stars: 42,
    forks: 8,
    status: "archived",
    category: "Systems",
  },
];

const Projects: React.FC = () => {
  const [filter, setFilter] = useState("ALL");

  // Extract unique technologies for filter buttons
  const filters = [
    "ALL",
    ...Array.from(new Set(projects.flatMap((p) => p.category))),
  ];

  const filtered =
    filter === "ALL" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="projects-page fade-in">
      <div className="grid-bg"></div>

      <header className="sys-header">
        <div className="sys-title">
          <Folder size={18} />
          <span>./REPOSITORIES // PUBLIC</span>
        </div>
        <div className="sys-meta">INDEXED: {filtered.length}</div>
      </header>

      <main
        className="sys-content"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Filter Controls */}
        <div className="repo-controls">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.75rem",
              color: "var(--arch-muted)",
              marginRight: "10px",
            }}
          >
            <Filter size={14} /> FILTER_BY:
          </div>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn ${filter === f ? "active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="repo-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="repo-card"
              >
                <div className="repo-header">
                  <span className="repo-title">
                    {p.category === "Frontend" ? (
                      <Layout size={16} />
                    ) : p.category === "Backend" ? (
                      <Database size={16} />
                    ) : (
                      <Code size={16} />
                    )}
                    {p.title}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.7rem",
                      color: "var(--arch-muted)",
                    }}
                  >
                    <span>{p.id}</span>
                    <Circle
                      size={8}
                      fill={
                        p.status === "online"
                          ? "var(--arch-accent)"
                          : "transparent"
                      }
                      stroke={p.status === "online" ? "none" : "currentColor"}
                    />
                  </div>
                </div>

                <div className="repo-body">
                  {p.desc}
                  <div className="repo-tags">
                    {p.tech.map((t) => (
                      <span key={t} className="tech-tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="repo-footer">
                  <div className="stat-group">
                    <span className="stat-item">
                      <Star size={12} /> {p.stars}
                    </span>
                    <span className="stat-item">
                      <GitBranch size={12} /> {p.forks}
                    </span>
                  </div>
                  <a href="#" className="repo-link">
                    SOURCE <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Projects;
