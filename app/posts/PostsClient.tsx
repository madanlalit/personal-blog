'use client';

import { useDeferredValue, useEffect, useEffectEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, Search, LayoutGrid, List, Calendar, Clock, FileText } from 'lucide-react';
import type { PostMeta } from '@/lib/types';
import './posts.css';

type ViewMode = 'list' | 'grid';

const groupPostsByYear = (posts: PostMeta[]) => {
    return posts.reduce((acc, post) => {
        const year = new Date(post.date).getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
    }, {} as Record<string, PostMeta[]>);
};

const getHeatmapOpacities = (posts: PostMeta[]) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time for accurate day diff

    const weekCounts = Array(52).fill(0);
    const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;

    posts.forEach(post => {
        const postDate = new Date(post.date);
        postDate.setHours(0, 0, 0, 0);

        const diffTime = now.getTime() - postDate.getTime();
        const weeksAgo = Math.floor(diffTime / MS_PER_WEEK);

        if (weeksAgo >= 0 && weeksAgo < 52) {
            weekCounts[51 - weeksAgo]++;
        }
    });

    const max = Math.max(...weekCounts, 1);
    return weekCounts.map(count => count === 0 ? 0.2 : 0.4 + (count / max) * 0.6);
};

// Hash generator
const hashCache = new Map<string, string>();
const generateHash = (str: string): string => {
    if (hashCache.has(str)) return hashCache.get(str)!;
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
    const result = '0x' + Math.abs(hash).toString(16).substring(0, 6).toUpperCase();
    hashCache.set(str, result);
    return result;
};

// Reusable components
const StatPill = ({ label, value }: { label: string; value: number }) => (
    <div className="stat-pill">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
    </div>
);

