'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/hooks/useTheme';
import useSound from '@/components/hooks/useSound';
import useKonamiCode from '@/components/hooks/useKonamiCode';
import Commander from '@/components/features/terminal/Commander';
import CommandLine from '@/components/features/terminal/CommandLine';
import BootScreen from '@/components/features/system/BootScreen';
import SnakeGame from '@/components/features/terminal/SnakeGame';
import StatusBar from '@/components/ui/StatusBar';
import type { PostMeta } from '@/lib/types';
import '@/app/app.css';

interface ClientShellProps {
    children: React.ReactNode;
    posts: PostMeta[];
}

export default function ClientShell({ children, posts }: ClientShellProps) {
    const [booted, setBooted] = useState(true); // Default to true for SSR
    const [commanderOpen, setCommanderOpen] = useState(false);
    const [snakeGameOpen, setSnakeGameOpen] = useState(false);
    const { playHoverSound, playKeySound, toggleMute, muted } = useSound();
    const { setTheme, availableThemes } = useTheme();

    // Check boot state on mount (client-side only)
    useEffect(() => {
        const hasBooted = sessionStorage.getItem('hasBooted');
        if (!hasBooted) {
            setBooted(false);
        }
    }, []);

    // Konami code easter egg
    useKonamiCode(() => {
        setTheme('matrix');
    });

    // Global hover sounds
    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('.cli-tab')
            ) {
                playHoverSound();
            }
        };
        document.addEventListener('mouseover', handleMouseOver);
        return () => document.removeEventListener('mouseover', handleMouseOver);
    }, [playHoverSound]);

    // Toggle Commander with Shift + M
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.shiftKey && e.code === 'KeyM') {
                e.preventDefault();
                setCommanderOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const handleBootComplete = () => {
        setBooted(true);
        sessionStorage.setItem('hasBooted', 'true');
    };

    const handleCommand = (cmd: string) => {
        if (cmd === 'snake') {
            setSnakeGameOpen(true);
        }
    };

    // Show boot screen on first visit
    if (!booted) {
        return <BootScreen onComplete={handleBootComplete} />;
    }

    return (
        <div className="app tui-window fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            {/* Commander Modal */}
            <Commander
                isOpen={commanderOpen}
                onClose={() => setCommanderOpen(false)}
                setTheme={setTheme}
                availableThemes={availableThemes}
                posts={posts}
            />

            {/* Snake Game Modal */}
            {snakeGameOpen && <SnakeGame onExit={() => setSnakeGameOpen(false)} />}

            {/* Status Bar */}
            <StatusBar muted={muted} onToggleMute={toggleMute} />

            {/* Main Content */}
            <div className="main-layout" style={{ flex: 1, display: 'flex', overflow: 'auto' }}>
                <main className="content-area" style={{ flex: 1, padding: '20px' }}>
                    {children}
                </main>
            </div>

            {/* Command Line Bar */}
            <CommandLine
                onKey={playKeySound}
                onCommand={handleCommand}
                setTheme={setTheme}
                availableThemes={availableThemes}
                posts={posts}
            />
        </div>
    );
}
