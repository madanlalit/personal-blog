'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code,
    ExternalLink,
    GitBranch,
    Star,
    Circle,
    Filter,
    Folder,
    Loader,
    AlertCircle,
    ArrowDownAZ,
    ArrowUpDown,
    Activity,
} from 'lucide-react';
import './projects.css';

// --- Constants ---
const GITHUB_USERNAME = 'madanlalit';
const MAX_DESCRIPTION_LENGTH = 100;
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
    owner: {
        login: string;
        avatarUrl: string;
    };
}

interface PublicReposData {
    lastUpdated: number;
    repos: PublicRepo[];
}

interface GitHubContribution {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubData {
    lastUpdated: number;
    source?: string;
    total?: number;
    contributions: GitHubContribution[];
}

interface ActivityDay {
    dateKey: string;
    label: string;
    count: number;
    level: number;
}

interface ActivitySummary {
    days: ActivityDay[];
    monthLabels: Array<{ label: string; column: number }>;
    totalContributions: number;
    activeDays: number;
    maxCount: number;
}

type SortOption = 'stars' | 'forks' | 'name';

// --- Helper ---
const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};

const formatDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const buildGithubActivity = (contributions: GitHubContribution[]): ActivitySummary => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    startDate.setHours(0, 0, 0, 0);

    const totalDays = Math.floor((today.getTime() - startDate.getTime()) / DAY_MS) + 1;
    const contributionMap = new Map(
        contributions.map((contribution) => [contribution.date, contribution])
    );

    const monthLabels: Array<{ label: string; column: number }> = [];
    const days: ActivityDay[] = Array.from({ length: totalDays }, (_, index) => {
        const date = new Date(startDate.getTime() + index * DAY_MS);
        const dateKey = formatDateKey(date);
        const contribution = contributionMap.get(dateKey);
        const count = contribution?.count ?? 0;

        if (date.getDate() <= 7) {
            const column = Math.floor(index / 7);
            const label = date.toLocaleDateString('en-US', { month: 'short' });
            const previous = monthLabels[monthLabels.length - 1];

            if (!previous || previous.label !== label) {
                monthLabels.push({ label, column });
            }
        }

        return {
            dateKey,
            label: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            count,
            level: contribution?.level ?? 0,
        };
    });

    const maxCount = Math.max(...days.map((day) => day.count), 0);

    return {
        days,
        monthLabels,
        totalContributions: days.reduce((sum, day) => sum + day.count, 0),
        activeDays: days.filter((day) => day.count > 0).length,
        maxCount,
    };
};

