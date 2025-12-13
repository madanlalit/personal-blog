import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { triggerAlert } from '../../features/system/SystemAlert';
import { mockPosts } from '../../data/mockData';
import './CommandLine.css';

interface CommandLineProps {
    onKey?: () => void;
    onCommand?: (cmd: string) => void;
}

const CommandLine: React.FC<CommandLineProps> = ({ onKey, onCommand }) => {
    const [input, setInput] = useState('');
    const [displayHistory, setDisplayHistory] = useState<(string | React.ReactNode)[]>([]); // Visual output
    const [commandHistory, setCommandHistory] = useState<string[]>([]); // Executed commands
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [tempInput, setTempInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Focus on '/'
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // History Navigation
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
        }

        // Autocomplete
        else if (e.key === 'Tab') {
            e.preventDefault();
            const commands = ['help', 'cd', 'ls', 'theme', 'clear', 'reboot', 'snake', 'grep', 'neofetch', 'amp'];
            const args = ['home', 'about', 'archive', 'sage', 'amber', 'dracula', 'light', 'cyan'];
            const allOptions = [...commands, ...args];

            const match = allOptions.find(opt => opt.startsWith(input.toLowerCase()));
            if (match) {
                setInput(match + ' ');
            }
        }
    };

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();
        if (!trimmed) return;

        setCommandHistory(prev => [...prev, trimmed]); // Add to history
        setHistoryIndex(-1); // Reset index
        setTempInput('');

        const parts = trimmed.split(' ');
        const command = parts[0];
        const arg = parts.slice(1).join(' '); // Join remaining parts

        setDisplayHistory(prev => [...prev.slice(-4), `> ${cmd}`]);

        switch (command) {
            case 'help':
                setDisplayHistory(prev => [...prev,
                    'Available commands:',
                    '  cd [page]   - Navigate (home, about, archive)',
                    '  grep [term] - Search blog posts',
                    '  theme [opt] - Set theme (sage, amber, dracula, cyan, openai)',
                    '  amp         - Launch Audio Player',
                    '  neofetch    - System Information',
                    '  snake       - Play Snake',
                    '  ls          - List directories',
                    '  reboot      - Reboot system',
                    '  clear       - Clear screen'
                ]);
                break;
            case 'clear':
                setDisplayHistory([]);
                break;
            case 'reboot':
                sessionStorage.removeItem('hasBooted');
                window.location.reload();
                break;
            case 'neofetch':
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
                            <div><strong style={{ color: 'var(--text-primary)' }}>OS:</strong> RetroReactOS v1.0</div>
                            <div><strong style={{ color: 'var(--text-primary)' }}>Host:</strong> {navigator.userAgent}</div>
                            <div><strong style={{ color: 'var(--text-primary)' }}>Theme:</strong> {localStorage.getItem('theme') || 'openai'} / flat</div>
                            <div><strong style={{ color: 'var(--text-primary)' }}>Uptime:</strong> Forever</div>
                            <div><strong style={{ color: 'var(--text-primary)' }}>Shell:</strong> ReactCLI</div>
                        </div>
                    </div>
                );
                setDisplayHistory(prev => [...prev, info]);
                break;
            case 'grep':
                if (!arg) {
                    setDisplayHistory(prev => [...prev, 'Usage: grep [search term]']);
                    break;
                }
                const results = mockPosts.filter(p =>
                    p.title.toLowerCase().includes(arg) ||
                    p.content.toLowerCase().includes(arg) ||
                    p.tags?.some(t => t.toLowerCase().includes(arg))
                );

                if (results.length === 0) {
                    setDisplayHistory(prev => [...prev, `grep: ${arg}: No matches found`]);
                } else {
                    const resultNodes = results.map(p => (
                        <div key={p.id} style={{ margin: '4px 0' }}>
                            <span style={{ color: 'var(--accent)' }}>./archive/{p.date}:</span>{' '}
                            <button
                                onClick={() => navigate(`/post/${p.id}`)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontFamily: 'inherit'
                                }}
                            >
                                {p.title}
                            </button>
                        </div>
                    ));
                    setDisplayHistory(prev => [...prev, ...resultNodes]);
                }
                break;
            case 'cd':
                if (!arg || arg === 'home') navigate('/');
                else if (['about', 'archive', 'contact'].includes(arg)) navigate(`/${arg}`);
                else {
                    setDisplayHistory(prev => [...prev, `Error: Directory '${arg}' not found`]);
                    triggerAlert(`Directory '${arg}' not found`, 'warning');
                }
                break;
            case 'ls':
                setDisplayHistory(prev => [...prev, 'home/  about/  archive/  contact/']);
                break;
            case 'theme':
                if (['amber', 'dracula', 'sage', 'light', 'cyan', 'matrix', 'openai'].includes(arg)) {
                    document.documentElement.setAttribute('data-theme', arg);
                    localStorage.setItem('theme', arg);
                    setDisplayHistory(prev => [...prev, `Theme set to ${arg}`]);
                    triggerAlert(`Theme updated to ${arg}`, 'success');
                } else {
                    setDisplayHistory(prev => [...prev, 'Usage: theme [sage | amber | cyan | dracula | light | openai]']);
                }
                break;
            case 'snake':
                if (onCommand) onCommand('snake');
                break;
            case 'amp':
                if (onCommand) onCommand('amp'); // Delegate to App
                else setDisplayHistory(prev => [...prev, 'Amp Audio Player starting...']);
                break;
            default:
                if (onCommand) {
                    onCommand(command);
                }
                if (command !== 'snake' && command !== 'amp') {
                    if (trimmed !== '') setDisplayHistory(prev => [...prev, `Command not found: ${command}`]);
                }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput('');
    };

    const historyRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of history
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
                    <input
                        ref={inputRef}
                        type="text"
                        className="cli-input"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            onKey && onKey();
                        }}
                        onKeyDown={handleInputKeyDown}
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                    />
                    <div className="status-right">
                        [ CMD ]
                    </div>
                </form>
            </div>

            {/* Bottom Tabs navigation - BELOW input to prevent covering */}
            <div className="cli-tabs">
                <button
                    className={`cli-tab ${window.location.pathname === '/' ? 'active' : ''}`}
                    onClick={() => navigate('/')}
                >
                    [1: TERMINAL]
                </button>
                <button
                    className={`cli-tab ${window.location.pathname === '/archive' ? 'active' : ''}`}
                    onClick={() => navigate('/archive')}
                >
                    [2: ARCHIVE]
                </button>
                <button
                    className={`cli-tab ${window.location.pathname === '/about' ? 'active' : ''}`}
                    onClick={() => navigate('/about')}
                >
                    [3: ABOUT]
                </button>

                <button
                    className={`cli-tab ${input.startsWith('grep') ? 'active' : ''}`}
                    onClick={() => {
                        setInput('grep ');
                        inputRef.current?.focus();
                    }}
                >
                    SEARCH
                </button>

                {/* Spacer to push social links to the right */}
                <div style={{ flex: 1 }}></div>

                {/* Social Links */}
                <button className="cli-tab action-tab" onClick={() => window.open('https://github.com/madanlalit', '_blank')}>
                    GITHUB
                </button>
                <button className="cli-tab action-tab" onClick={() => window.open('https://linkedin.com/in/madanlalit', '_blank')}>
                    LINKEDIN
                </button>
                <button className="cli-tab action-tab" style={{ borderRight: 'none' }} onClick={() => window.open('https://x.com/lalitmadan', '_blank')}>
                    X
                </button>
            </div>
        </div>
    );
};

export default CommandLine;
