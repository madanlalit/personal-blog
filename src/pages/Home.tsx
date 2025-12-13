import React from 'react';
import PostCard from '../components/ui/PostCard';
import { usePosts } from '../hooks/usePosts';
import './Home.css';

const Home: React.FC = () => {
    const { getAllPosts } = usePosts();
    const latestPosts = getAllPosts().slice(0, 3);

    return (
        <div className="home-container fade-in">
            <header className="home-header" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 className="intro-text">
                        Hello! I'm <span className="highlight" data-text="Lalit">Lalit</span>.
                    </h1>
                    <p className="sub-intro">
                        I write about software, AI, and trying to make sense of the world.
                        <br />
                        Welcome to my digital garden.
                    </p>
                </div>
            </header>

            <section className="latest-writings">
                <h2 className="section-label">Latest Writing</h2>
                <div className="posts-list">
                    {latestPosts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
