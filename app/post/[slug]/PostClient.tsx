'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
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
    shareUrl: string;
}

function getNodeText(node: React.ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getNodeText).join('');
    if (React.isValidElement(node)) return getNodeText(node.props.children);
    return '';
}

function stripLeadingMarker(node: React.ReactNode, marker: string, hasStripped = { value: false }): React.ReactNode {
    if (typeof node === 'string') {
        if (!hasStripped.value) {
            hasStripped.value = true;
            return node.replace(marker, '').trimStart();
        }
        return node;
    }

    if (typeof node === 'number' || node == null) return node;

    if (Array.isArray(node)) {
        return node.map((child, index) => (
            <React.Fragment key={index}>
                {stripLeadingMarker(child, marker, hasStripped)}
            </React.Fragment>
        ));
    }

    if (React.isValidElement(node)) {
        return React.cloneElement(node, {
            ...node.props,
            children: stripLeadingMarker(node.props.children, marker, hasStripped),
        });
    }

    return node;
}

export default function PostClient({ post, prevPost, nextPost, relatedPosts, shareUrl }: PostClientProps) {
    // Custom renderer for code blocks
    const components = {
        code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
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
        },
        img: ({ src, alt, title }: React.ImgHTMLAttributes<HTMLImageElement>) => {
            if (!src) return null;
            return (
                <span className="post-image-wrapper">
                    <Image
                        src={src as string}
                        alt={alt || ''}
                        title={title}
                        width={800}
                        height={450}
                        className="post-image"
                        style={{ width: '100%', height: 'auto' }}
                    />
                    {title && <span className="image-caption">{title}</span>}
                </span>
            );
        },
        blockquote: ({ children }: React.HTMLAttributes<HTMLElement>) => {
            const childArray = React.Children.toArray(children);
            const firstChild = childArray[0];

            if (React.isValidElement(firstChild) && firstChild.type === 'p') {
                const firstText = getNodeText(firstChild).trim();

                const calloutMap: Record<string, { className: string; label: string }> = {
                    '[!SUMMARY]': { className: 'summary-callout', label: 'In Short' },
                    '[!QUOTE]': { className: 'pull-quote', label: 'Key Line' },
                    '[!NOTE]': { className: 'note-callout', label: 'Author Note' },
                };

                const marker = Object.keys(calloutMap).find((key) => firstText.startsWith(key));
                if (marker) {
                    const config = calloutMap[marker];
                    const cleanedFirstChild = stripLeadingMarker(firstChild, marker);

                    return (
                        <aside className={`post-callout ${config.className}`}>
                            <div className="post-callout-label">{config.label}</div>
                            <div className="post-callout-body">
                                {[cleanedFirstChild, ...childArray.slice(1)]}
                            </div>
                        </aside>
                    );
                }
            }

            return <blockquote>{children}</blockquote>;
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
                            <ShareButtons title={post.title} url={shareUrl} />
                        </div>
                    </Frame>
                )}

                <RelatedPosts relatedPosts={relatedPosts} />
                <PostNavigation prevPost={prevPost} nextPost={nextPost} />
            </article>
        </>
    );
}
