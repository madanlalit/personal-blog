'use client';

import Link from 'next/link';
import type { PostMeta } from '@/lib/types';
import './PostCard.css';

interface PostCardProps {
  post: PostMeta;
  index?: number;
}

const PostCard = ({ post, index = 0 }: PostCardProps) => (
  <article className="post-card" style={{ animationDelay: `${index * 0.1}s` }}>
    <div className="post-meta-row">
      <span className="post-date">{post.date}</span>
      <span className="post-category">{post.category}</span>
    </div>
    <h3 className="post-title"><Link href={`/post/${post.slug}`}>{post.title}</Link></h3>
    <p className="post-excerpt">{post.excerpt}</p>
    {post.tags && (
      <div className="post-tags-container">
        {post.tags.map((tag) => <Link key={tag} href={`/tags/${tag.toLowerCase()}`} className="post-tag-link">#{tag}</Link>)}
      </div>
    )}
    <Link href={`/post/${post.slug}`} className="read-link">Read entry <span>→</span></Link>
  </article>
);

export default PostCard;
