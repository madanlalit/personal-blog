'use client';

import Link from 'next/link';
import type { Post } from '@/lib/types';
import './RelatedPosts.css';

interface RelatedPostsProps {
    relatedPosts: Post[];
}

const RelatedPosts = ({ relatedPosts }: RelatedPostsProps) => {
    if (relatedPosts.length === 0) return null;

    return (
        <section className="related-posts post-frame">
            <div className="frame-corner topleft" /><div className="frame-corner topright" />
            <div className="frame-corner bottomleft" /><div className="frame-corner bottomright" />
            <div className="frame-label">RELATED</div>
            <div className="related-list">
                {relatedPosts.map((post) => (
                    <Link key={post.slug} href={`/post/${post.slug}`} className="related-card">
                        <div className="related-meta">
                            <span className="related-category">[{post.category}]</span>
                            <span className="related-time">{post.readTime} min</span>
                        </div>
                        <h4 className="related-title">{post.title}</h4>
                        {post.excerpt && <p className="related-excerpt">{post.excerpt.slice(0, 100)}...</p>}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedPosts;