const ToggleBtn = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) => (
    <button className={`toggle-btn ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={active} aria-label={`${label} view`}>
        <Icon size={label === 'LIST' ? 16 : 14} aria-hidden="true" /> {label}
    </button>
);

const FileRow = ({ post, isSelected }: { post: PostMeta; isSelected: boolean }) => (
    <Link href={`/post/${post.slug}`} className={`file-row ${isSelected ? 'selected' : ''}`}>
        <div className="col-meta">
            <span className="hash">{generateHash(post.title)}</span>
            <span className="date">{new Date(post.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</span>
        </div>
        <div className="col-title">{post.title}<span className="ext">.md</span></div>
        <div className="col-tags">{post.tags?.slice(0, 2).map((t: string) => `#${t} `)}</div>
    </Link>
);

const GridCard = ({ post }: { post: PostMeta }) => (
    <Link href={`/post/${post.slug}`} className="grid-card">
        <div className="card-header">
            <span className="hash">{generateHash(post.title)}</span>
            <div className="card-dots"><span /><span /></div>
        </div>
        <div className="card-body">
            <h3>{post.title}</h3>
            <div className="meta-row">
                <span><Calendar size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                <span><Clock size={12} /> {post.readTime}m read</span>
            </div>
        </div>
        <div className="card-footer"><FileText size={14} /> OPEN_FILE</div>
    </Link>
);

interface PostsClientProps {
    initialPosts: PostMeta[];
    allTags: string[];
}

export default function PostsClient({ initialPosts, allTags }: PostsClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const deferredSearchQuery = useDeferredValue(searchQuery);

    const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
    const filteredPosts = useMemo(
        () =>
            initialPosts.filter(
                (post) =>
                    post.title.toLowerCase().includes(normalizedSearchQuery) &&
                    (!activeTag || post.tags?.includes(activeTag))
            ),
        [activeTag, initialPosts, normalizedSearchQuery]
    );
    const selectedPost = filteredPosts[Math.min(selectedIndex, Math.max(filteredPosts.length - 1, 0))];

    const postsByYear = useMemo(() => groupPostsByYear(filteredPosts), [filteredPosts]);
    const heatmapOpacities = useMemo(() => getHeatmapOpacities(initialPosts), [initialPosts]);

    const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
        const activeElement = document.activeElement;
        const activeHtmlElement =
            activeElement instanceof HTMLElement ? activeElement : null;
        if (
            activeElement instanceof HTMLInputElement ||
            activeElement instanceof HTMLTextAreaElement ||
            activeElement instanceof HTMLSelectElement ||
            activeHtmlElement?.isContentEditable
        ) {
            return;
        }

        if (filteredPosts.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredPosts.length);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredPosts.length) % filteredPosts.length);
            return;
        }

        if (e.key === 'Enter' && selectedPost) {
            router.push(`/post/${selectedPost.slug}`);
            return;
        }

        if (e.key === 'Escape') {
            setActiveTag(null);
            setSearchQuery('');
        }
    });

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="posts-root">
            <div className="grid-overlay" aria-hidden="true" />

            <header className="posts-hud">
                <div className="hud-title"><Terminal size={18} /><span>POSTS_DB // ACCESS_LEVEL: PUBLIC</span></div>
                <div className="hud-stats">
                    <StatPill label="TOTAL_ENTRIES" value={initialPosts.length} />
                    <StatPill label="SYSTEM_TAGS" value={allTags.length} />
                </div>
            </header>

            <div className="posts-body">
                <section className="activity-section">
                    <div className="section-label">ACTIVITY_LOG [LAST_52_WEEKS]</div>
                    <div className="heatmap-grid">
                        {heatmapOpacities.map((opacity, i) => <div key={i} className="heat-cell" style={{ opacity }} />)}
                    </div>
                </section>

                <section className="control-module" role="search" aria-label="Search and filter posts">
                    <div className="search-wrapper">
                        <span className="prompt" aria-hidden="true">root@blog:~$</span>
                        <input
                            type="text"
                            placeholder="query_database..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setSelectedIndex(0);
                            }}
                            aria-label="Search posts"
                        />
                        {searchQuery ? <span className="search-status" aria-live="polite">SCANNING...</span> : <Search size={14} className="icon-right" aria-hidden="true" />}
                    </div>
                    <div className="view-toggles" role="group" aria-label="View mode">
                        <ToggleBtn active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={List} label="LIST" />
                        <ToggleBtn active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={LayoutGrid} label="GRID" />
                    </div>
                </section>

                <div id="search-results-count" className="visually-hidden" aria-live="polite">{filteredPosts.length} posts found</div>

                <nav className="tag-rail" role="group" aria-label="Filter by tag">
                    <button
                        className={`tag-chip ${!activeTag ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTag(null);
                            setSelectedIndex(0);
                        }}
                        aria-pressed={!activeTag}
                    >
                        [*] ALL
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            className={`tag-chip ${activeTag === tag ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTag(tag);
                                setSelectedIndex(0);
                            }}
                            aria-pressed={activeTag === tag}
                        >
                            [{tag}]
                        </button>
                    ))}
                </nav>

                <main className="content-viewport">
                    {filteredPosts.length === 0 ? (
                        <div className="empty-buffer">[!] ERR_NO_RESULTS_FOUND</div>
                    ) : viewMode === 'list' ? (
                        <div className="view-list">
                            {Object.entries(postsByYear).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([year, posts]) => (
                                <div key={year} className="year-block">
                                    <div className="year-marker"><span className="bracket">[</span>{year}<span className="bracket">]</span></div>
                                    <div className="file-tree">
                                        {posts.map((post) => <FileRow key={post.id} post={post} isSelected={post.id === selectedPost?.id} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="view-grid">
                            {filteredPosts.map((post) => <GridCard key={post.id} post={post} />)}
                        </div>
                    )}
                </main>
            </div>

            <footer className="sys-footer"><span>KEYS: ↑↓ TO NAVIGATE // ENTER TO OPEN // ESC TO CLEAR</span></footer>
        </div>
    );
}
