import React, { useEffect, useState } from 'react';

const ReadingProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const scrollContainer = document.querySelector('.content-area');
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
                // Removed box-shadow for cleaner look
            }}
        />
    );
};

export default ReadingProgress;
