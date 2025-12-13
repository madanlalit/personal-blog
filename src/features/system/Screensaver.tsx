import React, { useEffect, useRef, useState } from 'react';

const Screensaver: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hidden, setHidden] = useState(true);
    const timeoutRef = useRef<number | null>(null);

    // Activity tracking to reset idle timer
    useEffect(() => {
        const resetTimer = () => {
            setHidden(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setHidden(false), 30000); // 30s idle for demo
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer);

        resetTimer(); // Init

        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Matrix Rain Animation
    useEffect(() => {
        if (hidden || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01XY<>[]#@';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops: number[] = new Array(Math.floor(columns)).fill(1);

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Text color (using CSS var logic via direct hex for simplicity or computed style)
            const computedStyle = getComputedStyle(document.documentElement);
            ctx.fillStyle = computedStyle.getPropertyValue('--accent').trim() || '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, [hidden]);

    if (hidden) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 99999, // On top of everything
                pointerEvents: 'none', // Allow clicks to pass through to wake up
                mixBlendMode: 'screen'
            }}
        />
    );
};

export default Screensaver;
