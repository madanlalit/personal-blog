import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Typewriter from '../components/ui/Typewriter';
import Frame from '../components/ui/Frame';
import { usePosts } from '../hooks/usePosts';
import PostNavigation from '../components/post/PostNavigation';
import TableOfContents from '../components/post/TableOfContents';
import ShareButtons from '../components/post/ShareButtons';
import RelatedPosts from '../components/post/RelatedPosts';
import ReadingProgress from '../components/post/ReadingProgress';
import ScrollToTop from '../components/post/ScrollToTop';
import CodeBlock from '../components/post/CodeBlock';
import SEO from '../components/SEO';
import type { Post as PostType } from '../types';
import '../features/terminal/SyntaxTheme.css';
import './Post.css';

const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getPostById, getAllPosts } = usePosts();
    const allPosts = getAllPosts();
    const [post, setPost] = useState<PostType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getPostById(id).then(p => { setPost(p || null); setLoading(false); });
    }, [id, getPostById]);

    if (loading) return <div className="main-layout"><SEO title="Loading..." /><div className="content-area"><p>Loading...</p></div></div>;
    if (!post) return <div className="main-layout"><SEO title="Post Not Found" /><div className="content-area"><p>Post not found.</p><Link to="/" className="back-link">← Return to Home</Link></div></div>;

    return (
        <>
            <ReadingProgress />
            <ScrollToTop />
            <article className="post-article fade-in">
                <SEO title={post.title} description={post.excerpt} type="article" />
                <Link to="/" className="back-link">← Back to Terminal</Link>

                <Frame label="HEADER" className="post-header-frame">
                    <div className="entry-meta">
                        <span className="entry-date">{post.date}</span>
                        <span className="entry-category">[{post.category}]</span>
                        <span className="entry-read-time">{post.readTime} MIN READ</span>
                    </div>
                    <h1 className="entry-title"><Typewriter text={post.title} /></h1>
                    {post.subtitle && <h2 className="entry-subtitle">{post.subtitle}</h2>}
                </Frame>

                <Frame label="CONTENT" className="post-content-frame">
                    <TableOfContents />
                    <div className="entry-content markdown-body">
                        <ReactMarkdown
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')}>{children}</CodeBlock>
                                    ) : (
                                        <code className={className} {...props}>{children}</code>
                                    );
                                }
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </Frame>

                {post.tags && post.tags.length > 0 && (
                    <Frame label="META" className="post-footer-frame">
                        <div className="footer-content">
                            <div className="entry-tags">{post.tags.map((tag) => <Link key={tag} to={`/archive?tag=${tag}`} className="tag-link">#{tag}</Link>)}</div>
                            <ShareButtons title={post.title} />
                        </div>
                    </Frame>
                )}

                <RelatedPosts currentPost={post} allPosts={allPosts} />
                <PostNavigation currentPost={post} allPosts={allPosts} />
            </article>
        </>
    );
};

export default Post;
