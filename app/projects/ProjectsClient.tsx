'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    ArrowDownAZ,
    Clock,
    Code,
    ExternalLink,
    GitBranch,
    GitFork,
    Globe,
    Loader,
    Star,
    Timer,
} from 'lucide-react';
import { REPO_NARRATIVES, type RepoStatus } from '@/lib/repo-narratives';
import './projects.css';

const GITHUB_USERNAME = 'madanlalit';
const DAY_MS = 24 * 60 * 60 * 1000;

// --- Types ---

interface PublicRepo {
    id: string;
    name: string;
    fullName: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
    topics: string[];
    owner: { login: string; avatarUrl: string };
    archived: boolean;
    fork: boolean;
    homepage: string | null;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
}

interface GitHubContribution {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

type SortOption = 'pushed' | 'stars' | 'forks' | 'name';

const STATUS_CONFIG: Record<RepoStatus, { label: string; className: string }> = {
    shipping: { label: 'SHIPPING', className: 'badge-shipping' },
    experiment: { label: 'EXPERIMENT', className: 'badge-experiment' },
    learning: { label: 'LEARNING', className: 'badge-learning' },
    maintenance: { label: 'MAINTENANCE', className: 'badge-maintenance' },
};

// --- Helpers ---

const formatDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(diff / DAY_MS);
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
};

const repoAge = (createdAt: string): string => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const years = Math.floor(diff / (DAY_MS * 365));
    if (years > 0) return `${years}y old`;
    const months = Math.floor(diff / (DAY_MS * 30));
    if (months > 0) return `${months}mo old`;
    const days = Math.floor(diff / DAY_MS);
    return days > 0 ? `${days}d old` : 'new';
};

const getActivity = (pushedAt: string): 'recent' | 'moderate' | 'idle' => {
    const days = (Date.now() - new Date(pushedAt).getTime()) / DAY_MS;
    if (days < 30) return 'recent';
    if (days < 180) return 'moderate';
    return 'idle';
};

const buildActivity = (contributions: GitHubContribution[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - 364);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    const totalDays = Math.floor((today.getTime() - start.getTime()) / DAY_MS) + 1;
    const map = new Map(contributions.map((c) => [c.date, c]));
    const labels: Array<{ label: string; column: number }> = [];
    const cells = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date(start.getTime() + i * DAY_MS);
        const key = formatDateKey(date);
        const entry = map.get(key);
        const count = entry?.count ?? 0;
        if (date.getDate() <= 7) {
            const col = Math.floor(i / 7);
            const label = date.toLocaleDateString('en-US', { month: 'short' });
            const prev = labels[labels.length - 1];
            if (!prev || prev.label !== label) labels.push({ label, column: col });
        }
        return {
            key,
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            count,
            level: entry?.level ?? 0,
        };
    });
    return {
        cells,
        labels,
        total: cells.reduce((s, c) => s + c.count, 0),
        activeDays: cells.filter((c) => c.count > 0).length,
        peak: Math.max(...cells.map((c) => c.count), 0),
    };
};

// --- ActivityPulse (compact heatmap) ---

function ActivityPulse({
    cells,
    labels,
    total,
    activeDays,
    peak,
    synced,
}: {
    cells: ReturnType<typeof buildActivity>['cells'];
    labels: ReturnType<typeof buildActivity>['labels'];
    total: number;
    activeDays: number;
    peak: number;
    synced: string;
}) {
    return (
        <div className="work-activity">
            <div className="activity-header">
                <span className="activity-title">
                    <Activity size={13} /> CONTRIBUTION_PULSE · LAST_52_WEEKS
                </span>
                <span className="activity-summary">
                    {total} contribs · {activeDays} days · peak {peak}/day · synced {synced}
                </span>
            </div>
            <div className="activity-months" aria-hidden="true">
                {labels.map((m) => (
                    <span
                        key={`${m.label}-${m.column}`}
                        className="activity-month"
                        style={{ gridColumn: `${m.column + 1}` }}
                    >
                        {m.label}
                    </span>
                ))}
            </div>
            <div className="activity-grid" role="img" aria-label="GitHub contribution heatmap">
                {cells.map((cell) => (
                    <div
                        key={cell.key}
                        className={`activity-cell lvl-${cell.level}`}
                        title={`${cell.label}: ${cell.count}`}
                    />
                ))}
            </div>
        </div>
    );
}

// --- StoryCard (featured narrative) ---

