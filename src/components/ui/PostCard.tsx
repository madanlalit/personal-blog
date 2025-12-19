import React from "react";
import { Link } from "react-router-dom";
import type { Post } from "../../types.ts";
import "./PostCard.css";

interface PostCardProps {
  post: Post;
  index?: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, index = 0 }) => {
  return (
    <article
      className="post-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="post-meta-row">
        <span className="post-date">{post.date}</span>
        <span className="post-category">{post.category}</span>
      </div>

      <h3 className="post-title">
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </h3>

      <p className="post-excerpt">{post.excerpt}</p>

      {post.tags && (
        <div className="post-tags-container">
          {post.tags.map((tag) => (
            <Link key={tag} to={`/tags/${tag}`} className="post-tag-link">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <Link to={`/post/${post.id}`} className="read-link">
        Read entry <span>→</span>
      </Link>
    </article>
  );
};

export default PostCard;
