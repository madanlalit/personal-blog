import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import './RelatedPosts.css';

interface RelatedPostsProps {
    currentPost: Post;
    allPosts: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost, allPosts }) => {
    // Find related posts by matching tags or category
    const relatedPosts = allPosts
        .filter(post => post.id !== currentPost.id)
        .map(post => {
            let score = 0;

            // Match tags
            const commonTags = currentPost.tags?.filter(tag =>
                post.tags?.includes(tag)
            ).length || 0;
            score += commonTags * 3;

            // Match category
            if (post.category === currentPost.category) {
                score += 2;
            }

            return { post, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ post }) => post);

    if (relatedPosts.length === 0) return null;

    return (
        <section className="related-posts post-frame">
            <div className="frame-corner topleft"></div>
            <div className="frame-corner topright"></div>
            <div className="frame-corner bottomleft"></div>
            <div className="frame-corner bottomright"></div>

            <div className="frame-label">RELATED</div>

            <div className="related-list">
                {relatedPosts.map((post) => (
                    <Link
                        key={post.id}
                        to={`/post/${post.id}`}
                        className="related-card"
                    >
                        <div className="related-meta">
                            <span className="related-category">[{post.category}]</span>
                            <span className="related-time">{post.readTime} min</span>
                        </div>
                        <h4 className="related-title">{post.title}</h4>
                        {post.excerpt && (
                            <p className="related-excerpt">{post.excerpt.slice(0, 100)}...</p>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedPosts;
