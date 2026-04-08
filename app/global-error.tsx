'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[GLOBAL_ERROR_BOUNDARY]', error);
    }, [error]);

    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    padding: 0,
                    backgroundColor: '#18191A',
                    color: '#D4D4D4',
                    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    WebkitFontSmoothing: 'antialiased',
                }}
            >
                <div
                    style={{
                        textAlign: 'center',
                        padding: '2.5rem',
                        maxWidth: '600px',
                    }}
                >
                    {/* ASCII art */}
                    <pre
                        style={{
                            color: '#FF5555',
                            fontSize: '0.7rem',
                            lineHeight: 1.2,
                            marginBottom: '2rem',
                            opacity: 0.85,
                        }}
                        aria-hidden="true"
                    >
{`  _  _______ ____  _   _ _____ _       ____   _    _   _ ___ ____
 | |/ / ____|  _ \\| \\ | | ____| |     |  _ \\ / \\  | \\ | |_ _/ ___|
 |   /|  _| | |_) |  \\| |  _| | |     | |_) / _ \\ |  \\| || | |
 | . \\| |___|  _ <| |\\  | |___| |___  |  __/ ___ \\| |\\  || | |___
 |_|\\_\\_____|_| \\_\\_| \\_|_____|_____| |_| /_/   \\_\\_| \\_|___\\____|`}
                    </pre>

                    <h1
                        style={{
                            fontSize: '1.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '1rem',
                            fontWeight: 700,
                        }}
                    >
                        <span style={{ color: '#FF5555', marginRight: '0.5rem' }}>
                            [KERNEL PANIC]
                        </span>
                        System Halted
                    </h1>

                    <p
                        style={{
                            color: '#8B949E',
                            fontSize: '0.875rem',
                            marginBottom: '0.5rem',
                            lineHeight: 1.6,
                        }}
                    >
                        {error.message || 'A critical error occurred in the application root.'}
                    </p>

                    {error.digest && (
                        <p
                            style={{
                                color: '#5C6370',
                                fontSize: '0.75rem',
                                marginBottom: '2rem',
                            }}
                        >
                            Error ID: {error.digest}
                        </p>
                    )}

                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <button
                            onClick={reset}
                            style={{
                                fontFamily: 'inherit',
                                fontSize: '0.875rem',
                                padding: '0.5rem 1.25rem',
                                border: '1px solid #A8B9A8',
                                background: 'transparent',
                                color: '#A8B9A8',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#A8B9A8';
                                e.currentTarget.style.color = '#18191A';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#A8B9A8';
                            }}
                        >
                            ↻ Reboot
                        </button>
                        <button
                            onClick={() => (window.location.href = '/')}
                            style={{
                                fontFamily: 'inherit',
                                fontSize: '0.875rem',
                                padding: '0.5rem 1.25rem',
                                border: '1px solid #3E4451',
                                background: '#202224',
                                color: '#D4D4D4',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#A8B9A8';
                                e.currentTarget.style.color = '#18191A';
                                e.currentTarget.style.borderColor = '#A8B9A8';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#202224';
                                e.currentTarget.style.color = '#D4D4D4';
                                e.currentTarget.style.borderColor = '#3E4451';
                            }}
                        >
                            ← Home
                        </button>
                    </div>

                    {/* Blinking cursor effect */}
                    <p
                        style={{
                            marginTop: '2.5rem',
                            color: '#5C6370',
                            fontSize: '0.75rem',
                        }}
                    >
                        {'>'} Waiting for operator input
                        <span
                            style={{
                                animation: 'blink 1s step-end infinite',
                                marginLeft: '2px',
                            }}
                        >
                            █
                        </span>
                    </p>

                    <style>{`
                        @keyframes blink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0; }
                        }
                    `}</style>
                </div>
            </body>
        </html>
    );
}
