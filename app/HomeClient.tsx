'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import type { PostMeta } from '@/lib/types';
import PostCard from '@/components/ui/PostCard';
import './home.css';
import '@/components/ui/Typewriter.css';

// --- TYPES ---
import type { GitHubEvent } from '@/lib/github';

// --- TYPES ---


const SKILLS = [
    { name: 'Python / AI', level: 75 },
    { name: 'Typescript', level: 60 },
    { name: 'AWS / Cloud', level: 50 },
    { name: 'Next.js', level: 35 },
];

const SYSTEM_LOGS = [
    { id: 1, type: 'INFO', msg: 'Initializing system interface...' },
    { id: 2, type: 'SUCCESS', msg: 'Connected to GitHub API (Status: 200)' },
    { id: 3, type: 'WARN', msg: 'Coffee levels low (15%) - Refill advised' },
    { id: 4, type: 'INFO', msg: 'Loading latest project modules...' },
];

interface HomeClientProps {
    initialPosts: PostMeta[];
    githubData: {
        events: GitHubEvent[];
        lastUpdated: number;
    } | null;
}



// --- HELPER: PROCESS HEATMAP ---
const processHeatmap = (events: GitHubEvent[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize last 30 days with dates
    const dailyData = Array(30).fill(null).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (29 - i));
        return {
            count: 0,
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            iso: d.toISOString().split('T')[0]
        };
    });

    const dateMap = new Map();
    dailyData.forEach((d, i) => dateMap.set(d.iso, i));

    const contributionEvents = events.filter((e) => {
        if (e.type === 'PushEvent') return true;
        if (e.type === 'PullRequestEvent' && e.payload.action === 'opened') return true;
        if (e.type === 'IssuesEvent' && e.payload.action === 'opened') return true;
        if (e.type === 'CreateEvent') return true;
        return false;
    });

    contributionEvents.forEach((e) => {
        const eventDate = new Date(e.created_at);
        const isoDate = eventDate.toISOString().split('T')[0];

        if (dateMap.has(isoDate)) {
            const idx = dateMap.get(isoDate);
            let count = 0;

            if (e.type === 'PushEvent') {
                count = e.payload.commits ? e.payload.commits.length : 1;
            } else {
                count = 1;
            }

            dailyData[idx].count += count;
        }
    });

    return dailyData;
};

