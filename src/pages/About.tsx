import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Layers, Box, ArrowRight, CornerDownRight, Command } from 'lucide-react';
import './About.css';

// --- 1. Helper: "Decryption" Text Effect Component ---
const DecryptText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const [display, setDisplay] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    const handleHover = () => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                text.split('').map((letter, index) => {
                    if (index < iterations) return text[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 2; // Speed
        }, 30);
    };

    return (
        <span className={className} onMouseEnter={handleHover}>
            {display}
        </span>
    );
};

// --- 2. Main Component ---
type Tab = 'OVERVIEW' | 'EXPERIENCE' | 'STACK' | 'HARDWARE';

const About: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [time, setTime] = useState('');

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const tabs: Tab[] = ['OVERVIEW', 'EXPERIENCE', 'STACK', 'HARDWARE'];
            const currentIndex = tabs.indexOf(activeTab);

            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                setActiveTab(tabs[(currentIndex + 1) % tabs.length]);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                setActiveTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab]);

    // System Time & Mouse Tracking
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false }));
        };
        const updateMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

        const interval = setInterval(updateTime, 1000);
        window.addEventListener('mousemove', updateMouse);
        updateTime();

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', updateMouse);
        };
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'OVERVIEW': return <Overview />;
            case 'EXPERIENCE': return <Experience />;
            case 'STACK': return <StackTree />;
            case 'HARDWARE': return <Hardware />;
            default: return <Overview />;
        }
    };

    return (
        <div className="sys-container">
            {/* Background Grid */}
            <div className="grid-bg"></div>

            {/* Header HUD */}
            <header className="sys-header">
                <div className="sys-title">
                    <Terminal size={18} />
                    <span>SYS.ADMIN // <DecryptText text="LALIT_MADAN" /></span>
                </div>
                <div className="sys-meta">
                    <span className="blink">●</span> LIVE
                    <span className="divider">|</span>
                    MEM: 64%
                </div>
            </header>

            <div className="sys-body">
                {/* Sidebar */}
                <aside className="sys-sidebar">
                    <div className="sidebar-header">NAV_MODULE [keys: ↑↓]</div>
                    <nav>
                        {(['OVERVIEW', 'EXPERIENCE', 'STACK', 'HARDWARE'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
                            >
                                <span className="bracket">[</span>
                                <span className="nav-text">{tab}</span>
                                <span className="bracket">]</span>
                            </button>
                        ))}
                    </nav>
                    <div className="hotkey-hint">
                        <Command size={12} /> USE ARROW KEYS
                    </div>
                </aside>

                {/* Content Area */}
                <main className="sys-content">
                    <div className="content-frame">
                        <div className="frame-corner topleft"></div>
                        <div className="frame-corner topright"></div>
                        <div className="frame-corner bottomleft"></div>
                        <div className="frame-corner bottomright"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className="scroll-container"
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Footer HUD */}
            <footer className="sys-footer">
                <div className="coord">
                    X: {mousePos.x.toString().padStart(4, '0')} <span className="divider">|</span>
                    Y: {mousePos.y.toString().padStart(4, '0')}
                </div>
                <div className="sys-time">{time} UTC+12</div>
            </footer>
        </div>
    );
};

/* --- Sub-Components --- */

const Overview = () => (
    <div className="panel">
        <h1 className="glitch-header">
            <DecryptText text="INITIATING_SEQUENCE..." />
        </h1>
        <p className="lead">
            Hello, I'm <span className="highlight">Name</span>. I build minimal, reliable software for the web
            and explore the frontiers of Artificial Intelligence.
        </p>
        <hr className="dashed" />
        <div className="stats-grid">
            <div className="stat-box">
                <span className="stat-label">PROJECTS</span>
                <span className="stat-value">24</span>
            </div>
            <div className="stat-box">
                <span className="stat-label">CONTRIBS</span>
                <span className="stat-value">1.2k</span>
            </div>
            <div className="stat-box">
                <span className="stat-label">COFFEE</span>
                <span className="stat-value">∞</span>
            </div>
        </div>
        <div className="text-body">
            <p>
                My philosophy is simple: <strong>Complexity is the enemy</strong>.
                In my digital garden, I cultivate thoughts on software architecture,
                User Experience, and the ethics of AI.
            </p>
        </div>
    </div>
);

const Experience = () => (
    <div className="panel">
        <h3><Layers size={16} /> EXECUTION_LOG</h3>
        <ul className="log-list">
            <li className="log-entry">
                <span className="log-date">2025 // PRESENT</span>
                <div className="log-content">
                    <strong>Senior Engineer @ TechCorp</strong>
                    <p>Leading the AI Agents division. Optimized LLM context windows by 40%.</p>
                </div>
            </li>
            <li className="log-entry">
                <span className="log-date">2023 // 2024</span>
                <div className="log-content">
                    <strong>Full Stack Dev @ StartUp</strong>
                    <p>Shipped v1.0 of the core product using Next.js and PostgreSQL.</p>
                </div>
            </li>
        </ul>
    </div>
);

const StackTree = () => (
    <div className="panel">
        <h3><Cpu size={16} /> DEPENDENCY_TREE</h3>
        <div className="tree-view">
            <div className="tree-item root">root</div>
            <div className="tree-item branch">├── frontend</div>
            <div className="tree-item leaf">│   ├── react.js</div>
            <div className="tree-item leaf">│   ├── typescript</div>
            <div className="tree-item leaf">│   └── tailwind</div>
            <div className="tree-item branch">├── backend</div>
            <div className="tree-item leaf">│   ├── node.js</div>
            <div className="tree-item leaf">│   └── postgresql</div>
            <div className="tree-item branch">└── artificial_intelligence</div>
            <div className="tree-item leaf">    ├── python</div>
            <div className="tree-item leaf">    ├── openai_api</div>
            <div className="tree-item leaf">    └── langchain</div>
        </div>
    </div>
);

const Hardware = () => (
    <div className="panel">
        <h3><Box size={16} /> SYSTEM_SPECS</h3>
        <div className="kv-table">
            <div className="kv-row">
                <span className="key">MACHINE_ID</span>
                <span className="value">MacBook Pro M3</span>
            </div>
            <div className="kv-row">
                <span className="key">MEMORY</span>
                <span className="value">36GB Unified</span>
            </div>
            <div className="kv-row">
                <span className="key">INTERFACE</span>
                <span className="value">HHKB Hybrid Type-S</span>
            </div>
            <div className="kv-row">
                <span className="key">EDITOR</span>
                <span className="value">VS Code (Vim Mode)</span>
            </div>
            <div className="kv-row">
                <span className="key">THEME</span>
                <span className="value">Gruvbox Dark</span>
            </div>
        </div>
    </div>
);

export default About;