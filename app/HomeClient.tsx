import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import type { PostMeta } from '@/lib/types';
import PostCard from '@/components/ui/PostCard';
import HomeClock from './HomeClock';
import HomeLogTime from './HomeLogTime';
import './home.css';

const SKILLS = [
    { name: 'Python / AI', level: 75 },
    { name: 'Typescript', level: 60 },
    { name: 'AWS / Cloud', level: 50 },
    { name: 'Next.js', level: 35 },
];

const SYSTEM_LOGS = [
    { id: 1, type: 'INFO', msg: 'Initializing system interface...' },
    { id: 2, type: 'SUCCESS', msg: 'Loaded local content index (Status: OK)' },
    { id: 3, type: 'WARN', msg: 'Coffee levels low (15%) - Refill advised' },
    { id: 4, type: 'INFO', msg: 'Loading latest project modules...' },
];

interface HomeClientProps {
    initialPosts: PostMeta[];
}

export default function HomeClient({ initialPosts }: HomeClientProps) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="home-container fade-in">
            {/* --- HERO SECTION --- */}
            <header className="hero-section">
                <div className="hero-main">
                    <h1 className="hero-identity">
                        <span>LALIT_MADAN</span>
                        <span className="identity-separator">/</span>
                        <span className="identity-role">AI Engineer. Python OSS.</span>
                    </h1>

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
                        <HomeClock className="t-val numeric" />
                    </div>
                    <div className="tele-row">
                        <span className="t-label">MODE</span>
                        <span className="t-val active">BUILD</span>
                    </div>
                </div>
            </header>

            <section className="signal-module" aria-labelledby="signal-title">
                <div className="signal-kicker">{'/// SIGNAL'}</div>
                <div className="signal-content">
                    <h2 id="signal-title">AI engineering notes from the build loop.</h2>
                    <p>
                        I write about AI engineering, context engineering, Python, and open-source tools for building reliable agentic systems.
                    </p>
                    <p>
                        This site is a public notebook of experiments, implementation notes, and lessons from working with LLMs, agents, automation, and developer workflows.
                    </p>
                </div>
            </section>

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
                                            style={{ '--skill-level': `${skill.level}%` } as CSSProperties}
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
                                href="https://x.com/madanlalit68/"
                                className="comm-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                X
                            </a>
                        </div>
                    </div>

                    {/* 4. NOW WORKING ON */}
                    <div className="sys-module">
                        <h2 className="mod-header">{'/// NOW_WORKING_ON'}</h2>
                        <div className="now-working">
                            <div className="nw-item">
                                <span className="nw-indicator pulse">●</span>
                                <span className="nw-text">Building AI agents</span>
                            </div>
                            <div className="nw-item">
                                <span className="nw-indicator">○</span>
                                <span className="nw-text">OSS contributions</span>
                            </div>
                            <div className="nw-item">
                                <span className="nw-indicator">○</span>
                                <span className="nw-text">Writing blogs</span>
                            </div>
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
                            {SYSTEM_LOGS.map((log, index) => (
                                <div
                                    key={log.id}
                                    className="log-row"
                                    style={{ '--log-delay': `${500 + index * 400}ms` } as CSSProperties}
                                >
                                    <HomeLogTime minuteOffset={index - SYSTEM_LOGS.length + 1} />
                                    <span className={`log-type ${log.type}`}>{log.type}</span>
                                    <span className="log-msg">{log.msg}</span>
                                </div>
                            ))}
                            <div className="log-cursor">
                                <span className="blink">_</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. LATEST BLOG POSTS */}
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
                    <span>{currentYear}</span>
                </div>
            </footer>
        </div>
    );
}
