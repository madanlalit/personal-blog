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
} from 'lucide-react';
import './projects.css';

// --- Constants ---
const GITHUB_USERNAME = 'madanlalit';
const MAX_DESCRIPTION_LENGTH = 100;

// --- Types ---
interface StarredRepo {
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

interface StarredReposData {
    lastUpdated: number;
    repos: StarredRepo[];
}

type SortOption = 'stars' | 'forks' | 'name';

// --- Helper ---
const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};

export default function ProjectsClient() {
    const [repos, setRepos] = useState<StarredRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('stars');

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch(`/starred-repos.json?t=${Date.now()}`);
                if (!response.ok) {
                    throw new Error('Failed to load starred repos');
                }
                const data: StarredReposData = await response.json();
                const myRepos = data.repos.filter(
                    (repo) => repo.owner.login === GITHUB_USERNAME
                );
                setRepos(myRepos);
            } catch (err) {
                console.error('Failed to load starred repos:', err);
                setError('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
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

    if (loading) {
        return (
            <div className="projects-page fade-in">
                <div className="grid-bg"></div>
                <header className="sys-header">
                    <div className="sys-title">
                        <Folder size={18} />
                        <span>./REPOSITORIES // MY_PROJECTS</span>
                    </div>
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
                    <div className="sys-title">
                        <Folder size={18} />
                        <span>./REPOSITORIES // MY_PROJECTS</span>
                    </div>
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
                <div className="sys-title">
                    <Folder size={18} />
                    <span>./REPOSITORIES // MY_PROJECTS</span>
                </div>
                <div className="sys-meta">INDEXED: {processedRepos.length}</div>
            </header>

            <main className="sys-content" style={{ display: 'flex', flexDirection: 'column' }}>
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
