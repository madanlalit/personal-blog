'use client';

import { useEffect, useEffectEvent, useState } from 'react';
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

    const handleMouseOver = useEffectEvent((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.tagName === 'A' ||
            target.tagName === 'BUTTON' ||
            target.closest('.cli-tab')
        ) {
            playHoverSound();
        }
    });

    useEffect(() => {
        document.addEventListener('mouseover', handleMouseOver);
        return () => document.removeEventListener('mouseover', handleMouseOver);
    }, []);

    const handleGlobalKeyDown = useEffectEvent((e: KeyboardEvent) => {
        if (e.shiftKey && e.code === 'KeyM') {
            e.preventDefault();
            setCommanderOpen((prev) => !prev);
        }
    });

    useEffect(() => {
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    const handleCommand = (cmd: string) => {
        switch (cmd) {
            case 'snake':
                setSnakeGameOpen(true);
                break;
            case 'amp':
                setAmpOpen(true);
                break;
            default:
                break;
        }
    };

    return (
        <div className="app app-shell tui-window fade-in">
            {commanderOpen && (
                <Commander
                    isOpen={commanderOpen}
                    onClose={() => setCommanderOpen(false)}
                    setTheme={setTheme}
                    availableThemes={availableThemes}
                    posts={posts}
                />
            )}

            {snakeGameOpen && <SnakeGame onExit={() => setSnakeGameOpen(false)} />}

            {ampOpen && <AudioPlayer onExit={() => setAmpOpen(false)} />}

            <StatusBar muted={muted} onToggleMute={toggleMute} />

            <div className="main-layout app-shell__main">
                <main className="content-area">{children}</main>
            </div>

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
