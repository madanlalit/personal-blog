'use client';

import React, { useState, useEffect } from 'react';

import './Typewriter.css';

interface TypewriterProps {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 5, delay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        if (displayedText.length >= text.length) {
            if (onComplete) onComplete();
            return;
        }

        const interval = setInterval(() => {
            setDisplayedText(prev => text.slice(0, prev.length + 1));
        }, speed);

        return () => clearInterval(interval);
    }, [started, displayedText, text, speed, onComplete]);

    const hiddenText = text.slice(displayedText.length);

    return (
        <span className="typewriter-text" aria-label={text}>
            <span aria-hidden="true">{displayedText}</span>
            {displayedText.length < text.length && <span className="typewriter-cursor" aria-hidden="true"></span>}
            <span className="typewriter-hidden" aria-hidden="true">{hiddenText}</span>
        </span>
    );
};

export default Typewriter;