export default function ProjectsClient() {
    const [repos, setRepos] = useState<PublicRepo[]>([]);
    const [githubContributions, setGithubContributions] = useState<GitHubContribution[]>([]);
    const [githubLastUpdated, setGithubLastUpdated] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('stars');

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const [reposResponse, githubResponse] = await Promise.all([
                    fetch(`/public-repos.json?t=${Date.now()}`),
                    fetch(`/github-data.json?t=${Date.now()}`),
                ]);

                if (!reposResponse.ok) {
                    throw new Error('Failed to load public repos');
                }

                if (!githubResponse.ok) {
                    throw new Error('Failed to load GitHub activity');
                }

                const data: PublicReposData = await reposResponse.json();
                const githubData: GitHubData = await githubResponse.json();
                const myRepos = data.repos.filter(
                    (repo) => repo.owner.login === GITHUB_USERNAME
                );

                setRepos(myRepos);
                setGithubContributions(githubData.contributions ?? []);
                setGithubLastUpdated(githubData.lastUpdated ?? null);
            } catch (err) {
                console.error('Failed to load repository page data:', err);
                setError('Failed to load repositories');
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, []);

    const languages = useMemo(
        () => ['ALL', ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean)))],
        [repos]
    );

    const processedRepos = useMemo(() => {
        let result = filter === 'ALL' ? repos : repos.filter((r) => r.language === filter);

        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case 'stars':
                    return b.stars - a.stars;
                case 'forks':
                    return b.forks - a.forks;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return result;
    }, [repos, filter, sortBy]);

    const activity = useMemo(() => buildGithubActivity(githubContributions), [githubContributions]);
    const lastUpdatedLabel = useMemo(() => {
        if (!githubLastUpdated) return 'UNKNOWN';

        return new Date(githubLastUpdated).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }, [githubLastUpdated]);

    if (loading) {
        return (
            <div className="projects-page fade-in">
                <div className="grid-bg"></div>
                <header className="sys-header">
                    <h1 className="sys-title" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit' }}>
                        <Folder size={18} />
                        <span>./REPOSITORIES // MY_PROJECTS</span>
                    </h1>
                    <div className="sys-meta">LOADING...</div>
                </header>
                <main className="sys-content projects-loading">
                    <Loader className="spin" size={24} />
                    <span>Fetching repositories...</span>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-page fade-in">
                <div className="grid-bg"></div>
                <header className="sys-header">
                    <h1 className="sys-title" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit' }}>
                        <Folder size={18} />
                        <span>./REPOSITORIES // MY_PROJECTS</span>
                    </h1>
                    <div className="sys-meta">ERROR</div>
                </header>
                <main className="sys-content projects-error">
                    <AlertCircle size={24} />
                    <span>{error}</span>
                </main>
            </div>
        );
    }

    return (
        <div className="projects-page fade-in">
            <div className="grid-bg"></div>

            <header className="sys-header">
                <h1 className="sys-title" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit' }}>
                    <Folder size={18} />
                    <span>./REPOSITORIES // MY_PROJECTS</span>
                </h1>
                <div className="sys-meta">INDEXED: {processedRepos.length}</div>
            </header>

            <main className="sys-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <section className="github-activity-panel" aria-label="GitHub activity heatmap">
                    <div className="activity-panel-header">
                        <div className="activity-panel-title">
                            <Activity size={14} />
                            <span>GITHUB_CONTRIBUTIONS // LAST_52_WEEKS</span>
                        </div>
                        <div className="activity-panel-meta">SYNCED: {lastUpdatedLabel}</div>
                    </div>

                    <div className="activity-summary">
                        <span>{activity.totalContributions} contributions</span>
                        <span>{activity.activeDays} active days</span>
                        <span>peak {activity.maxCount}/day</span>
                    </div>

                    <div className="activity-heatmap-shell">
                        <div className="activity-months" aria-hidden="true">
                            {activity.monthLabels.map((month) => (
                                <span
                                    key={`${month.label}-${month.column}`}
                                    className="activity-month-label"
                                    style={{ gridColumn: `${month.column + 1}` }}
                                >
                                    {month.label}
                                </span>
                            ))}
                        </div>

                        <div className="activity-heatmap" role="img" aria-label="GitHub activity heatmap for the last 52 weeks">
                            {activity.days.map((day) => (
                                <div
                                    key={day.dateKey}
                                    className={`activity-cell level-${day.level}`}
                                    title={`${day.label}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
                                    aria-label={`${day.label}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <div className="repo-controls">
                    <div className="control-group">
                        <div className="control-label">
                            <Filter size={14} /> FILTER:
                        </div>
                        {languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setFilter(lang)}
                                className={`filter-btn ${filter === lang ? 'active' : ''}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>

                    <div className="control-group">
                        <div className="control-label">
                            <ArrowUpDown size={14} /> SORT:
                        </div>
                        <button
                            onClick={() => setSortBy('stars')}
                            className={`filter-btn ${sortBy === 'stars' ? 'active' : ''}`}
                        >
                            <Star size={12} /> Stars
                        </button>
                        <button
                            onClick={() => setSortBy('forks')}
                            className={`filter-btn ${sortBy === 'forks' ? 'active' : ''}`}
                        >
                            <GitBranch size={12} /> Forks
                        </button>
                        <button
                            onClick={() => setSortBy('name')}
                            className={`filter-btn ${sortBy === 'name' ? 'active' : ''}`}
                        >
                            <ArrowDownAZ size={12} /> Name
                        </button>
                    </div>
                </div>

                <div className="repo-grid">
                    <AnimatePresence mode="popLayout">
                        {processedRepos.map((repo) => (
                            <motion.div
                                layout
                                key={repo.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="repo-card"
                            >
                                <div className="repo-header">
                                    <span className="repo-title">
                                        <Code size={16} />
                                        {repo.name}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: 'var(--arch-muted)' }}>
                                        <span>{repo.id}</span>
                                        <Circle size={8} fill="var(--arch-accent)" stroke="none" />
                                    </div>
                                </div>

                                <div className="repo-body">
                                    <p className="repo-description">
                                        {truncateText(repo.description, MAX_DESCRIPTION_LENGTH)}
                                    </p>
                                    <div className="repo-tags">
                                        {repo.language && <span className="tech-tag lang-tag">#{repo.language}</span>}
                                        {repo.topics.slice(0, 2).map((topic) => (
                                            <span key={topic} className="tech-tag">
                                                #{topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="repo-footer">
                                    <div className="stat-group">
                                        <span className="stat-item">
                                            <Star size={12} /> {repo.stars.toLocaleString()}
                                        </span>
                                        <span className="stat-item">
                                            <GitBranch size={12} /> {repo.forks.toLocaleString()}
                                        </span>
                                    </div>
                                    <a
                                        href={repo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="repo-link"
                                    >
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
}
