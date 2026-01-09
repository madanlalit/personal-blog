'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, LayoutGrid, List, Calendar, Clock, FileText } from 'lucide-react';
import type { PostMeta } from '@/lib/types';
import './archive.css';

// Helper functions
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
    const monthCounts = Array(12).fill(0);

    posts.forEach(post => {
        const postDate = new Date(post.date);
        const monthsAgo = (now.getFullYear() - postDate.getFullYear()) * 12 + (now.getMonth() - postDate.getMonth());
        if (monthsAgo >= 0 && monthsAgo < 12) {
            monthCounts[11 - monthsAgo]++;
        }
    });

    const max = Math.max(...monthCounts, 1);
    return monthCounts.map(count => 0.2 + (count / max) * 0.8);
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

interface ArchiveClientProps {
    initialPosts: PostMeta[];
    allTags: string[];
}

export default function ArchiveClient({ initialPosts, allTags }: ArchiveClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredPosts = useMemo(() =>
        initialPosts
            .filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()) && (!activeTag || post.tags?.includes(activeTag)))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [initialPosts, searchQuery, activeTag]
    );

    const postsByYear = useMemo(() => groupPostsByYear(filteredPosts), [filteredPosts]);
    const heatmapOpacities = useMemo(() => getHeatmapOpacities(initialPosts), [initialPosts]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((prev) => (prev + 1) % filteredPosts.length); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((prev) => (prev - 1 + filteredPosts.length) % filteredPosts.length); }
        else if (e.key === 'Enter' && filteredPosts[selectedIndex]) router.push(`/post/${filteredPosts[selectedIndex].slug}`);
        else if (e.key === 'Escape') { setActiveTag(null); setSearchQuery(''); }
    }, [filteredPosts, selectedIndex, router]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="archive-root">
            <div className="grid-overlay" aria-hidden="true" />

            <header className="archive-hud">
                <div className="hud-title"><Terminal size={18} /><span>ARCHIVE_DB // ACCESS_LEVEL: PUBLIC</span></div>
                <div className="hud-stats">
                    <StatPill label="TOTAL_ENTRIES" value={initialPosts.length} />
                    <StatPill label="SYSTEM_TAGS" value={allTags.length} />
                </div>
            </header>

            <div className="archive-body">
                <section className="activity-section">
                    <div className="section-label">ACTIVITY_LOG [LAST_12_MONTHS]</div>
                    <div className="heatmap-grid">
                        {heatmapOpacities.map((opacity, i) => <div key={i} className="heat-cell" style={{ opacity }} />)}
                    </div>
                </section>

                <section className="control-module" role="search" aria-label="Search and filter posts">
                    <div className="search-wrapper">
                        <span className="prompt" aria-hidden="true">root@blog:~$</span>
                        <input type="text" placeholder="query_database..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search posts" />
                        {searchQuery ? <span className="search-status" aria-live="polite">SCANNING...</span> : <Search size={14} className="icon-right" aria-hidden="true" />}
                    </div>
                    <div className="view-toggles" role="group" aria-label="View mode">
                        <ToggleBtn active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={List} label="LIST" />
                        <ToggleBtn active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={LayoutGrid} label="GRID" />
                    </div>
                </section>

                <div id="search-results-count" className="visually-hidden" aria-live="polite">{filteredPosts.length} posts found</div>

                <nav className="tag-rail" role="group" aria-label="Filter by tag">
                    <button className={`tag-chip ${!activeTag ? 'active' : ''}`} onClick={() => setActiveTag(null)} aria-pressed={!activeTag}>[*] ALL</button>
                    {allTags.map((tag) => (
                        <button key={tag} className={`tag-chip ${activeTag === tag ? 'active' : ''}`} onClick={() => setActiveTag(tag)} aria-pressed={activeTag === tag}>[{tag}]</button>
                    ))}
                </nav>

                <main className="content-viewport">
                    <AnimatePresence mode="wait">
                        {filteredPosts.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-buffer">[!] ERR_NO_RESULTS_FOUND</motion.div>
                        ) : viewMode === 'list' ? (
                            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="view-list">
                                {Object.entries(postsByYear).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([year, posts]) => (
                                    <div key={year} className="year-block">
                                        <div className="year-marker"><span className="bracket">[</span>{year}<span className="bracket">]</span></div>
                                        <div className="file-tree">
                                            {posts.map((post) => <FileRow key={post.id} post={post} isSelected={post.id === filteredPosts[selectedIndex]?.id} />)}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="view-grid">
                                {filteredPosts.map((post) => <GridCard key={post.id} post={post} />)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <footer className="sys-footer"><span>KEYS: ↑↓ TO NAVIGATE // ENTER TO OPEN // ESC TO CLEAR</span></footer>
        </div>
    );
}
