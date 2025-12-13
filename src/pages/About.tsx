import React from 'react';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="about-container fade-in">
            <header className="page-header">
                <h1 className="page-title">About</h1>
            </header>

            <div className="about-content">
                <p className="lead">
                    I'm a developer and writer based in [Nagpur]. I build things for the web and
                    sometimes I write about it.
                </p>

                <p>
                    Currently, I'm finding the balance between minimalism and expressiveness.
                    I believe that good software should be quiet, reliable, and human with a bit of pinch of AI.
                </p>

                <hr className="divider" />

                <h3>What I'm Working On</h3>
                <ul>
                    <li>Building accessible web interfaces</li>
                    <li>Learning about distributed systems</li>
                    <li>Learning about Context Engineering</li>
                </ul>

                <h3>Connect</h3>
                <p>
                    The best way to reach me is on <a href="#" className="link">X</a> or via <a href="#" className="link">Linkedin</a>.
                </p>
            </div>
        </div>
    );
};

export default About;
