import React, { useState, useEffect } from "react";
import PostCard from "../components/ui/PostCard";
import { usePosts } from "../hooks/usePosts";
import "./Home.css";

// --- CONFIGURATION ---
const GITHUB_USERNAME = "madanlalit"; // <--- REPLACE WITH YOUR USERNAME

// Types for GitHub Data
interface CommitData {
  id: string;
  message: string;
  date: Date;
  repo: string;
  url: string;
}

const Home: React.FC = () => {
  const { getAllPosts } = usePosts();
  const latestPosts = getAllPosts().slice(0, 3);
  const [time, setTime] = useState(new Date());

  // State for GitHub Data
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [activityMap, setActivityMap] = useState<number[]>(Array(30).fill(0));
  const [ghStatus, setGhStatus] = useState<"LOADING" | "ONLINE" | "OFFLINE">(
    "LOADING",
  );

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch GitHub Data
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events`,
        );

        if (!response.ok) throw new Error("API Limit or User Not Found");

        const events = await response.json();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const pushEvents = events.filter(
          (e: any) =>
            e.type === "PushEvent" && new Date(e.created_at) > thirtyDaysAgo,
        );

        // 1. Parse Commits for "Latest Logs"
        const recentCommits: CommitData[] = [];
        pushEvents.slice(0, 5).forEach((e: any) => {
          e.payload.commits.forEach((c: any) => {
            if (recentCommits.length < 5) {
              // Limit to 5 items
              recentCommits.push({
                id: c.sha.substring(0, 7),
                message: c.message,
                date: new Date(e.created_at),
                repo: e.repo.name,
                url: `https://github.com/${e.repo.name}`,
              });
            }
          });
        });

        // 2. Calculate Heatmap Density (Commits per day)
        const dailyCounts = Array(30).fill(0);
        pushEvents.forEach((e: any) => {
          const eventDate = new Date(e.created_at);
          const dayDiff = Math.floor(
            (new Date().getTime() - eventDate.getTime()) / (1000 * 3600 * 24),
          );
          if (dayDiff < 30) {
            dailyCounts[29 - dayDiff] += e.payload.commits.length; // Fill from right (today) to left
          }
        });

        setCommits(recentCommits);
        setActivityMap(dailyCounts);
        setGhStatus("ONLINE");
      } catch (error) {
        console.error(error);
        setGhStatus("OFFLINE");
      }
    };

    fetchGithubData();
  }, []);

  // Helper for Heatmap Opacity
  const getIntensity = (count: number) => {
    if (count === 0) return 0.1; // Dim
    if (count <= 2) return 0.4;
    if (count <= 5) return 0.7;
    return 1; // Bright
  };

  return (
    <div className="home-container fade-in">
      {/* --- HERO SECTION --- */}
      <header className="hero-section">
        <div className="hero-main">
          <h1 className="hero-title">
            LALIT<span className="accent">_</span>MADAN
          </h1>
          <p className="hero-subtitle">
            Engineering Reality. Architecting Intelligence.
          </p>
        </div>

        <div className="hero-telemetry">
          <div className="tele-row">
            <span className="t-label">LOC</span>
            <span className="t-val">IND_REGION</span>
          </div>
          <div className="tele-row">
            <span className="t-label">TICK</span>
            <span className="t-val numeric">
              {time.toLocaleTimeString("en-GB", { hour12: false })}
            </span>
          </div>
          <div className="tele-row">
            <span className="t-label">NET</span>
            <span className={`t-val ${ghStatus === "ONLINE" ? "active" : ""}`}>
              {ghStatus}
            </span>
          </div>
        </div>
      </header>

      <main className="sys-grid">
        {/* [LEFT COL] CONTEXT */}
        <aside className="grid-sidebar">
          <div className="sys-module">
            <div className="mod-header">/// SYSTEM_DESCRIPTION</div>
            <p className="mod-text">
              Full-stack engineer building digital systems that bridge logic and
              creativity.
            </p>
            <div className="status-indicator">
              <span className="status-dot pulse"></span>
              <span>FOCUS: Agentic Workflows</span>
            </div>
          </div>

          <div className="sys-module">
            <div className="mod-header">/// RUNTIME_ENV</div>
            <div className="tag-cloud">
              {["React", "Javascript", "Python", "Docker"].map((t) => (
                <span key={t} className="sys-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="sys-module">
            <div className="mod-header">/// COMM_PORTS</div>
            <div className="comm-grid">
              <a
                href="https://github.com/madanlalit/"
                className="comm-link"
                target="_blank"
              >
                GITHUB
              </a>
              <a
                href="https://linkedin.com/in/madanlalit/"
                className="comm-link"
                target="_blank"
              >
                Linkedin
              </a>
              <a
                href="https://x.com/lalitmadan/"
                className="comm-link"
                target="_blank"
              >
                X / TW
              </a>
            </div>
          </div>
        </aside>

        {/* [RIGHT COL] DATA STREAMS */}
        <section className="grid-main">
          {/* 5. REAL GITHUB HEATMAP */}
          <div className="sys-module activity-wrapper">
            <div className="mod-header">
              <span>/// COMMIT_HISTORY</span>
              <span className="mod-meta">LAST_30_DAYS</span>
            </div>

            {/* The Visual Heatmap */}
            <div className="heatmap-strip">
              {activityMap.map((count, i) => (
                <div
                  key={i}
                  className="heat-bit"
                  style={{
                    opacity: getIntensity(count),
                    backgroundColor:
                      count > 0 ? "var(--accent)" : "var(--text-tertiary)",
                  }}
                  title={`${count} commits`}
                ></div>
              ))}
            </div>

            {/* The Commit Log List */}
            <div className="commit-log-list">
              {ghStatus === "LOADING" && (
                <div className="loading-text">ESTABLISHING CONNECTION...</div>
              )}
              {ghStatus === "OFFLINE" && (
                <div className="loading-text">
                  CONNECTION FAILED: RATE_LIMIT_EXCEEDED
                </div>
              )}

              {commits.map((commit) => (
                <div key={commit.id} className="commit-row">
                  <span className="c-id">{commit.id}</span>
                  <span className="c-repo">[{commit.repo}]</span>
                  <span className="c-msg">{commit.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. LATEST BLOG POSTS */}
          <div className="sys-module">
            <div className="mod-header">
              <span>/// SYSTEM_[B]LOGS</span>
              <span className="mod-meta">[{latestPosts.length}]</span>
            </div>

            <div className="logs-timeline">
              {latestPosts.map((post, index) => (
                <div key={post.id} className="timeline-entry">
                  <div className="timeline-marker">
                    <div className="t-dot"></div>
                    <div className="t-line"></div>
                  </div>
                  <div className="timeline-content">
                    <div className="clean-card">
                      <PostCard post={post} index={index} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="sys-footer">
        <div className="f-left">
          <span className="f-item">SYS_ID: 0x1A4</span>
          <span className="f-item">REACT_DOM</span>
        </div>
        <div className="f-right">
          <a href="/rss">RSS</a>
          <span className="sep">/</span>
          <a href="/sitemap">MAP</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
