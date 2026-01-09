'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Frame from '@/components/ui/Frame';
import Typewriter from '@/components/ui/Typewriter';
import type { Post } from '@/lib/types';
import './post.css';

interface PostClientProps {
    post: Post;
}

export default function PostClient({ post }: PostClientProps) {
    return (
        <article className="post-article fade-in">
            <Link href="/archive" className="back-link">← Back to Archive</Link>

            <Frame label="HEADER" className="post-header-frame">
                <div className="entry-meta">
                    <span className="entry-date">{post.date}</span>
                    <span className="entry-category">[{post.category}]</span>
                    {post.readTime && <span className="entry-read-time">{post.readTime} MIN READ</span>}
                </div>
                <h1 className="entry-title"><Typewriter text={post.title} /></h1>
                {post.subtitle && <h2 className="entry-subtitle">{post.subtitle}</h2>}
            </Frame>

            <Frame label="CONTENT" className="post-content-frame">
                <div className="entry-content markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </Frame>

            {post.tags && post.tags.length > 0 && (
                <Frame label="META" className="post-footer-frame">
                    <div className="footer-content">
                        <div className="entry-tags">
                            {post.tags.map((tag) => (
                                <Link key={tag} href={`/tags/${tag.toLowerCase()}`} className="tag-link">
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </Frame>
            )}
        </article>
    );
}