function StoryCard({ repo, num }: { repo: PublicRepo; num: number }) {
    const narrative = REPO_NARRATIVES[repo.name];
    if (!narrative) return null;

    const badge = STATUS_CONFIG[narrative.status];
    const activity = getActivity(repo.pushedAt);
    const age = repoAge(repo.createdAt);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 * num }}
            className="story-card"
        >
            <div className="story-num">{String(num).padStart(2, '0')}</div>
            <div className="story-main">
                <div className="story-header">
                    <h3 className="story-name">
                        <Code size={15} />
                        {repo.name}
                    </h3>
                    <span className={`status-badge ${badge.className}`}>{badge.label}</span>
                </div>

                <p className="story-text">{narrative.story}</p>

                {narrative.highlights.length > 0 && (
                    <ul className="story-highlights">
                        {narrative.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                        ))}
                    </ul>
                )}

                <div className="story-meta">
                    {repo.language && repo.language !== 'Unknown' && (
                        <span>{repo.language}</span>
                    )}
                    <span className="meta-dot" />
                    <span>{age}</span>
                    <span className="meta-dot" />
                    <span className={`activity-indicator activity-${activity}`} />
                    <span>pushed {timeAgo(repo.pushedAt)}</span>
                </div>

                <div className="story-actions">
                    {repo.stars > 0 && (
                        <span className="story-stat">
                            <Star size={13} /> {repo.stars}
                        </span>
                    )}
                    <span className="story-stat">
                        <GitBranch size={13} /> {repo.forks}
                    </span>
                    <span className="story-stat">{repo.language}</span>
                    <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="story-link"
                    >
                        SOURCE <ExternalLink size={12} />
                    </a>
                    {repo.homepage && (
                        <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="story-link demo"
                        >
                            DEMO <Globe size={12} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// --- OSSCard (open source contribution) ---

function OSSCard({ repo }: { repo: PublicRepo }) {
    const activity = getActivity(repo.pushedAt);
    const age = repoAge(repo.createdAt);
    const topics = repo.language && repo.language !== 'Unknown'
        ? [repo.language, ...repo.topics]
        : repo.topics;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="oss-card"
        >
            <div className="oss-header">
                <GitFork size={14} className="oss-icon" />
                <h3 className="oss-name">{repo.name}</h3>
                <span className="oss-badge">OSS</span>
            </div>

            <p className="oss-desc">{repo.description}</p>

            {topics.length > 0 && (
                <div className="oss-topics">
                    {topics.map((t) => (
                        <span
                            key={t}
                            className={t === repo.language ? 'oss-tag lang' : 'oss-tag'}
                        >
                            #{t}
                        </span>
                    ))}
                </div>
            )}

            <div className="oss-meta">
                <span className="oss-stat">
                    <Star size={12} /> {repo.stars}
                </span>
                <span className="oss-stat">
                    <GitBranch size={12} /> {repo.forks}
                </span>
                {repo.language && repo.language !== 'Unknown' && (
                    <span className="oss-stat">{repo.language}</span>
                )}
                <span className="meta-sep">|</span>
                <Clock size={11} />
                <span className="oss-stat">{age}</span>
                <span className="meta-sep">|</span>
                <span className={`activity-indicator activity-${activity}`} />
                <span className="oss-stat">pushed {timeAgo(repo.pushedAt)}</span>
            </div>

            <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="oss-link"
            >
                VIEW REPO <ExternalLink size={12} />
            </a>
        </motion.div>
    );
}

// --- RepoCard (index grid) ---

function RepoCard({ repo }: { repo: PublicRepo }) {
    const activity = getActivity(repo.pushedAt);
    const age = repoAge(repo.createdAt);
    const topics = repo.language && repo.language !== 'Unknown'
        ? [repo.language, ...repo.topics]
        : repo.topics;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={`repo-card${repo.archived ? ' muted' : ''}`}
        >
            <div className="rc-top">
                <span className="rc-name">{repo.name}</span>
                <div className="rc-activity">
                    {repo.fork && (
                        <span className="rc-fork-tag"><GitFork size={10} /> FORK</span>
                    )}
                    {repo.archived && <span className="rc-archive-tag">ARCHIVED</span>}
                    <span className={`activity-indicator activity-${activity}`} />
                    <span className="rc-pushed">{timeAgo(repo.pushedAt)}</span>
                </div>
            </div>

            <div className="rc-mid">
                <p className="rc-desc">{repo.description}</p>
                {topics.length > 0 && (
                    <div className="rc-topics">
                        {topics.map((t) => (
                            <span key={t} className={t === repo.language ? 'rc-tag lang' : 'rc-tag'}>
                                #{t}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="rc-bottom">
                <span className="rc-stat">
                    <Star size={12} /> {repo.stars.toLocaleString()}
                </span>
                <span className="rc-stat">
                    <GitBranch size={12} /> {repo.forks.toLocaleString()}
                </span>
                <span className="rc-stat rc-age">
                    <Clock size={11} /> {age}
                </span>
                <div className="rc-links">
                    {repo.homepage && (
                        <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="rc-link" title="Demo">
                            <Globe size={13} />
                        </a>
                    )}
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="rc-link" title="Source">
                        <ExternalLink size={13} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

// --- Main ---

export default function ProjectsClient() {
    const [repos, setRepos] = useState<PublicRepo[]>([]);
    const [contributions, setContributions] = useState<GitHubContribution[]>([]);
    const [ghTotal, setGhTotal] = useState(0);
    const [ghUpdated, setGhUpdated] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('pushed');

    useEffect(() => {
        (async () => {
            try {
                const [rRes, gRes] = await Promise.all([
                    fetch(`/public-repos.json?t=${Date.now()}`),
                    fetch(`/github-data.json?t=${Date.now()}`),
                ]);
                if (!rRes.ok) throw new Error('Failed to load repos');
                if (!gRes.ok) throw new Error('Failed to load activity');

                const { repos: raw } = await rRes.json();
                const gh = await gRes.json();

                setRepos(raw.filter((r: PublicRepo) => r.owner.login === GITHUB_USERNAME));
                setContributions(gh.contributions ?? []);
                setGhTotal(gh.total ?? 0);
                setGhUpdated(gh.lastUpdated ?? null);
            } catch (e) {
                console.error(e);
                setError('Failed to load repository data');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const languages = useMemo(
        () => ['ALL', ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean)))],
        [repos],
    );

    const filtered = useMemo(() => {
        let r = [...repos];
        if (filter !== 'ALL') r = r.filter((x) => x.language === filter);
        r.sort((a, b) => {
            switch (sortBy) {
                case 'stars': return b.stars - a.stars;
                case 'forks': return b.forks - a.forks;
                case 'name': return a.name.localeCompare(b.name);
                case 'pushed':
                default: return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
            }
        });
        return r;
    }, [repos, filter, sortBy]);

    const activity = useMemo(() => buildActivity(contributions), [contributions]);

    const lastSynced = useMemo(() => {
        if (!ghUpdated) return 'unknown';
        return new Date(ghUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }, [ghUpdated]);

    const activeCount = useMemo(
        () => repos.filter((r) => !r.archived && Date.now() - new Date(r.pushedAt).getTime() < 90 * DAY_MS).length,
        [repos],
    );

    const totalStars = useMemo(() => repos.reduce((s, r) => s + r.stars, 0), [repos]);

    const storyRepos = useMemo(
        () => repos.filter((r) => REPO_NARRATIVES[r.name] && !r.fork && !r.archived),
        [repos],
    );

    const ossRepos = useMemo(
        () => repos.filter((r) => r.fork && !r.archived),
        [repos],
    );

    // --- Loading ---
    if (loading) {
        return (
            <div className="work-page fade-in">
                <div className="grid-bg" />
                <header className="work-hero">
                    <h1 className="work-title">./WORK /// THE_BENCH</h1>
                    <p className="work-intro">BOOTING_UP...</p>
                </header>
                <div className="work-loading">
                    <Loader className="spin" size={24} />
                    <span>FETCHING REPOSITORIES...</span>
                </div>
            </div>
        );
    }

    // --- Error ---
    if (error) {
        return (
            <div className="work-page fade-in">
                <div className="grid-bg" />
                <header className="work-hero">
                    <h1 className="work-title">./WORK /// THE_BENCH</h1>
                    <p className="work-intro">SYSTEM_ERROR</p>
                </header>
                <div className="work-loading error">
                    <AlertCircle size={24} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    // --- Main ---
    return (
        <div className="work-page fade-in">
            <div className="grid-bg" />

            {/* ── Hero ── */}
            <header className="work-hero">
                <h1 className="work-title">./WORK /// THE_BENCH</h1>
                <p className="work-intro">
                    A collection of what I&apos;m building, contributing to, and learning from.
                    Each project has a story.
                </p>
                <div className="work-stats">
                    <div className="work-stat"><strong>{repos.length}</strong> repos</div>
                    <div className="work-stat"><strong>{totalStars}</strong> stars</div>
                    <div className="work-stat"><strong>{activeCount}</strong> active</div>
                    <div className="work-stat"><strong>{ghTotal.toLocaleString()}</strong> contribs</div>
                </div>

                <ActivityPulse
                    cells={activity.cells}
                    labels={activity.labels}
                    total={activity.total}
                    activeDays={activity.activeDays}
                    peak={activity.peak}
                    synced={lastSynced}
                />
            </header>

            {/* ── Stories ── */}
            {storyRepos.length > 0 && (
                <section className="work-section">
                    <div className="section-divider">
                        <span>STORIES</span>
                    </div>
                    <div className="stories-list">
                        {storyRepos.map((repo, i) => (
                            <StoryCard key={repo.id} repo={repo} num={i + 1} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Open Source ── */}
            {ossRepos.length > 0 && (
                <section className="work-section">
                    <div className="section-divider">
                        <span>OPEN_SOURCE</span>
                    </div>
                    <div className="oss-grid">
                        {ossRepos.map((repo) => (
                            <OSSCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Index ── */}
            <section className="work-section">
                <div className="section-divider">
                    <span>INDEX</span>
                </div>

                <div className="index-controls">
                    <div className="control-group">
                        <span className="control-label">FILTER:</span>
                        {languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setFilter(lang)}
                                className={`ctrl-btn${filter === lang ? ' active' : ''}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    <div className="control-group">
                        <span className="control-label">SORT:</span>
                        {(
                            [
                                ['pushed', 'Recent', Timer],
                                ['stars', 'Stars', Star],
                                ['forks', 'Forks', GitBranch],
                                ['name', 'Name', ArrowDownAZ],
                            ] as const
                        ).map(([key, label, Icon]) => (
                            <button
                                key={key}
                                onClick={() => setSortBy(key)}
                                className={`ctrl-btn${sortBy === key ? ' active' : ''}`}
                            >
                                <Icon size={12} /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="repo-grid">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((repo) => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}