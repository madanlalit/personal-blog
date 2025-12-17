import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { groupPostsByYear } from '../utils/postHelpers';
import SEO from '../components/SEO';
import './Archive.css'; // Re-use Archive styles

const TagArchive: React.FC = () => {
    const { tag } = useParams<{ tag: string }>();
    const decodedTag = decodeURIComponent(tag || '');
    const { getPostsByTag } = usePosts();

    const filteredPosts = getPostsByTag(decodedTag);

    const postsByYear = groupPostsByYear(filteredPosts);

    return (
        <div className="archive-root fade-in">
            <SEO title={`Tag: ${decodedTag}`} description={`Posts tagged with ${decodedTag}`} />
            <header className="page-header">
                <div className="back-link-container">
                    <Link to="/archive" className="back-link">← All Archives</Link>
                </div>
                <h1 className="page-title">Tag: <span style={{ color: 'var(--accent)' }}>{decodedTag}</span></h1>
            </header>

            {Object.keys(postsByYear).length === 0 ? (
                <p>No posts found for this tag.</p>
            ) : (
                Object.entries(postsByYear)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a))
                    .map(([year, posts]) => (
                        <div key={year} className="year-section">
                            <h2 className="year-label">{year}</h2>
                            <ul className="year-list">
                                {posts.map((post) => (
                                    <li key={post.id} className="year-item">
                                        <span className="item-date">
                                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <Link to={`/post/${post.id}`} className="item-title">
                                            {post.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
            )}
        </div>
    );
};

export default TagArchive;
