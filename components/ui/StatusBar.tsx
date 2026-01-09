import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './StatusBar.css';

interface StatusBarProps {
    muted: boolean;
    onToggleMute: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ muted, onToggleMute }) => {
    const location = useLocation();
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('NORMAL');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Simple heuristic for "INSERT" mode (focusing inputs) vs "NORMAL"
    useEffect(() => {
        const handleFocus = (e: FocusEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
                setMode('INSERT');
            }
        };
        const handleBlur = () => setMode('NORMAL');

        window.addEventListener('focus', handleFocus, true);
        window.addEventListener('blur', handleBlur, true);
        return () => {
            window.removeEventListener('focus', handleFocus, true);
            window.removeEventListener('blur', handleBlur, true);
        };
    }, []);

    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        // Find the scrollable content area
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = contentArea;
            if (scrollHeight <= clientHeight) {
                setScrollPercent(100);
            } else {
                const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
                setScrollPercent(Math.round(scrolled));
            }
        };

        contentArea.addEventListener('scroll', handleScroll);
        // Trigger once to set initial state
        handleScroll();

        return () => contentArea.removeEventListener('scroll', handleScroll);
    }, [location.pathname]); // Re-attach/reset on route change

    const formatPath = (path: string) => {
        if (path === '/') return '~';
        return `~${path}`;
    };

    return (
        <div className="tui-status-bar top">
            <div className="status-left">
                <span className="status-item mode-indicator" data-mode={mode}>
                    {mode}
                </span>
                <span className="status-separator">│</span>
                <span className="status-item status-path">
                    {formatPath(location.pathname)}
                </span>
            </div>

            <div className="status-right">
                <span className="status-item status-scroll">
                    {scrollPercent === 0 ? '⬆ TOP' : scrollPercent === 100 ? '⬇ BOT' : `${scrollPercent}%`}
                </span>
                <span className="status-separator">│</span>
                <span className="status-item status-time">
                    {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="status-separator">│</span>
                <button
                    onClick={onToggleMute}
                    className={`status-button ${muted ? 'muted' : 'active'}`}
                    title={muted ? 'Unmute audio' : 'Mute audio'}
                >
                    [{muted ? 'MUTE' : 'AUDIO'}]
                </button>
            </div>
        </div>
    );
};

export default StatusBar;
