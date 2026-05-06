'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/components/hooks/useTheme';
import useSound from '@/components/hooks/useSound';
import CommandLine from '@/components/features/terminal/CommandLine';
import StatusBar from '@/components/ui/StatusBar';
import type { PostMeta } from '@/lib/types';
import '@/app/app.css';

const Commander = dynamic(() => import('@/components/features/terminal/Commander'), { ssr: false });
const SnakeGame = dynamic(() => import('@/components/features/terminal/SnakeGame'), { ssr: false });
const AudioPlayer = dynamic(() => import('@/components/features/terminal/AudioPlayer'), { ssr: false });

interface ClientShellProps {
    children: React.ReactNode;
    posts: PostMeta[];
}

export default function ClientShell({ children, posts }: ClientShellProps) {
    const [commanderOpen, setCommanderOpen] = useState(false);
    const [snakeGameOpen, setSnakeGameOpen] = useState(false);
    const [ampOpen, setAmpOpen] = useState(false);
    const { playHoverSound, playKeySound, toggleMute, muted } = useSound();
    const { setTheme, availableThemes } = useTheme();

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

    const handleCommand = (cmd: string) => {
        if (cmd === 'snake') {
            setSnakeGameOpen(true);
        }
        if (cmd === 'amp') {
            setAmpOpen(true);
        }
    };

    return (
        <>
            <div
                className="app tui-window fade-in"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {/* Commander Modal */}
                {commanderOpen && (
                    <Commander
                        isOpen={commanderOpen}
                        onClose={() => setCommanderOpen(false)}
                        setTheme={setTheme}
                        availableThemes={availableThemes}
                        posts={posts}
                    />
                )}

                {/* Snake Game Modal */}
                {snakeGameOpen && <SnakeGame onExit={() => setSnakeGameOpen(false)} />}

                {/* Audio Player */}
                {ampOpen && <AudioPlayer onExit={() => setAmpOpen(false)} />}

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
        </>
    );
}
