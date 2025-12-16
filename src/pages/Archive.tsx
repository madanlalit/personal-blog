import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { usePosts } from "../hooks/usePosts";
import "./Archive.css";

// --- Helper: Generate pseudo-random "System Hash" for posts ---
const generateHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = (hash << 5) - hash + str.charCodeAt(i);
  return "0x" + Math.abs(hash).toString(16).substring(0, 6).toUpperCase();
};

const Archive: React.FC = () => {
  const navigate = useNavigate();
  const { getAllPosts } = usePosts();
  const allPosts = getAllPosts();

  // State
  const [viewMode, setViewMode] = useState<"LIST" | "GRID">("LIST");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get all unique tags
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags || [])));

  // Filtering Logic
  const filteredPosts = useMemo(() => {
    return allPosts
      .filter((post) => {
        const matchesSearch = post.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesTag = activeTag ? post.tags?.includes(activeTag) : true;
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allPosts, searchQuery, activeTag]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredPosts.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredPosts.length) % filteredPosts.length,
        );
      } else if (e.key === "Enter") {
        if (filteredPosts[selectedIndex]) {
          navigate(`/post/${filteredPosts[selectedIndex].id}`);
        }
      } else if (e.key === "Escape") {
        setActiveTag(null);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredPosts, selectedIndex, navigate]);

  // Group by Year for List View
  const postsByYear = useMemo(() => {
    return filteredPosts.reduce(
      (acc, post) => {
        const year = new Date(post.date).getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
      },
      {} as Record<string, typeof filteredPosts>,
    );
  }, [filteredPosts]);

  return (
    <div className="archive-root">
      <div className="grid-overlay"></div>

      {/* --- 1. Dashboard HUD --- */}
      <header className="archive-hud">
        <div className="hud-title">
          <Terminal size={18} />
          <span>ARCHIVE_DB // ACCESS_LEVEL: PUBLIC</span>
        </div>
        <div className="hud-stats">
          <div className="stat-pill">
            <span className="label">TOTAL_ENTRIES</span>
            <span className="value">{allPosts.length}</span>
          </div>
          <div className="stat-pill">
            <span className="label">SYSTEM_TAGS</span>
            <span className="value">{allTags.length}</span>
          </div>
        </div>
      </header>

      <div className="archive-body">
        {/* --- 2. Activity Heatmap (Visual Decoration) --- */}
        <section className="activity-section">
          <div className="section-label">ACTIVITY_LOG [LAST_12_MONTHS]</div>
          <div className="heatmap-grid">
            {Array.from({ length: 52 }).map((_, i) => (
              <div
                key={i}
                className="heat-cell"
                style={{ opacity: Math.random() > 0.7 ? 1 : 0.15 }}
              ></div>
            ))}
          </div>
        </section>

        {/* --- 3. Control Module --- */}
        <section className="control-module">
          <div className="search-wrapper">
            <span className="prompt">root@blog:~$</span>
            <input
              type="text"
              placeholder="query_database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={14} className="icon-right" />
          </div>

          <div className="view-toggles">
            <button
              className={`toggle-btn ${viewMode === "LIST" ? "active" : ""}`}
              onClick={() => setViewMode("LIST")}
            >
              <List size={14} /> LIST
            </button>
            <button
              className={`toggle-btn ${viewMode === "GRID" ? "active" : ""}`}
              onClick={() => setViewMode("GRID")}
            >
              <LayoutGrid size={14} /> GRID
            </button>
          </div>
        </section>

        {/* --- 4. Tag Filter Rail --- */}
        <div className="tag-rail">
          <button
            className={`tag-chip ${!activeTag ? "active" : ""}`}
            onClick={() => setActiveTag(null)}
          >
            [*] ALL
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`tag-chip ${activeTag === tag ? "active" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* --- 5. Main Content Area --- */}
        <main className="content-viewport">
          <AnimatePresence mode="wait">
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-buffer"
              >
                [!] ERR_NO_RESULTS_FOUND
              </motion.div>
            ) : viewMode === "LIST" ? (
              // --- LIST VIEW (File System) ---
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="view-list"
              >
                {Object.entries(postsByYear)
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))
                  .map(([year, posts]) => (
                    <div key={year} className="year-block">
                      <div className="year-marker">
                        <span className="bracket">[</span>
                        {year}
                        <span className="bracket">]</span>
                      </div>
                      <div className="file-tree">
                        {posts.map((post, index) => {
                          const isSelected =
                            post.id === filteredPosts[selectedIndex]?.id;
                          return (
                            <Link
                              to={`/post/${post.id}`}
                              key={post.id}
                              className={`file-row ${isSelected ? "selected" : ""}`}
                            >
                              <div className="col-meta">
                                <span className="hash">
                                  {generateHash(post.title)}
                                </span>
                                <span className="date">
                                  {new Date(post.date).toLocaleDateString(
                                    "en-US",
                                    { month: "2-digit", day: "2-digit" },
                                  )}
                                </span>
                              </div>
                              <div className="col-title">
                                {post.title}
                                <span className="ext">.md</span>
                              </div>
                              <div className="col-tags">
                                {post.tags?.slice(0, 2).map((t) => `#${t} `)}
                              </div>
                              {isSelected && (
                                <ChevronRight
                                  size={14}
                                  className="cursor-indicator"
                                />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </motion.div>
            ) : (
              // --- GRID VIEW (Data Cards) ---
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="view-grid"
              >
                {filteredPosts.map((post) => (
                  <Link
                    to={`/post/${post.id}`}
                    key={post.id}
                    className="grid-card"
                  >
                    <div className="card-header">
                      <span className="hash">{generateHash(post.title)}</span>
                      <div className="card-dots">
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="card-body">
                      <h3>{post.title}</h3>
                      <div className="meta-row">
                        <span>
                          <Calendar size={12} />{" "}
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <span>
                          <Clock size={12} /> 5m read
                        </span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <FileText size={14} /> OPEN_FILE
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <footer className="sys-footer">
        <span>KEYS: ↑↓ TO NAVIGATE // ENTER TO OPEN // ESC TO CLEAR</span>
      </footer>
    </div>
  );
};

export default Archive;
