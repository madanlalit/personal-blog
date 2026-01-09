'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/hooks/useTheme';
import useSound from '@/components/hooks/useSound';
import useKonamiCode from '@/components/hooks/useKonamiCode';
import Commander from '@/components/features/terminal/Commander';
import StatusBar from '@/components/ui/StatusBar';
import type { PostMeta } from '@/lib/types';
import '@/app/app.css';

interface ClientShellProps {
    children: React.ReactNode;
    posts: PostMeta[];
}

export default function ClientShell({ children, posts }: ClientShellProps) {
    const [commanderOpen, setCommanderOpen] = useState(false);
    const { playHoverSound, toggleMute, muted } = useSound();
    const { setTheme, availableThemes } = useTheme();

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

            {/* Status Bar */}
            <StatusBar muted={muted} onToggleMute={toggleMute} />

            {/* Main Content */}
            <div className="main-layout" style={{ flex: 1, display: 'flex', overflow: 'auto' }}>
                <main className="content-area" style={{ flex: 1, padding: '20px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
