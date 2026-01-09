'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Frame from '@/components/ui/Frame';
import Typewriter from '@/components/ui/Typewriter';
import TableOfContents from '@/components/features/post/TableOfContents';
import PostNavigation from '@/components/features/post/PostNavigation';
import RelatedPosts from '@/components/features/post/RelatedPosts';
import ShareButtons from '@/components/features/post/ShareButtons';
import ReadingProgress from '@/components/features/post/ReadingProgress';
import ScrollToTop from '@/components/features/post/ScrollToTop';
import CodeBlock from '@/components/features/post/CodeBlock';
import type { Post } from '@/lib/types';
import '@/components/features/terminal/SyntaxTheme.css';
import './post.css';

interface PostClientProps {
    post: Post;
    prevPost: Post | null;
    nextPost: Post | null;
    relatedPosts: Post[];
}

export default function PostClient({ post, prevPost, nextPost, relatedPosts }: PostClientProps) {
    // Custom renderer for code blocks
    const components = {
        code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')}>
                    {children}
                </CodeBlock>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <>
            <ReadingProgress />
            <ScrollToTop />

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
                    <TableOfContents />
                    <div className="entry-content markdown-body">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={components}
                        >
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
                            <ShareButtons title={post.title} />
                        </div>
                    </Frame>
                )}

                <RelatedPosts relatedPosts={relatedPosts} />
                <PostNavigation prevPost={prevPost} nextPost={nextPost} />
            </article>
        </>
    );
}
