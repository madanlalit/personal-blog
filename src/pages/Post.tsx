import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Typewriter from '../components/ui/Typewriter';
import { usePosts } from '../hooks/usePosts';
import PostNavigation from '../components/post/PostNavigation';
import TableOfContents from '../components/post/TableOfContents';
import ShareButtons from '../components/post/ShareButtons';
import RelatedPosts from '../components/post/RelatedPosts';
import ReadingProgress from '../components/post/ReadingProgress';
import ScrollToTop from '../components/post/ScrollToTop';
import CodeBlock from '../components/post/CodeBlock';
import SEO from '../components/SEO';
import '../features/terminal/SyntaxTheme.css'; // Dynamic Theme
import './Post.css';

const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getPostById, getAllPosts } = usePosts();
    const post = getPostById(id || '');
    const allPosts = getAllPosts();

    if (!post) {
        return (
            <div className="main-layout">
                <SEO title="Post Not Found" />
                <div className="content-area">
                    <p>Post not found.</p>
                    <Link to="/" className="back-link">← Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <ReadingProgress />
            <ScrollToTop />

            <article className="post-article fade-in">
                <SEO title={post.title} description={post.excerpt} type="article" />

                <Link to="/" className="back-link">← Back to Terminal</Link>

                {/* HEADER FRAME */}
                <section className="post-frame post-header-frame">
                    <div className="frame-corner topleft"></div>
                    <div className="frame-corner topright"></div>
                    <div className="frame-corner bottomleft"></div>
                    <div className="frame-corner bottomright"></div>

                    <div className="frame-label">HEADER</div>

                    <div className="entry-meta">
                        <span className="date">{post.date}</span>
                        <span className="category">[{post.category}]</span>
                        <span className="read-time">{post.readTime} min read</span>
                    </div>
                    <h1 className="entry-title">
                        <Typewriter text={post.title} delay={30} />
                    </h1>
                    {post.subtitle && <h2 className="entry-subtitle">{post.subtitle}</h2>}
                </section>

                {/* CONTENT FRAME */}
                <section className="post-frame post-content-frame">
                    <div className="frame-corner topleft"></div>
                    <div className="frame-corner topright"></div>
                    <div className="frame-corner bottomleft"></div>
                    <div className="frame-corner bottomright"></div>

                    <div className="frame-label">CONTENT</div>

                    <TableOfContents />

                    <div className="entry-content markdown-body">
                        <ReactMarkdown
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <CodeBlock
                                            language={match[1]}
                                            value={String(children).replace(/\n$/, '')}
                                        >
                                            {children}
                                        </CodeBlock>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </section>

                {/* FOOTER FRAME */}
                {(post.tags && post.tags.length > 0) && (
                    <section className="post-frame post-footer-frame">
                        <div className="frame-corner topleft"></div>
                        <div className="frame-corner topright"></div>
                        <div className="frame-corner bottomleft"></div>
                        <div className="frame-corner bottomright"></div>

                        <div className="frame-label">META</div>

                        <div className="footer-content">
                            <div className="post-tags">
                                <span className="tags-label">TAGS:</span>
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        to={`/archive?tag=${tag}`}
                                        className="post-tag"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                            <ShareButtons title={post.title} />
                        </div>
                    </section>
                )}

                {/* RELATED POSTS */}
                <RelatedPosts currentPost={post} allPosts={allPosts} />

                {/* NAVIGATION */}
                <PostNavigation currentPost={post} allPosts={allPosts} />
            </article>
        </>
    );
};

export default Post;
