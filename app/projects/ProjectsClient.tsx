'use client';

import { useEffect, useMemo, useState, type ElementType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    ArrowDownAZ,
    ArrowRight,
    BookOpen,
    Boxes,
    Clock,
    Compass,
    ExternalLink,
    GitBranch,
    GitFork,
    Globe,
    Lightbulb,
    Loader,
    Rocket,
    ShieldCheck,
    Star,
    Timer,
    Zap,
} from 'lucide-react';
import { REPO_NARRATIVES, type RepoCategory, type RepoStatus } from '@/lib/repo-narratives';
import './projects.css';

const GITHUB_USERNAME = 'madanlalit';
const DAY_MS = 24 * 60 * 60 * 1000;
const EXCLUDED_REPOS: string[] = [
    // Matching is case-insensitive and supports "repo-name" or "owner/repo-name".
    'arc-cli',
    'cdp-cli',
    'i-scrape',
    'iscrape',
    'parameter-golf',
    'archon',
    'opentelemetry-python',
    'gemini-cli',
    'langchain',
];
const EXCLUDED_REPO_NAMES = new Set(EXCLUDED_REPOS.map((repo) => repo.toLowerCase()));

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
    shipped: { label: 'SHIPPED', className: 'badge-shipped' },
    experiment: { label: 'EXPERIMENT', className: 'badge-experiment' },
    learning: { label: 'LEARNING', className: 'badge-learning' },
    maintenance: { label: 'MAINTENANCE', className: 'badge-maintenance' },
    archived: { label: 'ARCHIVED', className: 'badge-archived' },
};

const CATEGORY_META: Record<
    RepoCategory,
    { label: string; shortLabel: string; icon: ElementType; desc: string; thesis: string }
> = {
    building: {
        label: 'Currently Building',
        shortLabel: 'Build',
        icon: Rocket,
        desc: 'Active work that is still changing shape.',
        thesis: 'Projects in motion: useful enough to keep alive, unfinished enough to keep improving.',
    },
    shipped: {
        label: 'Shipped Systems',
        shortLabel: 'Ship',
        icon: Zap,
        desc: 'Tools that reached a stable useful form.',
        thesis: 'Small durable utilities and systems that survived contact with real usage.',
    },
    experiment: {
        label: 'Research Lab',
        shortLabel: 'Lab',
        icon: Lightbulb,
        desc: 'Prototypes built to answer a specific question.',
        thesis: 'The weird shelf: screen agents, accessibility tools, scrapers, and proofs of concept.',
    },
    oss: {
        label: 'Source Studies',
        shortLabel: 'Study',
        icon: BookOpen,
        desc: 'Open-source forks used as reading material.',
        thesis: 'A reading list made of codebases: agent frameworks, runtimes, and infrastructure patterns.',
    },
};

const CATEGORY_ORDER: RepoCategory[] = ['building', 'shipped', 'experiment', 'oss'];

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

const isExcludedRepo = (repo: PublicRepo) => {
    const name = repo.name.toLowerCase();
    const fullName = repo.fullName.toLowerCase();
    return EXCLUDED_REPO_NAMES.has(name) || EXCLUDED_REPO_NAMES.has(fullName);
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
        <section className="pulse-panel" aria-label="GitHub contribution pulse">
            <div className="pulse-copy">
                <span className="atlas-kicker">
                    <Activity size={13} />
                    Contribution Pulse
                </span>
                <p>{total} contributions across {activeDays} active days. Peak: {peak}/day. Synced {synced}.</p>
            </div>
            <div className="pulse-map-wrap">
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
        </section>
    );
}

function MetricTile({
    icon: Icon,
    value,
    label,
}: {
    icon: ElementType;
    value: string | number;
    label: string;
}) {
    return (
        <div className="metric-tile">
            <Icon size={14} />
            <strong>{value}</strong>
            <span>{label}</span>
        </div>
    );
}

