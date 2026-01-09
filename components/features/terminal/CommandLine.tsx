'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { PostMeta } from '@/lib/types';
import type { Theme } from '@/components/hooks/useTheme';
import './CommandLine.css';

interface CommandLineProps {
    onKey?: () => void;
    onCommand?: (cmd: string) => void;
    setTheme: (theme: Theme) => void;
    availableThemes: readonly Theme[];
    posts: PostMeta[];
}

export default function CommandLine({
    onKey,
    onCommand,
    setTheme,
    availableThemes,
    posts,
}: CommandLineProps) {
    const [input, setInput] = useState('');
    const [displayHistory, setDisplayHistory] = useState<(string | React.ReactNode)[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tempInput, setTempInput] = useState('');
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();

    const searchPosts = (query: string) => {
        const q = query.toLowerCase();
        return posts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q)
        );
    };

    // Focus on '/'
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length === 0) return;
            if (historyIndex === -1) {
                setTempInput(input);
                setHistoryIndex(commandHistory.length - 1);
                setInput(commandHistory[commandHistory.length - 1]);
            } else if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                if (historyIndex < commandHistory.length - 1) {
                    const newIndex = historyIndex + 1;
                    setHistoryIndex(newIndex);
                    setInput(commandHistory[newIndex]);
                } else {
                    setHistoryIndex(-1);
                    setInput(tempInput);
                }
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (ghostText) {
                setInput(ghostText);
            } else if (suggestions.length > 0) {
                setInput(suggestions[selectedSuggestion]);
                setSelectedSuggestion(0);
            }
        } else if (e.key === 'ArrowRight' && ghostText) {
            e.preventDefault();
            setInput(ghostText);
        }
    };

    const { suggestions, ghostText } = useMemo(() => {
        if (!input) return { suggestions: [], ghostText: '' };

        const commands = ['help', 'cd', 'ls', 'theme', 'clear', 'reboot', 'snake', 'grep', 'neofetch', 'amp'];
        const args = ['home', 'about', 'archive', 'projects', 'experience', ...availableThemes];

        const parts = input.toLowerCase().split(' ');
        const hasSpace = input.includes(' ');

        let matches: string[] = [];

        if (hasSpace && parts.length >= 2) {
            const command = parts[0];
            const argPart = parts.slice(1).join(' ');

            if (['cd', 'theme'].includes(command)) {
                const relevantArgs = command === 'cd'
                    ? ['home', 'about', 'archive', 'projects', 'experience']
                    : [...availableThemes];

                matches = relevantArgs
                    .filter((arg) => arg.startsWith(argPart))
                    .map((arg) => `${command} ${arg}`);
            }
        } else {
            const allOptions = [...commands, ...args];
            matches = allOptions.filter((opt) => opt.startsWith(input.toLowerCase()));
        }

        return {
            suggestions: matches.slice(0, 5),
            ghostText: matches.length > 0 ? matches[0] : ''
        };
    }, [input, availableThemes]);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();
        if (!trimmed) return;

        setCommandHistory((prev) => [...prev, trimmed]);
        setHistoryIndex(-1);
        setTempInput('');

        const parts = trimmed.split(' ');
        const command = parts[0];
        const arg = parts.slice(1).join(' ');

        setDisplayHistory((prev) => [...prev.slice(-4), `> ${cmd}`]);

        switch (command) {
            case 'help': {
                setDisplayHistory((prev) => [
                    ...prev,
                    'Available commands:',
                    '  cd [page]   - Navigate (home, about, archive, projects, experience)',
                    '  grep [term] - Search blog posts',
                    `  theme [opt] - Set theme (${availableThemes.join(' | ')})`,
                    '  amp         - Launch Audio Player',
                    '  neofetch    - System Information',
                    '  snake       - Play Snake',
                    '  ls          - List directories',
                    '  reboot      - Reboot system',
                    '  clear       - Clear screen',
                ]);
                break;
            }
            case 'clear': {
                setDisplayHistory([]);
                break;
            }
            case 'reboot': {
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.removeItem('hasBooted');
                }
                window.location.reload();
                break;
            }
            case 'neofetch': {
                const info = (
                    <div className="neofetch-output" style={{ display: 'flex', gap: '20px', margin: '10px 0', color: 'var(--accent)' }}>
                        <pre style={{ margin: 0, lineHeight: 1.2, fontWeight: 'bold' }}>
                            {`
    __________
   |  ______  |
   | |      | |
   | |______| |
   |__________|
   /__________\\
  (____________)
`}
                        </pre>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div><strong style={{ color: 'var(--text-primary)' }}>OS:</strong> NextReactOS v16.0</div>
                            <div><strong style={{ color: 'var(--text-primary)' }}>Framework:</strong> Next.js App Router</div>
                            <div><strong style={{ color: 'var(--text-primary)' }}>Theme:</strong> {typeof localStorage !== 'undefined' ? localStorage.getItem('app-theme') || 'openai' : 'openai'}</div>
                            <div><strong style={{ color: 'var(--text-primary)' }}>Shell:</strong> ReactCLI</div>
                        </div>
                    </div>
                );
                setDisplayHistory((prev) => [...prev, info]);
                break;
            }
            case 'grep': {
                if (!arg) {
                    setDisplayHistory((prev) => [...prev, 'Usage: grep [search term]']);
                    break;
                }
                const results = searchPosts(arg);
                if (results.length === 0) {
                    setDisplayHistory((prev) => [...prev, `grep: ${arg}: No matches found`]);
                } else {
                    const resultNodes = results.map((p) => (
                        <div key={p.id} style={{ margin: '4px 0' }}>
                            <span style={{ color: 'var(--accent)' }}>./archive/{p.date}:</span>{' '}
                            <button
                                onClick={() => router.push(`/post/${p.slug}`)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {p.title}
                            </button>
                        </div>
                    ));
                    setDisplayHistory((prev) => [...prev, ...resultNodes]);
                }
                break;
            }
            case 'cd': {
                if (!arg || arg === 'home') router.push('/');
                else if (['about', 'archive', 'projects', 'experience'].includes(arg)) router.push(`/${arg}`);
                else {
                    setDisplayHistory((prev) => [...prev, `Error: Directory '${arg}' not found`]);
                }
                break;
            }
            case 'ls': {
                setDisplayHistory((prev) => [...prev, 'home/  about/  archive/  projects/  experience/']);
                break;
            }
            case 'theme': {
                if (availableThemes.includes(arg as Theme)) {
                    setTheme(arg as Theme);
                    setDisplayHistory((prev) => [...prev, `Theme set to ${arg}`]);
                } else {
                    setDisplayHistory((prev) => [...prev, `Usage: theme [${availableThemes.join(' | ')}]`]);
                }
                break;
            }
            case 'snake': {
                if (onCommand) onCommand('snake');
                break;
            }
            case 'amp': {
                if (onCommand) onCommand('amp');
                else setDisplayHistory((prev) => [...prev, 'Amp Audio Player starting...']);
                break;
            }
            default: {
                if (onCommand) onCommand(command);
                if (command !== 'snake' && command !== 'amp') {
                    if (trimmed !== '') setDisplayHistory((prev) => [...prev, `Command not found: ${command}`]);
                }
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput('');
    };

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [displayHistory]);

    return (
        <div className="cli-wrapper">
            <div className={`command-line-container ${input ? 'focused' : ''}`} onClick={() => inputRef.current?.focus()}>
                {displayHistory.length > 0 && (
                    <div className="cli-history" ref={historyRef}>
                        {displayHistory.map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="cli-form">
                    <span className="prompt">user@blog:~$</span>
                    <div className="cli-input-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            className="cli-input"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                if (onKey) onKey();
                            }}
                            onKeyDown={handleInputKeyDown}
                            spellCheck="false"
                            autoComplete="off"
                        />
                        {ghostText && input && ghostText.startsWith(input) && (
                            <span className="cli-ghost-text">
                                {input}
                                <span className="ghost-suggestion">{ghostText.slice(input.length)}</span>
                            </span>
                        )}
                    </div>
                    <div className="cli-badge">CMD</div>
                </form>
                {suggestions.length > 0 && (
                    <div className="cli-suggestions">
                        {suggestions.map((suggestion, idx) => (
                            <div
                                key={suggestion}
                                className={`suggestion-item ${idx === selectedSuggestion ? 'selected' : ''}`}
                                onClick={() => {
                                    setInput(suggestion);
                                    inputRef.current?.focus();
                                }}
                            >
                                <span className="suggestion-icon">▶</span>
                                <span className="suggestion-text">{suggestion}</span>
                                {idx === 0 && <span className="suggestion-hint">Tab</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="cli-tabs">
                <button className={`cli-tab ${pathname === '/' ? 'active' : ''}`} onClick={() => router.push('/')} title="Navigate to Home (Alt+1)">
                    <span className="tab-key">1</span> HOME
                </button>
                <button className={`cli-tab ${pathname === '/archive' ? 'active' : ''}`} onClick={() => router.push('/archive')} title="Navigate to Archive (Alt+2)">
                    <span className="tab-key">2</span> ARCHIVE
                </button>
                <button className={`cli-tab ${pathname === '/about' ? 'active' : ''}`} onClick={() => router.push('/about')} title="Navigate to About (Alt+3)">
                    <span className="tab-key">3</span> ABOUT
                </button>
                <button className={`cli-tab ${pathname === '/projects' ? 'active' : ''}`} onClick={() => router.push('/projects')} title="Navigate to Projects (Alt+4)">
                    <span className="tab-key">4</span> PROJECTS
                </button>

                <div className="tab-spacer"></div>

                <button className="cli-tab action-tab" onClick={() => window.open('https://github.com/madanlalit', '_blank')} title="Open GitHub profile">
                    GITHUB
                </button>
                <button className="cli-tab action-tab" onClick={() => window.open('https://linkedin.com/in/madanlalit', '_blank')} title="Open LinkedIn profile">
                    LINKEDIN
                </button>
                <button className="cli-tab action-tab" onClick={() => window.open('https://x.com/lalitmadan', '_blank')} title="Open X (Twitter) profile">
                    X
                </button>
            </div>
        </div>
    );
}
