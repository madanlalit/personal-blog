import React from 'react';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="about-container fade-in">
            <header className="page-header">
                <h1 className="page-title">About Me</h1>
            </header>

            <div className="about-content">
                <div className="about-intro">

                    <div className="intro-text-content">
                        <h2>Hello, I'm Lalit Madan.</h2>
                        <p className="lead">
                            I'm a software developer, writer, and AI enthusiast based in Nagpur. I build things for the web, explore the frontiers of artificial intelligence, and write about my journey.
                        </p>
                    </div>
                </div>

                <h3>My Philosophy</h3>
                <p>
                    I believe in creating software that is minimal, reliable, and feels human. In a world of increasing complexity, my goal is to build things that are simple, elegant, and serve a clear purpose. This blog is my "digital garden"—a place where I cultivate my thoughts, share my learnings, and document my experiments in software, AI, and the art of making things.
                </p>

                <h3>What I'm Focused On</h3>
                <ul>
                    <li>Exploring the capabilities and ethics of Large Language Models.</li>
                    <li>Building practical applications with AI agents.</li>
                    <li>Crafting accessible and delightful user interfaces.</li>
                    <li>Mastering the art of Context Engineering for better AI interactions.</li>
                </ul>

                <hr className="divider" />

                <h3>Colophon</h3>
                <p>
                    This website is a handcrafted project built with some of my favorite technologies. It's powered by <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="link">React</a> and <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="link">Vite</a>, and written in <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="link">TypeScript</a>. The retro terminal aesthetic is a nod to my love for the command line. The source code is available on <a href="https://github.com/lalitmadan/personal-blog" target="_blank" rel="noopener noreferrer" className="link">GitHub</a>.
                </p>

                <h3>Connect With Me</h3>
                <p>
                    I'm always open to interesting conversations. You can find me on <a href="https://x.com/madanlalit" target="_blank" rel="noopener noreferrer" className="link">X (formerly Twitter)</a> or connect with me on <a href="https://linkedin.com/in/madanlalit" target="_blank" rel="noopener noreferrer" className="link">LinkedIn</a>.
                </p>
            </div>
        </div>
    );
};

export default About;