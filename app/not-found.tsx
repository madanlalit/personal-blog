import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="not-found fade-in">
            <style>{`
                .not-found {
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

                .not-found-code {
                    font-size: clamp(4rem, 10vw, 8rem);
                    font-weight: 700;
                    color: var(--text-tertiary);
                    line-height: 1;
                    margin-bottom: var(--space-md);
                    letter-spacing: 0.1em;
                    opacity: 0.6;
                }

                .not-found-header {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    margin-bottom: var(--space-md);
                    font-size: var(--font-size-subtitle);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .not-found-prefix {
                    color: var(--color-error);
                    font-weight: 700;
                }

                .not-found-message {
                    color: var(--text-secondary);
                    font-size: var(--font-size-small);
                    margin-bottom: var(--space-lg);
                    max-width: 420px;
                    line-height: 1.6;
                }

                .not-found-suggestion {
                    color: var(--text-tertiary);
                    font-size: var(--font-size-xs);
                    margin-bottom: var(--space-lg);
                    text-align: left;
                    max-width: 400px;
                }

                .not-found-suggestion code {
                    color: var(--accent);
                }

                .not-found-link {
                    font-family: var(--font-primary);
                    font-size: var(--font-size-small);
                    padding: var(--space-sm) var(--space-md);
                    border: 1px solid var(--accent);
                    background: transparent;
                    color: var(--accent);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: inline-block;
                }

                .not-found-link:hover {
                    background: var(--accent);
                    color: var(--bg-primary);
                }
            `}</style>

            <div className="not-found-code" aria-hidden="true">404</div>

            <div className="not-found-header">
                <span className="not-found-prefix">[ERROR]</span>
                <span>Path Not Found</span>
            </div>

            <p className="not-found-message">
                The requested resource does not exist on this system.
                It may have been moved or deleted.
            </p>

            <div className="not-found-suggestion">
                <p>Try one of these commands:</p>
                <p>  <code>cd /</code> — return to home</p>
                <p>  <code>ls /posts</code> — browse all posts</p>
                <p>  <code>ls /projects</code> — view work</p>
            </div>

            <Link href="/" className="not-found-link">
                ← cd ~
            </Link>
        </div>
    );
}
