'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import './ScrollToTop.css';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const scrollContainer = document.querySelector('.main-layout');
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
        const scrollContainer = document.querySelector('.main-layout');
        scrollContainer?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <ArrowUp size={20} />
        </button>
    );
};

export default ScrollToTop;
