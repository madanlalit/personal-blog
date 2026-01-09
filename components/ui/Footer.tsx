import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Social links configuration
const socialLinks = [
    { platform: 'Twitter', url: 'https://x.com/lalitmadan', icon: '𝕏', label: 'Twitter' },
    { platform: 'GitHub', url: 'https://github.com/madanlalit', icon: '⚡', label: 'GitHub' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/madanlalit', icon: 'in', label: 'LinkedIn' },
];

const Footer: React.FC = () => {
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Subscription feature coming soon!');
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>About</h4>
                        <p className="text-secondary">
                            A personal blog exploring technology, ideas, and life.
                            Writing to understand, learn, and share.
                        </p>
                        <div className="social-links">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.platform}
                                    href={link.url}
                                    className="social-link"
                                    aria-label={link.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            <li><Link to="/about" className="footer-link">About</Link></li>
                            <li><Link to="/archive" className="footer-link">Archive</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Subscribe</h4>
                        <p className="text-secondary">
                            Get notified about new posts and updates
                        </p>
                        <form className="mt-lg" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="your@email.com"
                                required
                            />
                            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 Lalit. All rights reserved. Built with care and attention to detail.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