function SpotlightDossier({ repo }: { repo: PublicRepo | undefined }) {
    if (!repo) return null;

    const narrative = REPO_NARRATIVES[repo.name];
    if (!narrative) return null;

    const activity = getActivity(repo.pushedAt);
    const badge = STATUS_CONFIG[narrative.status];

    return (
        <motion.article
            className="spotlight-dossier"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <div className="dossier-header">
                <span className="atlas-kicker">
                    <Compass size={13} />
                    Selected Dossier
                </span>
                <span className={`status-badge ${badge.className}`}>{badge.label}</span>
            </div>

            <h2>{repo.name}</h2>
            <p className="dossier-story">{narrative.story}</p>

            <div className="dossier-facts">
                <span><Activity size={11} /> {getActivity(repo.pushedAt)}</span>
                <span><Clock size={11} /> {timeAgo(repo.pushedAt)}</span>
                <span><Star size={11} /> {repo.stars}</span>
                <span><GitBranch size={11} /> {repo.forks}</span>
            </div>

            {narrative.highlights && narrative.highlights.length > 0 && (
                <div className="dossier-tags">
                    {narrative.highlights.slice(0, 3).map((highlight) => (
                        <span key={highlight}>{highlight}</span>
                    ))}
                </div>
            )}

            <div className="dossier-origin">
                <span>Why it exists</span>
                <p>{narrative.origin}</p>
            </div>

            <div className="dossier-actions">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="atlas-link primary">
                    Open source <ExternalLink size={12} />
                </a>
                {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="atlas-link">
                        Live surface <Globe size={12} />
                    </a>
                )}
            </div>
        </motion.article>
    );
}

