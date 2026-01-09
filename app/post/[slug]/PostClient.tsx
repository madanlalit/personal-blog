'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Post } from '@/lib/types';
import './post.css';

interface PostClientProps {
    post: Post;
}

export default function PostClient({ post }: PostClientProps) {
    return (
        <article className="post-container fade-in">
            <header className="post-header">
                <div className="post-meta">
                    <span className="post-date">{post.date}</span>
                    <span className="post-category">{post.category}</span>
                    {post.readTime && <span className="post-read-time">{post.readTime} min read</span>}
                </div>
                <h1 className="post-title">{post.title}</h1>
                {post.subtitle && <p className="post-subtitle">{post.subtitle}</p>}
                {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                        {post.tags.map((tag) => (
                            <Link key={tag} href={`/tags/${tag.toLowerCase()}`} className="post-tag">
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            <div className="post-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {post.content}
                </ReactMarkdown>
            </div>

            <footer className="post-footer">
                <Link href="/archive" className="back-link">
                    ← Back to Archive
                </Link>
            </footer>
        </article>
    );
}
