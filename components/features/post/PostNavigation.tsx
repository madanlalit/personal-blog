'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Post } from '@/lib/types';
import './PostNavigation.css';

interface PostNavigationProps {
    prevPost: Post | null;
    nextPost: Post | null;
}

const NavLink = ({ post, direction }: { post: Post; direction: 'prev' | 'next' }) => (
    <Link href={`/post/${post.slug}`} className="nav-link">
        {direction === 'prev' && <ChevronLeft size={16} />}
        <div className="nav-content">
            <span className="nav-label">{direction === 'prev' ? '← PREVIOUS' : 'NEXT →'}</span>
            <span className="nav-title">{post.title}</span>
        </div>
        {direction === 'next' && <ChevronRight size={16} />}
    </Link>
);

const PostNavigation = ({ prevPost, nextPost }: PostNavigationProps) => {
    return (
        <nav className="post-navigation post-frame">
            <div className="frame-corner topleft" /><div className="frame-corner topright" />
            <div className="frame-corner bottomleft" /><div className="frame-corner bottomright" />
            <div className="frame-label">NAVIGATION</div>
            <div className="nav-inner">
                <div className="nav-item prev">{prevPost ? <NavLink post={prevPost} direction="prev" /> : <div className="nav-placeholder" />}</div>
                <div className="nav-separator">│</div>
                <div className="nav-item next">{nextPost ? <NavLink post={nextPost} direction="next" /> : <div className="nav-placeholder" />}</div>
            </div>
        </nav>
    );
};

export default PostNavigation;
