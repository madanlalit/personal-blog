import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import type { Post } from '../../types';
import type { Theme } from '../../hooks/useTheme';
import './Commander.css';

interface CommanderProps {
    isOpen: boolean;
    onClose: () => void;
    setTheme: (theme: Theme) => void;
    availableThemes: readonly Theme[];
    searchPosts: (query: string) => Post[];
    getAllPosts: () => Post[];
}

const Commander: React.FC<CommanderProps> = ({
    isOpen,
    onClose,
    setTheme,
    availableThemes,
    searchPosts,
    getAllPosts,
}) => {
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState<React.ReactNode[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const executeCommand = (cmd: string) => {
        const [commandName, ...args] = cmd.trim().split(' ');
        const argString = args.join(' ');
        let newOutput: React.ReactNode = null;

        switch (commandName) {
            case 'help':
                newOutput = (
                    <div>
                        <p>Available commands:</p>
                        <ul>
                            <li>`help` - Show this help message.</li>
                            <li>`theme` - List available themes.</li>
                            <li>`theme [theme_name]` - Set a new theme.</li>
                            <li>`list posts` - List all posts.</li>
                            <li>`search [query]` - Search posts by title or content.</li>
                            <li>`clear` - Clear the commander output.</li>
                            <li>`exit` - Close the commander.</li>
                        </ul>
                    </div>
                );
                break;
            case 'theme':
                if (argString && availableThemes.includes(argString as Theme)) {
                    setTheme(argString as Theme);
                    newOutput = `Theme set to: ${argString}`;
                } else if (argString) {
                    newOutput = `Theme '${argString}' not found.`;
                } else {
                    newOutput = `Available themes: ${availableThemes.join(', ')}`;
                }
                break;
            case 'list':
                if (args[0] === 'posts') {
                    const posts = getAllPosts();
                    newOutput = (
                        <ul className="commander-list">
                            {posts.map(p => (
                                <li key={p.id}><NavLink to={`/post/${p.id}`} onClick={onClose}>{p.title}</NavLink></li>
                            ))}
                        </ul>
                    );
                }
                break;
            case 'search':
                if (argString) {
                    const results = searchPosts(argString);
                    if (results.length > 0) {
                        newOutput = (
                            <div>
                                <p>Found {results.length} post(s) for "{argString}":</p>
                                <ul className="commander-list">
                                    {results.map(p => (
                                        <li key={p.id}><NavLink to={`/post/${p.id}`} onClick={onClose}>{p.title}</NavLink></li>
                                    ))}
                                </ul>
                            </div>
                        );
                    } else {
                        newOutput = `No posts found for "${argString}".`;
                    }
                } else {
                    newOutput = 'Usage: search [query]';
                }
                break;
            case 'clear':
                setOutput([]);
                return; // Prevent adding to output
            case 'exit':
            case 'close':
                onClose();
                return;
            default:
                newOutput = `Command not found: ${commandName}. Type 'help' for a list of commands.`;
        }
        setOutput(prev => [...prev, <div>&gt; {cmd}</div>, <div>{newOutput}</div>]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeCommand(command);
        setCommand('');
    };
    
    useEffect(() => {
        if (isOpen) {
            // Focus input when commander opens
            setTimeout(() => inputRef.current?.focus(), 100);
            // Show welcome message
            setOutput([<div>Welcome to Commander. Type 'help' for a list of commands.</div>]);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="commander-overlay" onClick={onClose}>
            <div className="commander-window" onClick={e => e.stopPropagation()}>
                <div className="sidebar-frame-top">╔════ COMMANDER ════╗</div>
                <div className="commander-output-area">
                    {output.map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                </div>
                <div className="commander-input-area">
                    <form onSubmit={handleSubmit}>
                        <span className="prompt">&gt;</span>
                        <input
                            ref={inputRef}
                            type="text"
                            className="commander-input"
                            value={command}
                            onChange={e => setCommand(e.target.value)}
                            autoComplete="off"
                        />
                    </form>
                </div>
                <div className="sidebar-frame-bottom">╚════ [ESC] TO CLOSE ════╝</div>
            </div>
        </div>
    );
};

export default Commander;