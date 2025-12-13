import React from 'react';
import { Link } from 'react-router-dom';
import { mockPosts } from '../data/mockData';
import './Archive.css';

const Archive: React.FC = () => {
    const postsByYear = mockPosts.reduce((acc, post) => {
        const year = new Date(post.date).getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
    }, {} as Record<string, typeof mockPosts>);

    return (
        <div className="archive-container fade-in">
            <header className="page-header">
                <h1 className="page-title">Archive</h1>
            </header>

            {Object.entries(postsByYear)
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
                ))}
        </div>
    );
};

export default Archive;