function ChapterNavigator({
    summaries,
    activeCategory,
    setActiveCategory,
}: {
    summaries: Array<{ category: RepoCategory; repos: PublicRepo[] }>;
    activeCategory: RepoCategory;
    setActiveCategory: (category: RepoCategory) => void;
}) {
    const active = summaries.find((summary) => summary.category === activeCategory) ?? summaries[0];
    const activePreview = active?.repos.slice(0, 4) ?? [];
    const meta = CATEGORY_META[active.category];
    const Icon = meta.icon;

    return (
        <section className="chapter-navigator" aria-label="Project chapters">
            <div className="chapter-tabs">
                {summaries.map(({ category, repos }) => {
                    const config = CATEGORY_META[category];
                    const TabIcon = config.icon;
                    return (
                        <button
                            key={category}
                            type="button"
                            className={`chapter-tab${activeCategory === category ? ' active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            <TabIcon size={14} />
                            <span>{config.shortLabel}</span>
                            <strong>{repos.length}</strong>
                        </button>
                    );
                })}
            </div>

            <div className="chapter-stage">
                <div className="chapter-stage-copy">
                    <span className="atlas-kicker">
                        <Icon size={13} />
                        {meta.label}
                    </span>
                    <h2>{meta.thesis}</h2>
                    <a href={`#work-${active.category}`} className="atlas-link">
                        Jump to chapter <ArrowRight size={12} />
                    </a>
                </div>

                <div className="chapter-preview-list">
                    {activePreview.length > 0 ? (
                        activePreview.map((repo) => {
                            const narrative = REPO_NARRATIVES[repo.name];
                            const activity = getActivity(repo.pushedAt);
                            return (
                                <a key={repo.id} href={repo.url} target="_blank" rel="noopener noreferrer" className="chapter-preview-row">
                                    <span>
                                        <strong>{repo.name}</strong>
                                        <small>{narrative.story}</small>
                                    </span>
                                    <ExternalLink size={12} />
                                </a>
                            );
                        })
                    ) : (
                        <span className="chapter-empty">No entries in this chapter yet.</span>
                    )}
                </div>
            </div>
        </section>
    );
}

function AtlasCard({ repo, lead = false }: { repo: PublicRepo; lead?: boolean }) {
    const narrative = REPO_NARRATIVES[repo.name];
    const [isFlipped, setIsFlipped] = useState(false);

    if (!narrative) return null;

    const badge = STATUS_CONFIG[narrative.status];
    const tags = narrative.highlights ?? repo.topics;

    return (
        <motion.article
            className={`atlas-card${lead ? ' lead' : ''}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35 }}
        >
            <AnimatePresence mode="wait">
                {isFlipped ? (
                    <motion.div
                        key="back"
                        className="atlas-card-content"
                        initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                        exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="build-notes-content">
                            <span>Current state</span>
                            <p>{narrative.currentState}</p>
                            {narrative.lessons.length > 0 && (
                                <>
                                    <span>Lessons</span>
                                    <p>{narrative.lessons.slice(0, 2).join(' / ')}</p>
                                </>
                            )}
                        </div>
                        <div className="build-notes-toggle-wrap">
                            <button className="build-notes-toggle" onClick={() => setIsFlipped(false)}>
                                Close build notes −
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="front"
                        className="atlas-card-content"
                        initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                        exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <header className="atlas-card-header">
                            <div>
                                <span>{repo.language && repo.language !== 'Unknown' ? repo.language : 'Repository'}</span>
                                <h3>{repo.name}</h3>
                            </div>
                            <span className={`status-badge ${badge.className}`}>{badge.label}</span>
                        </header>

                        <p className="atlas-card-story">{narrative.story}</p>

                        <div className="atlas-card-meta">
                            <span><Clock size={11} /> {repoAge(repo.createdAt)}</span>
                            <span><Activity size={11} /> {timeAgo(repo.pushedAt)}</span>
                            <span><Star size={11} /> {repo.stars}</span>
                            <span><GitBranch size={11} /> {repo.forks}</span>
                        </div>

                        {tags.length > 0 && (
                            <div className="atlas-tags">
                                {tags.slice(0, lead ? 4 : 3).map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        )}

                        <div className="build-notes-toggle-wrap">
                            <button className="build-notes-toggle" onClick={() => setIsFlipped(true)}>
                                Read build notes +
                            </button>
                        </div>

                        <footer className="atlas-card-actions">
                            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="atlas-link primary">
                                Source <ExternalLink size={12} />
                            </a>
                            {repo.homepage && (
                                <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="atlas-link">
                                    Live <Globe size={12} />
                                </a>
                            )}
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
}

function ChapterSection({ category, repos }: { category: RepoCategory; repos: PublicRepo[] }) {
    if (repos.length === 0) return null;

    const config = CATEGORY_META[category];
    const Icon = config.icon;
    const [lead, ...rest] = repos;

    return (
        <section className="atlas-chapter" id={`work-${category}`}>
            <div className="chapter-heading">
                <span className="chapter-number">0{CATEGORY_ORDER.indexOf(category) + 1}</span>
                <div>
                    <span className="atlas-kicker">
                        <Icon size={13} />
                        {config.label}
                    </span>
                    <h2>{config.thesis}</h2>
                    <p>{config.desc}</p>
                </div>
            </div>

            <div className="chapter-card-grid">
                <AtlasCard repo={lead} lead />
                {rest.map((repo) => (
                    <AtlasCard key={repo.id} repo={repo} />
                ))}
            </div>
        </section>
    );
}

function RepoIndexCard({ repo }: { repo: PublicRepo }) {
    const age = repoAge(repo.createdAt);
    const narrative = REPO_NARRATIVES[repo.name];
    const topics = repo.language && repo.language !== 'Unknown'
        ? [repo.language, ...repo.topics]
        : repo.topics;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`index-card${repo.archived ? ' muted' : ''}`}
        >
            <header>
                <div>
                    <span>{repo.language && repo.language !== 'Unknown' ? repo.language : 'Repository'}</span>
                    <strong>{repo.name}</strong>
                </div>
                <div className="index-card-links">
                    {repo.homepage && (
                        <a href={repo.homepage} target="_blank" rel="noopener noreferrer" title="Live">
                            <Globe size={13} />
                        </a>
                    )}
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" title="Source">
                        <ExternalLink size={13} />
                    </a>
                </div>
            </header>

            <p>{repo.description}</p>

            {topics.length > 0 && (
                <div className="index-topics">
                    {topics.slice(0, 5).map((topic) => (
                        <span key={topic}>{topic}</span>
                    ))}
                </div>
            )}

            <footer>
                <span><Star size={11} /> {repo.stars.toLocaleString()}</span>
                <span><GitBranch size={11} /> {repo.forks.toLocaleString()}</span>
                <span><Clock size={11} /> {age}</span>
                {repo.fork && <span><GitFork size={10} /> Fork</span>}
                {repo.archived && <span>Archived</span>}
                {narrative && <span>{STATUS_CONFIG[narrative.status].label}</span>}
            </footer>
        </motion.article>
    );
}

export default function ProjectsClient() {
    const [repos, setRepos] = useState<PublicRepo[]>([]);
    const [contributions, setContributions] = useState<GitHubContribution[]>([]);
    const [ghTotal, setGhTotal] = useState(0);
    const [ghUpdated, setGhUpdated] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('pushed');
    const [showIndex, setShowIndex] = useState(false);
    const [activeCategory, setActiveCategory] = useState<RepoCategory>('building');

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

                setRepos(raw.filter((r: PublicRepo) => r.owner.login === GITHUB_USERNAME && !isExcludedRepo(r)));
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
    const totalForks = useMemo(() => repos.reduce((s, r) => s + r.forks, 0), [repos]);

    const narrativeRepos = useMemo(
        () => repos.filter((r) => REPO_NARRATIVES[r.name] && !r.archived),
        [repos],
    );

    const chapterSummaries = useMemo(
        () => CATEGORY_ORDER.map((category) => ({
            category,
            repos: narrativeRepos.filter((repo) => REPO_NARRATIVES[repo.name].category === category),
        })),
        [narrativeRepos],
    );

    const featuredRepo = useMemo(
        () => chapterSummaries.find((summary) => summary.category === 'building')?.repos[0]
            ?? chapterSummaries.find((summary) => summary.category === 'shipped')?.repos[0]
            ?? narrativeRepos[0],
        [chapterSummaries, narrativeRepos],
    );

    if (loading) {
        return (
            <div className="work-page fade-in">
                <div className="work-loading">
                    <Loader className="spin" size={24} />
                    <span>Assembling project atlas...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="work-page fade-in">
                <div className="work-loading error">
                    <AlertCircle size={24} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="work-page fade-in">
            <section className="atlas-hero">
                <div className="hero-copy">
                    <span className="atlas-kicker">
                        <ShieldCheck size={13} />
                        Public Workbench
                    </span>
                    <h1>
                        Systems that hold up when you inspect the seams.
                    </h1>
                    <p>
                        A curated atlas of AI agents, robust tooling, and codebase studies organized by intent and built for the real world.
                    </p>

                    <div className="hero-actions">
                        <a href="https://github.com/madanlalit" target="_blank" rel="noopener noreferrer" className="atlas-link primary">
                            View GitHub <GitFork size={12} />
                        </a>
                        <button type="button" className="atlas-link" onClick={() => setShowIndex(true)}>
                            Browse full index <ArrowRight size={12} />
                        </button>
                    </div>
                </div>

                <SpotlightDossier repo={featuredRepo} />
            </section>

            <section className="atlas-metrics" aria-label="Repository metrics">
                <MetricTile icon={Boxes} value={repos.length} label="tracked repos" />
                <MetricTile icon={Zap} value={activeCount} label="active in 90d" />
                <MetricTile icon={Star} value={totalStars} label="stars" />
                <MetricTile icon={GitBranch} value={totalForks} label="forks" />
                <MetricTile icon={Activity} value={ghTotal.toLocaleString()} label="yearly contribs" />
            </section>

            <ActivityPulse
                cells={activity.cells}
                labels={activity.labels}
                total={activity.total}
                activeDays={activity.activeDays}
                peak={activity.peak}
                synced={lastSynced}
            />

            <ChapterNavigator
                summaries={chapterSummaries}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            <main className="atlas-chapters">
                {chapterSummaries.map(({ category, repos: chapterRepos }) => (
                    <ChapterSection key={category} category={category} repos={chapterRepos} />
                ))}
            </main>

            <section className="index-section">
                <button className="index-toggle" type="button" onClick={() => setShowIndex((s) => !s)}>
                    <span>{showIndex ? 'Close repository index' : 'Open repository index'}</span>
                    <strong>{filtered.length} repos</strong>
                </button>

                <AnimatePresence>
                    {showIndex && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.28 }}
                            className="index-panel"
                        >
                            <div className="index-controls">
                                <div className="control-group">
                                    <span>Filter</span>
                                    {languages.map((lang) => (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => setFilter(lang)}
                                            className={`ctrl-btn${filter === lang ? ' active' : ''}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>

                                <div className="control-group">
                                    <span>Sort</span>
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
                                            type="button"
                                            onClick={() => setSortBy(key)}
                                            className={`ctrl-btn${sortBy === key ? ' active' : ''}`}
                                        >
                                            <Icon size={12} /> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="index-grid">
                                <AnimatePresence mode="popLayout">
                                    {filtered.map((repo) => (
                                        <RepoIndexCard key={repo.id} repo={repo} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}