export default function HomeClient({ initialPosts, githubData }: HomeClientProps) {
    const [time, setTime] = useState<Date | null>(null);
    const [skillsAnimated, setSkillsAnimated] = useState(false);
    const [visibleLogs, setVisibleLogs] = useState<number[]>([]);

    // Derive state from props using useMemo
    const { activityMap, ghStatus, dataTimestamp } = useMemo(() => {
        if (githubData) {
            return {
                activityMap: processHeatmap(githubData.events),
                ghStatus: 'ONLINE' as const,
                dataTimestamp: githubData.lastUpdated
            };
        }
        return {
            activityMap: Array(30).fill({ count: 0, date: '' }),
            ghStatus: 'OFFLINE' as const,
            dataTimestamp: null
        };
    }, [githubData]);

    // --- LIVE CLOCK ---
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- SKILL BAR ANIMATION ---
    useEffect(() => {
        const timer = setTimeout(() => setSkillsAnimated(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // --- LOG TYPING EFFECT ---
    useEffect(() => {
        SYSTEM_LOGS.forEach((log, index) => {
            setTimeout(() => {
                setVisibleLogs((prev) => [...prev, log.id]);
            }, 500 + index * 400);
        });
    }, []);

    const getIntensity = (count: number) => {
        if (count === 0) return 0.1;
        if (count <= 2) return 0.4;
        if (count <= 5) return 0.7;
        return 1;
    };

    return (
        <div className="home-container fade-in">
            {/* --- HERO SECTION --- */}
            <header className="hero-section">
                <div className="hero-main">
                    <h1 className="hero-title">
                        LALIT<span className="accent">_</span>MADAN<span className="typewriter-cursor"></span>
                    </h1>
                    <div className="hero-subtitle">
                        Engineering Reality. Architecting Intelligence.
                    </div>

                    <div className="hero-actions">
                        <Link href="/projects" className="hero-btn primary">
                            <span className="bracket">[</span> EXECUTE_PROJECTS{' '}
                            <span className="bracket">]</span>
                        </Link>
                        <Link href="/about" className="hero-btn secondary">
                            ABOUT_ME
                        </Link>
                    </div>
                </div>

                <div className="hero-telemetry">
                    <div className="tele-row">
                        <span className="t-label">LOC</span>
                        <span className="t-val">INDIA</span>
                    </div>
                    <div className="tele-row">
                        <span className="t-label">TICK</span>
                        <span className="t-val numeric">
                            {time ? time.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </span>
                    </div>
                    <div className="tele-row">
                        <span className="t-label">NET</span>
                        <span className={`t-val ${ghStatus === 'ONLINE' ? 'active' : 'offline'}`}>
                            {ghStatus}
                        </span>
                    </div>
                </div>
            </header>

            <main className="sys-grid">
                {/* [LEFT COL] CONTEXT */}
                <aside className="grid-sidebar">
                    {/* 1. AVAILABILITY BEACON */}
                    <div className="sys-module">
                        <h2 className="mod-header">{'/// SYSTEM_STATUS'}</h2>
                        <div className="availability-beacon">
                            <div className="beacon-signal">
                                <span className="beacon-dot pulse"></span>
                                <span className="beacon-ring"></span>
                            </div>
                            <div className="beacon-text">
                                <span className="status-label">AVAILABLE_FOR_HIRE</span>
                                <span className="status-sub">Open for new roles</span>
                            </div>
                        </div>
                        <Link href="/about" className="beacon-action">
                            <Mail size={14} /> LEARN_MORE
                        </Link>
                    </div>

                    {/* 2. SKILL MONITOR */}
                    <div className="sys-module">
                        <h2 className="mod-header">{'/// SYSTEM_RESOURCES'}</h2>
                        <div className="skill-monitor">
                            {SKILLS.map((skill) => (
                                <div key={skill.name} className="skill-row">
                                    <div className="skill-info">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-val">{skill.level}%</span>
                                    </div>
                                    <div className="skill-track">
                                        <div
                                            className="skill-fill"
                                            style={{ width: skillsAnimated ? `${skill.level}%` : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sys-module">
                        <h2 className="mod-header">{'/// COMM_PORTS'}</h2>
                        <div className="comm-grid">
                            <a
                                href="https://github.com/madanlalit/"
                                className="comm-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                GITHUB
                            </a>
                            <a
                                href="https://linkedin.com/in/madanlalit/"
                                className="comm-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                LINKEDIN
                            </a>
                            <a
                                href="https://x.com/lalitmadan/"
                                className="comm-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                X
                            </a>
                        </div>
                    </div>
                </aside>

                {/* [RIGHT COL] DATA STREAMS */}
                <section className="grid-main">
                    {/* 4. LIVE SYSTEM LOG */}
                    <div className="sys-module">
                        <h2 className="mod-header">
                            <span>{'/// KERNEL_LOG'}</span>
                            <span className="mod-meta">TAIL -F</span>
                        </h2>
                        <div className="system-log-terminal">
                            {SYSTEM_LOGS.map((log) => (
                                <div
                                    key={log.id}
                                    className={`log-row ${visibleLogs.includes(log.id) ? 'log-visible' : 'log-hidden'}`}
                                >
                                    <span className="log-time">
                                        [{new Date().getHours()}:
                                        {String(new Date().getMinutes() - (SYSTEM_LOGS.length - log.id)).padStart(2, '0')}]
                                    </span>
                                    <span className={`log-type ${log.type}`}>{log.type}</span>
                                    <span className="log-msg">{log.msg}</span>
                                </div>
                            ))}
                            <div className="log-cursor">
                                <span className="blink">_</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. GITHUB HEATMAP MODULE */}
                    <div className="sys-module activity-wrapper">
                        <h2 className="mod-header">
                            <span>{'/// COMMIT_HISTORY'}</span>
                            {ghStatus === 'ONLINE' && dataTimestamp && (
                                <span className="mod-meta" style={{ color: 'var(--text-secondary)' }}>
                                    DATA_SYNCED:{' '}
                                    {new Date(dataTimestamp).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            )}
                            {ghStatus === 'OFFLINE' && (
                                <span className="mod-meta error-text">DATA_Unavailable</span>
                            )}

                        </h2>

                        <div className="heatmap-strip">
                            {activityMap.map((item, i) => (
                                <div
                                    key={i}
                                    className="heat-bit"
                                    style={{
                                        opacity: getIntensity(item.count),
                                        backgroundColor: item.count > 0 ? 'var(--accent)' : 'var(--text-tertiary)',
                                    }}
                                    title={`${item.count} contributions on ${item.date}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 6. LATEST BLOG POSTS */}
                    <div className="sys-module">
                        <h2 className="mod-header">
                            <span>{'/// SYSTEM_[B]LOGS'}</span>
                            <span className="mod-meta">[{initialPosts.length}]</span>
                        </h2>

                        <div className="logs-timeline">
                            {initialPosts.map((post, index) => (
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
                </div>
                <div className="f-right">
                    <span>v1.0.0</span>
                    <span className="sep">/</span>
                    <span>{new Date().getFullYear()}</span>
                </div>
            </footer>
        </div>
    );
}
