'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error for debugging / future error reporting
        console.error('[ERROR_BOUNDARY]', error);
    }, [error]);

    return (
        <div className="error-boundary fade-in">
            <style>{`
                .error-boundary {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 60vh;
                    padding: var(--space-lg);
                    text-align: center;
                    font-family: var(--font-primary);
                    color: var(--text-primary);
                }

                .error-ascii {
                    font-size: var(--font-size-xs);
                    line-height: 1.2;
                    color: var(--color-error);
                    margin-bottom: var(--space-lg);
                    white-space: pre;
                    opacity: 0.85;
                }

                .error-header {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    margin-bottom: var(--space-md);
                    font-size: var(--font-size-subtitle);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .error-prefix {
                    color: var(--color-error);
                    font-weight: 700;
                }

                .error-message {
                    color: var(--text-secondary);
                    font-size: var(--font-size-small);
                    margin-bottom: var(--space-sm);
                    max-width: 500px;
                    word-break: break-word;
                }

                .error-digest {
                    color: var(--text-tertiary);
                    font-size: var(--font-size-xs);
                    margin-bottom: var(--space-lg);
                }

                .error-actions {
                    display: flex;
                    gap: var(--space-md);
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .error-btn {
                    font-family: var(--font-primary);
                    font-size: var(--font-size-small);
                    padding: var(--space-sm) var(--space-md);
                    border: 1px solid var(--border);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    transition: all 0.2s ease;
                }

                .error-btn:hover {
                    background: var(--accent);
                    color: var(--bg-primary);
                    border-color: var(--accent);
                }

                .error-btn--primary {
                    border-color: var(--accent);
                    color: var(--accent);
                }

                .error-btn--primary:hover {
                    background: var(--accent);
                    color: var(--bg-primary);
                }

                .error-log {
                    margin-top: var(--space-lg);
                    padding: var(--space-md);
                    border: 1px solid var(--border);
                    background: var(--bg-secondary);
                    max-width: 600px;
                    width: 100%;
                    text-align: left;
                }

                .error-log-header {
                    color: var(--text-tertiary);
                    font-size: var(--font-size-xs);
                    text-transform: uppercase;
                    margin-bottom: var(--space-sm);
                    letter-spacing: 0.1em;
                }

                .error-log-content {
                    color: var(--color-error);
                    font-size: var(--font-size-xs);
                    white-space: pre-wrap;
                    word-break: break-all;
                    max-height: 120px;
                    overflow-y: auto;
                    line-height: 1.5;
                }
            `}</style>

            <div className="error-ascii" aria-hidden="true">
{`  _____ ____  ____   ___  ____
 | ____|  _ \\|  _ \\ / _ \\|  _ \\
 |  _| | |_) | |_) | | | | |_) |
 | |___|  _ <|  _ <| |_| |  _ <
 |_____|_| \\_\\_| \\_\\\\___/|_| \\_\\`}
            </div>

            <div className="error-header">
                <span className="error-prefix">[FATAL]</span>
                <span>Process Crashed</span>
            </div>

            <p className="error-message">
                {error.message || 'An unexpected error occurred while rendering this page.'}
            </p>

            {error.digest && (
                <p className="error-digest">
                    Error ID: {error.digest}
                </p>
            )}

            <div className="error-actions">
                <button className="error-btn error-btn--primary" onClick={reset}>
                    ↻ Retry
                </button>
                <button
                    className="error-btn"
                    onClick={() => (window.location.href = '/')}
                >
                    ← Home
                </button>
            </div>

            {error.stack && (
                <div className="error-log">
                    <div className="error-log-header">── Stack Trace ──</div>
                    <div className="error-log-content">
                        {error.stack}
                    </div>
                </div>
            )}
        </div>
    );
}
