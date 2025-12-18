import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Post } from '../../types';
import './PostNavigation.css';

interface PostNavigationProps {
    currentPost: Post;
    allPosts: Post[];
}

const PostNavigation: React.FC<PostNavigationProps> = ({ currentPost, allPosts }) => {
    const currentIndex = allPosts.findIndex(p => p.id === currentPost.id);
    const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    return (
        <nav className="post-navigation post-frame">
            <div className="frame-corner topleft"></div>
            <div className="frame-corner topright"></div>
            <div className="frame-corner bottomleft"></div>
            <div className="frame-corner bottomright"></div>

            <div className="frame-label">NAVIGATION</div>

            <div className="nav-inner">
                <div className="nav-item prev">
                    {prevPost ? (
                        <Link to={`/post/${prevPost.id}`} className="nav-link">
                            <ChevronLeft size={16} />
                            <div className="nav-content">
                                <span className="nav-label">← PREVIOUS</span>
                                <span className="nav-title">{prevPost.title}</span>
                            </div>
                        </Link>
                    ) : (
                        <div className="nav-placeholder" />
                    )}
                </div>

                <div className="nav-separator">│</div>

                <div className="nav-item next">
                    {nextPost ? (
                        <Link to={`/post/${nextPost.id}`} className="nav-link">
                            <div className="nav-content">
                                <span className="nav-label">NEXT →</span>
                                <span className="nav-title">{nextPost.title}</span>
                            </div>
                            <ChevronRight size={16} />
                        </Link>
                    ) : (
                        <div className="nav-placeholder" />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PostNavigation;
