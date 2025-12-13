import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Commander.css';

// Simple Tree Component
interface TreeItemProps {
    label: string;
    path?: string;
    isFolder?: boolean;
    children?: React.ReactNode;
    depth?: number;
    defaultOpen?: boolean;
    onNavigate?: () => void;
}

const TreeItem: React.FC<TreeItemProps> = ({ label, path, isFolder, children, depth = 0, defaultOpen = false, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const location = useLocation();
    const isActive = path ? location.pathname === path : false;

    const toggle = () => isFolder && setIsOpen(!isOpen);

    const handleClick = () => {
        if (isFolder) toggle();
        else if (onNavigate) onNavigate();
    };

    const prefix = isFolder ? (isOpen ? '[-]' : '[+]') : '├──';
    const indent = '│   '.repeat(depth);

    return (
        <div className="tree-item">
            <div
                className={`tree-label ${isActive ? 'active-file' : ''} ${isFolder ? 'folder' : ''}`}
                onClick={handleClick}
            >
                {indent}
                <span className="tree-prefix">{prefix} </span>
                {path ? (
                    <NavLink to={path} className={isActive ? 'active-link' : ''} onClick={onNavigate}>
                        {label}
                    </NavLink>
                ) : (
                    <span className="folder-name">{label}</span>
                )}
            </div>
            {isFolder && isOpen && <div className="tree-children">{children}</div>}
        </div>
    );
};

interface CommanderProps {
    isOpen: boolean;
    onClose: () => void;
}

const Commander: React.FC<CommanderProps> = ({ isOpen, onClose }) => {
    const [uptime, setUptime] = useState(0);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Fake uptime
    useEffect(() => {
        const interval = setInterval(() => setUptime(u => u + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="commander-overlay" onClick={onClose}>
            <div className="commander-window" onClick={e => e.stopPropagation()}>
                <div className="sidebar-frame-top">╔════ COMMANDER ════╗</div>

                <div className="fs-container">
                    <div className="fs-root">/ :: root</div>

                    {/* System Folder */}
                    <TreeItem label="system" isFolder defaultOpen>
                        <TreeItem label="config" path="/about" depth={1} onNavigate={onClose} />
                        <TreeItem label="audit.log" path="/contact" depth={1} onNavigate={onClose} />
                    </TreeItem>

                    {/* Content Folder */}
                    <TreeItem label="content" isFolder defaultOpen>
                        <TreeItem label="index.md" path="/" depth={1} onNavigate={onClose} />
                        <TreeItem label="journal" isFolder depth={1} defaultOpen>
                            <TreeItem label="archive/" path="/archive" depth={2} onNavigate={onClose} />
                        </TreeItem>
                    </TreeItem>
                </div>

                <div className="sys-dashboard">
                    <div className="sys-row">
                        <span>CPU:</span>
                        <div className="progress-bar"><div style={{ width: '12%' }}></div></div>
                        <span>12%</span>
                    </div>
                    <div className="sys-row">
                        <span>RAM:</span>
                        <div className="progress-bar"><div style={{ width: '45%' }}></div></div>
                        <span>64K</span>
                    </div>
                    <div className="sys-row">
                        <span>UP :</span>
                        <span>{formatUptime(uptime)}</span>
                    </div>
                </div>

                <div className="sidebar-frame-bottom">╚════ [ESC] TO CLOSE ════╝</div>
            </div>
        </div>
    );
};

export default Commander;
