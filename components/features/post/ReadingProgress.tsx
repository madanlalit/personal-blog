'use client';

import { useEffect, useState } from 'react';

const ReadingProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Target the main scrollable area in ClientShell
        const scrollContainer = document.querySelector('.main-layout');
        if (!scrollContainer) return;

        const updateProgress = () => {
            const scrollTop = scrollContainer.scrollTop;
            const docHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            const scrollPercent = scrollTop / docHeight;
            const val = Math.min(Math.max(scrollPercent, 0), 1);
            setProgress(val * 100);
        };

        scrollContainer.addEventListener('scroll', updateProgress);
        return () => scrollContainer.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: `${progress}%`,
                height: '2px', // Thinner for terminal feel
                backgroundColor: 'var(--accent)',
                zIndex: 9999,
                transition: 'width 0.1s ease-out',
            }}
        />
    );
};

export default ReadingProgress;
