import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Typewriter from '../components/ui/Typewriter';
import { usePosts } from '../hooks/usePosts';

import SEO from '../components/SEO';
import '../features/terminal/SyntaxTheme.css'; // Dynamic Theme
import './Post.css';

const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getPostById } = usePosts();
    const post = getPostById(id || '');

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
        <article className="post-container fade-in">
            <SEO title={post.title} description={post.excerpt} type="article" />

            <Link to="/" className="back-link">← Back to Terminal</Link>
            <header className="entry-header">
                <div className="entry-meta">
                    <span className="date">{post.date}</span>
                    <span className="category">[{post.category}]</span>
                </div>
                <h1 className="entry-title">
                    <Typewriter text={post.title} delay={30} />
                </h1>
                {post.subtitle && <h2 className="entry-subtitle">{post.subtitle}</h2>}
            </header>

            <div className="entry-content markdown-body">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {post.content}
                </ReactMarkdown>
            </div>

            <footer className="entry-footer">
                <p className="thanks">Thanks for reading.</p>
                <div className="share-links">
                    <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${post.title}&url=${window.location.href}`, '_blank')}>Share on 𝕏</button>
                    <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy Link</button>
                </div>
            </footer>
        </article>
    );
};

export default Post;
