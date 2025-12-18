import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const scrollContainer = document.querySelector('.content-area');
        if (!scrollContainer) return;

        const toggleVisibility = () => {
            if (scrollContainer.scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        scrollContainer.addEventListener('scroll', toggleVisibility);
        return () => scrollContainer.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        const scrollContainer = document.querySelector('.content-area');
        scrollContainer?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
            aria-label="Scroll to top"
        >
            <span className="scroll-icon">↑</span>
            <span className="scroll-label">TOP</span>
        </button>
    );
};

export default ScrollToTop;
